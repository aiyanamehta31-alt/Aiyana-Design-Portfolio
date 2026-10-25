/* =====================================================================
   CODES · runner.js
   A small stand-in for canvas-sketch, so the sketches run in the browser
   with no build step.

   Each sketch module exports:
     dimensions   [width, height]: the sketch's own coordinate space
                  (e.g. [2048, 2048]), exactly as in the original file
     create(api)  returns { render(props), ...anything else it wants }

   The runner sizes the canvas to its container (devicePixelRatio capped
   at 2) and scales the drawing so the sketch always draws in its original
   coordinates: the artwork looks the same at any size.

   render(props) gets:
     context, width, height      (width/height in the sketch's own units)
     time, deltaTime, playhead   (seconds while playing; playhead 0–1 over
                                  `duration` if the sketch sets one)
     scale                       device pixels per sketch unit
     pointer                     { x, y, inside, down } in sketch units
   ===================================================================== */

const MAX_DPR = 2;

export function run(canvas, module, options = {}) {
  const [dw, dh] = module.dimensions;
  const context = canvas.getContext('2d');
  const pointer = { x: dw / 2, y: dh / 2, inside: false, down: false };
  const state = { time: options.startTime || 0, playing: false, raf: 0, last: 0, scale: 1, destroyed: false };
  const listeners = [];
  function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); listeners.push(() => el.removeEventListener(type, fn, opts)); }

  // Fit the canvas to its box (the box keeps the sketch's aspect ratio in CSS).
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    state.scale = Math.min(w / dw, h / dh);
    if (sketch.resize) sketch.resize(props(0));
    if (!state.playing) draw(0);
  }

  function props(deltaTime) {
    return {
      context, canvas,
      width: dw, height: dh,
      time: state.time,
      deltaTime,
      playhead: module.duration ? (state.time % module.duration) / module.duration : 0,
      scale: state.scale,
      pointer
    };
  }

  function draw(deltaTime) {
    context.save();
    context.setTransform(state.scale, 0, 0, state.scale, 0, 0);
    sketch.render(props(deltaTime));
    context.restore();
  }

  function frame(now) {
    if (!state.playing) return;
    const dt = state.last ? Math.min(0.1, (now - state.last) / 1000) : 1 / 60;
    state.last = now;
    state.time += dt;
    draw(dt);
    state.raf = requestAnimationFrame(frame);
  }

  // Pointer, in the sketch's own coordinates. Touch drags work the same way.
  function toSketch(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width * dw;
    pointer.y = (e.clientY - r.top) / r.height * dh;
  }
  on(canvas, 'pointermove', (e) => { toSketch(e); pointer.inside = true; if (!state.playing) draw(0); });
  on(canvas, 'pointerdown', (e) => { toSketch(e); pointer.inside = true; pointer.down = true; });
  on(canvas, 'pointerup', () => { pointer.down = false; });
  on(canvas, 'pointercancel', () => { pointer.down = false; pointer.inside = false; });
  on(canvas, 'pointerleave', (e) => { pointer.down = false; if (e.pointerType === 'mouse') pointer.inside = false; });

  const sketch = module.create({
    canvas,
    dimensions: [dw, dh],
    redraw: () => { if (!state.playing && !state.destroyed) draw(0); }
  });

  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(canvas);
  on(window, 'resize', resize);
  resize();

  const controller = {
    sketch,
    pointer,
    get playing() { return state.playing; },
    get time() { return state.time; },
    play() {
      if (state.playing || state.destroyed) return;
      state.playing = true;
      state.last = 0;
      state.raf = requestAnimationFrame(frame);
      if (options.onChange) options.onChange(controller);
    },
    pause() {
      if (!state.playing) return;
      state.playing = false;
      cancelAnimationFrame(state.raf);
      if (options.onChange) options.onChange(controller);
    },
    toggle() { if (state.playing) controller.pause(); else controller.play(); },
    redraw() { if (!state.playing) draw(0); },
    resize,
    destroy() {
      state.destroyed = true;
      controller.pause();
      if (ro) ro.disconnect();
      listeners.forEach((off) => off());
      if (sketch.destroy) sketch.destroy();
    }
  };
  return controller;
}
