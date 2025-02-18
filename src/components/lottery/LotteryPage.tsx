
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Diamond, Star, Crown } from "lucide-react";
import { PyramidRush } from "./pyramid/PyramidRush";
import { ZodiacFortune } from "./zodiac/ZodiacFortune";
import { LotoSphere } from "./sphere/LotoSphere";

export function LotteryPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Imperium Lottery</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez nos jeux de loterie exceptionnels
          </p>
        </div>

        <Tabs defaultValue="pyramid" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pyramid" className="space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Pyramid Rush</span>
            </TabsTrigger>
            <TabsTrigger value="zodiac" className="space-x-2">
              <Star className="h-4 w-4" />
              <span>Zodiac Fortune</span>
            </TabsTrigger>
            <TabsTrigger value="sphere" className="space-x-2">
              <Crown className="h-4 w-4" />
              <span>LotoSphere</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pyramid" className="mt-6">
            <Card className="p-6">
              <PyramidRush />
            </Card>
          </TabsContent>

          <TabsContent value="zodiac" className="mt-6">
            <Card className="p-6">
              <ZodiacFortune />
            </Card>
          </TabsContent>

          <TabsContent value="sphere" className="mt-6">
            <Card className="p-6">
              <LotoSphere />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
