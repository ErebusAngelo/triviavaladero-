// Renderiza header y footer comunes dentro de .screen
export function renderLayout({ badgeText } = {}) {
  const screen = document.querySelector('.screen');
  if (!screen) return;

  // Header
  if (!screen.querySelector('.header-deco')) {
    const headerImg = document.createElement('img');
    headerImg.src = 'assets/header.png';
    headerImg.alt = 'Decoración superior';
    headerImg.className = 'header-deco';
    headerImg.setAttribute('aria-hidden', 'true');
    screen.appendChild(headerImg);
  }

  // Footer
  if (!screen.querySelector('.footer')) {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.setAttribute('aria-label', 'Pie de página');

    const footerImg = document.createElement('img');
    footerImg.src = 'assets/footer.png';
    footerImg.alt = 'Decoración inferior';
    footerImg.className = 'footer-deco';
    footerImg.setAttribute('aria-hidden', 'true');
    footer.appendChild(footerImg);

    const logo = document.createElement('div');
    logo.className = 'footer-logo';
    logo.setAttribute('aria-label', 'Logo Veladero');
    logo.innerHTML = `
      <img src="assets/logofoot.png" alt="Veladero" class="logo-footer-img" />
    `;
    footer.appendChild(logo);

    screen.appendChild(footer);
  }

  // Título directo en el header (opcional)
  if (badgeText && !screen.querySelector('.header-title')) {
    const titleEl = document.createElement('h1');
    titleEl.className = 'header-title';
    const text = String(badgeText).trim();
    const parts = text.split(/\s+/);
    const main = parts.shift() || '';
    let sub = parts.join(' ');
    // Brillo en “brillante”
    sub = sub.replace(/(brillante)/i, '<span class="shine">$1</span>');
    // Fix para la palabra “más”
    sub = sub.replace(/\b(m[a\u00E1]s)\b/i, (m) => {
      const base = /mas/i.test(m) ? 'ma\u0301' : 'má';
      return `<span class="word-mas"><span class="mas-base">${base}</span><span class="mas-s">s</span></span>`;
    });
    titleEl.innerHTML = `
      <span class="title-main">${main}</span>
      <span class="title-sub">${sub}</span>
    `;
    screen.appendChild(titleEl);
  }
}