
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChessBoard, Gamepad2 } from "lucide-react";
import { ChessPage } from "../../tools/ChessPage";
import { PaymentProps } from "@/types/payment";
import { LotoSphere } from "./lotosphere/LotoSphere";

interface LotteryTabsProps extends PaymentProps {
  isMobile: boolean;
}

export function LotteryTabs({ onPaymentRequested, isMobile }: LotteryTabsProps) {
  return (
    <Tabs defaultValue="lotosphere" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="lotosphere">
          <Gamepad2 className="h-4 w-4 mr-2" />
          LotoSphere
        </TabsTrigger>
        <TabsTrigger value="chess">
          <ChessBoard className="h-4 w-4 mr-2" />
          Échecs
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 w-[calc(100vw-2rem)] sm:w-full overflow-hidden">
        <TabsContent value="lotosphere">
          <Card className="p-4">
            <LotoSphere onPaymentRequested={onPaymentRequested} />
          </Card>
        </TabsContent>
        <TabsContent value="chess">
          <Card className="p-2">
            <ChessPage />
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
