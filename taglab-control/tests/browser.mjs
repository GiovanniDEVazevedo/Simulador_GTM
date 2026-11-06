// Tests exercise the real editorial service and PostgreSQL engine with a simulated verified identity.
// They do not claim to verify delivery of Neon emails or a human's login.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { chromium } from "playwright";
import { contentService } from "../lib/service.mjs";
import { createAPI } from "../lib/http.mjs";
import { seed } from "../scripts/seed.mjs";
const origin = "http://127.0.0.1:4317";
let server, browser, pg, service;
before(async () => {
  pg = new PGlite();
  const query = (sql, values) => pg.query(sql, values);
  const db = { query, connect: async () => ({ query, release() {} }) };
  await pg.exec(
    await readFile(new URL("../db/001-initial.sql", import.meta.url), "utf8"),
  );
  await seed(db, "owner@taglab.example");
  await query(
    "INSERT INTO control_members(email,role) VALUES('author@taglab.example','author')",
  );
  service = contentService(db);
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "4317",
    ],
    {
      cwd: new URL("..", import.meta.url),
      stdio: "pipe",
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    },
  );
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  assert(ready, "Next production server did not become ready");
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
  server?.kill();
  await pg?.close();
});
async function open(
  email = "owner@taglab.example",
  viewport = { width: 1440, height: 1000 },
) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const handler = createAPI({
    service,
    getUser: async () =>
      email
        ? {
            id: email,
            email,
            emailVerified: true,
            name: email.startsWith("owner") ? "Giovanni" : "Autor",
          }
        : null,
    origin,
    taglabOrigins: [],
  });
  await page.route("**/api/admin/**", async (route) => {
    const source = route.request();
    const request = new Request(source.url(), {
      method: source.method(),
      headers: { ...source.headers(), origin },
      ...(!["GET", "HEAD"].includes(source.method())
        ? { body: source.postData() }
        : {}),
    });
    const response = await handler(request);
    await route.fulfill({
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.text(),
    });
  });
  await page.goto(origin);
  await page
    .getByRole("heading", {
      name: email
        ? "Seu time. Mais conhecimento."
        : "O conhecimento do time começa aqui.",
    })
    .waitFor();
  return { page, context, errors };
}
test("visitor sees restricted entry and real sign-in UI without editorial data", async () => {
  const s = await open(null);
  try {
    await s.page.getByRole("link", { name: "Entrar na central" }).click();
    await s.page
      .getByRole("heading", { name: "Bom ter você por aqui." })
      .waitFor();
    await s.page
      .getByRole("button", { name: "Primeiro acesso? Criar conta" })
      .click();
    await s.page.getByLabel("Seu nome").waitFor();
    assert.deepEqual(s.errors, []);
  } finally {
    await s.context.close();
  }
});
test("editor creates a question and reviewer publishes; edits keep the previous public version", async () => {
  const s = await open();
  try {
    await s.page
      .getByRole("button", { name: "Criar conteúdo", exact: true })
      .click();
    await s.page.getByLabel("ID permanente").fill("browser-questao");
    await s.page
      .getByLabel("Enunciado", { exact: true })
      .fill("Qual ferramenta configura o disparo de tags no site?");
    for (const [letter, text] of [
      ["A", "Google Tag Manager"],
      ["B", "Planilha de estoque"],
      ["C", "Editor de imagens"],
      ["D", "Agenda do time"],
    ])
      await s.page
        .getByLabel("Texto da alternativa " + letter, { exact: true })
        .fill(text);
    await s.page
      .getByLabel("Explicação da resposta")
      .fill("O Google Tag Manager organiza tags, acionadores e variáveis.");
    await s.page
      .getByLabel("Impacto em uma implementação real")
      .fill("Permite controlar o momento e os dados usados pelo disparo.");
    await s.page
      .getByLabel("Título", { exact: true })
      .fill("Documentação oficial GTM");
    await s.page
      .getByLabel("URL HTTPS")
      .fill("https://developers.google.com/tag-platform/tag-manager");
    await s.page
      .getByRole("button", { name: "Salvar rascunho", exact: true })
      .click();
    await s.page.getByText("Rascunho salvo.", { exact: false }).waitFor();
    assert(
      !(await service.catalog()).questions.some(
        (q) => q.id === "browser-questao",
      ),
    );
    await s.page
      .getByRole("button", { name: "Enviar para revisão", exact: true })
      .click();
    await s.page
      .getByRole("button", { name: "Publicar no TagLab", exact: true })
      .click();
    await s.page.getByText("Publicado. O catálogo", { exact: false }).waitFor();
    assert(
      (await service.catalog()).questions.some(
        (q) => q.id === "browser-questao",
      ),
    );
    await s.page
      .getByLabel("Enunciado", { exact: true })
      .fill("Qual solução organiza tags e acionadores no navegador?");
    await s.page
      .getByRole("button", { name: "Salvar rascunho", exact: true })
      .click();
    await s.page.getByText("Rascunho salvo.", { exact: false }).waitFor();
    assert(
      (await service.catalog()).questions
        .find((q) => q.id === "browser-questao")
        .question.includes("configura o disparo"),
    );
    await s.page.getByRole("button", { name: "Fechar editor" }).click();
    await s.page
      .getByRole("button", { name: "Histórico", exact: true })
      .click();
    await s.page
      .getByRole("heading", { name: "Cada mudança tem uma história" })
      .waitFor();
    assert.deepEqual(s.errors, []);
  } finally {
    await s.context.close();
  }
});
test("mobile navigation and author permissions remain usable", async () => {
  const s = await open("author@taglab.example", { width: 390, height: 844 });
  try {
    await s.page.getByRole("button", { name: "Abrir navegação" }).click();
    await s.page.getByRole("button", { name: "Questões", exact: true }).click();
    await s.page
      .getByRole("button", { name: "Nova questão", exact: true })
      .waitFor();
    assert.equal(
      await s.page.getByRole("button", { name: "Equipe", exact: true }).count(),
      0,
    );
    assert.equal(
      await s.page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    assert.deepEqual(s.errors, []);
  } finally {
    await s.context.close();
  }
});
