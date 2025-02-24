
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useVoiceFeatures() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

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
                toast.success("Message vocal transcrit avec succès");
                return data.text;
              } else {
                throw new Error("Aucun texte transcrit");
              }
            } catch (err) {
              console.error("Erreur de transcription:", err);
              toast.error("Impossible de transcrire l'audio");
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

  const speakText = useCallback(async (text: string) => {
    try {
      if (isSpeaking) {
        if (audioContextRef.current) {
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      const { data, error } = await supabase.functions.invoke("text-to-voice", {
        body: { 
          text,
          voice: "alloy",
          model: "eleven-multilingual-v2"
        }
      });

      if (error) throw error;
      if (!data?.audioContent) throw new Error("Pas de contenu audio reçu");

      // Créer un nouveau contexte audio
      const newAudioContext = new AudioContext();
      audioContextRef.current = newAudioContext;

      // Décoder le contenu audio base64
      const audioData = Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0));
      const audioBuffer = await newAudioContext.decodeAudioData(audioData.buffer);

      // Créer et connecter les nœuds audio
      const source = newAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(newAudioContext.destination);

      // Gérer la fin de la lecture
      source.onended = () => {
        setIsSpeaking(false);
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };

      // Démarrer la lecture
      source.start();

    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
      toast.error("Impossible de générer la voix");
      setIsSpeaking(false);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
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
