import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Logo size="xl" className="mb-8" />
      <h1 className="text-4xl font-bold text-center mb-4">
        Bienvenue sur Victaure
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Connectez-vous pour accéder à votre espace
      </p>
      <Button onClick={() => navigate("/auth")} size="lg">
        Commencer
      </Button>
    </div>
  );
}