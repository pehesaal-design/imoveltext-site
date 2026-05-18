/**
 * MÓDULO: Render Sugestões
 * RESPONSABILIDADE: Renderizar o card de dicas fixas após cada geração
 * DEPENDÊNCIAS: Nenhuma (módulo puro de DOM)
 * IMPACTO: Afeta o card #score-card
 *
 * COMPORTAMENTO:
 *   Sempre exibe o card com dicas fixas — não depende da resposta da IA.
 */

const DICAS_FIXAS = [
  'Informar o valor do condomínio',
  'Informar o valor do IPTU',
  'Informar o número de vagas de garagem',
  'Informar se o imóvel é mobiliado ou vazio',
  'Informar o andar e se tem elevador (apartamentos)',
];

/**
 * Renderiza o card de dicas fixas.
 * Sempre exibido após a geração, independente dos dados informados.
 */
export function renderizarSugestoes() {
  const card  = document.getElementById('score-card');
  const corpo = document.getElementById('sugestoes-body');
  if (!card) return;

  if (corpo) {
    corpo.innerHTML = `<div class="score-body-inner"><div class="score-tips">${
      DICAS_FIXAS.map(d => `<div class="score-tip">${d}</div>`).join('')
    }</div></div>`;
  }

  card.style.display = 'block';
}
