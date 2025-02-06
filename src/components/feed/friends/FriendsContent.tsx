
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { ConnectionsSection } from "./ConnectionsSection";
import { Calculator, Languages, ListTodo, Ruler, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const navigate = useNavigate();

  const tools = [
    {
      name: "Tâches",
      icon: ListTodo,
      action: () => setShowTasks(true),
      color: "bg-blue-500/10 text-blue-500",
      description: "Gérez vos tâches et listes"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      action: () => setShowCalculator(true),
      color: "bg-green-500/10 text-green-500",
      description: "Calculatrice et convertisseur"
    },
    {
      name: "Traducteur",
      icon: Languages,
      action: () => setShowTranslator(true),
      color: "bg-indigo-500/10 text-indigo-500",
      description: "Traduisez du texte"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      action: () => navigate("/tools"),
      color: "bg-orange-500/10 text-orange-500",
      description: "Convertissez des unités"
    },
    {
      name: "Échecs",
      icon: Sword,
      action: () => navigate("/tools"),
      color: "bg-red-500/10 text-red-500",
      description: "Jouez aux échecs"
    }
  ];

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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center gap-3 p-6 h-auto",
                "hover:bg-accent/5 transition-all duration-200",
                "group relative"
              )}
              onClick={tool.action}
            >
              <div className={cn(
                "p-4 rounded-lg transition-all duration-200",
                "group-hover:scale-110",
                tool.color
              )}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">{tool.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tool.description}
                </p>
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

      <Dialog open={showTasks} onOpenChange={setShowTasks}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <TasksPage />
        </DialogContent>
      </Dialog>

      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <CalculatorPage />
        </DialogContent>
      </Dialog>

      <Dialog open={showTranslator} onOpenChange={setShowTranslator}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <TranslatorPage />
        </DialogContent>
      </Dialog>

      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <NotesPage />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
