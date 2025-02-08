
import { useState, useRef } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "../ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { motion, AnimatePresence } from "framer-motion";

export function MessagesContainer() {
  const { receiver, setReceiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(false);
  const { 
    messages: userMessages, 
    isLoading: isLoadingMessages,
    handleSendMessage: handleUserSendMessage 
  } = useMessages();
  const { 
    messages: aiMessages, 
    inputMessage, 
    isThinking, 
    isListening, 
    handleSendMessage: handleAISendMessage, 
    handleVoiceInput, 
    setInputMessage 
  } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleDeleteConversation } = useConversationDelete();

  const handleSelectConversation = (selectedReceiver: any) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
    setInputMessage('');
  };

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
    setInputMessage('');
  };

  const handleSendMessage = () => {
    if (!receiver) return;
    if (!inputMessage.trim()) return;

    if (receiver.id === 'assistant') {
      handleAISendMessage(inputMessage);
    } else {
      handleUserSendMessage(inputMessage, receiver);
    }
    
    setInputMessage('');
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground"
        >
          Chargement des messages...
        </motion.div>
      </div>
    );
  }

  return (
    <Card className="h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {showConversation && receiver ? (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden"
          >
            <ConversationView
              receiver={receiver}
              messages={receiver.id === 'assistant' ? aiMessages : userMessages}
              inputMessage={inputMessage}
              isThinking={isThinking}
              isListening={isListening}
              onInputChange={setInputMessage}
              onSendMessage={handleSendMessage}
              onVoiceInput={handleVoiceInput}
              onBack={handleBack}
              onDeleteConversation={() => handleDeleteConversation(receiver)}
              messagesEndRef={messagesEndRef}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-hidden"
          >
            <ConversationList
              messages={userMessages}
              chatMessages={aiMessages}
              onSelectConversation={handleSelectConversation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
