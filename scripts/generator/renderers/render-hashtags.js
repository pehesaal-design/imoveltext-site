/**
 * MÓDULO: Render Hashtags
 * RESPONSABILIDADE: Renderizar o card de hashtags em 3 blocos semânticos
 * DEPENDÊNCIAS:
 *   - utils/clipboard.js (copiar)
 *   - state.js (AppState — para salvar hashtags e verificar plataforma)
 * IMPACTO: Afeta o card #hash-card
 *
 * EXIBIÇÃO CONDICIONAL:
 *   Exibido apenas para Instagram e Site (platform-config.showHashtags).
 *   Para ZAP/OLX e WhatsApp, o card permanece oculto mesmo que a IA
 *   tenha retornado hashtags (elas ficam salvas no AppState para uso futuro).
 *
 * ESTRUTURA DOS 3 BLOCOS:
 *   Local    → hashtags de localização (#pituba, #salvador...)
 *   Tipo     → hashtags do tipo de imóvel (#apartamento, #cobertura...)
 *   Perfil   → hashtags do comprador ideal (#investimento, #familia...)
 *
 * COPIAR TODAS:
 *   Copia todos os blocos juntos em uma única string,
 *   separados por espaço — pronto para colar no post do Instagram.
 */

import { copiar }   from '../../utils/clipboard.js';
import { AppState } from '../../state.js';

// Plataformas que exibem hashtags
const PLATAFORMAS_COM_HASHTAGS = new Set(['Instagram', 'Site']);

/**
 * Renderiza o card de hashtags.
 * Oculta o card se a plataforma não usa hashtags.
 *
 * @param {Object} hashtags  — { local: string[], tipo: string[], perfil: string[] }
 * @param {string} plataforma — plataforma selecionada
 */
export function renderizarHashtags(hashtags, plataforma) {
  const card = document.getElementById('hash-card');
  if (!card) return;

  // Ocultar para plataformas sem hashtags
  if (!PLATAFORMAS_COM_HASHTAGS.has(plataforma)) {
    card.style.display = 'none';
    return;
  }

  // Validar estrutura do objeto hashtags
  const local  = Array.isArray(hashtags?.local)  ? hashtags.local  : [];
  const tipo   = Array.isArray(hashtags?.tipo)   ? hashtags.tipo   : [];
  const perfil = Array.isArray(hashtags?.perfil) ? hashtags.perfil : [];

  // Salvar no AppState para uso futuro (ex: copiar hashtags depois)
  AppState.generation.hashtagsGeradas = { local, tipo, perfil };

  const bodyEl    = document.getElementById('hash-body');
  const btnCopiar = document.getElementById('btn-copiar-hashtags');

  if (bodyEl) {
    bodyEl.innerHTML = [
      { label: 'Localização',       tags: local  },
      { label: 'Tipo de imóvel',    tags: tipo   },
      { label: 'Perfil comprador',  tags: perfil },
    ]
    .filter(({ tags }) => tags.length > 0)
    .map(({ label, tags }) => `
      <div class="hash-group">
        <div class="hash-group-label">${label}</div>
        <div class="hash-tags">
          ${tags.map(tag => `<span class="hash-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Botão de copiar todas
  if (btnCopiar) {
    btnCopiar.onclick = () => {
      const todas = [...local, ...tipo, ...perfil].join(' ');
      copiar(todas, btnCopiar, 'Copiar todas');
    };
  }

  card.style.display = 'block';
}
