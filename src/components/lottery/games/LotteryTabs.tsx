
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="chess" className="w-full">
      <TabsList className="w-full bg-card/50 backdrop-blur-sm border border-border/50">
        <TabsTrigger 
          value="chess"
          className="flex items-center gap-2 data-[state=active]:bg-primary/10"
        >
          <Sword className="h-4 w-4" />
          Échecs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chess" className="mt-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <ChessPage />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
