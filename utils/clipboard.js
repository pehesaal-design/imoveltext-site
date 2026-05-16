/**
 * MÓDULO: Clipboard — Utilitário de Cópia
 * RESPONSABILIDADE: Copiar texto para a área de transferência com feedback visual
 * DEPENDÊNCIAS: Nenhuma (utilitário puro)
 * IMPACTO: Usado por todos os botões de copiar do sistema
 *
 * SUBSTITUI as 3 funções quase idênticas do sistema original:
 *   copiar()               → copiava o corpo do anúncio
 *   copiarHashtags()       → copiava as hashtags
 *   copiarAnuncioCompleto() → copiava título + corpo
 *
 * AGORA: uma única função genérica que recebe texto e o botão.
 * O feedback visual ("✓ Copiado!") dura 2 segundos e restaura o label original.
 *
 * FALLBACK: Para browsers sem suporte à Clipboard API (raro, mas possível),
 * usa a abordagem legada de execCommand('copy').
 */

/**
 * Copia texto para a área de transferência e exibe feedback visual no botão.
 *
 * @param {string}          texto   — texto a copiar
 * @param {HTMLElement|null} btnEl  — botão que disparou a cópia (para feedback)
 * @param {string}          [label] — label original do botão (restaurado após 2s)
 * @returns {Promise<boolean>} true se copiou com sucesso
 */
export async function copiar(texto, btnEl = null, label = null) {
  if (!texto) return false;

  let sucesso = false;

  try {
    await navigator.clipboard.writeText(texto);
    sucesso = true;
  } catch {
    // Fallback para browsers sem Clipboard API
    sucesso = _copiarFallback(texto);
  }

  if (sucesso && btnEl) {
    _feedback(btnEl, label);
  }

  return sucesso;
}

/**
 * Fallback via execCommand — usado quando Clipboard API não está disponível.
 * @param {string} texto
 * @returns {boolean} sucesso
 */
function _copiarFallback(texto) {
  try {
    const el = document.createElement('textarea');
    el.value = texto;
    el.style.position = 'fixed';
    el.style.opacity  = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Exibe feedback visual temporário no botão de copiar.
 * Adiciona classe .copied por 2 segundos, depois restaura o estado original.
 *
 * @param {HTMLElement} btnEl  — botão a animar
 * @param {string|null} label  — label original (restaurado após o feedback)
 */
function _feedback(btnEl, label) {
  const labelOriginal = label || btnEl.textContent;

  btnEl.classList.add('copied');
  btnEl.textContent = '✓ Copiado!';

  setTimeout(() => {
    btnEl.classList.remove('copied');
    btnEl.textContent = labelOriginal;
  }, 2000);
}
