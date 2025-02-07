
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
    component: NotesPage,
    gradient: "from-amber-500/20 via-orange-500/20 to-rose-500/20"
  },
  { 
    id: "tasks", 
    icon: ListTodo, 
    label: "Tâches",
    description: "Gérer votre liste de tâches",
    component: TasksPage,
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
  },
  { 
    id: "calculator", 
    icon: Calculator, 
    label: "Calculatrice",
    description: "Effectuer des calculs",
    component: CalculatorPage,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20"
  },
  { 
    id: "translator", 
    icon: Languages, 
    label: "Traducteur",
    description: "Traduire du texte",
    component: TranslatorPage,
    gradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20"
  },
  { 
    id: "converter", 
    icon: Ruler, 
    label: "Convertisseur",
    description: "Convertir des unités",
    component: () => (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
      </div>
    ),
    gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
    comingSoon: true
  },
  { 
    id: "chess", 
    icon: Sword, 
    label: "Échecs",
    description: "Jouer aux échecs",
    component: ChessPage,
    gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20"
  }
];
