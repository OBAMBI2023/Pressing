import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo, btn, btnOutline, input } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/connexion")({
  validateSearch: (s: Record<string, unknown>) =>
    ({ mode: s["mode"] === "inscription" ? "inscription" : "connexion" }) as {
      mode: "connexion" | "inscription";
    },
  head: () => seo("Connexion", "Connectez-vous ou créez votre compte Laundry (simulation)."),
  component: Auth,
});

type AuthErrors = Partial<Record<"name" | "email" | "password", string>>;

function Auth() {
  const { mode } = Route.useSearch();
  const { login } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState<AuthErrors>({});
  const signup = mode === "inscription";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: AuthErrors = {};
    if (signup && f.name.trim().length < 2) er.name = "Indiquez votre nom.";
    if (!/^\S+@\S+\.\S+$/.test(f.email) && !/^\+?\d{8,}$/.test(f.email.replace(/\s/g, "")))
      er.email = "Email ou téléphone invalide.";
    if (f.password.length < 6) er.password = "6 caractères minimum.";
    setErr(er);
    if (Object.keys(er).length) return;
    login(f.name.trim() || "M. Kouassi", f.email);
    nav({ to: "/accueil" });
  };
  const demo = () => {
    login("M. Kouassi", "kouassi@gmail.com");
    nav({ to: "/accueil" });
  };

  return (
    <div className="min-h-screen bg-brand px-6 py-10">
      <div className="mx-auto max-w-sm">
        <div className="mb-8 text-center">
          <Logo light />
          <p className="mt-1 text-sm text-primary-foreground/70">Propre. Simple. Pour vous.</p>
        </div>
        <form
          onSubmit={submit}
          className="space-y-4 rounded-3xl bg-card p-6 shadow-card"
          noValidate
        >
          <h1 className="text-xl font-bold text-navy">
            {signup ? "Créer un compte" : "Se connecter"}
          </h1>
          {signup && (
            <Field label="Nom complet" error={err.name}>
              <input
                className={input}
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
            </Field>
          )}
          <Field label="Email ou téléphone" error={err.email}>
            <input
              className={input}
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </Field>
          <Field label="Mot de passe" error={err.password}>
            <input
              type="password"
              className={input}
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
            />
          </Field>
          <button type="submit" className={btn}>
            {signup ? "Créer mon compte" : "Se connecter"}
          </button>
          <button type="button" onClick={demo} className={btnOutline}>
            Continuer avec le compte démo
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {signup ? "Déjà un compte ? " : "Pas encore de compte ? "}
            <Link
              to="/connexion"
              search={{ mode: signup ? "connexion" : "inscription" }}
              className="font-semibold text-primary"
            >
              {signup ? "Se connecter" : "Créer un compte"}
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Connexion simulée — aucune donnée n'est envoyée.
          </p>
        </form>
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
