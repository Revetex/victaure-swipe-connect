

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Star } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LotteryHeader } from "./components/LotteryHeader";
import { NextDraw } from "./components/NextDraw";
import { LastDraw } from "./components/LastDraw";
import { PrizePool } from "./components/PrizePool";
import { useLotteryDraws } from "./hooks/useLotteryDraws";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({
  onPaymentRequested
}: LotteryTabsProps) {
  const { nextDraw, lastDraw, loading } = useLotteryDraws();

  return (
    <Tabs defaultValue="lotosphere" className="w-full">
      <TabsList className="w-full bg-[#1B2A4A]/50 border border-[#64B5D9]/10 backdrop-blur-md rounded-xl p-1">
        <TabsTrigger 
          value="lotosphere" 
          className={cn(
            "flex items-center gap-2",
            "data-[state=active]:bg-[#64B5D9]/10",
            "data-[state=active]:text-[#64B5D9]",
            "rounded-lg transition-all duration-300",
            "hover:bg-[#64B5D9]/5"
          )}
        >
          <Star className="h-4 w-4" />
          <span className="font-medium">Lotosphère</span>
        </TabsTrigger>
        <TabsTrigger 
          value="chess" 
          className={cn(
            "flex items-center gap-2",
            "data-[state=active]:bg-[#64B5D9]/10",
            "data-[state=active]:text-[#64B5D9]",
            "rounded-lg transition-all duration-300",
            "hover:bg-[#64B5D9]/5"
          )}
        >
          <Crown className="h-4 w-4" />
          <span className="font-medium">Imperium Chess</span>
        </TabsTrigger>
      </TabsList>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <TabsContent value="lotosphere">
          <Card className="relative border border-[#64B5D9]/20 bg-gradient-to-b from-[#1B2A4A]/80 to-[#1B2A4A]/60 backdrop-blur-md p-6 overflow-hidden">
            {/* Éléments décoratifs style CAD */}
            <div className="absolute inset-0">
              {/* Grille de fond */}
              <div className="absolute inset-0 grid-dots opacity-5" />
              
              {/* Bordures techniques */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#64B5D9]/30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#64B5D9]/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#64B5D9]/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#64B5D9]/30" />
              
              {/* Lignes techniques */}
              <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
              <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
              <div className="absolute left-0 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
              <div className="absolute right-0 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
            </div>

            {/* Contenu avec z-index pour le placer au-dessus des décorations */}
            <div className="relative z-10">
              <LotteryHeader />

              <div className="grid gap-4">
                {loading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64B5D9]"></div>
                  </div>
                ) : (
                  <>
                    {nextDraw && (
                      <NextDraw 
                        draw={nextDraw}
                        onPaymentRequested={onPaymentRequested}
                      />
                    )}

                    {lastDraw && <LastDraw draw={lastDraw} />}

                    {nextDraw && <PrizePool draw={nextDraw} />}
                  </>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="chess">
          <Card className="border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-md">
            <ChessPage />
          </Card>
        </TabsContent>
      </motion.div>
    </Tabs>
  );
}

