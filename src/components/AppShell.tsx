import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, ClipboardList, ShoppingBasket, User, Droplet } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

export function DemoBadge() {
  return (
    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
      Démo
    </span>
  );
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-extrabold ${light ? "text-primary-foreground" : "text-navy"}`}
    >
      <Droplet className="h-6 w-6 fill-primary text-primary" /> Laundry
    </span>
  );
}

export function AppShell({
  title,
  back = true,
  children,
  right,
}: {
  title?: string;
  back?: boolean;
  children: ReactNode;
  right?: ReactNode;
}) {
  const router = useRouter();
  const { cart } = useStore();
  const count = cart.reduce((a, l) => a + l.qty, 0);
  const nav = [
    { to: "/accueil", label: "Accueil", icon: Home },
    { to: "/commandes", label: "Commandes", icon: ClipboardList },
    { to: "/panier", label: "Panier", icon: ShoppingBasket, badge: count },
    { to: "/profil", label: "Profil", icon: User },
  ] as const;
  return (
    <div className="min-h-screen bg-background md:py-6">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background md:min-h-[calc(100vh-3rem)] md:max-w-3xl md:rounded-3xl md:bg-card md:shadow-card">
        <header className="sticky top-0 z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-background/90 px-5 py-4 backdrop-blur md:rounded-t-3xl md:bg-card/90">
          {back ? (
            <button
              aria-label="Retour"
              onClick={() => router.history.back()}
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <Logo />
          )}
          <h1 className="truncate text-lg font-bold text-navy">{title}</h1>
          <div className="shrink-0">{right}</div>
        </header>
        <main className="flex-1 px-5 pb-28">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-card md:max-w-3xl md:rounded-b-3xl">
          <ul className="grid grid-cols-4">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="relative flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground"
                  activeProps={{ className: "text-primary font-semibold" }}
                >
                  <n.icon className="h-5 w-5" />
                  {n.label}
                  {"badge" in n && n.badge > 0 && (
                    <span className="absolute right-6 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-teal px-1 text-[10px] font-bold text-navy">
                      {n.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export const btn =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-action px-6 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40";
export const btnOutline =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-secondary";
export const input =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
