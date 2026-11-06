"use client";
import { useState } from "react";
import {
  X,
  Save,
  Send,
  CheckCheck,
  Archive,
  RotateCcw,
  Eye,
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { topics, tabs } from "@/lib/domain.mjs";
const today = () => new Date().toISOString().slice(0, 10);
export const typeLabels = {
  question: "Questão",
  trail: "Trilha",
  activity: "Atividade",
  suggestion: "Sugestão",
};
export const statuses = {
  draft: "Rascunho",
  in_review: "Em revisão",
  published: "Publicada",
  archived: "Arquivada",
};
const base = { topic: "gtm", level: "basico" };
export function blank(type) {
  if (type === "question")
    return {
      ...base,
      question: "",
      kind: "conceito",
      tools: ["GTM"],
      options: ["", "", "", ""],
      correct: 0,
      explanation: "",
      impact: "",
      sources: [
        {
          id: "fonte-" + Date.now(),
          title: "",
          url: "",
          publisher: "Google",
          reviewedAt: today(),
        },
      ],
      reviewedAt: today(),
      scope: "laboratorio",
    };
  if (type === "trail")
    return {
      ...base,
      title: "",
      description: "",
      objective: "",
      steps: [""],
      questionIds: [],
      activityIds: [],
      prerequisites: [],
      estimatedMinutes: 60,
    };
  if (type === "activity")
    return {
      ...base,
      title: "",
      tab: "loja",
      task: "",
      expected: "",
      questionIds: [],
      estimatedMinutes: 20,
    };
  return {
    title: "",
    topic: "gtm",
    type: "conteudo",
    description: "",
    url: "",
    outcome: "",
  };
}
function ReferencePicker({ label, type, values, onChange, items, exclude }) {
  const [search, setSearch] = useState("");
  return (
    <details className="reference-picker">
      <summary>
        {label}
        <span>{values.length} selecionadas</span>
      </summary>
      <input
        aria-label={"Buscar em " + label}
        placeholder="Buscar por título ou ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="reference-options">
        {items
          .filter(
            (x) =>
              x.type === type &&
              x.id !== exclude &&
              JSON.stringify(x.draft)
                .toLowerCase()
                .includes(search.toLowerCase()),
          )
          .map((x) => (
            <label key={x.id} className="check-label">
              <input
                type="checkbox"
                checked={values.includes(x.id)}
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...values, x.id]
                      : values.filter((id) => id !== x.id),
                  )
                }
              />
              <span>
                {x.draft.question || x.draft.title}
                <small>
                  {x.id} ·{" "}
                  {x.published ? "Disponível" : "Publique antes de vincular"}
                </small>
              </span>
            </label>
          ))}
      </div>
    </details>
  );
}
export default function ContentEditor({
  item,
  type,
  items,
  canPublish,
  onClose,
  onSave,
  onAction,
  busy,
  message,
}) {
  const [data, setData] = useState(() =>
    structuredClone(item?.draft || blank(type)),
  );
  const [id, setId] = useState(item?.id || "");
  const [preview, setPreview] = useState(false);
  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const changed = item && JSON.stringify(data) !== JSON.stringify(item.draft);
  async function save(e) {
    e.preventDefault();
    await onSave({ id: id || undefined, type, data, revision: item?.revision });
  }
  return (
    <div className="editor-overlay">
      <section
        className="editor"
        role="dialog"
        aria-modal="true"
        aria-label={(item ? "Editar " : "Nova ") + typeLabels[type]}
      >
        <div className="editor-top">
          <div>
            <span className="eyebrow">ESTÚDIO DE CONTEÚDO</span>
            <h2>
              {item
                ? "Editar " + typeLabels[type].toLowerCase()
                : "Nova " + typeLabels[type].toLowerCase()}
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar editor"
          >
            <X />
          </button>
        </div>
        <form onSubmit={save} className="editor-form">
          <div className="editor-meta">
            <span className={"status " + (item?.status || "draft")}>
              {statuses[item?.status || "draft"]}
            </span>
            <span>{item ? "Revisão " + item.revision : "Novo conteúdo"}</span>
            <button
              type="button"
              className="text-button"
              onClick={() => setPreview(!preview)}
            >
              <Eye size={15} />
              {preview ? "Voltar ao formulário" : "Pré-visualizar"}
            </button>
          </div>
          {message && (
            <div className="notice" role="status">
              {message}
            </div>
          )}
          {item?.published && item.status !== "published" && (
            <div className="notice neutral">
              O TagLab continua recebendo a última versão publicada enquanto
              você prepara este rascunho.
            </div>
          )}
          {preview ? (
            <article className="question-preview">
              <span className="eyebrow">PRÉVIA DO RASCUNHO</span>
              <h2>{data.question || data.title || "Sem título"}</h2>
              {data.options?.map((o, i) => (
                <p
                  className={
                    "preview-option " + (i === data.correct ? "correct" : "")
                  }
                  key={i}
                >
                  {String.fromCharCode(65 + i)}. {o || "Alternativa vazia"}
                  {i === data.correct ? " ✓" : ""}
                </p>
              ))}
              <p>{data.description || data.task}</p>
              {data.steps && (
                <ol>
                  {data.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
              <h3>
                {data.explanation
                  ? "Por que esta resposta?"
                  : "Resultado esperado"}
              </h3>
              <p>{data.explanation || data.expected || data.outcome}</p>
              <p>{data.impact}</p>
              <small>
                Material de estudo: o gabarito será público após a publicação.
              </small>
            </article>
          ) : (
            <>
              <label>
                ID permanente
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Gerado automaticamente se ficar vazio"
                  readOnly={!!item}
                  pattern="[a-z0-9][a-z0-9-]{1,79}"
                />
                <small>
                  Preserve este ID para manter vínculos e o progresso dos
                  alunos.
                </small>
              </label>
              <label>
                {type === "question" ? "Enunciado" : "Título"}
                <textarea
                  aria-label={type === "question" ? "Enunciado" : "Título"}
                  rows={type === "question" ? 3 : 2}
                  value={data.question ?? data.title}
                  onChange={(e) =>
                    set(
                      type === "question" ? "question" : "title",
                      e.target.value,
                    )
                  }
                  required
                  maxLength={type === "question" ? 3000 : 180}
                />
              </label>
              <div className="form-row">
                <label>
                  Tema
                  <select
                    value={data.topic}
                    onChange={(e) => set("topic", e.target.value)}
                  >
                    {topics.map((t) => (
                      <option value={t.id} key={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                {type !== "suggestion" && (
                  <label>
                    Nível
                    <select
                      value={data.level}
                      onChange={(e) => set("level", e.target.value)}
                    >
                      <option value="basico">Básico</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </label>
                )}
              </div>
              {type === "question" && (
                <>
                  <div className="form-row">
                    <label>
                      Formato
                      <select
                        value={data.kind}
                        onChange={(e) => set("kind", e.target.value)}
                      >
                        <option value="conceito">Conceito</option>
                        <option value="implementacao">Implementação</option>
                        <option value="diagnostico">Diagnóstico</option>
                        <option value="cenario">Cenário e decisão</option>
                      </select>
                    </label>
                    <label>
                      Ferramentas, separadas por vírgula
                      <input
                        value={data.tools.join(", ")}
                        onChange={(e) =>
                          set(
                            "tools",
                            e.target.value.split(",").map((s) => s.trim()),
                          )
                        }
                        required
                      />
                    </label>
                  </div>
                  <fieldset className="alternatives">
                    <legend>
                      Alternativas <small>Marque a resposta correta</small>
                    </legend>
                    {data.options.map((option, i) => (
                      <div className="alternative" key={i}>
                        <input
                          type="radio"
                          name="correct"
                          aria-label={
                            "Alternativa correta " + String.fromCharCode(65 + i)
                          }
                          checked={data.correct === i}
                          onChange={() => set("correct", i)}
                        />
                        <span>{String.fromCharCode(65 + i)}</span>
                        <input
                          aria-label={
                            "Texto da alternativa " +
                            String.fromCharCode(65 + i)
                          }
                          value={option}
                          onChange={(e) =>
                            set(
                              "options",
                              data.options.map((v, j) =>
                                i === j ? e.target.value : v,
                              ),
                            )
                          }
                          required
                        />
                        {data.options.length > 2 && (
                          <button
                            className="icon-button"
                            type="button"
                            aria-label={
                              "Remover alternativa " +
                              String.fromCharCode(65 + i)
                            }
                            onClick={() => {
                              set(
                                "options",
                                data.options.filter((_, j) => i !== j),
                              );
                              set(
                                "correct",
                                data.correct === i
                                  ? 0
                                  : data.correct > i
                                    ? data.correct - 1
                                    : data.correct,
                              );
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                    {data.options.length < 6 && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => set("options", [...data.options, ""])}
                      >
                        <Plus size={15} />
                        Adicionar alternativa
                      </button>
                    )}
                  </fieldset>
                  <label>
                    Explicação da resposta
                    <textarea
                      rows={3}
                      required
                      value={data.explanation}
                      onChange={(e) => set("explanation", e.target.value)}
                    />
                  </label>
                  <label>
                    Impacto em uma implementação real
                    <textarea
                      rows={3}
                      required
                      value={data.impact}
                      onChange={(e) => set("impact", e.target.value)}
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Revisão editorial
                      <input
                        type="date"
                        required
                        value={data.reviewedAt}
                        onChange={(e) => set("reviewedAt", e.target.value)}
                      />
                    </label>
                    <label>
                      Escopo
                      <select
                        value={data.scope}
                        onChange={(e) => set("scope", e.target.value)}
                      >
                        <option value="laboratorio">Laboratório</option>
                        <option value="produto">Produto e documentação</option>
                      </select>
                    </label>
                  </div>
                  <h3 className="section-label">
                    <BookOpen size={16} />
                    Fontes da questão
                  </h3>
                  {data.sources.map((s, i) => (
                    <div className="source-box" key={i}>
                      <label>
                        Título
                        <input
                          required
                          value={s.title}
                          onChange={(e) =>
                            set(
                              "sources",
                              data.sources.map((v, j) =>
                                i === j ? { ...v, title: e.target.value } : v,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        URL HTTPS
                        <input
                          type="url"
                          required
                          value={s.url}
                          onChange={(e) =>
                            set(
                              "sources",
                              data.sources.map((v, j) =>
                                i === j ? { ...v, url: e.target.value } : v,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        ID da fonte
                        <input
                          required
                          value={s.id}
                          onChange={(e) =>
                            set(
                              "sources",
                              data.sources.map((v, j) =>
                                i === j ? { ...v, id: e.target.value } : v,
                              ),
                            )
                          }
                        />
                      </label>
                      {data.sources.length > 1 && (
                        <button
                          type="button"
                          className="text-button danger"
                          onClick={() =>
                            set(
                              "sources",
                              data.sources.filter((_, j) => i !== j),
                            )
                          }
                        >
                          Remover fonte
                        </button>
                      )}
                    </div>
                  ))}
                  {data.sources.length < 12 && (
                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        set("sources", [
                          ...data.sources,
                          {
                            id: "fonte-" + Date.now(),
                            title: "",
                            url: "",
                            publisher: "Referência",
                            reviewedAt: today(),
                          },
                        ])
                      }
                    >
                      + Adicionar fonte
                    </button>
                  )}
                </>
              )}
              {(type === "trail" || type === "suggestion") && (
                <label>
                  Descrição
                  <textarea
                    rows={3}
                    required
                    value={data.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </label>
              )}
              {type === "trail" && (
                <>
                  <label>
                    Objetivo de aprendizagem
                    <textarea
                      rows={2}
                      required
                      value={data.objective}
                      onChange={(e) => set("objective", e.target.value)}
                    />
                  </label>
                  <label>
                    Etapas, uma por linha
                    <textarea
                      rows={5}
                      required
                      value={data.steps.join("\n")}
                      onChange={(e) => set("steps", e.target.value.split("\n"))}
                    />
                  </label>
                  <ReferencePicker
                    label="Atividades da trilha"
                    type="activity"
                    values={data.activityIds}
                    onChange={(v) => set("activityIds", v)}
                    items={items}
                  />
                  <ReferencePicker
                    label="Trilhas pré-requisito"
                    type="trail"
                    values={data.prerequisites}
                    onChange={(v) => set("prerequisites", v)}
                    items={items}
                    exclude={id}
                  />
                </>
              )}
              {type === "activity" && (
                <>
                  <label>
                    Laboratório
                    <select
                      value={data.tab}
                      onChange={(e) => set("tab", e.target.value)}
                    >
                      {tabs.map((t) => (
                        <option value={t} key={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    O que o aluno precisa fazer
                    <textarea
                      rows={4}
                      required
                      value={data.task}
                      onChange={(e) => set("task", e.target.value)}
                    />
                  </label>
                  <label>
                    Resultado esperado e como verificar
                    <textarea
                      rows={4}
                      required
                      value={data.expected}
                      onChange={(e) => set("expected", e.target.value)}
                    />
                  </label>
                </>
              )}
              {(type === "trail" || type === "activity") && (
                <>
                  <label>
                    Tempo estimado, em minutos
                    <input
                      type="number"
                      min="5"
                      max={type === "trail" ? 2000 : 480}
                      value={data.estimatedMinutes}
                      onChange={(e) =>
                        set("estimatedMinutes", Number(e.target.value))
                      }
                    />
                  </label>
                  <ReferencePicker
                    label="Questões relacionadas"
                    type="question"
                    values={data.questionIds}
                    onChange={(v) => set("questionIds", v)}
                    items={items}
                  />
                </>
              )}
              {type === "suggestion" && (
                <>
                  <label>
                    Tipo
                    <select
                      value={data.type}
                      onChange={(e) => set("type", e.target.value)}
                    >
                      <option value="conteudo">Novo conteúdo</option>
                      <option value="correcao">Correção</option>
                      <option value="atividade">Atividade</option>
                      <option value="trilha">Trilha</option>
                    </select>
                  </label>
                  <label>
                    Link de referência, opcional
                    <input
                      type="url"
                      value={data.url}
                      onChange={(e) => set("url", e.target.value)}
                    />
                  </label>
                  <label>
                    Encaminhamento e retorno ao time
                    <textarea
                      rows={3}
                      value={data.outcome}
                      onChange={(e) => set("outcome", e.target.value)}
                    />
                  </label>
                </>
              )}
            </>
          )}
          {item?.versions?.length > 0 && (
            <details className="versions">
              <summary>
                Histórico de versões{" "}
                <span>{item.versions.length} revisões recentes</span>
              </summary>
              {item.versions.map((v) => (
                <div className="version" key={v.revision}>
                  <div>
                    <b>Revisão {v.revision}</b>
                    <small>
                      {v.action} · {v.actor}
                      <br />
                      {new Date(v.created_at).toLocaleString("pt-BR")}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="text-button"
                    disabled={busy}
                    onClick={() =>
                      onAction("restore", { restoreRevision: v.revision })
                    }
                  >
                    <RotateCcw size={14} />
                    Restaurar como rascunho
                  </button>
                </div>
              ))}
            </details>
          )}
          <footer className="editor-footer">
            <button
              type="submit"
              className="button primary"
              disabled={busy || item?.status === "archived"}
            >
              <Save size={16} />
              {busy ? "Salvando…" : "Salvar rascunho"}
            </button>
            {item?.status === "draft" && (
              <button
                type="button"
                className="button"
                disabled={busy || changed}
                title={changed ? "Salve as mudanças primeiro" : ""}
                onClick={() => onAction("review")}
              >
                <Send size={15} />
                Enviar para revisão
              </button>
            )}
            {canPublish && item?.status === "in_review" && (
              <button
                type="button"
                className="button primary"
                disabled={busy || changed}
                onClick={() => onAction("publish")}
              >
                <CheckCheck size={16} />
                Publicar no TagLab
              </button>
            )}
            {canPublish && item && item.status !== "archived" && (
              <button
                type="button"
                className="text-button danger"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      "Arquivar este item remove sua versão pública. Continuar?",
                    )
                  )
                    onAction("archive");
                }}
              >
                <Archive size={15} />
                Arquivar
              </button>
            )}
          </footer>
        </form>
      </section>
    </div>
  );
}
