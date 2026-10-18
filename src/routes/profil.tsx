import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, Bell, Gift, Store, ChevronRight, LogOut, User } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/profil")({
  head: () => seo("Mon profil", "Vos informations, commandes, notifications et avantages."),
  component: Profil,
});

function Profil() {
  const { user, logout } = useStore();
  const nav = useNavigate();
  const items = [
    { to: "/commandes", label: "Mes commandes", icon: ClipboardList },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/fidelite", label: "Programme de fidélité", icon: Gift },
    { to: "/depot", label: "Points de collecte", icon: Store },
  ] as const;
  return (
    <AppShell title="Mon profil">
      <Card className="mb-4 flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand text-primary-foreground"><User className="h-8 w-8" /></div>
        <div className="min-w-0"><p className="truncate text-lg font-bold text-navy">{user?.name ?? "Invité"}</p><p className="truncate text-sm text-muted-foreground">{user?.email ?? "Non connecté"}</p></div>
      </Card>
      <Card className="divide-y divide-border p-0">
        {items.map((i) => (
          <Link key={i.to} to={i.to} className="flex items-center gap-3 px-4 py-4 text-navy"><i.icon className="h-5 w-5 text-primary" /><span className="flex-1">{i.label}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>
        ))}
      </Card>
      {user ? (
        <button onClick={() => { logout(); nav({ to: "/" }); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-destructive"><LogOut className="h-4 w-4" />Se déconnecter</button>
      ) : (
        <Link to="/connexion" search={{ mode: "connexion" }} className="mt-4 block text-center font-semibold text-primary">Se connecter</Link>
      )}
    </AppShell>
  );
}
