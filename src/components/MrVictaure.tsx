import { useState } from "react";
import { UserRound, Bot, Sparkles, Send, Mic, X, Brain, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  thinking?: boolean;
}

export function MrVictaure() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsThinking(true);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "...",
        sender: "assistant",
        timestamp: new Date(),
        thinking: true,
      };
      
      setMessages((prev) => [...prev, thinkingMessage]);
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => prev.filter(m => !m.thinking));
        
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "Je suis là pour vous aider. Comment puis-je vous assister aujourd'hui ?",
          sender: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      }, 1500);
    }, 500);

    setInputMessage("");
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La reconnaissance vocale n'est pas supportée sur votre navigateur.",
      });
      return;
    }

    try {
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = () => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la reconnaissance vocale.",
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'activation du microphone.",
      });
      setIsListening(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat effacé",
      description: "L'historique de conversation a été effacé.",
    });
  };

  return (
    <div className="bg-victaure-metal/20 rounded-lg p-4 border border-victaure-blue/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-[500px] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-victaure-blue/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center hover:bg-victaure-blue/30 transition-colors">
              <Bot className="h-6 w-6 text-victaure-blue animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-victaure-green/20 flex items-center justify-center">
              <Brain className="h-3 w-3 text-victaure-green" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Mr. Victaure
              <Sparkles className="h-4 w-4 text-victaure-orange animate-glow" />
            </h2>
            <p className="text-sm text-victaure-gray flex items-center gap-1">
              <Wand2 className="h-3 w-3" />
              Assistant IA Personnel
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="hover:bg-victaure-blue/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-grow mb-4 pr-4 relative">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg flex items-center gap-2 ${
                  message.sender === "user"
                    ? "bg-victaure-blue text-white"
                    : "bg-victaure-metal/40"
                } ${message.thinking ? "animate-pulse" : ""}`}
              >
                {message.sender === "assistant" && !message.thinking && (
                  <Bot className="h-4 w-4 shrink-0" />
                )}
                {message.content}
                {message.sender === "user" && (
                  <UserRound className="h-4 w-4 shrink-0" />
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-center">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-victaure-blue/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-victaure-blue/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-victaure-blue/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 relative">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Écrivez votre message..."
          className="flex-grow pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <Button
            onClick={handleVoiceInput}
            variant="ghost"
            size="icon"
            className={`hover:bg-victaure-blue/10 ${
              isListening ? "bg-victaure-blue/20" : ""
            }`}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="ghost"
            size="icon"
            className="hover:bg-victaure-blue/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}