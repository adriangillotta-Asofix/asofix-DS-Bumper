// Copiar código al portapapeles
function copyCode(btn) {
  const code = btn.closest('.ds-code').querySelector('pre code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '¡Copiado!';
    setTimeout(() => btn.textContent = 'Copiar', 2000);
  });
}
