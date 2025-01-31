import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
    </div>
  );
}