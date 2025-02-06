
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, Settings2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Notes",
      icon: Plus,
      path: "/notes",
      description: "Gérez vos notes"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      path: "/tasks",
      description: "Gérez vos tâches"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      path: "/calculator",
      description: "Calculatrice et convertisseur"
    },
    {
      name: "Traducteur",
      icon: Languages,
      path: "/translator",
      description: "Traduisez du texte"
    },
    {
      name: "Convertisseur",
      icon: Ruler, 
      path: "/converter",
      description: "Convertissez des unités"
    },
    {
      name: "Échecs",
      icon: Sword,
      path: "/chess",
      description: "Jouez aux échecs"
    }
  ];

  const handleCloseTool = () => {
    navigate('/dashboard');
    toast.success("Outil fermé");
  };

  return (
    <div className={cn(
      "w-[250px] flex-shrink-0 border-r h-[calc(100vh-4rem)] sticky top-[4rem]",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full">
        <div className="p-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Outils</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseTool}
              className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.name}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 px-2 h-9"
                onClick={() => navigate(tool.path)}
              >
                <tool.icon className="h-4 w-4" />
                <span className="text-sm">{tool.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
