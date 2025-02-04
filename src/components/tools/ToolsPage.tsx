import { useNavigate } from "react-router-dom";
import { StickyNote, Calculator, Languages, ArrowsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolsPage() {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Notes",
      icon: StickyNote,
      path: "/dashboard/tools/notes",
      description: "Organisez vos idées avec des notes interactives"
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
      icon: ArrowsUpDown,
      path: "/dashboard/tools/converter",
      description: "Convertissez des unités facilement"
    }
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Outils</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-4 hover:bg-accent"
            onClick={() => navigate(tool.path)}
          >
            <tool.icon className="h-8 w-8" />
            <div className="text-center">
              <h3 className="font-semibold mb-2">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}