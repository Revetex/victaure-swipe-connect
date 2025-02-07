
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { PrivacySection } from "@/components/settings/PrivacySection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { BlockedUsersSection } from "@/components/settings/BlockedUsersSection";
import { LogoutSection } from "@/components/settings/LogoutSection";
import { ConnectionsSection } from "@/components/feed/friends/ConnectionsSection";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";

interface FeedSidebarProps {
  className?: string;
}

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      name: "Notes",
      icon: Plus,
      component: NotesPage,
      description: "Gérez vos notes"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      component: TasksPage,
      description: "Gérez vos tâches"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      component: CalculatorPage,
      description: "Calculatrice et convertisseur"
    },
    {
      name: "Traducteur",
      icon: Languages,
      component: TranslatorPage,
      description: "Traduisez du texte"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      description: "Convertissez des unités",
      component: () => (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
        </div>
      )
    },
    {
      name: "Échecs",
      icon: Sword,
      component: ChessPage,
      description: "Jouez aux échecs"
    }
  ];

  const handleCloseSidebar = () => {
    navigate('/dashboard');
  };

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName);
  };

  const handleCloseDialog = () => {
    setActiveTool(null);
  };

  const activeTool_ = tools.find(tool => tool.name === activeTool);
  const ActiveComponent = activeTool_?.component;

  return (
    <>
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

            {/* Friends Section */}
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Connections</h3>
              <ConnectionsSection />
            </div>

            <Separator className="my-4" />

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
                    onClick={() => handleToolClick(tool.name)}
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
              <div className="space-y-1">
                <div className="rounded-lg">
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

      <Dialog open={!!activeTool} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {activeTool_?.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
