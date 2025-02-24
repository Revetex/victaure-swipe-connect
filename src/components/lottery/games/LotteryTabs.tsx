
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Crown, Trophy, Star } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="chess" className="w-full">
      <TabsList className="w-full bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
        <TabsTrigger 
          value="chess"
          className={cn(
            "flex items-center gap-2 data-[state=active]:bg-primary/10",
            "rounded-lg transition-all duration-300",
            "data-[state=active]:text-primary",
            "data-[state=active]:shadow-lg",
            "hover:bg-primary/5"
          )}
        >
          <Crown className="h-4 w-4" />
          <span className="font-medium">Imperium Chess</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lotosphere"
          className={cn(
            "flex items-center gap-2 data-[state=active]:bg-primary/10",
            "rounded-lg transition-all duration-300",
            "data-[state=active]:text-primary",
            "data-[state=active]:shadow-lg",
            "hover:bg-primary/5"
          )}
        >
          <Star className="h-4 w-4" />
          <span className="font-medium">Lotosphère</span>
        </TabsTrigger>
      </TabsList>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <TabsContent value="chess">
          <Card className="border-border/50 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-sm">
            <ChessPage />
          </Card>
        </TabsContent>
        
        <TabsContent value="lotosphere">
          <Card className="border-border/50 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                    Lotosphère
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tentez votre chance et gagnez gros !
                  </p>
                </div>
              </div>
              <Award className="h-8 w-8 text-primary/80" />
            </div>
            
            {/* Contenu du jeu Lotosphère sera ajouté ici */}
          </Card>
        </TabsContent>
      </motion.div>
    </Tabs>
  );
}
