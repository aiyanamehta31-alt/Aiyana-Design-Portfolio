/* =====================================================================
   SKILLS · the show-and-tell stage
   One Three.js scene (r158). The page itself only uses classic scripts:
   this file imports Three.js and its loaders as modules (see the import map
   in index.html), only over http(s), and only when the stage is about a
   screen away. From file://, without WebGL, or before it loads, each piece
   shows its still image instead.

   The object on the plinth turns slowly; drag to spin (with momentum),
   pinch or Ctrl+scroll to zoom (plain scroll zooms only after you click the
   stage), double-click to reset. Arrow keys turn it, + and − zoom, 0 resets.
   Every piece comes from js/skills-data.js; each `type` has a builder below.
   ===================================================================== */
(function () {
  'use strict';

  var THREE_ROOT = 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/';
  var DRACO_PATH = THREE_ROOT + 'libs/draco/gltf/';
  var AUTO_SPIN = 0.28;          // radians per second while idle
  var IDLE_MS = 2200;            // after a drag, before it turns by itself again
  var SWAP_MS = 650;             // the old piece sinks, the new one rises
  var ZOOM = { min: 3.6, max: 8, start: 5.6 };

  var root = document.querySelector('[data-stage]');
  var skills = window.SKILLS;
  if (!root || !skills || !skills.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFile = location.protocol === 'file:';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="needs">' + m + '</mark>'; }); }
  var ICON = {
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7.5A7 7 0 1 1 6.5 15"/><path d="M8 3.5v4.2H3.8"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 7.5A7 7 0 1 0 17.5 15"/><path d="M16 3.5v4.2h4.2"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6 8.5 12l6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg>'
  };

  /* ---------- The markup ---------- */
  root.innerHTML =
    '<div class="stage__box">' +
      '<div class="stage__view" data-view tabindex="0" aria-label="The piece on the plinth. Arrow keys turn it, plus and minus zoom, zero resets.">' +
        '<img class="stage__still" data-still alt="" />' +
        '<p class="stage__hint is-gone" data-hint aria-hidden="true">Drag to spin</p>' +
        '<p class="stage__loading" data-loading hidden>Setting the stage…</p>' +
        '<div class="stage__controls" data-controls hidden>' +
          '<button type="button" class="stage__btn" data-turn="-1" aria-label="Rotate left">' + ICON.left + '</button>' +
          '<button type="button" class="stage__btn" data-turn="1" aria-label="Rotate right">' + ICON.right + '</button>' +
          '<button type="button" class="stage__btn" data-reset aria-label="Reset the view">' + ICON.reset + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="stage__info" data-info aria-live="polite"></div>' +
    '</div>' +
    '<div class="periods" role="tablist" aria-label="Skills, as a class schedule">' + skills.map(function (s, i) {
      return '<button type="button" class="period" role="tab" id="period-' + i + '" aria-selected="false" data-period="' + i + '">' +
        '<span class="period__no">Period ' + (i + 1) + '</span><span class="period__name">' + esc(s.name) + '</span></button>';
    }).join('') + '</div>' +
    '<div class="thumbs">' +
      '<button type="button" class="stage__btn" data-step="-1" aria-label="Previous piece">' + ICON.prev + '</button>' +
      '<ul class="thumbs__list" data-thumbs aria-label="Pieces in this skill"></ul>' +
      '<button type="button" class="stage__btn" data-step="1" aria-label="Next piece">' + ICON.next + '</button>' +
      '<p class="thumbs__count" data-count></p>' +
    '</div>';

  var view = root.querySelector('[data-view]');
  var still = root.querySelector('[data-still]');
  var hint = root.querySelector('[data-hint]');
  var loading = root.querySelector('[data-loading]');
  var controls = root.querySelector('[data-controls]');
  var info = root.querySelector('[data-info]');
  var thumbs = root.querySelector('[data-thumbs]');
  var count = root.querySelector('[data-count]');
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-period]'));
  var sIndex = 0, pIndex = 0;
  var three = null;     // the live scene, once it has loaded

  function piece() { return skills[sIndex].pieces[pIndex]; }

  /* ---------- Choosing a skill and a piece ---------- */
  function selectSkill(i, focus) {
    sIndex = Math.max(0, Math.min(skills.length - 1, i));
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', String(k === sIndex));
      t.tabIndex = k === sIndex ? 0 : -1;
    });
    tabs[sIndex].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    var s = skills[sIndex];
    thumbs.innerHTML = s.pieces.map(function (p, k) {
      return '<li><button type="button" class="thumb" data-piece="' + k + '" aria-label="' + esc(p.title.replace(/\[NEEDS FROM AIYANA[^\]]*\]/, 'Placeholder')) + '">' +
        '<img src="' + esc(p.still) + '" alt="" loading="lazy" decoding="async" /></button></li>';
    }).join('');
    selectPiece(0);
    if (focus) view.focus({ preventScroll: true });
  }
  function selectPiece(k) {
    var list = skills[sIndex].pieces;
    pIndex = (k + list.length) % list.length;
    var p = piece(), s = skills[sIndex];
    Array.prototype.forEach.call(thumbs.querySelectorAll('.thumb'), function (b, j) {
      if (j === pIndex) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    count.textContent = (pIndex + 1) + ' of ' + list.length;
    info.innerHTML =
      (p.placeholder ? '<p class="stage__badge">Placeholder</p>' : '') +
      '<h3 class="stage__title">' + rich(p.title) + '</h3>' +
      '<p class="stage__line">' + rich(p.line) + '</p>' +
      '<ul class="stage__tools" aria-label="Tools">' + (p.tools || []).map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>' +
      '<a class="stage__all" href="#project/skills/' + esc(s.slug) + '">See all ' + esc(s.name.toLowerCase().replace(/^ui/, 'UI').replace(/^3d/, '3D')) + ' work →</a>';
    still.src = p.still;
    still.alt = p.alt || '';
    if (three) three.show(p); else still.hidden = false;
  }

  root.querySelector('.periods').addEventListener('click', function (e) {
    var t = e.target.closest('[data-period]');
    if (t) selectSkill(Number(t.getAttribute('data-period')));
  });
  root.querySelector('.periods').addEventListener('keydown', function (e) {
    var d = { ArrowRight: 1, ArrowLeft: -1, Home: -99, End: 99 }[e.key];
    if (!d) return;
    e.preventDefault();
    selectSkill(d === -99 ? 0 : d === 99 ? skills.length - 1 : (sIndex + d + skills.length) % skills.length);
    tabs[sIndex].focus();
  });
  thumbs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-piece]');
    if (b) selectPiece(Number(b.getAttribute('data-piece')));
  });
  Array.prototype.forEach.call(root.querySelectorAll('[data-step]'), function (b) {
    b.addEventListener('click', function () { selectPiece(pIndex + Number(b.getAttribute('data-step'))); });
  });
  // The locker's shelf objects pick a skill.
  window.addEventListener('skills:select', function (e) {
    var i = skills.findIndex(function (s) { return s.slug === e.detail.slug; });
    if (i >= 0) selectSkill(i, e.detail.focus);
  });

  selectSkill(0);

  /* ---------- The 3D stage (http(s) and WebGL only) ---------- */
  function webgl() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }
  if (isFile || !webgl() || !('IntersectionObserver' in window)) return;   // stills only

  var started = false;
  new IntersectionObserver(function (entries, io) {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    io.disconnect();
    loading.hidden = false;
    Promise.all([
      import('three'),
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/loaders/DRACOLoader.js'),
      import('three/addons/environments/RoomEnvironment.js')
    ]).then(function (m) {
      three = makeStage(m[0], m[1].GLTFLoader, m[2].DRACOLoader, m[3].RoomEnvironment);
      loading.hidden = true;
      three.show(piece(), true);
    }).catch(function (err) {
      loading.hidden = true;
      if (window.console) console.warn('[stage] 3D could not load; showing stills.', err && err.message);
    });
  }, { rootMargin: '700px 0px' }).observe(view);

  function makeStage(THREE, GLTFLoader, DRACOLoader, RoomEnvironment) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    view.insertBefore(canvas, view.firstChild);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    var dist = ZOOM.start, distTarget = ZOOM.start;
    var LOOK = new THREE.Vector3(0, 1.0, 0);

    // Soft studio light from above, a low fill, and an amber rim from behind.
    var spot = new THREE.SpotLight(0xFFF1DC, 70, 14, 0.5, 0.7, 1.6);
    spot.position.set(0.4, 6, 2);
    spot.target.position.set(0, 0.8, 0);
    scene.add(spot, spot.target);
    scene.add(new THREE.HemisphereLight(0x9AA2B0, 0x0A0A0A, 0.45));
    var rim = new THREE.DirectionalLight(0xE2B877, 1.6);
    rim.position.set(-3.2, 2.6, -3);
    scene.add(rim);
    var rim2 = new THREE.DirectionalLight(0xE2B877, 0.6);
    rim2.position.set(3, 1.6, -2.5);
    scene.add(rim2);

    // The plinth: a small round stand with a gently glossy top.
    var plinth = new THREE.Group();
    var side = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.2, 0.26, 72), new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.55, metalness: 0.15 }));
    side.position.y = 0.13;
    var top = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.012, 72), new THREE.MeshPhysicalMaterial({ color: 0x1B1B1E, roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 0.6 }));
    top.position.y = 0.266;
    var edge = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.006, 8, 96), new THREE.MeshBasicMaterial({ color: 0xE2B877, transparent: true, opacity: 0.35 }));
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.272;
    plinth.add(side, top, edge);
    scene.add(plinth);
    // A soft shadow on the plinth under the floating piece.
    var shadowTex = canvasTexture(256, 256, function (g, w, h) {
      var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.275;
    scene.add(shadow);

    var holder = new THREE.Group();   // floats and bobs
    holder.position.y = 1.15;
    var spinner = new THREE.Group();  // turns
    holder.add(spinner);
    scene.add(holder);

    var texLoader = new THREE.TextureLoader();
    var draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_PATH);
    var gltf = new GLTFLoader();
    gltf.setDRACOLoader(draco);

    function canvasTexture(w, h, draw) {
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    }
    function image(src) {
      return new Promise(function (resolve) {
        texLoader.load(src, function (t) { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; resolve(t); }, undefined, function () { resolve(null); });
      });
    }
    // A clearly labelled placeholder surface.
    function placeholder(w, h, title, sub, hue) {
      return canvasTexture(w, h, function (g) {
        var gr = g.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0, 'hsl(' + hue + ',22%,30%)'); gr.addColorStop(1, 'hsl(' + hue + ',26%,14%)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2;
        for (var x = -h; x < w; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + h, h); g.stroke(); }
        g.fillStyle = '#E2B877'; g.font = '600 ' + Math.round(w * 0.06) + 'px "Geist Mono", monospace'; g.textAlign = 'center';
        g.fillText('PLACEHOLDER', w / 2, h * 0.46);
        g.fillStyle = '#EDEDED'; g.font = '600 ' + Math.round(w * 0.075) + 'px "Funnel Sans", sans-serif';
        g.fillText(title, w / 2, h * 0.58);
        if (sub) { g.fillStyle = '#9A9A9A'; g.font = Math.round(w * 0.05) + 'px "Funnel Sans", sans-serif'; g.fillText(sub, w / 2, h * 0.66); }
      });
    }
    function std(opts) { return new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.6, metalness: 0 }, opts)); }
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    /* ---------- Builders: one per kind of work ---------- */
    var BUILD = {
      // 3D modelling: the real .glb, shown as it is.
      model: function (p) {
        if (!p.model) return Promise.resolve(figure());
        return new Promise(function (resolve) {
          gltf.load(p.model, function (g) {
            var obj = g.scene;
            var box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3());
            var k = 1.6 / Math.max(size.x, size.y, size.z);
            obj.scale.setScalar(k);
            box.setFromObject(obj);
            obj.position.sub(box.getCenter(new THREE.Vector3()));
            var wrap = new THREE.Group(); wrap.add(obj);
            resolve({ obj: wrap });
          }, undefined, function () { resolve(figure()); });
        });
      },
      // UI design: a phone; tap the screen for the next one.
      phone: function (p) {
        var w = 0.86, h = 1.78, d = 0.08, r = 0.13;
        var shape = new THREE.Shape();
        shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
        shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); shape.lineTo(-w / 2 + r, h / 2);
        shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
        var geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 12 });
        geo.translate(0, 0, -d / 2);
        var body = new THREE.Mesh(geo, std({ color: 0x1C1C1F, roughness: 0.35, metalness: 0.6 }));
        var screens = (p.screens && p.screens.length) ? p.screens : null;
        var phTex = [0, 1, 2].map(function (i) { return placeholder(360, 760, 'Screen ' + (i + 1) + ' of 3', 'Tap for the next', 210 + i * 25); });
        var mat = new THREE.MeshBasicMaterial({ map: phTex[0], toneMapped: false });
        var screen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.07), mat);
        screen.position.z = d / 2 + 0.014;
        var g = new THREE.Group(); g.add(body, screen);
        var list = phTex, i = 0;
        var ready = screens ? Promise.all(screens.map(image)).then(function (t) { list = t.filter(Boolean).length ? t.filter(Boolean) : phTex; mat.map = list[0]; mat.needsUpdate = true; }) : Promise.resolve();
        return ready.then(function () {
          return { obj: g, onClick: function () { i = (i + 1) % list.length; mat.map = list[i]; mat.needsUpdate = true; } };
        });
      },
      // Packaging: the brand's label wrapped round a can.
      can: function (p) {
        var r = 0.42, h = 1.34;
        var g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 72, 1, true), std({ color: new THREE.Color(p.body || '#EEEEEE'), roughness: 0.45, metalness: 0.15 })));
        var metal = std({ color: 0xC9CCD0, roughness: 0.25, metalness: 1 });
        var topRim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r, 0.07, 72), metal); topRim.position.y = h / 2 + 0.035;
        var lid = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.86, r * 0.86, 0.01, 72), metal); lid.position.y = h / 2 + 0.07;
        var tab = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.014, 8, 24), metal); tab.rotation.x = Math.PI / 2; tab.position.set(0, h / 2 + 0.08, 0.12);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.86, 0.07, 72), metal); base.position.y = -h / 2 - 0.035;
        g.add(topRim, lid, tab, base);
        return image(p.label).then(function (tex) {
          if (tex) {
            // The label photo shows the front half of the can, so it is wrapped
            // round the front: each point takes the colour seen straight on.
            var A = 86 * Math.PI / 180;
            var geo = new THREE.CylinderGeometry(r + 0.002, r + 0.002, h * 0.92, 72, 1, true, -A, 2 * A);
            var pos = geo.attributes.position, uv = geo.attributes.uv;
            for (var k = 0; k < pos.count; k++) uv.setX(k, 0.5 + 0.5 * pos.getX(k) / (r * Math.sin(A)));
            uv.needsUpdate = true;
            g.add(new THREE.Mesh(geo, std({ map: tex, roughness: 0.5, metalness: 0.05 })));
          }
          g.rotation.y = 0;
          return { obj: g };
        });
      },
      // Packaging: a takeout box, the brand's front and lid as they are.
      box: function (p) {
        var bw = 0.92, bd = 0.72, tw = 1.12, td = 0.86, h = 1.0;
        var y0 = -h / 2, y1 = h / 2;
        var v = {
          fbl: [-bw / 2, y0, bd / 2], fbr: [bw / 2, y0, bd / 2], ftl: [-tw / 2, y1, td / 2], ftr: [tw / 2, y1, td / 2],
          bbl: [-bw / 2, y0, -bd / 2], bbr: [bw / 2, y0, -bd / 2], btl: [-tw / 2, y1, -td / 2], btr: [tw / 2, y1, -td / 2]
        };
        function quad(a, b, c, d2) {   // a bottom-left, b bottom-right, c top-right, d top-left
          var geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute([].concat(a, b, c, a, c, d2), 3));
          geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
          geo.computeVertexNormals();
          return geo;
        }
        var paper = std({ color: new THREE.Color(p.body || '#151515'), roughness: 0.9, side: THREE.DoubleSide });
        var g = new THREE.Group();
        return Promise.all([image(p.front), image(p.lid)]).then(function (t) {
          var front = new THREE.Mesh(quad(v.fbl, v.fbr, v.ftr, v.ftl), t[0] ? std({ map: t[0], roughness: 0.85 }) : paper);
          var right = new THREE.Mesh(quad(v.fbr, v.bbr, v.btr, v.ftr), paper);
          var backF = new THREE.Mesh(quad(v.bbr, v.bbl, v.btl, v.btr), paper);
          var left = new THREE.Mesh(quad(v.bbl, v.fbl, v.ftl, v.btl), paper);
          var bottom = new THREE.Mesh(quad(v.bbl, v.bbr, v.fbr, v.fbl), paper);
          var lid = new THREE.Mesh(quad(v.ftl, v.ftr, v.btr, v.btl), t[1] ? std({ map: t[1], roughness: 0.85, side: THREE.DoubleSide }) : paper);
          g.add(front, right, backF, left, bottom, lid);
          // The wire handle.
          var curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-tw / 2 - 0.01, y1 - 0.18, 0), new THREE.Vector3(-tw / 2 + 0.05, y1 + 0.45, 0), new THREE.Vector3(tw / 2 - 0.05, y1 + 0.45, 0), new THREE.Vector3(tw / 2 + 0.01, y1 - 0.18, 0)]);
          g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.011, 8, false), std({ color: 0x222224, roughness: 0.3, metalness: 0.9 })));
          g.scale.setScalar(0.8);
          g.position.y = -0.2;
          return { obj: g };
        });
      },
      // Graphic design: a printed card with real paper thickness.
      poster: function (p) {
        var w = 1.14, h = 1.6;
        return Promise.all([p.front ? image(p.front) : null, p.back ? image(p.back) : null]).then(function (t) {
          var front = t[0] || placeholder(570, 800, 'Poster', 'The front', 30);
          var backT = t[1] || canvasTexture(570, 800, function (g, W, H) {
            g.fillStyle = '#EDE8DE'; g.fillRect(0, 0, W, H);
            g.fillStyle = '#6B6560'; g.font = '600 26px "Geist Mono", monospace'; g.textAlign = 'center';
            g.fillText('THE BACK', W / 2, H * 0.45);
            g.fillStyle = '#2A2724'; g.font = '30px "Funnel Sans", sans-serif';
            g.fillText(p.note || 'Process image goes here.', W / 2, H * 0.53);
          });
          var paperEdge = std({ color: 0xEFEBE3, roughness: 0.9 });
          var mats = [paperEdge, paperEdge, paperEdge, paperEdge, std({ map: front, roughness: 0.8 }), std({ map: backT, roughness: 0.85 })];
          var card = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), mats);
          card.rotation.z = -0.03;
          var g = new THREE.Group(); g.add(card);
          return { obj: g };
        });
      },
      // Photography: a stack of prints; click deals the next one on top.
      prints: function (p) {
        var srcs = (p.prints && p.prints.length) ? p.prints : null;
        var g = new THREE.Group(), cards = [];
        function frame(tex) {
          return canvasTexture(520, 620, function (c, W, H) {
            c.fillStyle = '#F3EFE7'; c.fillRect(0, 0, W, H);
            if (tex && tex.image) c.drawImage(tex.image, 26, 26, W - 52, H - 140);
          });
        }
        var made = srcs ? Promise.all(srcs.map(image)).then(function (t) { return t.filter(Boolean).map(frame); })
          : Promise.resolve([0, 1, 2].map(function (i) { return placeholder(520, 620, 'Print ' + (i + 1) + ' of 3', 'Click to deal the next', 20 + i * 70); }));
        return made.then(function (texes) {
          texes.forEach(function (t, i) {
            var m = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.01), [std({ color: 0xF3EFE7 }), std({ color: 0xF3EFE7 }), std({ color: 0xF3EFE7 }), std({ color: 0xF3EFE7 }), std({ map: t, roughness: 0.7 }), std({ color: 0xE9E4DA })]);
            cards.push(m); g.add(m);
          });
          function lay() {
            cards.forEach(function (m, i) {
              var fromTop = cards.length - 1 - i;
              m.userData.to = { z: -fromTop * 0.03, rz: [0, 0.07, -0.06, 0.04][fromTop % 4], x: fromTop * 0.03 };
            });
          }
          lay();
          cards.forEach(function (m) { m.position.z = m.userData.to.z; m.rotation.z = m.userData.to.rz; m.position.x = m.userData.to.x; });
          var dealing = 0;
          return {
            obj: g,
            onClick: function () {
              if (dealing || cards.length < 2) return;
              var topCard = cards[cards.length - 1];
              cards.unshift(cards.pop());   // the top print goes to the back…
              lay();
              dealing = reduce ? 0 : 1;
              if (reduce) cards.forEach(function (m) { m.position.z = m.userData.to.z; m.rotation.z = m.userData.to.rz; m.position.x = m.userData.to.x; });
              topCard.userData.flyT = 0;
            },
            update: function (dt) {
              cards.forEach(function (m) {
                var to = m.userData.to;
                if (m.userData.flyT != null) {   // …after sliding out to the side
                  m.userData.flyT += dt / 0.55;
                  var t = Math.min(1, m.userData.flyT), out = Math.sin(t * Math.PI);
                  m.position.x = to.x + out * 1.25;
                  m.position.z = m.position.z + (to.z - m.position.z) * Math.min(1, dt * 8);
                  m.rotation.z = to.rz + out * 0.2;
                  if (t >= 1) { m.userData.flyT = null; dealing = 0; }
                } else {
                  m.position.z += (to.z - m.position.z) * Math.min(1, dt * 8);
                  m.position.x += (to.x - m.position.x) * Math.min(1, dt * 8);
                  m.rotation.z += (to.rz - m.rotation.z) * Math.min(1, dt * 8);
                }
              });
            }
          };
        });
      },
      // Product sketching: a sketchbook that opens when clicked.
      sketchbook: function (p) {
        var w = 1.0, h = 1.32, g = new THREE.Group();
        var pagesSrc = (p.pages && p.pages.length) ? p.pages : null;
        var made = pagesSrc ? Promise.all(pagesSrc.slice(0, 2).map(image)) : Promise.resolve([null, null]);
        return made.then(function (t) {
          function sketch(seed) {
            return canvasTexture(500, 660, function (c, W, H) {
              c.fillStyle = '#F1ECE1'; c.fillRect(0, 0, W, H);
              c.strokeStyle = 'rgba(80,72,64,0.75)'; c.lineWidth = 2.2; c.lineCap = 'round';
              for (var k = 0; k < 5; k++) { c.beginPath(); c.moveTo(70 + k * 6, 200 + seed * 40 + k * 70); c.bezierCurveTo(160, 120 + k * 60, 320, 260 + k * 50, 430 - k * 8, 180 + k * 70); c.stroke(); }
              c.fillStyle = '#E2B877'; c.font = '600 24px "Geist Mono", monospace'; c.textAlign = 'center'; c.fillText('PLACEHOLDER SKETCH', W / 2, H - 60);
            });
          }
          var left = t[0] || sketch(0), right = t[1] || sketch(1);
          var coverMat = std({ color: 0x3A332C, roughness: 0.85 });
          var back = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), coverMat); back.position.z = -0.05;
          var block = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, h - 0.04, 0.07), [std({ color: 0xEDE7DA }), std({ color: 0xEDE7DA }), std({ color: 0xEDE7DA }), std({ color: 0xEDE7DA }), std({ map: right, roughness: 0.9 }), std({ color: 0xEDE7DA })]);
          // The front cover hinges on the spine (its left edge).
          var hinge = new THREE.Group(); hinge.position.set(-w / 2, 0, 0.04);
          var cover = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), [coverMat, coverMat, coverMat, coverMat, coverMat, std({ map: left, roughness: 0.9 })]);
          cover.position.x = w / 2;
          hinge.add(cover);
          var band = new THREE.Mesh(new THREE.BoxGeometry(0.03, h + 0.01, 0.05), std({ color: 0xE2B877, roughness: 0.5 })); band.position.set(w * 0.32, 0, 0.02); cover.add(band);
          g.add(back, block, hinge);
          var open = false, ang = 0;
          return {
            obj: g,
            onClick: function () { open = !open; if (reduce) ang = open ? -Math.PI * 0.92 : 0; },
            update: function (dt) {
              ang += ((open ? -Math.PI * 0.92 : 0) - ang) * Math.min(1, dt * 5);
              hinge.rotation.y = ang;
              g.position.x = (w / 2) * (ang / (-Math.PI * 0.92));   // slides right so the open spread stays centred
            }
          };
        });
      },
      // Video generation: a small screen playing the clip (or a drawn placeholder).
      screen: function (p) {
        var g = new THREE.Group();
        var frameM = std({ color: 0x18181A, roughness: 0.35, metalness: 0.6 });
        g.add(new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.02, 0.07), frameM));
        var stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.42, 16), frameM); stand.position.set(0, -0.72, -0.05);
        var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.03, 32), frameM); foot.position.set(0, -0.93, -0.05);
        g.add(stand, foot);
        var mat = new THREE.MeshBasicMaterial({ toneMapped: false });
        var panel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), mat); panel.position.z = 0.0365;
        g.add(panel);
        g.position.y = 0.18;
        if (p.video) {
          var v = document.createElement('video');
          v.src = p.video; v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = 'anonymous';
          if (p.poster) v.poster = p.poster;
          v.play().catch(function () {});
          var vt = new THREE.VideoTexture(v); vt.colorSpace = THREE.SRGBColorSpace;
          mat.map = vt;
          return Promise.resolve({ obj: g, dispose: function () { v.pause(); v.removeAttribute('src'); v.load(); } });
        }
        // Placeholder clip: drawn live, a slow drifting shape.
        var c = document.createElement('canvas'); c.width = 480; c.height = 288;
        var cx = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        var time = 0;
        function draw() {
          var gr = cx.createLinearGradient(0, 0, 480, 288); gr.addColorStop(0, '#1C2A40'); gr.addColorStop(1, '#0E1320');
          cx.fillStyle = gr; cx.fillRect(0, 0, 480, 288);
          for (var k = 0; k < 3; k++) {
            cx.beginPath();
            cx.arc(240 + Math.cos(time * 0.8 + k * 2.1) * 120, 144 + Math.sin(time * 1.1 + k) * 60, 40 + k * 14, 0, Math.PI * 2);
            cx.fillStyle = ['rgba(226,184,119,0.75)', 'rgba(110,150,210,0.6)', 'rgba(237,237,237,0.35)'][k];
            cx.fill();
          }
          cx.fillStyle = '#EDEDED'; cx.font = '600 18px "Geist Mono", monospace'; cx.textAlign = 'center';
          cx.fillText('PLACEHOLDER CLIP', 240, 270);
          tex.needsUpdate = true;
        }
        draw();
        return Promise.resolve({ obj: g, update: function (dt) { time += dt; draw(); } });
      }
    };
    // The 3D-modelling placeholder: a small figure that looks 3D-printed.
    function figure() {
      var lines = canvasTexture(64, 256, function (c, W, H) {
        c.fillStyle = '#C9C4BD'; c.fillRect(0, 0, W, H);
        c.fillStyle = 'rgba(0,0,0,0.08)'; for (var y = 0; y < H; y += 4) c.fillRect(0, y, W, 1);
      });
      lines.wrapS = lines.wrapT = THREE.RepeatWrapping; lines.repeat.set(1, 3);
      var m = std({ color: 0xE6E1DA, map: lines, roughness: 0.55 });
      var g = new THREE.Group();
      var pts = [[0, -0.75], [0.36, -0.75], [0.4, -0.7], [0.34, -0.2], [0.3, 0.1], [0.18, 0.22], [0, 0.24]].map(function (q) { return new THREE.Vector2(q[0], q[1]); });
      g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 48), m));
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 32), m); head.position.y = 0.5;
      var eyeM = std({ color: 0x1A1A1C, roughness: 0.3 });
      var e1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), eyeM); e1.position.set(-0.1, 0.54, 0.27);
      var e2 = e1.clone(); e2.position.x = 0.1;
      g.add(head, e1, e2);
      return { obj: g };
    }

    /* ---------- Showing a piece: the old one sinks, the new one rises ---------- */
    var current = null, leaving = [], token = 0;
    function dispose(o) {
      if (o.dispose) o.dispose();
      o.obj.traverse(function (n) {
        if (n.geometry) n.geometry.dispose();
        var mats = n.material ? (Array.isArray(n.material) ? n.material : [n.material]) : [];
        mats.forEach(function (mt) { if (mt.map && mt.map !== shadowTex) mt.map.dispose(); mt.dispose(); });
      });
    }
    function fade(o, a) {
      o.obj.traverse(function (n) {
        var mats = n.material ? (Array.isArray(n.material) ? n.material : [n.material]) : [];
        mats.forEach(function (mt) { mt.transparent = a < 1; mt.opacity = a; });
      });
    }
    function show(p, first) {
      var my = ++token;
      still.hidden = true;
      canvas.hidden = false;
      controls.hidden = false;
      var b = BUILD[p.type] || BUILD.model;
      b(p).then(function (o) {
        if (my !== token) { dispose(o); return; }
        if (current) { current.out = 0; leaving.push(current); }
        current = o;
        o.in = reduce ? 1 : 0;
        spinner.add(o.obj);
        rotY = 0; rotX = 0; velY = 0;
        if (!reduce) { fade(o, 0); }
        wake();
        if (first) showHint();
      }).catch(function () {
        still.hidden = false;
        canvas.hidden = true;
      });
    }

    /* ---------- Turning, zooming, clicking ---------- */
    var rotY = 0, rotX = 0, velY = 0, lastInput = 0, engaged = false;
    var pointers = new Map(), drag = null, pinch0 = 0;
    canvas.addEventListener('pointerdown', function (e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);
      engaged = true;
      if (pointers.size === 2) { var a = Array.from(pointers.values()); pinch0 = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); drag = null; return; }
      drag = { x: e.clientX, y: e.clientY, moved: 0, t: performance.now() };
      view.classList.add('is-grabbing');
      lastInput = performance.now();
      hideHint();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) return;
      var prev = pointers.get(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        var a = Array.from(pointers.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        if (pinch0) { distTarget = clampZoom(distTarget * pinch0 / d); pinch0 = d; wake(); }
        return;
      }
      if (!drag) return;
      var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.01;
      rotX = Math.max(-0.45, Math.min(0.45, rotX + dy * 0.005));
      velY = dx * 0.01 / Math.max(1, (performance.now() - drag.t) / 16);
      drag.t = performance.now();
      lastInput = performance.now();
      wake();
    });
    function up(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch0 = 0;
      view.classList.remove('is-grabbing');
      if (drag && drag.moved < 6) click(e);
      drag = null;
    }
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', function () { engaged = false; });
    canvas.addEventListener('dblclick', reset);
    canvas.addEventListener('wheel', function (e) {
      // Pinch on a trackpad (Ctrl + wheel) always zooms; a plain wheel only
      // after the visitor has clicked the stage, so it never hijacks the page.
      if (!e.ctrlKey && !engaged) return;
      e.preventDefault();
      distTarget = clampZoom(distTarget * (1 + e.deltaY * 0.0015));
      wake();
    }, { passive: false });
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function click(e) {
      if (!current || !current.onClick) return;
      var r = canvas.getBoundingClientRect();
      ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.intersectObject(current.obj, true).length) { current.onClick(); wake(); }
    }
    function clampZoom(d) { return Math.max(ZOOM.min, Math.min(ZOOM.max, d)); }
    function turn(dir) { rotY += dir * Math.PI / 4; velY = 0; lastInput = performance.now(); hideHint(); wake(); }
    function reset() { rotY = Math.round(rotY / (Math.PI * 2)) * Math.PI * 2; rotX = 0; velY = 0; distTarget = ZOOM.start; wake(); }
    Array.prototype.forEach.call(root.querySelectorAll('[data-turn]'), function (b) { b.addEventListener('click', function () { turn(Number(b.getAttribute('data-turn'))); }); });
    root.querySelector('[data-reset]').addEventListener('click', reset);
    view.addEventListener('keydown', function (e) {
      var used = true;
      if (e.key === 'ArrowLeft') turn(-1);
      else if (e.key === 'ArrowRight') turn(1);
      else if (e.key === 'ArrowUp') { rotX = Math.max(-0.45, rotX - 0.15); wake(); }
      else if (e.key === 'ArrowDown') { rotX = Math.min(0.45, rotX + 0.15); wake(); }
      else if (e.key === '+' || e.key === '=') { distTarget = clampZoom(distTarget * 0.88); wake(); }
      else if (e.key === '-' || e.key === '_') { distTarget = clampZoom(distTarget * 1.12); wake(); }
      else if (e.key === '0' || e.key === 'Home') reset();
      else if ((e.key === 'Enter' || e.key === ' ') && current && current.onClick) { current.onClick(); wake(); }
      else used = false;
      if (used) e.preventDefault();
    });

    // "Drag to spin", shown once.
    var hintTimer = 0;
    function showHint() {
      var seen = false;
      try { seen = localStorage.getItem('stage-hint') === '1'; } catch (err) {}
      if (seen) return;
      hint.textContent = reduce ? 'Use the arrows to turn it' : 'Drag to spin';
      hint.classList.remove('is-gone');
      hintTimer = setTimeout(hideHint, 6000);
    }
    function hideHint() {
      clearTimeout(hintTimer);
      if (hint.classList.contains('is-gone')) return;
      hint.classList.add('is-gone');
      try { localStorage.setItem('stage-hint', '1'); } catch (err) {}
    }

    /* ---------- The loop: only while the stage is on screen ---------- */
    var onScreen = true, running = false, last = 0, clock = 0;
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) wake();
    }, { rootMargin: '100px 0px' }).observe(view);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
    function size() {
      var w = view.clientWidth, h = view.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 600 ? 36 : 30;
      camera.updateProjectionMatrix();
      wake();
    }
    window.addEventListener('resize', size);
    function wake() { if (!running && onScreen && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      var busy = false;
      // Momentum, then a slow turn of its own when nobody is touching it.
      if (!drag) {
        if (Math.abs(velY) > 0.0004) { rotY += velY; velY *= Math.pow(0.9, dt * 60); busy = true; }
        else if (!reduce && now - lastInput > IDLE_MS) { rotY += AUTO_SPIN * dt; busy = true; }
      }
      spinner.rotation.y += (rotY - spinner.rotation.y) * Math.min(1, dt * (reduce ? 60 : 10));
      spinner.rotation.x += (rotX - spinner.rotation.x) * Math.min(1, dt * 10);
      if (Math.abs(rotY - spinner.rotation.y) > 0.001) busy = true;
      dist += (distTarget - dist) * Math.min(1, dt * 8);
      if (Math.abs(distTarget - dist) > 0.001) busy = true;
      holder.position.y = 1.15 + (reduce ? 0 : Math.sin(clock * 1.3) * 0.035);
      if (!reduce) busy = true;
      // Swaps.
      if (current && current.in < 1) {
        current.in = Math.min(1, current.in + dt * 1000 / SWAP_MS);
        var e = ease(current.in);
        current.obj.position.y = -0.55 * (1 - e);
        current.obj.scale.setScalar(0.9 + 0.1 * e);
        fade(current, e);
        busy = true;
      }
      leaving = leaving.filter(function (o) {
        o.out = reduce ? 1 : Math.min(1, o.out + dt * 1000 / (SWAP_MS * 0.8));
        o.obj.position.y = -0.55 * ease(o.out);
        fade(o, 1 - o.out);
        if (o.out >= 1) { spinner.remove(o.obj); dispose(o); return false; }
        busy = true;
        return true;
      });
      if (current && current.update) { current.update(dt); busy = true; }
      camera.position.set(0, 1.45 + (dist - ZOOM.start) * 0.08, dist);
      camera.lookAt(LOOK);
      renderer.render(scene, camera);
      if (busy && onScreen && !document.hidden) requestAnimationFrame(frame);
      else running = false;
    }
    size();
    return { show: show };
  }
})();
