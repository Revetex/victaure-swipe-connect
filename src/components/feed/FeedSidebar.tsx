
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, Settings2, X, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Amis",
      icon: Users,
      path: "/friends",
      description: "Gérez vos amis"
    },
    {
      name: "Notes",
      icon: Plus,
      path: "/tools",
      toolId: "notes",
      description: "Gérez vos notes"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      path: "/tools",
      toolId: "tasks",
      description: "Gérez vos tâches"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      path: "/tools",
      toolId: "calculator",
      description: "Calculatrice et convertisseur"
    },
    {
      name: "Traducteur",
      icon: Languages,
      path: "/tools",
      toolId: "translator",
      description: "Traduisez du texte"
    },
    {
      name: "Convertisseur",
      icon: Ruler, 
      path: "/tools",
      toolId: "converter",
      description: "Convertissez des unités"
    },
    {
      name: "Échecs",
      icon: Sword,
      path: "/tools",
      toolId: "chess",
      description: "Jouez aux échecs"
    }
  ];

  const handleToolClick = (path: string, toolId?: string) => {
    if (path === "/tools" && toolId) {
      navigate(path, { state: { selectedTool: toolId } });
    } else {
      navigate(path);
    }
  };

  const handleCloseSidebar = () => {
    navigate('/dashboard');
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
              onClick={handleCloseSidebar}
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
                onClick={() => handleToolClick(tool.path, tool.toolId)}
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
