
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
      <TabsList className="w-full">
        <TabsTrigger value="chess">
          <Sword className="h-4 w-4 mr-2" />
          Échecs
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 w-[calc(100vw-2rem)] sm:w-full overflow-hidden">
        <TabsContent value="chess">
          <Card className="p-2">
            <ChessPage />
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
