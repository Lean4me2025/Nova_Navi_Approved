const NOVA_TRANSCRIPT = `Welcome to NOVA. Your journey to purpose, clarity, and momentum begins now.`;
const audioEl = document.getElementById('introAudio');
const marqueeText = document.getElementById('marquee-text');
const startBtn = document.getElementById('startBtn');
const continueBtn = document.getElementById('continueBtn');
const helperNote = document.getElementById('helperNote');

marqueeText.textContent = NOVA_TRANSCRIPT;

function applyMarquee(duration){
  const containerWidth = marqueeText.parentElement.clientWidth;
  const textWidth = marqueeText.getBoundingClientRect().width;
  const kfName = `scroll_${Date.now()}`;
  const s = document.createElement('style');
  s.textContent = `@keyframes ${kfName}{0%{transform:translateX(${containerWidth}px)}100%{transform:translateX(-${textWidth}px)}}
  #marquee-text{animation:${kfName} ${duration}s linear forwards}`;
  document.head.appendChild(s);
}

startBtn.addEventListener('click', ()=>{
  const d = isFinite(audioEl.duration)&&audioEl.duration>0?audioEl.duration:20;
  applyMarquee(d);
  audioEl.currentTime=0;
  audioEl.play().catch(()=>{helperNote.textContent='Tap again to allow audio.'});
  startBtn.style.display='none';
  helperNote.textContent='Listening...';
});

audioEl.addEventListener('ended', ()=>{
  continueBtn.style.display='inline-block';
  helperNote.textContent='Intro finished.';
});

continueBtn.addEventListener('click', ()=>{
  window.location.href='traits.html';
});
