// Sound effects utilities
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Check localStorage for sound preference
    const soundsEnabled = localStorage.getItem('soundsEnabled');
    this.enabled = soundsEnabled !== 'false';
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('soundsEnabled', enabled.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Sound not supported:', error);
    }
  }

  playClick() {
    this.createBeep(800, 50);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.createBeep(600, 100);
    setTimeout(() => this.createBeep(800, 100), 100);
  }

  playError() {
    if (!this.enabled) return;
    this.createBeep(300, 200);
  }

  playNotification() {
    if (!this.enabled) return;
    this.createBeep(1000, 100);
    setTimeout(() => this.createBeep(1200, 100), 100);
    setTimeout(() => this.createBeep(1000, 100), 200);
  }

  playWarning() {
    if (!this.enabled) return;
    this.createBeep(400, 150);
    setTimeout(() => this.createBeep(400, 150), 200);
  }
}

export const sounds = new SoundManager();
