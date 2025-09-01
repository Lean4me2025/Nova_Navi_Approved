import { loadOOH } from '/js/dataLoader.js';

const audio = document.getElementById('introAudio');
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');

async function init() {
  // Preload OOH (snapshot first, then try latest)
  window.NOVA_OOH = await loadOOH('/data/ooh_snapshot.min.json');
  // Attempt gentle autoplay (may be blocked)
  try {
    await audio.play();
    // After playback starts (or immediately if short), go to traits after 3s
    setTimeout(() => location.href = '/traits.html', 3000);
  } catch (e) {
    // Autoplay blocked — wait for user
  }
}

startBtn.addEventListener('click', async () => {
  try {
    await audio.play();
  } catch {}
  location.href = '/traits.html';
});

skipBtn.addEventListener('click', () => {
  location.href = '/traits.html';
});

init();
