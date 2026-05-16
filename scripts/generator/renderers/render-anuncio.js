/**
 * MÓDULO: Render Anúncio
 * RESPONSABILIDADE: Renderizar o card de título + corpo do anúncio gerado
 * DEPENDÊNCIAS:
 *   - utils/clipboard.js (copiar)
 * IMPACTO: Afeta o card principal de resultado (#titulo-card)
 *
 * ESTRUTURA DO CARD:
 *   Header: label "Anúncio gerado" + botão "Copiar tudo"
 *   Título: #titulo-body — Fraunces, tamanho maior
 *   Divisor
 *   Corpo: #result-body — texto do anúncio, white-space:pre-wrap
 *
 * COPIAR TUDO: copia "TÍTULO\n\nCORPO" — formato pronto para colar
 *   em qualquer portal ou rede social.
 *
 * EXIBIÇÃO PROGRESSIVA:
 *   O título é exibido primeiro (assim que chega o JSON da IA).
 *   O corpo é exibido logo depois.
 *   Ambos chamam este renderer — a função é idempotente.
 */

import { copiar } from '../../../utils/clipboard.js';

/**
 * Renderiza o título e o corpo do anúncio no card de resultado.
 * Exibe o card se estava oculto.
 *
 * @param {string} titulo — título gerado pela IA
 * @param {string} corpo  — corpo do anúncio gerado pela IA
 */
export function renderizarAnuncio(titulo, corpo) {
  const card      = document.getElementById('titulo-card');
  const tituloEl  = document.getElementById('titulo-body');
  const corpoEl   = document.getElementById('result-body');
  const btnCopiar = document.getElementById('btn-copiar-tudo');

  if (!card) return;

  // Renderizar título
  if (tituloEl && titulo) {
    tituloEl.textContent = titulo;
  }

  // Renderizar corpo
  if (corpoEl && corpo) {
    corpoEl.textContent = corpo;
  }

  // Exibir o card
  card.style.display = 'block';

  // Registrar botão de copiar tudo
  if (btnCopiar) {
    btnCopiar.onclick = () => {
      const textoCompleto = titulo && corpo
        ? `${titulo}\n\n${corpo}`
        : titulo || corpo || '';
      copiar(textoCompleto, btnCopiar, 'Copiar tudo');
    };
  }
}
