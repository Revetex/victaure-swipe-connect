
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { motion } from "framer-motion";
import { ToolsGrid } from "./tools/ToolsGrid";
import { ToolDialog } from "./tools/ToolDialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

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
      component: null,
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
    if (tool.comingSoon) return;
    setActiveTool(tool.name);
  };

  return (
    <motion.div 
      className="space-y-4 pb-safe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="touch-manipulation"
        >
          <ConnectionsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="touch-manipulation"
        >
          <ToolsGrid tools={tools} onToolClick={handleToolClick} />
        </motion.div>
      </div>

      <ToolDialog 
        activeTool={activeTool} 
        onOpenChange={() => setActiveTool(null)} 
      />
    </motion.div>
  );
}
