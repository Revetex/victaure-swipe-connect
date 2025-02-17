
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Session check:", session ? "Active" : "No session");
      
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
        toast.error("Erreur lors de la vérification du profil");
        return;
      }

      console.log("Profile check:", profile);
      setHasProfile(!!profile && !!profile.full_name);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
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

  return <DashboardLayout />;
}
