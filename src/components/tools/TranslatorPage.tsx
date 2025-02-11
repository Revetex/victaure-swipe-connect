
import { Button } from "@/components/ui/button";
import { Languages, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { TranslatorLanguageSelect } from "./translator/TranslatorLanguageSelect";
import { TranslatorTextArea } from "./translator/TranslatorTextArea";
import { useTranslator } from "./translator/useTranslator";

export function TranslatorPage() {
  const {
    sourceText,
    setSourceText,
    translatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isLoading,
    handleTranslate,
    copyToClipboard,
    speakText,
    swapLanguages
  } = useTranslator();

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
            <TranslatorLanguageSelect
              value={sourceLang}
              onChange={setSourceLang}
            />

            <TranslatorTextArea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              onSpeak={() => speakText(sourceText, sourceLang)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <TranslatorLanguageSelect
                value={targetLang}
                onChange={setTargetLang}
              />

              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="flex-shrink-0"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <TranslatorTextArea
              value={translatedText}
              placeholder="Translation..."
              readOnly
              onSpeak={() => speakText(translatedText, targetLang)}
              onCopy={() => copyToClipboard(translatedText)}
            />
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
