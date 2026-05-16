/**
 * MÓDULO: Prompt ZAP / OLX
 * RESPONSABILIDADE: Regras de copywriting para portais imobiliários
 * DEPENDÊNCIAS: Nenhuma (módulo autossuficiente de texto)
 * IMPACTO: Afeta apenas anúncios gerados para ZAP/OLX
 *
 * CONTEXTO DE USO:
 *   Portais imobiliários são lidos por compradores em modo de busca ativa.
 *   O comprador já decidiu comprar — precisa de confirmação racional,
 *   não persuasão emocional. O diferencial na primeira frase serve para
 *   filtrar o lead qualificado antes que ele continue lendo.
 *
 * ESTRUTURA EXIGIDA:
 *   1. Diferencial principal (primeira frase — não dados técnicos)
 *   2. Storytelling sobre o imóvel
 *   3. Dados técnicos explícitos
 *   4. Localização contextualizada
 *   5. CTA direto
 *
 * PROIBIÇÕES:
 *   - Emojis (tom profissional de portal)
 *   - Markdown (asteriscos, negrito, listas com traço)
 *   - Linguagem aspiracional excessiva
 *   - Dados técnicos na primeira frase (filtro deve ser emocional/diferencial)
 *
 * LIMITE: máx 280 palavras
 */

export const PROMPT_ZAP_OLX = `PLATAFORMA: ZAP / OLX (portal imobiliário)
Estrutura obrigatória do corpo:
1. Diferencial principal na primeira frase — não comece com dados técnicos como quartos ou metragem
2. Descrição narrativa do imóvel baseada nas fotos e dados
3. Dados técnicos explícitos (quartos, área, vagas, condomínio se informado)
4. Localização contextualizada (bairro, proximidades relevantes se informadas)
5. CTA direto e profissional
Sem emojis. Sem markdown. Tom objetivo e profissional.
Máximo 280 palavras.`;
