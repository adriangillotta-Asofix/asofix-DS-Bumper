// ================================
// Asofix DS — main.js
// ================================

// Íconos SVG
const iconCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// Copiar código del panel activo al portapapeles
function copyCode(btn) {
  const codeBlock = btn.closest('.ds-code');
  const activePanel = codeBlock.querySelector('.ds-code__panel--active') || codeBlock;
  const code = [...activePanel.querySelectorAll('.ds-code__text')].map(el => el.innerText).join('\n');
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

// Mover el indicador deslizante al tab activo
function moveTabIndicator(container, activeTab) {
  const indicator = container.querySelector('.tabs__indicator');
  if (!indicator) return;
  indicator.style.width = activeTab.offsetWidth + 'px';
  indicator.style.height = activeTab.offsetHeight + 'px';
  indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
}

// Activar tab en previews interactivos
function activateTab(el) {
  const container = el.closest('.tabs');
  container.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('tab--active');
    t.setAttribute('aria-selected', 'false');
  });
  el.classList.add('tab--active');
  el.setAttribute('aria-selected', 'true');
  moveTabIndicator(container, el);
}

// Cambiar tab CSS / HTML en bloques de código
function switchTab(btn, tab) {
  const codeBlock = btn.closest('.ds-code');
  codeBlock.querySelectorAll('.ds-code__tab').forEach(t => t.classList.remove('ds-code__tab--active'));
  codeBlock.querySelectorAll('.ds-code__panel').forEach(p => p.classList.remove('ds-code__panel--active'));
  btn.classList.add('ds-code__tab--active');
  const panel = codeBlock.querySelector(`.ds-code__panel[data-tab="${tab}"]`);
  if (panel) {
    panel.classList.add('ds-code__panel--active');
    initCodeBlock(panel.querySelector('code'));
  }
}

// Escapar caracteres HTML para mostrar como texto plano
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inicializar números de línea en un bloque de código
function initCodeBlock(block) {
  if (!block || block.dataset.initialized) return;
  block.dataset.initialized = 'true';
  const lines = block.innerText.split('\n');
  const numbered = lines.map((line, i) => {
    return `<span class="ds-code__line"><span class="ds-code__num">${i + 1}</span><span class="ds-code__text">${escapeHtml(line)}</span></span>`;
  }).join('');
  block.innerHTML = numbered;
}

// --------------------------------
// TOC
// --------------------------------
let isScrollingToTarget = false;
let scrollTimer = null;

function setActiveLink(link) {
  document.querySelectorAll('.ds-toc__link').forEach(l => l.classList.remove('active'));
  link.classList.add('active');
}

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

  sections.forEach((section, index) => {
    const heading = section.querySelector('.ds-section__title');
    if (!heading) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.className = 'ds-toc__link';
    a.textContent = heading.textContent;

    a.addEventListener('click', () => {
      setActiveLink(a);
      isScrollingToTarget = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrollingToTarget = false; }, 800);
    });

    if (index === 0) a.classList.add('active');

    li.appendChild(a);
    list.appendChild(li);
  });

  toc.appendChild(list);
  document.querySelector('.ds-main').appendChild(toc);
}

function initScrollSpy() {
  const observer = new IntersectionObserver(entries => {
    if (isScrollingToTarget) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const active = document.querySelector(`.ds-toc__link[href="#${entry.target.id}"]`);
        if (active) setActiveLink(active);
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  document.querySelectorAll('.ds-section[id]').forEach(s => observer.observe(s));
}

// --------------------------------
// Dropdown
// --------------------------------

function toggleDropdown(triggerId, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const trigger  = document.getElementById(triggerId);
  if (!dropdown) return;
  const isOpen = !dropdown.hidden;
  dropdown.hidden = isOpen;
  if (trigger) trigger.setAttribute('aria-expanded', String(!isOpen));
}

function selectDropdownItem(el) {
  if (el.classList.contains('dropdown-item--disabled')) return;
  const isActive = el.classList.contains('dropdown-item--active');
  const icon = el.querySelector('.dropdown-item__checkbox .material-icons-outlined');
  if (isActive) {
    el.classList.remove('dropdown-item--active');
    if (icon) icon.textContent = 'check_box_outline_blank';
  } else {
    el.classList.add('dropdown-item--active');
    if (icon) icon.textContent = 'check_box';
  }
}

document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown:not([hidden])').forEach(dropdown => {
    const trigger = document.querySelector(`[aria-controls="${dropdown.id}"]`);
    if (!trigger) return; // sin trigger = preview estático, no cerrar
    if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
      dropdown.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
});

// --------------------------------
// Select + Dropdown
// --------------------------------

function selectOption(itemEl, triggerId, dropdownId, textId, clearId) {
  const title = itemEl.querySelector('.dropdown-item__title').textContent;
  const textEl = document.getElementById(textId);
  textEl.textContent = title;
  textEl.classList.add('select__text--filled');
  document.getElementById(clearId).style.display = '';
  itemEl.closest('.dropdown__list').querySelectorAll('.dropdown-item')
    .forEach(i => i.classList.remove('dropdown-item--active'));
  itemEl.classList.add('dropdown-item--active');
  toggleDropdown(triggerId, dropdownId);
}

function clearSelectDemo(event, triggerId, textId, dropdownId, clearId) {
  event.stopPropagation();
  const textEl = document.getElementById(textId);
  textEl.textContent = 'Placeholder';
  textEl.classList.remove('select__text--filled');
  document.getElementById(clearId).style.display = 'none';
  document.getElementById(dropdownId)
    ?.querySelectorAll('.dropdown-item')
    .forEach(i => i.classList.remove('dropdown-item--active'));
}

// --------------------------------
// Init
// --------------------------------
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.ds-copy-btn').forEach(btn => {
    btn.innerHTML = iconCopy;
  });

  // Inicializar solo paneles activos (o bloques sin tabs)
  document.querySelectorAll('.ds-code pre code').forEach(block => {
    const panel = block.closest('.ds-code__panel');
    if (!panel || panel.classList.contains('ds-code__panel--active')) {
      initCodeBlock(block);
    }
  });

  // Inicializar indicadores deslizantes de tabs
  document.querySelectorAll('.tabs').forEach(container => {
    const activeTab = container.querySelector('.tab--active');
    if (activeTab) moveTabIndicator(container, activeTab);
  });

  buildTOC();
  initScrollSpy();

});
