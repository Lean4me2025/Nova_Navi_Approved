(function () {
  const audio = document.getElementById('nova-intro');
  const status = document.getElementById('status');
  const playOverlay = document.getElementById('play-overlay');
  const playBtn = document.getElementById('play-btn');
  const replayBtn = document.getElementById('replay-btn');
  const continueBtn = document.getElementById('continue-btn');

  // Try respectful autoplay on load. Many browsers block autoplay-with-sound.
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Some browsers require a load() call before play().
      audio.load();
      await audio.play();
      status.textContent = 'Intro is playing…';
    } catch (err) {
      // Autoplay blocked — show overlay to capture a user gesture.
      playOverlay.classList.remove('hidden');
      status.textContent = 'Tap "Play Intro" to start audio.';
      console.warn('Autoplay blocked or failed:', err);
    }
  });

  playBtn?.addEventListener('click', async () => {
    try {
      await audio.play();
      status.textContent = 'Intro is playing…';
      playOverlay.classList.add('hidden');
    } catch (err) {
      status.textContent = 'Could not start audio. See console.';
      console.error(err);
    }
  });

  replayBtn?.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play().catch(err => console.error(err));
  });

  continueBtn?.addEventListener('click', () => {
    // Replace this with your real navigation (e.g., window.location = 'traits.html')
    status.textContent = 'Continuing to the next screen…';
  });

  // Helpful logging for source selection and errors
  audio.addEventListener('error', () => {
    const err = audio.error;
    let msg = 'Audio error.';
    if (err) {
      const codes = ['MEDIA_ERR_CUSTOM','MEDIA_ERR_ABORTED','MEDIA_ERR_NETWORK','MEDIA_ERR_DECODE','MEDIA_ERR_SRC_NOT_SUPPORTED'];
      msg = `Audio error (${codes[err.code] || err.code}).`;
    }
    status.textContent = msg;
    console.error(msg, err);
  });

  audio.addEventListener('playing', () => {
    status.textContent = 'Intro is playing…';
  });
  audio.addEventListener('ended', () => {
    status.textContent = 'Intro finished.';
  });
})();