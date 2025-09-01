import { loadOOH } from '/js/dataLoader.js';

const traitsEl = document.getElementById('traits');
const badge = document.getElementById('oohBadge');
const toNavi = document.getElementById('toNavi');

const selected = new Set();

function traitNode(label) {
  const div = document.createElement('div');
  div.className = 'trait';
  div.textContent = label;
  div.addEventListener('click', () => {
    if (selected.has(label)) {
      selected.delete(label);
      div.classList.remove('selected');
    } else {
      selected.add(label);
      div.classList.add('selected');
    }
  });
  return div;
}

async function init() {
  // Load traits
  const traits = await fetch('/data/traitdata.json', { cache: 'no-store' }).then(r => r.json());
  traits.forEach(t => traitsEl.appendChild(traitNode(t)));

  // Load OOH (snapshot first, then latest attempt)
  const data = await loadOOH('/data/ooh_snapshot.min.json');
  badge.textContent = `OOH: ${data.version}`;

  toNavi.addEventListener('click', () => {
    // For demo, store selections and move on
    sessionStorage.setItem('selected_traits', JSON.stringify([...selected]));
    location.href = '/navi.html';
  });
}

init();
