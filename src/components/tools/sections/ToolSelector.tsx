import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Sword } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  icon: any;
  label: string;
}

const tools: Tool[] = [
  { id: "notes", icon: Plus, label: "Notes" },
  { id: "tasks", icon: ListTodo, label: "Tâches" },
  { id: "calculator", icon: Calculator, label: "Calculatrice" },
  { id: "translator", icon: Languages, label: "Traducteur" },
  { id: "chess", icon: Sword, label: "Échecs" }
];

export function ToolSelector() {
  return (
    <div className="flex justify-center px-4">
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
                className={cn(
                  "w-full flex items-center justify-center gap-2.5 px-4 py-3",
                  "rounded-lg transition-all duration-300",
                  "bg-background/50 hover:bg-background/80",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "data-[state=active]:shadow-lg data-[state=active]:scale-105",
                  "border border-border/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tool.label}</span>
              </TabsTrigger>
            </motion.div>
          );
        })}
      </TabsList>
    </div>
  );
}