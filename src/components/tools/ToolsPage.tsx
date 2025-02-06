import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote, Calculator, Languages } from "lucide-react";
import { TasksSection } from "./sections/TasksSection";
import { NotesSection } from "./sections/NotesSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { TranslatorSection } from "./sections/TranslatorSection";
import { motion } from "framer-motion";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="tasks" className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 border-b">
            <TabsList className="w-full h-12 grid grid-cols-4 gap-4">
              <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">Tâches</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <StickyNote className="h-4 w-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Calculatrice</span>
              </TabsTrigger>
              <TabsTrigger value="translator" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">Traducteur</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-10rem)] rounded-md">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 p-4"
            >
              <TabsContent value="tasks" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div variants={itemVariants}>
                  <div className="bg-background rounded-lg p-6">
                    <TasksSection />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="notes" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div variants={itemVariants}>
                  <div className="bg-background rounded-lg p-6">
                    <NotesSection />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="calculator" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div variants={itemVariants}>
                  <div className="bg-background rounded-lg p-6">
                    <CalculatorSection />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="translator" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div variants={itemVariants}>
                  <div className="bg-background rounded-lg p-6">
                    <TranslatorSection />
                  </div>
                </motion.div>
              </TabsContent>
            </motion.div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}