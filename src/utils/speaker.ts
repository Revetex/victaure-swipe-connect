
class Speaker {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string) {
    if (this.utterance) {
      this.synth.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'fr-FR';
    this.utterance.rate = 1;
    this.utterance.pitch = 1;

    this.synth.speak(this.utterance);
  }

  stop() {
    if (this.utterance) {
      this.synth.cancel();
      this.utterance = null;
    }
  }
}

export const speaker = new Speaker();
