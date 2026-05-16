/**
 * MÓDULO: Render Score
 * RESPONSABILIDADE: Renderizar o card de score com barra de progresso e dicas
 * DEPENDÊNCIAS: Nenhuma (puro DOM)
 * IMPACTO: Afeta o card #score-card
 *
 * THRESHOLDS DE COR:
 *   score ≥ 75 → verde  (.good) — anúncio bem preenchido
 *   score ≥ 50 → âmbar  (.mid)  — pode melhorar
 *   score < 50 → vermelho (.low) — dados insuficientes
 *
 * BARRA DE PROGRESSO:
 *   Animada via CSS transition (width de 0% → valor real).
 *   A transição de 0.8s é definida em generator.css (.score-bar-fill).
 *
 * DICAS:
 *   Geradas pela IA apenas sobre dados ausentes.
 *   Nunca criticam o que o corretor já informou.
 *   Exibidas como lista com seta verde →
 */

/**
 * Renderiza o card de score.
 *
 * @param {number}   score — valor 0–100 calculado pela IA
 * @param {string[]} dicas — array de até 3 sugestões sobre dados faltantes
 */
export function renderizarScore(score, dicas) {
  const card   = document.getElementById('score-card');
  const badge  = document.getElementById('score-badge');
  const bar    = document.getElementById('score-bar');
  const tipsEl = document.getElementById('score-tips');

  if (!card) return;

  const valor = Math.min(100, Math.max(0, Number(score) || 0));

  // Badge com emoji e classe de cor
  if (badge) {
    const { emoji, cls, label } = _scoreConfig(valor);
    badge.className = `score-badge ${cls}`;
    badge.textContent = `${emoji} ${valor} pts — ${label}`;
  }

  // Barra de progresso — inicia em 0 e anima para o valor real
  if (bar) {
    bar.style.width = '0%';
    // rAF garante que a transição CSS dispare corretamente
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = `${valor}%`;
      });
    });
  }

  // Dicas contextuais
  if (tipsEl) {
    const dicasArr = Array.isArray(dicas) ? dicas.filter(Boolean) : [];
    tipsEl.innerHTML = dicasArr.map(dica =>
      `<div class="score-tip">${dica}</div>`
    ).join('');
  }

  card.style.display = 'block';
}

/**
 * Retorna emoji, classe CSS e label descritivo conforme o score.
 */
function _scoreConfig(valor) {
  if (valor >= 75) return { emoji: '🟢', cls: 'good', label: 'Ótimo'    };
  if (valor >= 50) return { emoji: '🟡', cls: 'mid',  label: 'Bom'      };
  return              { emoji: '🔴', cls: 'low',  label: 'Incompleto' };
}
