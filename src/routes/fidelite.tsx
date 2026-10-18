import { createFileRoute } from "@tanstack/react-router";
import { Gift, Users, Tag, Repeat } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Card, DemoBadge, btn } from "@/components/AppShell";
import { fmt, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/fidelite")({
  head: () => seo("Programme de fidélité", "Cumulez des points et profitez d'offres exclusives."),
  component: Fidelite,
});

function Fidelite() {
  const { points } = useStore();
  const perks = [
    { icon: Users, t: "Parrainage", d: "Invitez vos proches et gagnez jusqu'à 5 000 FCFA" },
    { icon: Tag, t: "Offres spéciales", d: "-20 % sur le nettoyage à sec cette semaine" },
    { icon: Repeat, t: "Abonnements", d: "Un service pratique et économique" },
  ];
  return (
    <AppShell title="Avantages Laundry">
      <div className="mb-4 flex items-center justify-between rounded-3xl bg-brand p-6 text-primary-foreground">
        <div><p className="text-xl font-bold">Fidélité</p><p className="text-sm opacity-80">Plus vous commandez, plus vous profitez !</p></div>
        <Gift className="h-12 w-12 text-teal" />
      </div>
      <Card className="mb-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">Mes points <DemoBadge /></p>
        <p className="text-4xl font-extrabold text-primary">{points} <span className="text-lg">points</span></p>
        <p className="mb-4 text-sm text-accent-foreground">= {fmt(points * 5)} de réduction</p>
        <button onClick={() => toast("Récompenses bientôt disponibles (démo).")} className={btn}>Voir mes récompenses</button>
      </Card>
      <div className="space-y-3">
        {perks.map((p) => (
          <button key={p.t} onClick={() => toast(`${p.t} : fonctionnalité de démonstration.`)} className="w-full text-left">
            <Card className="flex items-center gap-4"><p.icon className="h-7 w-7 shrink-0 text-primary" /><div><p className="font-semibold text-navy">{p.t}</p><p className="text-sm text-muted-foreground">{p.d}</p></div></Card>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
