const NOVA_TRANSCRIPT=`Welcome to NOVA. Your journey to purpose, clarity, and momentum begins now.`;
const audioEl=document.getElementById('introAudio');
const marqueeText=document.getElementById('marquee-text');
const startBtn=document.getElementById('startBtn');
const continueBtn=document.getElementById('continueBtn');
const helperNote=document.getElementById('helperNote');
marqueeText.textContent=NOVA_TRANSCRIPT;
function applyMarquee(d){const c=marqueeText.parentElement.clientWidth;const t=marqueeText.getBoundingClientRect().width;
const kf=`scroll_${Date.now()}`;const s=document.createElement('style');
s.textContent=`@keyframes ${kf}{0%{transform:translateX(${c}px)}100%{transform:translateX(-${t}px)}} #marquee-text{animation:${kf} ${d}s linear forwards}`;document.head.appendChild(s);}
startBtn.addEventListener('click',()=>{const d=isFinite(audioEl.duration)&&audioEl.duration>0?audioEl.duration:20;applyMarquee(d);audioEl.currentTime=0;audioEl.play().catch(()=>{helperNote.textContent='Tap again'});startBtn.style.display='none';helperNote.textContent='Listening...';});
audioEl.addEventListener('ended',()=>{continueBtn.style.display='inline-block';helperNote.textContent='Intro finished.';});
continueBtn.addEventListener('click',()=>{window.location.href='traits.html'});