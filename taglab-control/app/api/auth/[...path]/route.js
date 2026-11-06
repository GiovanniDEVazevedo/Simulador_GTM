import { authServer } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
async function handle(request, context) {
  return authServer().handler()[request.method](request, context);
}
export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
