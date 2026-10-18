import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Smartphone, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AppShell, Card, btn, input } from "@/components/AppShell";
import { feeOf, fmt, subtotalOf, useStore, type Payment } from "@/lib/store";
import { Field } from "./connexion";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/paiement")({
  head: () => seo("Paiement", "Choisissez votre moyen de paiement (simulation)."),
  component: Paiement,
});

function Paiement() {
  const { cart, logistics, placeOrder } = useStore();
  const nav = useNavigate();
  const [p, setP] = useState<Payment>("mobile");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");
  const [err, setErr] = useState("");
  if (!cart.length || !logistics.slot)
    return (
      <AppShell title="Paiement">
        <Card className="text-center">
          <p className="mb-4 text-muted-foreground">
            Complétez d'abord votre panier et la prise en charge.
          </p>
          <Link to="/panier" className={btn}>
            Voir le panier
          </Link>
        </Card>
      </AppShell>
    );
  const total = subtotalOf(cart) + feeOf(logistics.mode);
  const opts = [
    { id: "mobile" as Payment, icon: Smartphone, label: "Mobile Money" },
    { id: "carte" as Payment, icon: CreditCard, label: "Carte bancaire" },
    { id: "retrait" as Payment, icon: Banknote, label: "Paiement au retrait" },
  ];
  const submit = () => {
    if (p === "mobile" && !/^\d{10}$/.test(phone.replace(/\s/g, "")))
      return setErr("Numéro à 10 chiffres requis.");
    if (p === "carte" && !/^\d{16}$/.test(card.replace(/\s/g, "")))
      return setErr("Numéro de carte à 16 chiffres requis.");
    const o = placeOrder(p);
    nav({ to: "/confirmation/$id", params: { id: o.id } });
  };
  return (
    <AppShell title="Paiement">
      <Card className="mb-5 flex justify-between">
        <span className="text-muted-foreground">Total à régler</span>
        <span className="text-lg font-extrabold text-navy">{fmt(total)}</span>
      </Card>
      <div className="space-y-3">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => {
              setP(o.id);
              setErr("");
            }}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 ${p === o.id ? "border-teal" : "border-border"}`}
          >
            <o.icon className="h-6 w-6 text-primary" />
            <span className="flex-1 text-left font-semibold text-navy">{o.label}</span>
            {p === o.id && <CheckCircle2 className="h-5 w-5 text-teal" />}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {p === "mobile" && (
          <Field label="Numéro Mobile Money" error={err}>
            <input
              inputMode="numeric"
              className={input}
              placeholder="07 00 00 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
        )}
        {p === "carte" && (
          <Field label="Numéro de carte" error={err}>
            <input
              inputMode="numeric"
              className={input}
              placeholder="4242 4242 4242 4242"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          </Field>
        )}
        {p === "retrait" && (
          <p className="text-sm text-muted-foreground">
            Vous réglerez au moment de la livraison ou du retrait.
          </p>
        )}
        <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
          Paiement simulé : aucun montant n'est débité et aucune donnée n'est transmise.
        </p>
        <button onClick={submit} className={btn}>
          {p === "retrait" ? "Valider la commande" : "Payer maintenant (simulation)"}
        </button>
      </div>
    </AppShell>
  );
}
