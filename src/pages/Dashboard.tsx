import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Session check:", session ? "Active" : "No session");
      
      if (!session) {
        console.log("No session found, redirecting to auth");
        navigate("/auth");
        return;
      }

      // Check if user has a profile using maybeSingle() instead of single()
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking profile:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de vérifier votre profil",
        });
        return;
      }

      console.log("Profile check:", profile ? "Found" : "Not found");
      setHasProfile(!!profile);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (!session) {
        navigate("/auth");
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