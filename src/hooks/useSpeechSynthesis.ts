
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  onEnd?: () => void;
}

export const useSpeechSynthesis = ({ onEnd }: UseSpeechSynthesisProps = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    const frenchVoice = voices.find(voice => 
      voice.lang.startsWith('fr') || 
      voice.lang.includes('FR')
    );
    
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices, onEnd, cancel]);

  return {
    isSupported,
    isSpeaking,
    speak,
    cancel,
    voices
  };
};
