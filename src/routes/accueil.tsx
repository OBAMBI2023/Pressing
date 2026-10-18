import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, PackagePlus, MapPinned, History, Gift, Store, ChevronRight } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { useStore, STEPS } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/accueil")({
  head: () =>
    seo("Tableau de bord", "Votre espace client Laundry : nouvelle commande, suivi et historique."),
  component: Dashboard,
});

function Dashboard() {
  const { user, orders } = useStore();
  const current = orders.find((o) => o.step < 5);
  const tiles = [
    { to: "/commandes", label: "Historique", icon: History },
    { to: "/fidelite", label: "Fidélité", icon: Gift },
    { to: "/depot", label: "Dépôt", icon: Store },
  ] as const;
  return (
    <AppShell
      back={false}
      right={
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary"
        >
          <Bell className="h-5 w-5" />
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">Bonjour,</p>
      <h2 className="mb-4 text-2xl font-extrabold text-navy">{user?.name ?? "Invité"}</h2>
      <div className="mb-5 rounded-3xl bg-brand p-6 text-primary-foreground">
        <p className="text-xl font-bold">Votre linge, notre expertise !</p>
        <p className="mt-1 text-sm opacity-80">Qualité • Rapidité • Confiance</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ActionCard
          to="/services"
          icon={PackagePlus}
          title="Nouvelle commande"
          desc="Lancez votre demande en quelques clics"
        />
        <ActionCard
          to={current ? "/suivi/$id" : "/commandes"}
          params={current ? { id: current.id } : undefined}
          icon={MapPinned}
          title="Suivi de commande"
          desc={current ? `#${current.id} • ${STEPS[current.step]}` : "Aucune commande en cours"}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-medium text-navy shadow-card"
          >
            <t.icon className="h-6 w-6 text-primary" />
            {t.label}
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function ActionCard({
  to,
  params,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  params?: { id: string };
  icon: typeof Bell;
  title: string;
  desc: string;
}) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={to as any} params={params as any}>
      <Card className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-action text-primary-foreground">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy">{title}</p>
          <p className="truncate text-sm text-muted-foreground">{desc}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Card>
    </Link>
  );
}
