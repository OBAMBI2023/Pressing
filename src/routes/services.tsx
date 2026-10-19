import { createFileRoute, Link } from "@tanstack/react-router";
import { WashingMachine, Shirt, Sparkles, ChevronRight } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { SERVICES, fmt } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => seo("Nos services", "Lavage, repassage et nettoyage à sec : tarifs et catégories."),
  component: Services,
});

const serviceIcon = { lavage: WashingMachine, repassage: Shirt, sec: Sparkles };

function Services() {
  return (
    <AppShell title="Choisissez vos services">
      <div className="space-y-3">
        {SERVICES.map((s) => {
          const Icon = serviceIcon[s.id];
          return (
            <Link key={s.id} to="/articles" search={{ service: s.id }}>
              <Card className="mb-3 flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    À partir de {fmt(s.from)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Card>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
