
import { useState } from "react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSuggestions } from "./hooks/useSuggestions";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { QuickSuggestions } from "./QuickSuggestions";
import { HfInference } from "@huggingface/inference";

interface AuthChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function AuthChat({
  maxQuestions = 3,
  context = "Je suis votre assistant d'inscription. Je peux vous aider avec le processus d'inscription et répondre à vos questions.",
  onMaxQuestionsReached
}: AuthChatProps) {
  const [userInput, setUserInput] = useState("");
  const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  
  const {
    suggestions,
    isLoadingSuggestions,
    generateSuggestions
  } = useSuggestions();

  const {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error
  } = useChatMessages({
    context,
    maxQuestions,
    user: null,
    onMaxQuestionsReached,
    hf
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
      const message = {
        content: userInput,
        isUser: true,
        timestamp: Date.now()
      };
      
      const response = await sendMessage(message);
      setUserInput("");
      
      if (response && !error) {
        speakText(response);
        generateSuggestions(context, messages);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const isDisabled = userQuestions >= maxQuestions;
  const disabledMessage = "Veuillez vous connecter pour continuer la conversation";

  return (
    <div className="flex flex-col h-[500px] overflow-hidden bg-gradient-to-b from-[#1B2A4A]/50 to-[#1A1F2C]/50 rounded-xl border border-[#64B5D9]/10">
      <ChatHeader 
        title="Assistant d'inscription" 
        subtitle="Je peux vous aider avec le processus d'inscription" 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 bg-gradient-to-t from-[#1A1F2C] to-transparent">
        <QuickSuggestions
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
          onSelect={suggestion => setUserInput(suggestion)}
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
