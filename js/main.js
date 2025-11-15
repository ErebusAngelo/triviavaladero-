// Anima el título palabra por palabra
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.title');
  if (!title) return;

  const original = title.innerHTML.trim();
  const lines = original.split(/<br\s*\/?\s*>/i);

  title.textContent = '';
  let delay = 0;

  lines.forEach((line, li) => {
    const lineEl = document.createElement('span');
    lineEl.className = 'title-line';
    const words = line.trim().split(/\s+/);
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'title-word';
      w.textContent = word;
      w.style.animationDelay = `${delay}s`;
      delay += 0.25; // escalonado más lento
      lineEl.appendChild(w);
      if (wi < words.length - 1) {
        lineEl.appendChild(document.createTextNode(' '));
      }
    });
    title.appendChild(lineEl);
    if (li < lines.length - 1) title.appendChild(document.createElement('br'));
  });

  // Navegación a la página del juego
  const playBtn = document.querySelector('.play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      window.location.href = 'game.html';
    });
  }
});