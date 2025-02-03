import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Connexion réussie");
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirection en cours...</p>
    </div>
  );
}