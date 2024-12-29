import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  isThinking: boolean;
  isConnecting: boolean;
  onClearChat: () => void;
}

export function ChatHeader({ isThinking, isConnecting, onClearChat }: ChatHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-b bg-background"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img 
            src="/bot-avatar.png" 
            alt="Mr Victaure" 
            className="w-10 h-10 rounded-full"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${isConnecting ? 'bg-orange-500' : isThinking ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
        </div>
        <div>
          <h3 className="font-semibold">Mr Victaure</h3>
          <p className="text-sm text-muted-foreground">
            {isConnecting ? 'Connexion...' : isThinking ? 'En train d\'écrire...' : 'En ligne'}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClearChat}
        disabled={isConnecting || isThinking}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {isThinking ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </Button>
    </motion.div>
  );
}