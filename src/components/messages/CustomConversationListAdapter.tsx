
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types/messages';

interface CustomConversationListAdapterProps {
  conversations: any[];
  onConversationSelected: (conversation: any) => void;
  loading?: boolean;
}

export function CustomConversationListAdapter({
  conversations,
  onConversationSelected,
  loading = false
}: CustomConversationListAdapterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!conversations) {
      setFilteredConversations([]);
      return;
    }

    // Filtrer en toute sécurité
    const filtered = conversations.filter(conversation => {
      let name = '';
      
      // Extraire le nom en toute sécurité
      if (typeof conversation.name === 'string') {
        name = conversation.name;
      } else if (conversation.participant && typeof conversation.participant === 'object') {
        name = conversation.participant.full_name || '';
      } else if (typeof conversation.participant === 'string') {
        name = conversation.participant;
      }
      
      // Vérifier si le terme de recherche est inclus dans le nom
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  // Adapteur pour la fonction de clic
  const handleConversationClick = (conversation: any) => {
    // Adapter la conversation pour qu'elle ait toutes les propriétés nécessaires
    const adaptedConversation = {
      ...conversation,
      created_at: conversation.created_at || new Date().toISOString(),
      updated_at: conversation.updated_at || new Date().toISOString()
    };
    
    // Utiliser any pour contourner l'incompatibilité
    onConversationSelected(adaptedConversation as any);
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement des conversations...</div>;
  }

  return (
    <div className="space-y-2 p-2">
      <input
        type="text"
        placeholder="Rechercher une conversation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
      />
      
      {filteredConversations.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          Aucune conversation trouvée
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredConversations.map(conversation => (
            <li 
              key={conversation.id}
              className="p-3 border rounded hover:bg-gray-50 cursor-pointer flex items-center justify-between dark:border-zinc-700 dark:hover:bg-zinc-700"
              onClick={() => handleConversationClick(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden dark:bg-zinc-600">
                  {conversation.avatar_url && (
                    <img 
                      src={conversation.avatar_url} 
                      alt="Avatar"
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">
                    {typeof conversation.name === 'string' 
                      ? conversation.name 
                      : (conversation.participant?.full_name || 'Contact')}
                  </h4>
                  <p className="text-sm text-gray-500 truncate max-w-xs dark:text-gray-400">
                    {conversation.last_message || 'Pas de message'}
                  </p>
                </div>
              </div>
              
              {conversation.unread > 0 && (
                <Badge className="bg-blue-500 text-white">
                  {conversation.unread}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
