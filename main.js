// NOVA Intro — main.js

// === Editable Transcript Text ===
// Replace this string with the exact words from your intro audio
// to have the text match *exactly* what is spoken.
const NOVA_TRANSCRIPT = `Welcome to NOVA. Your journey to purpose, clarity, and momentum begins now.`;

// Cache DOM
const startBtn = document.getElementById('startBtn');
const audioEl = document.getElementById('introAudio');
const marquee = document.getElementById('marquee');
const marqueeSpan = document.getElementById('marquee-text');
const helperNote = document.getElementById('helperNote');

// Prepare marquee text
marqueeSpan.textContent = NOVA_TRANSCRIPT;

// Helper: build a CSS animation dynamically to scroll text
function applyMarquee(durationSeconds) {
  // Compute distance: text width + container width, so the full sentence scrolls all the way across
  const containerWidth = marquee.clientWidth;
  const textWidth = marqueeSpan.getBoundingClientRect().width;
  const totalDistance = containerWidth + textWidth;

  // We use a CSS animation that translates from +containerWidth to -textWidth over `durationSeconds`
  const styleId = 'dynamic-marquee-style';
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Unique keyframe name in case of repeated starts
  const kfName = `scrollKF_${Date.now()}`;
  styleTag.textContent = `@keyframes ${kfName} {
    0% { transform: translateX(${containerWidth}px); }
    100% { transform: translateX(${-textWidth}px); }
  }
  #marquee-text {
    animation: ${kfName} ${durationSeconds}s linear forwards;
  }`;
}

// Attach click handler to start
startBtn.addEventListener('click', async () => {
  // Ensure we can read metadata to sync duration
  if (audioEl.readyState < 1) {
    try {
      await audioEl.load();
    } catch (e) {}
  }

  // When metadata is available, set up the scroll duration
  const startPlayback = () => {
    const duration = (isFinite(audioEl.duration) && audioEl.duration > 0) ? audioEl.duration : 20;
    applyMarquee(duration);
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {
      // If playback was blocked, hint to user
      helperNote.textContent = 'Tap again to allow audio playback.';
    });
    startBtn.disabled = true;
    startBtn.textContent = 'Playing…';
    helperNote.textContent = 'Listening… the message will finish when the text reaches the end.';
  };

  if (isNaN(audioEl.duration) || !isFinite(audioEl.duration) || audioEl.duration === 0) {
    audioEl.addEventListener('loadedmetadata', startPlayback, { once: true });
    // Fallback timeout in case metadata event is slow
    setTimeout(startPlayback, 1200);
  } else {
    startPlayback();
  }
});

// When audio ends, gently update UI (you can navigate to the next screen here if desired)
audioEl.addEventListener('ended', () => {
  startBtn.textContent = 'Replay';
  startBtn.disabled = false;
  helperNote.textContent = 'Intro finished. Press Replay to hear it again or proceed to the next step.';
});
