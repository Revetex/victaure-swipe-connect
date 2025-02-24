
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Mic, Send, Square, StopCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { toast } from "sonner";

export interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  isRecording: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  disabledMessage: string;
  onStartRecording: () => Promise<void>;
  onStopSpeaking: () => void;
  onSendMessage: () => Promise<void>;
}

export function ChatInput({
  userInput,
  setUserInput,
  isRecording,
  isSpeaking,
  isLoading,
  isDisabled,
  disabledMessage,
  onStartRecording,
  onStopSpeaking,
  onSendMessage
}: ChatInputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onSendMessage();
      } else {
        toast.error(disabledMessage);
      }
    }
  };

  return (
    <div className="relative p-4 sm:p-6 flex items-end gap-2 bg-[#1A1F2C] border-t border-[#64B5D9]/10 backdrop-blur-sm overflow-hidden">
      {/* Effet d'étoiles filantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
        
        {/* Étoiles statiques */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
               backgroundSize: '15px 15px'
             }} 
        />
        
        {/* Étoiles filantes */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#64B5D9] to-transparent"
              style={{
                width: '100px',
                transform: `rotate(-45deg)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `shootingStars ${3 + i}s linear infinite ${i * 1.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shootingStars {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(-45deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Contenu de la barre de saisie */}
      <div className="relative flex-1 z-10">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Écrivez votre message..."
          className="min-h-[45px] max-h-[160px] resize-none pr-12 bg-[#1A1F2C]/80 border-[#64B5D9]/20 rounded-xl placeholder:text-[#F1F0FB]/50 text-[#F1F0FB] focus:border-[#64B5D9]/50 transition-all"
          disabled={isDisabled || isLoading}
        />
      </div>

      <div className="flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-11 w-11 rounded-xl bg-[#1A1F2C]/80 border border-[#64B5D9]/20 hover:bg-[#1A1F2C] hover:border-[#64B5D9]/50 transition-all"
                onClick={onStartRecording}
                disabled={isDisabled || isLoading}
              >
                {isRecording ? (
                  <Square className="h-5 w-5 text-red-500" />
                ) : (
                  <Mic className="h-5 w-5 text-[#64B5D9]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isSpeaking && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0 h-11 w-11 rounded-xl bg-[#1A1F2C]/80 border border-[#64B5D9]/20 hover:bg-[#1A1F2C] hover:border-[#64B5D9]/50 transition-all"
                  onClick={onStopSpeaking}
                >
                  <StopCircle className="h-5 w-5 text-[#64B5D9]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Arrêter la lecture
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="shrink-0 h-11 w-11 rounded-xl bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
                onClick={() => {
                  if (!isDisabled) {
                    onSendMessage();
                  } else {
                    toast.error(disabledMessage);
                  }
                }}
                disabled={!userInput.trim() || isLoading || isDisabled}
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Envoyer le message
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
