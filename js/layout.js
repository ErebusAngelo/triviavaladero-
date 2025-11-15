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
      <svg class="logo-sun" width="219" height="112" viewBox="0 0 219 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
        <g id="sun-core">
          <path d="M64.77 111.83L153.77 111.69C153.73 86.5501 133.77 66.2101 109.2 66.2501C84.62 66.2901 64.74 86.6901 64.78 111.83" fill="#AD925C"/>
        </g>
        <g id="sun-rays">
          <path d="M216.97 111.59L218.55 111.41L162 105.12C162.26 107.27 162.41 109.45 162.41 111.68L216.98 111.59H216.97ZM212.05 73.62C173.86 54.92 182.12 89.89 156.72 87.32C158.82 91.57 160.39 96.13 161.34 100.94C182.51 97.42 178.97 60.77 212.04 73.62M150.82 77.9L186.29 32.48L141.96 68.93C145.25 71.56 148.22 74.58 150.83 77.91M155.53 10.33C115.55 24.75 145.7 43.54 125.79 60.11C130.33 61.63 134.6 63.75 138.51 66.39C151.18 48.59 123.22 25.19 155.53 10.34M109.19 57.41C111.24 57.41 113.25 57.53 115.25 57.76L108.92 0L102.78 57.83C104.88 57.57 107.01 57.42 109.19 57.41ZM84.02 63.94C88.16 61.64 92.65 59.91 97.37 58.8C93.9 37.18 58.1 40.79 70.67 6.97C52.3 46.21 86.9 37.5 84.02 63.94ZM76.45 69.03L32 32.72L67.62 78.03C70.21 74.69 73.18 71.66 76.45 69.03ZM9.47 65.45C23.64 106.53 42.1 75.22 58.36 96.16C59.75 91.42 61.74 86.95 64.27 82.85C46.86 69.91 23.99 98.5 9.46 65.45M56.53 105.28L0 111.75L1.59 111.93L56.14 111.84C56.14 109.62 56.28 107.43 56.53 105.28Z" fill="#AD925C"/>
        </g>
      </svg>
      <img src="assets/veladero.png" alt="Veladero" class="logo-word" />
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