
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ConnectionsSection } from "./ConnectionsSection";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { useIsMobile } from "@/hooks/use-mobile";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const tools = [
    {
      name: "Notes",
      icon: Plus,
      component: NotesPage,
      description: "Créez et gérez vos notes"
    },
    {
      name: "Tâches",
      icon: ListTodo,
      component: TasksPage,
      description: "Gérez vos tâches et listes"
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
      comingSoon: true
    },
    {
      name: "Échecs",
      icon: Sword,
      component: ChessPage,
      description: "Jouez aux échecs"
    }
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.comingSoon) {
      return;
    }
    setActiveTool(tool.name);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"
        )}>
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-3 p-4 h-auto",
                "hover:bg-accent/5 transition-all duration-200",
                "group relative",
                tool.comingSoon && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleToolClick(tool)}
              disabled={tool.comingSoon}
            >
              <div className={cn(
                "p-3 rounded-lg transition-all duration-200",
                "group-hover:scale-110"
              )}>
                <tool.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{tool.name}</p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {tool.description}
                </p>
                {tool.comingSoon && (
                  <span className="text-xs text-muted-foreground mt-1">
                    Bientôt disponible
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConnectionsSection />
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {activeTool && (
        <Dialog open={!!activeTool} onOpenChange={() => setActiveTool(null)}>
          <DialogContent className="max-w-4xl h-[80vh] p-6">
            {(() => {
              const tool = tools.find(t => t.name === activeTool);
              if (tool?.component) {
                const ToolComponent = tool.component;
                return <ToolComponent />;
              }
              return null;
            })()}
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
