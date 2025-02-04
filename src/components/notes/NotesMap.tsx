import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Languages, ArrowLeftRight, Sword, Sparkles } from "lucide-react";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ConverterPage } from "@/components/tools/ConverterPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { motion } from "framer-motion";

export function NotesMap() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="p-4 border-b">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculatrice
            </TabsTrigger>
            <TabsTrigger value="translator" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Traducteur
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Convertisseur
            </TabsTrigger>
            <TabsTrigger value="chess" className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Échecs
            </TabsTrigger>
            <TabsTrigger value="ai-game" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Mini Jeu IA
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <TabsContent value="calculator" className="mt-0">
              <CalculatorPage />
            </TabsContent>
            
            <TabsContent value="translator" className="mt-0">
              <TranslatorPage />
            </TabsContent>
            
            <TabsContent value="converter" className="mt-0">
              <ConverterPage />
            </TabsContent>
            
            <TabsContent value="chess" className="mt-0">
              <ChessPage />
            </TabsContent>
            
            <TabsContent value="ai-game" className="mt-0">
              <div className="container mx-auto p-4">
                <div className="max-w-md mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Mini Jeu IA
                  </h2>
                  <p className="text-muted-foreground">
                    Cette fonctionnalité sera bientôt disponible...
                  </p>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}