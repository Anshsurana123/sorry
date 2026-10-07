// Main Application Logic & Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Teddy
  let teddyInstance = null;
  if (window.TeddyBearScene) {
    teddyInstance = new TeddyBearScene('teddy-canvas-container');
  }

  // Initialize Cute Cat
  let catInstance = null;
  if (window.CuteCatCompanion) {
    catInstance = new CuteCatCompanion();
  }

  // Heart Warmth Meter logic
  let heartWarmth = 35;
  const warmthFill = document.getElementById('warmth-fill');
  const warmthPercent = document.getElementById('warmth-percent');
  const warmthStatus = document.getElementById('warmth-status');

  window.boostHeartWarmth = (amount) => {
    heartWarmth = Math.min(100, heartWarmth + amount);
    if (warmthFill) warmthFill.style.width = `${heartWarmth}%`;
    if (warmthPercent) warmthPercent.textContent = `${heartWarmth}%`;

    if (warmthStatus) {
      if (heartWarmth >= 95) {
        warmthStatus.textContent = "Overfilled with endless love & forgiveness! 💕";
      } else if (heartWarmth >= 75) {
        warmthStatus.textContent = "Soft smiles & healing warmth for babyy! 🥰";
      } else if (heartWarmth >= 50) {
        warmthStatus.textContent = "Heart starting to soften for jaanuu... 🌸";
      }
    }
  };

  // Music Player Toggle Button
  const musicToggleBtn = document.getElementById('btn-music-toggle');
  const musicBars = document.getElementById('music-bars');
  if (musicToggleBtn && window.soundEngine) {
    musicToggleBtn.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleBGM();
      if (isPlaying) {
        musicToggleBtn.classList.add('bgm-active');
        musicToggleBtn.querySelector('.music-text').textContent = "Melody Playing 🎵";
        if (musicBars) musicBars.classList.add('playing');
        window.boostHeartWarmth(5);
      } else {
        musicToggleBtn.classList.remove('bgm-active');
        musicToggleBtn.querySelector('.music-text').textContent = "Play Melody 🎵";
        if (musicBars) musicBars.classList.remove('playing');
      }
    });
  }

  // Teddy Bear Action Buttons
  const btnTeddyHug = document.getElementById('btn-teddy-hug');
  const btnTeddyBow = document.getElementById('btn-teddy-bow');
  const btnTeddyWave = document.getElementById('btn-teddy-wave');
  const btnTeddySpin = document.getElementById('btn-teddy-spin');

  if (btnTeddyHug && teddyInstance) {
    btnTeddyHug.addEventListener('click', () => {
      teddyInstance.triggerHug();
      window.boostHeartWarmth(8);
      showToast("Teddy is wrapping babyy in the warmest, tightest bear hug! 🧸💕");
    });
  }
  if (btnTeddyBow && teddyInstance) {
    btnTeddyBow.addEventListener('click', () => {
      teddyInstance.triggerBow();
      window.boostHeartWarmth(6);
      showToast("Teddy bows down saying: 'I am so, so sorry, babyy 🥺'");
    });
  }
  if (btnTeddyWave && teddyInstance) {
    btnTeddyWave.addEventListener('click', () => {
      teddyInstance.triggerWave();
      window.boostHeartWarmth(6);
      showToast("Teddy waves shyly: 'Hi sweet jaanuu, please smile? 🌸'");
    });
  }
  if (btnTeddySpin && teddyInstance) {
    btnTeddySpin.addEventListener('click', () => {
      teddyInstance.triggerSpin();
      window.boostHeartWarmth(8);
      showToast("Teddy is doing a happy spin hoping babyy forgives daddy! ✨");
    });
  }

  // Envelope Opening Interaction
  const envelope = document.getElementById('envelope-wrapper');
  const letterContent = document.getElementById('letter-content');
  const openSealBtn = document.getElementById('envelope-seal-btn');

  if (openSealBtn && envelope && letterContent) {
    openSealBtn.addEventListener('click', () => {
      if (!envelope.classList.contains('is-opened')) {
        envelope.classList.add('is-opened');
        if (window.soundEngine) window.soundEngine.playSparkle();
        window.boostHeartWarmth(20);
        triggerGentleHearts();
      }
    });
  }

  // Interactive Promise Cards Flip / Expand
  const promiseCards = document.querySelectorAll('.promise-card');
  promiseCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-revealed');
      if (window.soundEngine) window.soundEngine.playChime(659.25, 0.4, 0.12);
      window.boostHeartWarmth(5);
    });
  });

  // Interactive Coupons
  const couponBtns = document.querySelectorAll('.btn-redeem-coupon');
  couponBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const couponCard = e.target.closest('.coupon-card');
      if (couponCard && !couponCard.classList.contains('redeemed')) {
        couponCard.classList.add('redeemed');
        btn.textContent = "Redeemed for Jaanuu! 💖";
        btn.disabled = true;
        if (window.soundEngine) window.soundEngine.playSparkle();
        if (window.confetti) {
          window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        }
        window.boostHeartWarmth(8);
        showToast("Coupon officially activated! Valid forever for my babyy! 🎟️✨");
      }
    });
  });

  // The "No, you were too rude" flow (Seamless on mobile and desktop!)
  const btnNo = document.getElementById('btn-forgive-no');
  const btnYes = document.getElementById('btn-forgive-yes');
  const pleaModal1 = document.getElementById('plea-modal-1');
  const pleaModal2 = document.getElementById('plea-modal-2');
  const btnToFinalPlea = document.getElementById('btn-to-final-plea');
  const pleaFeedback = document.getElementById('plea-selected-feedback');
  const pleaOptions = document.querySelectorAll('.btn-plea-option');
  const btnFinalForgive1 = document.getElementById('btn-final-forgive-1');
  const btnFinalForgive2 = document.getElementById('btn-final-forgive-2');
  const celebrationModal = document.getElementById('celebration-modal');
  const closeCelebrationBtn = document.getElementById('btn-close-modal');

  // When she clicks "No, you were too rude 😤", open Step 1: "Wait babyy, please?? 🥺"
  if (btnNo && pleaModal1) {
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playBounce();
      window.boostHeartWarmth(8);
      pleaModal1.classList.add('is-active');
    });
  }

  // Handle plea option selections
  pleaOptions.forEach((option) => {
    option.addEventListener('click', () => {
      pleaOptions.forEach(btn => btn.classList.remove('is-selected'));
      option.classList.add('is-selected');

      if (window.soundEngine) window.soundEngine.playSparkle();
      window.boostHeartWarmth(6);

      if (pleaFeedback) {
        pleaFeedback.style.display = 'block';
        pleaFeedback.textContent = "Promise locked in! Jaanuu gets this granted immediately! 💖";
      }
    });
  });

  // Step 1 -> Step 2: "Look at me babyy..."
  if (btnToFinalPlea && pleaModal1 && pleaModal2) {
    btnToFinalPlea.addEventListener('click', () => {
      pleaModal1.classList.remove('is-active');
      pleaModal2.classList.add('is-active');
      if (window.soundEngine) window.soundEngine.playChime(587.33, 0.4, 0.15);
      window.boostHeartWarmth(10);
    });
  }

  // Trigger grand celebration function
  const launchGrandCelebration = (isLifetimeHug = false) => {
    window.boostHeartWarmth(100);
    if (window.soundEngine) window.soundEngine.playSparkle();

    // Launch spectacular confetti celebration
    if (window.confetti) {
      const count = 220;
      const defaults = { origin: { y: 0.6 } };

      function fire(particleRatio, opts) {
        window.confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }

    // Teddy victory spin
    if (teddyInstance) teddyInstance.triggerSpin();

    // Close any plea modals
    if (pleaModal1) pleaModal1.classList.remove('is-active');
    if (pleaModal2) pleaModal2.classList.remove('is-active');

    // Customize celebration popup text
    const celebrationTitle = celebrationModal.querySelector('.celebration-title');
    const celebrationMsg = celebrationModal.querySelector('.celebration-message');

    if (isLifetimeHug) {
      if (celebrationTitle) celebrationTitle.textContent = "Forgiven For Life! 😭💕🫂";
      if (celebrationMsg) {
        celebrationMsg.textContent = "You just made me the happiest guy on earth, babyy! Coming over for the biggest, warmest cuddle right now. I promise to never speak rudely or act dominant with my jaanuu ever again! ❤️";
      }
    } else {
      if (celebrationTitle) celebrationTitle.textContent = "You Forgave Me, Babyy! 😭❤️";
      if (celebrationMsg) {
        celebrationMsg.textContent = "You just made me the happiest and most grateful guy in the whole world! I promise I will cherish your heart, respect your thoughts, and never take my sweet jaanuu for granted ever again. Thank you for your warmth, babyy! 🌸🐾";
      }
    }

    // Show celebration modal
    if (celebrationModal) celebrationModal.classList.add('is-active');
  };

  // Main Page "Yes, I forgive you"
  if (btnYes) {
    btnYes.addEventListener('click', () => launchGrandCelebration(false));
  }

  // Final Stage Option 1: "Forgive you ❤️"
  if (btnFinalForgive1) {
    btnFinalForgive1.addEventListener('click', () => launchGrandCelebration(false));
  }

  // Final Stage Option 2: "Forgive you for life & give me a hug right now 💕🫂"
  if (btnFinalForgive2) {
    btnFinalForgive2.addEventListener('click', () => launchGrandCelebration(true));
  }

  if (closeCelebrationBtn && celebrationModal) {
    closeCelebrationBtn.addEventListener('click', () => {
      celebrationModal.classList.remove('is-active');
    });
  }

  // Floating Hearts on Screen
  function triggerGentleHearts() {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-ambient-heart';
        heart.innerHTML = Math.random() > 0.4 ? '💖' : '🌸';
        heart.style.left = `${Math.random() * 95}vw`;
        heart.style.bottom = '-30px';
        heart.style.animationDuration = `${3 + Math.random() * 3}s`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
      }, i * 150);
    }
  }

  // Cute Toast message notification
  function showToast(text) {
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = text;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
});
