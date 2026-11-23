/* =====================================================================
   MINIBOOK · the Branding card is a small open book that keeps turning
   One spread per brand (logo on the left, the brand in use on the right).
   Every few seconds the right page turns like real paper: it lifts by its
   outer edge and curls as it rises, crosses over the spine, and settles
   onto the left side spine-first with the edge floating down last.

   The turning page is made of thin vertical strips joined edge to edge
   (each one hinged to the one before), so it can bend. Each frame the
   script sets the page's angle and spreads a curl across the strips, and
   shades each strip by how far it faces away from the light.
   Pages are in the figure's data-pages, two per spread, in order.
   It turns only while the card is on screen and the tab is visible;
   with reduced motion it stays open on the first spread.
   ===================================================================== */
(function () {
  'use strict';
  var TURN_EVERY_MS = 3400;   // time from one turn to the next
  var TURN_MS = 1600;         // one turn
  var STRIPS = 10;            // how finely the page can bend
  var CURL_DEG = 85;          // how much it curls at most, edge to spine
  var LIFT_DEG = 9;           // how far each page rises from the spine (matches --minibook-lift)

  var REST_SIDE = Math.sin(LIFT_DEG * Math.PI / 180);
  // The same spine shadow and sheen the still pages have (css: .minibook__page--left/right::after),
  // laid over the picture so the turning page looks identical to them at rest.
  var LIGHT_RIGHT = 'linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 20%), linear-gradient(200deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 45%)';
  var LIGHT_LEFT = 'linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 20%), linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 45%)';

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  Array.prototype.forEach.call(document.querySelectorAll('[data-minibook]'), function (fig) {
    var pages = (fig.getAttribute('data-pages') || '').split('|').filter(Boolean);
    var spreads = [];
    for (var i = 0; i + 1 < pages.length; i += 2) spreads.push([pages[i], pages[i + 1]]);
    if (spreads.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var book = fig.querySelector('.minibook');
    var left = fig.querySelector('.minibook__page--left img');
    var right = fig.querySelector('.minibook__page--right img');
    var leaf = fig.querySelector('.minibook__leaf');

    // Build the bending page: strip 0 at the spine, each next strip inside the one before.
    var strips = [], parent = leaf;
    for (var s = 0; s < STRIPS; s++) {
      var seg = document.createElement('div');
      seg.className = 'minibook__strip';
      seg.style.width = s === 0 ? (100 / STRIPS) + '%' : '100%';
      if (s) seg.style.left = '100%';
      var front = document.createElement('div');
      front.className = 'minibook__side minibook__side--front';
      var back = document.createElement('div');
      back.className = 'minibook__side minibook__side--back';
      var pos = (s / (STRIPS - 1)) * 100;
      front.style.backgroundSize = back.style.backgroundSize = (STRIPS * 100) + '% 100%';
      front.style.backgroundPosition = pos + '% 0';
      back.style.backgroundPosition = (100 - pos) + '% 0';   // the back is the next left page, mirrored to the spine
      var fShade = document.createElement('span'); fShade.className = 'minibook__shade';
      var bShade = document.createElement('span'); bShade.className = 'minibook__shade';
      front.appendChild(fShade); back.appendChild(bShade);
      seg.appendChild(front); seg.appendChild(back);
      parent.appendChild(seg);
      strips.push({ el: seg, front: front, back: back, fShade: fShade, bShade: bShade });
      parent = seg;
    }
    strips[STRIPS - 1].front.classList.add('is-edge');
    strips[STRIPS - 1].back.classList.add('is-edge');

    // Every page, loaded and decoded once, so a turn never waits or flashes.
    var ready = {};
    function decoded(src) {
      if (!ready[src]) {
        var im = new Image();
        im.src = src;
        ready[src] = im.decode ? im.decode().catch(function () {}) : Promise.resolve();
      }
      return ready[src];
    }
    pages.forEach(decoded);

    function setSides(frontSrc, backSrc) {
      var f = LIGHT_RIGHT + ', url("' + frontSrc + '")', b = LIGHT_LEFT + ', url("' + backSrc + '")';
      strips.forEach(function (st) { st.front.style.backgroundImage = f; st.back.style.backgroundImage = b; });
    }

    // Pose the page at progress t (0 = lying on the right, 1 = lying on the left).
    function pose(t) {
      var e = ease(t);
      var base = -LIFT_DEG + (-180 + 2 * LIFT_DEG) * e;
      // Curl: the outer edge leads while lifting (negative), then trails while
      // landing (positive), so it never bends past the page it lands on.
      var curl = CURL_DEG * Math.sin(Math.PI * t) * (-(1 - t) + 0.5 * t);
      var step = curl / STRIPS;
      var angle = base;
      for (var k = 0; k < STRIPS; k++) {
        var st = strips[k];
        var rot = k === 0 ? base : step;
        if (k) angle += step;
        st.el.style.transform = (k === 0 ? 'translateZ(1.5px) ' : '') + 'rotateY(' + rot.toFixed(2) + 'deg)';
        // Light from the front: a strip darkens as it turns side-on, most at 90°,
        // and is exactly as bright as the pages when it lies flat.
        var side = Math.abs(Math.sin(angle * Math.PI / 180));
        var shade = (0.42 * Math.max(0, side - REST_SIDE) / (1 - REST_SIDE)).toFixed(3);
        st.fShade.style.opacity = shade;
        st.bShade.style.opacity = shade;
      }
    }

    var at = 0, timer = 0, visible = false, turning = false;

    // Resolves once a picture is decoded and has been drawn on screen.
    function painted(img) {
      var d = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      return d.then(function () {
        return new Promise(function (done) { requestAnimationFrame(function () { requestAnimationFrame(done); }); });
      });
    }

    function turn() {
      if (turning) return;
      turning = true;
      var next = (at + 1) % spreads.length;
      Promise.all([decoded(spreads[at][1]), decoded(spreads[next][0]), decoded(spreads[next][1])]).then(function () {
        // The turning page appears exactly over the right page (same picture, same light)…
        setSides(spreads[at][1], spreads[next][0]);
        pose(0);
        book.classList.add('is-turning');
        return new Promise(function (done) { requestAnimationFrame(function () { requestAnimationFrame(done); }); });
      }).then(function () {
        // …so the next right page can go in underneath without being seen.
        right.src = spreads[next][1];
        return painted(right);
      }).then(function () {
        return new Promise(function (done) {
          var start = performance.now();
          (function frame(now) {
            var t = Math.min(1, (now - start) / TURN_MS);
            pose(t);
            if (t < 1) requestAnimationFrame(frame); else done();
          })(start);
        });
      }).then(function () {
        // Landed exactly over the left page: put the same picture there, and only
        // once it's drawn take the turning page away.
        left.src = spreads[next][0];
        return painted(left);
      }).then(function () {
        book.classList.remove('is-turning');
        at = next;
        turning = false;
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (visible && !document.hidden) timer = setTimeout(function () { turn(); schedule(); }, TURN_EVERY_MS);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        schedule();
      }, { threshold: 0.25 }).observe(fig);
    } else {
      visible = true;
      schedule();
    }
    document.addEventListener('visibilitychange', schedule);
  });
})();
