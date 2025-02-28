
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TranslatorLanguageSelect } from "./TranslatorLanguageSelect";
import { TranslatorTextArea } from "./TranslatorTextArea";
import { useTranslator } from "./useTranslator";
import { ArrowDownUp, ArrowRightLeft, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function TranslatorTab() {
  const translator = useTranslator();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState<'source' | 'target' | null>(null);

  const handleCopy = (text: string, type: 'source' | 'target') => {
    translator.copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Traducteur Multilangue
        </h1>
        <p className="text-muted-foreground mt-2">
          Traduisez vos textes dans de nombreuses langues rapidement et facilement
        </p>
      </motion.div>

      <div className={cn(
        "grid gap-4", 
        isMobile ? "grid-cols-1" : "grid-cols-[1fr,auto,1fr]"
      )}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <TranslatorLanguageSelect
                value={translator.sourceLang}
                onChange={translator.setSourceLang}
              />
              {translator.detectedLanguage && (
                <span className="text-xs text-muted-foreground">
                  Détecté: {translator.detectedLanguage}
                </span>
              )}
            </div>
            <TranslatorTextArea
              value={translator.sourceText}
              onChange={(e) => translator.setSourceText(e.target.value)}
              placeholder="Entrez votre texte ici..."
              onSpeak={() => translator.speakText(translator.sourceText, translator.sourceLang)}
              onListen={translator.startSpeechRecognition}
              onCopy={() => handleCopy(translator.sourceText, 'source')}
              isSpeaking={copied === 'source' ? false : translator.isSpeaking}
              isListening={translator.isListening}
            />
          </Card>
        </motion.div>

        {!isMobile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <Button
              size="icon"
              variant="outline"
              onClick={translator.swapLanguages}
              className="rounded-full h-12 w-12 border-primary/20 bg-card/50 hover:bg-primary/20"
            >
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex justify-center my-2"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={translator.swapLanguages}
              className="rounded-full h-10 w-10 border-primary/20 bg-card/50 hover:bg-primary/20"
            >
              <ArrowDownUp className="h-5 w-5 text-primary" />
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-primary/10">
            <div className="mb-4">
              <TranslatorLanguageSelect
                value={translator.targetLang}
                onChange={translator.setTargetLang}
              />
            </div>
            <TranslatorTextArea
              value={translator.translatedText}
              placeholder="Traduction..."
              readOnly
              onSpeak={() => translator.speakText(translator.translatedText, translator.targetLang)}
              onCopy={() => handleCopy(translator.translatedText, 'target')}
              isSpeaking={copied === 'target' ? false : translator.isSpeaking}
            />
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 flex justify-center"
      >
        <Button
          onClick={translator.handleTranslate}
          disabled={translator.isLoading || !translator.sourceText}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2 text-lg"
        >
          {translator.isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traduction en cours...
            </span>
          ) : (
            <span>Traduire</span>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
