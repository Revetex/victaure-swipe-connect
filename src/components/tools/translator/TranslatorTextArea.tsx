
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, VolumeX, Copy, Mic, MicOff } from "lucide-react";

interface TranslatorTextAreaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  onSpeak: () => void;
  onListen?: () => void;
  onCopy?: () => void;
  isSpeaking?: boolean;
  isListening?: boolean;
}

export function TranslatorTextArea({
  value,
  onChange,
  placeholder,
  readOnly = false,
  onSpeak,
  onListen,
  onCopy,
  isSpeaking = false,
  isListening = false
}: TranslatorTextAreaProps) {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`h-40 resize-none pr-10 ${readOnly ? 'bg-muted' : ''}`}
      />
      <div className="absolute right-2 top-2 flex flex-col gap-2">
        {onListen && (
          <Button
            type="button"
            variant={isListening ? "default" : "ghost"}
            size="icon"
            onClick={onListen}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button
          type="button"
          variant={isSpeaking ? "default" : "ghost"}
          size="icon"
          onClick={onSpeak}
          className={isSpeaking ? "bg-primary text-primary-foreground" : ""}
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        {onCopy && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onCopy()}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
