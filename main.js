
const state = { traits: [], careers: [], selected: new Set() };
const views = {
  intro: document.getElementById('intro'),
  traits: document.getElementById('traits'),
  matches: document.getElementById('matches'),
  book: document.getElementById('book'),
  email: document.getElementById('email'),
};
function show(id){ Object.values(views).forEach(v=>v.classList.remove('active')); views[id].classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }

async function loadData(){
  const t = await fetch('assets/data/traitdata.json').then(r=>r.json());
  const c = await fetch('assets/data/careers.json').then(r=>r.json());
  state.traits = t; state.careers = c; renderTraits();
}
loadData();

const audio = document.getElementById('introAudio');
const startBtn = document.getElementById('startBtn');
document.getElementById('startBtn').addEventListener('click', async () => {
  try {
    await audio.play();                 // user gesture unlocks audio
    audio.onended = () => show('traits');
  } catch (err) {
    console.warn('Audio play blocked:', err);
    startBtn.textContent = 'Tap to Play Intro';
  }
});
document.getElementById('skipBtn').addEventListener('click', ()=> show('traits'));

function renderTraits(){
  const grid = document.getElementById('traitGrid'); grid.innerHTML='';
  state.traits.forEach(t=>{
    const item=document.createElement('div'); item.className='trait';
    const left=document.createElement('div'); left.innerHTML=`<div>${t.name}</div><div class="category"><small>${t.category}</small></div>`;
    const right=document.createElement('input'); right.type='checkbox';
    right.addEventListener('change', (e)=>{ if(e.target.checked){ state.selected.add(t.name); item.classList.add('on'); } else { state.selected.delete(t.name); item.classList.remove('on'); } });
    item.addEventListener('click',(e)=>{ if(e.target.tagName.toLowerCase()!=='input'){ right.checked=!right.checked; right.dispatchEvent(new Event('change')); } });
    item.appendChild(left); item.appendChild(right); grid.appendChild(item);
  });
}

function scoreCategories(){
  const counts={}; state.traits.forEach(t=>{ if(state.selected.has(t.name)){ counts[t.category]=(counts[t.category]||0)+1; } }); return counts;
}
function rankCareers(){
  const counts=scoreCategories();
  const scored=state.careers.map(c=>{ const s=c.categories.reduce((a,cat)=>a+(counts[cat]||0),0); return {...c,score:s}; })
    .sort((a,b)=> b.score - a.score || (b.median_pay||0)-(a.median_pay||0));
  return scored.slice(0,20);
}
function renderMatches(){
  const list=document.getElementById('matchList'); list.innerHTML=''; const top=rankCareers();
  if(top.length===0){ list.innerHTML=`<div class="card"><strong>No matches yet.</strong> Please select some traits first.</div>`; return; }
  top.forEach(c=>{
    const card=document.createElement('div'); card.className='card'; card.innerHTML=`
      <h3>${c.title}</h3>
      <p><strong>SOC:</strong> ${c.soc || '—'}</p>
      <p><strong>Aligned:</strong> ${c.categories.join(', ')}</p>
      <p><strong>Median Pay:</strong> ${c.median_pay? ('$'+c.median_pay.toLocaleString()): '—'}</p>
      <p><strong>Outlook:</strong> ${c.outlook || '—'}</p>
      <div class="actions">
        <button class="btn" onclick="openBook()">Deepen with Purpose Book</button>
        <button class="btn" onclick="openEmail()">Get Updates</button>
      </div>`;
    list.appendChild(card);
  });
}
document.getElementById('toMatches').addEventListener('click', ()=>{ renderMatches(); show('matches'); });
function openBook(){ show('book'); } function openEmail(){ show('email'); }

document.getElementById('downloadReport').addEventListener('click', ()=>{
  const selected=Array.from(state.selected); const top=rankCareers(); const reportWindow=window.open('','printWin'); const now=new Date().toLocaleString();
  reportWindow.document.write(`
    <html><head><title>NOVA Report</title>
      <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter;padding:24px}h1{margin:0 0 8px}.muted{color:#444}.section{margin:16px 0}.card{border:1px solid #ddd;border-radius:10px;padding:12px;margin:8px 0}</style>
    </head><body>
      <h1>NOVA Report</h1>
      <div class="muted">${now}</div>
      <div class="section"><h2>Selected Traits</h2><div>${selected.length? selected.join(', '):'No traits selected'}</div></div>
      <div class="section"><h2>Top Matches</h2>${top.map(c=>`
        <div class="card"><strong>${c.title}</strong><br/>SOC: ${c.soc || '—'}<br/>Aligned: ${c.categories.join(', ')}<br/>Median Pay: ${c.median_pay? ('$'+c.median_pay.toLocaleString()):'—'}<br/>Outlook: ${c.outlook || '—'}</div>
      `).join('')}</div>
    </body></html>`);
  reportWindow.document.close(); reportWindow.focus(); reportWindow.print();
});

document.getElementById('restart').addEventListener('click', ()=>{
  state.selected.clear();
  document.querySelectorAll('#traitGrid .trait input[type=checkbox]').forEach(cb=>{ cb.checked=false; cb.closest('.trait').classList.remove('on'); });
  show('traits');
});
document.getElementById('backToMatches').addEventListener('click', ()=> show('matches'));
document.getElementById('backHome').addEventListener('click', ()=> show('matches'));
