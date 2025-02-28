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
  return <div className="p-4 border-t backdrop-blur-sm px-[16px] py-[10px] bg-transparent">
      <div className="flex items-end gap-2">
        <Textarea value={userInput} onChange={handleInputChange} onKeyDown={handleKeyPress} placeholder="Écrivez votre message..." className="min-h-[44px] max-h-[200px]" disabled={isDisabled || isLoading} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="shrink-0" onClick={isRecording ? onStopSpeaking : onStartRecording} disabled={isDisabled || isLoading}>
                {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button size="icon" className="shrink-0" onClick={() => !isDisabled && onSendMessage()} disabled={isDisabled || isLoading || !userInput.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>;
}