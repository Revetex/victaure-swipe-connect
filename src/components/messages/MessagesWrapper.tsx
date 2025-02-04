import { useState } from "react";
import { MessagesContent } from "./MessagesContent";
import { MessagesTabs } from "./MessagesTabs";
import { useReceiver } from "@/hooks/useReceiver";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export function MessagesWrapper() {
  const { showConversation, setShowConversation, receiver } = useReceiver();
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">("messages");

  const handleBack = () => {
    setShowConversation(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showConversation ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <div className="flex h-full flex-col">
            <div className="border-b">
              <div className="flex items-center gap-2 p-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleBack}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="text-lg font-medium">
                  {receiver?.full_name || "Chat"}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessagesContent />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <MessagesTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}