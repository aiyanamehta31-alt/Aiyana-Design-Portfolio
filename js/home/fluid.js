/* =====================================================================
   FLUID · the cursor bends the fabric of the page
   Behind the black there is a fine woven grid, the "fabric". It stays
   dark except around the cursor, where it glows into view. Moving the
   mouse (or a finger) pushes a small fluid simulation, and the fabric is
   drawn through that flow: its threads stretch, bend and curl behind the
   hand, then spring back. The fabric moves with the page, and scrolling
   sends a soft elastic wave through it. A faint wash of colour rides
   along. A tap or click gives it a little push.
   The colour is whatever is under the point: each section and project
   card names its own in data-cloud="#hex #hex", and beside the cards the
   nearest card's colours tint the threads.
   A WebGL "stable fluids" solver (advect → curl → vorticity → divergence
   → pressure → project), drawn on one canvas behind the page. It runs
   only while there is something to show, rests under a project sheet or
   the All projects view, and is off with reduced motion or without WebGL.
   ===================================================================== */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var S = {
    simRes: 128,            // velocity grid (shorter side)
    dyeRes: 640,            // colour grid (shorter side)
    densityFade: 1.1,       // how fast the colour fades (higher = sooner)
    velocityFade: 0.9,      // how fast the fabric springs back (higher = sooner)
    pressure: 0.8,
    pressureIters: 20,
    curl: 16,               // eddies
    radius: 0.22,           // splat size (percent of the screen, roughly)
    force: 5200,
    intensity: 0.05,        // how much colour one move adds (soft)
    idleMs: 4500,           // keep simulating this long after the last input
    fabric: {
      cell: 30,             // thread spacing (px)
      line: 0.9,            // thread softness (px)
      spot: 190,            // how far round the cursor the fabric shows (px)
      glow: 0.22,           // how bright it shows there
      base: 0.0,            // how bright it shows everywhere else (0 = pure black)
      warp: 0.11            // how far the flow bends the threads
    },
    fallback: ['#8A8A8A', '#BDBDBD']
  };

  var root = document.documentElement;
  var canvas = document.createElement('canvas');
  canvas.className = 'fluid';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);

  /* ---------- WebGL setup (WebGL2, or WebGL1 with half floats) ---------- */
  var params = { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: false };
  var gl = canvas.getContext('webgl2', params);
  var isGL2 = !!gl;
  if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  if (!gl) { canvas.remove(); return; }

  var halfFloat, linear, fmtRGBA, fmtRG;
  if (isGL2) {
    gl.getExtension('EXT_color_buffer_float');
    linear = gl.getExtension('OES_texture_float_linear') || true;   // half floats filter linearly in WebGL2
    halfFloat = gl.HALF_FLOAT;
    fmtRGBA = { internal: gl.RGBA16F, format: gl.RGBA };
    fmtRG = { internal: gl.RG16F, format: gl.RG };
  } else {
    var hf = gl.getExtension('OES_texture_half_float');
    linear = gl.getExtension('OES_texture_half_float_linear');
    if (!hf) { canvas.remove(); return; }
    halfFloat = hf.HALF_FLOAT_OES;
    fmtRGBA = { internal: gl.RGBA, format: gl.RGBA };
    fmtRG = fmtRGBA;
  }
  var filter = linear ? gl.LINEAR : gl.NEAREST;
  gl.clearColor(0, 0, 0, 0);

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var VERT = shader(gl.VERTEX_SHADER, [
    'precision highp float;',
    'attribute vec2 aPos; varying vec2 vUv, vL, vR, vT, vB; uniform vec2 texel;',
    'void main(){ vUv = aPos * 0.5 + 0.5; vL = vUv - vec2(texel.x, 0.); vR = vUv + vec2(texel.x, 0.);',
    ' vT = vUv + vec2(0., texel.y); vB = vUv - vec2(0., texel.y); gl_Position = vec4(aPos, 0., 1.); }'
  ].join('\n'));
  function program(frag) {
    var p = gl.createProgram();
    gl.attachShader(p, VERT);
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, 'precision highp float; precision highp sampler2D;\nvarying vec2 vUv, vL, vR, vT, vB;\n' + frag));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    return { p: p, u: u };
  }

  var P;
  try {
    P = {
      splat: program('uniform sampler2D tex; uniform float aspect, radius; uniform vec3 color; uniform vec2 point;' +
        'void main(){ vec2 d = vUv - point; d.x *= aspect; vec3 s = exp(-dot(d, d) / radius) * color;' +
        ' gl_FragColor = vec4(texture2D(tex, vUv).xyz + s, 1.); }'),
      advect: program('uniform sampler2D vel, src; uniform vec2 texel; uniform float dt, fade;' +
        'void main(){ vec2 c = vUv - dt * texture2D(vel, vUv).xy * texel; gl_FragColor = texture2D(src, c) / (1. + fade * dt); }'),
      curl: program('uniform sampler2D vel;' +
        'void main(){ float L = texture2D(vel, vL).y, R = texture2D(vel, vR).y, T = texture2D(vel, vT).x, B = texture2D(vel, vB).x;' +
        ' gl_FragColor = vec4(0.5 * (R - L - T + B), 0., 0., 1.); }'),
      vorticity: program('uniform sampler2D vel, curl; uniform float strength, dt;' +
        'void main(){ float L = texture2D(curl, vL).x, R = texture2D(curl, vR).x, T = texture2D(curl, vT).x, B = texture2D(curl, vB).x, C = texture2D(curl, vUv).x;' +
        ' vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + 0.0001; f *= strength * C; f.y *= -1.;' +
        ' vec2 v = texture2D(vel, vUv).xy + f * dt; gl_FragColor = vec4(clamp(v, -1000., 1000.), 0., 1.); }'),
      divergence: program('uniform sampler2D vel;' +
        'void main(){ float L = texture2D(vel, vL).x, R = texture2D(vel, vR).x, T = texture2D(vel, vT).y, B = texture2D(vel, vB).y; vec2 C = texture2D(vel, vUv).xy;' +
        ' if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;' +
        ' gl_FragColor = vec4(0.5 * (R - L + T - B), 0., 0., 1.); }'),
      scale: program('uniform sampler2D tex; uniform float value; void main(){ gl_FragColor = value * texture2D(tex, vUv); }'),
      pressure: program('uniform sampler2D pressure, divergence;' +
        'void main(){ float L = texture2D(pressure, vL).x, R = texture2D(pressure, vR).x, T = texture2D(pressure, vT).x, B = texture2D(pressure, vB).x;' +
        ' float d = texture2D(divergence, vUv).x; gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0., 0., 1.); }'),
      project: program('uniform sampler2D pressure, vel;' +
        'void main(){ float L = texture2D(pressure, vL).x, R = texture2D(pressure, vR).x, T = texture2D(pressure, vT).x, B = texture2D(pressure, vB).x;' +
        ' vec2 v = texture2D(vel, vUv).xy - vec2(R - L, T - B); gl_FragColor = vec4(v, 0., 1.); }'),
      // The fabric: a woven grid in page space, pulled along by the flow, lit
      // round the cursor and where it moves, tinted by the colour wash.
      display: program('uniform sampler2D tex, vel; uniform vec2 res, cursor;' +
        'uniform float dpr, scroll, cell, lineW, spot, glow, base, warp;' +
        'void main(){ vec2 px = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y) / dpr;' +
        ' vec2 v = texture2D(vel, vUv).xy;' +
        ' vec2 p = px + vec2(0., scroll) - vec2(v.x, -v.y) * warp;' +
        ' vec2 e = (0.5 - abs(fract(p / cell) - 0.5)) * cell;' +
        ' float thread = 1. - smoothstep(0., lineW, min(e.x, e.y));' +
        ' float knot = 1. - smoothstep(0., lineW * 2.2, length(e));' +
        ' float d = length(px - cursor);' +
        ' float reveal = base + glow * exp(-d * d / (spot * spot)) + min(0.2, length(v) * 0.0011);' +
        ' vec3 dye = 1. - exp(-texture2D(tex, vUv).rgb * 1.4); float dm = max(dye.r, max(dye.g, dye.b));' +
        ' vec3 tint = mix(vec3(0.9), dye / max(dm, 0.001), clamp(dm * 5., 0., 1.));' +
        ' vec3 col = (thread * 0.75 + knot * 0.7) * reveal * tint + dye * 0.3;' +
        ' gl_FragColor = vec4(col, clamp(max(col.r, max(col.g, col.b)), 0., 1.)); }')
    };
  } catch (err) { canvas.remove(); return; }

  // One full-screen triangle pair.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function target(w, h, fmt) {
    gl.activeTexture(gl.TEXTURE0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, w, h, 0, fmt.format, halfFloat, null);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex: tex, fbo: fbo, w: w, h: h, texel: [1 / w, 1 / h] };
  }
  function pair(w, h, fmt) {
    var a = target(w, h, fmt), b = target(w, h, fmt);
    return { read: a, write: b, w: w, h: h, texel: a.texel, swap: function () { var t = this.read; this.read = this.write; this.write = t; } };
  }
  function bind(unit, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); return unit; }
  function draw(to) {
    if (to) { gl.viewport(0, 0, to.w, to.h); gl.bindFramebuffer(gl.FRAMEBUFFER, to.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
  function use(prog, texel) { gl.useProgram(prog.p); if (texel && prog.u.texel) gl.uniform2fv(prog.u.texel, texel); return prog.u; }

  function grid(res) {
    var aspect = window.innerWidth / window.innerHeight;
    return aspect >= 1 ? [Math.round(res * aspect), res] : [res, Math.round(res / aspect)];
  }
  var vel, dye, div, curlT, pres;
  function build() {
    var s = grid(S.simRes), d = grid(S.dyeRes);
    vel = pair(s[0], s[1], fmtRG);
    dye = pair(d[0], d[1], fmtRGBA);
    div = target(s[0], s[1], fmtRG);
    curlT = target(s[0], s[1], fmtRG);
    pres = pair(s[0], s[1], fmtRG);
  }
  function size() {
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }
  size();
  build();
  var resizeTimer = 0;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { size(); build(); }, 150); });

  /* ---------- The simulation ---------- */
  function step(dt) {
    gl.disable(gl.BLEND);
    var u = use(P.curl, vel.texel); gl.uniform1i(u.vel, bind(0, vel.read)); draw(curlT);
    u = use(P.vorticity, vel.texel); gl.uniform1i(u.vel, bind(0, vel.read)); gl.uniform1i(u.curl, bind(1, curlT));
    gl.uniform1f(u.strength, S.curl); gl.uniform1f(u.dt, dt); draw(vel.write); vel.swap();
    u = use(P.divergence, vel.texel); gl.uniform1i(u.vel, bind(0, vel.read)); draw(div);
    u = use(P.scale, vel.texel); gl.uniform1i(u.tex, bind(0, pres.read)); gl.uniform1f(u.value, S.pressure); draw(pres.write); pres.swap();
    u = use(P.pressure, vel.texel); gl.uniform1i(u.divergence, bind(0, div));
    for (var i = 0; i < S.pressureIters; i++) { gl.uniform1i(u.pressure, bind(1, pres.read)); draw(pres.write); pres.swap(); }
    u = use(P.project, vel.texel); gl.uniform1i(u.pressure, bind(0, pres.read)); gl.uniform1i(u.vel, bind(1, vel.read)); draw(vel.write); vel.swap();
    u = use(P.advect, vel.texel); gl.uniform1i(u.vel, bind(0, vel.read)); gl.uniform1i(u.src, bind(0, vel.read));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.fade, S.velocityFade); draw(vel.write); vel.swap();
    u = use(P.advect, vel.texel); gl.uniform1i(u.vel, bind(0, vel.read)); gl.uniform1i(u.src, bind(1, dye.read));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.fade, S.densityFade); draw(dye.write); dye.swap();
  }
  function splat(x, y, dx, dy, rgb) {
    var aspect = canvas.width / canvas.height;
    var r = S.radius / 100 * (aspect > 1 ? aspect : 1);
    var u = use(P.splat, vel.texel);
    gl.uniform1i(u.tex, bind(0, vel.read)); gl.uniform1f(u.aspect, aspect);
    gl.uniform2f(u.point, x, y); gl.uniform3f(u.color, dx, dy, 0); gl.uniform1f(u.radius, r);
    draw(vel.write); vel.swap();
    gl.uniform1i(u.tex, bind(0, dye.read)); gl.uniform3f(u.color, rgb[0], rgb[1], rgb[2]);
    draw(dye.write); dye.swap();
  }
  function render() {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var f = S.fabric;
    var u = use(P.display, dye.texel);
    gl.uniform1i(u.tex, bind(0, dye.read)); gl.uniform1i(u.vel, bind(1, vel.read));
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, canvas.width / window.innerWidth);
    gl.uniform1f(u.scroll, window.scrollY);
    gl.uniform2f(u.cursor, cursorX, cursorY);
    gl.uniform1f(u.cell, f.cell); gl.uniform1f(u.lineW, f.line); gl.uniform1f(u.spot, f.spot);
    gl.uniform1f(u.glow, f.glow); gl.uniform1f(u.base, f.base); gl.uniform1f(u.warp, f.warp);
    draw(null);
  }

  /* ---------- Colour from the page ---------- */
  function coloursAt(x, y) {
    var el = document.elementFromPoint(x, y);
    var src = el && el.closest('[data-cloud]');
    var inner = src ? src.querySelectorAll('[data-cloud]') : [];
    var best = Infinity;
    Array.prototype.forEach.call(inner, function (card) {
      var r = card.getBoundingClientRect();
      var d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      if (d < best && d < 320) { best = d; src = card; }
    });
    var list = src ? src.getAttribute('data-cloud').trim().split(/\s+/) : S.fallback;
    return list.length ? list : S.fallback;
  }
  function rgb(hex, k) { var n = parseInt(hex.replace('#', ''), 16); return [((n >> 16) & 255) / 255 * k, ((n >> 8) & 255) / 255 * k, (n & 255) / 255 * k]; }
  // The colour drifts slowly through the section's list while the hand moves.
  var hueClock = 0;
  function colourAt(x, y, k) {
    var list = coloursAt(x, y);
    hueClock += 0.012;
    return rgb(list[Math.floor(hueClock) % list.length], k);
  }

  /* ---------- The loop ---------- */
  var cursorX = -1e4, cursorY = -1e4;   // where the fabric shows (off screen until the mouse comes)
  var running = false, last = 0, lastInput = 0;
  var queue = [];
  function covered() { return root.classList.contains('cs-open') || root.classList.contains('all-open'); }
  function asleep() { return covered() || document.hidden; }
  function wake() { lastInput = performance.now(); if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
  function frame(now) {
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    while (queue.length) { var q = queue.shift(); splat(q[0], q[1], q[2], q[3], q[4]); }
    step(dt);
    render();
    if (now - lastInput < S.idleMs && !asleep()) { requestAnimationFrame(frame); return; }
    running = false;
    // At rest, or in a hidden tab, the last frame stays on screen (the fabric
    // still round the cursor); under a project sheet it goes dark and starts clean.
    if (covered()) {
      [dye.read, dye.write, vel.read, vel.write].forEach(function (t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.clear(gl.COLOR_BUFFER_BIT); });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }
  function push(cx, cy, dx, dy, k) {
    if (asleep()) return;
    var w = window.innerWidth, h = window.innerHeight;
    queue.push([cx / w, 1 - cy / h, dx / w * S.force, -dy / h * S.force, colourAt(cx, cy, k)]);
    if (queue.length > 24) queue.splice(0, queue.length - 24);
    wake();
  }

  /* ---------- Input ---------- */
  var px = null, py = null;
  window.addEventListener('pointermove', function (e) {
    cursorX = e.clientX; cursorY = e.clientY;
    if (px === null) { px = e.clientX; py = e.clientY; if (!asleep()) wake(); return; }
    var dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    if (Math.abs(dx) + Math.abs(dy) < 0.5) return;
    push(e.clientX, e.clientY, dx, dy, S.intensity);
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    px = e.clientX; py = e.clientY;
    for (var i = 0; i < 4; i++) {
      var a = Math.random() * Math.PI * 2;
      push(e.clientX, e.clientY, Math.cos(a) * 26, Math.sin(a) * 26, S.intensity * 2);
    }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () {
    px = py = null; cursorX = cursorY = -1e4;
    if (!asleep()) wake();
  });

  // Scrolling: the fabric moves with the page (redrawn every scroll), and the
  // scroll drags a soft elastic wave through it under the cursor.
  var lastScroll = window.scrollY, lastScrollAt = 0;
  window.addEventListener('scroll', function () {
    if (asleep()) return;
    wake();
    var now = performance.now();
    var dy = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (now - lastScrollAt < 50) return;
    lastScrollAt = now;
    var x = px !== null ? px : window.innerWidth * (Math.random() < 0.5 ? 0.12 : 0.88);
    var y = py !== null ? py : window.innerHeight * (0.3 + Math.random() * 0.4);
    push(x, y, (Math.random() - 0.5) * 6, Math.max(-40, Math.min(40, dy)) * 0.9, S.intensity * 0.6);
  }, { passive: true });
})();
