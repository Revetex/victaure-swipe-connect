import { useState } from "react";
import { UserRound, Bot, Sparkles, Send, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function MrVictaure() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
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
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Je suis là pour vous aider. Comment puis-je vous assister aujourd'hui ?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

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
    <div className="bg-victaure-metal/20 rounded-lg p-4 border border-victaure-blue/20 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center hover:bg-victaure-blue/30 transition-colors">
            <Bot className="h-6 w-6 text-victaure-blue animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Mr. Victaure
              <Sparkles className="h-4 w-4 text-victaure-orange animate-glow" />
            </h2>
            <p className="text-sm text-victaure-gray">Votre assistant personnel</p>
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

      <ScrollArea className="flex-grow mb-4 pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-victaure-blue text-white"
                    : "bg-victaure-metal/40"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Écrivez votre message..."
          className="flex-grow"
        />
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
  );
}