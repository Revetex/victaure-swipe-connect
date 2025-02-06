import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Sword, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ToolSelectorProps {
  selectedTool: string;
  onToolChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

const tools = [
  { id: "notes", icon: Plus, label: "Notes", ariaLabel: "Create new note" },
  { id: "tasks", icon: ListTodo, label: "Tâches", ariaLabel: "Manage tasks" },
  { id: "calculator", icon: Calculator, label: "Calculatrice", ariaLabel: "Use calculator" },
  { id: "translator", icon: Languages, label: "Traducteur", ariaLabel: "Translate text" },
  { id: "chess", icon: Sword, label: "Échecs", ariaLabel: "Play chess" }
];

export function ToolSelector({ 
  selectedTool, 
  onToolChange,
  className,
  buttonClassName 
}: ToolSelectorProps) {
  const [openTool, setOpenTool] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    onToolChange(toolId);
    setOpenTool(toolId);
  };

  return (
    <>
      <Tabs value={selectedTool} onValueChange={onToolChange} className="w-full">
        <TabsList className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-background/95 backdrop-blur rounded-xl w-full max-w-4xl mx-auto",
          className
        )}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <TabsTrigger
                  value={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  aria-label={tool.ariaLabel}
                  title={tool.label}
                  className={cn(
                    "w-full aspect-square flex flex-col items-center justify-center gap-3 p-4",
                    "rounded-xl transition-all duration-300",
                    "bg-background/50 hover:bg-background/80",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "data-[state=active]:shadow-lg data-[state=active]:scale-105",
                    "border border-border/50",
                    "group",
                    buttonClassName
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-8 w-8 transition-all duration-300",
                      "group-hover:scale-110",
                      "group-data-[state=active]:scale-110"
                    )} 
                  />
                  <span className="text-sm font-medium">{tool.label}</span>
                </TabsTrigger>
              </motion.div>
            );
          })}
        </TabsList>
      </Tabs>

      <Dialog open={!!openTool} onOpenChange={() => setOpenTool(null)} modal>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 gap-0 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {tools.find(t => t.id === openTool)?.label}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenTool(null)}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {openTool && `Contenu de l'outil ${openTool}`}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}