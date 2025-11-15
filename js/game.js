import { renderLayout } from './layout.js';

// Inicializa layout común con badge en header
document.addEventListener('DOMContentLoaded', async () => {
  renderLayout({ badgeText: 'Minería para un futuro más brillante' });

  const root = document.querySelector('.game-content');
  if (!root) return;

  const state = { preguntas: [], index: 0 };

  try {
    // Carga directa y robusta del JSON
    const data = await fetchJson('data.json');
    const todas = Array.isArray(data && data.preguntas) ? data.preguntas.slice() : [];
    // Seleccionar 5 preguntas aleatorias sin repetición
    shuffle(todas);
    state.preguntas = todas.slice(0, 5);
    state.index = 0;
    renderPregunta(root, state);
  } catch (e) {
    root.innerHTML = `<p style="color:#fff;text-align:center">No se pudieron cargar las preguntas.<br/><small>${e?.message || ''}</small></p>`;
    console.error(e);
  }
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderPregunta(root, state) {
  if (!Array.isArray(state.preguntas) || state.preguntas.length === 0) {
    root.innerHTML = `<p style="color:#fff;text-align:center">No se pudieron cargar preguntas.</p>`;
    return;
  }

  const q = state.preguntas[state.index];
  if (!q) {
    root.innerHTML = `
      <div class="question-card">
        <h2 class="question-title">¡Gracias por jugar!</h2>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="question-card">
      <h2 class="question-title">${q.pregunta}</h2>
    </div>
    <div class="answers" role="list">
      ${q.opciones.map((op) => `
        <button class="answer-btn" role="listitem" data-opcion="${escapeHtml(op)}">${op}</button>
      `).join('')}
    </div>
  `;

  root.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // feedback mínimo y avanzar
      btn.classList.add('answer-selected');
      setTimeout(() => {
        state.index++;
        renderPregunta(root, state);
      }, 450);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

async function fetchJson(path) {
  const url = path + '?ts=' + Date.now();
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const cleaned = (text || '').replace(/^\uFEFF/, '').trim();
    if (!cleaned) throw new Error('JSON vacío');
    return JSON.parse(cleaned);
  } catch (e) {
    // Fallback con XHR en caso de que fetch falle o regrese vacío
    const text = await xhrText(url);
    const cleaned = (text || '').replace(/^\uFEFF/, '').trim();
    if (!cleaned) throw new Error('JSON vacío (XHR)');
    return JSON.parse(cleaned);
  }
}

function xhrText(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    // responseType vacío para usar responseText
    xhr.responseType = '';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error('XHR error'));
    xhr.send();
  });
}