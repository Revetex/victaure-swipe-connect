
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      // Si on enregistre déjà, on arrête
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      return;
    }

    try {
      setIsRecording(true);
      setIsProcessing(true);
      toast.info("Enregistrement en cours...");

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const reader = new FileReader();

          reader.onloadend = () => {
            setIsProcessing(false);
          };

          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error("Erreur de traitement audio:", err);
          toast.error("Erreur lors du traitement de l'audio");
        } finally {
          setIsRecording(false);
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      
      // Arrêt automatique après 30 secondes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 30000);

    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      toast.error("Impossible d'accéder au microphone");
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, [isRecording]);

  const speakText = useCallback((text: string) => {
    try {
      // Si déjà en train de parler, on arrête
      if (isSpeaking && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Création d'une nouvelle instance de SpeechSynthesisUtterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = utterance;

      // Configuration de la voix en français
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
      utterance.voice = frenchVoice || null;
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Gestion des événements
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Erreur de synthèse vocale:', event);
        toast.error("Erreur lors de la lecture vocale");
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
      };

      // S'assurer que toute synthèse précédente est arrêtée
      window.speechSynthesis.cancel();

      // Lancement de la synthèse vocale
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
      toast.error("Impossible de générer la voix");
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, []);

  // Nettoyage lors du démontage du composant
  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    stopSpeaking();
  }, [stopSpeaking]);

  return {
    isRecording,
    isSpeaking,
    isProcessing,
    startRecording,
    speakText,
    stopSpeaking,
    cleanup
  };
}
