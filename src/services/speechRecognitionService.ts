
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

class CustomSpeechRecognition {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private confidenceThreshold: number = 0.7;
  private context: string[] = [];
  private maxContextLength: number = 5;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.synthesis = window.speechSynthesis;
    
    this.recognition.lang = 'fr-CA';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.setupRecognitionHandlers();
  }

  private setupRecognitionHandlers() {
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal && result[0].confidence > this.confidenceThreshold) {
        const text = result[0].transcript.trim();
        this.updateContext(text);
        if (this.onResultCallback) {
          this.onResultCallback(text);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      if (event.error === 'no-speech') {
        this.restart();
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.restart();
      }
    };
  }

  private updateContext(text: string) {
    this.context.push(text);
    if (this.context.length > this.maxContextLength) {
      this.context.shift();
    }
  }

  private restart() {
    if (this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Erreur lors du redémarrage:', error);
      }
    }
  }

  public start(callback: (text: string) => void) {
    this.onResultCallback = callback;
    this.isListening = true;
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  }

  public stop() {
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt:', error);
    }
  }

  public async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('La synthèse vocale n\'est pas disponible'));
        return;
      }

      // Arrêter la reconnaissance pendant la synthèse
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-CA';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        // Reprendre la reconnaissance après la synthèse
        if (this.isListening) {
          this.restart();
        }
        resolve();
      };

      utterance.onerror = (error) => {
        reject(error);
      };

      this.synthesis.speak(utterance);
    });
  }

  public getContext(): string[] {
    return [...this.context];
  }
}

export const speechService = new CustomSpeechRecognition();
