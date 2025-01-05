import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function VCardEmpty() {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4 p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Aucun profil trouvé</h2>
      <p className="text-muted-foreground">
        Vous devez créer un profil pour accéder à toutes les fonctionnalités
      </p>
      <Button onClick={() => navigate(0)}>
        Créer mon profil
      </Button>
    </div>
  );
}