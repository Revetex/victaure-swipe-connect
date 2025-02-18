
export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;

  constructor() {
    try {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'fr-FR';
        }
      }
    } catch (error) {
      console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur");
      this.recognition = null;
    }
  }

  start(onResult: (text: string) => void, onEnd?: () => void) {
    if (!this.recognition) {
      console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur");
      return;
    }

    if (this.isListening) return;

    try {
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const text = result[0].transcript;
        onResult(text);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance vocale:', error);
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (!this.isListening || !this.recognition) return;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de la reconnaissance vocale:', error);
    }
    this.isListening = false;
  }

  isSupported() {
    return !!this.recognition;
  }
}

export const speechService = new SpeechRecognitionService();
