
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
import { toast } from "sonner";
import { Toaster } from "../ui/Toaster";

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
  const [isInitializing, setIsInitializing] = useState(true);
  const initializeAttempted = useRef(false);

  const { suggestions, isLoadingSuggestions, generateSuggestions } = useSuggestions();

  // Initialiser le modèle Gemini dès le chargement du composant
  useEffect(() => {
    const initializeGemini = async () => {
      if (initializeAttempted.current) return;
      initializeAttempted.current = true;

      try {
        setIsInitializing(true);
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!API_KEY) {
          console.error("Clé API Gemini manquante");
          toast.error("Configuration Gemini manquante. Veuillez contacter le support.");
          return;
        }
        
        console.log("Initialisation du modèle Gemini...");
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Test simple pour vérifier que le modèle fonctionne
        const result = await model.generateContent("Test de connexion");
        const response = await result.response;
        if (!response) throw new Error("Échec du test de connexion");
        
        setGeminiModel(model);
        console.log("Modèle Gemini initialisé avec succès");
        toast.success("Assistant prêt à discuter");
      } catch (error) {
        console.error("Erreur d'initialisation du modèle Gemini:", error);
        toast.error("Erreur de connexion avec l'assistant. Veuillez réessayer.");
        // Réinitialiser pour permettre une nouvelle tentative
        initializeAttempted.current = false;
      } finally {
        setIsInitializing(false);
      }
    };

    initializeGemini();
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

    if (!geminiModel) {
      toast.error("L'assistant n'est pas encore prêt. Veuillez patienter.");
      return;
    }

    if (isInitializing) {
      toast.error("L'assistant est en cours d'initialisation. Veuillez patienter.");
      return;
    }
    
    try {
      const message = {
        content: userInput,
        isUser: true,
        timestamp: Date.now()
      };
      
      console.log("Envoi du message:", message);
      const response = await sendMessage(message);
      setUserInput("");
      
      if (response && !error) {
        console.log("Réponse reçue:", response);
        speakText(response);
        generateSuggestions(context, messages);
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setUserInput(suggestion);
  };

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
    <>
      <div className="flex flex-col h-[calc(100dvh-4rem)] bg-[#1C1C1C]">
        <div className="flex-none px-4 py-3 border-b border-[#3C3C3C] bg-[#2C2C2C]">
          <ChatHeader />
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshMessages}
            className="absolute right-14 top-2 text-[#808080] hover:text-[#E0E0E0] transition-colors"
            title="Effacer l'historique"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMaxQuestionsReached}
            className="absolute right-4 top-2 text-[#808080] hover:text-[#E0E0E0] transition-colors"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pb-[140px]">
          <MessageList 
            messages={messages}
            isLoading={isLoading || isInitializing}
            ref={chatContainerRef}
          />
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#2C2C2C] border-t border-[#3C3C3C]">
          <QuickSuggestions
            suggestions={suggestions}
            isLoading={isLoadingSuggestions}
            onSelect={(suggestion: string) => setUserInput(suggestion)}
            className="mb-4"
          />
          
          <ChatInput
            userInput={userInput}
            setUserInput={setUserInput}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
            isLoading={isLoading || isInitializing}
            isDisabled={userQuestions >= maxQuestions && !user}
            disabledMessage="Connectez-vous pour continuer à discuter avec Mr Victaure"
            onStartRecording={startRecording}
            onStopSpeaking={() => setIsSpeaking(false)}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
}
