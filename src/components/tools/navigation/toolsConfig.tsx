
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { NotesPage } from "../NotesPage";
import { TasksPage } from "../TasksPage";
import { CalculatorPage } from "../CalculatorPage";
import { TranslatorPage } from "../TranslatorPage";
import { ChessPage } from "../ChessPage";
import { ToolInfo } from "./types";

export const tools: ToolInfo[] = [
  { 
    id: "notes", 
    icon: Plus, 
    label: "Notes",
    description: "Créer et gérer vos notes",
    component: ({ onLoad }) => {
      onLoad?.();
      return <NotesPage />;
    },
    gradient: "from-primary/20 to-secondary/10"
  },
  { 
    id: "tasks", 
    icon: ListTodo, 
    label: "Tâches",
    description: "Gérer votre liste de tâches",
    component: ({ onLoad }) => {
      onLoad?.();
      return <TasksPage />;
    },
    gradient: "from-secondary/20 to-primary/10"
  },
  { 
    id: "calculator", 
    icon: Calculator, 
    label: "Calculatrice",
    description: "Effectuer des calculs",
    component: ({ onLoad }) => {
      onLoad?.();
      return <CalculatorPage />;
    },
    gradient: "from-accent/20 to-secondary/10"
  },
  { 
    id: "translator", 
    icon: Languages, 
    label: "Traducteur",
    description: "Traduire du texte",
    component: ({ onLoad }) => {
      onLoad?.();
      return <TranslatorPage />;
    },
    gradient: "from-primary/20 to-accent/10"
  },
  { 
    id: "converter", 
    icon: Ruler, 
    label: "Convertisseur",
    description: "Convertir des unités",
    component: ({ onLoad }) => {
      onLoad?.();
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
        </div>
      );
    },
    gradient: "from-secondary/20 to-primary/10",
    comingSoon: true
  },
  { 
    id: "chess", 
    icon: Sword, 
    label: "Échecs",
    description: "Jouer aux échecs",
    component: ({ onLoad }) => {
      onLoad?.();
      return <ChessPage />;
    },
    gradient: "from-accent/20 to-secondary/10"
  }
];
