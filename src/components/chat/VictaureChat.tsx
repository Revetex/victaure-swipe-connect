
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
import { RefreshCcw, X, Sun, Moon } from "lucide-react";
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
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { suggestions, isLoadingSuggestions, generateSuggestions } = useSuggestions();

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

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-background via-secondary/50 to-background opacity-90" />
        
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle, var(--gradient-dots) 1px, transparent 1px)',
            backgroundSize: '15px 15px'
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none border-b border-border/10 bg-secondary/5 backdrop-blur-sm">
          <div className="relative flex items-center justify-between px-4 py-2">
            <ChatHeader />
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground/80 hover:text-foreground transition-colors"
                title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={refreshMessages} 
                className="text-foreground/80 hover:text-foreground transition-colors"
                title="Effacer l'historique"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMaxQuestionsReached} 
                className="text-foreground/80 hover:text-foreground transition-colors"
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div 
          ref={chatContainerRef} 
          className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-foreground/20"
        >
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        
        <div className="relative p-4 bg-gradient-to-t from-background via-background to-transparent">
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
