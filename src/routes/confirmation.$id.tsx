import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AppShell, Card, btn, btnOutline } from "@/components/AppShell";
import { fmt, useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/confirmation/$id")({
  head: () => seo("Confirmation", "Votre commande de démonstration est enregistrée."),
  component: Confirm,
});

function Confirm() {
  const { id } = Route.useParams();
  const o = useStore().orders.find((x) => x.id === id);
  return (
    <AppShell title="Confirmation" back={false}>
      <Card className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <h2 className="text-2xl font-extrabold text-navy">Commande enregistrée !</h2>
        {o ? <>
          <p className="text-muted-foreground">Commande <b>#{o.id}</b> • {fmt(o.total)}</p>
          <p className="text-sm text-muted-foreground">{o.logistics.address} • {new Date(o.logistics.date).toLocaleDateString("fr-FR")} • {o.logistics.slot}</p>
        </> : <p className="text-muted-foreground">Commande introuvable.</p>}
        <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">Simulation : la commande est enregistrée uniquement sur cet appareil. Aucun pressing ni livreur n'a été contacté.</p>
      </Card>
      <div className="mt-5 space-y-3">
        {o && <Link to="/suivi/$id" params={{ id: o.id }} className={btn}>Suivre ma commande</Link>}
        <Link to="/accueil" className={btnOutline}>Retour à l'accueil</Link>
      </div>
    </AppShell>
  );
}
