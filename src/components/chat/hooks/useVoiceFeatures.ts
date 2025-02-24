
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      setIsProcessing(true);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          const reader = new FileReader();

          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result?.toString().split(",")[1];
              if (!base64Audio) throw new Error("Échec de la conversion audio");

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
              setIsProcessing(false);
            }
          };

          reader.readAsDataURL(audioBlob);
        } catch (err) {
          console.error("Erreur de traitement audio:", err);
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      toast.info("Enregistrement en cours...", {
        duration: 5000,
      });

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }, 5000);

    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      setIsRecording(false);
      setIsProcessing(false);
      toast.error("Impossible d'accéder au microphone");
    }
  }, []);

  const speakText = useCallback(async (text: string) => {
    try {
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      const { data, error } = await supabase.functions.invoke("text-to-voice", {
        body: { text }
      });

      if (error) throw error;
      if (!data?.audioContent) throw new Error("Pas de contenu audio reçu");

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (e) => {
        console.error("Erreur de lecture audio:", e);
        setIsSpeaking(false);
      };

      await audio.play();
    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
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
