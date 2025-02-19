
import { MoreVertical, PhoneCall, PhoneOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Receiver } from "@/types/messages";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface ConversationHeaderProps {
  receiver: Receiver;
  onBack: () => void;
  onDelete: () => Promise<void>;
}

export function ConversationHeader({ receiver, onBack, onDelete }: ConversationHeaderProps) {
  const [isInCall, setIsInCall] = useState(false);

  const handleCallClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      setIsInCall(true);
      toast.success("Appel en cours avec " + receiver.full_name);
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsInCall(false);
        toast.info("Appel terminé");
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    toast.info("Appel terminé");
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-all duration-300 hover:ring-primary/20">
            {receiver.avatar_url ? (
              <AvatarImage src={receiver.avatar_url} alt={receiver.full_name} />
            ) : (
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex flex-col">
            <span className="font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {receiver.full_name || "Utilisateur"}
            </span>
            {receiver.online_status && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                En ligne
              </motion.span>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {receiver.id !== 'assistant' && receiver.id !== 'victaure' && (
            <Button
              variant={isInCall ? "destructive" : "ghost"}
              size="icon"
              onClick={isInCall ? handleEndCall : handleCallClick}
              className="rounded-full hover:bg-primary/10 transition-colors duration-300"
            >
              {isInCall ? (
                <PhoneOff className="h-4 w-4" />
              ) : (
                <PhoneCall className="h-4 w-4" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors duration-300">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-card/95 backdrop-blur-lg border-primary/10"
            >
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </motion.div>
    </div>
  );
}
