import { database } from "@/lib/db.mjs";
import { contentService } from "@/lib/service.mjs";
import { createAPI } from "@/lib/http.mjs";
import { authServer } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
async function handle(request) {
  try {
    return await createAPI({
      service: contentService(database()),
      getUser: async () => {
        if (!request.headers.get("cookie")) return null;
        const result = await authServer().getSession();
        return result.data?.user || null;
      },
      origin: process.env.APP_ORIGIN,
      taglabOrigins: (process.env.TAGLAB_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })(request);
  } catch (error) {
    console.error("Control configuration:", error.name);
    return Response.json(
      {
        error:
          "A central ainda precisa da configuração do banco e da autenticação.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
export {
  handle as GET,
  handle as POST,
  handle as PATCH,
  handle as OPTIONS,
  handle as DELETE,
  handle as PUT,
};
