
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
          <Card className="border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-md p-6">
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
