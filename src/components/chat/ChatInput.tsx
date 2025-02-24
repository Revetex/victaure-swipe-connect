
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
    <div className="p-3 flex items-end gap-2 bg-[#1B2A4A]/90 border-t border-[#64B5D9]/10 backdrop-blur-sm">
      <div className="relative flex-1">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Écrivez votre message..."
          className="min-h-[40px] max-h-[160px] resize-none pr-12 bg-[#1A1F2C]/50 border-[#64B5D9]/20 rounded-xl placeholder:text-[#F1F0FB]/50 text-[#F1F0FB]"
          disabled={isDisabled || isLoading}
        />
      </div>

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-10 w-10 rounded-xl bg-[#1A1F2C]/50 border border-[#64B5D9]/20 hover:bg-[#1A1F2C]/70"
                onClick={onStartRecording}
                disabled={isDisabled || isLoading}
              >
                {isRecording ? (
                  <Square className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4 text-[#64B5D9]" />
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
                  className="shrink-0 h-10 w-10 rounded-xl bg-[#1A1F2C]/50 border border-[#64B5D9]/20 hover:bg-[#1A1F2C]/70"
                  onClick={onStopSpeaking}
                >
                  <StopCircle className="h-4 w-4 text-[#64B5D9]" />
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
                className="shrink-0 h-10 w-10 rounded-xl bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
                onClick={() => {
                  if (!isDisabled) {
                    onSendMessage();
                  } else {
                    toast.error(disabledMessage);
                  }
                }}
                disabled={!userInput.trim() || isLoading || isDisabled}
              >
                <Send className="h-4 w-4" />
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
