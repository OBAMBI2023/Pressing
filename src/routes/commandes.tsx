import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, DemoBadge, btn } from "@/components/AppShell";
import { fmt, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/commandes")({
  head: () => seo("Historique des commandes", "Consultez toutes vos commandes et leur statut."),
  component: Commandes,
});

function Commandes() {
  const { orders } = useStore();
  const [tab, setTab] = useState<"all" | "done" | "current">("all");
  const list = orders.filter((o) => tab === "all" || (tab === "done" ? o.step >= 5 : o.step < 5));
  const tabs = [["all", "Toutes"], ["done", "Livrées"], ["current", "En cours"]] as const;
  return (
    <AppShell title="Historique des commandes">
      <div className="mb-4 grid grid-cols-3 gap-2">
        {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`rounded-full py-2 text-sm font-semibold ${tab === k ? "bg-primary text-primary-foreground" : "bg-secondary text-navy"}`}>{l}</button>)}
      </div>
      {list.length === 0 ? (
        <Card className="text-center"><p className="mb-4 text-muted-foreground">Aucune commande ici.</p><Link to="/services" className={btn}>Nouvelle commande</Link></Card>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <Link key={o.id} to="/suivi/$id" params={{ id: o.id }} className="block">
              <Card className="flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-2 font-bold text-navy">#{o.id} {o.demo && <DemoBadge />}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("fr-FR")}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${o.step >= 5 ? "bg-success/15 text-success" : "bg-teal/20 text-accent-foreground"}`}>{o.step >= 5 ? "Livrée" : "En cours"}</span>
                </div>
                <span className="font-bold text-navy">{fmt(o.total)}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
