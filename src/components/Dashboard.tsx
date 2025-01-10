import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isScrapingJobs, setIsScrapingJobs] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, redirecting to auth");
        toast.info("Veuillez vous connecter pour accéder au tableau de bord");
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking profile:", error);
        return;
      }

      setHasProfile(!!profile && !!profile.full_name);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleScrapeJobs = async () => {
    try {
      setIsScrapingJobs(true);
      toast.info("Recherche de nouvelles offres d'emploi en cours...");

      const { data, error } = await supabase.functions.invoke('smart-job-scraper');
      
      if (error) throw error;

      console.log("Job scraping result:", data);
      toast.success(`${data.jobCount} nouvelles offres d'emploi trouvées !`);
      
    } catch (error) {
      console.error("Error scraping jobs:", error);
      toast.error("Erreur lors de la recherche d'emplois");
    } finally {
      setIsScrapingJobs(false);
    }
  };

  if (hasProfile === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VCardCreationForm />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleScrapeJobs}
          disabled={isScrapingJobs}
          className="flex items-center gap-2"
        >
          {isScrapingJobs ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Recherche en cours...
            </>
          ) : (
            'Rechercher des emplois'
          )}
        </Button>
      </div>
    </DashboardLayout>
  );
}