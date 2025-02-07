
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
import { motion } from "framer-motion";

interface FeedSidebarProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

export function FeedSidebar({ className }: FeedSidebarProps) {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      name: "Notes",
      icon: Plus,
      component: NotesPage,
      description: "Gérez vos notes",
      gradient: "from-yellow-500/10 to-orange-500/10"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      component: TasksPage,
      description: "Gérez vos tâches",
      gradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      component: CalculatorPage,
      description: "Calculatrice et convertisseur",
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      name: "Traducteur",
      icon: Languages,
      component: TranslatorPage,
      description: "Traduisez du texte",
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      description: "Convertissez des unités",
      gradient: "from-red-500/10 to-pink-500/10",
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
      description: "Jouez aux échecs",
      gradient: "from-slate-500/10 to-gray-500/10"
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
        "bg-background",
        "transition-all duration-300 ease-in-out",
        className
      )}>
        <ScrollArea className="h-full">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Header avec bouton de fermeture */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between px-2 py-3"
            >
              <h2 className="text-sm font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Navigation
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseSidebar}
                className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Section Connections */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Connections</h3>
              <div className="bg-background/50">
                <ConnectionsSection />
              </div>
            </motion.div>

            <Separator className="my-4" />

            {/* Section Outils */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Outils</h3>
              <div className="space-y-1">
                {tools.map((tool) => (
                  <Button
                    key={tool.name}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 px-2 h-12",
                      "bg-gradient-to-r hover:opacity-80",
                      "transition-all duration-300 group",
                      tool.gradient
                    )}
                    onClick={() => handleToolClick(tool.name)}
                  >
                    <tool.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Button>
                ))}
              </div>
            </motion.div>

            <Separator className="my-4" />

            {/* Section Paramètres */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Paramètres</h3>
              <div className="space-y-1">
                <div className="bg-background/50">
                  <AppearanceSection />
                  <NotificationsSection />
                  <PrivacySection />
                  <SecuritySection />
                  <BlockedUsersSection />
                  <Separator className="my-2" />
                  <LogoutSection />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </div>

      <Dialog open={!!activeTool} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between p-4 border-b bg-background/50">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {activeTool_?.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="rounded-full hover:bg-muted transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
