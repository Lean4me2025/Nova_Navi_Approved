// NOVA intro audio logic
(function(){
  const audio = document.getElementById('introAudio');
  const btn = document.getElementById('startBtn');

  // Attempt gentle autoplay after load (may be blocked)
  window.addEventListener('load', () => {
    if (!audio) return;
    const tryPlay = () => audio.play().catch(() => {});
    // prime once network ready
    if (audio.readyState >= 2) tryPlay(); else audio.addEventListener('canplay', tryPlay, { once:true });
  });

  // Unblock policy on first user gesture
  function unlockAndPlay(){
    audio.play().catch(() => {});
    // Proceed to next screen here if desired, e.g. window.location.href = '/traits.html';
    document.removeEventListener('click', unlockAndPlay);
    document.removeEventListener('touchstart', unlockAndPlay);
    document.removeEventListener('keydown', unlockAndPlay);
  }
  document.addEventListener('click', unlockAndPlay, { once:true });
  document.addEventListener('touchstart', unlockAndPlay, { once:true });
  document.addEventListener('keydown', unlockAndPlay, { once:true });

  // Button explicit trigger
  if (btn) btn.addEventListener('click', unlockAndPlay);
})();