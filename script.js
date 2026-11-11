(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  }));

  // Audio is generated locally with Web Audio. It starts only after the visitor opts in.
  let audioContext = null;
  let soundEnabled = false;
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  const soundStatus = document.getElementById('soundStatus');
  function announce(message) {
    soundStatus.textContent = message;
    soundStatus.classList.add('show');
    window.setTimeout(() => soundStatus.classList.remove('show'), 2200);
  }
  function getAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }
  function tone(frequency, duration, type = 'sine', volume = .035, endFrequency = null) {
    const ctx = getAudio(); if (!ctx || !soundEnabled) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
    oscillator.connect(gain); gain.connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + duration);
  }
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundLabel.textContent = soundEnabled ? 'Silenciar sonido' : 'Activar sonido';
    if (soundEnabled) { getAudio(); tone(520, .16, 'sine', .025, 780); announce('Sonido espacial activado'); }
    else announce('Sonido desactivado');
  });
  const launchButton = document.getElementById('launchButton');
  const rocket = document.querySelector('.rocket');
  launchButton.addEventListener('click', () => {
    rocket.classList.remove('launching');
    void rocket.offsetWidth;
    rocket.classList.add('launching');
    launchButton.disabled = true;
    launchButton.innerHTML = '<span>✦</span> ¡Despegando!';
    if (soundEnabled) {
      tone(110, .8, 'sawtooth', .045, 48);
      window.setTimeout(() => tone(420, .35, 'triangle', .025, 900), 220);
      window.setTimeout(() => tone(880, .5, 'sine', .02, 1320), 450);
    }
    window.setTimeout(() => {
      rocket.classList.remove('launching');
      launchButton.disabled = false;
      launchButton.innerHTML = '<span>↟</span> Lanzar cohete';
    }, 1500);
  });

  // Reveal cards gently as they enter the viewport.
  const revealItems = document.querySelectorAll('.value-card, .crew-card, .mission-copy');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(item => item.classList.add('reveal-ready'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .14 });
    revealItems.forEach(item => observer.observe(item));
  }
})();
