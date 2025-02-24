
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { toast } from "sonner";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant concis et amical. Tu es attentif à l'orthographe et à la grammaire. Donne des réponses courtes et naturelles, en faisant toujours attention à bien écrire les mots.",
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
    error 
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
      console.log("Sending message to Mr Victaure...");
      const response = await sendMessage(userInput);
      setUserInput("");
      
      if (response) {
        console.log("Response received:", response);
        speakText(response);
      } else if (error) {
        console.error("Error while sending message:", error);
        toast.error("Mr Victaure n'est pas disponible pour le moment. Veuillez réessayer dans quelques instants.");
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  // Log pour le debugging
  console.log("Chat state:", {
    isLoading,
    userQuestions,
    maxQuestions,
    isDisabled,
    error: error?.message,
    messagesCount: messages.length
  });

  return (
    <div className="w-full bg-gradient-to-b from-[#1A1F2C] to-[#151922] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-xl relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#64B5D9]/5 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10">
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
    </div>
  );
}
