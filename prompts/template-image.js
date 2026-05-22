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

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.
Exemplos: 'na Barra', 'na Pituba', 'no Itaigara', 'no Horto',
'na Graça', 'no Rio Vermelho'. NUNCA use 'em Barra' ou 'em Pituba'.

{"titulo":"ATÉ 4 PALAVRAS IMPACTANTES","subtitulo":"tipo + bairro + cidade em até 8 palavras","descricao":"diferencial real e específico em 5 a 10 palavras","diferenciais":[{"titulo":"DIFERENCIAL 1","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 2","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 3","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 4","sub":"detalhe concreto"}]}`;
}

/**
 * Prompt para o Template 2 — layout escuro com foto de fundo e diferenciais em lista.
 * SCHEMA RETORNADO:
 *   titulo_linha1    → string, palavra ou frase curta
 *   titulo_linha2    → string, palavra destaque em dourado
 *   titulo_linha3    → string, complemento
 *   subtitulo_normal → string, frase normal
 *   subtitulo_dourado → string, parte em dourado
 *   diferenciais     → array[3]: { titulo, texto_normal, texto_dourado }
 */
export function buildTemplate2Prompt(dados) {
  return `Você é um especialista em marketing imobiliário premium.
Gere os textos para um flyer de Instagram (Template 2 — layout escuro elegante) com base estritamente nos dados abaixo.

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

REGRAS OBRIGATÓRIAS:
1. Use APENAS informações presentes nos dados acima — NUNCA invente
2. titulo_linha1: palavra ou frase bem curta (1-3 palavras) em maiúsculas
3. titulo_linha2: palavra ou expressão de destaque que ficará em dourado — impactante
4. titulo_linha3: complemento curto (1-3 palavras)
5. subtitulo_normal: frase descritiva curta, máx 10 palavras
6. subtitulo_dourado: parte mais impactante da frase, em dourado
7. diferenciais: exatamente 3 itens baseados nos dados reais
   - titulo: palavra-chave em maiúsculas (ex: VISTA MAR, LAZER, SUÍTES)
   - texto_normal: início da frase descritiva
   - texto_dourado: parte final mais impactante (ficará em dourado)
8. Responder SOMENTE JSON puro, sem markdown

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.
Exemplos: 'na Barra', 'na Pituba', 'no Itaigara', 'no Horto',
'na Graça', 'no Rio Vermelho'. NUNCA use 'em Barra' ou 'em Pituba'.

{"titulo_linha1":"palavra curta","titulo_linha2":"DESTAQUE DOURADO","titulo_linha3":"complemento","subtitulo_normal":"frase descritiva normal","subtitulo_dourado":"parte dourada impactante","diferenciais":[{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal da frase","texto_dourado":"parte dourada."},{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal da frase","texto_dourado":"parte dourada."},{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal da frase","texto_dourado":"parte dourada."}]}`;
}

/**
 * Prompt para o Template 3 — layout claro minimalista com foto no topo e ícones.
 * SCHEMA RETORNADO:
 *   titulo_normal  → string, parte normal do título
 *   titulo_dourado → string, parte em dourado do título
 *   subtitulo      → string, frase descritiva curta
 *   diferenciais   → array[4]: { titulo, sub }
 */
export function buildTemplate3Prompt(dados) {
  return `Você é um especialista em marketing imobiliário premium.
Gere os textos para um flyer de Instagram (Template 3 — layout claro minimalista) com base estritamente nos dados abaixo.

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

REGRAS OBRIGATÓRIAS:
1. Use APENAS informações presentes nos dados acima — NUNCA invente
2. titulo_normal: parte inicial do título, frase impactante (máx 5 palavras)
3. titulo_dourado: parte em dourado do título — deve ser o diferencial mais marcante (máx 4 palavras)
   Ex: se o título é "Viva com vista para o mar", titulo_normal="Viva com vista para" e titulo_dourado="o mar"
4. subtitulo: frase descritiva curta e elegante sobre o imóvel, máx 12 palavras
5. diferenciais: exatamente 4 itens baseados nos dados reais
   - titulo: diferencial em maiúsculas (ex: QUARTOS, SUÍTES, ÁREA, VAGAS, LAZER)
   - sub: detalhe concreto e curto baseado nos dados (ex: "3 quartos", "92 m²")
6. Responder SOMENTE JSON puro, sem markdown

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.
Exemplos: 'na Barra', 'na Pituba', 'no Itaigara', 'no Horto',
'na Graça', 'no Rio Vermelho'. NUNCA use 'em Barra' ou 'em Pituba'.

{"titulo_normal":"parte normal do título","titulo_dourado":"parte dourada","subtitulo":"frase descritiva curta e elegante","diferenciais":[{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"}]}`;
}
