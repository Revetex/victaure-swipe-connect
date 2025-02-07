
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Languages, ListTodo, Ruler, Sword, Settings2, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Connections() {
  const navigate = useNavigate();

  const tools = [
    {
      name: "Tâches",
      icon: ListTodo,
      description: "Gérez vos tâches et to-do lists efficacement",
      path: "/tools",
      color: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-500"
    },
    {
      name: "Calculatrice",
      icon: Calculator,
      description: "Effectuez des calculs complexes rapidement",
      path: "/tools",
      color: "bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-500"
    },
    {
      name: "Traducteur",
      icon: Languages,
      description: "Traduisez du texte en plusieurs langues",
      path: "/tools",
      color: "bg-gradient-to-br from-purple-500/10 to-violet-500/10 text-purple-500"
    },
    {
      name: "Convertisseur",
      icon: Ruler,
      description: "Convertissez des unités facilement",
      path: "/tools",
      color: "bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500"
    },
    {
      name: "Échecs",
      icon: Sword,
      description: "Jouez aux échecs contre l'IA",
      path: "/tools",
      color: "bg-gradient-to-br from-red-500/10 to-pink-500/10 text-red-500"
    },
    {
      name: "Assistant IA",
      icon: BrainCircuit,
      description: "Obtenez de l'aide avec l'IA",
      path: "/tools",
      color: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500"
    }
  ];

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
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Outils
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={cn(
                  "p-6 cursor-pointer transition-all duration-300",
                  "hover:shadow-lg hover:border-primary/20",
                  "active:scale-95"
                )}
                onClick={() => navigate(tool.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    tool.color
                  )}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold tracking-tight">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
