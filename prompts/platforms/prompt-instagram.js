/**
 * MÓDULO: Prompt Instagram
 * RESPONSABILIDADE: Regras de copywriting para posts no Instagram
 * DEPENDÊNCIAS: Nenhuma (módulo autossuficiente de texto)
 * IMPACTO: Afeta apenas anúncios gerados para Instagram
 *
 * CONTEXTO DE USO:
 *   Feed/stories do Instagram — precisa parar o scroll antes do "ver mais".
 *   Os primeiros ~125 caracteres são o que aparece antes do truncamento.
 *   O gancho DEVE caber nesse espaço e ser aspiracional o suficiente
 *   para o usuário clicar em "ver mais".
 *
 * ESTRUTURA OBRIGATÓRIA — 4 BLOCOS SEPARADOS POR LINHA EM BRANCO:
 *
 *   BLOCO 1 — GANCHO (≤125 chars)
 *     Frase aspiracional ou pergunta vivencial.
 *     Ex: "Já imaginou acordar todo dia com vista pro mar..."
 *     Proibido: começar com dados técnicos (quartos, metragem).
 *
 *   BLOCO 2 — CORPO (3 a 5 linhas)
 *     Descrição de ambientes e sensações baseadas nas fotos.
 *     Diferenciais principais. 2–3 emojis distribuídos.
 *
 *   BLOCO 3 — CHECKLIST DE DADOS
 *     Lista com TODOS os dados informados — sem omissão.
 *     Emojis de categoria fixos:
 *       🏠 tipo · quartos · área
 *       📍 bairro
 *       💰 preço
 *       🚗 vagas (se informado)
 *       🏢 condomínio (se informado)
 *       📋 IPTU (se informado)
 *       ✨ outros diferenciais das observações
 *
 *   BLOCO 4 — CTA (1 linha)
 *     Convida para DM. Ex: "Manda 'QUERO' na DM que envio todos os detalhes 📩"
 *
 * LIMITE: 150–180 palavras no total
 * EMOJIS: máx 3 no bloco 2 (não contar os do checklist)
 *
 * HASHTAGS: geradas separadamente nos campos "hashtags" do JSON.
 *           NÃO incluir hashtags dentro do corpo do anúncio.
 *
 * PROIBIÇÕES:
 *   - Dados técnicos no gancho (quebra o efeito de parar o scroll)
 *   - CTA antes do checklist
 *   - Mais de 3 emojis fora do checklist
 *   - Texto corrido sem os 4 blocos separados
 */

export const PROMPT_INSTAGRAM = `PLATAFORMA: Instagram (feed)

OBJETIVO: Legenda imobiliária moderna, elegante e postável.
Deve parecer escrita por um corretor premium — nunca por uma IA.

ESTRUTURA OBRIGATÓRIA — 4 blocos separados por linha em branco:

BLOCO 1 — ABERTURA (até 125 caracteres — aparece antes do "ver mais"):
Frase que gera curiosidade, desejo ou cena mental.
Exemplos de estrutura (não copiar exatamente — variar):
"Já imaginou...", "Tem imóveis que...", "Difícil não imaginar...", "Poucos imóveis conseguem..."
PROIBIDO começar com dados técnicos como quartos ou metragem.

BLOCO 2 — CORPO (3 a 5 linhas):
Integre os diferenciais reais de forma natural.
Faça o leitor imaginar: iluminação, vista, conforto, localização, rotina.
Misture emoção e informação. Máximo 3 emojis distribuídos.
Pareça humano, elegante e atual — nunca uma propaganda.

BLOCO 3 — LISTA VISUAL com os dados principais:
📍 Bairro
🛏 Quartos | Suítes
📐 Área (m²)
🚗 Vagas (se informado)
🏊 Diferenciais relevantes (se informado)
💰 Condomínio (se informado)
🧾 IPTU (se informado)
Inclua apenas os dados que foram informados. Omita os ausentes.

BLOCO 4 — CTA (1 linha):
Convite leve para DM ou WhatsApp.
Ex: "Manda 'QUERO' na DM que envio todos os detalhes 📩"

TOTAL: 150 a 180 palavras.

PROIBIDO USAR: "Descubra", "Encante-se", "Imperdível", "Luxuoso",
"Oportunidade única", "Exclusividade", "Venha conhecer", "Não perca", "Seu sonho".
Evitar: excesso de emojis, cara de propaganda, frases robóticas,
excesso de adjetivos, linguagem corporativa.

ATENÇÃO: NÃO inclua hashtags no corpo do texto.
As hashtags são geradas separadamente em outro campo do JSON.`;
