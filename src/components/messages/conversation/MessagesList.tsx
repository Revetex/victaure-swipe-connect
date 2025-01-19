import { motion } from "framer-motion";
import { MessageSquare, InboxIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/hooks/useMessages";
import { useState } from "react";
import { toast } from "sonner";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import { SearchHeader } from "./SearchHeader";

interface MessagesListProps {
  messages: Message[];
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages = [], // Add default empty array
  chatMessages = [], // Add default empty array
  onSelectConversation,
  onMarkAsRead,
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSearch = (value: string) => {
    setSearchQuery(value.toLowerCase());
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    toast.success(`Messages triés par date ${sortOrder === "asc" ? "décroissante" : "croissante"}`);
  };

  // Safely handle potentially undefined messages
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  const filteredMessages = safeMessages.filter(message => {
    if (!message) return false;
    
    const content = String(message.content || '').toLowerCase();
    const senderName = typeof message.sender === 'object' && message.sender !== null
      ? String(message.sender.full_name || '').toLowerCase()
      : String(message.sender || '').toLowerCase();
    
    return content.includes(searchQuery) || senderName.includes(searchQuery);
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime();
    const dateB = new Date(b.created_at || '').getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const unreadCount = safeMessages.filter(m => !m.read).length;

  return (
    <motion.div
      key="message-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col overflow-hidden bg-background/95 backdrop-blur-sm"
    >
      <SearchHeader 
        unreadCount={unreadCount}
        onSearch={handleSearch}
        onToggleSort={toggleSortOrder}
      />

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          <div className="mb-6">
            <AssistantMessage 
              chatMessages={Array.isArray(chatMessages) ? chatMessages : []}
              onSelectConversation={onSelectConversation}
            />
          </div>

          {sortedMessages.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Conversations</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {sortedMessages.length} message{sortedMessages.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {sortedMessages.map((message) => (
                  <UserMessage
                    key={message.id}
                    message={{
                      ...message,
                      sender: typeof message.sender === 'object' && message.sender !== null
                        ? message.sender.full_name || ''
                        : String(message.sender || ''),
                      timestamp: new Date(message.created_at || '')
                    }}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground mt-8"
            >
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <InboxIcon className="h-8 w-8 opacity-50" />
              </div>
              {searchQuery ? (
                <>
                  <p className="text-lg font-medium">Aucun message trouvé</p>
                  <p className="text-sm mt-1">Essayez avec d'autres termes de recherche</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">Votre boîte de réception est vide</p>
                  <p className="text-sm mt-1">Les nouveaux messages apparaîtront ici</p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}