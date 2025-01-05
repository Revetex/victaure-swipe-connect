import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { CareerAdvisorChat } from "./CareerAdvisorChat";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export function CareerAdvisorButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, handleSendMessage } = useChat();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full gap-2 text-lg"
        >
          <MessageSquare className="h-5 w-5" />
          Consulter le Conseiller IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900/95 border-gray-800">
        <CareerAdvisorChat 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </DialogContent>
    </Dialog>
  );
}