import { toast } from "sonner";

export const initializeSpeechRecognition = (
  setIsListening: (value: boolean) => void,
  setInputMessage: (value: string) => void
) => {
  if (!("webkitSpeechRecognition" in window)) {
    toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => setIsListening(true);

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    setInputMessage(transcript);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Erreur de reconnaissance vocale:", event.error);
    setIsListening(false);
    toast.error("Erreur lors de la reconnaissance vocale");
  };

  recognition.onend = () => setIsListening(false);

  return recognition;
};