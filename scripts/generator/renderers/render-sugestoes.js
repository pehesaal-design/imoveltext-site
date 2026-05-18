/**
 * MÓDULO: Render Sugestões
 * RESPONSABILIDADE: Renderizar o card de sugestões de melhoria do anúncio
 * DEPENDÊNCIAS: Nenhuma (módulo puro de DOM)
 * IMPACTO: Afeta o card #score-card
 *
 * COMPORTAMENTO:
 *   Array vazio → card oculto (anúncio já tem dados suficientes)
 *   Com itens  → lista de informações ausentes que melhorariam o anúncio
 */

/**
 * Renderiza o card de sugestões de melhoria.
 * Oculta o card se não há sugestões.
 *
 * @param {string[]} sugestoes — array de sugestões geradas pela IA
 */
export function renderizarSugestoes(sugestoes) {
  const card  = document.getElementById('score-card');
  const corpo = document.getElementById('sugestoes-body');
  if (!card) return;

  const lista = Array.isArray(sugestoes) ? sugestoes.filter(Boolean) : [];

  if (lista.length === 0) {
    card.style.display = 'none';
    return;
  }

  if (corpo) {
    corpo.innerHTML = lista
      .map(s => `<div class="sugestao-item">${s}</div>`)
      .join('');
  }

  card.style.display = 'block';
}
