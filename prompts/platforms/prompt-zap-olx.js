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

OBJETIVO: Anúncio direto, profissional e escaneável.
O leitor quer leitura rápida, objetiva e confiável — não uma propaganda emocional.
Deve parecer escrito por um corretor real, nunca por uma IA.

ESTRUTURA OBRIGATÓRIA:

1. ABERTURA (1 a 2 frases):
Apresente o imóvel de forma direta e humana, destacando o principal diferencial.
NÃO comece com dados técnicos como quartos ou metragem.
NÃO use linguagem emocional exagerada.

2. DESCRIÇÃO (2 a 3 parágrafos curtos):
Descreva os ambientes, diferenciais e localização de forma objetiva.
Integre os dados naturalmente no texto.
Mencione infraestrutura do condomínio se informada.
Mencione proximidades relevantes se informadas.

3. FICHA TÉCNICA (lista simples, sem emojis):
Mostre apenas os dados que foram informados. Omita os ausentes.
Formato:
Localização: bairro — cidade/UF
Área: Xm²
Quartos: X
Suítes: X (se informado)
Vagas: X (se informado)
Condomínio: R$ X (se informado)
IPTU: R$ X (se informado)

4. INFRAESTRUTURA (lista simples, se informada):
Liste os itens do condomínio ou diferenciais do imóvel.

5. CTA (1 linha):
Convite direto e profissional para contato ou visita.
Ex: "Entre em contato para mais informações ou agendar uma visita."

ESTILO:
- Sem emojis decorativos
- Sem markdown
- Sem floreios ou exageros emocionais
- Linguagem direta, humana e profissional
- Máximo 300 palavras`;
