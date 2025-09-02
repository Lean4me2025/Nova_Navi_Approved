// NOVA Traits → Purpose Matching (drop-in)
// Assumptions:
// - Trait chips have class ".trait" and attribute data-code="ANALYTICAL" etc.
// - Selected trait chips have class ".selected" (toggle on click)
// - Next button has id "#nextBtn"
// - Brain dataset at /data/ooh_brain.json
// - This file should live at /js/traits.js
(function(){
  const BRAIN_URL = '/data/ooh_brain.json';
  const NEXT_URL = '/results.html';

  // Helper: fetch brain
  async function loadBrain(){
    const res = await fetch(BRAIN_URL, { cache: 'no-store' });
    if(!res.ok) throw new Error('Failed to load brain: ' + res.status);
    return res.json();
  }

  // Helper: find selected trait codes
  function getSelectedTraits(){
    const nodes = Array.from(document.querySelectorAll('.trait.selected, .trait.selected *'))
      .map(n => n.closest('.trait'))
      .filter(Boolean);
    const uniq = Array.from(new Set(nodes));
    const codes = uniq.map(el => (el.getAttribute('data-code') || '').toUpperCase().trim()).filter(Boolean);
    return codes;
  }

  // Simple scoring: sum of weights for selected traits
  function scoreFields(brain, selected){
    const scores = [];
    for(const pf of brain.purpose_fields){
      let s = 0;
      for(const t of selected){
        s += (pf.weight_by_trait[t] || 0);
      }
      scores.push({ field: pf.field, score: Number(s.toFixed(3)), careers: pf.example_careers || [] });
    }
    // normalize to 0..100
    const max = Math.max(...scores.map(x=>x.score), 1);
    for(const sc of scores){
      sc.percent = Math.round((sc.score / max) * 100);
    }
    scores.sort((a,b)=>b.score - a.score);
    return scores;
  }

  // Wire click handlers (non-destructive; only depends on CSS classes & data-code)
  async function onNext(){
    try{
      const brain = await loadBrain();
      const selected = getSelectedTraits();
      if(selected.length === 0){
        // no traits picked; still show something deterministic
        localStorage.setItem('novaResults', JSON.stringify({ selected, scores: [], ts: Date.now(), note: 'No traits selected' }));
        window.location.href = NEXT_URL;
        return;
      }
      const scores = scoreFields(brain, selected);
      localStorage.setItem('novaResults', JSON.stringify({ selected, scores, ts: Date.now() }));
      window.location.href = NEXT_URL;
    }catch(e){
      console.error(e);
      alert('Nova brain failed to load. Please try again.');
    }
  }

  // Bind to #nextBtn if present
  function bind(){
    const next = document.getElementById('nextBtn') || document.querySelector('[data-next]');
    if(next){
      next.addEventListener('click', (ev)=>{
        // Let this handler control navigation
        ev.preventDefault();
        onNext();
      });
    }
    // Also allow Enter key to submit
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){ onNext(); }
    });
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
