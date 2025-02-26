
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSuggestions } from "./hooks/useSuggestions";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [geminiModel, setGeminiModel] = useState<any>(null);

  const { suggestions, isLoadingSuggestions, generateSuggestions } = useSuggestions();

  useEffect(() => {
    const API_KEY = import.meta.env.GEMINI_API_KEY || ""; // Utilisera la variable d'environnement
    if (!API_KEY) {
      console.error("No Gemini API key found");
      return;
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    setGeminiModel(model);
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
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setUserInput(suggestion);
  };

  const handleRefresh = () => {
    refreshMessages();
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

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-[#1A1F2C] relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
        
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
               backgroundSize: '15px 15px'
             }} 
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none px-4 py-3 border-b border-[#64B5D9]/10 bg-[#1B2A4A]/50 backdrop-blur-sm">
          <ChatHeader />
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshMessages}
            className="absolute right-14 top-2 text-[#64B5D9]/80 hover:text-[#64B5D9] transition-colors"
            title="Effacer l'historique"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMaxQuestionsReached}
            className="absolute right-4 top-2 text-[#64B5D9]/80 hover:text-[#64B5D9] transition-colors"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pb-24">
          <MessageList 
            messages={messages}
            isLoading={isLoading}
            ref={chatContainerRef}
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C] to-transparent">
          <QuickSuggestions
            suggestions={suggestions}
            isLoading={isLoadingSuggestions}
            onSelect={handleSuggestionSelect}
            className="mb-4"
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
    </div>
  );
}
