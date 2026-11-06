import { createHash } from "node:crypto";
import { AppError, permit } from "./domain.mjs";
export function createAPI({ service, getUser, origin, taglabOrigins = [] }) {
  return async function handle(request) {
    const url = new URL(request.url);
    const path = url.pathname.split("/").filter(Boolean).slice(1);
    const method = request.method;
    const isPublic = path[0] === "v1";
    const corsOrigin = request.headers.get("origin");
    const headers = new Headers({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (isPublic) {
      headers.set("Vary", "Origin");
      if (corsOrigin && taglabOrigins.includes(corsOrigin)) {
        headers.set("Access-Control-Allow-Origin", corsOrigin);
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "If-None-Match");
        headers.set("Access-Control-Expose-Headers", "ETag");
      }
    }
    const json = (data, status = 200) =>
      Response.json(data, { status, headers });
    try {
      if (method === "OPTIONS" && isPublic) {
        if (corsOrigin && !taglabOrigins.includes(corsOrigin))
          throw new AppError(
            403,
            "Origem não autorizada para leitura no navegador.",
          );
        return new Response(null, { status: 204, headers });
      }
      if (method === "GET" && path.join("/") === "health")
        return json({ status: "ok", service: "taglab-control", apiVersion: 1 });
      if (isPublic) {
        if (method !== "GET")
          throw new AppError(405, "A API do TagLab permite apenas leitura.");
        if (
          ![
            "catalog",
            "questions",
            "trails",
            "activities",
            "suggestions",
          ].includes(path[1]) ||
          path.length !== 2
        )
          throw new AppError(404, "Endpoint não encontrado.");
        const catalog = await service.catalog();
        let body = catalog;
        if (path[1] !== "catalog") {
          let items = catalog[path[1]];
          const topic = url.searchParams.get("topic");
          const level = url.searchParams.get("level");
          const query = (url.searchParams.get("q") || "")
            .slice(0, 120)
            .toLowerCase();
          if (topic) items = items.filter((x) => x.topic === topic);
          if (level) items = items.filter((x) => x.level === level);
          if (query)
            items = items.filter((x) =>
              JSON.stringify(x).toLowerCase().includes(query),
            );
          body = {
            schemaVersion: 1,
            version: catalog.version,
            total: items.length,
            items,
          };
        }
        const etag =
          '"' +
          createHash("sha256")
            .update(JSON.stringify(body))
            .digest("hex")
            .slice(0, 32) +
          '"';
        headers.set("ETag", etag);
        headers.set(
          "Cache-Control",
          "public, max-age=0, s-maxage=60, stale-while-revalidate=30",
        );
        if (request.headers.get("if-none-match") === etag)
          return new Response(null, { status: 304, headers });
        return json(body);
      }
      if (path[0] !== "admin")
        throw new AppError(404, "Endpoint não encontrado.");
      const user = await getUser();
      if (!user) throw new AppError(401, "Entre para acessar a central.");
      const actor = await service.member(user);
      if (!actor)
        throw new AppError(
          403,
          "Sua conta ainda não foi autorizada pelo administrador.",
        );
      if (!["GET", "HEAD"].includes(method)) {
        if (!origin || corsOrigin !== origin)
          throw new AppError(
            403,
            "Origem inválida. Atualize a configuração da aplicação.",
          );
        if (
          !request.headers.get("content-type")?.startsWith("application/json")
        )
          throw new AppError(415, "Envie JSON.");
        if (Number(request.headers.get("content-length")) > 200000)
          throw new AppError(413, "O conteúdo excede 200 KB.");
      }
      let input;
      async function body() {
        if (input) return input;
        const text = await request.text();
        if (Buffer.byteLength(text) > 200000)
          throw new AppError(413, "O conteúdo excede 200 KB.");
        try {
          input = JSON.parse(text);
        } catch {
          throw new AppError(400, "JSON inválido.");
        }
        if (!input || Array.isArray(input) || typeof input !== "object")
          throw new AppError(422, "Informe um objeto JSON.");
        return input;
      }
      if (path[1] === "me" && method === "GET")
        return json({
          user: { name: user.name, email: actor.email, role: actor.role },
          permissions: (await import("./domain.mjs")).roles[actor.role],
        });
      if (path[1] === "audit" && method === "GET")
        return json({ items: await service.audit(actor) });
      if (path[1] === "members" && method === "GET")
        return json({ items: await service.members(actor) });
      if (path[1] === "members" && method === "POST")
        return json(await service.saveMember(actor, await body()));
      if (path[1] === "content") {
        if (path.length === 2 && method === "GET")
          return json({
            items: await service.list(actor, {
              type: url.searchParams.get("type"),
              status: url.searchParams.get("status"),
              query: url.searchParams.get("q") || "",
            }),
          });
        if (path.length === 2 && method === "POST")
          return json(await service.create(actor, await body()), 201);
        if (path.length === 3 && method === "GET")
          return json(await service.get(actor, path[2]));
        if (path.length === 3 && method === "PATCH")
          return json(await service.update(actor, path[2], await body()));
        if (path.length === 4 && method === "POST")
          return json(
            await service.transition(actor, path[2], {
              ...(await body()),
              action: path[3],
            }),
          );
      }
      permit(actor, "read");
      throw new AppError(404, "Endpoint ou método não encontrado.");
    } catch (error) {
      if (error instanceof AppError)
        return json(
          { error: error.message, details: error.details },
          error.status,
        );
      console.error("Control API failure:", error.code || error.name);
      return json(
        {
          error:
            "Não foi possível concluir. Tente novamente; se persistir, confira a configuração e os logs do servidor.",
        },
        500,
      );
    }
  };
}
