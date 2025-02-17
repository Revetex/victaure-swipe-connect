
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();

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
        toast.error("Erreur lors de la vérification du profil");
        return;
      }

      console.log("Profile check:", profile);
      return !!profile && !!profile.full_name;
    };

    checkAuth();
  }, [navigate]);

  return <DashboardLayout />;
}
