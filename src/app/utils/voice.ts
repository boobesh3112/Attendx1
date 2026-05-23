// Voice alert utilities using Web Speech API
class VoiceManager {
  private enabled: boolean = true;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    const voiceEnabled = localStorage.getItem('voiceEnabled');
    this.enabled = voiceEnabled !== 'false';
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('voiceEnabled', enabled.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  speak(text: string, options: { pitch?: number; rate?: number; volume?: number } = {}) {
    if (!this.enabled || !this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options.pitch || 1;
    utterance.rate = options.rate || 1;
    utterance.volume = options.volume || 0.8;
    utterance.lang = 'en-US';

    this.synth.speak(utterance);
  }

  // Predefined alerts
  classAboutToBegin() {
    this.speak("Class is about to begin in 5 minutes", { rate: 0.9 });
  }

  breakTimeStarted() {
    this.speak("Break time has started", { rate: 0.9 });
  }

  attendanceNotMarked() {
    this.speak("Attendance has not been marked yet", { rate: 0.9, pitch: 1.1 });
  }

  lowAttendanceAlert(studentName?: string) {
    const text = studentName
      ? `Low attendance alert for ${studentName}`
      : "Low attendance alert for some students";
    this.speak(text, { rate: 0.9, pitch: 1.1 });
  }

  backupCompleted() {
    this.speak("Backup completed successfully", { rate: 1, pitch: 0.9 });
  }

  attendanceMarked() {
    this.speak("Attendance marked successfully", { rate: 1 });
  }

  semesterEnding() {
    this.speak("Semester is ending soon. Please archive your data", { rate: 0.9 });
  }

  reminderToMarkAttendance() {
    this.speak("Please remember to mark today's attendance", { rate: 0.9, pitch: 1.1 });
  }
}

export const voice = new VoiceManager();
