
import React, { useState, useEffect } from "react";
import { useReceiver } from "@/hooks/useReceiver.tsx";
import { Card } from "@/components/ui/card";
import { ConversationView } from "./conversation/ConversationView";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { CustomConversationList } from "./CustomConversationList";
import { useConversations } from "@/hooks/useConversations";

export function MessagesContainer() {
  const { receiver, showConversation, setReceiver } = useReceiver();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  // Utiliser notre hook personnalisé
  const { conversations, isLoading } = useConversations();

  // Sélection d'une conversation
  const handleSelectConversation = (conversation: any) => {
    setSelectedConversationId(conversation.id);
    if (conversation.participant) {
      setReceiver(conversation.participant);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "fixed inset-0 top-16 flex h-[calc(100vh-4rem)] w-full",
        "border-0 rounded-none overflow-hidden"
      )}>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          "border-r border-slate-200/70 bg-muted/5",
          showConversation ? "hidden md:block md:w-80 lg:w-96" : "w-full md:w-80 lg:w-96"
        )}>
          <CustomConversationList 
            conversations={conversations}
            searchQuery={searchQuery}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoading}
          />
        </div>
        
        {(showConversation || receiver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {receiver && (
              <ConversationView 
                onBack={() => setSelectedConversationId(null)}
              />
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
