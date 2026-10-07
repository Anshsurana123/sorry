// Web Audio API Sound Engine - Zero external audio file dependencies
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.purrPlaying = false;
    this.bgmTimer = null;
    this.purrSource = null;
    this.purrGain = null;
    this.currentNoteIndex = 0;

    // Sweet pentatonic music-box melody notes (frequencies in Hz)
    // Notes: C5, E5, G5, B5, C6, A5, G5, E5, F5, A5, C6, B5, G5, E5, D5, C5
    this.melody = [
      { f: 523.25, d: 0.4 }, // C5
      { f: 659.25, d: 0.4 }, // E5
      { f: 783.99, d: 0.5 }, // G5
      { f: 987.77, d: 0.6 }, // B5
      { f: 1046.50, d: 0.8 }, // C6
      { f: 880.00, d: 0.4 }, // A5
      { f: 783.99, d: 0.5 }, // G5
      { f: 659.25, d: 0.6 }, // E5
      { f: 698.46, d: 0.4 }, // F5
      { f: 880.00, d: 0.4 }, // A5
      { f: 1046.50, d: 0.7 }, // C6
      { f: 987.77, d: 0.5 }, // B5
      { f: 783.99, d: 0.4 }, // G5
      { f: 659.25, d: 0.5 }, // E5
      { f: 587.33, d: 0.5 }, // D5
      { f: 523.25, d: 1.0 }, // C5
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single sweet music-box chime note
  playChime(freq, duration = 0.5, volume = 0.15) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Music box envelope: instant attack, exponential decay
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Play cute sparkle effect
  playSparkle() {
    this.init();
    const sparkles = [1046.50, 1318.51, 1567.98, 2093.00];
    sparkles.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.35, 0.1);
      }, idx * 70);
    });
  }

  // Play cute bounce / dodge sound
  playBounce() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // Toggle background lullaby music box
  toggleBGM() {
    this.init();
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  startBGM() {
    this.bgmPlaying = true;
    this.playNextMelodyNote();
  }

  playNextMelodyNote() {
    if (!this.bgmPlaying || !this.ctx) return;
    const note = this.melody[this.currentNoteIndex];
    this.playChime(note.f, note.d * 1.6, 0.12);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
    const nextInterval = (note.d * 1000) + 120;
    this.bgmTimer = setTimeout(() => this.playNextMelodyNote(), nextInterval);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Start realistic gentle cat purr
  startPurr() {
    this.init();
    if (this.purrPlaying || !this.ctx) return;
    try {
      this.purrPlaying = true;
      // Synthesize low-frequency rhythmic vibration for purring
      const osc = this.ctx.createOscillator();
      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const masterGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = 28; // 28 Hz purr bass

      // 25 Hz modulation for rhythmic feline purr
      modOsc.type = 'sine';
      modOsc.frequency.value = 22;
      modGain.gain.value = 14;

      modOsc.connect(osc.frequency);

      masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.5);

      osc.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      osc.start();
      modOsc.start();

      this.purrSource = { osc, modOsc, masterGain };
    } catch (e) {}
  }

  stopPurr() {
    if (!this.purrPlaying || !this.purrSource || !this.ctx) return;
    try {
      const { osc, modOsc, masterGain } = this.purrSource;
      masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          osc.stop();
          modOsc.stop();
        } catch (e) {}
        this.purrPlaying = false;
        this.purrSource = null;
      }, 400);
    } catch (e) {
      this.purrPlaying = false;
    }
  }
}

window.soundEngine = new SoundEngine();
