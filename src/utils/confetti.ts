import confetti from 'canvas-confetti';

/**
 * Triggers a multi-stage celebratory confetti explosion
 * with SK Kiwalo green, emerald, mint, gold, and white confetti.
 */
export const triggerSubmissionConfetti = () => {
  const colors = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#f59e0b', '#fbbf24', '#ffffff'];

  // Left cannon burst
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0.1, y: 0.7 },
    colors,
    zIndex: 99999,
  });

  // Right cannon burst
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 0.9, y: 0.7 },
    colors,
    zIndex: 99999,
  });

  // Center fireworks starburst after 250ms
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      zIndex: 99999,
    });
  }, 250);

  // Gentle falling stars after 500ms
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.3 },
      colors,
      gravity: 0.8,
      zIndex: 99999,
    });
  }, 500);
};
