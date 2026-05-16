/**
 * MÓDULO: Render Legendas
 * RESPONSABILIDADE: Renderizar o card de legendas por foto (thumbnail + texto)
 * DEPENDÊNCIAS:
 *   - state.js (AppState — para salvar legendas e exibir thumbnails)
 *   - form/upload-manager.js (renderCapaThumbs — exibe seletor de capa)
 * IMPACTO: Afeta o card #captions-card e o seletor de capa #capa-selector
 *
 * ESTRUTURA:
 *   Cada item: thumbnail da foto + legenda descritiva ao lado
 *   Layout: .cap-item { display: flex; gap: 12px }
 *
 * DUPLO USO DAS LEGENDAS — CRÍTICO:
 *   1. Exibição no card de resultado (este módulo)
 *   2. Alimentação do pdf-utils.classificarAmbiente() para ordenar
 *      as fotos do PDF por ambiente.
 *   Por isso as legendas são salvas em AppState.generation.legendasGeradas.
 *
 * SELETOR DE CAPA:
 *   Após renderizar as legendas, exibe o seletor de foto de capa
 *   se houver mais de 1 foto — permite o usuário escolher qual foto
 *   vai para a capa do PDF.
 */

import { AppState }        from '../../state.js';
import { renderCapaThumbs } from '../../form/upload-manager.js';

/**
 * Renderiza o card de legendas por foto.
 *
 * @param {string[]} legendas — array de legendas na ordem das fotos
 */
export function renderizarLegendas(legendas) {
  const card   = document.getElementById('captions-card');
  const lista  = document.getElementById('cap-list');
  if (!card || !lista) return;

  const legendasArr = Array.isArray(legendas) ? legendas : [];
  const fotos       = AppState.form.fotos;

  if (legendasArr.length === 0 || fotos.length === 0) {
    card.style.display = 'none';
    return;
  }

  // Salvar no AppState — consumido por pdf-core.js → pdf-utils.distribuirFotos()
  AppState.generation.legendasGeradas = legendasArr;

  lista.innerHTML = legendasArr.map((legenda, idx) => {
    const foto = fotos[idx];
    if (!foto) return '';

    return `
      <div class="cap-item">
        <img
          class="cap-thumb"
          src="${foto.src}"
          alt="Foto ${idx + 1}"
        />
        <p class="cap-text">${legenda || ''}</p>
      </div>
    `;
  }).filter(Boolean).join('');

  card.style.display = 'block';

  // Exibir seletor de capa se há mais de 1 foto
  _exibirSeletorCapa();
}

/**
 * Exibe o seletor de foto de capa do PDF se aplicável.
 * Só faz sentido quando há mais de 1 foto (com 1 foto não há escolha).
 */
function _exibirSeletorCapa() {
  const seletor = document.getElementById('capa-selector');
  if (!seletor) return;

  if (AppState.form.fotos.length > 1) {
    seletor.style.display = 'block';
    renderCapaThumbs();
  } else {
    seletor.style.display = 'none';
  }
}
