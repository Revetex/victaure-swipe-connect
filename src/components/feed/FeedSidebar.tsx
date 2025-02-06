
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, Users } from "lucide-react";
import { ConnectionsSection } from "./friends/ConnectionsSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Notes",
      icon: Plus,
      path: "/tools",
      description: "Gérez vos notes"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      path: "/tools",
      description: "Gérez vos tâches"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      path: "/tools",
      description: "Calculatrice et convertisseur"
    },
    {
      name: "Traducteur",
      icon: Languages,
      path: "/tools",
      description: "Traduisez du texte"
    },
    {
      name: "Convertisseur",
      icon: Ruler, 
      path: "/tools",
      description: "Convertissez des unités"
    },
    {
      name: "Échecs",
      icon: Sword,
      path: "/tools",
      description: "Jouez aux échecs"
    }
  ];

  return (
    <div className={cn(
      "w-[300px] flex-shrink-0 border-r h-[calc(100vh-4rem)] sticky top-[4rem]",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Amis</h2>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => navigate("/friends")}
            >
              <Users className="h-4 w-4" />
              Demandes d'amis
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Outils</h2>
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate(tool.path)}
              >
                <tool.icon className="h-4 w-4" />
                {tool.name}
              </Button>
            ))}
          </div>

          <ConnectionsSection />
        </div>
      </ScrollArea>
    </div>
  );
}
