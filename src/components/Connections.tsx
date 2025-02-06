import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Languages, ListTodo, Ruler, Sword } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Connections() {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Tâches",
      icon: ListTodo,
      description: "Gérez vos tâches et to-do lists",
      path: "/dashboard/tools/tasks"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      description: "Effectuez des calculs rapidement",
      path: "/dashboard/tools/calculator"
    },
    {
      name: "Traducteur",
      icon: Languages,
      description: "Traduisez du texte en plusieurs langues",
      path: "/dashboard/tools/translator"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      description: "Convertissez des unités facilement",
      path: "/dashboard/tools/converter"
    },
    {
      name: "Échecs",
      icon: Sword,
      description: "Jouez aux échecs contre l'IA",
      path: "/dashboard/tools/chess"
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Outils</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card 
              key={tool.name}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(tool.path)}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}