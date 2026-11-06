"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, Layers3, ShieldCheck, ArrowLeft } from "lucide-react";
export default function SignIn() {
  const [mode, setMode] = useState("signin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const values = new FormData(event.currentTarget);
    try {
      let result;
      if (mode === "signin")
        result = await authClient.signIn.email({
          email,
          password: values.get("password"),
        });
      if (mode === "signup") {
        result = await authClient.signUp.email({
          email,
          password: values.get("password"),
          name: values.get("name"),
        });
        if (!result?.error)
          result = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "email-verification",
          });
      }
      if (mode === "verify")
        result = await authClient.emailOtp.verifyEmail({
          email,
          otp: values.get("otp"),
        });
      if (mode === "forgot")
        result = await authClient.emailOtp.requestPasswordReset({ email });
      if (mode === "reset")
        result = await authClient.emailOtp.resetPassword({
          email,
          otp: values.get("otp"),
          password: values.get("password"),
        });
      if (mode === "send-code")
        result = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification",
        });
      if (result?.error)
        throw Error(
          result.error.message ||
            "Não foi possível concluir. Confira os dados e tente novamente.",
        );
      if (mode === "signin") {
        window.location.assign("/");
        return;
      }
      if (mode === "signup" || mode === "send-code") {
        setMode("verify");
        setMessage(
          "Confira o código no seu e-mail. Criar uma conta não concede acesso ao painel: seu endereço precisa estar autorizado.",
        );
      }
      if (mode === "verify") {
        setMode("signin");
        setMessage("E-mail verificado. Entre com sua senha.");
      }
      if (mode === "forgot") {
        setMode("reset");
        setMessage(
          "Se o endereço puder receber a recuperação, você receberá um código por e-mail.",
        );
      }
      if (mode === "reset") {
        setMode("signin");
        setMessage("Senha atualizada. Entre novamente.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  const signup = mode === "signup";
  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand" href="/">
          <span className="brand-mark">
            <Layers3 size={23} />
          </span>
          <span>
            TagLab <b>Control</b>
          </span>
        </a>
        <div>
          <span className="eyebrow light">
            CONHECIMENTO QUE EVOLUI COM O TIME
          </span>
          <h1>
            Quem aprende
            <br />
            também constrói.
          </h1>
          <p>
            Um lugar para transformar a experiência do time em questões, trilhas
            e atividades que fazem sentido na prática.
          </p>
          <div className="auth-proof">
            <ShieldCheck size={20} />
            <span>
              Conteúdo revisado. Publicação consciente.
              <br />
              Histórico que preserva o trabalho.
            </span>
          </div>
        </div>
        <small>Central editorial do TagLab · Acesso do time</small>
      </section>
      <section className="auth-form-wrap">
        <form onSubmit={submit} className="auth-form">
          <a className="back-link" href="/">
            <ArrowLeft size={15} />
            Voltar à central
          </a>
          <span className="eyebrow">ACESSO DO TIME</span>
          <h2>
            {signup
              ? "Crie sua conta"
              : mode === "verify"
                ? "Verifique seu e-mail"
                : mode === "forgot"
                  ? "Recuperar acesso"
                  : mode === "reset"
                    ? "Nova senha"
                    : "Bom ter você por aqui."}
          </h2>
          <p>Use um endereço autorizado pelo administrador da central.</p>
          {signup && (
            <label>
              Seu nome
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {["signin", "signup", "reset"].includes(mode) && (
            <label>
              Senha
              <input
                type="password"
                name="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                minLength={12}
                maxLength={128}
                required
              />
            </label>
          )}
          {["verify", "reset"].includes(mode) && (
            <label>
              Código de verificação
              <input
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
            </label>
          )}
          {message && (
            <div className="notice" role="status">
              {message}
            </div>
          )}
          <button className="button primary" disabled={busy}>
            {busy
              ? "Aguarde…"
              : signup
                ? "Criar conta"
                : mode === "verify"
                  ? "Verificar código"
                  : mode === "forgot"
                    ? "Enviar recuperação"
                    : mode === "reset"
                      ? "Atualizar senha"
                      : mode === "send-code"
                        ? "Enviar código"
                        : "Entrar na central"}
            <ArrowRight size={17} />
          </button>
          <div className="auth-actions">
            <button
              type="button"
              onClick={() => {
                setMode(signup ? "signin" : "signup");
                setMessage("");
              }}
            >
              {signup ? "Já tenho uma conta" : "Primeiro acesso? Criar conta"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("send-code");
                setMessage(
                  "Informe o e-mail e clique em Entrar na central para receber um código.",
                );
              }}
            >
              Verificar e-mail
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setMessage("");
              }}
            >
              Esqueci a senha
            </button>
          </div>
          <small className="muted">
            A autenticação é gerenciada pelo Neon Auth. O TagLab não recebe sua
            senha nem a sessão do painel.
          </small>
        </form>
      </section>
    </main>
  );
}
