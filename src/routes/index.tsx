import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Logo, btn } from "@/components/AppShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Bienvenue", "Laundry : lavage, repassage, nettoyage à sec, collecte et livraison. Propre. Simple. Pour vous."),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-background md:grid md:place-items-center md:py-8">
      <div className="mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-card md:min-h-0 md:grid md:max-w-4xl md:grid-cols-2 md:rounded-3xl md:shadow-card">
        <div className="relative">
          <img src={hero} alt="Linge propre plié près d'une machine à laver" width={1024} height={1024} className="h-80 w-full object-cover md:h-full" />
          <div className="absolute left-5 top-5 rounded-full bg-card/90 px-4 py-2 backdrop-blur"><Logo /></div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-5 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Propre. Simple. Pour vous.</p>
          <h1 className="text-3xl font-extrabold leading-tight text-navy">Un service de pressing moderne à portée de main</h1>
          <p className="text-muted-foreground">Lavage, repassage, nettoyage à sec. Collecte, livraison ou dépôt/retrait au pressing.</p>
          <Link to="/connexion" search={{ mode: "inscription" }} className={btn}>Commencer</Link>
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ? <Link to="/connexion" search={{ mode: "connexion" }} className="font-semibold text-primary">Se connecter</Link>
          </p>
          <p className="rounded-xl bg-secondary p-3 text-center text-xs text-muted-foreground">Prototype de démonstration : aucune commande ni paiement n'est réellement transmis.</p>
        </div>
      </div>
    </div>
  );
}
