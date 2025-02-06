import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Sword } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  icon: any;
  label: string;
  ariaLabel: string;
}

const tools: Tool[] = [
  { id: "notes", icon: Plus, label: "Notes", ariaLabel: "Create new note" },
  { id: "tasks", icon: ListTodo, label: "Tâches", ariaLabel: "Manage tasks" },
  { id: "calculator", icon: Calculator, label: "Calculatrice", ariaLabel: "Use calculator" },
  { id: "translator", icon: Languages, label: "Traducteur", ariaLabel: "Translate text" },
  { id: "chess", icon: Sword, label: "Échecs", ariaLabel: "Play chess" }
];

export function ToolSelector() {
  return (
    <div className="flex justify-center px-4">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-muted/50 rounded-xl w-full max-w-3xl shadow-lg">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TabsTrigger
                  value={tool.id}
                  aria-label={tool.ariaLabel}
                  title={tool.label}
                  className={cn(
                    "w-full aspect-square flex items-center justify-center",
                    "rounded-lg transition-all duration-300",
                    "bg-background/50 hover:bg-background/80",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "data-[state=active]:shadow-lg data-[state=active]:scale-105",
                    "border border-border/50",
                    "group"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      "group-hover:scale-110",
                      "group-data-[state=active]:scale-110"
                    )} 
                  />
                </TabsTrigger>
              </motion.div>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}