
import { Button } from "@/components/ui/button";
import { Languages, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";
import { TranslatorLanguageSelect } from "./translator/TranslatorLanguageSelect";
import { TranslatorTextArea } from "./translator/TranslatorTextArea";
import { useTranslator } from "./translator/useTranslator";
import { useEffect } from "react";

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

  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      const ctrlPressed = e.ctrlKey || e.metaKey;
      
      if (!ctrlPressed) return;

      switch (e.key.toLowerCase()) {
        case 'enter':
          e.preventDefault();
          handleTranslate();
          break;
        case 'c':
          // Only trigger custom copy if there's translated text
          if (translatedText && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            copyToClipboard(translatedText);
          }
          break;
        case 's':
          e.preventDefault();
          swapLanguages();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [handleTranslate, copyToClipboard, swapLanguages, translatedText]);

  return (
    <div className="container mx-auto p-4 pt-16">
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
                title="Swap languages (Ctrl+S)"
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
          <Button onClick={handleTranslate} disabled={isLoading} title="Translate (Ctrl+Enter)">
            {isLoading ? "Translating..." : "Translate"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

