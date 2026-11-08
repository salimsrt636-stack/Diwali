/* ========================================================
   Diwali Bestie Celebration JavaScript
   Interactive Fireworks, Sparklers, Web Audio & Bestie Magic
   ======================================================== */

(function () {
  'use strict';

  // ----------------------------------------------------
  // State & Settings
  // ----------------------------------------------------
  const state = {
    soundEnabled: true,
    autoFireworks: true,
    sparklerTrail: true,
    bestieName: 'Pinku',
    diyasLit: 1, // Diya 3 starts lit
    totalDiyas: 5,
  };

  // ----------------------------------------------------
  // Web Audio API Synthesizer (No external MP3 files needed)
  // ----------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sound: Sparkler / Cracker Pop
  function playCrackerPopSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // White noise buffer for explosion crackle
      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.05));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.25);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);

      // Low thump oscillator
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);

      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      // Audio fallback
    }
  }

  // Sound: Rocket Whistle
  function playRocketLaunchSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.5);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Sound: Festive Bell / Diya Chime
  function playDiyaChimeSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.08;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch (e) {}
  }

  // Sound: Sizzling Pataka Fuse (Continuous crackle for 2.2 seconds)
  function playFuseSizzleSound(duration = 2.2) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // High frequency erratic fizz
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.6 ? 1 : 0.2);
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, audioCtx.currentTime);
      filter.Q.setValueAtTime(3, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.65, audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
      noise.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Sound: Mega Blast Explosion for Pataka
  function playMegaBlastSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      // 1. Heavy white noise boom
      const bufferSize = audioCtx.sampleRate * 0.9;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.18));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.8);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);

      // 2. Sub-bass boom
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      oscGain.gain.setValueAtTime(0.9, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  // Sound: Rapid 1000 Ladi Pataka Chatai Pop
  function playLadiPatakaSound(count = 12) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    for (let c = 0; c < count; c++) {
      setTimeout(() => {
        playCrackerPopSound();
      }, c * 110 + randomRange(-20, 20));
    }
  }

  // Sound: Cute Mithai Chew / Sweet Chime
  function playMithaiChompSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const notes = [659.25, 880, 1174.66]; // E5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.06;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {}
  }

  // ----------------------------------------------------
  // Canvas Setup: Fireworks & Sparkler Cursor
  // ----------------------------------------------------
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');

  const spCanvas = document.getElementById('sparklerCanvas');
  const spCtx = spCanvas.getContext('2d');

  let width = (fwCanvas.width = spCanvas.width = window.innerWidth);
  let height = (fwCanvas.height = spCanvas.height = window.innerHeight);

  function handleResize() {
    width = fwCanvas.width = spCanvas.width = window.innerWidth;
    height = fwCanvas.height = spCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 200);
  });

  // Particle Palettes
  const festiveColors = [
    '#ffd700', // Gold
    '#ff6f00', // Orange
    '#ff0055', // Vivid Rose
    '#ff0033', // Crimson
    '#00f0ff', // Electric Cyan
    '#a855f7', // Royal Purple
    '#55ff99', // Emerald
    '#ffffff', // Pure Diamond
  ];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Fireworks Engine
  const fireworks = [];
  const particles = [];

  class FireworkRocket {
    constructor(startX, startY, targetX, targetY, color) {
      this.x = startX;
      this.y = startY;
      this.startX = startX;
      this.startY = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.speed = 4;
      this.acceleration = 1.05;
      this.brightness = randomRange(50, 70);
      this.targetRadius = 1;
      this.color = color || randomChoice(festiveColors);
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;

      this.distanceTraveled = Math.hypot(this.x - this.startX, this.y - this.startY);

      if (this.distanceTraveled >= this.distanceToTarget) {
        createExplosion(this.targetX, this.targetY, this.color);
        fireworks.splice(index, 1);
        playCrackerPopSound();
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      fwCtx.beginPath();
      fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = this.color;
      fwCtx.lineWidth = 3;
      fwCtx.shadowBlur = 10;
      fwCtx.shadowColor = this.color;
      fwCtx.stroke();
    }
  }

  class Particle {
    constructor(x, y, color, speedMultiplier = 1, lifeMultiplier = 1) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 4;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = randomRange(0, Math.PI * 2);
      this.speed = randomRange(2, 9) * speedMultiplier;
      this.friction = 0.95;
      this.gravity = 0.9;
      this.hue = randomRange(0, 360);
      this.color = color || randomChoice(festiveColors);
      this.alpha = 1;
      this.decay = randomRange(0.015, 0.03) / lifeMultiplier;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      fwCtx.beginPath();
      fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      fwCtx.lineTo(this.x, this.y);
      fwCtx.strokeStyle = this.color;
      fwCtx.globalAlpha = Math.max(0, this.alpha);
      fwCtx.lineWidth = 2.5;
      fwCtx.shadowBlur = 8;
      fwCtx.shadowColor = this.color;
      fwCtx.stroke();
      fwCtx.globalAlpha = 1;
    }
  }

  function createExplosion(x, y, color, count = 55) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  // Custom Cracker Effects:
  function launchRocket(targetX, targetY) {
    const startX = targetX ? targetX + randomRange(-40, 40) : width / 2;
    const startY = height;
    const endX = targetX || randomRange(width * 0.15, width * 0.85);
    const endY = targetY || randomRange(height * 0.12, height * 0.45);
    const color = randomChoice(festiveColors);

    fireworks.push(new FireworkRocket(startX, startY, endX, endY, color));
    playRocketLaunchSound();
  }

  function launchAnarFlowerpot() {
    const groundX = width / 2 + randomRange(-150, 150);
    const groundY = height - 20;
    playCrackerPopSound();

    for (let i = 0; i < 90; i++) {
      const p = new Particle(groundX, groundY, randomChoice(['#ffd700', '#ff8800', '#ffffff', '#ff0055']), 1.6, 1.4);
      // Spray upwards like a cone
      p.angle = randomRange(-Math.PI * 0.85, -Math.PI * 0.15);
      p.speed = randomRange(5, 14);
      p.gravity = 0.55;
      particles.push(p);
    }
  }

  function launchChakriSpin() {
    const cx = width / 2 + randomRange(-200, 200);
    const cy = height * 0.6;
    playCrackerPopSound();

    for (let i = 0; i < 80; i++) {
      const p = new Particle(cx, cy, randomChoice(['#00f0ff', '#ffd700', '#ff00aa', '#55ff99']), 1.3);
      p.angle = (i / 80) * Math.PI * 4;
      p.speed = randomRange(4, 9);
      p.gravity = 0.2;
      particles.push(p);
    }
  }

  function launchSparklerBarrage() {
    for (let j = 0; j < 5; j++) {
      setTimeout(() => {
        const x = randomRange(width * 0.2, width * 0.8);
        const y = randomRange(height * 0.2, height * 0.5);
        createExplosion(x, y, randomChoice(festiveColors), 40);
        playCrackerPopSound();
      }, j * 160);
    }
  }

  // Animation Loop for Fireworks
  function loopFireworks() {
    requestAnimationFrame(loopFireworks);

    // Creates fading light trail effect
    fwCtx.globalCompositeOperation = 'destination-out';
    fwCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    fwCtx.fillRect(0, 0, width, height);
    fwCtx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    let k = particles.length;
    while (k--) {
      particles[k].draw();
      particles[k].update(k);
    }
  }
  loopFireworks();

  // Automatic Ambient Fireworks
  let autoTimer = 0;
  setInterval(() => {
    if (state.autoFireworks) {
      autoTimer++;
      if (autoTimer % 3 === 0) {
        launchRocket();
      }
    }
  }, 1000);

  // ----------------------------------------------------
  // Interactive Sparkler Cursor Trail
  // ----------------------------------------------------
  const sparklerPoints = [];

  class SparklerTrailParticle {
    constructor(x, y) {
      this.x = x + randomRange(-4, 4);
      this.y = y + randomRange(-4, 4);
      this.vx = randomRange(-2.5, 2.5);
      this.vy = randomRange(-2.5, 2.5);
      this.color = randomChoice(['#fff7b2', '#ffd700', '#ff9900', '#ffffff', '#ff66aa']);
      this.alpha = 1;
      this.decay = randomRange(0.03, 0.07);
      this.size = randomRange(2, 4.5);
    }

    update(idx) {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size = Math.max(0.5, this.size - 0.08);

      if (this.alpha <= 0) {
        sparklerPoints.splice(idx, 1);
      }
    }

    draw() {
      spCtx.save();
      spCtx.globalAlpha = Math.max(0, this.alpha);
      spCtx.fillStyle = this.color;
      spCtx.shadowColor = this.color;
      spCtx.shadowBlur = 8;
      spCtx.beginPath();
      spCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      spCtx.fill();
      spCtx.restore();
    }
  }

  function addSparklerPoint(x, y) {
    if (!state.sparklerTrail) return;
    for (let i = 0; i < 4; i++) {
      sparklerPoints.push(new SparklerTrailParticle(x, y));
    }
  }

  window.addEventListener('mousemove', (e) => {
    addSparklerPoint(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      addSparklerPoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Sparkler Trail Loop
  function loopSparkler() {
    requestAnimationFrame(loopSparkler);
    spCtx.clearRect(0, 0, width, height);

    let i = sparklerPoints.length;
    while (i--) {
      sparklerPoints[i].update(i);
      if (sparklerPoints[i]) {
        sparklerPoints[i].draw();
      }
    }
  }
  loopSparkler();

  // Mobile Audio Unlock on first touch/tap
  const unlockMobileAudio = () => {
    initAudio();
    document.removeEventListener('touchstart', unlockMobileAudio);
    document.removeEventListener('touchend', unlockMobileAudio);
    document.removeEventListener('click', unlockMobileAudio);
  };
  document.addEventListener('touchstart', unlockMobileAudio, { passive: true });
  document.addEventListener('touchend', unlockMobileAudio, { passive: true });
  document.addEventListener('click', unlockMobileAudio, { passive: true });

  // Click on background launches fireworks!
  window.addEventListener('click', (e) => {
    // Only launch if not clicking interactive elements or modal cards
    const tag = e.target.tagName.toLowerCase();
    if (
      ['button', 'input', 'select', 'a'].includes(tag) ||
      e.target.closest('.secret-letter') ||
      e.target.closest('.gift-box') ||
      e.target.closest('.portal-card') ||
      e.target.closest('.diya-item') ||
      e.target.closest('.cracker-card') ||
      e.target.closest('.sweet-item') ||
      e.target.closest('.fortune-card') ||
      e.target.closest('.sky-lantern-section') ||
      e.target.closest('.top-controls')
    ) {
      return;
    }
    const x = (typeof e.clientX === 'number' && e.clientX > 0) ? e.clientX : width / 2;
    const y = (typeof e.clientY === 'number' && e.clientY > 0) ? e.clientY : height * 0.4;
    launchRocket(x, y);
  });

  // ----------------------------------------------------
  // DOM Elements & Interactivity
  // ----------------------------------------------------
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const autoFireworksBtn = document.getElementById('autoFireworksBtn');
  const sparklerModeBtn = document.getElementById('sparklerModeBtn');

  const bestieNameInput = document.getElementById('bestieNameInput');
  const updateNameBtn = document.getElementById('updateNameBtn');
  const displayName = document.getElementById('displayName');
  const syncNameElements = document.querySelectorAll('.sync-name');

  const diyaItems = document.querySelectorAll('.diya-item');
  const litCounter = document.getElementById('litCounter');
  const lightAllBtn = document.getElementById('lightAllBtn');
  const altarMessage = document.getElementById('altarMessage');

  const giftBox = document.getElementById('giftBox');
  const secretLetter = document.getElementById('secretLetter');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const whatsappShareBtn = document.getElementById('whatsappShareBtn');
  const copyWishBtn = document.getElementById('copyWishBtn');
  const toastMessage = document.getElementById('toastMessage');

  // Login Portal (Spark the Pataka Welcome Screen)
  const loginPortal = document.getElementById('loginPortal');
  const loginBestieName = document.getElementById('loginBestieName');
  const patakaStage = document.getElementById('patakaStage');
  const sparkPatakaBtn = document.getElementById('sparkPatakaBtn');
  const patakaStatusText = document.getElementById('patakaStatusText');
  const screenFlash = document.getElementById('screenFlash');
  const reopenLoginBtn = document.getElementById('reopenLoginBtn');
  const bombNameText = document.getElementById('bombNameText');

  // Prevent background scrolling while login portal is active on mobile & desktop
  if (loginPortal && !loginPortal.classList.contains('portal-hidden')) {
    document.body.classList.add('portal-open');
  }

  // Live update bomb label as user types
  if (loginBestieName && bombNameText) {
    loginBestieName.addEventListener('input', () => {
      const val = loginBestieName.value.trim();
      bombNameText.textContent = val ? val.toUpperCase() : 'PINKU';
    });
  }

  // Load saved name from storage if available
  try {
    const savedName = localStorage.getItem('dewali_bestie_name');
    if (savedName) {
      state.bestieName = savedName;
      bestieNameInput.value = savedName;
      loginBestieName.value = savedName;
      updateBestieName(savedName);
    }
  } catch (err) {}

  // Function to sync name everywhere
  function updateBestieName(name) {
    const trimmed = name.trim() || 'Pinku';
    state.bestieName = trimmed;
    displayName.textContent = trimmed;
    syncNameElements.forEach((el) => {
      el.textContent = trimmed;
    });
    if (bombNameText) {
      bombNameText.textContent = trimmed.toUpperCase();
    }
    try {
      localStorage.setItem('dewali_bestie_name', trimmed);
    } catch (e) {}
  }

  updateNameBtn.addEventListener('click', () => {
    updateBestieName(bestieNameInput.value);
    showToast(`Wish updated for ${state.bestieName}! 💖`);
    launchSparklerBarrage();
  });

  bestieNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateNameBtn.click();
    }
  });

  // Top Controls Toggle
  audioToggleBtn.addEventListener('click', () => {
    initAudio();
    state.soundEnabled = !state.soundEnabled;
    audioToggleBtn.classList.toggle('active', state.soundEnabled);
    audioToggleBtn.querySelector('.label').textContent = state.soundEnabled ? 'Sound: ON' : 'Sound: OFF';
    audioToggleBtn.querySelector('.icon').textContent = state.soundEnabled ? '🔊' : '🔇';
    showToast(state.soundEnabled ? 'Sound effects enabled 🔊' : 'Sound muted 🔇');
  });

  autoFireworksBtn.addEventListener('click', () => {
    state.autoFireworks = !state.autoFireworks;
    autoFireworksBtn.classList.toggle('active', state.autoFireworks);
    autoFireworksBtn.querySelector('.label').textContent = state.autoFireworks ? 'Fireworks: ON' : 'Fireworks: OFF';
    showToast(state.autoFireworks ? 'Auto Fireworks active 🎆' : 'Auto Fireworks paused ⏸️');
  });

  sparklerModeBtn.addEventListener('click', () => {
    state.sparklerTrail = !state.sparklerTrail;
    sparklerModeBtn.classList.toggle('active', state.sparklerTrail);
    sparklerModeBtn.querySelector('.label').textContent = state.sparklerTrail ? 'Sparkler: ON' : 'Sparkler: OFF';
    showToast(state.sparklerTrail ? 'Sparkler trail on ✨' : 'Sparkler trail off');
  });

  // Interactive Diyas
  function updateDiyaCounter() {
    const litCount = document.querySelectorAll('.diya-item.lit').length;
    state.diyasLit = litCount;
    litCounter.textContent = `Diyas Lit: ${litCount} / ${state.totalDiyas}`;

    if (litCount === state.totalDiyas) {
      altarMessage.innerHTML = `✨ <strong>Shandaar!</strong> All 5 Diyas are radiating bright blessings for ${state.bestieName}! 🪔✨`;
      launchSparklerBarrage();
    }
  }

  diyaItems.forEach((diya) => {
    diya.addEventListener('click', () => {
      initAudio();
      const blessing = diya.getAttribute('data-blessing');
      const isAlreadyLit = diya.classList.contains('lit');

      diya.classList.toggle('lit');
      playDiyaChimeSound();

      if (!isAlreadyLit) {
        altarMessage.textContent = `Lit diya with blessing of ${blessing}! 🌟`;
        // mini sparkle burst at diya position
        const rect = diya.getBoundingClientRect();
        createExplosion(rect.left + rect.width / 2, rect.top + 20, '#ffd700', 25);
      } else {
        altarMessage.textContent = `Extinguished diya. Click again to relight!`;
      }

      updateDiyaCounter();
    });
  });

  lightAllBtn.addEventListener('click', () => {
    initAudio();
    diyaItems.forEach((diya) => {
      diya.classList.add('lit');
    });
    playDiyaChimeSound();
    updateDiyaCounter();
    showToast('All Diyas are glowing with love! 🪔✨');
  });

  // Surprise Gift Box Unboxing
  giftBox.addEventListener('click', () => {
    initAudio();
    const isOpened = giftBox.querySelector('.gift-box').classList.contains('opened');

    if (!isOpened) {
      giftBox.querySelector('.gift-box').classList.add('opened');
      secretLetter.classList.add('show');
      playCrackerPopSound();
      launchSparklerBarrage();
      secretLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Surprise! A heartfelt letter for you! 💌');
    } else {
      secretLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  closeLetterBtn.addEventListener('click', () => {
    secretLetter.classList.remove('show');
    giftBox.querySelector('.gift-box').classList.remove('opened');
  });

  // Share and Copy
  function getCustomWishText() {
    return `✨🪔 *HAPPY DIWALI, ${state.bestieName.toUpperCase()}!* 🪔✨\n\nDearest ${state.bestieName},\nEven though I am Muslim, true friendship knows no boundaries! If we celebrated Diwali at my home, you would definitely be the very first person I'd invite over to celebrate, light diyas, and share sweets together! 🍬🎆\n\nThank you for being my constant support and truest bestie—here's to a lifetime of crazy fun memories and an unbreakable bond! 🌟\n\n💖 With lots of love, Salim ✨🪔`;
  }

  whatsappShareBtn.addEventListener('click', () => {
    const text = encodeURIComponent(getCustomWishText());
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank');
  });

  copyWishBtn.addEventListener('click', () => {
    const text = getCustomWishText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Wish text copied to clipboard! 📋✨');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  });

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Wish text copied to clipboard! 📋✨');
    } catch (e) {
      showToast('Failed to copy. Please copy manually!');
    }
    document.body.removeChild(textarea);
  }

  // Cracker Pad Trigger Buttons (Arcade)
  const crackerTriggers = document.querySelectorAll('.firework-trigger-btn');
  crackerTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudio();
      const type = btn.getAttribute('data-type');
      if (type === 'bomb') {
        playMegaBlastSound();
        screenFlash.classList.add('flash-active');
        setTimeout(() => screenFlash.classList.remove('flash-active'), 200);
        createExplosion(width / 2, height * 0.45, '#ffd700', 80);
        showToast('💥 BOOM! 10,000 Wladi Dhamaka Bomb blasted! 🔥');
      } else if (type === 'pataka') {
        playLadiPatakaSound(14);
        for (let p = 0; p < 14; p++) {
          setTimeout(() => {
            const px = randomRange(width * 0.2, width * 0.8);
            const py = height - 60 + randomRange(-30, 20);
            createExplosion(px, py, randomChoice(['#ff3300', '#ffd700', '#ffffff']), 20);
          }, p * 110);
        }
        showToast('🧨 1000 Ladi Pataka chatai crackling non-stop! ⚡');
      } else if (type === 'rocket') {
        launchRocket();
        showToast('🚀 Aasmani Sky Rocket soaring high for Pinku! 🌌');
      } else if (type === 'flowerpot') {
        launchAnarFlowerpot();
        showToast('🪴 Golden Shahi Anar lighting up the universe! 🌟');
      } else if (type === 'chakri') {
        launchChakriSpin();
        showToast('💫 Ground Zameen Chakri spinning like wild! 🌪️');
      } else if (type === 'sparkler') {
        launchSparklerBarrage();
        showToast('✨ Magic Phuljhadi sparkling with golden warmth! 💖');
      }
    });
  });

  // ====================================================
  // FEATURE 1: VIRTUAL MITHAI PLATTER
  // ====================================================
  const sweetsCountEl = document.getElementById('sweetsCount');
  const resetMithaiBtn = document.getElementById('resetMithaiBtn');
  const mithaiReaction = document.getElementById('mithaiReaction');
  const sweetItems = document.querySelectorAll('.sweet-item');

  let currentSweetsCount = 0;

  const sweetComments = {
    'Kaju Katli': '💎 Yummy! Pinku just devoured a melt-in-mouth Kaju Katli! Salim is happily footing the bill 😋',
    'Gulab Jamun': '🟤 Sweet & warm! Gulab Jamun vanished in one bite! Pinku is officially on a festive sugar rush! 🥳',
    'Motichoor Laddoo': '🟠 Desi classic! Motichoor Laddoo eaten! Fuel for all our late-night gossip sessions! 🪔',
    'Jalebi': '🥨 Crispy & juicy! Hot Jalebi enjoyed! Pinku’s smile is shining brighter than all the diyas! ✨',
    'Rasgulla': '⚪ Soft & spongy Rasgulla! 100% pure sweetness for the purest bestie in the world! 💖'
  };

  sweetItems.forEach((item) => {
    item.addEventListener('click', () => {
      initAudio();
      playMithaiChompSound();
      currentSweetsCount++;
      if (sweetsCountEl) sweetsCountEl.textContent = currentSweetsCount;

      const sweet = item.getAttribute('data-sweet');
      const reaction = sweetComments[sweet] || `😋 Pinku loved the delicious ${sweet}!`;

      if (mithaiReaction) {
        mithaiReaction.innerHTML = reaction;
      }

      // Sparkles around sweet
      const rect = item.getBoundingClientRect();
      createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffd700', 16);
      showToast(`Fed Pinku 1 ${sweet}! 🍬`);
    });
  });

  if (resetMithaiBtn) {
    resetMithaiBtn.addEventListener('click', () => {
      currentSweetsCount = 0;
      if (sweetsCountEl) sweetsCountEl.textContent = '0';
      if (mithaiReaction) mithaiReaction.textContent = '👆 Platter refilled! Tap a sweet above to feed Pinku!';
      showToast('Fresh sweet platter served! 🍬');
    });
  }

  // ====================================================
  // FEATURE 2: PINKU & SALIM'S DIWALI FORTUNE PREDICTOR
  // ====================================================
  const revealFortuneBtn = document.getElementById('revealFortuneBtn');
  const fortuneBall = document.getElementById('fortuneBall');
  const fortuneText = document.getElementById('fortuneText');

  const pinkuFortunes = [
    '🌟 Fortune 2026: Pinku will achieve a massive personal milestone this year, and Salim is taking full credit as the lucky charm!',
    '🚀 Fortune 2026: All your career and creative goals will skyrocket faster than a Diwali rocket! 100% grand success ahead!',
    '🍕 Fortune 2026: 365 days of unconditional laughter, zero drama, and unlimited free food treats from Salim!',
    '✈️ Fortune 2026: An epic spontaneous road-trip or vacation is written in the stars for Pinku and Salim!',
    '💡 Fortune 2026: Whenever life gets confusing, Salim will always be one phone call away with wild ideas and true support!',
    '🍬 Fortune 2026: Warning: High probability of stealing each other’s sweets and snacks without any regret!',
    '🤝 Fortune 2026: Our friendship will remain unbreakable, crazy, and full of golden memories for lifetimes to come!'
  ];

  let lastFortuneIndex = -1;

  function revealNewFortune() {
    initAudio();
    playDiyaChimeSound();

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * pinkuFortunes.length);
    } while (newIndex === lastFortuneIndex && pinkuFortunes.length > 1);

    lastFortuneIndex = newIndex;

    if (fortuneText) {
      fortuneText.style.opacity = '0';
      setTimeout(() => {
        fortuneText.textContent = pinkuFortunes[newIndex];
        fortuneText.style.opacity = '1';
      }, 200);
    }

    launchSparklerBarrage();
    showToast('🔮 New Diwali Fortune revealed for Pinku!');
  }

  if (revealFortuneBtn) revealFortuneBtn.addEventListener('click', revealNewFortune);
  if (fortuneBall) fortuneBall.addEventListener('click', revealNewFortune);

  // ====================================================
  // FEATURE 3: FLOATING AKASH KANDIL (SKY LANTERN WISH)
  // ====================================================
  const launchLanternBtn = document.getElementById('launchLanternBtn');
  const flyingLantern = document.getElementById('flyingLantern');
  const lanternStatus = document.getElementById('lanternStatus');

  let lanternLaunched = false;

  if (launchLanternBtn && flyingLantern) {
    launchLanternBtn.addEventListener('click', () => {
      if (lanternLaunched) return;
      lanternLaunched = true;
      initAudio();
      playRocketLaunchSound();

      flyingLantern.classList.add('floating-away');
      launchLanternBtn.disabled = true;
      launchLanternBtn.textContent = '🏮 Sky Lantern Ascending Into Stars...';

      if (lanternStatus) {
        lanternStatus.innerHTML = '✨ <strong>Lantern released!</strong> Soaring high into the heavens, carrying Salim’s lifelong prayers for Pinku! 🌌💖';
      }

      // Sparkles floating with lantern
      for (let s = 0; s < 5; s++) {
        setTimeout(() => {
          createExplosion(width / 2 + randomRange(-60, 60), height * 0.5 - s * 40, '#ffd700', 20);
        }, s * 500);
      }

      showToast('🏮 Sky lantern carrying prayers for Pinku released! ✨');

      // Reset after 4.5s
      setTimeout(() => {
        flyingLantern.classList.remove('floating-away');
        launchLanternBtn.disabled = false;
        launchLanternBtn.innerHTML = '🔥 Ignite & Release Another Sky Lantern 🚀';
        lanternLaunched = false;
        if (lanternStatus) {
          lanternStatus.textContent = 'Lantern reached the stars! Tap again to release another wish!';
        }
      }, 4500);
    });
  }

  // Toast Notification
  let toastTimeout;
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2800);
  }

  // ====================================================
  // SPARK THE PATAKA LOGIN PORTAL (WELCOME EXPERIENCE)
  // ====================================================
  let isBurning = false;

  function sparkThePataka() {
    if (isBurning) return;
    isBurning = true;
    initAudio();

    // Get input name
    const rawName = loginBestieName.value.trim() || 'Pinku';

    // Update names in main page
    updateBestieName(rawName);
    bestieNameInput.value = rawName;

    // Visual burning state
    patakaStage.classList.add('burning');
    sparkPatakaBtn.disabled = true;
    sparkPatakaBtn.innerHTML = '<span class="btn-icon">⚡</span> <span class="btn-text">FUSE SIZZLING... BLAST IMMINENT! 🧨</span>';
    patakaStatusText.innerHTML = '🔥 <em>Tsssssssss...</em> The batti is burning down! <strong>Get Ready!</strong> 💥';

    // Play sizzling sound
    playFuseSizzleSound(2.2);

    // Periodic spark bursts around the fuse during burning
    const fuseSparkInterval = setInterval(() => {
      if (!isBurning) {
        clearInterval(fuseSparkInterval);
        return;
      }
      const rect = patakaStage.getBoundingClientRect();
      createExplosion(rect.left + rect.width / 2 + randomRange(-8, 8), rect.top + 20, '#ffbb00', 8);
    }, 180);

    // After 2.2 seconds: BOOM!
    setTimeout(() => {
      clearInterval(fuseSparkInterval);

      // Mega blast sound & screen flash
      playMegaBlastSound();
      screenFlash.classList.add('flash-active');
      setTimeout(() => {
        screenFlash.classList.remove('flash-active');
      }, 250);

      // Hide login portal and reveal celebration
      loginPortal.classList.add('portal-hidden');
      document.body.classList.remove('portal-open');
      isBurning = false;
      patakaStage.classList.remove('burning');
      sparkPatakaBtn.disabled = false;
      sparkPatakaBtn.innerHTML = '<span class="btn-icon">🔥</span> <span class="btn-text">SPARK THE PATAKA TO ENTER 🧨</span>';
      patakaStatusText.textContent = '👇 Click the button below to spark the fuse & blast open the celebration!';

      // Grand celebration fireworks barrage!
      for (let r = 0; r < 7; r++) {
        setTimeout(() => {
          launchRocket(randomRange(width * 0.15, width * 0.85), randomRange(height * 0.15, height * 0.5));
        }, r * 220);
      }
      setTimeout(() => {
        launchSparklerBarrage();
      }, 1000);

      showToast(`💥 BOOM! Welcome, ${rawName}! Shubh Deepavali! 🪔✨`);
    }, 2200);
  }

  sparkPatakaBtn.addEventListener('click', sparkThePataka);
  const patakaObject = document.getElementById('patakaObject');
  if (patakaObject) {
    patakaObject.style.cursor = 'pointer';
    patakaObject.title = 'Click to spark the fuse!';
    patakaObject.addEventListener('click', sparkThePataka);
  }

  loginBestieName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sparkThePataka();
    }
  });

  // Re-open Login / Spark again button in top navbar
  if (reopenLoginBtn) {
    reopenLoginBtn.addEventListener('click', () => {
      loginPortal.classList.remove('portal-hidden');
      document.body.classList.add('portal-open');
      loginBestieName.focus();
      showToast('Spark the Pataka again to welcome another bestie! 🧨');
    });
  }

  // Initial greeting burst
  window.addEventListener('load', () => {
    setTimeout(() => {
      launchRocket(width * 0.3, height * 0.35);
      setTimeout(() => launchRocket(width * 0.7, height * 0.35), 400);
    }, 700);
  });

})();
