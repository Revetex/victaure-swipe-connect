
import { Button } from "@/components/ui/button";
import { TranslatorLayout } from "./translator/TranslatorLayout";
import { TranslatorInput } from "./translator/TranslatorInput";
import { TranslatorOutput } from "./translator/TranslatorOutput";
import { useTranslator, languages } from "./translator/useTranslator";

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
    <TranslatorLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TranslatorInput
          sourceText={sourceText}
          onSourceTextChange={setSourceText}
          sourceLang={sourceLang}
          onSourceLangChange={setSourceLang}
          languages={languages}
          onSpeak={speakText}
        />

        <TranslatorOutput
          translatedText={translatedText}
          targetLang={targetLang}
          onTargetLangChange={setTargetLang}
          languages={languages}
          onSpeak={speakText}
          onCopy={copyToClipboard}
          onSwapLanguages={swapLanguages}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleTranslate} disabled={isLoading}>
          {isLoading ? "Translating..." : "Translate"}
        </Button>
      </div>
    </TranslatorLayout>
  );
}

