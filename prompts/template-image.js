/**
 * MÓDULO: Template Image Prompt
 * RESPONSABILIDADE: Prompt para segunda chamada à IA — textos do flyer Instagram
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Acoplado ao parseamento em image-generator.js — mudanças no schema
 *          exigem atualização do _parseTemplateResposta() correspondente.
 *
 * SCHEMA RETORNADO:
 *   titulo       → string, máx 2 palavras em MAIÚSCULAS
 *   subtitulo    → string, frase curta ≤ 6 palavras
 *   descricao    → string, 4–8 palavras destacando o diferencial real
 *   diferenciais → array[4]: { titulo: string, sub: string }
 *
 * REGRA CRÍTICA: A IA deve usar APENAS dados fornecidos — nunca inventar
 * diferenciais. Esta restrição está no prompt E deve ser validada pelo
 * _parseTemplateResposta() ao aplicar defaults quando campos estão ausentes.
 *
 * @param {Object} dados — dados do imóvel coletados de AppState.lastGeneration
 * @returns {string} Prompt completo para envio à IA
 */
export function buildTemplatePrompt(dados) {
  return `Você é um especialista em marketing imobiliário de alto padrão.

Gere os textos para um flyer premium de Instagram com base estritamente nos dados abaixo.

DADOS DO IMÓVEL:
- Tipo: ${dados.tipo || 'Não informado'}
- Bairro: ${dados.bairro || 'Não informado'}
- Preço: ${dados.preco || 'Não informado'}
- Quartos: ${dados.quartos || 'Não informado'}
- Suítes: ${dados.suites || 'Não informado'}
- Área: ${dados.area ? dados.area + ' m²' : 'Não informado'}

REGRAS OBRIGATÓRIAS — leia com atenção:
1. Use APENAS informações presentes nos dados acima — nunca invente características
2. Os 4 diferenciais devem refletir o que foi informado; repita os mais importantes se necessário
3. titulo: máximo 2 palavras, MAIÚSCULAS, impactante (ex: "VISTA MAR", "ALTO PADRÃO")
4. subtitulo: frase curta de até 6 palavras descrevendo o imóvel e localização
5. descricao: 4 a 8 palavras destacando O PRINCIPAL diferencial real disponível nos dados
6. Responder SOMENTE JSON puro, sem markdown, sem texto antes ou depois

Responda SOMENTE com este JSON:
{"titulo":"MÁXIMO DUAS PALAVRAS","subtitulo":"frase descritiva de até 6 palavras","descricao":"4 a 8 palavras com o principal diferencial","diferenciais":[{"titulo":"DIFERENCIAL 1","sub":"detalhe curto"},{"titulo":"DIFERENCIAL 2","sub":"detalhe curto"},{"titulo":"DIFERENCIAL 3","sub":"detalhe curto"},{"titulo":"DIFERENCIAL 4","sub":"detalhe curto"}]}`;
}
