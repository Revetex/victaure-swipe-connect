
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    // Si on enregistre déjà, on arrête
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setIsProcessing(false);
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

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const base64Audio = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
          });

          // Appeler l'edge function voice-to-text
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio.split(',')[1] }
          });

          if (error) {
            throw error;
          }

          if (data.text) {
            // Mettre le texte transcrit dans le champ de saisie
            // Cette fonction doit être passée en props
            toast.success("Transcription réussie");
          }

        } catch (err) {
          console.error("Erreur de traitement audio:", err);
          toast.error("Erreur lors du traitement de l'audio");
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
