import { readFile } from "node:fs/promises";
import { database } from "../lib/db.mjs";
import { validate } from "../lib/domain.mjs";
export async function seed(db, adminEmail) {
  const { bank, tasks, missions } = JSON.parse(
    await readFile(
      new URL("../db/original-content.json", import.meta.url),
      "utf8",
    ),
  );
  if (!adminEmail || !adminEmail.includes("@"))
    throw new Error("Defina BOOTSTRAP_ADMIN_EMAIL antes da importação.");
  const actor = adminEmail.toLowerCase();
  await db.query(
    "INSERT INTO control_members(email,name,role) VALUES($1,'Administrador inicial','admin') ON CONFLICT DO NOTHING",
    [actor],
  );
  const entries = bank.questions.map((q) => {
    const { id, sourceIds, ...data } = q;
    return {
      id,
      type: "question",
      data: {
        ...data,
        sources: sourceIds.map((id) => ({ id, ...bank.sources[id] })),
      },
    };
  });
  for (const task of tasks)
    entries.push({
      id: "activity-" + task.id,
      type: "activity",
      data: {
        legacyId: task.id,
        title: task.title,
        topic:
          bank.questions.find((q) => q.practiceId === task.id)?.topic ||
          "architecture",
        level: "intermediario",
        tab: task.tab,
        task: task.task,
        expected: task.expected,
        estimatedMinutes: 20,
        questionIds: bank.questions
          .filter((q) => q.practiceId === task.id)
          .map((q) => q.id),
      },
    });
  for (const m of missions)
    entries.push({
      id: "trail-" + m.id,
      type: "trail",
      data: {
        title: m.title,
        topic: m.topic,
        level: "intermediario",
        description: m.expected,
        objective: m.objective,
        steps: m.steps,
        questionIds: m.questionIds,
        activityIds: [],
        prerequisites: m.prerequisites.map((id) => "trail-" + id),
        estimatedMinutes: 60,
      },
    });
  let count = 0;
  for (const entry of entries) {
    const data = validate(entry.type, entry.data);
    const r = await db.query(
      "INSERT INTO control_content(id,type,draft,published,status,published_revision,created_by,updated_by) VALUES($1,$2,$3,$3,'published',1,$4,$4) ON CONFLICT DO NOTHING RETURNING id",
      [entry.id, entry.type, JSON.stringify(data), actor],
    );
    if (r.rows.length) {
      await db.query(
        "INSERT INTO control_revisions(content_id,revision,data,action,actor) VALUES($1,1,$2,'imported',$3)",
        [entry.id, JSON.stringify(data), actor],
      );
      count++;
    }
  }
  if (count) {
    await db.query(
      "UPDATE control_settings SET value=to_jsonb((value::text::integer)+1) WHERE id='catalog_version'",
    );
    await db.query(
      "INSERT INTO control_audit(actor,action,detail) VALUES($1,'imported',$2)",
      [actor, JSON.stringify({ count, sourceBank: bank.version })],
    );
  }
  return count;
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const db = database();
  try {
    console.log(
      "Itens importados:",
      await seed(db, process.env.BOOTSTRAP_ADMIN_EMAIL),
    );
  } finally {
    await db.end();
  }
}
