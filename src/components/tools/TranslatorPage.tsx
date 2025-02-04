import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
];

export function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
      return;
    }

    setIsLoading(true);
    // TODO: Implement translation API
    setTimeout(() => {
      setTranslatedText("Translation API coming soon...");
      setIsLoading(false);
    }, 1000);
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
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
          <h1 className="text-2xl font-bold">Traducteur</h1>
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

            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Entrez le texte à traduire..."
              className="h-40 resize-none"
            />
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

            <Textarea
              value={translatedText}
              readOnly
              placeholder="Traduction..."
              className="h-40 resize-none bg-muted"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleTranslate} disabled={isLoading}>
            {isLoading ? "Traduction en cours..." : "Traduire"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}