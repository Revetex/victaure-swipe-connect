
class Speaker {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoice();
  }

  private async loadVoice() {
    // Attend que les voix soient chargées
    if (this.synth.getVoices().length === 0) {
      await new Promise<void>(resolve => {
        this.synth.addEventListener('voiceschanged', () => resolve(), { once: true });
      });
    }

    // Sélectionne une voix française
    const voices = this.synth.getVoices();
    const frenchVoice = voices.find(voice => voice.lang.startsWith('fr')) || voices[0];
    this.voice = frenchVoice;
  }

  async speak(text: string) {
    if (this.utterance) {
      this.synth.cancel();
    }

    // Attendre que la voix soit chargée si nécessaire
    if (!this.voice) {
      await this.loadVoice();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      this.utterance.voice = this.voice;
    }
    this.utterance.lang = 'fr-FR';
    this.utterance.rate = 1;
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    console.log('Starting speech synthesis...', {
      voice: this.utterance.voice?.name,
      lang: this.utterance.lang,
    });

    this.synth.speak(this.utterance);
  }

  stop() {
    console.log('Stopping speech synthesis...');
    if (this.utterance) {
      this.synth.cancel();
      this.utterance = null;
    }
  }
}

export const speaker = new Speaker();
