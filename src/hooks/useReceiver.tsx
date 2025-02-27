
import { createContext, useContext, useState, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { convertOnlineStatusToBoolean } from "@/types/profile";

export interface Receiver {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  online_status: boolean;
  last_seen?: string | null;
}

interface ReceiverContextType {
  receiver: Receiver | null;
  setReceiver: (receiver: Receiver | null) => void;
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
  resetState: () => void;
}

const ReceiverContext = createContext<ReceiverContextType>({
  receiver: null,
  setReceiver: () => {},
  showConversation: false,
  setShowConversation: () => {},
  resetState: () => {},
});

interface ReceiverProviderProps {
  children: ReactNode;
}

export const ReceiverProvider = ({ children }: ReceiverProviderProps) => {
  const [receiver, setReceiverState] = useState<Receiver | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [searchParams] = useSearchParams();
  
  const receiverId = searchParams.get("receiver");

  useEffect(() => {
    const loadReceiver = async () => {
      if (!receiverId) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, online_status, last_seen")
          .eq("id", receiverId)
          .single();

        if (error) {
          console.error("Error loading receiver:", error);
          return;
        }

        if (data) {
          // Assurer que online_status est un booléen
          const receiverWithBoolean: Receiver = {
            id: data.id,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
            online_status: convertOnlineStatusToBoolean(data.online_status),
            last_seen: data.last_seen
          };
          
          setReceiverState(receiverWithBoolean);
          setShowConversation(true);
        }
      } catch (error) {
        console.error("Error loading receiver:", error);
      }
    };

    loadReceiver();
  }, [receiverId]);

  const setReceiver = (receiver: Receiver | null) => {
    setReceiverState(receiver);
  };

  const resetState = () => {
    setReceiverState(null);
    setShowConversation(false);
  };

  return (
    <ReceiverContext.Provider
      value={{
        receiver,
        setReceiver,
        showConversation,
        setShowConversation,
        resetState,
      }}
    >
      {children}
    </ReceiverContext.Provider>
  );
};

export const useReceiver = () => useContext(ReceiverContext);
