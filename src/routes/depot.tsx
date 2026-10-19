import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Store } from "lucide-react";
import { AppShell, Card, DemoBadge, btn, btnOutline } from "@/components/AppShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/depot")({
  head: () => seo("Dépôt et retrait", "Trouvez un point de collecte Laundry proche de vous."),
  component: Depot,
});

const POINTS = [
  { n: "Pressing Riviera 3", a: "Riviera 3, Abidjan", d: "1,2 km" },
  { n: "Pressing Cocody Angré", a: "Angré 8e tranche, Abidjan", d: "3,4 km" },
  { n: "Pressing Plateau", a: "Avenue Chardy, Plateau", d: "7,9 km" },
];

function Depot() {
  return (
    <AppShell title="Dépôt / Retrait">
      <Card className="mb-5 flex flex-col items-center gap-3 text-center">
        <Store className="h-14 w-14 text-primary" />
        <h2 className="text-xl font-extrabold text-navy">
          Déposez votre linge dans nos points de collecte
        </h2>
        <p className="text-sm text-muted-foreground">Rapide, simple et sans rendez-vous.</p>
        <Link to="/services" className={btn}>
          Préparer un dépôt
        </Link>
        <Link to="/commandes" className={btnOutline}>
          Voir mes dépôts
        </Link>
      </Card>
      <p className="mb-3 flex items-center gap-2 font-bold text-navy">
        Nos points de collecte <DemoBadge />
      </p>
      <div className="space-y-3">
        {POINTS.map((p) => (
          <Card key={p.n} className="flex items-center gap-3">
            <MapPin className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{p.n}</p>
              <p className="text-xs text-muted-foreground">{p.a}</p>
              <p className="text-xs font-semibold text-success">Ouvert • 7h - 20h</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-primary">{p.d}</span>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
