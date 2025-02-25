import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Star, Award } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}
export function LotteryTabs({
  onPaymentRequested
}: LotteryTabsProps) {
  return <Tabs defaultValue="lotosphere" className="w-full">
      <TabsList className="w-full bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
        <TabsTrigger value="lotosphere" className={cn("flex items-center gap-2 data-[state=active]:bg-primary/10", "rounded-lg transition-all duration-300", "data-[state=active]:text-primary", "data-[state=active]:shadow-lg", "hover:bg-primary/5")}>
          <Star className="h-4 w-4" />
          <span className="font-medium">Lotosphère</span>
        </TabsTrigger>
        <TabsTrigger value="chess" className={cn("flex items-center gap-2 data-[state=active]:bg-primary/10", "rounded-lg transition-all duration-300", "data-[state=active]:text-primary", "data-[state=active]:shadow-lg", "hover:bg-primary/5")}>
          <Crown className="h-4 w-4" />
          <span className="font-medium">Imperium Chess</span>
        </TabsTrigger>
      </TabsList>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2
    }} className="mt-4">
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

            <div className="grid gap-4">
              <div className="rounded-lg border border-border/50 p-4">
                <h3 className="text-lg font-semibold mb-2">Prochain tirage</h3>
                <p className="text-sm text-muted-foreground">
                  Le prochain tirage aura lieu dans: <span className="text-primary font-medium">12:34:56</span>
                </p>
                <div className="mt-4">
                  <motion.button whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }} className="w-full py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors" onClick={() => onPaymentRequested(5, "Lotosphère")}>
                    Acheter un ticket (5 €)
                  </motion.button>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <h3 className="text-lg font-semibold mb-2">Dernier tirage</h3>
                <div className="flex gap-2">
                  {[12, 24, 36, 42, 48].map(number => <div key={number} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {number}
                    </div>)}
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold">
                    +
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 p-4">
                <h3 className="text-lg font-semibold mb-2">Cagnotte actuelle</h3>
                <p className="text-3xl font-bold text-primary">150.00$</p>
                <p className="text-sm text-muted-foreground mt-1">
                  La cagnotte augmente à chaque ticket acheté !
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="chess">
          <Card className="border-border/50 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-sm">
            <ChessPage />
          </Card>
        </TabsContent>
      </motion.div>
    </Tabs>;
}