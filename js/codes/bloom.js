// Bloom: converted from movingelements.js (canvas-sketch) to run in the browser.
// The drawing is unchanged. The original read a `mouse` value canvas-sketch never
// provides, so the petals never changed; here the pointer's horizontal position
// (or a touch drag) feeds the same formula: petalCount = 4 + floor(x * 8).
// gridSize can be changed from the page.

export const dimensions = [2048, 2048];

export function create() {
  let petalCount = 8;
  let gridSize = 40;
  let onPetals = null;

  function render({ context, width, height, time, pointer }) {
    // Background
    context.fillStyle = '#0f0f1e';
    context.fillRect(0, 0, width, height);

    const cellSize = width / gridSize;
    const centerX = width / 2;
    const centerY = height / 2;

    // Mouse control: changes petal count
    if (pointer.inside) {
      const mouseX = Math.min(0.999, Math.max(0, pointer.x / width));
      const next = 4 + Math.floor(mouseX * 8);
      if (next !== petalCount) {
        petalCount = next;
        if (onPetals) onPetals(petalCount);
      }
    }

    // Floral colors
    const colors = [
      '#ff6b9d', '#c44569', '#f8b500', '#6c5ce7',
      '#a29bfe', '#00b894', '#55efc4', '#fd79a8'
    ];

    // Animation cycle: 0-3s form flower, 3-6s return to grid
    const cycleTime = time % 6;
    let progress = cycleTime < 3 ? cycleTime / 3 : 1 - ((cycleTime - 3) / 3);

    // Smooth animation
    progress = progress * progress * (3 - 2 * progress);

    // Draw grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Original position
        const origX = col * cellSize + cellSize / 2;
        const origY = row * cellSize + cellSize / 2;

        // Angle from center
        const dx = origX - centerX;
        const dy = origY - centerY;
        const angle = Math.atan2(dy, dx);

        // Flower petal pattern
        const petalWave = Math.sin(angle * petalCount);
        const petalDist = 200 + petalWave * 150;

        // Flower position
        const flowerX = centerX + Math.cos(angle) * petalDist * progress;
        const flowerY = centerY + Math.sin(angle) * petalDist * progress;

        // Speed variation
        const speedVar = (row + col) % 3;
        const adjProgress = progress * (0.9 + speedVar * 0.05);

        // Current position
        const x = origX + (flowerX - origX) * adjProgress;
        const y = origY + (flowerY - origY) * adjProgress;

        // Color
        const colorIndex = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * colors.length) % colors.length;

        // Draw square with transformations
        context.save();
        context.translate(x, y);
        context.rotate(angle * adjProgress * (0.2 + (row % 3) * 0.1));

        // Scale
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        const scale = 0.6 + (1 - dist / maxDist * 0.3) * 0.4;
        context.scale(scale, scale);

        // Draw
        const size = cellSize * 0.7;
        context.fillStyle = colors[colorIndex];
        context.globalAlpha = 0.9;
        context.fillRect(-size / 2, -size / 2, size, size);
        context.restore();
      }
    }

    context.globalAlpha = 1;
  }

  return {
    render,
    setGridSize(value) { gridSize = value; },
    onPetals(fn) { onPetals = fn; },
    get petalCount() { return petalCount; }
  };
}
