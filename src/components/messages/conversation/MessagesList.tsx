import { Message } from "@/types/chat/messageTypes";
import { UserProfile } from "@/types/profile";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

interface MessagesListProps {
  messages: any[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant", profile?: UserProfile) => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages = [], // Add default empty array
  chatMessages,
  onSelectConversation,
  onMarkAsRead
}: MessagesListProps) {
  const { profile: currentProfile } = useProfile();

  const { data: profiles = {} } = useQuery({
    queryKey: ["profiles", messages],
    queryFn: async () => {
      if (!messages?.length || !currentProfile?.id) {
        return {};
      }

      const profileIds = messages.map(msg => 
        msg.sender_id === currentProfile.id ? msg.receiver_id : msg.sender_id
      ).filter(Boolean); // Filter out any undefined values

      if (!profileIds.length) {
        return {};
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", profileIds);

      if (error) {
        console.error("Error fetching profiles:", error);
        return {};
      }

      return data.reduce((acc: Record<string, UserProfile>, profile) => {
        if (profile && profile.id) {
          acc[profile.id] = profile;
        }
        return acc;
      }, {});
    },
    enabled: messages?.length > 0 && !!currentProfile?.id,
    initialData: {}
  });

  const handleSelectMessage = async (message: any) => {
    if (!currentProfile) return;
    
    const profileId = message.sender_id === currentProfile.id ? message.receiver_id : message.sender_id;
    const profile = profiles[profileId];
    
    if (profile) {
      onSelectConversation("assistant", profile);
      if (!message.read && message.receiver_id === currentProfile.id) {
        onMarkAsRead(message.id);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="space-y-2">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
          onClick={() => onSelectConversation("assistant")}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">M. Victaure</h3>
            <p className="text-sm text-muted-foreground">Assistant IA</p>
          </div>
        </div>

        {messages?.map((message) => {
          if (!message || !currentProfile) return null;
          
          const profileId = message.sender_id === currentProfile.id ? message.receiver_id : message.sender_id;
          const profile = profiles[profileId];
          
          if (!profile) return null;

          return (
            <div
              key={message.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => handleSelectMessage(message)}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{profile.full_name}</h3>
                  {!message.read && message.receiver_id === currentProfile.id && (
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}