
class Speaker {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  setVoice(voice: SpeechSynthesisVoice) {
    this.voice = voice;
  }

  speak(text: string) {
    if (this.utterance) {
      this.synth.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      this.utterance.voice = this.voice;
    }
    this.utterance.lang = 'fr-FR';
    this.utterance.rate = 1;
    this.utterance.pitch = 0.9; // Plus grave pour un effet plus "Jarvis"

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
