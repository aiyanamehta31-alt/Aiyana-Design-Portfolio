/* =====================================================================
   ABOUT · the storm mixer
   Three sliders (Rain, Sea, Thunder) blend a soundscape made live with the
   Web Audio API: no audio files. Rain is high, filtered noise; the sea is
   deep noise that swells slowly; thunder is an occasional low rumble.
   Nothing plays until the visitor presses Play, and Mute silences it.
   The wallpaper reacts even when the sound is off: rain streaks run down
   the glass, the sea darkens, and thunder flashes (never with reduced motion).
   ===================================================================== */
(function () {
  'use strict';

  var box = document.querySelector('[data-storm]');
  if (!box) return;
  var screen = document.querySelector('[data-screen]');
  var sea = screen.querySelector('.desk__sea');
  var rainCanvas = screen.querySelector('.desk__rain');
  var flashEl = screen.querySelector('.desk__flash');
  var playBtn = box.querySelector('[data-storm-play]');
  var playLabel = box.querySelector('[data-storm-label]');
  var muteBtn = box.querySelector('[data-storm-mute]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var mix = {};
  Array.prototype.forEach.call(box.querySelectorAll('[data-mix]'), function (input) {
    mix[input.getAttribute('data-mix')] = input.value / 100;
    input.addEventListener('input', function () {
      mix[input.getAttribute('data-mix')] = input.value / 100;
      input.setAttribute('aria-valuetext', input.value + '%');
      apply();
    });
  });

  /* ---------- The sound ---------- */
  var audio = null;     // built on the first Play
  var playing = false, muted = false;

  function noiseBuffer(ac, brown) {
    var len = ac.sampleRate * 3;
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
    }
    return buf;
  }
  function loop(ac, buf) { var s = ac.createBufferSource(); s.buffer = buf; s.loop = true; s.start(0, Math.random() * 2); return s; }
  function filter(ac, type, freq, q) { var f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q; return f; }

  function build() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ac = new AC();
    var white = noiseBuffer(ac, false), brown = noiseBuffer(ac, true);
    var master = ac.createGain();
    master.gain.value = 0.8;
    master.connect(ac.destination);

    // Rain: bright hiss.
    var rain = ac.createGain();
    loop(ac, white).connect(filter(ac, 'highpass', 1400)).connect(filter(ac, 'lowpass', 7500)).connect(rain);
    rain.connect(master);

    // Sea: deep noise that swells in and out, like waves.
    var seaGain = ac.createGain();
    var swell = ac.createGain();
    swell.gain.value = 0.55;
    var lfo = ac.createOscillator();
    lfo.frequency.value = 0.09;
    var lfoDepth = ac.createGain();
    lfoDepth.gain.value = 0.45;
    lfo.connect(lfoDepth).connect(swell.gain);
    lfo.start();
    loop(ac, brown).connect(filter(ac, 'lowpass', 520, 0.6)).connect(swell).connect(seaGain);
    seaGain.connect(master);

    return { ac: ac, master: master, rain: rain, sea: seaGain, brown: brown };
  }

  // One roll of thunder: a low rumble that swells and slowly dies away.
  function rumble() {
    if (!audio || !playing || muted) return;
    var ac = audio.ac, now = ac.currentTime;
    var src = ac.createBufferSource();
    src.buffer = audio.brown;
    var env = ac.createGain();
    var peak = 0.35 + mix.thunder * 1.1;
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(peak, now + 0.25);
    env.gain.exponentialRampToValueAtTime(peak * 0.5, now + 1.1);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
    src.connect(filter(ac, 'lowpass', 150 + Math.random() * 90, 0.7)).connect(env).connect(audio.master);
    src.start(now, Math.random() * 1.5);
    src.stop(now + 4.4);
  }

  function apply() {
    sea.style.setProperty('--sea', (0.12 + mix.sea * 0.88).toFixed(2));
    if (audio) {
      var t = audio.ac.currentTime;
      audio.rain.gain.setTargetAtTime(mix.rain * 0.22, t, 0.2);
      audio.sea.gain.setTargetAtTime(mix.sea * 0.9, t, 0.3);
      audio.master.gain.setTargetAtTime(muted ? 0 : 0.8, t, 0.08);
    }
    drops.length = Math.round(mix.rain * 170);
    if (reduce) drawStill();
  }

  playBtn.addEventListener('click', function () {
    if (!audio) audio = build();
    if (!audio) { playLabel.textContent = 'No sound here'; return; }
    playing = !playing;
    if (playing) audio.ac.resume(); else audio.ac.suspend();
    playBtn.setAttribute('aria-pressed', String(playing));
    playLabel.textContent = playing ? 'Pause' : 'Play';
    apply();
  });
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    apply();
  });
  // A hidden tab goes quiet, and picks up again when it comes back.
  document.addEventListener('visibilitychange', function () {
    if (!audio || !playing) return;
    if (document.hidden) audio.ac.suspend(); else audio.ac.resume();
  });

  /* ---------- Thunder: a flash, and a rumble when the sound is on ---------- */
  function scheduleThunder() {
    var wait = 7000 + Math.random() * 12000 * (1.4 - mix.thunder);
    setTimeout(function () {
      if (mix.thunder > 0.02 && !document.hidden) {
        if (!reduce && inView) {
          flashEl.classList.remove('is-on');
          void flashEl.offsetWidth;
          flashEl.classList.add('is-on');
        }
        setTimeout(rumble, 300 + Math.random() * 900);   // the sound arrives just after the light
      }
      scheduleThunder();
    }, wait);
  }
  scheduleThunder();

  /* ---------- Rain on the glass ---------- */
  var g = rainCanvas.getContext('2d');
  var drops = [];
  var W = 0, H = 0, inView = false, raf = 0;
  function resize() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = screen.clientWidth; H = screen.clientHeight;
    rainCanvas.width = Math.round(W * dpr);
    rainCanvas.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduce) drawStill();
  }
  function drop(i) {
    var d = drops[i] || (drops[i] = {});
    d.x = Math.random() * (W + 80) - 40;
    d.y = Math.random() * H - H;
    d.len = 10 + Math.random() * 22;
    d.v = 7 + Math.random() * 9;
    d.a = 0.12 + Math.random() * 0.25;
    return d;
  }
  function paint(still) {
    g.clearRect(0, 0, W, H);
    g.lineCap = 'round';
    g.lineWidth = 1;
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i] && drops[i].len ? drops[i] : drop(i);
      if (still) { d.y = Math.random() * H; }
      g.strokeStyle = 'rgba(205, 220, 240,' + d.a + ')';
      g.beginPath();
      g.moveTo(d.x, d.y);
      g.lineTo(d.x - d.len * 0.18, d.y + d.len);
      g.stroke();
      if (!still) { d.y += d.v; d.x -= d.v * 0.18; if (d.y > H) drop(i).y = -20; }
    }
  }
  function tick() {
    raf = 0;
    if (!inView || document.hidden) return;
    paint(false);
    raf = requestAnimationFrame(tick);
  }
  function drawStill() { paint(true); }
  // The rain only runs while the desktop is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !reduce && !raf) raf = requestAnimationFrame(tick);
    }).observe(screen);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden && inView && !reduce && !raf) raf = requestAnimationFrame(tick); });
  window.addEventListener('resize', resize);
  resize();
  apply();
})();
