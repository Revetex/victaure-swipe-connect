
import { TabsList as UITabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Languages, ListTodo, Ruler, StickyNote, Sword } from "lucide-react";

export function TabsList() {
  return (
    <UITabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-10 p-0.5">
      <TabsTrigger 
        value="todos" 
        className="flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <ListTodo className="h-3 w-3" />
        <span className="hidden sm:inline">Tâches</span>
      </TabsTrigger>
      <TabsTrigger 
        value="notes" 
        className="flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <StickyNote className="h-3 w-3" />
        <span className="hidden sm:inline">Notes</span>
      </TabsTrigger>
      <TabsTrigger 
        value="calculator" 
        className="flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <Calculator className="h-3 w-3" />
        <span className="hidden sm:inline">Calculatrice</span>
      </TabsTrigger>
      <TabsTrigger 
        value="translator" 
        className="hidden sm:flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <Languages className="h-3 w-3" />
        <span className="hidden sm:inline">Traducteur</span>
      </TabsTrigger>
      <TabsTrigger 
        value="converter" 
        className="hidden sm:flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <Ruler className="h-3 w-3" />
        <span className="hidden sm:inline">Convertisseur</span>
      </TabsTrigger>
      <TabsTrigger 
        value="chess" 
        className="hidden sm:flex items-center gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all text-xs"
      >
        <Sword className="h-3 w-3" />
        <span className="hidden sm:inline">Échecs</span>
      </TabsTrigger>
    </UITabsList>
  );
}
