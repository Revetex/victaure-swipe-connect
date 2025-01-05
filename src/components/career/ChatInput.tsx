import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { ChatInputProps } from "./types";

export function ChatInput({ isLoading, onSendMessage }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Posez vos questions à M. Victaure..."
          className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !newMessage.trim()}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white transition-all ${
            newMessage.trim() && !isLoading ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
          }`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}