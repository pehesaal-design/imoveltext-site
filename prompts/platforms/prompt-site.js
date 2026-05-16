/**
 * MÓDULO: Prompt Site
 * RESPONSABILIDADE: Regras de copywriting para texto SEO de site
 * DEPENDÊNCIAS: Nenhuma (módulo autossuficiente de texto)
 * IMPACTO: Afeta apenas anúncios gerados para Site
 *
 * CONTEXTO DE USO:
 *   Texto para página do imóvel no site do corretor ou imobiliária.
 *   Lido por compradores que chegaram via busca orgânica — já têm
 *   intenção de compra, mas querem se convencer da escolha.
 *   O texto deve ser longo o suficiente para SEO, mas narrativo o
 *   suficiente para converter.
 *
 * REFERÊNCIAS LOCAIS:
 *   São o maior diferencial do texto de site — contextualizar o bairro
 *   com referências reais (shoppings, parques, escolas, transporte) eleva
 *   a credibilidade e ajuda no ranqueamento local do Google.
 *   Usar apenas referências mencionadas nas observações do corretor ou
 *   que sejam notoriamente conhecidas do bairro.
 *
 * ESTRUTURA:
 *   1. Abertura emocional (parágrafo narrativo)
 *   2. Referências locais contextualizadas (bairro, proximidades)
 *   3. Dados do imóvel integrados no texto (não em lista)
 *   4. CTA final
 *
 * LIMITE: máx 400 palavras
 *
 * HASHTAGS: geradas separadamente no campo "hashtags" do JSON,
 *           para uso em posts relacionados. NÃO incluir no corpo.
 *
 * PROIBIÇÕES:
 *   - Emojis
 *   - Listas ou estrutura em blocos
 *   - Dados crus sem contextualização narrativa
 *   - Linguagem de chat ou post de rede social
 *   - Tom agressivo de venda
 */

export const PROMPT_SITE = `PLATAFORMA: Site (texto editorial SEO para página do imóvel)
Estrutura obrigatória em prosa contínua — sem blocos, sem listas:
1. Abertura emocional: parágrafo narrativo que situa o imóvel e cria desejo
2. Referências locais: contextualizar o bairro com proximidades relevantes mencionadas nas observações ou notoriamente conhecidas
3. Dados do imóvel integrados naturalmente no texto (quartos, área, diferenciais) — não em lista
4. CTA editorial final: convite para contato ou visita

Tom: narrativo, editorial, sofisticado — como um texto de revista de arquitetura e lifestyle.
Sem emojis. Sem markdown. Sem listas. Máximo 400 palavras.
Hashtags geradas separadamente — NÃO inclua no corpo do texto.`;
