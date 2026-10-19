import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import { AppShell, Card, btn, btnOutline } from "@/components/AppShell";
import {
  feeOf,
  fmt,
  formatDate,
  itemOf,
  linePrice,
  serviceOf,
  subtotalOf,
  useStore,
} from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/panier")({
  head: () => seo("Panier", "Récapitulatif de vos articles et du prix total."),
  component: Panier,
});

function Panier() {
  const { cart, setQty, logistics } = useStore();
  if (!cart.length)
    return (
      <AppShell title="Panier">
        <Card className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
          <ShoppingBasket className="h-12 w-12 text-muted-foreground" />
          <p className="font-semibold text-navy">Votre panier est vide</p>
          <Link to="/services" className={btn}>
            Choisir un service
          </Link>
        </Card>
      </AppShell>
    );
  const sub = subtotalOf(cart);
  const ready = !!logistics.slot;
  const fee = feeOf(logistics.mode);
  return (
    <AppShell title="Récapitulatif">
      <div className="space-y-3">
        {cart.map((l) => (
          <Card key={l.key} className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{itemOf(l.item).name}</p>
              <p className="text-xs text-muted-foreground">{serviceOf(l.service).name}</p>
              <p className="text-sm font-semibold text-primary">{fmt(linePrice(l))}</p>
            </div>
            <button
              aria-label="Moins"
              onClick={() => setQty(l.item, l.service, l.qty - 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center font-bold">{l.qty}</span>
            <button
              aria-label="Plus"
              onClick={() => setQty(l.item, l.service, l.qty + 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              aria-label="Supprimer"
              onClick={() => setQty(l.item, l.service, 0)}
              className="grid h-8 w-8 place-items-center rounded-full text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
      <Link to="/services" className="mt-3 block text-center text-sm font-semibold text-primary">
        + Ajouter d'autres articles
      </Link>
      <Card className="mt-5 space-y-2 text-sm">
        <Row k="Sous-total" v={fmt(sub)} />
        {ready ? (
          <>
            <Row
              k={logistics.mode === "domicile" ? "Collecte & livraison" : "Dépôt au pressing"}
              v={fee ? fmt(fee) : "Gratuit"}
            />
            <p className="text-xs text-muted-foreground">
              {logistics.address} • {formatDate(logistics.date)} • {logistics.slot}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Mode de prise en charge non choisi.</p>
        )}
        <div className="border-t border-border pt-2">
          <Row k="Total" v={fmt(sub + (ready ? fee : 0))} bold />
        </div>
      </Card>
      <div className="mt-5 space-y-3">
        {ready ? (
          <Link to="/paiement" className={btn}>
            Passer au paiement
          </Link>
        ) : (
          <Link to="/livraison" className={btn}>
            Choisir collecte ou dépôt
          </Link>
        )}
        {ready && (
          <Link to="/livraison" className={btnOutline}>
            Modifier la prise en charge
          </Link>
        )}
      </div>
    </AppShell>
  );
}
export const Row = ({ k, v, bold }: { k: string; v: string; bold?: boolean }) => (
  <div className={`flex justify-between ${bold ? "text-lg font-extrabold text-navy" : ""}`}>
    <span className={bold ? "" : "text-muted-foreground"}>{k}</span>
    <span className={bold ? "" : "font-semibold text-navy"}>{v}</span>
  </div>
);
