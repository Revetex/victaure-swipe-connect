
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, X, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";

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
      "w-[280px] flex-shrink-0 border-r h-[calc(100vh-4rem)] sticky top-[4rem] z-50",
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full">
        <div className="p-3 space-y-4">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Navigation</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseSidebar}
              className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tools Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-2">Outils</h3>
            <div className="space-y-1">
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

          <Separator className="my-4" />

          {/* Settings Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-2">Paramètres</h3>
            <div className="space-y-2">
              <div className="space-y-3 rounded-lg bg-card/50 p-2">
                <AppearanceSection />
                <NotificationsSection />
                <PrivacySection />
                <SecuritySection />
                <BlockedUsersSection />
                <Separator className="my-2" />
                <LogoutSection />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
