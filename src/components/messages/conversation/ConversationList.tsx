import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver";
import { cn } from "@/lib/utils";
import { ConversationItem } from "./components/ConversationItem";
import { ConversationSearch } from "./components/ConversationSearch";
import { NewConversationPopover } from "./components/NewConversationPopover";
import { useEffect, useState } from "react";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: { className?: string }) {
  const { user } = useAuth();
  const { setSelectedConversationId } = useReceiver();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedConversationId = useReceiver().selectedConversationId;

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/conversations?userId=${user?.id}&search=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Could not fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectFriend = () => {
    setSearchTerm("");
  };

  const handleConversationClick = (conversation: any) => {
    setSelectedConversationId(conversation.id);
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="border-b">
        <div className="flex items-center justify-between p-3">
          <ConversationSearch 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange}
          />
          <NewConversationPopover 
            onSelectFriend={handleSelectFriend} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-spinner" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <p>Aucune conversation</p>
            <p className="text-sm">Commencez une nouvelle conversation</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => handleConversationClick(conversation)}
            />
          ))
        )}
      </div>
    </div>
  );
}
