
export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'fr-FR';
      }
    }
  }

  start(onResult: (text: string) => void, onEnd?: () => void) {
    if (!this.recognition) {
      throw new Error("La reconnaissance vocale n'est pas supportée par ce navigateur");
    }

    if (this.isListening) return;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      onResult(text);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    this.recognition.start();
    this.isListening = true;
  }

  stop() {
    if (!this.isListening || !this.recognition) return;
    this.recognition.stop();
    this.isListening = false;
  }

  isSupported() {
    return !!this.recognition;
  }
}

export const speechService = new SpeechRecognitionService();
