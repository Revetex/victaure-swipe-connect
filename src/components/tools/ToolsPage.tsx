import { useNavigate } from "react-router-dom";
import { StickyNote, Calculator, Languages, ArrowUpDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ToolsPage() {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Notes",
      icon: StickyNote,
      path: "/dashboard/tools/notes",
      description: "Organisez vos idées avec des notes interactives",
      commands: [
        "Double-clic pour éditer",
        "Glisser-déposer pour réorganiser",
        "Ctrl+N pour nouvelle note",
        "Ctrl+D pour dupliquer",
        "Ctrl+S pour sauvegarder",
        "Échap pour annuler",
        "Suppr pour supprimer"
      ]
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      path: "/dashboard/tools/calculator",
      description: "Effectuez des calculs rapidement"
    },
    {
      name: "Traducteur",
      icon: Languages,
      path: "/dashboard/tools/translator",
      description: "Traduisez du texte en plusieurs langues"
    },
    {
      name: "Convertisseur",
      icon: ArrowUpDown,
      path: "/dashboard/tools/converter",
      description: "Convertissez des unités facilement"
    }
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Outils</h1>
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Card
            key={tool.name}
            className="p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col items-center gap-4 hover:bg-accent"
              onClick={() => navigate(tool.path)}
            >
              <tool.icon className="h-8 w-8" />
              <div className="text-center">
                <h3 className="font-semibold mb-2">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                {tool.commands && (
                  <div className="text-xs text-left space-y-1 mt-4 border-t pt-4">
                    <p className="font-medium mb-2">Commandes rapides:</p>
                    {tool.commands.map((cmd, i) => (
                      <p key={i} className="text-muted-foreground">• {cmd}</p>
                    ))}
                  </div>
                )}
              </div>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}