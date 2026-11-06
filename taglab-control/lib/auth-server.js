import { createNeonAuth } from "@neon/auth/next/server";
let instance;
export function authServer() {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET)
    throw new Error("Autenticação não configurada.");
  return (instance ??= createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL,
    cookies: {
      secret: process.env.NEON_AUTH_COOKIE_SECRET,
      sessionDataTtl: 30,
    },
  }));
}
