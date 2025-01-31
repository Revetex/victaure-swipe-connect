import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Bienvenue</h2>
          <p className="text-muted-foreground mt-2">Connectez-vous pour continuer</p>
        </div>
      </div>
    </div>
  );
}