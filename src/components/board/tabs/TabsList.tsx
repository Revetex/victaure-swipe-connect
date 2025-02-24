
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Languages, ListTodo, Ruler, StickyNote, Sword } from "lucide-react";
import { Dispatch, SetStateAction } from 'react';

interface TabsListProps {
  activeTab: string;
  onTabChange: Dispatch<SetStateAction<string>>;
}

export function TabsList({ activeTab, onTabChange }: TabsListProps) {
  return (
    <UITabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-14 p-1">
      <TabsTrigger 
        value="todos" 
        className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("todos")}
      >
        <ListTodo className="h-4 w-4" />
        <span className="hidden sm:inline">Tâches</span>
      </TabsTrigger>
      <TabsTrigger 
        value="notes" 
        className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("notes")}
      >
        <StickyNote className="h-4 w-4" />
        <span className="hidden sm:inline">Notes</span>
      </TabsTrigger>
      <TabsTrigger 
        value="calculator" 
        className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("calculator")}
      >
        <Calculator className="h-4 w-4" />
        <span className="hidden sm:inline">Calculatrice</span>
      </TabsTrigger>
      <TabsTrigger 
        value="translator" 
        className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("translator")}
      >
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">Traducteur</span>
      </TabsTrigger>
      <TabsTrigger 
        value="converter" 
        className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("converter")}
      >
        <Ruler className="h-4 w-4" />
        <span className="hidden sm:inline">Convertisseur</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chess" 
        className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
        onClick={() => onTabChange("chess")}
      >
        <Sword className="h-4 w-4" />
        <span className="hidden sm:inline">Échecs</span>
      </TabsTrigger>
    </UITabsList>
  );
}
