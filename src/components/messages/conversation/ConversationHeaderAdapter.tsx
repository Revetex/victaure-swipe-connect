
import React from 'react';
import { UserAvatar } from '@/components/UserAvatar';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationHeaderProps, Receiver } from '@/types/messages';
import { ensureBoolean } from '@/utils/conversationUtils';

/**
 * Adaptateur pour le composant d'en-tête de conversation
 * Fournit une implémentation compatible avec différentes signatures
 */
export function ConversationHeaderAdapter(props: {
  receiver?: Receiver;
  name?: string;
  avatar?: string | null;
  isOnline?: boolean | string;
  onBack?: () => void;
}) {
  // Extraire et normaliser les propriétés
  const name = props.name || (props.receiver?.full_name || 'Contact');
  const avatar = props.avatar || props.receiver?.avatar_url || null;
  const isOnline = ensureBoolean(props.isOnline ?? props.receiver?.online_status);
  const onBack = props.onBack || (() => window.history.back());

  // Créer une version standardisée des props
  const standardProps: ConversationHeaderProps = {
    name,
    avatar,
    isOnline,
    receiver: props.receiver,
    onBack
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={standardProps.onBack}
        className="mr-2"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Retour</span>
      </Button>
      
      <UserAvatar
        user={{
          id: standardProps.receiver?.id || '',
          name: standardProps.name,
          image: standardProps.avatar || undefined
        }}
        className="h-10 w-10"
      />
      
      <div className="flex-1">
        <h3 className="font-medium">{standardProps.name}</h3>
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              standardProps.isOnline ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {standardProps.isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>
    </div>
  );
}
