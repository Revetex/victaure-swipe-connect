import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { generateAIResponse } from "@/services/perplexityService";

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);
    setInputMessage("");

    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "...",
      sender: "assistant",
      timestamp: new Date(),
      thinking: true,
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      setMessages((prev) => prev.filter(m => !m.thinking));
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la réponse.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
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
      
      <ChatHeader onClearChat={clearChat} />

      <ScrollArea className="flex-grow mb-4 pr-4 relative">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              thinking={message.thinking}
            />
          ))}
        </div>
      </ScrollArea>

      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        isListening={isListening}
      />
    </div>
  );
}