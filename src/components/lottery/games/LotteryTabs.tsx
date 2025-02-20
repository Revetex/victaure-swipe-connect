
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Crown } from "lucide-react";
import { LotoSphere } from "../sphere/LotoSphere";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested, isMobile }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="chess" className="w-full">
      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2'}`}>
        <TabsTrigger value="chess" className="flex items-center gap-2">
          <Sword className="h-4 w-4" />
          <span className="truncate">Échecs</span>
        </TabsTrigger>
        <TabsTrigger value="sphere" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          <span className="truncate">LotoSphere</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chess" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <div className="w-full overflow-x-hidden">
            <ChessPage />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="sphere" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <div className="w-full overflow-x-hidden">
            <LotoSphere onPaymentRequested={onPaymentRequested} />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
