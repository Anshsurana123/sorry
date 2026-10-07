// Interactive Cute Cat Sanctuary & Paw Trail
class CuteCatCompanion {
  constructor() {
    this.catContainer = document.getElementById('interactive-cat-card');
    this.catElement = document.getElementById('cute-cat-svg');
    this.speechBubble = document.getElementById('cat-speech-bubble');
    this.purrButton = document.getElementById('btn-pet-cat');
    this.feedButton = document.getElementById('btn-feed-cat');
    this.whisperText = document.getElementById('cat-whisper-text');

    this.petCount = 0;
    this.isPurring = false;
    this.purrTimeout = null;

    this.catQuotes = [
      "Daddy was so silly and stubborn, babyy! Kitty is scolding him on your behalf! 😾🐾",
      "Babyy, your voice and comfort in our future home will always be the most important thing! 🌸",
      "Kitty whispers: Jaanuu is the queen of this house, and marriage is always 50-50! 👑",
      "He promised never to talk with ego again, babyy. Please look at his puppy eyes! 🥺",
      "Jaanuu, you deserve gentle love, patient listening, and endless cuddles! 💕",
      "Sending 10,000 warm cat purrs and forehead kisses to my favorite babyy! 🐾✨"
    ];
    this.quoteIndex = 0;

    this.init();
    this.initPawTrail();
  }

  init() {
    if (this.purrButton) {
      this.purrButton.addEventListener('click', () => this.petCat());
    }

    if (this.feedButton) {
      this.feedButton.addEventListener('click', () => this.feedCat());
    }

    if (this.catElement) {
      this.catElement.addEventListener('click', () => this.petCat());
    }

    const nextNoteBtn = document.getElementById('btn-next-cat-note');
    if (nextNoteBtn) {
      nextNoteBtn.addEventListener('click', () => this.nextWhisper());
    }
  }

  petCat() {
    this.petCount++;
    if (window.soundEngine) {
      window.soundEngine.startPurr();
      window.soundEngine.playSparkle();
    }

    // Visual Purr State
    if (this.catContainer) {
      this.catContainer.classList.add('cat-purring');
    }

    // Floating heart from cat
    this.spawnCatHeart();

    // Update speech bubble
    if (this.speechBubble) {
      const purrTexts = [
        "Purrrr... Babyy's touch is the sweetest! (Purr purr) 🥰",
        "Prrrrrr! Jaanuu gave me scratches! Daddy is watching and saying sorry 🥺🐾",
        "Meowww! Kitty loves babyy so much! 💖",
        "Purrrrr! Please forgive daddy, jaanuu, he really loves you with all his soul! 🥺"
      ];
      this.speechBubble.innerHTML = purrTexts[Math.floor(Math.random() * purrTexts.length)];
      this.speechBubble.classList.add('bounce-pop');
      setTimeout(() => this.speechBubble.classList.remove('bounce-pop'), 400);
    }

    // Boost warmth meter if available
    if (window.boostHeartWarmth) {
      window.boostHeartWarmth(5);
    }

    // Auto-stop purr sound after 3 seconds of petting inactivity
    clearTimeout(this.purrTimeout);
    this.purrTimeout = setTimeout(() => {
      if (window.soundEngine) window.soundEngine.stopPurr();
      if (this.catContainer) this.catContainer.classList.remove('cat-purring');
    }, 3200);
  }

  feedCat() {
    if (window.soundEngine) {
      window.soundEngine.playSparkle();
    }

    if (this.catContainer) {
      this.catContainer.classList.add('cat-eating');
      setTimeout(() => this.catContainer.classList.remove('cat-eating'), 1200);
    }

    if (this.speechBubble) {
      this.speechBubble.innerHTML = "Nom nom nom! 🐟 Thank you babyy! Here is a secret love note for jaanuu! 💌";
      this.speechBubble.classList.add('bounce-pop');
      setTimeout(() => this.speechBubble.classList.remove('bounce-pop'), 400);
    }

    this.nextWhisper();
    this.spawnCatTreat();
  }

  nextWhisper() {
    this.quoteIndex = (this.quoteIndex + 1) % this.catQuotes.length;
    if (this.whisperText) {
      this.whisperText.style.opacity = '0';
      setTimeout(() => {
        this.whisperText.innerHTML = `“${this.catQuotes[this.quoteIndex]}”`;
        this.whisperText.style.opacity = '1';
      }, 250);
    }
  }

  spawnCatHeart() {
    if (!this.catContainer) return;
    const heart = document.createElement('div');
    heart.className = 'cat-floating-icon';
    heart.innerHTML = Math.random() > 0.5 ? '💖' : '🐾';
    heart.style.left = `${45 + (Math.random() * 20 - 10)}%`;
    heart.style.top = '25%';
    this.catContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 1800);
  }

  spawnCatTreat() {
    if (!this.catContainer) return;
    const fish = document.createElement('div');
    fish.className = 'cat-floating-icon';
    fish.innerHTML = '🐟';
    fish.style.left = '50%';
    fish.style.top = '40%';
    this.catContainer.appendChild(fish);

    setTimeout(() => fish.remove(), 1600);
  }

  // Paw prints following the mouse/touch cursor
  initPawTrail() {
    let lastTime = 0;
    const createPaw = (x, y) => {
      const now = Date.now();
      if (now - lastTime < 90) return; // throttle
      lastTime = now;

      const paw = document.createElement('div');
      paw.className = 'cursor-paw-print';
      const icons = ['🐾', '🐾', '✨', '🌸', '🐾'];
      paw.innerHTML = icons[Math.floor(Math.random() * icons.length)];
      paw.style.left = `${x - 12}px`;
      paw.style.top = `${y - 12}px`;
      paw.style.transform = `rotate(${Math.random() * 60 - 30}deg) scale(${0.75 + Math.random() * 0.4})`;
      document.body.appendChild(paw);

      setTimeout(() => {
        paw.style.opacity = '0';
        paw.style.transform += ' translateY(-18px) scale(0.6)';
      }, 50);

      setTimeout(() => paw.remove(), 950);
    };

    window.addEventListener('mousemove', (e) => {
      createPaw(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        createPaw(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }
}

window.CuteCatCompanion = CuteCatCompanion;
