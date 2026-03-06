/**
 * Subtle sparkle effect for agent pills on hover
 * Adapted from sparkle effect but heavily toned down for premium, technical feel
 */

export function initAgentSparkle() {
  const pills = document.querySelectorAll('.agent-pill');
  
  pills.forEach(pill => {
    // Make pill a positioning context for sparkles
    pill.style.position = 'relative';
    // Don't use overflow:hidden so sparkles can appear outside
    
    // Create subtle gradient overlay (hidden by default)
    const gradientOverlay = document.createElement('span');
    gradientOverlay.className = 'pill-gradient-overlay';
    pill.insertBefore(gradientOverlay, pill.firstChild);
    
    // Create 2 sparkle elements per pill
    const sparkle1 = createSparkle();
    const sparkle2 = createSparkle();
    pill.appendChild(sparkle1);
    pill.appendChild(sparkle2);
    
    // Hide sparkles by default
    sparkle1.style.display = 'none';
    sparkle2.style.display = 'none';
    
    let timeouts = [];
    let intervals = [];
    
    const startSparkle = () => {
      // Show sparkles
      sparkle1.style.display = 'block';
      sparkle2.style.display = 'block';
      
      let delay = 0;
      
      [sparkle1, sparkle2].forEach(sparkle => {
        timeouts.push(setTimeout(() => {
          animateSparkle(sparkle);
          intervals.push(setInterval(() => animateSparkle(sparkle), 2000));
        }, delay));
        delay += 400;
      });
    };
    
    const stopSparkle = () => {
      // Clear all timers
      timeouts.forEach(t => clearTimeout(t));
      intervals.forEach(i => clearInterval(i));
      timeouts = [];
      intervals = [];
      
      // Hide sparkles immediately
      sparkle1.style.display = 'none';
      sparkle2.style.display = 'none';
      
      // Stop any running animations
      sparkle1.style.animation = 'none';
      sparkle2.style.animation = 'none';
    };
    
    pill.addEventListener('mouseenter', startSparkle);
    pill.addEventListener('mouseleave', stopSparkle);
    pill.addEventListener('focus', startSparkle);
    pill.addEventListener('blur', stopSparkle);
  });
}

function createSparkle() {
  const sparkle = document.createElement('span');
  sparkle.className = 'pill-sparkle';
  sparkle.innerHTML = `
    <svg viewBox="0 0 512 512" width="100%" height="100%">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
    </svg>
  `;
  return sparkle;
}

function animateSparkle(sparkle) {
  // Random position that can extend outside pill bounds
  const left = Math.floor(Math.random() * 120) - 10; // -10% to 110%
  const top = Math.floor(Math.random() * 120) - 10;  // -10% to 110%
  
  sparkle.style.setProperty('--sparkle-left', `${left}%`);
  sparkle.style.setProperty('--sparkle-top', `${top}%`);
  
  // Restart animation
  sparkle.style.animation = 'none';
  sparkle.offsetHeight; // Force reflow
  sparkle.style.animation = '';
}
