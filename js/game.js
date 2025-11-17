import { renderLayout } from './layout.js';

// Confeti al ganar: carga dinámica vía CDN y disparos temporizados
let confettiTimer = null;
async function ensureConfetti() {
  if (!window.confetti) {
    await import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js');
  }
}
async function fireConfetti(durationMs = 3000) {
  try {
    await ensureConfetti();
    const end = Date.now() + durationMs;
    const colors = ['#ffffff', '#b6985a', '#0f4771'];
    if (confettiTimer) { clearInterval(confettiTimer); confettiTimer = null; }
    confettiTimer = setInterval(() => {
      // Izquierda
      window.confetti({
        particleCount: 35,
        angle: 60,
        spread: 55,
        startVelocity: 42,
        origin: { x: 0, y: 0.6 },
        colors
      });
      // Derecha
      window.confetti({
        particleCount: 35,
        angle: 120,
        spread: 55,
        startVelocity: 42,
        origin: { x: 1, y: 0.6 },
        colors
      });
      if (Date.now() > end) {
        clearInterval(confettiTimer);
        confettiTimer = null;
      }
    }, 250);
  } catch (e) {
    console.warn('No se pudo cargar confetti:', e);
  }
}

// Burst especial para 5/5 correctas
async function grandBurstConfetti() {
  try {
    await ensureConfetti();
    const colors = ['#ffffff', '#b6985a', '#0f4771'];
    // Centro superior
    window.confetti({
      particleCount: 180,
      startVelocity: 60,
      spread: 100,
      ticks: 300,
      origin: { x: 0.5, y: 0.15 },
      colors
    });
    // Laterales de apoyo
    setTimeout(() => window.confetti({ particleCount: 120, spread: 90, startVelocity: 52, origin: { x: 0.2, y: 0.2 }, colors }), 250);
    setTimeout(() => window.confetti({ particleCount: 120, spread: 90, startVelocity: 52, origin: { x: 0.8, y: 0.2 }, colors }), 500);
  } catch (e) {
    console.warn('No se pudo lanzar burst de confetti:', e);
  }
}

// Inicializa layout común con badge en header
document.addEventListener('DOMContentLoaded', async () => {
  renderLayout({ badgeText: 'Minería para un futuro más brillante' });

  const root = document.querySelector('.game-content');
  if (!root) return;

  const state = { preguntas: [], index: 0, correctas: 0 };

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
    mostrarPantallaFinal(root, state);
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
      const respuestaSeleccionada = btn.getAttribute('data-opcion');
      const esCorrecta = respuestaSeleccionada === q.respuesta_correcta;
      
      // Deshabilitar todos los botones
      root.querySelectorAll('.answer-btn').forEach(b => {
        b.disabled = true;
        // Marcar la correcta en verde
        if (b.getAttribute('data-opcion') === q.respuesta_correcta) {
          b.classList.add('correct');
        }
      });
      
      // Si seleccionó incorrecta, marcarla en rojo
      if (!esCorrecta) {
        btn.classList.add('incorrect');
      } else {
        state.correctas++;
      }
      
      // Avanzar después de mostrar el feedback
      setTimeout(() => {
        state.index++;
        renderPregunta(root, state);
      }, 1500);
    });
  });
}

function mostrarPantallaFinal(root, state) {
  const total = state.preguntas.length;
  const correctas = state.correctas;
  
  if (correctas >= 4) {
    // Pantalla de éxito
    root.innerHTML = `
      <div style="text-align: center; margin-top: clamp(40px, 8vh, 80px);">
        <h1 class="celebrate-title" style="color: #b6985a; font-family: 'ArialMTStdExtraBold', Arial, sans-serif; font-size: clamp(42px, 7vh, 86px); margin: 0 0 clamp(24px, 4vh, 36px) 0; letter-spacing: -0.03em; line-height: 1.12; margin-top: 20%;">¡Felicitaciones!</h1>
        <p style="color: #fff; font-family: 'Arial MT Std', Arial, sans-serif; font-weight: 700; font-size: clamp(24px, 4vh, 70px); line-height: 1.12; letter-spacing: -0.03em; margin: 0;">
          Respondiste<br>correctamente<br>la trivia
        </p>
        <button class="play-btn restart-btn" type="button" aria-label="Reiniciar juego">REINICIAR</button>
      </div>
    `;
    fireConfetti(3200);
    if (correctas === total) {
      grandBurstConfetti();
    }
  } else {
    // Pantalla para reintentar
    root.innerHTML = `
      <div style="text-align: center; margin-top: clamp(40px, 8vh, 80px);">
        <h1 class="celebrate-title" style="color: #b6985a; font-family: 'ArialMTStdExtraBold', Arial, sans-serif; font-size: clamp(42px, 7vh, 86px); margin: 0 0 clamp(24px, 4vh, 36px) 0; letter-spacing: -0.03em; line-height: 1.12; margin-top: 20%;">¡Inténtalo de nuevo!</h1>
        <p style="color: #fff; font-family: 'Arial MT Std', Arial, sans-serif; font-weight: 700; font-size: clamp(24px, 4vh, 70px); line-height: 1.12; letter-spacing: -0.03em; margin: 0;">
          Respondiste correctamente<br>${correctas} de ${total} preguntas.<br>Necesitas al menos 4<br>para ganar.
        </p>
        <button class="play-btn restart-btn" type="button" aria-label="Reiniciar juego">REINICIAR</button>
      </div>
    `;
  }

  // Reinicio del juego
  const restart = root.querySelector('.restart-btn');
  if (restart) {
    restart.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
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