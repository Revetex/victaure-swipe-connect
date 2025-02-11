
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, Copy } from "lucide-react";

interface TranslatorTextAreaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  onSpeak: () => void;
  onCopy?: () => void;
}

export function TranslatorTextArea({
  value,
  onChange,
  placeholder,
  readOnly = false,
  onSpeak,
  onCopy
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onSpeak}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        {onCopy && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
