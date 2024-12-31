import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { PaymentTypeSelector } from "./payment/PaymentTypeSelector";
import { TransactionList } from "./payment/TransactionList";
import { usePayments } from "@/hooks/usePayments";
import { useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export function PaymentBox() {
  const [selectedPaymentType, setSelectedPaymentType] = useState<'interac' | 'credit_card'>('interac');
  const { transactions, isLoading, handlePayment } = usePayments();

  if (isLoading) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5" />
            Paiements sécurisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full"
    >
      <Card className="h-[400px]">
        <CardHeader className="space-y-1 py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-4 w-4" />
            Paiements sécurisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-3">
          <motion.div variants={itemVariants}>
            <PaymentTypeSelector
              selectedPaymentType={selectedPaymentType}
              onSelect={setSelectedPaymentType}
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="overflow-auto max-h-[280px] rounded-lg"
          >
            <TransactionList
              transactions={transactions || []}
              onRelease={handlePayment}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}