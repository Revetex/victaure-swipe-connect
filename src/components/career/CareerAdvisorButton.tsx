import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
          className="w-full gap-2 text-lg bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <MessageSquare className="h-5 w-5" />
          Consulter le Conseiller IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>Conseiller en Orientation IA</DialogTitle>
          <DialogDescription>
            Je suis là pour vous aider à développer votre profil professionnel
          </DialogDescription>
        </DialogHeader>
        <CareerAdvisorChat 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </DialogContent>
    </Dialog>
  );
}