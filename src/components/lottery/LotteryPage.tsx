
import { motion } from "framer-motion";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { LotteryHeader } from "./header/LotteryHeader";
import { LotteryTabs } from "./games/LotteryTabs";

export function LotteryPage() {
  const { handlePayment, loading } = usePaymentHandler();
  const isMobile = useIsMobile();

  const handleGamePayment = async (amount: number, gameTitle: string) => {
    try {
      await handlePayment(amount, `Paiement pour ${gameTitle}`);
      toast.success("Paiement traité avec succès !");
    } catch (error) {
      toast.error("Erreur lors du paiement", {
        description: "Une erreur est survenue lors du traitement du paiement",
      });
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-20 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        <LotteryHeader isMobile={isMobile} />
        <LotteryTabs onPaymentRequested={handleGamePayment} isMobile={isMobile} />
      </motion.div>
    </div>
  );
}
