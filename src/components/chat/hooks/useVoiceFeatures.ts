
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        return;
      }

      setIsRecording(true);
      setIsProcessing(true);

      console.log('Starting voice recording...');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          console.log('Processing audio recording...');
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const reader = new FileReader();

          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result?.toString().split(",")[1];
              if (!base64Audio) throw new Error("Échec de la conversion audio");

              console.log('Sending audio to transcription service...');
              const { data, error } = await supabase.functions.invoke("voice-to-text", {
                body: { audio: base64Audio }
              });

              if (error) throw error;
              setIsProcessing(false);

              if (data.text) {
                toast.success("Message vocal transcrit");
                return data.text;
              } else {
                throw new Error("Aucun texte transcrit");
              }
            } catch (err) {
              console.error("Erreur de transcription:", err);
              toast.error("Erreur lors de la transcription");
              setIsProcessing(false);
            }
          };

          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error("Erreur de traitement audio:", err);
          toast.error("Erreur lors du traitement de l'audio");
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      toast.info("Enregistrement en cours...", {
        duration: 5000,
      });

      // Arrêt automatique après 5 secondes
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        }
      }, 5000);

    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      setIsRecording(false);
      setIsProcessing(false);
      toast.error("Impossible d'accéder au microphone");
    }
  }, [isRecording]);

  const speakText = useCallback(async (text: string) => {
    try {
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      console.log('Sending text to speech service...');
      
      const { data, error } = await supabase.functions.invoke("text-to-voice", {
        body: { 
          text,
          voice: "alloy" // Vous pouvez ajuster la voix ici
        }
      });

      if (error) throw error;
      if (!data?.audioContent) throw new Error("Pas de contenu audio reçu");

      console.log('Playing synthesized speech...');
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      audio.onended = () => {
        console.log('Speech playback completed');
        setIsSpeaking(false);
      };

      audio.onerror = (e) => {
        console.error("Erreur de lecture audio:", e);
        toast.error("Erreur lors de la lecture audio");
        setIsSpeaking(false);
      };

      await audio.play();
    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
      toast.error("Erreur lors de la synthèse vocale");
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
