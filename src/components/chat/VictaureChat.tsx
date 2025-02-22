
import { useState, useEffect, useRef } from "react";
import { Bot, Wand2, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { useVictaureChat } from "@/hooks/useVictaureChat";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

interface VictaureChatProps {
  maxQuestions?: number;
  initialMessage?: string;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  initialMessage = "Bonjour ! Je suis Mr. Victaure, votre assistant personnel. Comment puis-je vous aider aujourd'hui ? 🎯",
  context = "Tu es un assistant professionnel qui aide les utilisateurs.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [userQuestions, setUserQuestions] = useState(0);
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useVictaureChat({
    onResponse: (response) => {
      console.log("Received response:", response);
    }
  });

  useEffect(() => {
    const showWelcomeMessage = async () => {
      if (!showWelcome) {
        setShowThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowThinking(false);
        setIsTyping(true);
        setMessages([{ content: initialMessage, isUser: false }]);
        setIsTyping(false);
        setShowWelcome(true);
      }
    };

    showWelcomeMessage();
  }, [initialMessage, showWelcome]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (userQuestions >= maxQuestions) {
      onMaxQuestionsReached?.();
      return;
    }

    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserQuestions(prev => prev + 1);
    setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
    setUserInput("");
    setShowThinking(true);

    try {
      console.log("Sending message with context:", context);
      const response = await sendMessage(userMessage, context);
      if (response) {
        console.log("Received response:", response);
        setMessages(prev => [...prev, { content: response, isUser: false }]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Désolé, je ne peux pas répondre pour le moment");
    } finally {
      setShowThinking(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-xl overflow-hidden border-2 border-black/10 shadow-lg relative">
      <div className="flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 p-4 border-b border-black/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-10 h-10 text-[#1B2A4A]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A]">Mr. Victaure</h3>
            <p className="text-xs text-[#1B2A4A]/60">Assistant IA</p>
          </div>
        </div>
        {showThinking && (
          <div className="flex items-center gap-1 ml-auto">
            <Wand2 className="w-4 h-4 text-[#64B5D9] animate-pulse" />
            <span className="text-xs text-[#64B5D9]">réfléchit...</span>
          </div>
        )}
      </div>

      <div 
        className="relative bg-white/5 p-4"
        style={{
          backgroundImage: "url('/lovable-uploads/60542c40-c17c-42cc-8136-f4780f09946a.png')",
          backgroundSize: "32px",
          backgroundRepeat: "repeat",
          backgroundColor: "rgba(155, 135, 245, 0.05)"
        }}
      >
        <div 
          ref={chatContainerRef}
          className="flex flex-col justify-end h-[400px] overflow-y-auto mb-4 scrollbar-none"
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? "ml-auto bg-[#64B5D9] text-white border-transparent max-w-[80%]"
                    : "mr-auto bg-white dark:bg-zinc-800 text-[#1B2A4A] dark:text-white border-[#64B5D9]/10 max-w-[80%]"
                }`}
              >
                <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={
              userQuestions >= maxQuestions
                ? "Connectez-vous pour continuer..."
                : "Posez une question à Mr. Victaure..."
            }
            disabled={userQuestions >= maxQuestions || isLoading}
            className="flex-1 h-10 px-4 rounded-lg bg-white dark:bg-zinc-800 border border-[#64B5D9]/20 focus:outline-none focus:border-[#64B5D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[#1B2A4A] dark:text-white"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            aria-label="Message input"
          />
          <button
            onClick={handleSendMessage}
            disabled={userQuestions >= maxQuestions || !userInput.trim() || isLoading}
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-[#64B5D9] text-white hover:bg-[#64B5D9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Envoyer le message"
            aria-label="Envoyer le message"
          >
            <MessagesSquare className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
