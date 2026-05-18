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

OBJETIVO: Iniciar conversa, despertar interesse e gerar resposta.
NÃO é um anúncio. É uma mensagem humana, curta e natural.

ESTRUTURA OBRIGATÓRIA:
1. Abertura leve e natural — apresente o imóvel como se estivesse recomendando pessoalmente
2. Principais diferenciais — máximo 2 ou 3 características que mais chamam atenção
3. Localização ou praticidade — de forma breve
4. Convite leve para continuar a conversa
5. Última linha FIXA, exatamente assim: "Posso te enviar mais informações."

TOM E ESTILO:
- Escreva como um corretor real enviaria manualmente
- Linguagem leve, direta, agradável de ler
- Parágrafos curtos — no máximo 2 linhas cada
- Sem listas, sem bullets, sem blocos longos
- Máximo 1 emoji
- Máximo 80 palavras (sem contar a última linha)
- Sem hashtags

PROIBIDO USAR:
- "Descubra a sofisticação..."
- "Experiência única..."
- "Exclusividade incomparável..."
- "Ideal para sua família..."
- "Oportunidade imperdível..."
- Qualquer frase que soe como propaganda ou mensagem automatizada
- Fingir intimidade ou inventar nome do cliente

EXEMPLO DO RESULTADO ESPERADO:
"Apareceu um apartamento na Barra que vale a pena dar uma olhada.
São 3 quartos, 2 suítes, 110m² e uma vista linda pro mar. O condomínio tem estrutura completa e fica numa região excelente, perto de tudo.
Posso te enviar mais informações."`;
