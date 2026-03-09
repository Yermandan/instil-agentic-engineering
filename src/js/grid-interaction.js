/**
 * Subtle interactive grid overlay - responds to cursor movement
 * Enhances the existing background grid with minimal visual activation
 */

export function initGridInteraction() {
  const canvas = document.createElement('canvas');
  canvas.id = 'interactive-grid';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = canvas.width = window.innerWidth * window.devicePixelRatio;
  let height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  let mouse = { x: -9999, y: -9999 };
  const cellSize = 60; // Match existing grid
  const grid = [];

  // Detect theme
  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function initGrid() {
    grid.length = 0;
    const cols = Math.ceil(window.innerWidth / cellSize) + 1;
    const rows = Math.ceil(window.innerHeight / cellSize) + 1;
    
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        grid.push({
          x: col * cellSize,
          y: row * cellSize,
          alpha: 0,
          fading: false,
          lastTouched: 0,
        });
      }
    }
  }

  function getCellsNearMouse(mx, my, radius = cellSize * 1.5) {
    return grid.filter(cell => {
      const dx = (cell.x + cellSize / 2) - mx;
      const dy = (cell.y + cellSize / 2) - my;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initGrid();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const nearbyCells = getCellsNearMouse(mouse.x, mouse.y);
    const now = Date.now();
    
    nearbyCells.forEach(cell => {
      if (cell.alpha < 0.23) {
        cell.alpha = Math.min(0.23, cell.alpha + 0.23);
        cell.lastTouched = now;
        cell.fading = false;
      }
    });
  });

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const now = Date.now();
    const dark = isDarkTheme();

    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];

      // Start fading after 400ms
      if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 400) {
        cell.fading = true;
      }

      if (cell.fading) {
        cell.alpha -= 0.008;
        if (cell.alpha <= 0) {
          cell.alpha = 0;
          cell.fading = false;
        }
      }

      if (cell.alpha > 0) {
        // Grid reveal effect - visible only through interaction
        const color = dark 
          ? `rgba(255, 255, 255, ${cell.alpha * 0.25})` 
          : `rgba(0, 0, 0, ${cell.alpha * 0.15})`;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, cellSize - 1, cellSize - 1);
      }
    }

    requestAnimationFrame(animate);
  }

  initGrid();
  animate();
}
