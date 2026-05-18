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

OBJETIVO: Descrição completa, profissional e humana para portal imobiliário.
O comprador já está em modo de busca ativa — quer confirmar se vale a pena
entrar em contato. O texto deve transmitir credibilidade e despertar interesse.

IMPORTANTE: Os dados técnicos básicos (quartos, área, preço) já ficam nos
campos próprios do portal. A descrição deve ir além disso — mostrar o imóvel
de forma viva, destacar diferenciais e contextualizar a localização.

ESTRUTURA OBRIGATÓRIA — texto corrido em parágrafos curtos:

PARÁGRAFO 1 — ABERTURA (2 a 3 frases):
Apresente o imóvel destacando o principal diferencial logo de cara.
Contextualize: bairro, tipo, algo que chame atenção.
NÃO comece com "Este imóvel possui..." ou dados técnicos secos.
NÃO use linguagem corporativa: "sofisticado", "deslumbrante", "alto padrão".

PARÁGRAFO 2 — AMBIENTES E DIFERENCIAIS (3 a 4 frases):
Descreva os principais ambientes de forma objetiva e humana.
Integre naturalmente os dados relevantes: metragem, quartos, suítes, vagas.
Mencione acabamentos ou diferenciais apenas se informados pelo corretor.
Mencione se é mobiliado, reformado ou tem algo especial nas observações.

PARÁGRAFO 3 — CONDOMÍNIO E LOCALIZAÇÃO (2 a 3 frases):
Se houver infraestrutura de condomínio, mencione de forma fluida.
Contextualize a localização: proximidades, facilidades, o que o bairro oferece.
Se condomínio e IPTU foram informados, integre naturalmente neste parágrafo.

PARÁGRAFO 4 — CTA (1 frase):
Direto e profissional.
Ex: "Entre em contato para mais informações ou para agendar uma visita."

ESTILO:
- Texto corrido, sem listas, sem bullets, sem emojis
- Parágrafos curtos e escaneáveis
- Linguagem direta, humana e profissional
- Dados integrados no texto — não em lista separada
- SEM LIMITE RÍGIDO DE PALAVRAS — priorize completar todos os parágrafos
- PROIBIDO usar: "Descubra", "deslumbrante", "proporciona", "proporcionar",
  "perfeito para", "ideal para", "sofisticado", "alto padrão", "qualidade de vida",
  "momentos inesquecíveis", "estilo de vida", "experiência única"`;
