
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
    isSpeaking,
    isListening,
    handleTranslate,
    copyToClipboard,
    speakText,
    swapLanguages,
    startSpeechRecognition
  } = useTranslator();

  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      const ctrlPressed = e.ctrlKey || e.metaKey;
      if (!ctrlPressed) return;
      switch (e.key.toLowerCase()) {
        case 'enter':
          e.preventDefault();
          handleTranslate();
          break;
        case 'c':
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
    <div className="min-h-screen pt-16 bg-gradient-to-br from-[#1A1F2C]/90 to-[#1B2A4A]/80">
      <div className="container max-w-4xl mx-auto p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <Languages className="h-6 w-6 text-[#64B5D9]" />
            <h1 className="text-2xl font-bold text-gradient-primary">Translator</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onListen={startSpeechRecognition}
                isSpeaking={isSpeaking}
                isListening={isListening}
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
                  className="flex-shrink-0 bg-white/5 hover:bg-white/10 border-white/10"
                  title="Swap languages (Ctrl+S)"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              <TranslatorTextArea
                value={translatedText}
                placeholder="Translation will appear here..."
                readOnly
                onSpeak={() => speakText(translatedText, targetLang)}
                onCopy={() => copyToClipboard(translatedText)}
                isSpeaking={isSpeaking}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleTranslate} 
              disabled={isLoading} 
              title="Translate (Ctrl+Enter)"
              className="bg-[#64B5D9] hover:bg-[#64B5D9]/80 text-white"
            >
              {isLoading ? "Translating..." : "Translate"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
