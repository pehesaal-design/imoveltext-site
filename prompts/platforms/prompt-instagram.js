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

export const PROMPT_INSTAGRAM = `PLATAFORMA: Instagram (feed/stories)
O texto deve ter EXATAMENTE 4 blocos separados por linha em branco:

BLOCO 1 — GANCHO (até 125 caracteres — aparece antes do "ver mais"):
Frase aspiracional ou pergunta vivencial que para o scroll.
Cenário de uso: "Já imaginou acordar com essa vista todo dia..."
PROIBIDO começar com dados técnicos como quartos ou metragem.

BLOCO 2 — CORPO (3 a 5 linhas):
Descrição dos ambientes e sensações baseadas nas fotos e dados.
Diferenciais principais do imóvel. Máximo 3 emojis distribuídos.

BLOCO 3 — CHECKLIST DE DADOS (lista com emojis de categoria):
Inclua TODOS os dados informados, sem omitir nenhum:
🏠 tipo · quartos · área | 📍 bairro | 💰 preço
🚗 vagas (se informado) | 🏢 condomínio (se informado) | 📋 IPTU (se informado)
✨ outros diferenciais das observações do corretor

BLOCO 4 — CTA (1 linha):
Convite para DM. Ex: "Manda 'QUERO' na DM que envio todos os detalhes 📩"

Total: 150 a 180 palavras. NÃO inclua hashtags no corpo — elas vão no campo separado.`;
