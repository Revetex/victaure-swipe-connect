import { useState } from "react";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationView } from "./conversation/ConversationView";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "../ui/card";

export function MessagesContainer() {
  const { receiver, setReceiver } = useReceiver();
  const [showConversation, setShowConversation] = useState(false);

  const handleSelectConversation = (selectedReceiver: any) => {
    setReceiver(selectedReceiver);
    setShowConversation(true);
  };

  const handleBack = () => {
    setShowConversation(false);
    setReceiver(null);
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showConversation && receiver ? (
        <ConversationView
          receiver={receiver}
          onBack={handleBack}
        />
      ) : (
        <ConversationList
          onSelectConversation={handleSelectConversation}
        />
      )}
    </Card>
  );
}