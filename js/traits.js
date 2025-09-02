document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('nextBtn');
  nextBtn?.addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('.trait.selected')).map(el => el.dataset.code);
    fetch('/data/ooh_brain.json')
      .then(res => res.json())
      .then(data => {
        const results = selected.map(code => ({
          trait: code,
          purpose: data[code]?.purpose || "Unknown",
          careers: data[code]?.careers || []
        }));
        localStorage.setItem('novaResults', JSON.stringify(results));
        window.location.href = '/results.html';
      });
  });
});