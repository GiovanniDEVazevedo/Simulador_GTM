import { randomUUID } from "node:crypto";
import {
  AppError,
  permit,
  validate,
  idSchema,
  memberSchema,
  expectedRevision,
  publicCatalog,
  serializeContent,
} from "./domain.mjs";
import { transaction } from "./db.mjs";

export function contentService(db) {
  const audit = (tx, actor, action, id, detail = {}) =>
    tx.query(
      "INSERT INTO control_audit(actor,action,content_id,detail) VALUES ($1,$2,$3,$4)",
      [actor.email, action, id, JSON.stringify(detail)],
    );
  async function remember(tx, row, action, actor) {
    await tx.query(
      "INSERT INTO control_revisions(content_id,revision,data,action,actor) VALUES ($1,$2,$3,$4,$5)",
      [row.id, row.revision, JSON.stringify(row.draft), action, actor.email],
    );
    await audit(tx, actor, action, row.id, { revision: row.revision });
    return serializeContent(row);
  }
  async function locked(tx, id, revision) {
    const { rows } = await tx.query(
      "SELECT * FROM control_content WHERE id=$1 FOR UPDATE",
      [id],
    );
    const row = rows[0];
    if (!row) throw new AppError(404, "Conteúdo não encontrado.");
    if (row.revision !== expectedRevision(revision))
      throw new AppError(
        409,
        "Outra pessoa alterou este conteúdo. Reabra a versão atual antes de salvar.",
      );
    return row;
  }
  async function checkReferences(tx, row) {
    const refs =
      row.type === "trail"
        ? [
            ...row.draft.questionIds.map((id) => [id, "question"]),
            ...row.draft.activityIds.map((id) => [id, "activity"]),
            ...row.draft.prerequisites.map((id) => [id, "trail"]),
          ]
        : row.type === "activity"
          ? row.draft.questionIds.map((id) => [id, "question"])
          : [];
    for (const [id, type] of refs) {
      if (id === row.id)
        throw new AppError(422, "Uma trilha não pode exigir a si mesma.");
      const r = await tx.query(
        "SELECT published,type FROM control_content WHERE id=$1",
        [id],
      );
      if (!r.rows[0]?.published || r.rows[0].type !== type)
        throw new AppError(
          422,
          `Publique primeiro a referência ${id} (${type}).`,
        );
    }
    if (row.type === "trail") {
      const { rows } = await tx.query(
        "SELECT id,published FROM control_content WHERE type='trail' AND published IS NOT NULL",
      );
      const graph = new Map(
        rows.map((r) => [r.id, r.published.prerequisites || []]),
      );
      graph.set(row.id, row.draft.prerequisites);
      const visited = new Set();
      function visit(id, path = new Set()) {
        if (path.has(id))
          throw new AppError(
            422,
            "Os pré-requisitos das trilhas formam um ciclo.",
          );
        if (visited.has(id)) return;
        const next = new Set(path).add(id);
        for (const dep of graph.get(id) || []) visit(dep, next);
        visited.add(id);
      }
      visit(row.id);
    }
    if (row.type === "question") {
      const { rows } = await tx.query(
        "SELECT id,published FROM control_content WHERE type='question' AND published IS NOT NULL AND id<>$1",
        [row.id],
      );
      for (const other of rows)
        for (const ref of other.published.sources)
          for (const source of row.draft.sources)
            if (ref.id === source.id && ref.url !== source.url)
              throw new AppError(
                422,
                `O ID de fonte ${ref.id} já aponta para outra URL.`,
              );
    }
  }
  return {
    async member(user) {
      if (!user?.id || !user.email) return null;
      if (user.emailVerified !== true)
        throw new AppError(
          403,
          "Verifique seu e-mail antes de acessar a central.",
        );
      const { rows } = await db.query(
        "SELECT * FROM control_members WHERE email=$1 AND enabled=true",
        [user.email.toLowerCase()],
      );
      return rows[0] ? { ...rows[0], userId: user.id } : null;
    },
    async list(actor, { type, query = "", status } = {}) {
      permit(actor, "read");
      const result = await db.query(
        "SELECT * FROM control_content WHERE ($1::text IS NULL OR type=$1) AND ($2::text IS NULL OR status=$2) AND (id ILIKE $3 OR draft::text ILIKE $3) ORDER BY updated_at DESC,id LIMIT 600",
        [type || null, status || null, "%" + query.slice(0, 120) + "%"],
      );
      return result.rows.map(serializeContent);
    },
    async get(actor, id) {
      permit(actor, "read");
      const { rows } = await db.query(
        "SELECT * FROM control_content WHERE id=$1",
        [id],
      );
      if (!rows[0]) throw new AppError(404, "Conteúdo não encontrado.");
      const versions = await db.query(
        "SELECT revision,action,actor,created_at,data FROM control_revisions WHERE content_id=$1 ORDER BY revision DESC LIMIT 40",
        [id],
      );
      return { ...serializeContent(rows[0]), versions: versions.rows };
    },
    async create(actor, { type, data, id }) {
      permit(actor, "write");
      if (data?.legacyId)
        throw new AppError(
          422,
          "A chave de progresso legado é reservada à importação.",
        );
      const draft = validate(type, data);
      id = id || `${type}-${randomUUID().slice(0, 12)}`;
      if (!idSchema.safeParse(id).success)
        throw new AppError(422, "ID inválido.");
      return transaction(db, async (tx) => {
        await tx.query(
          "SELECT value FROM control_settings WHERE id='catalog_version' FOR UPDATE",
        );
        const exists = await tx.query(
          "SELECT id FROM control_content WHERE id=$1",
          [id],
        );
        if (exists.rows.length)
          throw new AppError(409, "Este ID já existe e deve ser preservado.");
        const r = await tx.query(
          "INSERT INTO control_content(id,type,draft,created_by,updated_by) VALUES ($1,$2,$3,$4,$4) RETURNING *",
          [id, type, JSON.stringify(draft), actor.email],
        );
        return remember(tx, r.rows[0], "created", actor);
      });
    },
    async update(actor, id, { data, revision }) {
      permit(actor, "write");
      return transaction(db, async (tx) => {
        const row = await locked(tx, id, revision);
        if (row.status === "archived")
          throw new AppError(
            409,
            "Restaure uma revisão antes de editar um item arquivado.",
          );
        const draft = validate(row.type, data);
        if (draft.legacyId !== row.draft.legacyId)
          throw new AppError(422, "Preserve a chave de progresso legado.");
        const r = await tx.query(
          "UPDATE control_content SET draft=$2,status='draft',revision=revision+1,updated_by=$3,updated_at=now() WHERE id=$1 RETURNING *",
          [id, JSON.stringify(draft), actor.email],
        );
        return remember(tx, r.rows[0], "edited", actor);
      });
    },
    async transition(actor, id, { action, revision, restoreRevision }) {
      permit(
        actor,
        action === "publish" || action === "archive"
          ? "publish"
          : action === "review"
            ? "review"
            : "write",
      );
      if (!["publish", "archive", "review", "restore"].includes(action))
        throw new AppError(422, "Ação inválida.");
      return transaction(db, async (tx) => {
        // All publication graph changes share this lock, so simultaneous publishes/archives cannot create broken references.
        await tx.query(
          "SELECT value FROM control_settings WHERE id='catalog_version' FOR UPDATE",
        );
        const row = await locked(tx, id, revision);
        let status = row.status;
        let draft = row.draft;
        let published = row.published;
        let pubRevision = row.published_revision;
        if (action === "publish") {
          if (row.status !== "in_review")
            throw new AppError(
              409,
              "Envie a versão atual para revisão antes de publicar.",
            );
          validate(row.type, draft);
          await checkReferences(tx, row);
          status = "published";
          published = draft;
          pubRevision = row.revision + 1;
        }
        if (action === "review") {
          if (row.status !== "draft")
            throw new AppError(
              409,
              "Apenas rascunhos podem ser enviados para revisão.",
            );
          status = "in_review";
        }
        if (action === "archive") {
          const r = await tx.query(
            "SELECT id,type,published FROM control_content WHERE published IS NOT NULL AND id<>$1",
            [id],
          );
          for (const item of r.rows) {
            const refs = [
              ...(item.published.questionIds || []),
              ...(item.published.activityIds || []),
              ...(item.published.prerequisites || []),
            ];
            if (refs.includes(id))
              throw new AppError(
                409,
                `Atualize ou arquive primeiro ${item.id}, que usa este conteúdo.`,
              );
          }
          status = "archived";
          published = null;
          pubRevision = null;
        }
        if (action === "restore") {
          expectedRevision(restoreRevision);
          const { rows } = await tx.query(
            "SELECT data FROM control_revisions WHERE content_id=$1 AND revision=$2",
            [id, restoreRevision],
          );
          if (!rows[0]) throw new AppError(404, "Revisão não encontrada.");
          draft = validate(row.type, rows[0].data);
          status = "draft";
        }
        const r = await tx.query(
          "UPDATE control_content SET draft=$2,published=$3,status=$4,published_revision=$5,revision=revision+1,updated_by=$6,updated_at=now() WHERE id=$1 RETURNING *",
          [
            id,
            JSON.stringify(draft),
            published ? JSON.stringify(published) : null,
            status,
            pubRevision,
            actor.email,
          ],
        );
        if (action === "publish" || action === "archive")
          await tx.query(
            "UPDATE control_settings SET value=to_jsonb((value::text::integer)+1) WHERE id='catalog_version'",
          );
        return remember(tx, r.rows[0], action, actor);
      });
    },
    async catalog() {
      return transaction(db, async (tx) => {
        await tx.query(
          "SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY",
        );
        const { rows } = await tx.query(
          "SELECT id,type,published,published_revision FROM control_content WHERE published IS NOT NULL ORDER BY created_at,id",
        );
        const result = await tx.query(
          "SELECT value FROM control_settings WHERE id='catalog_version'",
        );
        return publicCatalog(rows, Number(result.rows[0].value));
      });
    },
    async audit(actor) {
      permit(actor, "read");
      return (
        await db.query("SELECT * FROM control_audit ORDER BY id DESC LIMIT 100")
      ).rows;
    },
    async members(actor) {
      permit(actor, "members");
      return (
        await db.query(
          "SELECT * FROM control_members ORDER BY created_at,email",
        )
      ).rows;
    },
    async saveMember(actor, input) {
      permit(actor, "members");
      const r = memberSchema.safeParse(input);
      if (!r.success)
        throw new AppError(
          422,
          "Informe nome, e-mail, perfil e estado válidos.",
        );
      const m = r.data;
      return transaction(db, async (tx) => {
        await tx.query(
          "SELECT value FROM control_settings WHERE id='catalog_version' FOR UPDATE",
        );
        const rows = (
          await tx.query(
            "SELECT email FROM control_members WHERE role='admin' AND enabled=true FOR UPDATE",
          )
        ).rows;
        if (
          rows.length === 1 &&
          rows[0].email === m.email &&
          (m.role !== "admin" || !m.enabled)
        )
          throw new AppError(409, "Mantenha ao menos um administrador ativo.");
        await tx.query(
          "INSERT INTO control_members(email,name,role,enabled) VALUES ($1,$2,$3,$4) ON CONFLICT(email) DO UPDATE SET name=excluded.name,role=excluded.role,enabled=excluded.enabled",
          [m.email, m.name, m.role, m.enabled],
        );
        await audit(tx, actor, "member_changed", null, {
          email: m.email,
          role: m.role,
          enabled: m.enabled,
        });
        return m;
      });
    },
  };
}
