
import { useState } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { PaymentInterface } from "./payment/PaymentInterface";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";

export function Chat() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setShowWelcome(true);
  };

  const togglePayment = () => {
    setShowPayment(!showPayment);
  };

  return (
    <AnimatePresence>
      {(showWelcome || showChat || showPayment) && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm isolate z-50"
          >
            <div className="h-full w-full flex items-center justify-center p-8 relative">
              {showWelcome && (
                <MrVictaureWelcome 
                  onDismiss={() => setShowWelcome(false)}
                  onStartChat={handleStartChat}
                />
              )}
              
              {showChat && (
                <div className="w-full h-full max-w-4xl mx-auto pb-8 relative">
                  <AIAssistant onClose={handleCloseChat} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={togglePayment}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Paiement
                  </Button>
                </div>
              )}

              {showPayment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center p-4 z-50"
                >
                  <div className="relative w-full max-w-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-12 right-0"
                      onClick={togglePayment}
                    >
                      Fermer
                    </Button>
                    <PaymentInterface />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
