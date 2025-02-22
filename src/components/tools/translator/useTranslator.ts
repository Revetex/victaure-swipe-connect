import { useState, useCallback } from "react";
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    // Si on écoute déjà, on arrête
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sourceLang;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setIsListening(false);
      toast.error("Speech recognition failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      setSourceText(transcript);
    };

    recognition.start();

    // Stocke l'instance pour pouvoir l'arrêter plus tard
    const cleanup = () => {
      recognition.stop();
      setIsListening(false);
    };

    // Nettoie après 30 secondes pour éviter une écoute trop longue
    const timeout = setTimeout(cleanup, 30000);

    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, [sourceLang, isListening]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to translate");
        return;
      }

      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { 
          text: sourceText,
          sourceLang,
          targetLang
        }
      });

      if (error) throw error;

      const { error: dbError } = await supabase.from('translations').insert({
        source_text: sourceText,
        translated_text: data.translatedText,
        source_lang: sourceLang,
        target_lang: targetLang,
        detected_lang: data.detectedLanguage,
        user_id: user.id
      });

      if (dbError) throw dbError;

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const speakText = (text: string, lang: string) => {
    if (!text) {
      toast.error("No text to speak");
      return;
    }

    // Si une synthèse est en cours, on l'arrête
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;  // Vitesse normale
    utterance.pitch = 1.0; // Hauteur normale
    utterance.volume = 1.0; // Volume maximum

    // Événements pour gérer l'état de la synthèse
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      toast.error("Speech synthesis failed");
    };

    // On essaie de trouver une voix correspondant à la langue
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang));
    if (voice) {
      utterance.voice = voice;
    }

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
    isSpeaking,
    isListening,
    handleTranslate,
    copyToClipboard,
    speakText,
    swapLanguages,
    startSpeechRecognition
  };
}
