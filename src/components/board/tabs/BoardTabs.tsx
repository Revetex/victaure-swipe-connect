
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo, StickyNote, Calculator, Languages, Ruler, Sword } from "lucide-react";
import { ActiveTab } from "../types";

interface BoardTabsProps {
  activeTab: ActiveTab;
  onTabChange: (value: string) => void;
}

export function BoardTabs({ activeTab, onTabChange }: BoardTabsProps) {
  return (
    <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-12">
      <TabsTrigger value="todos" className="flex items-center gap-2">
        <ListTodo className="h-4 w-4" />
        <span className="hidden sm:inline">Tâches</span>
      </TabsTrigger>
      <TabsTrigger value="notes" className="flex items-center gap-2">
        <StickyNote className="h-4 w-4" />
        <span className="hidden sm:inline">Notes</span>
      </TabsTrigger>
      <TabsTrigger value="calculator" className="flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        <span className="hidden sm:inline">Calculatrice</span>
      </TabsTrigger>
      <TabsTrigger value="translator" className="hidden sm:flex items-center gap-2">
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">Traducteur</span>
      </TabsTrigger>
      <TabsTrigger value="converter" className="hidden sm:flex items-center gap-2">
        <Ruler className="h-4 w-4" />
        <span className="hidden sm:inline">Convertisseur</span>
      </TabsTrigger>
      <TabsTrigger value="chess" className="hidden sm:flex items-center gap-2">
        <Sword className="h-4 w-4" />
        <span className="hidden sm:inline">Échecs</span>
      </TabsTrigger>
    </TabsList>
  );
}
