
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Trophy, Star, Crown } from "lucide-react";
import { PyramidRush } from "../pyramid/PyramidRush";
import { ZodiacFortune } from "../zodiac/ZodiacFortune";
import { LotoSphere } from "../sphere/LotoSphere";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested, isMobile }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="chess" className="w-full">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4'}`}>
        <TabsTrigger value="chess" className="space-x-2">
          <Sword className="h-4 w-4" />
          <span className="truncate">Échecs</span>
        </TabsTrigger>
        <TabsTrigger value="pyramid" className="space-x-2">
          <Trophy className="h-4 w-4" />
          <span className="truncate">Pyramid Rush</span>
        </TabsTrigger>
        <TabsTrigger value="zodiac" className="space-x-2">
          <Star className="h-4 w-4" />
          <span className="truncate">Zodiac Fortune</span>
        </TabsTrigger>
        <TabsTrigger value="sphere" className="space-x-2">
          <Crown className="h-4 w-4" />
          <span className="truncate">LotoSphere</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chess" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <ChessPage />
        </Card>
      </TabsContent>

      <TabsContent value="pyramid" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <PyramidRush onPaymentRequested={onPaymentRequested} />
        </Card>
      </TabsContent>

      <TabsContent value="zodiac" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <ZodiacFortune onPaymentRequested={onPaymentRequested} />
        </Card>
      </TabsContent>

      <TabsContent value="sphere" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <LotoSphere onPaymentRequested={onPaymentRequested} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
