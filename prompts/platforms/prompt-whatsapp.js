/**
 * MÓDULO: Prompt WhatsApp
 * RESPONSABILIDADE: Regras de copywriting para mensagem de corretor
 * DEPENDÊNCIAS: Nenhuma (módulo autossuficiente de texto)
 * IMPACTO: Afeta apenas anúncios gerados para WhatsApp
 *
 * CONTEXTO DE USO:
 *   Mensagem direta do corretor para o cliente — tom pessoal e rápido.
 *   O cliente recebe no WhatsApp e lê em segundos. Texto longo é ignorado.
 *   A brevidade é o principal diferencial desta plataforma.
 *
 * FRASE FINAL OBRIGATÓRIA E FIXA:
 *   "Segue também o material completo do imóvel em anexo."
 *
 *   Esta frase é CRÍTICA — ela contextualiza o envio do PDF junto com a
 *   mensagem, criando a integração narrativa entre o anúncio WhatsApp e
 *   o PDF profissional gerado pela plataforma. É a jornada completa do produto:
 *   mensagem curta → PDF detalhado.
 *   NÃO remover ou alterar esta frase.
 *
 * ESTRUTURA:
 *   1. Diferencial principal (1 frase impactante)
 *   2. Dados mais relevantes (2–3, os mais importantes)
 *   3. Pergunta de engajamento (convida a resposta)
 *   4. Frase final fixa (integração com PDF)
 *
 * LIMITE: máx 90 palavras (sem contar a frase final)
 * EMOJIS: máx 1 (tom pessoal, não de post)
 *
 * PROIBIÇÕES:
 *   - Texto longo (mais de 90 palavras)
 *   - Múltiplos emojis
 *   - Estrutura de post (blocos, checklist)
 *   - Hashtags
 *   - Linguagem de portal imobiliário
 */

export const PROMPT_WHATSAPP = `PLATAFORMA: WhatsApp (mensagem pessoal de corretor para cliente)
Estrutura obrigatória:
1. Diferencial principal em 1 frase direta e impactante
2. Os 2 ou 3 dados mais relevantes do imóvel (os que mais interessam ao perfil)
3. Pergunta de engajamento que convide o cliente a responder
4. Última linha OBRIGATÓRIA e FIXA, exatamente assim: "Segue também o material completo do imóvel em anexo."

Tom: conversa humana e direta, como um corretor falaria para um cliente conhecido.
Máximo 1 emoji. Máximo 90 palavras (sem contar a última linha). Sem hashtags. Sem estrutura de post.`;
