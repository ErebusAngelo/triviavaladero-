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

  // Badge del header (opcional)
  if (badgeText && !screen.querySelector('.header-badge')) {
    const badge = document.createElement('div');
    badge.className = 'header-badge';
    badge.textContent = badgeText;
    screen.appendChild(badge);
  }
}