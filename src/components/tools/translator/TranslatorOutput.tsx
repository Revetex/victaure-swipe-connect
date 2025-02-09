
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Volume2, Copy } from "lucide-react";
import { Language } from "./types";

interface TranslatorOutputProps {
  translatedText: string;
  targetLang: string;
  onTargetLangChange: (lang: string) => void;
  languages: Language[];
  onSpeak: (text: string, lang: string) => void;
  onCopy: (text: string) => void;
  onSwapLanguages: () => void;
}

export function TranslatorOutput({
  translatedText,
  targetLang,
  onTargetLangChange,
  languages,
  onSpeak,
  onCopy,
  onSwapLanguages
}: TranslatorOutputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={targetLang} onValueChange={onTargetLangChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onSwapLanguages}
          className="flex-shrink-0"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Textarea
          value={translatedText}
          readOnly
          placeholder="Translation..."
          className="h-40 resize-none bg-muted pr-10"
        />
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSpeak(translatedText, targetLang)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(translatedText)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

