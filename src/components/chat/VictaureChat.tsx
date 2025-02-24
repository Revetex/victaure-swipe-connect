
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

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
  const [geminiModel, setGeminiModel] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function initGemini() {
      try {
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secret_name: 'GEMINI_API_KEY' }
        });

        if (error) throw error;
        if (!data?.secret) throw new Error('API key not found');

        const genAI = new GoogleGenerativeAI(data.secret);
        setGeminiModel(genAI.getGenerativeModel({ model: "gemini-pro" }));
      } catch (err) {
        console.error('Error initializing Gemini:', err);
        toast.error("Erreur lors de l'initialisation de l'assistant");
      }
    }

    initGemini();
  }, []);

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
    geminiModel
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
      
      if (response) {
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

  const handleRefresh = () => {
    refreshMessages();
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-[#1A1F2C] to-[#151922] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-xl relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#64B5D9]/5 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none px-4 py-2 border-b border-[#64B5D9]/20">
          <ChatHeader />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="absolute right-4 top-2 text-gray-400 hover:text-[#64B5D9] transition-colors"
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
        
        <div className="flex-none bg-[#1A1F2C] border-t border-[#64B5D9]/20">
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
