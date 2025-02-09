
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { Language } from "./types";

interface TranslatorInputProps {
  sourceText: string;
  onSourceTextChange: (text: string) => void;
  sourceLang: string;
  onSourceLangChange: (lang: string) => void;
  languages: Language[];
  onSpeak: (text: string, lang: string) => void;
}

export function TranslatorInput({ 
  sourceText, 
  onSourceTextChange, 
  sourceLang, 
  onSourceLangChange,
  languages,
  onSpeak
}: TranslatorInputProps) {
  return (
    <div className="space-y-4">
      <Select value={sourceLang} onValueChange={onSourceLangChange}>
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

      <div className="relative">
        <Textarea
          value={sourceText}
          onChange={(e) => onSourceTextChange(e.target.value)}
          placeholder="Enter text to translate..."
          className="h-40 resize-none pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => onSpeak(sourceText, sourceLang)}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

