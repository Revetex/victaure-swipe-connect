
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/messages";
import { ChatMessage } from "../../ChatMessage";
import { Button } from "@/components/ui/button";
import { Trash2, Reply, Smile, Copy } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onDeleteMessage: (messageId: string) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  onDeleteMessage,
  messagesEndRef 
}: MessageListProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, messagesEndRef]);

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copié dans le presse-papier");
    setExpandedMessageId(null);
  };

  const handleReplyToMessage = (messageId: string) => {
    // In a real implementation, this would add a reply reference
    toast.info("Fonctionnalité de réponse à venir");
    setExpandedMessageId(null);
  };

  const toggleMessageActions = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  return (
    <div className="flex-1 p-2 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div className="mb-1" onClick={() => toggleMessageActions(message.id)}>
              <ChatMessage 
                message={message}
                isOwn={message.sender_id === currentUserId}
              />
            </div>
            
            <AnimatePresence>
              {expandedMessageId === message.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute bottom-full mb-1 z-10 flex items-center gap-1 p-1 rounded-lg shadow-md",
                    "bg-[#242F44] border border-[#64B5D9]/20",
                    message.sender_id === currentUserId ? "right-0" : "left-0"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-[#1A2335]"
                    onClick={() => handleCopyMessage(message.content)}
                    title="Copier"
                  >
                    <Copy className="h-4 w-4 text-[#F2EBE4]/70" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-[#1A2335]"
                    onClick={() => handleReplyToMessage(message.id)}
                    title="Répondre"
                  >
                    <Reply className="h-4 w-4 text-[#F2EBE4]/70" />
                  </Button>
                  
                  {message.sender_id === currentUserId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-500/20 text-red-400 hover:text-red-500"
                      onClick={() => {
                        onDeleteMessage(message.id);
                        setExpandedMessageId(null);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="text-xs text-[#F2EBE4]/40 mt-1 px-2">
              {new Date(message.created_at || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {message.status === 'read' && message.sender_id === currentUserId && (
                <span className="ml-2">• Lu</span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
      
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
          <div className="bg-[#64B5D9]/10 p-4 rounded-full mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Smile className="h-10 w-10 text-[#64B5D9]/70" />
            </motion.div>
          </div>
          <h3 className="text-lg font-medium text-[#F2EBE4]/90 mb-2">
            Aucun message
          </h3>
          <p className="text-[#F2EBE4]/60 max-w-xs">
            Commencez une conversation en envoyant un message ci-dessous.
          </p>
        </div>
      )}
    </div>
  );
}
