import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Heart,
  Layers,
  MapPin,
  Package,
  Shirt,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  User,
  Zap,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { AppShell } from "@/components/AppShell";
import { isDelivered, useStore, SERVICES, STEPS } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/accueil")({
  head: () =>
    seo("Tableau de bord", "Votre espace client Laundry : nouvelle commande, suivi et historique."),
  component: Dashboard,
});

const serviceIcon = { lavage: Shirt, repassage: Layers, sec: Sparkles };
const serviceTint = {
  lavage: "bg-secondary text-primary",
  repassage: "bg-primary text-primary-foreground",
  sec: "bg-teal text-navy",
};
const values = [
  { label: "Qualité", icon: ShieldCheck },
  { label: "Rapidité", icon: Zap },
  { label: "Confiance", icon: Heart },
];
const roundIcon = "grid h-10 w-10 place-items-center rounded-full";

function Dashboard() {
  const { user, orders } = useStore();
  const current = orders.find((o) => !isDelivered(o));
  return (
    <AppShell
      back={false}
      right={
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            aria-label={current ? "Notifications (commande en cours)" : "Notifications"}
            className={`relative ${roundIcon} bg-secondary text-primary`}
          >
            <Bell className="h-5 w-5" />
            {current && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>
          <Link
            to="/profil"
            aria-label="Mon profil"
            className={`${roundIcon} bg-navy text-primary-foreground`}
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      }
    >
      <section className="relative mb-5 overflow-hidden rounded-3xl bg-brand text-primary-foreground">
        <img
          src={hero}
          alt=""
          width={1024}
          height={1024}
          className="absolute inset-y-0 right-0 h-full w-2/5 object-cover [clip-path:ellipse(100%_90%_at_100%_50%)]"
        />
        <div className="relative w-3/5 space-y-3 p-5 md:p-6">
          <div>
            <p className="text-sm opacity-80">Bonjour,</p>
            <h2 className="truncate text-2xl font-extrabold md:text-3xl">
              {user?.name ?? "Invité"}{" "}
              <span role="img" aria-label="salut">
                👋
              </span>
            </h2>
          </div>
          <p className="font-semibold">Votre linge, notre expertise !</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-2 text-xs">
            {values.map((v) => (
              <li key={v.label} className="flex items-center gap-1.5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                  <v.icon className="h-3.5 w-3.5" />
                </span>
                {v.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/services"
          className="flex items-center gap-3 rounded-2xl border border-teal/30 bg-accent/40 p-4 shadow-card"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-action text-primary-foreground">
            <Truck className="h-7 w-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-navy">Collecte & Livraison</span>
            <span className="block text-sm text-muted-foreground">
              On vient chercher, on vous livre propre.
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-primary" />
        </Link>
        <Link
          to="/depot"
          className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4 shadow-card"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy text-primary-foreground">
            <Store className="h-7 w-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-navy">Dépôt & Retrait</span>
            <span className="block text-sm text-muted-foreground">
              Déposez votre linge, récupérez-le prêt à l'emploi.
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-primary" />
        </Link>
      </div>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy">Nos services</h2>
        <Link to="/services" className="flex items-center gap-1 text-sm font-semibold text-primary">
          Voir tous <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {SERVICES.map((s) => {
          const Icon = serviceIcon[s.id];
          return (
            <Link
              key={s.id}
              to="/articles"
              search={{ service: s.id }}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-full ${serviceTint[s.id]}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="flex items-end justify-between gap-1 text-sm font-bold leading-tight text-navy">
                {s.name}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </span>
            </Link>
          );
        })}
      </div>

      <section className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-secondary/60 p-4">
        <Truck
          aria-hidden
          className="absolute -bottom-3 right-2 h-24 w-24 text-primary/15 md:h-28 md:w-28"
        />
        <MapPin aria-hidden className="absolute right-4 top-3 h-6 w-6 text-primary/40" />
        <div className="relative flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy text-primary-foreground">
            <Package className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="font-bold text-navy">Suivez votre commande</h2>
              <p className="truncate text-sm text-muted-foreground">
                {current ? `#${current.id} • ${STEPS[current.step]}` : "Aucune commande en cours"}
              </p>
            </div>
            {current ? (
              <Link
                to="/suivi/$id"
                params={{ id: current.id }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Suivre ma commande <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/commandes"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Mes commandes <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-4 flex items-center gap-3 rounded-2xl bg-action p-4 text-primary-foreground">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-foreground/20">
          <Sparkles className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold">Un linge toujours impeccable</h2>
          <p className="text-sm opacity-90">
            Un service fiable, rapide et sécurisé, à chaque fois.
          </p>
        </div>
        <Link
          to="/fidelite"
          className="flex shrink-0 items-center gap-1 rounded-full border-2 border-primary-foreground px-3 py-1.5 text-sm font-semibold"
        >
          Découvrir <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </AppShell>
  );
}
