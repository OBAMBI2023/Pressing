import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { AppShell, Card, DemoBadge } from "@/components/AppShell";
import { STEPS, isDelivered, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/notifications")({
  head: () => seo("Notifications", "Restez informé à chaque étape de votre commande."),
  component: Notifs,
});

function Notifs() {
  const { orders } = useStore();
  const list = [
    ...orders.slice(0, 4).map((o) => ({
      id: o.id,
      t: `Commande #${o.id}`,
      d: isDelivered(o) ? "Livrée. Bon pour votre linge !" : `Statut : ${STEPS[o.step]}.`,
    })),
    { id: null, t: "Offre spéciale", d: "-20 % sur le nettoyage à sec toute la semaine !" },
    { id: null, t: "Rappel", d: "Votre point de collecte est ouvert de 7h à 20h." },
  ];
  return (
    <AppShell title="Notifications" right={<DemoBadge />}>
      <div className="space-y-3">
        {list.map((n, i) => {
          const body = (
            <Card className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-navy">{n.t}</p>
                <p className="text-sm text-muted-foreground">{n.d}</p>
              </div>
            </Card>
          );
          return n.id ? (
            <Link key={i} to="/suivi/$id" params={{ id: n.id }} className="block">
              {body}
            </Link>
          ) : (
            <div key={i}>{body}</div>
          );
        })}
      </div>
    </AppShell>
  );
}
