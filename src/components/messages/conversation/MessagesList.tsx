import { motion } from "framer-motion";
import { MessageSquare, Bot, Clock, Check, CheckCheck, Search, Bell, Filter, ArrowUpDown, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Message } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface MessagesListProps {
  messages: Message[];
  chatMessages: any[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  onMarkAsRead,
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatMessageDate = (date: string) => {
    return format(new Date(date), "d MMMM à HH:mm", { locale: fr });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value.toLowerCase());
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    toast.success(`Messages triés par date ${sortOrder === "asc" ? "décroissante" : "croissante"}`);
  };

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchQuery) ||
    message.sender.full_name.toLowerCase().includes(searchQuery)
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <motion.div
      key="message-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col overflow-hidden bg-background/95 backdrop-blur-sm"
    >
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messages</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSortOrder}
              className="hover:bg-primary/10"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Rechercher dans les messages..."
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Assistant Message Item */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectConversation("assistant")}
            className="group relative p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-card hover:bg-card/80 border shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            <div className="relative flex gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary/20">
                <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
                <AvatarFallback className="bg-primary/5">
                  <Bot className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-semibold text-lg">Mr. Victaure</h3>
                  <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                    Assistant IA
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 text-left">
                  {chatMessages.length > 0 
                    ? chatMessages[chatMessages.length - 1]?.content 
                    : "Comment puis-je vous aider aujourd'hui ?"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Clock className="h-3 w-3" />
                  <span>En ligne</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Messages Section */}
          {sortedMessages.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 pt-4">
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
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative p-4 rounded-lg cursor-pointer bg-card hover:bg-card/80 border shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => onMarkAsRead(message.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    <div className="relative space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-base">{message.sender.full_name}</h3>
                          {!message.read && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full animate-pulse">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageDate(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(message.created_at), "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.read ? (
                            <CheckCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Check className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
              <p>Aucun message ne correspond à votre recherche</p>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </motion.div>
  );
}