"use client";
import { useEffect, useState } from "react";
import {
  Layers3,
  LayoutDashboard,
  FileQuestion,
  Route,
  FlaskConical,
  Lightbulb,
  Users,
  History,
  Plug,
  ArrowUpRight,
  ArrowRight,
  Search,
  Plus,
  CheckCheck,
  Clock3,
  BookOpen,
  LogOut,
  Menu,
  X,
  Filter,
  Copy,
  Download,
  Send,
} from "lucide-react";
import ContentEditor, { statuses, typeLabels } from "./content-editor";
import { topics } from "@/lib/domain.mjs";
import { authClient } from "@/lib/auth-client";
const nav = [
  ["overview", "Visão geral", LayoutDashboard],
  ["question", "Questões", FileQuestion],
  ["trail", "Trilhas", Route],
  ["activity", "Atividades", FlaskConical],
  ["suggestion", "Sugestões", Lightbulb],
  ["review", "Publicação", CheckCheck],
  ["members", "Equipe", Users],
  ["audit", "Histórico", History],
  ["integration", "Integração", Plug],
];
const titles = {
  overview: [
    "Seu time. Mais conhecimento.",
    "Transforme experiência em conteúdo que ajuda a próxima pessoa a aprender.",
  ],
  question: [
    "Banco de questões",
    "Crie, revise e mantenha as perguntas que chegam ao TagLab.",
  ],
  trail: [
    "Trilhas de aprendizagem",
    "Conecte questões e atividades em um caminho com propósito.",
  ],
  activity: [
    "Aprender fazendo",
    "Defina tarefas, laboratórios e evidências esperadas.",
  ],
  suggestion: [
    "Ideias que viram aprendizado",
    "Registre sugestões e dê visibilidade ao encaminhamento.",
  ],
  review: [
    "Pronto para uma segunda leitura",
    "Revise o conteúdo antes de liberar uma nova versão para os alunos.",
  ],
  members: [
    "O time por trás do conteúdo",
    "Autorize pessoas e defina o que cada uma pode fazer.",
  ],
  audit: [
    "Cada mudança tem uma história",
    "Acompanhe edições, revisões, publicações e permissões.",
  ],
  integration: [
    "Uma central. Um catálogo vivo.",
    "A API entrega ao TagLab apenas o conteúdo que o time publicou.",
  ],
};
const profileNames = {
  admin: "Administrador",
  reviewer: "Revisor",
  author: "Autor",
};
export async function api(path, options = {}) {
  const response = await fetch("/api/admin/" + path, {
    signal: AbortSignal.timeout(12000),
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw Error(
      "O servidor não respondeu com JSON. Confira a configuração da central.",
    );
  }
  if (!response.ok)
    throw Object.assign(
      Error(
        data.error +
          (data.details
            ? " " +
              data.details.map((d) => d.field + ": " + d.message).join(" · ")
            : ""),
      ),
      { status: response.status },
    );
  return data;
}
const titleOf = (x) => x.draft.question || x.draft.title;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
export default function ControlPanel() {
  const [me, setMe] = useState(null),
    [items, setItems] = useState([]),
    [view, setView] = useState("overview"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [query, setQuery] = useState(""),
    [topic, setTopic] = useState(""),
    [status, setStatus] = useState(""),
    [editor, setEditor] = useState(null),
    [editorMessage, setEditorMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [mobileNav, setMobileNav] = useState(false);
  async function reload() {
    const r = await api("content");
    setItems(r.items);
  }
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await api("me");
        if (cancelled) return;
        setMe(user);
        const result = await api("content");
        if (!cancelled) setItems(result.items);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!editor) return;
    const previous = document.activeElement;
    const handler = (e) => {
      if (e.key === "Escape" && !busy) closeEditor();
      if (e.key === "Tab") {
        const dialog = document.querySelector('[role="dialog"]');
        const controls = [
          ...dialog.querySelectorAll("button,input,textarea,select,a"),
        ].filter((el) => !el.disabled && el.offsetParent !== null);
        if (!controls.length) return;
        if (e.shiftKey && document.activeElement === controls[0]) {
          e.preventDefault();
          controls.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === controls.at(-1)) {
          e.preventDefault();
          controls[0].focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    document.querySelector('[role="dialog"] input')?.focus();
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
      previous?.focus?.();
    };
  }, [editor?.key, busy]);
  function navigate(next) {
    setView(next);
    setQuery("");
    setTopic("");
    setStatus("");
    setMobileNav(false);
    setNotice("");
  }
  function closeEditor() {
    if (busy) return;
    setEditor(null);
    setEditorMessage("");
  }
  async function open(item) {
    try {
      const current = await api("content/" + item.id);
      setEditor({
        type: item.type,
        item: current,
        key: item.id + "-" + current.revision,
      });
      setEditorMessage("");
    } catch (e) {
      setNotice(e.message);
    }
  }
  function add(type) {
    setEditor({ type, item: null, key: "new-" + Date.now() });
    setEditorMessage("");
  }
  async function save(input) {
    setBusy(true);
    setEditorMessage("");
    try {
      const row = await api(
        editor.item ? "content/" + editor.item.id : "content",
        { method: editor.item ? "PATCH" : "POST", body: JSON.stringify(input) },
      );
      await reload();
      const current = await api("content/" + row.id);
      setEditor({
        type: row.type,
        item: current,
        key: row.id + "-" + row.revision,
      });
      setEditorMessage(
        "Rascunho salvo. Envie para revisão quando estiver pronto.",
      );
    } catch (e) {
      setEditorMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function action(action, extra = {}) {
    setBusy(true);
    setEditorMessage("");
    try {
      const row = await api("content/" + editor.item.id + "/" + action, {
        method: "POST",
        body: JSON.stringify({ revision: editor.item.revision, ...extra }),
      });
      await reload();
      const current = await api("content/" + row.id);
      setEditor({
        type: row.type,
        item: current,
        key: row.id + "-" + row.revision,
      });
      setEditorMessage(
        action === "publish"
          ? "Publicado. O catálogo pode levar até 90 segundos para atualizar no cache."
          : action === "review"
            ? "Enviado para revisão."
            : action === "restore"
              ? "Revisão recuperada como rascunho. A versão pública não foi substituída."
              : "Conteúdo arquivado.",
      );
    } catch (e) {
      setEditorMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  const published = items.filter((x) => x.published),
    pending = items.filter((x) => x.status === "in_review"),
    drafts = items.filter((x) => x.status === "draft");
  const filtered = items.filter(
    (x) =>
      (view === "review" ? x.status === "in_review" : x.type === view) &&
      (!topic || x.draft.topic === topic) &&
      (!status || x.status === status) &&
      (!query ||
        [titleOf(x), x.id, ...(x.draft.tools || [])]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  if (loading)
    return (
      <div className="loading">
        <span className="brand-mark">
          <Layers3 />
        </span>
        <p>Preparando a central…</p>
      </div>
    );
  if (!me)
    return (
      <main className="access-page">
        <span className="brand-mark">
          <Layers3 />
        </span>
        <span className="eyebrow">TAGLAB CONTROL</span>
        <h1>
          O conhecimento do time
          <br />
          começa aqui.
        </h1>
        <p>
          Uma central para criar questões, organizar trilhas e transformar a
          prática em aprendizado.
        </p>
        {error && (
          <div className="notice" role="status">
            {error}
          </div>
        )}
        <a className="button primary" href="/auth/sign-in">
          Entrar na central
          <ArrowRight size={17} />
        </a>
        <small>
          Acesso restrito a contas autorizadas. O catálogo publicado é público.
        </small>
      </main>
    );
  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobileNav ? "mobile-open" : "")}>
        <a href="/" className="brand">
          <span className="brand-mark">
            <Layers3 size={22} />
          </span>
          <span>
            TagLab <b>Control</b>
            <small>CENTRAL DE CONTEÚDO</small>
          </span>
        </a>
        <button
          className="icon-button mobile-close"
          aria-label="Fechar navegação"
          onClick={() => setMobileNav(false)}
        >
          <X />
        </button>
        <span className="nav-label">ESPAÇO DO TIME</span>
        <nav aria-label="Navegação principal">
          {nav
            .filter(
              ([key]) =>
                key !== "members" || me.permissions.includes("members"),
            )
            .map(([key, label, Icon]) => (
              <button
                key={key}
                className={view === key ? "active" : ""}
                onClick={() => navigate(key)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {key === "review" && pending.length > 0 && (
                  <b className="nav-count">{pending.length}</b>
                )}
              </button>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="live-dot" />
            Conteúdo para o TagLab
            <p>
              Publique uma vez.
              <br />
              Ensine em cada laboratório.
            </p>
            <button onClick={() => navigate("integration")}>
              Ver integração <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="user-block">
            <span className="avatar">
              {(me.user.name || me.user.email).slice(0, 1).toUpperCase()}
            </span>
            <div>
              <b>{me.user.name || "Time TagLab"}</b>
              <small>{profileNames[me.user.role]}</small>
            </div>
            <button
              className="icon-button"
              aria-label="Sair da central"
              onClick={async () => {
                await authClient.signOut();
                window.location.assign("/auth/sign-in");
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="nav-scrim"
          aria-label="Fechar menu"
          onClick={() => setMobileNav(false)}
        />
      )}
      <div className="main-area">
        <header className="topbar">
          <div>
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir navegação"
              onClick={() => setMobileNav(true)}
            >
              <Menu />
            </button>
            <span className="breadcrumb">
              Central de conteúdo <span>/</span>{" "}
              <b>{nav.find((x) => x[0] === view)?.[1]}</b>
            </span>
          </div>
          <div className="topbar-right">
            <span className="environment">
              <span className="live-dot" />
              Ambiente editorial
            </span>
            <a
              href="https://simuladorgtm-taglab-vercel.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Abrir TagLab
              <ArrowUpRight size={15} />
            </a>
          </div>
        </header>
        <main id="main" className="workspace">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {view === "overview" ? "VISÃO GERAL" : "CENTRAL DE CONTEÚDO"}
              </span>
              <h1>{titles[view][0]}</h1>
              <p>{titles[view][1]}</p>
            </div>
            {[
              "question",
              "trail",
              "activity",
              "suggestion",
              "overview",
            ].includes(view) && (
              <button
                className="button primary"
                onClick={() => add(view === "overview" ? "question" : view)}
              >
                <Plus size={17} />
                {view === "overview"
                  ? "Criar conteúdo"
                  : "Nova " + typeLabels[view].toLowerCase()}
              </button>
            )}
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
          {view === "overview" && (
            <>
              <section className="stats-grid" aria-label="Resumo do conteúdo">
                {[
                  [
                    FileQuestion,
                    items.filter((x) => x.type === "question").length,
                    "Questões no banco",
                    "Conteúdo para revisar e aprender",
                  ],
                  [
                    Route,
                    items.filter((x) => x.type === "trail").length,
                    "Trilhas de aprendizagem",
                    "Caminhos com começo e objetivo",
                  ],
                  [
                    CheckCheck,
                    published.length,
                    "Conteúdos publicados",
                    "Disponíveis para o TagLab",
                  ],
                  [
                    Clock3,
                    pending.length,
                    "Aguardando revisão",
                    "O próximo passo do time",
                  ],
                ].map(([Icon, n, label, detail]) => (
                  <article className="stat-card" key={label}>
                    <span className="stat-icon">
                      <Icon size={19} />
                    </span>
                    <b className="stat-value">{n}</b>
                    <h2>{label}</h2>
                    <small>{detail}</small>
                  </article>
                ))}
              </section>
              <div className="overview-columns">
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Continue de onde o time parou</h2>
                      <p>Os conteúdos atualizados mais recentemente.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => navigate("question")}
                    >
                      Ver banco
                      <ArrowRight size={15} />
                    </button>
                  </div>
                  <ContentTable items={items.slice(0, 6)} open={open} />
                </section>
                <aside className="publish-card">
                  <span className="pill">FLUXO EDITORIAL</span>
                  <h2>
                    Boa pergunta.
                    <br />
                    Melhor em conjunto.
                  </h2>
                  <p>
                    Prepare um rascunho, peça uma revisão e publique para quem
                    está aprendendo.
                  </p>
                  <ol>
                    <li>
                      <span>1</span>
                      <div>
                        <b>Crie com contexto</b>
                        <small>Enunciado, explicação e fonte.</small>
                      </div>
                    </li>
                    <li>
                      <span>2</span>
                      <div>
                        <b>Revise com o time</b>
                        <small>Clareza e aplicação na prática.</small>
                      </div>
                    </li>
                    <li>
                      <span>3</span>
                      <div>
                        <b>Publique no TagLab</b>
                        <small>Uma versão aprovada na API.</small>
                      </div>
                    </li>
                  </ol>
                  <button className="button" onClick={() => navigate("review")}>
                    Abrir fila de revisão
                    <ArrowRight size={15} />
                  </button>
                </aside>
              </div>
              <section className="quick-start">
                <span className="quick-icon">
                  <Lightbulb size={22} />
                </span>
                <div>
                  <h3>Aconteceu um problema interessante em um projeto?</h3>
                  <p>
                    Transforme o aprendizado em uma sugestão. Use exemplos
                    sintéticos e retire dados do cliente.
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => add("suggestion")}
                >
                  Registrar ideia
                  <Plus size={16} />
                </button>
              </section>
            </>
          )}
          {["question", "trail", "activity", "suggestion", "review"].includes(
            view,
          ) && (
            <section className="panel content-panel">
              <div className="filters">
                <label className="search-box">
                  <Search size={17} />
                  <input
                    aria-label="Buscar conteúdo"
                    placeholder="Buscar por título, ferramenta ou ID…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Filtrar por tema"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="">Todos os temas</option>
                  {topics.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {view !== "review" && (
                  <select
                    aria-label="Filtrar por status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Todos os status</option>
                    {Object.entries(statuses).map(([v, label]) => (
                      <option value={v} key={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="result-meta">
                <span>
                  {filtered.length}{" "}
                  {view === "review"
                    ? "itens para revisar"
                    : "conteúdos encontrados"}
                </span>
                <span>
                  <Filter size={13} />
                  IDs permanentes · histórico preservado
                </span>
              </div>
              <ContentTable items={filtered} open={open} />
              {!filtered.length && (
                <div className="empty-state">
                  <BookOpen size={32} />
                  <h3>
                    {view === "review"
                      ? "Tudo revisado por aqui."
                      : "Nenhum conteúdo encontrado."}
                  </h3>
                  <p>
                    {view === "review"
                      ? "Os rascunhos enviados pelo time aparecerão aqui."
                      : "Ajuste os filtros ou crie um novo conteúdo."}
                  </p>
                </div>
              )}
            </section>
          )}
          {view === "members" && <Members onNotice={setNotice} />}
          {view === "audit" && <Audit />}
          {view === "integration" && <Integration />}
          <footer className="workspace-footer">
            <span>TagLab Control · Conhecimento construído pelo time</span>
            <span>
              {drafts.length} rascunhos · {published.length} versões públicas
            </span>
          </footer>
        </main>
      </div>
      {editor && (
        <ContentEditor
          key={editor.key}
          item={editor.item}
          type={editor.type}
          items={items}
          canPublish={me.permissions.includes("publish")}
          onClose={closeEditor}
          onSave={save}
          onAction={action}
          busy={busy}
          message={editorMessage}
        />
      )}
    </div>
  );
}
function ContentTable({ items, open }) {
  return (
    <div className="table-wrap">
      <table className="content-table">
        <thead>
          <tr>
            <th>CONTEÚDO</th>
            <th>TEMA</th>
            <th>STATUS</th>
            <th>ATUALIZADO</th>
            <th>
              <span className="sr-only">Abrir</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>
                <button className="content-title" onClick={() => open(x)}>
                  {titleOf(x)}
                </button>
                <span className="content-subtitle">
                  {typeLabels[x.type]} <span>·</span> {x.id} <span>·</span> r
                  {x.revision}
                </span>
              </td>
              <td>
                <span className="topic-badge">
                  {topics
                    .find((t) => t.id === x.draft.topic)
                    ?.label.split(",")[0] || x.draft.topic}
                </span>
              </td>
              <td>
                <span className={"status " + x.status}>
                  {statuses[x.status]}
                </span>
                {x.published && x.status !== "published" && (
                  <small className="public-note">Versão anterior no ar</small>
                )}
              </td>
              <td className="date-cell">{formatDate(x.updated_at)}</td>
              <td>
                <button
                  className="icon-button"
                  aria-label={"Editar " + titleOf(x)}
                  onClick={() => open(x)}
                >
                  <ArrowUpRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Members({ onNotice }) {
  const [members, setMembers] = useState([]),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null);
  async function load() {
    const r = await api("members");
    setMembers(r.items);
  }
  useEffect(() => {
    load().catch((e) => onNotice(e.message));
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      await api("members", {
        method: "POST",
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          role: f.get("role"),
          enabled: f.get("enabled") === "on",
        }),
      });
      setSelected(null);
      e.target.reset();
      await load();
      onNotice(
        "Permissão salva. Nenhum convite por e-mail foi enviado; compartilhe o endereço da central com a pessoa.",
      );
    } catch (error) {
      onNotice(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="members-grid">
      <section className="panel padded">
        <h2>Pessoas autorizadas</h2>
        {members.map((m) => (
          <div className="member-row" key={m.email}>
            <span className="avatar">
              {(m.name || m.email).slice(0, 1).toUpperCase()}
            </span>
            <div>
              <b>{m.name || m.email}</b>
              <small>
                {m.email} · {profileNames[m.role]} ·{" "}
                {m.enabled ? "Ativo" : "Desativado"}
              </small>
            </div>
            <button className="text-button" onClick={() => setSelected(m)}>
              Editar
            </button>
          </div>
        ))}
      </section>
      <form
        className="panel padded member-form"
        key={selected?.email || "new"}
        onSubmit={submit}
      >
        <h2>{selected ? "Editar acesso" : "Adicionar ao time"}</h2>
        <p>
          A pessoa cria e verifica sua própria conta. Autorizar o e-mail libera
          o painel conforme o perfil.
        </p>
        <label>
          Nome
          <input
            name="name"
            defaultValue={selected?.name || ""}
            maxLength={120}
          />
        </label>
        <label>
          E-mail
          <input
            name="email"
            type="email"
            required
            defaultValue={selected?.email || ""}
            readOnly={!!selected}
          />
        </label>
        <label>
          Perfil
          <select name="role" defaultValue={selected?.role || "author"}>
            <option value="author">Autor · cria e envia para revisão</option>
            <option value="reviewer">Revisor · também publica e arquiva</option>
            <option value="admin">
              Administrador · também gerencia acessos
            </option>
          </select>
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={selected?.enabled ?? true}
          />
          Acesso ativo
        </label>
        <button className="button primary" disabled={busy}>
          {busy ? "Salvando…" : "Salvar acesso"}
        </button>
        {selected && (
          <button
            type="button"
            className="text-button"
            onClick={() => setSelected(null)}
          >
            Cancelar edição
          </button>
        )}
      </form>
    </div>
  );
}
function Audit() {
  const [rows, setRows] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    api("audit")
      .then((r) => setRows(r.items))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section className="panel padded">
      <h2>Últimas 100 ações</h2>
      {error && <p role="alert">{error}</p>}
      {rows.map((row) => (
        <div className="audit-row" key={row.id}>
          <span className="audit-dot" />
          <div>
            <b>{row.action}</b>
            <span>
              {row.content_id || "Configuração do time"} · {row.actor}
            </span>
          </div>
          <time>{new Date(row.created_at).toLocaleString("pt-BR")}</time>
        </div>
      ))}
    </section>
  );
}
function Integration() {
  const [origin, setOrigin] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return (
    <div className="integration-grid">
      <section className="panel padded">
        <span className="pill">API REST · V1</span>
        <h2>O catálogo publicado</h2>
        <p>
          O TagLab consulta este endpoint para receber questões, trilhas,
          atividades e sugestões. Rascunhos, usuários e histórico ficam na API
          administrativa.
        </p>
        <code className="endpoint">GET {origin}/api/v1/catalog</code>
        <div className="button-row">
          <button
            className="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(origin + "/api/v1/catalog");
                setMessage("Endpoint copiado.");
              } catch {
                setMessage("Copie o endereço exibido acima.");
              }
            }}
          >
            <Copy size={15} />
            Copiar endpoint
          </button>
          <a
            className="button"
            href="/api/v1/catalog"
            target="_blank"
            rel="noreferrer"
          >
            Abrir JSON
            <ArrowUpRight size={15} />
          </a>
        </div>
        <h3>Configuração no TagLab</h3>
        <p>
          Em <code>content-config.js</code>, defina <code>apiBaseUrl</code> com
          o domínio desta central. Autorize o domínio do TagLab em{" "}
          <code>TAGLAB_ORIGINS</code>.
        </p>
        <pre>
          {'window.TagLabContentConfig = {\n  apiBaseUrl: "' + origin + '"\n};'}
        </pre>
        <p>
          O catálogo é carregado ao abrir o TagLab. Se a central ficar
          indisponível, o banco incluído no site mantém o laboratório
          funcionando.
        </p>
        {message && <p role="status">{message}</p>}
      </section>
      <aside className="panel padded">
        <h2>O contrato da integração</h2>
        <ul className="contract-list">
          <li>
            <CheckCheck size={18} />
            <div>
              <b>Conteúdo publicado é público</b>
              <p>
                Inclui gabaritos e explicações. Serve para estudo, sem sigilo de
                prova.
              </p>
            </div>
          </li>
          <li>
            <History size={18} />
            <div>
              <b>IDs não mudam</b>
              <p>
                As edições preservam vínculos e chaves de progresso. Para uma
                pergunta diferente, crie outro ID.
              </p>
            </div>
          </li>
          <li>
            <Clock3 size={18} />
            <div>
              <b>Atualização na próxima abertura</b>
              <p>
                Cache de até 90 segundos. Uma sessão já aberta mantém a versão
                carregada.
              </p>
            </div>
          </li>
          <li>
            <Users size={18} />
            <div>
              <b>Painel com acesso individual</b>
              <p>
                Senha, sessão e credenciais do banco nunca vão para o TagLab.
              </p>
            </div>
          </li>
        </ul>
        <h3>Endpoints de leitura</h3>
        {["questions", "trails", "activities", "suggestions"].map((v) => (
          <p key={v}>
            <a href={"/api/v1/" + v} target="_blank" rel="noreferrer">
              <code>/api/v1/{v}</code>
            </a>
          </p>
        ))}
      </aside>
    </div>
  );
}
