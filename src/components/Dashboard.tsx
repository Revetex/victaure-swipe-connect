import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import type { DashboardStats } from "@/types/dashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export function Dashboard() {
  const { data: stats } = useDashboardStats();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <DashboardHeader 
          title="Tableau de bord"
          description="Bienvenue ! Voici un aperçu de votre activité."
        />
        
        <QuickActions stats={stats} />

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            className="border-victaure-blue text-victaure-blue hover:bg-victaure-blue/10"
          >
            Voir plus de détails
          </Button>
        </div>
      </div>
    </section>
  );
}