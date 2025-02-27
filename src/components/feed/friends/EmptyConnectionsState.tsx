
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmptyConnectionsState() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-full mb-4">
        <UserPlus className="h-10 w-10 text-primary/70" />
      </div>
      <h3 className="text-xl font-medium mb-2">
        Pas encore de connexions
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Commencez à créer votre réseau professionnel en ajoutant des connexions.
        Vous pourrez ensuite communiquer et collaborer facilement.
      </p>
      <Button
        onClick={() => navigate("/explore")}
        className="bg-gradient-to-r from-primary to-primary/80 text-white hover:opacity-90"
      >
        Explorer des profils
      </Button>
    </div>
  );
}
