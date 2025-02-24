
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant intelligent et polyvalent. Tu peux discuter de tous les sujets de manière naturelle et engageante.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { 
    messages, 
    isLoading, 
    sendMessage,
    userQuestions,
    error,
    refreshMessages 
  } = useChatMessages({ 
    context,
    maxQuestions, 
    user, 
    onMaxQuestionsReached
  });

  const {
    isRecording,
    isSpeaking,
    startRecording,
    speakText,
    setIsSpeaking
  } = useVoiceFeatures();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    
    try {
      const response = await sendMessage(userInput);
      setUserInput("");
      
      if (response && !error) {
        speakText(response);
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
    }
  };

  const handleRefresh = () => {
    refreshMessages();
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A] to-[#1A1F2C] opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none px-4 py-3 border-b border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-sm">
          <ChatHeader />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="absolute right-4 top-2 text-[#64B5D9]/80 hover:text-[#64B5D9] transition-colors"
            title="Effacer l'historique"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <MessageList 
            ref={chatContainerRef} 
            messages={messages}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex-none bg-[#1B2A4A]/90 border-t border-[#64B5D9]/10 backdrop-blur-sm">
          <ChatInput
            userInput={userInput}
            setUserInput={setUserInput}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            isDisabled={isDisabled}
            disabledMessage={disabledMessage}
            onStartRecording={startRecording}
            onStopSpeaking={() => setIsSpeaking(false)}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
