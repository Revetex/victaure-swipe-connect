
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi et le recrutement. Tu es chaleureux, empathique et très professionnel.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { 
    messages, 
    isLoading, 
    sendMessage,
    userQuestions 
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
    
    const response = await sendMessage(userInput);
    setUserInput("");
    
    if (response) {
      speakText(response);
    }
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer...";

  return (
    <div className="w-full bg-[#1A1F2C] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-lg relative">
      <ChatHeader />
      <MessageList 
        ref={chatContainerRef} 
        messages={messages}
        isLoading={isLoading}
      />
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
  );
}
