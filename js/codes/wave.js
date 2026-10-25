// Wave: converted from aiyanaAssignment3.js (canvas-sketch) to run in the browser.
// The drawing is unchanged. The original listened for keys on the whole document;
// here the word comes from a text input on the page (Enter clears it, as before).
// cycleTime can be changed from the page without the morph jumping, and a word
// too wide for the 200px font is drawn just small enough to fit.

export const dimensions = [1080, 1080];

// blob shape radius
const blobRadius = 180;
const fontWeight = '900';
const fontSize = 200;
const fontFamily = 'Helvetica';

export function create({ dimensions: [width, height] } = {}) {
  // editable word
  let word = 'WAVE';

  // globals
  let textPoints = [];
  let blobPoints = [];
  let needsUpdate = true;

  // time for 1 full morph cycle
  let cycleTime = 8;
  let phase = 0;   // 0–1 through the cycle, so changing cycleTime never jumps

  // text into cloud points
  function getTextPoints(text) {
    const temp = document.createElement('canvas');
    temp.width = width;
    temp.height = height;
    const tctx = temp.getContext('2d', { willReadFrequently: true });

    // 200px, unless the word would run off the canvas
    let size = fontSize;
    tctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    const measured = tctx.measureText(text).width;
    if (measured > width * 0.92) size = Math.floor(fontSize * (width * 0.92) / measured);

    tctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    tctx.textAlign = 'center';
    tctx.textBaseline = 'middle';
    tctx.fillStyle = 'white';
    tctx.fillText(text, width / 2, height / 2);

    const img = tctx.getImageData(0, 0, width, height).data;
    const pts = [];

    // sample pixels
    for (let y = 0; y < height; y += 6) {
      for (let x = 0; x < width; x += 6) {
        const a = img[(y * width + x) * 4 + 3];
        if (a > 50) pts.push({ x, y });
      }
    }

    return pts;
  }

  // circles
  function drawDot(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // blob with matching point count
  function rebuildBlob() {
    const cx = width / 2;
    const cy = height / 2;

    blobPoints = textPoints.map((_, i) => {
      const angle = (i / textPoints.length) * Math.PI * 2;
      return {
        x: cx + Math.cos(angle) * blobRadius,
        y: cy + Math.sin(angle) * blobRadius
      };
    });
  }

  function render({ context, deltaTime }) {
    // if the word changed → rebuild shapes
    if (needsUpdate) {
      textPoints = getTextPoints(word);
      rebuildBlob();
      needsUpdate = false;
    }

    // background
    context.fillStyle = '#0a0f18';
    context.fillRect(0, 0, width, height);

    // morph progress
    phase = (phase + deltaTime / cycleTime) % 1;
    const t = phase;

    let morph = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5;
    morph = Math.pow(morph, 2.3);

    // draw points
    context.fillStyle = '#6dd5f7';

    for (let i = 0; i < textPoints.length; i++) {
      const a = textPoints[i];
      const b = blobPoints[i];

      const x = a.x * (1 - morph) + b.x * morph;
      const y = a.y * (1 - morph) + b.y * morph;

      drawDot(context, x, y, 3.2);
    }
  }

  return {
    render,
    setWord(value) { word = value; needsUpdate = true; },
    get word() { return word; },
    setCycleTime(value) { cycleTime = value; },
    setPhase(value) { phase = value; }
  };
}
