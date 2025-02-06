import { useState, useCallback, useEffect } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
}

export function useSpeechRecognition({ onResult }: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [hasRecognitionSupport] = useState(
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  );

  const recognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';
    return recognition;
  }, []);

  const startListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (!recognitionInstance) return;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[0].isFinal && onResult) {
        onResult(transcript);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionInstance.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [recognition, onResult]);

  const stopListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (recognitionInstance) {
      recognitionInstance.stop();
      setIsListening(false);
    }
  }, [recognition]);

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport
  };
}