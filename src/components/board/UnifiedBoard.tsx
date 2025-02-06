import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Languages, ListTodo, Ruler, Sword, BrainCircuit } from "lucide-react";
import { ToolHeader } from "./ToolHeader";
import { ToolGrid } from "./ToolGrid";
import { Tool } from "@/types/todo";

export function UnifiedBoard() {
  const tools: Tool[] = [
    {
      name: "Tâches",
      icon: ListTodo,
      description: "Gérez vos tâches et to-do lists efficacement",
      path: "/tools",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      description: "Effectuez des calculs complexes rapidement",
      path: "/tools",
      color: "bg-green-500/10 text-green-500"
    },
    {
      name: "Traducteur",
      icon: Languages,
      description: "Traduisez du texte en plusieurs langues",
      path: "/tools",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      description: "Convertissez des unités facilement",
      path: "/tools",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      name: "Échecs",
      icon: Sword,
      description: "Jouez aux échecs contre l'IA",
      path: "/tools",
      color: "bg-red-500/10 text-red-500"
    },
    {
      name: "Assistant IA",
      icon: BrainCircuit,
      description: "Obtenez de l'aide avec l'IA",
      path: "/tools",
      color: "bg-indigo-500/10 text-indigo-500"
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <ToolHeader title="Outils" />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <ToolGrid tools={tools} />
      </ScrollArea>
    </div>
  );
}
