
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown } from "lucide-react";
import { LotoSphere } from "../sphere/LotoSphere";
import { PaymentProps } from "@/types/payment";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested, isMobile }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="sphere" className="w-full">
      <TabsList className={`grid w-full grid-cols-1`}>
        <TabsTrigger value="sphere" className="space-x-2">
          <Crown className="h-4 w-4" />
          <span className="truncate">LotoSphere</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sphere" className="mt-4 sm:mt-6">
        <Card className="p-2 sm:p-6">
          <LotoSphere onPaymentRequested={onPaymentRequested} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
