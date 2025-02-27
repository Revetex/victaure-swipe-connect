
import React from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureBoolean } from '@/utils/adaptorUtils';
import { Receiver } from '@/types/messages';

interface ConversationHeaderAdapterProps {
  receiver?: Receiver;
  name?: string;
  avatar?: string | null;
  isOnline?: boolean | string;
  onBack?: () => void;
}

export function ConversationHeaderAdapter(props: ConversationHeaderAdapterProps) {
  // Extraire et normaliser les propriétés
  const name = props.name || (props.receiver?.full_name || 'Contact');
  const avatar = props.avatar || props.receiver?.avatar_url || null;
  const isOnline = ensureBoolean(props.isOnline ?? props.receiver?.online_status);
  const onBack = props.onBack || (() => window.history.back());

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="mr-2"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Retour</span>
      </Button>
      
      <UserAvatar
        user={{
          id: props.receiver?.id || '',
          name: name,
          image: avatar || undefined
        }}
        className="h-10 w-10"
      />
      
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </div>
  );
}
