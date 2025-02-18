
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { languages } from "./translatorConfig";

export function useTranslator() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleTranslate = async (withSpeech = false) => {
    if (!sourceText.trim()) {
      toast.error("Veuillez entrer du texte à traduire");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour traduire");
        return;
      }

      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { 
          text: sourceText,
          sourceLang,
          targetLang,
          tts: withSpeech
        }
      });

      if (error) throw error;

      setTranslatedText(data.translatedText);
      
      if (data.detectedLanguage) {
        setDetectedLanguage(data.detectedLanguage);
        const langName = languages.find(l => l.code === data.detectedLanguage)?.name;
        toast.success(`Langue détectée : ${langName}`);
      }

      if (data.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      }

      // Save translation in database
      const { error: dbError } = await supabase.from('translations').insert({
        source_text: sourceText,
        translated_text: data.translatedText,
        source_lang: sourceLang,
        target_lang: targetLang,
        detected_lang: data.detectedLanguage,
        user_id: user.id
      });

      if (dbError) throw dbError;

    } catch (error) {
      console.error('Translation error:', error);
      toast.error("La traduction a échoué. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copié dans le presse-papier");
    } catch (err) {
      toast.error("Échec de la copie du texte");
    }
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const playTranslation = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      handleTranslate(true);
    }
  };

  return {
    sourceText,
    setSourceText,
    translatedText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    isLoading,
    detectedLanguage,
    handleTranslate,
    copyToClipboard,
    speakText,
    swapLanguages,
    playTranslation
  };
}
