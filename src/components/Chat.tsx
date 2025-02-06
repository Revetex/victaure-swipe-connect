import { useState } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";

export function Chat() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setShowWelcome(true); // Show welcome screen again when chat is closed
  };

  return (
    <div className="relative">
      {showWelcome && (
        <MrVictaureWelcome 
          onDismiss={() => setShowWelcome(false)}
          onStartChat={handleStartChat}
        />
      )}
      
      {showChat && (
        <AIAssistant onClose={handleCloseChat} />
      )}
    </div>
  );
}