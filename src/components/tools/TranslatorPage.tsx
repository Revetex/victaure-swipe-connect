import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowLeftRight, Volume2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
];

export function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { 
          text: sourceText,
          sourceLang,
          targetLang
        }
      });

      if (error) throw error;

      setTranslatedText(data.translatedText);
      if (data.detectedLanguage) {
        setDetectedLanguage(data.detectedLanguage);
        const langName = languages.find(l => l.code === data.detectedLanguage)?.name;
        toast.success(`Detected language: ${langName}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <Languages className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Translator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Select value={sourceLang} onValueChange={setSourceLang}>
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
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="h-40 resize-none pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => speakText(sourceText, sourceLang)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={targetLang} onValueChange={setTargetLang}>
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
                onClick={swapLanguages}
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
                  onClick={() => speakText(translatedText, targetLang)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(translatedText)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleTranslate} disabled={isLoading}>
            {isLoading ? "Translating..." : "Translate"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}