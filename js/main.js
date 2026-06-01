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

// Números de línea en bloques de código
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

});
