/**
 * MÓDULO: Tons de Anúncio
 * RESPONSABILIDADE: Instrução de linguagem por perfil de comprador
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Afeta o tom de TODO o texto gerado pela IA
 *
 * TONS DISPONÍVEIS: 'Família' | 'Luxo' | 'Investimento'
 * Selecionado pelo usuário via toggle no formulário (gcard tom).
 * Injetado em buildPrompt() como bloco contextual.
 *
 * REGRA: Mudar o tom 'Luxo' não afeta 'Família' nem 'Investimento'.
 * REGRA: Nunca usar linguagem de um tom em outro — são perfis distintos.
 */

/**
 * Retorna a instrução de tom para a IA conforme o perfil selecionado.
 * @param {string} tom — 'Família' | 'Luxo' | 'Investimento'
 * @returns {string} Instrução de tom para compor o prompt
 */
export function tomDesc(tom) {
  const tons = {
    'Família': `Tom: caloroso e acolhedor, focado em qualidade de vida familiar. Destaque espaços, segurança, lazer e proximidade a escolas.`,

    'Luxo': `Tom: sofisticado e exclusivo, voltado para alto padrão. Use linguagem refinada, destaque diferenciais premium e transmita exclusividade.`,

    'Investimento': `Tom: racional, focado em retorno financeiro. Destaque rentabilidade, valorização, localização estratégica. Use dados concretos.`,
  };

  return tons[tom] || tons['Família'];
}
