
import { useState, useRef, useCallback, useEffect } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { useMessages } from "@/hooks/useMessages";
import { useAIChat } from "@/hooks/useAIChat";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageReadStatus } from "@/hooks/useMessageReadStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

export function MessagesContainer() {
  const { receiver, setReceiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(false);
  const { 
    messages = [], 
    isLoading: isLoadingMessages,
    handleSendMessage: handleUserSendMessage,
    markAsRead,
    hasMore,
    updatePagination
  } = useMessages();
  
  const { 
    messages: aiMessages = [], 
    inputMessage, 
    isThinking, 
    isListening, 
    handleSendMessage: handleAISendMessage, 
    handleVoiceInput, 
    setInputMessage 
  } = useAIChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleDeleteConversation } = useConversationDelete();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useMessageReadStatus(showConversation, receiver);

  const handleSelectConversation = useCallback((selectedReceiver: any) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
    setInputMessage('');
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [setReceiver, setInputMessage]);

  const handleBack = useCallback(() => {
    setShowConversation(false);
    setReceiver(null);
    setInputMessage('');
  }, [setReceiver, setInputMessage]);

  const handleSendMessage = useCallback(() => {
    if (!receiver || !inputMessage.trim()) return;

    if (receiver.id === 'assistant') {
      handleAISendMessage(inputMessage);
    } else {
      handleUserSendMessage(inputMessage);
    }
    
    setInputMessage('');
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [receiver, inputMessage, handleAISendMessage, handleUserSendMessage, setInputMessage]);

  const handleScroll = useCallback((event: any) => {
    const target = event.target as HTMLDivElement;
    const isAtTop = target.scrollTop === 0;
    
    if (isAtTop && hasMore) {
      updatePagination(messages);
    }
  }, [hasMore, messages, updatePagination]);

  const fetchRecentJobs = useCallback(async () => {
    if (!receiver?.id || receiver.id !== 'assistant') return;
    
    try {
      const { data: jobs, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      if (jobs.length > 0) {
        const jobsMessage = `J'ai trouvé quelques offres d'emploi récentes qui pourraient vous intéresser:\n\n${jobs
          .map(
            (job) =>
              `📌 ${job.title} chez ${job.company}\n📍 ${job.location}\n🔗 ${job.url}\n`
          )
          .join('\n')}`;

        handleAISendMessage(jobsMessage);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, [receiver, handleAISendMessage]);

  useEffect(() => {
    if (receiver?.id === 'assistant') {
      const interval = setInterval(fetchRecentJobs, 300000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [receiver, fetchRecentJobs]);

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
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

  const currentMessages = receiver?.id === 'assistant' ? aiMessages : messages;

  return (
    <Card className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 h-full overflow-y-auto"
        onScrollCapture={handleScroll}
      >
        <AnimatePresence mode="wait">
          {showConversation && receiver ? (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <ConversationView
                receiver={receiver}
                messages={currentMessages}
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
              className="flex-1"
            >
              <ConversationList
                messages={messages}
                chatMessages={aiMessages}
                onSelectConversation={handleSelectConversation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
}
