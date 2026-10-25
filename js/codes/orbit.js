// Orbit: converted from programminggeometric.js (canvas-sketch) to run in the browser.
// The drawing is unchanged. Two additions: the pointer's distance from the centre
// changes how fast time flows (0.5× at the centre, 1.8× at the edge), and a speed
// control multiplies it. Glow (shadowBlur) is scaled with the canvas so it looks
// the same at any size.

export const dimensions = [2048, 2048];

export function create() {
  let speed = 1;      // from the speed slider
  let warp = 1;       // eased towards the pointer's target
  let time = 0;       // the sketch's own clock

  function render({ context, width, height, deltaTime, scale, pointer }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Pointer distance from the centre sets the tempo; it eases back to 1× when it leaves.
    const dist = Math.hypot(pointer.x - centerX, pointer.y - centerY) / (width / 2);
    const target = pointer.inside ? 0.5 + Math.min(1, dist) * 1.3 : 1;
    warp += (target - warp) * Math.min(1, deltaTime * 3);
    time += deltaTime * speed * warp;

    const blur = (b) => b * scale;   // shadowBlur ignores the canvas transform

    // ============================================
    // BACKGROUND
    // ============================================
    // Create a dark gradient background
    const bgGradient = context.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0a0a1a');
    bgGradient.addColorStop(0.5, '#1a0a2a');
    bgGradient.addColorStop(1, '#0a0a1a');
    context.fillStyle = bgGradient;
    context.fillRect(0, 0, width, height);

    // Draw a subtle grid pattern using lines
    context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    context.lineWidth = 1;
    const gridSize = 100;
    for (let x = 0; x < width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    // ============================================
    // CIRCLES - Rotating rings in center
    // ============================================
    // Draw 4 circles that rotate at different speeds
    for (let i = 0; i < 4; i++) {
      const radius = 150 + i * 60;  // Size increases with each circle
      const rotation = time * 0.3 + i * 0.2;  // Each rotates at different speed

      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);

      // Change color for each circle
      const colors = ['#8a2be2', '#ff1493', '#00bfff', '#8a2be2'];
      context.strokeStyle = colors[i];
      context.lineWidth = 4;
      context.shadowBlur = blur(30);
      context.shadowColor = colors[i];

      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.stroke();

      context.restore();
    }

    // ============================================
    // RECTANGLES - Orbiting squares
    // ============================================
    // Draw 6 rectangles that orbit around center and rotate
    for (let i = 0; i < 6; i++) {
      const size = 70;  // Size of rectangle
      const angle = (Math.PI * 2 / 6) * i + time * 0.5;  // Position in orbit
      const distance = 250;  // Distance from center
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      context.save();
      context.translate(x, y);
      context.rotate(time * 1.5 + i);  // Rotation speed

      // Create gradient fill
      const grad = context.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      grad.addColorStop(0, '#ff1493');
      grad.addColorStop(1, '#8a2be2');
      context.fillStyle = grad;
      context.shadowBlur = blur(25);
      context.shadowColor = '#ff1493';

      // Draw rectangle
      context.fillRect(-size / 2, -size / 2, size, size);

      context.restore();
    }

    // ============================================
    // TRIANGLES - Floating triangles
    // ============================================
    // Draw 8 triangles that orbit and pulse in size
    for (let i = 0; i < 8; i++) {
      // Size pulses using sine wave
      const size = 50 + Math.sin(time * 2 + i) * 15;
      const angle = (Math.PI * 2 / 8) * i + time * 0.4;  // Position
      const distance = 350;  // Distance from center
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      context.save();
      context.translate(x, y);
      context.rotate(time * 2 + i);  // Rotation

      // Gradient fill
      const grad = context.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, '#00bfff');
      grad.addColorStop(1, '#8a2be2');
      context.fillStyle = grad;
      context.shadowBlur = blur(20);
      context.shadowColor = '#00bfff';

      // Draw triangle
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(-size * 0.866, size * 0.5);
      context.lineTo(size * 0.866, size * 0.5);
      context.closePath();
      context.fill();

      context.restore();
    }

    // ============================================
    // HEXAGONS - In corners
    // ============================================
    // Draw hexagons in the four corners
    const corners = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.2 },
      { x: width * 0.2, y: height * 0.8 },
      { x: width * 0.8, y: height * 0.8 }
    ];

    corners.forEach((corner, i) => {
      const radius = 80;

      context.save();
      context.translate(corner.x, corner.y);
      context.rotate(time * 0.8 + i);  // Slow rotation

      context.strokeStyle = '#8a2be2';
      context.lineWidth = 5;
      context.shadowBlur = blur(30);
      context.shadowColor = '#8a2be2';

      // Draw hexagon using 6 points
      context.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (Math.PI / 3) * j;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (j === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.stroke();

      context.restore();
    });

    // ============================================
    // SMALL CIRCLES - Orbiting outer edge
    // ============================================
    // Draw 12 small circles that orbit and pulse
    for (let i = 0; i < 12; i++) {
      // Size pulses
      const size = 20 + Math.sin(time * 3 + i) * 8;
      const angle = (Math.PI * 2 / 12) * i + time * 0.6;  // Position
      const distance = 450;  // Far from center
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // Radial gradient for glow effect
      const grad = context.createRadialGradient(x, y, 0, x, y, size);
      grad.addColorStop(0, i % 2 === 0 ? '#ff1493' : '#00bfff');
      grad.addColorStop(1, 'transparent');
      context.fillStyle = grad;
      context.shadowBlur = blur(40);
      context.shadowColor = i % 2 === 0 ? '#ff1493' : '#00bfff';

      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }

    // ============================================
    // STAR - Central focal point
    // ============================================
    // Draw a star in the center that rotates
    context.save();
    context.translate(centerX, centerY);
    context.rotate(time * 0.8);

    // Radial gradient
    const starGrad = context.createRadialGradient(0, 0, 0, 0, 0, 120);
    starGrad.addColorStop(0, '#8a2be2');
    starGrad.addColorStop(0.5, '#ff1493');
    starGrad.addColorStop(1, 'transparent');
    context.fillStyle = starGrad;
    context.shadowBlur = blur(50);
    context.shadowColor = '#8a2be2';

    // Draw 10-pointed star
    context.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i;
      const radius = i % 2 === 0 ? 100 : 50;  // Alternate between outer and inner points
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();

    context.restore();

    // ============================================
    // RECTANGLES - Middle positions
    // ============================================
    // Draw 4 rectangles in middle positions
    const rectPositions = [
      { x: width * 0.15, y: height * 0.5 },
      { x: width * 0.85, y: height * 0.5 },
      { x: width * 0.5, y: height * 0.15 },
      { x: width * 0.5, y: height * 0.85 }
    ];

    rectPositions.forEach((pos, i) => {
      const w = 90;  // Width
      const h = 50;  // Height

      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(time * 0.7 + i);  // Rotation

      // Gradient fill
      const grad = context.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      grad.addColorStop(0, '#00bfff');
      grad.addColorStop(1, '#8a2be2');
      context.fillStyle = grad;
      context.shadowBlur = blur(25);
      context.shadowColor = '#00bfff';

      context.fillRect(-w / 2, -h / 2, w, h);

      context.restore();
    });

    // Reset shadow effects
    context.shadowBlur = 0;
  }

  return {
    render,
    setSpeed(value) { speed = value; },
    get warp() { return warp; }
  };
}
