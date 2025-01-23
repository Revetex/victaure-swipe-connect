import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SimpleChat() {
  const [messages, setMessages] = useState<Array<{
    content: string;
    sender: "user" | "assistant";
  }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = { content: input, sender: "user" as const };
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: input }
      });

      if (error) throw error;

      // Add AI response
      setMessages(prev => [...prev, {
        content: data.response,
        sender: "assistant"
      }]);

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Désolé, j'ai eu un problème. Peux-tu réessayer?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-[#0a0b0f] text-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Mr. Victaure</h2>
          <p className="text-sm text-gray-400">Assistant IA Personnel</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                message.sender === "assistant" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {message.sender === "assistant" ? (
                  <Bot className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                  message.sender === "assistant"
                    ? "bg-gray-800/50"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Écrivez votre message..."
            disabled={isLoading}
            className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}