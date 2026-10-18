import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell, Card, DemoBadge, btn } from "@/components/AppShell";
import { STEPS, fmt, itemOf, serviceOf, useStore } from "@/lib/store";
import { Row } from "./panier";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/suivi/$id")({
  head: () => seo("Suivi de commande", "Suivez chaque étape de votre commande."),
  component: Suivi,
});

const PAY = { mobile: "Mobile Money", carte: "Carte bancaire", retrait: "Paiement au retrait" };

function Suivi() {
  const { id } = Route.useParams();
  const o = useStore().orders.find((x) => x.id === id);
  if (!o)
    return (
      <AppShell title="Suivi">
        <Card className="text-center">
          <p className="mb-4">Commande introuvable.</p>
          <Link to="/commandes" className={btn}>
            Mes commandes
          </Link>
        </Card>
      </AppShell>
    );
  const steps =
    o.logistics.mode === "pressing"
      ? [...STEPS.slice(0, 5), "Prêt au retrait"].map((s, i) => (i === 1 ? "Dépôt au pressing" : s))
      : STEPS;
  return (
    <AppShell title="Suivi de commande">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xl font-extrabold text-navy">#{o.id}</span>
        <span className="flex gap-2">
          {o.demo && <DemoBadge />}
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${o.step >= 5 ? "bg-success/15 text-success" : "bg-teal/20 text-accent-foreground"}`}
          >
            {o.step >= 5 ? "Livrée" : "En cours"}
          </span>
        </span>
      </div>
      <Card>
        <ol className="space-y-0">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-full ${i <= o.step ? "bg-teal text-navy" : "bg-muted text-muted-foreground"}`}
                >
                  {i < o.step ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-8 w-0.5 ${i < o.step ? "bg-teal" : "bg-border"}`} />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={`font-semibold ${i <= o.step ? "text-navy" : "text-muted-foreground"}`}
                >
                  {s}
                </p>
                {i === o.step && <p className="text-xs text-primary">Étape actuelle</p>}
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <Card className="mt-4 space-y-2 text-sm">
        {o.lines.map((l) => (
          <Row
            key={l.key}
            k={`${itemOf(l.item).name} (x${l.qty}) • ${serviceOf(l.service).name}`}
            v=""
          />
        ))}
        <Row k="Prise en charge" v={o.logistics.mode === "domicile" ? "Domicile" : "Pressing"} />
        <Row k="Paiement" v={PAY[o.payment]} />
        <div className="border-t border-border pt-2">
          <Row k="Total" v={fmt(o.total)} bold />
        </div>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Statut simulé à titre de démonstration.
      </p>
    </AppShell>
  );
}
