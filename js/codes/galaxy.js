/* FINAL PROJECT · Galaxy to Sun
   Converted from assignment4.js (canvas-sketch) to run in the browser.
   Group project: Pratha led the concept and visual direction, Riva built the
   galaxy, and Aiyana built the solar system (orbital motion, planet spacing
   and procedural planet textures).

   What changed for the browser, without changing the look:
   - The galaxy never moves; only the purple dust shimmers, because its alpha
     was re-rolled with Math.random for every dot, every frame (100,000 dots).
     Now the still layers (black, fog, blue arms) are drawn once to an
     off-screen canvas, and the purple dust is drawn into three versions with
     different random alphas, cycled one per frame: the same shimmer, at the
     cost of two image draws a frame. Dots are still filled one by one in
     that one-time pass, so overlapping dots brighten the core as before.
   - Clicks are listened for on the canvas only (the page calls enter()),
     and back() returns to the galaxy so the warp can be replayed.
   - Time comes from the runner, so pausing really pauses; the warp's
     per-frame step is scaled by the frame time (identical at 60fps).
   - Planet textures are made once, while the galaxy is showing; Saturn's
     ring pattern is made once instead of every frame.
   - Orbit lines can be hidden from the page. */

export const dimensions = [2560, 1440];

// galaxy constants
const blueDust = 40000;
const purpleRingCount = 20000;
const extraScatterCount = 40000;

const arms = 4;
const spiralTwist = 22;
const armTightness = 0.15;

const solarScale = 1.6;

// how many shimmer frames are pre-drawn for the purple dust
const SHIMMER_FRAMES = 3;

// utilities
function createCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  return c;
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function lerp(a,b,t){ return a + (b-a)*t; }
function lerpColorHex(aHex, bHex, t){
  const A = hexToRgb(aHex), B = hexToRgb(bHex);
  return `rgb(${Math.round(lerp(A.r,B.r,t))}, ${Math.round(lerp(A.g,B.g,t))}, ${Math.round(lerp(A.b,B.b,t))})`;
}

// mercury
function createDetailedRock(size=512, warm=false){
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");

  const baseA = warm ? "#8A5A44" : "#7C7A70";
  const baseB = warm ? "#C79A84" : "#BDB6A8";
  const grad = ctx.createLinearGradient(0,0,0,size);
  grad.addColorStop(0, baseA); grad.addColorStop(1, baseB);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,size,size);

  ctx.globalAlpha = 0.65;
  for (let i=0; i<24; i++){
    const y = (i / 24) * size + (Math.sin(i * 0.9 + Math.random()*2) * size * 0.02);
    const h = 6 + Math.abs(Math.sin(i*0.6 + Math.random()) * 10);
    ctx.fillStyle = lerpColorHex(baseA, baseB, i / 24);
    ctx.fillRect(0, y, size, h);
  }
  ctx.globalAlpha = 1;

  for (let k=0;k<60;k++){
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rr = (2 + Math.random()*40);
    const g = ctx.createRadialGradient(cx,cy,rr*0.02,cx,cy,rr);
    g.addColorStop(0, "rgba(255,255,255,0.06)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx-rr, cy-rr, rr*2, rr*2);
  }

  const rim = ctx.createRadialGradient(size*0.45,size*0.45,size*0.01,size*0.5,size*0.5,size*0.95);
  rim.addColorStop(0, "rgba(255,255,255,0)");
  rim.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = rim;
  ctx.fillRect(0,0,size,size);

  return c;
}

// venus
function createVenusClouds(size=768){
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");

  const g0 = ctx.createLinearGradient(0,0,0,size);
  g0.addColorStop(0, "#F6E6BA");
  g0.addColorStop(1, "#DDB46A");
  ctx.fillStyle = g0;
  ctx.fillRect(0,0,size,size);

  ctx.globalAlpha = 0.9;
  for (let i=0; i<300; i++){
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rr = (10 + Math.random()*size*0.08);
    const ang = Math.random() * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang + Math.sin(cx*0.01)*0.2);
    const gr = ctx.createLinearGradient(-rr, 0, rr, 0);
    gr.addColorStop(0, "rgba(255,255,255,0.02)");
    gr.addColorStop(0.5, "rgba(255,255,255,0.12)");
    gr.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.fillStyle = gr;
    ctx.fillRect(-rr, -rr*0.12, rr*2, rr*0.24);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.12;
  for (let i=0;i<200;i++){
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rr = (10 + Math.random()*size*0.08);
    const gr = ctx.createRadialGradient(cx,cy,rr*0.05,cx,cy,rr);
    gr.addColorStop(0, "rgba(255,255,240,0.6)");
    gr.addColorStop(1, "rgba(255,255,240,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(cx-rr, cy-rr, rr*2, rr*2);
  }
  ctx.globalAlpha = 1;

  const rim = ctx.createRadialGradient(size*0.45,size*0.4,size*0.01,size*0.5,size*0.5,size*0.9);
  rim.addColorStop(0,"rgba(0,0,0,0)");
  rim.addColorStop(1,"rgba(0,0,0,0.28)");
  ctx.fillStyle = rim;
  ctx.fillRect(0,0,size,size);

  return c;
}

// earth
function createEarthBase(size=1024){
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");

  const og = ctx.createLinearGradient(0,0,0,size);
  og.addColorStop(0, "#2b6fb7");
  og.addColorStop(1, "#184e7a");
  ctx.fillStyle = og;
  ctx.fillRect(0,0,size,size);

  for (let i=0; i<800; i++){
    const x = Math.random()*size, y = Math.random()*size;
    const rx = (10 + Math.random()*130);
    const ry = rx*(0.3 + Math.random()*1.6);
    const ang = Math.random()*Math.PI*2;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);
    ctx.fillStyle = `rgba(${40 + Math.round(Math.random()*80)}, ${100 + Math.round(Math.random()*100)}, ${50 + Math.round(Math.random()*80)}, ${0.65 + Math.random()*0.25})`;
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0,0,size,size);
  ctx.globalCompositeOperation = "source-over";

  const cloud = createCanvas(size, size);
  const cc = cloud.getContext("2d");
  for (let i=0; i<350; i++){
    const x = Math.random()*size, y = Math.random()*size;
    const r = (10 + Math.random()*120);
    const gr = cc.createRadialGradient(x,y,r*0.05,x,y,r);
    gr.addColorStop(0,"rgba(255,255,255,0.95)");
    gr.addColorStop(1,"rgba(255,255,255,0)");
    cc.fillStyle = gr;
    cc.fillRect(x-r, y-r, r*2, r*2);
  }

  const temp = createCanvas(size*0.25, size*0.25);
  const tc = temp.getContext("2d");
  tc.drawImage(cloud, 0,0, temp.width, temp.height);
  cc.clearRect(0,0,size,size);
  cc.drawImage(temp, 0,0, temp.width, temp.height, 0,0, size, size);

  return { base: c, clouds: cloud };
}

// jupiter
function createGasGiant(size=1024){
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");

  const palette = ["#F0E1C9","#D9B38A","#C78153","#9C5A39","#F3E9D9"];
  for (let y=0; y<size; y++){
    const t = y / size;
    const bandIndex = Math.floor(t * (palette.length - 0.0001));
    const wobble = Math.sin(t * Math.PI * 12 + Math.random()*3) * (size * 0.006);
    ctx.fillStyle = palette[bandIndex];
    ctx.fillRect(0, y + wobble, size, 1.5 + Math.abs(Math.sin(t*50))*0.8);
  }

  const tmp = createCanvas(Math.max(4, Math.floor(size*0.995)), size);
  const tc = tmp.getContext("2d");
  tc.drawImage(c, 0, 0, tmp.width, tmp.height);
  ctx.clearRect(0,0,size,size);
  ctx.drawImage(tmp, 0,0, tmp.width, tmp.height, 0,0, size, size);

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.12;
  for (let s=0; s<7; s++){
    const cx = Math.random() * size * 0.9 + size*0.05;
    const cy = Math.random() * size * 0.9 + size*0.05;
    const rx = size * (0.06 + Math.random()*0.12);
    const ry = rx * (0.4 + Math.random()*1.2);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random()*0.8, 0, Math.PI*2);
    const gr = ctx.createLinearGradient(cx-rx, cy-ry, cx+rx, cy+ry);
    gr.addColorStop(0, "rgba(200,80,50,0.6)");
    gr.addColorStop(1, "rgba(255,190,140,0.02)");
    ctx.fillStyle = gr;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  const rim = ctx.createRadialGradient(size*0.45,size*0.48,size*0.02,size*0.5,size*0.52,size*0.9);
  rim.addColorStop(0,"rgba(255,255,255,0)");
  rim.addColorStop(1,"rgba(0,0,0,0.2)");
  ctx.fillStyle=rim;
  ctx.fillRect(0,0,size,size);

  return c;
}

// saturn
function createSaturnRings(width=2000, height=420){
  const c = createCanvas(width, height);
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,width,height);

  for (let i=0;i<height;i++){
    const alpha = 0.04 + Math.abs(Math.sin(i/height * Math.PI * 12)) * 0.24 * (0.6 + Math.random()*0.8);
    const shade = 180 + Math.floor(Math.random()*60);
    ctx.fillStyle = `rgba(${shade},${shade-10},${Math.min(255,shade+20)},${alpha})`;
    ctx.fillRect(0, i, width, 1);
  }

  ctx.globalCompositeOperation = "destination-out";
  for (let g=0; g<12; g++){
    const gy = Math.round((0.08 + g*0.07 + Math.sin(g*1.3)*0.01) * height + Math.random()*10);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, gy, width, Math.max(2, Math.round((0.002 + Math.random()*0.02) * height)));
  }
  ctx.globalCompositeOperation = "source-over";

  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,width,height);
  ctx.globalAlpha = 1;

  return c;
}

// uranus
function createIceGiant(size=640, bluish=true){
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");
  const a = bluish ? "#8FD6EA" : "#9AD7E5";
  const b = bluish ? "#1E87A8" : "#5FBEDC";
  const g = ctx.createLinearGradient(0,0,0,size);
  g.addColorStop(0,a);
  g.addColorStop(1,b);
  ctx.fillStyle = g;
  ctx.fillRect(0,0,size,size);

  ctx.globalAlpha = 0.12;
  for (let i=0;i<120;i++){
    const y = (i / 120) * size + Math.sin(i*0.3+Math.random()*2)*4;
    const h = 1 + Math.abs(Math.sin(i*0.15 + Math.random()*2))*2;
    ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random()*0.06})`;
    ctx.fillRect(0, y, size, h);
  }
  ctx.globalAlpha = 1;

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.06;
  for (let s=0;s<40;s++){
    const cx = Math.random()*size, cy = Math.random()*size, rr = (0.02 + Math.random()*0.08)*size;
    const gr = ctx.createRadialGradient(cx,cy,rr*0.05,cx,cy,rr);
    gr.addColorStop(0,"rgba(255,255,255,0.8)");
    gr.addColorStop(1,"rgba(255,255,255,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(cx-rr,cy-rr,rr*2,rr*2);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  const rim = ctx.createRadialGradient(size*0.45,size*0.45,size*0.02,size*0.5,size*0.5,size*0.9);
  rim.addColorStop(0,"rgba(255,255,255,0)");
  rim.addColorStop(1,"rgba(0,0,0,0.16)");
  ctx.fillStyle=rim;
  ctx.fillRect(0,0,size,size);

  return c;
}

// draw planet
function drawPlanetFromTexture(ctx, cx, cy, r, textureCanvas, opts = {}) {
  const options = Object.assign({
    rotation: 0,
    atmosphere: true,
    atmosphereColor: "rgba(255,255,255,0.08)",
    rimHighlight: true,
    shadowIntensity: 0.5,
    specular: 0.18,
    cloudLayer: null,
    cloudRotation: 0
  }, opts);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.clip();

  try {
    ctx.save();
    ctx.translate(cx - r, cy - r);
    if (options.rotation) {
      ctx.translate(r, r);
      ctx.rotate(options.rotation);
      ctx.drawImage(textureCanvas, -r, -r, r*2, r*2);
      ctx.rotate(-options.rotation);
      ctx.translate(-r, -r);
    } else {
      ctx.drawImage(textureCanvas, 0, 0, r*2, r*2);
    }
    ctx.restore();
  } catch {}

  if (options.cloudLayer) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.translate(cx, cy);
    ctx.rotate(options.cloudRotation);
    ctx.drawImage(options.cloudLayer, -r, -r, r*2, r*2);
    ctx.restore();
  }

  const sh = ctx.createRadialGradient(cx - r*0.45, cy - r*0.6, r*0.02, cx, cy, r*1.3);
  sh.addColorStop(0, `rgba(255,255,255,${options.specular})`);
  sh.addColorStop(0.6, `rgba(0,0,0,0)`);
  sh.addColorStop(1, `rgba(0,0,0,${options.shadowIntensity})`);
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = sh;
  ctx.fillRect(cx - r, cy - r, r*2, r*2);
  ctx.globalCompositeOperation = "source-over";

  if (options.rimHighlight) {
    const rim = ctx.createRadialGradient(cx - r*0.28, cy - r*0.12, r*0.02, cx, cy, r*1.2);
    rim.addColorStop(0,"rgba(255,255,240,0.12)");
    rim.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = rim;
    ctx.fillRect(cx - r, cy - r, r*2, r*2);
  }

  if (options.atmosphere) {
    ctx.globalCompositeOperation = "lighter";
    const ag = ctx.createRadialGradient(cx, cy, r*0.85, cx, cy, r*1.55);
    ag.addColorStop(0, "rgba(255,255,255,0)");
    ag.addColorStop(0.6, options.atmosphereColor);
    ag.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ag;
    ctx.fillRect(cx - r*1.6, cy - r*1.6, r*3.2, r*3.2);
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.restore();
}

// drawings (the ring pattern is made once and passed in)
function drawRings(ctx, cx, cy, r, ringPattern, tilt=0.34, rotate=0, inner=1.3, outer=2.1){
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotate);
  ctx.scale(1, tilt);

  const outerR = r * outer;
  const innerR = r * inner;

  ctx.fillStyle = ringPattern;
  ctx.beginPath();
  ctx.ellipse(0,0,outerR,outerR,0,0,Math.PI*2);
  ctx.fill();

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.ellipse(0,0,innerR,innerR,0,0,Math.PI*2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  ctx.globalAlpha = 0.24;
  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.beginPath();
  ctx.ellipse(0, r*0.06, r*0.9, r*0.22, 0, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
  ctx.globalAlpha = 1;
}

export function create({ canvas, dimensions: [W, H] }) {
  // mode
  let currentScreen = "galaxy";
  let warpProgress = 0;
  let showOrbits = true;
  let solarClock = 0;       // seconds spent in the solar system
  let onScreen = null;

  // galaxy particle arrays
  const blue = [];
  const purple = [];
  const extraScatter = [];

  // generate galaxy data
  function generateGalaxyData() {
    for (let i = 0; i < blueDust; i++) {
      let radius = Math.pow(Math.random(), 1.3);
      let angle = Math.random() * Math.PI * 2;

      angle += radius * spiralTwist;

      const arm = Math.floor(Math.random() * arms);
      const armAngle = (arm / arms) * Math.PI * 2;
      angle = armAngle + (angle - armAngle) * (1 - armTightness);

      blue.push({ radius, angle });
    }

    for (let i = 0; i < purpleRingCount; i++) {
      purple.push({
        radius: 0.45 + Math.random() * 0.45,
        angle: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < extraScatterCount; i++) {
      extraScatter.push({
        radius: 0.9 + Math.random() * 2.0,
        angle: Math.random() * Math.PI * 2
      });
    }
  }
  generateGalaxyData();

  /* ---- The galaxy, pre-drawn ----
     still:   black, fog and the blue arms (drawn on top in the original, so
              it's kept as its own layer above the purple dust)
     dust[i]: black + fog + purple dust with one set of random alphas each */
  const layers = { w: 0, h: 0, base: null, blue: null, dust: [], next: 0 };

  function layerCanvas(scale) {
    const c = createCanvas(layers.w, layers.h);
    const ctx = c.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    return { c, ctx };
  }

  function drawBase(context, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.6;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);

    const fog = context.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.5);
    fog.addColorStop(0, "#3250B440");
    fog.addColorStop(1, "#00000000");
    context.fillStyle = fog;
    context.beginPath();
    context.arc(cx, cy, maxR * 1.5, 0, Math.PI * 2);
    context.fill();
  }

  // One dot at a time (so overlaps add up as in the original), without save/restore.
  function dot(context, x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
  }

  function drawDust(context, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.6;
    context.fillStyle = "#C850FF";

    for (let p of extraScatter) {
      const r = p.radius * maxR;
      const x = cx + Math.cos(p.angle) * r * 1.8;
      const y = cy + Math.sin(p.angle) * r * 0.65;

      const fade = Math.max(0, 1 - (p.radius - 1.0) * 0.55);
      const alpha = (0.25 + Math.random() * 0.2) * fade;

      if (alpha > 0.02) {
        context.globalAlpha = alpha;
        dot(context, x, y, 1.1);
      }
    }

    for (let p of purple) {
      const r = p.radius * maxR * 1.3;
      const x = cx + Math.cos(p.angle) * r * 1.8;
      const y = cy + Math.sin(p.angle) * r * 0.65;
      context.globalAlpha = 0.25 + Math.random() * 0.2;
      dot(context, x, y, 1.1);
    }
    context.globalAlpha = 1;
  }

  function drawBlue(context, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.6;

    for (let p of blue) {
      const r = p.radius * maxR;
      const x = cx + Math.cos(p.angle) * r * 1.8 - 8;
      const y = cy + Math.sin(p.angle) * r * 0.65 - 9;

      const t = p.radius;
      let color = "#F0F5FF";
      if (t >= 0.2 && t < 0.6) color = "#96B4FF";
      else if (t >= 0.6) color = "#5A82FF";

      context.globalAlpha = (1 - t) * 0.9;
      context.fillStyle = color;
      dot(context, x, y, 1);
    }
    context.globalAlpha = 1;
  }

  function ensureLayers(scale) {
    if (layers.w === canvas.width && layers.h === canvas.height && layers.blue) return;
    layers.w = canvas.width;
    layers.h = canvas.height;
    layers.dust = [];
    const b = layerCanvas(scale);
    drawBlue(b.ctx, W, H);
    layers.blue = b.c;
    addDustFrame(scale);
  }
  function addDustFrame(scale) {
    const d = layerCanvas(scale);
    drawBase(d.ctx, W, H);
    drawDust(d.ctx, W, H);
    layers.dust.push(d.c);
  }

  // draw galaxy: the pre-drawn layers, next shimmer frame each time
  function drawGalaxy(context, scale) {
    ensureLayers(scale);
    // the other shimmer frames are drawn when the browser is idle, so nothing stalls
    if (layers.dust.length < SHIMMER_FRAMES && !layers.pending) {
      layers.pending = true;
      const size = layers.w;
      idle(() => { layers.pending = false; if (layers.w === size) addDustFrame(scale); });
    }
    layers.next = (layers.next + 1) % layers.dust.length;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(layers.dust[layers.next], 0, 0);
    context.drawImage(layers.blue, 0, 0);
    context.restore();
  }

  // starfield
  const stars = [];
  const starCount = 300;

  function generateStarData(width, height){
    stars.length = 0;
    for(let i=0; i<starCount; i++){
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.6 + Math.random() * 1.4,
        alpha: 0.2 + Math.random() * 0.7
      });
    }
  }

  // texture variables
  let mercuryTex, venusTex, earthBaseTex, earthCloudTex, marsTex, jupiterTex, saturnRingsTex, uranusTex, neptuneTex;
  let ringPattern = null;

  // ensure textures
  function ensureTextures() {
    if (!mercuryTex) mercuryTex = createDetailedRock(512, false);
    if (!venusTex) venusTex = createVenusClouds(768);
    if (!earthBaseTex) {
      const e = createEarthBase(1024);
      earthBaseTex = e.base;
      earthCloudTex = e.clouds;
    }
    if (!marsTex) marsTex = createDetailedRock(512, true);
    if (!jupiterTex) jupiterTex = createGasGiant(1024);
    if (!saturnRingsTex) saturnRingsTex = createSaturnRings(2000, 420);
    if (!uranusTex) uranusTex = createIceGiant(640, false);
    if (!neptuneTex) neptuneTex = createIceGiant(640, true);
  }
  // Make the textures while the galaxy is on screen, a little at a time.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  idle(() => ensureTextures());

  // draw solar system
  function drawSolarSystem(ctx, width, height){
    ensureTextures();
    if (stars.length === 0) generateStarData(width, height);
    if (!ringPattern) ringPattern = ctx.createPattern(saturnRingsTex, "repeat");

    const cx = width/2, cy = height/2;

    ctx.fillStyle = "#020215";
    ctx.fillRect(0,0,width,height);

    // twinkle: was performance.now() * 0.0005 (ms), now the sketch's own clock
    const twinkle = (solarClock + 120) * 1000 * 0.0005;
    ctx.fillStyle = "#F0F5FF";
    for(let s of stars){
      ctx.globalAlpha = s.alpha * 0.5 + Math.sin(twinkle * s.alpha) * 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const sunR = 40 * solarScale;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR*1.8);
    g.addColorStop(0,"#FFF2C0");
    g.addColorStop(0.5,"#FFDB77");
    g.addColorStop(1,"rgba(255,160,60,0)");
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.arc(cx,cy,sunR*1.8,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#FFDD77";
    ctx.beginPath();
    ctx.arc(cx,cy,sunR,0,Math.PI*2);
    ctx.fill();

    const tilt = 0.45;
    // was performance.now() * 0.00015; the +120 s starts the planets spread out, as a page open for a while would
    const time = (solarClock + 120) * 1000 * 0.00015;

    const planets = [
      { name: "Mercury", distance: 160, radius: 10, speed: 4.8, texture: mercuryTex, clouds: null },
      { name: "Venus",   distance: 220, radius: 20, speed: 3.5, texture: venusTex, clouds: null },
      { name: "Earth",   distance: 280, radius: 22, speed: 3.0, texture: earthBaseTex, clouds: earthCloudTex },
      { name: "Mars",    distance: 340, radius: 15, speed: 2.4, texture: marsTex, clouds: null },
      { name: "Jupiter", distance: 430, radius: 45, speed: 1.3, texture: jupiterTex, clouds: null },
      { name: "Saturn",  distance: 520, radius: 40, speed: 1.0, texture: jupiterTex, clouds: null, rings: ringPattern },
      { name: "Uranus",  distance: 600, radius: 30, speed: 0.7, texture: uranusTex, clouds: null },
      { name: "Neptune", distance: 680, radius: 28, speed: 0.6, texture: neptuneTex, clouds: null }
    ];

    ctx.strokeStyle = "#8C8CFF40";
    ctx.lineWidth = 1.1;

    for (let p of planets) {
      if (showOrbits) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.distance * solarScale, p.distance * tilt * solarScale, 0, 0, Math.PI*2);
        ctx.stroke();
      }

      const angle = time * p.speed;
      const px = cx + Math.cos(angle) * p.distance * solarScale;
      const py = cy + Math.sin(angle) * p.distance * tilt * solarScale;
      const r = p.radius * solarScale;

      if (p.name === "Mercury") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.18, atmosphere:false, rimHighlight:true, shadowIntensity:0.48, specular:0.10 });
      } else if (p.name === "Venus") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.02, atmosphere:true, atmosphereColor:"rgba(255,230,140,0.12)", rimHighlight:false, shadowIntensity:0.5, specular:0.06 });
      } else if (p.name === "Earth") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.12, atmosphere:true, atmosphereColor:"rgba(120,190,255,0.14)", rimHighlight:true, shadowIntensity:0.36, specular:0.26, cloudLayer: p.clouds, cloudRotation: angle*0.28 });
      } else if (p.name === "Mars") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.14, atmosphere:true, atmosphereColor:"rgba(255,120,80,0.06)", rimHighlight:true, shadowIntensity:0.5, specular:0.07 });
      } else if (p.name === "Jupiter") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.06, atmosphere:true, atmosphereColor:"rgba(255,200,140,0.06)", rimHighlight:true, shadowIntensity:0.52, specular:0.12 });
      } else if (p.name === "Saturn") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.06, atmosphere:true, atmosphereColor:"rgba(255,230,200,0.06)", rimHighlight:true, shadowIntensity:0.48, specular:0.12 });
        drawRings(ctx, px, py, r, p.rings, 0.34, angle*0.22, 1.6, 2.05);
      } else if (p.name === "Uranus") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.04, atmosphere:true, atmosphereColor:"rgba(160,230,255,0.06)", rimHighlight:false, shadowIntensity:0.46, specular:0.08 });
      } else if (p.name === "Neptune") {
        drawPlanetFromTexture(ctx, px, py, r, p.texture, { rotation: angle*0.08, atmosphere:true, atmosphereColor:"rgba(100,180,255,0.08)", rimHighlight:true, shadowIntensity:0.58, specular:0.12 });
      }
    }
  }

  // text
  function drawGalaxyPrompt(ctx, width, height, time) {
    // was performance.now() * 0.003 (ms)
    const pulse = 0.6 + Math.sin(time * 1000 * 0.003) * 0.3;

    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = "#EAF0FF";
    ctx.font = "600 52px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Click to Enter", width / 2, height * 0.78);
    ctx.restore();
  }

  function setScreen(name) {
    currentScreen = name;
    if (onScreen) onScreen(name);
  }

  // main render
  function render({ context, width, height, time, deltaTime, scale }) {
    if (currentScreen === "galaxy") {
      drawGalaxy(context, scale);
      drawGalaxyPrompt(context, width, height, time);
      return;
    }

    if (currentScreen === "warp") {
      drawGalaxy(context, scale);

      // 0.045 per frame at 60fps, whatever the frame rate
      warpProgress += 0.045 * (deltaTime ? deltaTime * 60 : 1);

      context.save();
      context.globalAlpha = Math.min(1, warpProgress);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);
      context.restore();

      if (warpProgress >= 1.2) setScreen("solar");
      return;
    }

    if (currentScreen === "solar") {
      solarClock += deltaTime;
      drawSolarSystem(context, width, height);
      return;
    }
  }

  return {
    render,
    // was: window.addEventListener("click", ...); now called from a click on the canvas or the Enter button
    enter() {
      if (currentScreen === "galaxy") {
        warpProgress = 0;
        setScreen("warp");
      }
    },
    back() { warpProgress = 0; setScreen("galaxy"); },
    showSolar() { ensureTextures(); setScreen("solar"); },
    get screen() { return currentScreen; },
    setOrbits(on) { showOrbits = on; },
    onScreen(fn) { onScreen = fn; }
  };
}
