import { motion } from "framer-motion";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { NotesSection } from "../sections/NotesSection";
import { TasksSection } from "../sections/TasksSection";
import { CalculatorSection } from "../sections/CalculatorSection";
import { TranslatorSection } from "../sections/TranslatorSection";
import { ChessSection } from "../sections/ChessSection";

interface ToolsContentProps {
  selectedTool: string;
  isLoading: boolean;
  onToolChange: (value: string) => void;
}

export function ToolsContent({ selectedTool, isLoading, onToolChange }: ToolsContentProps) {
  return (
    <div className="flex-1 container mx-auto px-4 py-4">
      <Tabs 
        defaultValue="notes" 
        value={selectedTool} 
        onValueChange={onToolChange}
        className="w-full space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 relative"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
              <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-[calc(100vh-16rem)] overflow-y-auto"
            >
              <TabsContent value="notes" className="m-0 h-full">
                <NotesSection />
              </TabsContent>
              <TabsContent value="tasks" className="m-0 h-full">
                <TasksSection />
              </TabsContent>
              <TabsContent value="calculator" className="m-0 h-full">
                <CalculatorSection />
              </TabsContent>
              <TabsContent value="translator" className="m-0 h-full">
                <TranslatorSection />
              </TabsContent>
              <TabsContent value="chess" className="m-0 h-full">
                <ChessSection />
              </TabsContent>
            </motion.div>
          )}
        </motion.div>
      </Tabs>
    </div>
  );
}