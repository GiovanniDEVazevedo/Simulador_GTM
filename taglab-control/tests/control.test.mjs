import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentService } from "../lib/service.mjs";
import { createAPI } from "../lib/http.mjs";
import { validate, AppError, publicCatalog } from "../lib/domain.mjs";
import { seed } from "../scripts/seed.mjs";
let pg, db, service;
const admin = { email: "owner@taglab.example", role: "admin" },
  author = { email: "author@taglab.example", role: "author" },
  reviewer = { email: "reviewer@taglab.example", role: "reviewer" };
const valid = {
  question: "Qual ferramenta permite organizar o disparo de tags?",
  topic: "gtm",
  level: "basico",
  kind: "conceito",
  tools: ["GTM"],
  options: ["Google Tag Manager", "Planilha de pedidos"],
  correct: 0,
  explanation: "O Google Tag Manager configura tags, acionadores e variáveis.",
  impact: "Permite separar o disparo da tag da implementação do site.",
  sources: [
    {
      id: "gtm-doc",
      title: "Documentação GTM",
      url: "https://developers.google.com/tag-platform/tag-manager",
      publisher: "Google",
      reviewedAt: "2026-11-06",
    },
  ],
  reviewedAt: "2026-11-06",
  scope: "laboratorio",
};
let sequence = 0;
const question = async (actor = author, data = {}) =>
  service.create(actor, {
    id: "test-question-" + ++sequence,
    type: "question",
    data: { ...valid, ...data },
  });
async function publish(row) {
  row = await service.transition(author, row.id, {
    action: "review",
    revision: row.revision,
  });
  return service.transition(reviewer, row.id, {
    action: "publish",
    revision: row.revision,
  });
}
before(async () => {
  pg = new PGlite();
  const query = (text, values) => pg.query(text, values);
  db = { query, connect: async () => ({ query, release() {} }) };
  await pg.exec(
    await readFile(new URL("../db/001-initial.sql", import.meta.url), "utf8"),
  );
  service = contentService(db);
  await seed(db, admin.email);
  await db.query(
    "INSERT INTO control_members(email,role) VALUES($1,'author'),($2,'reviewer')",
    [author.email, reviewer.email],
  );
});
after(async () => {
  await pg.close();
});
test("importa 96 questões, 16 atividades e cinco trilhas com IDs preservados", async () => {
  const catalog = await service.catalog();
  assert.equal(catalog.questions.length, 96);
  assert.equal(catalog.activities.length, 16);
  assert.equal(catalog.trails.length, 5);
  assert(catalog.questions.some((q) => q.id === "oci-key"));
  assert(
    catalog.activities.some(
      (q) => q.id === "activity-oci" && q.legacyId === "oci",
    ),
  );
  assert.equal(catalog.questions.find((q) => q.id === "oci-key").correct, 1);
  assert.equal(Object.keys(catalog.sources).length, 39);
});
test("importação repetida não substitui conteúdo nem duplica IDs", async () => {
  assert.equal(await seed(db, admin.email), 0);
  assert.equal((await service.catalog()).questions.length, 96);
});
test("rascunhos ficam fora da API pública", async () => {
  const row = await question();
  assert(!(await service.catalog()).questions.some((x) => x.id === row.id));
});
test("autor não publica por chamada direta", async () => {
  const row = await question();
  await assert.rejects(
    service.transition(author, row.id, {
      action: "publish",
      revision: row.revision,
    }),
    (e) => e.status === 403,
  );
});
test("nem administrador publica sem enviar para revisão", async () => {
  const row = await question();
  await assert.rejects(
    service.transition(admin, row.id, {
      action: "publish",
      revision: row.revision,
    }),
    (e) => e.status === 409,
  );
});
test("revisão seguida de publicação entrega a pergunta e o gabarito de estudo", async () => {
  const row = await publish(await question());
  const q = (await service.catalog()).questions.find((x) => x.id === row.id);
  assert.equal(q.correct, 0);
  assert.equal(q.contentRevision, row.revision);
});
test("editar mantém a publicação anterior até uma nova aprovação", async () => {
  let row = await publish(await question());
  const original = row.published.question;
  row = await service.update(author, row.id, {
    data: {
      ...row.draft,
      question: "Qual ferramenta organiza tags e acionadores do site?",
    },
    revision: row.revision,
  });
  assert.equal(row.status, "draft");
  assert.equal(
    (await service.catalog()).questions.find((x) => x.id === row.id).question,
    original,
  );
  row = await publish(row);
  assert.equal(
    (await service.catalog()).questions.find((x) => x.id === row.id).question,
    row.draft.question,
  );
});
test("edição concorrente retorna conflito e não sobrescreve o outro autor", async () => {
  const row = await question();
  await service.update(author, row.id, {
    data: {
      ...row.draft,
      impact: "Primeira alteração salva por outra pessoa do time.",
    },
    revision: row.revision,
  });
  await assert.rejects(
    service.update(author, row.id, { data: row.draft, revision: row.revision }),
    (e) => e.status === 409,
  );
});
test("histórico preserva as revisões e a identidade da pergunta", async () => {
  let row = await question();
  row = await service.update(author, row.id, {
    data: {
      ...row.draft,
      explanation: "Uma explicação nova e mais completa para orientar o aluno.",
    },
    revision: row.revision,
  });
  const item = await service.get(admin, row.id);
  assert.equal(item.versions.length, 2);
  assert.equal(item.versions[1].data.explanation, valid.explanation);
});
test("restaurar gera um rascunho sem substituir a versão pública", async () => {
  let row = await publish(await question());
  row = await service.update(author, row.id, {
    data: {
      ...row.draft,
      question: "Uma nova versão da mesma pergunta para restaurar depois?",
    },
    revision: row.revision,
  });
  row = await service.transition(author, row.id, {
    action: "restore",
    revision: row.revision,
    restoreRevision: 1,
  });
  assert.equal(row.status, "draft");
  assert.equal(row.draft.question, valid.question);
  assert(row.published);
});
test("arquivamento retira a pergunta do catálogo e preserva o histórico", async () => {
  let row = await publish(await question());
  row = await service.transition(reviewer, row.id, {
    action: "archive",
    revision: row.revision,
  });
  assert.equal(row.status, "archived");
  assert(!(await service.catalog()).questions.some((q) => q.id === row.id));
  assert((await service.get(admin, row.id)).versions.length >= 4);
});
test("rejeita atualização direta de item arquivado", async () => {
  let row = await question();
  row = await service.transition(admin, row.id, {
    action: "archive",
    revision: row.revision,
  });
  await assert.rejects(
    service.update(author, row.id, { data: row.draft, revision: row.revision }),
    (e) => e.status === 409,
  );
});
test("publicar trilha exige referências já publicadas", async () => {
  const q = await question();
  let row = await service.create(author, {
    type: "trail",
    data: {
      title: "Trilha de implementação",
      topic: "gtm",
      level: "basico",
      description: "Um caminho para implementar as primeiras tags.",
      objective: "Implementar uma tag de teste.",
      steps: ["Resolver a pergunta indicada."],
      questionIds: [q.id],
      activityIds: [],
      prerequisites: [],
      estimatedMinutes: 30,
    },
  });
  row = await service.transition(author, row.id, {
    action: "review",
    revision: row.revision,
  });
  await assert.rejects(
    service.transition(reviewer, row.id, {
      action: "publish",
      revision: row.revision,
    }),
    (e) => e.status === 422,
  );
});
test("não arquiva uma pergunta usada por trilha publicada", async () => {
  const q = await publish(await question());
  let trail = await service.create(author, {
    type: "trail",
    data: {
      title: "Trilha com questão vinculada",
      topic: "gtm",
      level: "basico",
      description: "Uma trilha completa para praticar a questão.",
      objective: "Explicar o papel da ferramenta.",
      steps: ["Responder e justificar a alternativa."],
      questionIds: [q.id],
      activityIds: [],
      prerequisites: [],
      estimatedMinutes: 30,
    },
  });
  trail = await publish(trail);
  await assert.rejects(
    service.transition(admin, q.id, {
      action: "archive",
      revision: q.revision,
    }),
    (e) => e.status === 409,
  );
});
test("detecta ciclo de pré-requisitos entre trilhas", async () => {
  const data = {
    title: "Trilha com pré-requisito",
    topic: "gtm",
    level: "basico",
    description: "Um caminho de estudo com uma questão de referência.",
    objective: "Estudar dependências entre trilhas.",
    steps: ["Resolver a questão e registrar a explicação."],
    questionIds: ["oci-key"],
    activityIds: [],
    prerequisites: [],
    estimatedMinutes: 30,
  };
  let a = await publish(await service.create(author, { type: "trail", data }));
  const b = await publish(
    await service.create(author, {
      type: "trail",
      data: { ...data, prerequisites: [a.id] },
    }),
  );
  a = await service.update(author, a.id, {
    data: { ...a.draft, prerequisites: [b.id] },
    revision: a.revision,
  });
  a = await service.transition(author, a.id, {
    action: "review",
    revision: a.revision,
  });
  await assert.rejects(
    service.transition(admin, a.id, {
      action: "publish",
      revision: a.revision,
    }),
    (e) => e.status === 422,
  );
});
test("rejeita alternativas repetidas e gabarito fora do intervalo", () => {
  assert.throws(() => validate("question", { ...valid, correct: 5 }), AppError);
  assert.throws(
    () => validate("question", { ...valid, options: ["GTM", "gtm"] }),
    AppError,
  );
});
test("exige explicação, impacto e referência HTTPS", () => {
  for (const data of [
    { ...valid, explanation: "" },
    { ...valid, impact: "" },
    { ...valid, sources: [] },
    {
      ...valid,
      sources: [{ ...valid.sources[0], url: "javascript:alert(1)" }],
    },
  ])
    assert.throws(() => validate("question", data), AppError);
});
test("campos inesperados não permitem alterar tipo, ID ou status", () => {
  assert.throws(
    () => validate("question", { ...valid, status: "published" }),
    AppError,
  );
});
test("não permite reutilizar ID de conteúdo", async () => {
  const q = await question();
  await assert.rejects(
    service.create(author, { id: q.id, type: "question", data: valid }),
    (e) => e.status === 409,
  );
});
test("fonte com o mesmo ID não muda de URL em outra publicação", async () => {
  await publish(await question());
  let row = await question(author, {
    sources: [{ ...valid.sources[0], url: "https://example.com/outro" }],
  });
  row = await service.transition(author, row.id, {
    action: "review",
    revision: row.revision,
  });
  await assert.rejects(
    service.transition(admin, row.id, {
      action: "publish",
      revision: row.revision,
    }),
    (e) => e.status === 422,
  );
});
test("verificação de e-mail é exigida antes de conferir a associação", async () => {
  await assert.rejects(
    service.member({ id: "user", email: admin.email, emailVerified: false }),
    (e) => e.status === 403,
  );
  assert.equal(
    (
      await service.member({
        id: "user",
        email: admin.email,
        emailVerified: true,
      })
    ).role,
    "admin",
  );
});
test("cadastro sem convite não ganha acesso ao painel", async () => {
  assert.equal(
    await service.member({
      id: "outsider",
      email: "outsider@example.com",
      emailVerified: true,
    }),
    null,
  );
});
test("apenas administrador gerencia pessoas", async () => {
  await assert.rejects(
    service.saveMember(author, { email: "new@example.com", role: "admin" }),
    (e) => e.status === 403,
  );
});
test("não desativa nem rebaixa o último administrador", async () => {
  await assert.rejects(
    service.saveMember(admin, {
      email: admin.email,
      name: "",
      role: "author",
      enabled: true,
    }),
    (e) => e.status === 409,
  );
  await assert.rejects(
    service.saveMember(admin, {
      email: admin.email,
      name: "",
      role: "admin",
      enabled: false,
    }),
    (e) => e.status === 409,
  );
});
test("membro desativado perde acesso mesmo com sessão válida", async () => {
  await service.saveMember(admin, {
    email: author.email,
    name: "Autor",
    role: "author",
    enabled: false,
  });
  assert.equal(
    await service.member({ id: "a", email: author.email, emailVerified: true }),
    null,
  );
  await service.saveMember(admin, {
    email: author.email,
    name: "Autor",
    role: "author",
    enabled: true,
  });
});
function http(user) {
  return createAPI({
    service,
    getUser: async () => user,
    origin: "https://control.example",
    taglabOrigins: ["https://taglab.example"],
  });
}
const user = {
  id: "owner",
  email: admin.email,
  emailVerified: true,
  name: "Owner",
};
const request = (
  path,
  method = "GET",
  body,
  origin = "https://control.example",
) =>
  new Request("https://control.example/api/" + path, {
    method,
    headers: { Origin: origin, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
test("API administrativa nega acesso sem sessão", async () => {
  const r = await http(null)(request("admin/content"));
  assert.equal(r.status, 401);
  assert.equal(r.headers.get("cache-control"), "no-store");
});
test("API nega conta autenticada sem permissão", async () => {
  const r = await http({ ...user, email: "outsider@example.com" })(
    request("admin/content"),
  );
  assert.equal(r.status, 403);
});
test("API rejeita mutação de outra origem e sem Origin", async () => {
  for (const origin of ["https://attacker.example", ""]) {
    const r = await http(user)(
      request(
        "admin/content",
        "POST",
        { type: "question", data: valid },
        origin,
      ),
    );
    assert.equal(r.status, 403);
  }
});
test("API permite escrita autorizada e valida o corpo", async () => {
  const r = await http(user)(
    request("admin/content", "POST", { type: "question", data: valid }),
  );
  assert.equal(r.status, 201);
  const bad = await http(user)(
    request("admin/content", "POST", { type: "question", data: {} }),
  );
  assert.equal(bad.status, 422);
  assert((await bad.json()).details.length > 0);
});
test("API pública expõe apenas leitura, com CORS restrito às origens declaradas", async () => {
  const r = await http(null)(
    request("v1/catalog", "GET", null, "https://taglab.example"),
  );
  assert.equal(r.status, 200);
  assert.equal(
    r.headers.get("access-control-allow-origin"),
    "https://taglab.example",
  );
  assert(!r.headers.has("access-control-allow-credentials"));
  const body = await r.json();
  assert(!JSON.stringify(body).includes("created_by"));
  const post = await http(user)(request("v1/catalog", "POST", {}));
  assert.equal(post.status, 405);
});
test("ETag retorna 304 e filtro entrega resultados correspondentes", async () => {
  const r = await http(null)(request("v1/questions?topic=ga4"));
  const body = await r.json();
  assert(body.items.every((q) => q.topic === "ga4"));
  const req = request("v1/questions?topic=ga4");
  req.headers.set("If-None-Match", r.headers.get("etag"));
  assert.equal((await http(null)(req)).status, 304);
});
test("salvar rascunho não muda versão ou ETag do catálogo", async () => {
  const row = await question();
  const before = await http(null)(request("v1/catalog"));
  await service.update(author, row.id, {
    data: {
      ...row.draft,
      impact: "Alteração interna que ainda não passou pela revisão.",
    },
    revision: row.revision,
  });
  const after = await http(null)(request("v1/catalog"));
  assert.equal(after.headers.get("etag"), before.headers.get("etag"));
});
test("publicação muda versão do catálogo e gera trilha de auditoria", async () => {
  const old = (await service.catalog()).version;
  const row = await publish(await question());
  assert((await service.catalog()).version > old);
  assert(
    (await service.audit(admin)).some(
      (a) => a.content_id === row.id && a.action === "publish",
    ),
  );
});
test("JSON inválido e corpo excessivo retornam erro controlado", async () => {
  let r = await http(user)(
    new Request("https://control.example/api/admin/content", {
      method: "POST",
      headers: {
        Origin: "https://control.example",
        "Content-Type": "application/json",
      },
      body: "{",
    }),
  );
  assert.equal(r.status, 400);
  r = await http(user)(
    request("admin/content", "POST", { value: "x".repeat(200001) }),
  );
  assert.equal(r.status, 413);
});
