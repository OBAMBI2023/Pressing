import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Home, Store, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AppShell, Card, btn, input } from "@/components/AppShell";
import { SLOTS, useStore, type Mode } from "@/lib/store";
import { Field } from "./connexion";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/livraison")({
  head: () => seo("Collecte et livraison", "Choisissez le mode de prise en charge, la date et le créneau."),
  component: Livraison,
});

const PRESSINGS = ["Pressing Riviera 3", "Pressing Cocody Angré", "Pressing Plateau"];

function Livraison() {
  const { logistics, setLogistics, cart } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState(logistics);
  const [err, setErr] = useState<Record<string, string>>({});
  const today = new Date().toISOString().slice(0, 10);

  if (!cart.length) return <AppShell title="Collecte et livraison"><Card className="text-center"><p className="mb-4 text-muted-foreground">Votre panier est vide.</p><Link to="/services" className={btn}>Choisir des articles</Link></Card></AppShell>;

  const setMode = (mode: Mode) => setF({ ...f, mode, address: mode === "pressing" ? PRESSINGS[0] : "" });
  const submit = () => {
    const e: Record<string, string> = {};
    if (f.address.trim().length < 3) e.address = f.mode === "domicile" ? "Indiquez votre adresse." : "Choisissez un pressing.";
    if (!f.date || f.date < today) e.date = "Choisissez une date à partir d'aujourd'hui.";
    if (!f.slot) e.slot = "Choisissez un créneau.";
    setErr(e);
    if (Object.keys(e).length) return;
    setLogistics(f);
    nav({ to: "/panier" });
  };

  const modes = [
    { id: "domicile" as Mode, icon: Home, title: "Collecte à domicile", desc: "Nous venons chercher votre linge (+1 000 FCFA)" },
    { id: "pressing" as Mode, icon: Store, title: "Dépôt au pressing", desc: "Déposez et retirez votre linge en boutique" },
  ];
  return (
    <AppShell title="Collecte et livraison">
      <div className="space-y-3">
        {modes.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left ${f.mode === m.id ? "border-teal" : "border-border"}`}>
            <m.icon className="h-8 w-8 shrink-0 text-primary" />
            <div className="min-w-0 flex-1"><p className="font-bold text-navy">{m.title}</p><p className="text-sm text-muted-foreground">{m.desc}</p></div>
            {f.mode === m.id && <CheckCircle2 className="h-6 w-6 shrink-0 text-teal" />}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <Field label={f.mode === "domicile" ? "Adresse de collecte" : "Pressing"} error={err.address}>
          {f.mode === "domicile"
            ? <input className={input} placeholder="Ex : Cocody, rue des Jardins, Abidjan" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
            : <select className={input} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })}>{PRESSINGS.map((p) => <option key={p}>{p}</option>)}</select>}
        </Field>
        <Field label={f.mode === "domicile" ? "Date de collecte" : "Date de dépôt"} error={err.date}>
          <input type="date" min={today} className={input} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </Field>
        <div>
          <p className="mb-1.5 text-sm font-medium text-navy">Créneau horaire</p>
          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map((s) => (
              <button key={s} onClick={() => setF({ ...f, slot: s })} className={`rounded-full py-2.5 text-sm font-semibold ${f.slot === s ? "bg-primary text-primary-foreground" : "bg-secondary text-navy"}`}>{s}</button>
            ))}
          </div>
          {err.slot && <p className="mt-1 text-xs text-destructive">{err.slot}</p>}
        </div>
        <Field label="Note (optionnel)"><textarea maxLength={200} className={input} placeholder="Ex : instructions particulières…" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></Field>
        <button onClick={submit} className={btn}>Continuer</button>
      </div>
    </AppShell>
  );
}
