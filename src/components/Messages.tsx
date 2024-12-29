import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export function Messages() {
  const { 
    messages, 
    sendMessage, 
    handleJobResponse, 
    isCreatingJob,
    isThinking,
    inputMessage,
    setInputMessage,
    handleVoiceInput,
    isListening
  } = useChat();

  const handleClearChat = () => {
    // This will be implemented later
    console.log("Clear chat");
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <ChatHeader onClearChat={handleClearChat} isThinking={isThinking} />
      
      <ScrollArea className="flex-1 px-4">
        <AnimatePresence mode="popLayout">
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage
                  message={message}
                  onResponse={isCreatingJob ? handleJobResponse : undefined}
                />
              </motion.div>
            ))}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-muted-foreground"
              >
                <div className="flex space-x-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce delay-100">•</span>
                  <span className="animate-bounce delay-200">•</span>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>

      <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <ChatInput 
          value={inputMessage}
          onChange={setInputMessage}
          onSend={sendMessage}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
}