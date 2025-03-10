import React from 'react';
import { Conversation } from '@/types/messages';
import { safeToLowerCase } from '@/utils/marketplace';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Pin, BellOff } from 'lucide-react';

interface CustomConversationListProps {
  conversations: Conversation[];
  searchQuery: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

export function CustomConversationList({ 
  conversations,
  searchQuery,
  selectedConversationId,
  onSelectConversation,
  isLoading
}: CustomConversationListProps) {
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery.trim()) return true;
    
    // Use a safe method to get participant name to avoid type errors
    const participantName = conversation.participant?.full_name || conversation.full_name || '';
    return safeToLowerCase(participantName).includes(safeToLowerCase(searchQuery));
  });
  
  // Sort conversations: pinned first, then by most recent
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // First sort by pinned status
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by date (most recent first)
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 p-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="flex items-center p-3 rounded-lg bg-gray-800/20 animate-pulse h-16"
          />
        ))}
      </div>
    );
  }

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-muted-foreground mb-2">
          {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
        </div>
        <p className="text-sm text-muted-foreground">
          {searchQuery 
            ? `Aucun résultat pour "${searchQuery}"`
            : 'Commencez une nouvelle conversation en cliquant sur le bouton +'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-1 p-1">
      {sortedConversations.map((conversation) => {
        const isSelected = selectedConversationId === conversation.id;
        const participantName = conversation.participant?.full_name || conversation.full_name || 'Inconnu';
        const avatarUrl = conversation.participant?.avatar_url || conversation.avatar_url;
        const isOnline = conversation.participant?.online_status || conversation.online;
        const lastMessage = conversation.last_message || '';
        const timestamp = conversation.updated_at || conversation.created_at;
        const unread = !!conversation.unread;
        const isPinned = !!conversation.isPinned;
        const isMuted = !!conversation.isMuted;

        return (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
              isSelected 
                ? "bg-primary/10 hover:bg-primary/15" 
                : "hover:bg-muted/50",
              unread && "bg-primary/5"
            )}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={avatarUrl || ''} alt={participantName} />
                <AvatarFallback>
                  {participantName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className={cn(
                  "font-medium truncate",
                  unread && "font-semibold"
                )}>
                  {participantName}
                </h3>
                <div className="flex items-center gap-1">
                  {isPinned && (
                    <Pin className="h-3 w-3 text-primary" />
                  )}
                  {isMuted && (
                    <BellOff className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "text-xs whitespace-nowrap",
                    unread ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {formatTimestamp(timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className={cn(
                  "text-sm truncate text-muted-foreground",
                  unread && "text-foreground font-medium"
                )}>
                  {lastMessage || 'Nouvelle conversation'}
                </p>
                
                {unread && (
                  <Badge 
                    variant="default" 
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    •
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
