import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function Tools() {
  const handleOpenProject = () => {
    window.open('https://lovable.dev/project/57f45340-669a-4f20-abfa-730168322fa5', '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Outils</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-3">Mon Autre Projet</h3>
          <p className="text-muted-foreground mb-4">
            Accédez à mon autre projet Lovable directement depuis ici.
          </p>
          <Button 
            onClick={handleOpenProject}
            className="w-full flex items-center justify-center gap-2"
          >
            Ouvrir le projet <ExternalLink className="h-4 w-4" />
          </Button>
        </Card>

        {/* Espace pour d'autres outils à venir */}
        <Card className="p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-3">Plus d'outils à venir</h3>
          <p className="text-muted-foreground">
            D'autres outils seront bientôt disponibles dans cette section.
          </p>
        </Card>
      </div>
    </div>
  );
}