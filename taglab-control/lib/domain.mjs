import { z } from "zod";

export const topics = [
  { id: "gtm", label: "GTM, Google tag e dataLayer" },
  { id: "ga4", label: "GA4 e e-commerce" },
  { id: "gtg", label: "GTG, CDN e sGTM" },
  { id: "consent", label: "Consentimento e CMP" },
  { id: "upd", label: "UPD e Enhanced Conversions" },
  { id: "offline", label: "OCI e ECL" },
  { id: "data-manager", label: "Data Manager: UI e API" },
  { id: "architecture", label: "Arquitetura e diagnóstico" },
];
export const tabs = [
  "loja",
  "config",
  "interacoes",
  "consentimento",
  "upd",
  "offline",
  "exercicios",
  "pratica",
  "cenarios",
  "guia",
  "missoes",
  "tutoria",
  "desafios",
];
export const roles = {
  author: ["read", "write", "review"],
  reviewer: ["read", "write", "review", "publish"],
  admin: ["read", "write", "review", "publish", "members"],
};
export const idSchema = z
  .string()
  .regex(
    /^[a-z0-9][a-z0-9-]{1,79}$/,
    "Use um ID de 2–80 caracteres: letras minúsculas, números e hífens.",
  );
const text = (min = 1, max = 2000) => z.string().trim().min(min).max(max);
const httpsURL = z
  .url()
  .refine(
    (value) => new URL(value).protocol === "https:",
    "Use uma URL HTTPS.",
  );
const date = z.iso.date();
const references = (max) =>
  z
    .array(idSchema)
    .max(max)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Referências repetidas.",
    );
const shared = {
  title: text(4, 180),
  topic: z.enum(topics.map((t) => t.id)),
  level: z.enum(["basico", "intermediario", "avancado"]),
};
const source = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9_-]{1,79}$/),
  title: text(3, 250),
  url: httpsURL,
  publisher: text(1, 100).default("Referência"),
  reviewedAt: date,
});
const question = z
  .object({
    question: text(12, 3000),
    topic: shared.topic,
    level: shared.level,
    kind: z.enum(["conceito", "implementacao", "diagnostico", "cenario"]),
    tools: z.array(text(1, 80)).min(1).max(12),
    options: z.array(text(1, 1500)).min(2).max(6),
    correct: z.number().int().min(0).max(5),
    explanation: text(15, 5000),
    impact: text(10, 3000),
    sources: z.array(source).min(1).max(12),
    reviewedAt: date,
    practiceId: text(1, 80).optional(),
    scope: z.enum(["laboratorio", "produto"]).default("laboratorio"),
  })
  .strict()
  .superRefine((q, ctx) => {
    if (q.correct >= q.options.length)
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "Selecione uma alternativa existente.",
      });
    if (
      new Set(q.options.map((s) => s.toLocaleLowerCase("pt-BR"))).size !==
      q.options.length
    )
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "As alternativas precisam ser diferentes.",
      });
    if (new Set(q.sources.map((s) => s.id)).size !== q.sources.length)
      ctx.addIssue({
        code: "custom",
        path: ["sources"],
        message: "IDs de fontes repetidos.",
      });
  });
const activity = z
  .object({
    ...shared,
    legacyId: idSchema.optional(),
    tab: z.enum(tabs),
    task: text(15, 6000),
    expected: text(15, 4000),
    questionIds: references(80).default([]),
    estimatedMinutes: z.number().int().min(5).max(480).default(20),
  })
  .strict();
const trail = z
  .object({
    ...shared,
    description: text(15, 4000),
    objective: text(10, 2000),
    steps: z.array(text(5, 2000)).min(1).max(30),
    questionIds: references(100),
    activityIds: references(60),
    prerequisites: references(20).default([]),
    estimatedMinutes: z.number().int().min(5).max(2000).default(60),
  })
  .strict()
  .refine((t) => t.questionIds.length + t.activityIds.length > 0, {
    message: "Inclua ao menos uma questão ou atividade.",
  });
const suggestion = z
  .object({
    title: shared.title,
    topic: shared.topic,
    description: text(15, 4000),
    type: z.enum(["conteudo", "correcao", "atividade", "trilha"]),
    url: z.union([httpsURL, z.literal("")]).default(""),
    outcome: text(0, 3000).default(""),
  })
  .strict();
export const schemas = { question, activity, trail, suggestion };
export const memberSchema = z
  .object({
    email: z
      .email()
      .max(254)
      .transform((s) => s.toLowerCase()),
    name: text(0, 120).default(""),
    role: z.enum(["author", "reviewer", "admin"]),
    enabled: z.boolean().default(true),
  })
  .strict();
export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
export function permit(actor, permission) {
  if (!actor || !roles[actor.role]?.includes(permission))
    throw new AppError(
      actor ? 403 : 401,
      actor
        ? "Seu perfil não tem permissão para esta ação."
        : "Entre para continuar.",
    );
}
export function validate(type, data) {
  const schema = schemas[type];
  if (!schema) throw new AppError(422, "Tipo de conteúdo inválido.");
  const r = schema.safeParse(data);
  if (!r.success)
    throw new AppError(
      422,
      "Revise os campos indicados.",
      r.error.issues.map((x) => ({
        field: x.path.join("."),
        message: x.message,
      })),
    );
  return r.data;
}
export function expectedRevision(value) {
  if (!Number.isInteger(value) || value < 1)
    throw new AppError(422, "Informe a revisão que você abriu para editar.");
  return value;
}
export function publicCatalog(rows, version) {
  const published = rows.filter((r) => r.published);
  const questions = [];
  const sources = Object.create(null);
  for (const r of published.filter((r) => r.type === "question")) {
    const { sources: refs, ...q } = r.published;
    for (const ref of refs) {
      const key = ref.id;
      if (sources[key] && sources[key].url !== ref.url)
        throw new AppError(500, "Referências inconsistentes no catálogo.");
      sources[key] = ref;
    }
    questions.push({
      id: r.id,
      ...q,
      sourceIds: refs.map((s) => s.id),
      contentRevision: r.published_revision,
    });
  }
  const collect = (type) =>
    published
      .filter((r) => r.type === type)
      .map((r) => ({
        id: r.id,
        ...r.published,
        contentRevision: r.published_revision,
      }));
  return {
    schemaVersion: 1,
    version,
    language: "pt-BR",
    notice:
      "Material de estudo. Gabaritos públicos; não use como prova protegida. Apenas conteúdo publicado.",
    reviewedAt:
      questions
        .map((q) => q.reviewedAt)
        .sort()
        .at(-1) || new Date().toISOString().slice(0, 10),
    topics,
    sources,
    questions,
    activities: collect("activity"),
    trails: collect("trail"),
    suggestions: collect("suggestion"),
  };
}
export function serializeContent(row) {
  return {
    ...row,
    revision: Number(row.revision),
    published_revision:
      row.published_revision === null ? null : Number(row.published_revision),
  };
}
