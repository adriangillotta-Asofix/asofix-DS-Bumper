// ================================
// Asofix DS — main.js
// ================================

// Íconos SVG
const iconCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// Copiar código al portapapeles
function copyCode(btn) {
  const code = btn.closest('.ds-code').querySelector('pre code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerHTML = iconCheck;
    btn.style.color = '#0E9970';
    btn.style.borderColor = '#0E9970';
    setTimeout(() => {
      btn.innerHTML = iconCopy;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

// Construir TOC automáticamente desde secciones con id
function buildTOC() {
  const sections = document.querySelectorAll('.ds-section[id]');
  if (sections.length === 0) return;

  const toc = document.createElement('nav');
  toc.className = 'ds-toc';

  const title = document.createElement('p');
  title.className = 'ds-toc__title';
  title.textContent = 'En esta página';
  toc.appendChild(title);

  const list = document.createElement('ul');
  list.className = 'ds-toc__list';

  sections.forEach(section => {
    const heading = section.querySelector('.ds-section__title');
    if (!heading) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.className = 'ds-toc__link';
    a.textContent = heading.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.appendChild(list);
  document.querySelector('.ds-main').appendChild(toc);
}

// Scroll spy con IntersectionObserver
function initScrollSpy() {
  const links = document.querySelectorAll('.ds-toc__link');
  if (links.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.ds-toc__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  document.querySelectorAll('.ds-section[id]').forEach(s => observer.observe(s));
}

// Init
document.addEventListener('DOMContentLoaded', () => {

  // Inicializar botones copiar con ícono
  document.querySelectorAll('.ds-copy-btn').forEach(btn => {
    btn.innerHTML = iconCopy;
  });

  // Agregar números de línea
  document.querySelectorAll('.ds-code pre code').forEach(block => {
    const lines = block.innerText.split('\n');
    const numbered = lines.map((line, i) => {
      return `<span class="ds-code__line"><span class="ds-code__num">${i + 1}</span><span class="ds-code__text">${line}</span></span>`;
    }).join('');
    block.innerHTML = numbered;
  });

  // TOC
  buildTOC();
  initScrollSpy();

});
