
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ConversationItemProps {
  participant: any;
  lastMessage?: string;
  lastMessageTime?: string;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onParticipantClick: () => void;
}

export function ConversationItem({
  participant,
  lastMessage,
  lastMessageTime,
  onSelect,
  onDelete,
  onParticipantClick
}: ConversationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg",
        "hover:bg-accent cursor-pointer"
      )}
      onClick={onSelect}
    >
      <button 
        className="shrink-0" 
        onClick={(e) => {
          e.stopPropagation();
          onParticipantClick();
        }}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={participant.avatar_url} alt={participant.full_name} />
          <AvatarFallback>
            <UserCircle2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">
            {participant.full_name || 'Utilisateur'}
          </p>
          {lastMessageTime && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(lastMessageTime), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Supprimer la conversation</span>
      </Button>
    </motion.div>
  );
}
