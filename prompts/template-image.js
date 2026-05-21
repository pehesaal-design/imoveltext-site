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
  return `Você é um especialista em marketing imobiliário premium.
Gere os textos para um flyer de Instagram com base estritamente nos dados abaixo.

DADOS DO IMÓVEL:
- Tipo: ${dados.tipo || 'Não informado'}
- Bairro: ${dados.bairro || 'Não informado'}
- Cidade: ${dados.cidade || 'Salvador/BA'}
- Preço: ${dados.preco || 'Não informado'}
- Quartos: ${dados.quartos || 'Não informado'}
- Suítes: ${dados.suites || 'Não informado'}
- Área: ${dados.area ? dados.area + ' m²' : 'Não informado'}
- Vagas: ${dados.vagas || 'Não informado'}
- Observações do corretor: ${dados.obs || 'Nenhuma'}

ATENÇÃO — As observações do corretor contêm informações extras como vista,
condomínio, lazer, mobília, andar, diferenciais do imóvel. Use tudo que
estiver ali para gerar textos mais precisos e impactantes.

REGRAS OBRIGATÓRIAS:
1. Use APENAS informações presentes nos dados acima — NUNCA invente
2. titulo: até 4 palavras em MAIÚSCULAS, impactante e específico do imóvel
   Ex: "VISTA MAR NA BARRA", "3 SUÍTES NO ITAIGARA", "COBERTURA COM PISCINA"
   NUNCA use títulos genéricos como "ALTO PADRÃO" ou "EXCELENTE IMÓVEL"
3. subtitulo: frase de até 8 palavras descrevendo tipo + bairro + cidade
   Ex: "Apartamento de 3 quartos na Barra, Salvador"
4. descricao: frase de 5 a 10 palavras destacando o principal diferencial REAL
   Deve ser algo específico e concreto, não genérico
   Ex: "Vista privilegiada para o mar e o Farol da Barra"
5. diferenciais: 4 itens baseados nos dados reais informados
   Priorizar: vista, vagas, lazer, suítes, área, localização, mobília
   titulo: até 3 palavras em MAIÚSCULAS
   sub: detalhe concreto e curto baseado nos dados
6. Responder SOMENTE JSON puro, sem markdown

{"titulo":"ATÉ 4 PALAVRAS IMPACTANTES","subtitulo":"tipo + bairro + cidade em até 8 palavras","descricao":"diferencial real e específico em 5 a 10 palavras","diferenciais":[{"titulo":"DIFERENCIAL 1","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 2","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 3","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 4","sub":"detalhe concreto"}]}`;
}
