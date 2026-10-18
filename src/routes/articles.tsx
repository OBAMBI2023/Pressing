import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { AppShell, Card, btn } from "@/components/AppShell";
import { ITEMS, SERVICES, fmt, subtotalOf, useStore, type ServiceId } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/articles")({
  validateSearch: (s: Record<string, unknown>): { service: ServiceId } => ({
    service: (["lavage", "repassage", "sec"].includes(s.service as string) ? s.service : "lavage") as ServiceId,
  }),
  head: () => seo("Vos articles", "Sélectionnez vos vêtements et quantités."),
  component: Articles,
});

function Articles() {
  const { service } = Route.useSearch();
  const { cart, setQty } = useStore();
  const count = cart.reduce((a, l) => a + l.qty, 0);
  return (
    <AppShell title="Sélection des vêtements">
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {SERVICES.map((s) => (
          <Link key={s.id} to="/articles" search={{ service: s.id }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${s.id === service ? "bg-primary text-primary-foreground" : "bg-secondary text-navy"}`}>{s.name}</Link>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ITEMS.map((it) => {
          const qty = cart.find((l) => l.key === `${it.id}-${service}`)?.qty ?? 0;
          return (
            <Card key={it.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="font-semibold text-navy">{it.name}</p><p className="text-sm text-primary">{fmt(it.prices[service])} / pièce</p></div>
              <div className="flex shrink-0 items-center gap-3">
                <button aria-label={`Retirer ${it.name}`} disabled={!qty} onClick={() => setQty(it.id, service, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                <span className="w-5 text-center font-bold text-navy">{qty}</span>
                <button aria-label={`Ajouter ${it.name}`} onClick={() => setQty(it.id, service, qty + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="sticky bottom-20 mt-6 rounded-2xl bg-card p-4 shadow-card">
        <div className="mb-3 flex justify-between text-sm"><span className="text-muted-foreground">{count} article(s)</span><span className="font-bold text-navy">{fmt(subtotalOf(cart))}</span></div>
        {count ? <Link to="/livraison" className={btn}>Continuer</Link> : <button disabled className={btn}>Ajoutez au moins un article</button>}
      </div>
    </AppShell>
  );
}
