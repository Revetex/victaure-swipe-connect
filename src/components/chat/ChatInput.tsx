
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Mic, Send, Square, StopCircle } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
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
    <div className="p-4 flex items-end gap-2">
      <div className="relative flex-1">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Écrivez votre message..."
          className="min-h-[60px] resize-none pr-12 bg-background/50"
          disabled={isDisabled || isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Tooltip content={isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message"}>
          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={onStartRecording}
            disabled={isDisabled || isLoading}
          >
            {isRecording ? (
              <Square className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </Tooltip>

        {isSpeaking && (
          <Tooltip content="Arrêter la lecture">
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={onStopSpeaking}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </Tooltip>
        )}

        <Tooltip content="Envoyer le message">
          <Button
            size="icon"
            className="shrink-0"
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
        </Tooltip>
      </div>
    </div>
  );
}
