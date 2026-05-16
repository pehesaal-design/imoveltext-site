/**
 * MÓDULO: Legendas
 * RESPONSABILIDADE: Instrução de geração de legendas por foto enviada
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Afeta as legendas no card de resultado E a qualidade do PDF
 *
 * DUPLO USO DAS LEGENDAS — CRÍTICO:
 *   1. render-legendas.js → exibe thumbnail + texto na UI (card de resultado)
 *   2. pdf-utils.classificarAmbiente() → usa o texto da legenda para
 *      identificar o ambiente (sala, cozinha, quarto...) e ordenar as
 *      fotos do PDF em narrativa coerente.
 *
 *   Portanto: a qualidade das legendas impacta diretamente a qualidade
 *   do PDF. Palavras-chave como "piscina", "sala", "cozinha" devem
 *   aparecer nas legendas para que a classificação funcione.
 *
 * REGRA: Este módulo só é incluído em buildPrompt() quando nFotos > 0.
 *        Se não há fotos, não há legendas — economiza tokens.
 *
 * PROIBIÇÕES nas legendas:
 *   - Não mencionar bairro ou cidade (é dado do anúncio, não da foto)
 *   - Não especular materiais sem certeza visual
 *   - Não repetir o mesmo texto para fotos diferentes
 *
 * @param {number} nFotos — quantidade de fotos enviadas
 * @returns {string} Instrução de legendas para compor o prompt
 */
export function buildLegendaInstruction(nFotos) {
  if (nFotos === 0) return '';

  return `LEGENDAS: gere exatamente ${nFotos} legenda(s) na ordem das fotos enviadas.
Cada legenda: 2 a 3 frases descrevendo o ambiente capturado.
Observe e mencione: iluminação natural, cores predominantes, amplitude do espaço, móveis planejados ou soltos, integração entre ambientes, detalhes visuais marcantes.
Sem mencionar bairro ou cidade. Sem especular materiais sem confirmação visual clara.
As legendas serão usadas para identificar automaticamente os ambientes no PDF — inclua a palavra do ambiente (ex: "sala", "cozinha", "varanda", "piscina", "quarto") quando visível.`;
}
