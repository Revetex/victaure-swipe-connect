
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle2, Trash2, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ConversationItemProps {
  participant: any;
  lastMessage?: string;
  lastMessageTime?: string;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onParticipantClick: () => void;
  isPinned?: boolean;
}

export function ConversationItem({
  participant,
  lastMessage,
  lastMessageTime,
  onSelect,
  onDelete,
  onParticipantClick,
  isPinned = false
}: ConversationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg",
        "hover:bg-[#64B5D9]/10 cursor-pointer",
        isPinned && "bg-[#1B2A4A]/30 border border-[#64B5D9]/20"
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
        <Avatar className="h-10 w-10 ring-2 ring-[#64B5D9]/20">
          <AvatarImage src={participant.avatar_url} alt={participant.full_name} />
          <AvatarFallback>
            <UserCircle2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[#F2EBE4]">
              {participant.full_name || 'Utilisateur'}
            </p>
            {isPinned && <Pin className="h-3 w-3 text-[#64B5D9]" />}
          </div>
          {lastMessageTime && (
            <span className="text-xs text-[#F2EBE4]/60">
              {formatDistanceToNow(new Date(lastMessageTime), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="text-sm text-[#F2EBE4]/60 truncate">
            {lastMessage}
          </p>
        )}
      </div>

      {!isPinned && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer la conversation</span>
        </Button>
      )}
    </motion.div>
  );
}
