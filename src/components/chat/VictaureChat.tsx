import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSuggestions } from "./hooks/useSuggestions";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import { toast } from "sonner";
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
  const {
    user
  } = useAuth();
  const {
    suggestions,
    isLoadingSuggestions,
    generateSuggestions
  } = useSuggestions();
  const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
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
      console.error("Error in handleSendMessage:", err);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };
  const handleSuggestionSelect = (suggestion: string) => {
    setUserInput(suggestion);
  };
  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return <div className="flex flex-col h-[calc(100dvh-4rem)] relative overflow-hidden p-4 my-0 py-0 px-0 bg-transparent rounded-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/50 to-[#1A1F2C]/50 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full backdrop-blur-sm border border-[#64B5D9]/10 bg-transparent rounded-sm">
        <div className="flex-none backdrop-blur-md border-b border-[#64B5D9]/10">
          <div className="relative flex items-center justify-between">
            <ChatHeader />
            <div className="flex items-center gap-2 px-4">
              <Button variant="ghost" size="icon" onClick={refreshMessages} className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] transition-colors h-8 w-8" title="Effacer l'historique">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onMaxQuestionsReached} className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] transition-colors h-8 w-8" title="Fermer">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        
        <div className="relative bg-gradient-to-t from-[#1B2A4A]/20 via-[#1B2A4A]/10 to-transparent space-y-3">
          <QuickSuggestions suggestions={suggestions} isLoading={isLoadingSuggestions} onSelect={handleSuggestionSelect} />
          
          <ChatInput userInput={userInput} setUserInput={setUserInput} isRecording={isRecording} isSpeaking={isSpeaking} isLoading={isLoading} isDisabled={isDisabled} disabledMessage={disabledMessage} onStartRecording={startRecording} onStopSpeaking={() => setIsSpeaking(false)} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>;
}