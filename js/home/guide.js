/* =====================================================================
   THE GUIDE · a wandering light
   A small amber orb (a sibling of the bubble cursor) travels down the page
   with the scroll, drifting softly in the left margin and leaving a fading
   trail. As each section title ([data-guide]) passes, it lands beside it
   and the title lights up for a moment. It never covers content: it only
   moves in the margin outside the 1200px column.
   Reduced motion: no light, no trail; the titles simply fade in.
   ===================================================================== */
(function () {
  'use strict';

  var TRAIL_MS = 2600;          // how long the trail takes to fade (desktop)
  var TRAIL_MS_NARROW = 1400;   // phones
  var CAPTURE = 190;            // px: how close a title must come before the light lands
  var EASE = 0.14;              // how quickly the light follows its target, per frame at 60fps
  var LIT_MS = 1300;            // how long a title stays lit

  var titles = Array.prototype.slice.call(document.querySelectorAll('[data-guide]'));
  if (!titles.length) return;
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d');

  // Reduced motion (or no canvas): the titles fade in, nothing moves.
  if (reduce || !ctx) {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-seen');
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    titles.forEach(function (t) { t.classList.add('is-waiting'); io.observe(t); });
    return;
  }

  canvas.className = 'guide';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var hero = document.querySelector('.hero');
  var dpr = 1, vw = 0, vh = 0;
  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = true;
  }

  var orb = null;               // where the light is now (viewport px)
  var trail = [];               // { x, y (page px), t }
  var dirty = true, lastScroll = -1;
  var lit = titles.map(function () { return { on: false, armed: true, timer: 0 }; });

  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function frame(now) {
    requestAnimationFrame(frame);
    if (root.classList.contains('all-open') || root.classList.contains('cs-open')) return;

    var scroll = window.scrollY;
    var narrow = vw < 760;
    var life = narrow ? TRAIL_MS_NARROW : TRAIL_MS;
    var heroH = hero ? hero.offsetHeight : vh;
    // Fades in once the hero has mostly gone by.
    var show = smooth((scroll - heroH * 0.5) / (heroH * 0.35));

    // The margin: everything left of the content column.
    var colLeft = titles[0].getBoundingClientRect().left;
    var laneMid = narrow ? Math.max(6, colLeft * 0.5) : colLeft * 0.5;
    var laneHalf = narrow ? 0 : Math.min(colLeft * 0.3, 38);

    // Travelling: a little above the middle of the screen, weaving with the scroll.
    var tx = laneMid + (Math.sin(scroll / 230) * 0.75 + Math.sin(scroll / 97) * 0.25) * laneHalf;
    var ty = vh * 0.42;

    // Landing: the nearest title pulls the light to its side.
    var best = 0, bestI = -1, ax = 0, ay = 0;
    titles.forEach(function (t, i) {
      var r = t.getBoundingClientRect();
      var cy = r.top + Math.min(r.height, 52) / 2;
      var w = smooth(1 - Math.abs(cy - ty) / CAPTURE);
      if (w > best) { best = w; bestI = i; ax = narrow ? Math.max(5, r.left - 9) : r.left - 26; ay = cy; }
      // A title can light up again once it has left the light's reach.
      if (w < 0.15) lit[i].armed = true;
    });
    if (best > 0) { tx += (ax - tx) * best; ty += (ay - ty) * best; }
    if (bestI >= 0 && best > 0.88 && lit[bestI].armed && show > 0.5) light(bestI);

    if (!orb) orb = { x: tx, y: ty };
    var dx = tx - orb.x, dy = ty - orb.y;
    var moving = Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05;
    orb.x += dx * EASE;
    orb.y += dy * EASE;

    // The trail is drawn in page space, so it stays where the light has been.
    if (show > 0.02 && (moving || scroll !== lastScroll)) trail.push({ x: orb.x, y: orb.y + scroll, t: now });
    while (trail.length && now - trail[0].t > life) trail.shift();

    if (!moving && scroll === lastScroll && !trail.length && !dirty) return;   // nothing changed: rest
    lastScroll = scroll;
    dirty = false;
    draw(now, scroll, life, show * (narrow ? 0.4 : 1), narrow);
  }

  function draw(now, scroll, life, alpha, narrow) {
    ctx.clearRect(0, 0, vw, vh);
    if (alpha <= 0.01) return;
    ctx.lineCap = 'round';
    for (var i = 1; i < trail.length; i++) {
      var a = trail[i - 1], b = trail[i];
      var fade = Math.pow(1 - (now - b.t) / life, 1.6);
      if (fade <= 0) continue;
      ctx.strokeStyle = 'rgba(226, 184, 119,' + (0.34 * fade * alpha).toFixed(3) + ')';
      ctx.lineWidth = (narrow ? 1.2 : 2.2) * (0.4 + fade);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y - scroll);
      ctx.lineTo(b.x, b.y - scroll);
      ctx.stroke();
    }
    var r = narrow ? 10 : 20;
    var g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
    g.addColorStop(0, 'rgba(255, 244, 226,' + alpha + ')');
    g.addColorStop(0.18, 'rgba(240, 206, 150,' + (0.9 * alpha) + ')');
    g.addColorStop(0.45, 'rgba(226, 184, 119,' + (0.32 * alpha) + ')');
    g.addColorStop(1, 'rgba(226, 184, 119, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function light(i) {
    var s = lit[i];
    s.armed = false;
    titles[i].classList.add('is-lit');
    clearTimeout(s.timer);
    s.timer = setTimeout(function () { titles[i].classList.remove('is-lit'); }, LIT_MS);
  }

  window.addEventListener('resize', size);
  size();
  requestAnimationFrame(frame);
})();
