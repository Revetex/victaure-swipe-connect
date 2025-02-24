
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

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
            // Ici vous pouvez ajouter la logique de transcription si nécessaire
          };

          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error("Erreur de traitement audio:", err);
          toast.error("Erreur lors du traitement de l'audio");
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }, 5000);

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
      if (isSpeaking && speechSynthesisRef.current) {
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

      // Lancement de la synthèse vocale
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
      toast.error("Impossible de générer la voix");
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  return {
    isRecording,
    isSpeaking,
    isProcessing,
    startRecording,
    speakText,
    setIsSpeaking
  };
}
