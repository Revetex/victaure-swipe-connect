import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Sword, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Tool {
  id: string;
  icon: any;
  label: string;
  ariaLabel: string;
  component?: React.ReactNode;
}

const tools: Tool[] = [
  { id: "notes", icon: Plus, label: "Notes", ariaLabel: "Create new note" },
  { id: "tasks", icon: ListTodo, label: "Tâches", ariaLabel: "Manage tasks" },
  { id: "calculator", icon: Calculator, label: "Calculatrice", ariaLabel: "Use calculator" },
  { id: "translator", icon: Languages, label: "Traducteur", ariaLabel: "Translate text" },
  { id: "chess", icon: Sword, label: "Échecs", ariaLabel: "Play chess" }
];

interface ToolSelectorProps {
  selectedTool: string;
  onToolChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <>
      <Tabs value={selectedTool} onValueChange={onToolChange}>
        <TabsList className={cn(
          "grid w-full max-w-4xl mx-auto gap-4 p-4",
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "rounded-xl shadow-lg border border-border/50",
          className
        )}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="contents"
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  variants={itemVariants}
                  className="w-full"
                >
                  <TabsTrigger
                    value={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    aria-label={tool.ariaLabel}
                    title={tool.label}
                    className={cn(
                      "w-full aspect-square flex flex-col items-center justify-center gap-3 p-4",
                      "rounded-lg transition-all duration-300",
                      "bg-background/50 hover:bg-background/80",
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "data-[state=active]:shadow-lg data-[state=active]:scale-105",
                      "border border-border/50",
                      "group hover:shadow-md",
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
          </motion.div>
        </TabsList>
      </Tabs>

      <Dialog open={!!openTool} onOpenChange={() => setOpenTool(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col">
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
            <div className="text-center text-muted-foreground">
              {openTool && `Contenu de l'outil ${openTool}`}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}