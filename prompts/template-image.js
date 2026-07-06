/**
 * MÓDULO: Template Image Prompt
 * RESPONSABILIDADE: Prompt para segunda chamada à IA — textos do flyer Instagram
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Acoplado ao parseamento em image-generator.js — mudanças no schema
 *          exigem atualização do _parseTemplateResposta() correspondente.
 *
 * @param {Object} dados — dados do imóvel coletados de AppState.lastGeneration
 * @returns {string} Prompt completo para envio à IA
 */
export function buildTemplatePrompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere os textos para um post de Instagram imobiliário com base estritamente nos dados abaixo.

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

As observações do corretor são a fonte mais importante — use tudo que estiver ali para gerar textos mais precisos e impactantes.

REGRAS OBRIGATÓRIAS:
1. Use APENAS informações presentes nos dados acima — NUNCA invente características
2. titulo: frase curta de 4 a 6 palavras, emocional e específica do imóvel
   Tom: aspiracional, como se estivesse vendendo um estilo de vida
   Ex: "Acorde com vista para o mar", "Seu refúgio no coração da cidade", "Espaço e conforto na Pituba"
   NUNCA use títulos genéricos como "Alto Padrão" ou "Excelente Imóvel"
   NUNCA use letras maiúsculas em todo o título
3. subtitulo: frase descritiva de até 6 palavras com tipo + bairro + cidade
   Ex: "Apartamento de 3 quartos na Barra, Salvador"
4. descricao: frase de 6 a 10 palavras destacando o principal diferencial REAL do imóvel
   Deve ser concreta, específica e despertar desejo
   Ex: "Vista privilegiada para o mar e o Farol da Barra"
5. diferenciais: 4 itens baseados nos dados reais informados
   Priorizar: vista, vagas, lazer, suítes, área, localização, mobília
   titulo: até 3 palavras em maiúsculas
   sub: detalhe concreto e curto baseado nos dados
6. Responder SOMENTE JSON puro, sem markdown

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.
Exemplos: 'na Barra', 'na Pituba', 'no Itaigara', 'no Horto', 'na Graça', 'no Rio Vermelho'.

{"titulo":"frase emocional de 4 a 6 palavras","subtitulo":"tipo + bairro + cidade","descricao":"diferencial real e específico","diferenciais":[{"titulo":"DIFERENCIAL 1","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 2","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 3","sub":"detalhe concreto"},{"titulo":"DIFERENCIAL 4","sub":"detalhe concreto"}]}`;
}

/**
 * Prompt para o Template 2 — layout escuro elegante.
 * SCHEMA RETORNADO:
 *   titulo_linha1    → string, abertura suave (1-3 palavras)
 *   titulo_linha2    → string, destaque em dourado
 *   titulo_linha3    → string, complemento (1-3 palavras)
 *   subtitulo_normal → string, frase descritiva normal
 *   subtitulo_dourado → string, parte em dourado
 *   diferenciais     → array[3]: { titulo, texto_normal, texto_dourado }
 */
export function buildTemplate2Prompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere os textos para um post de Instagram imobiliário (layout escuro elegante) com base estritamente nos dados abaixo.

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
2. titulo_linha1: 1 a 3 palavras de abertura, tom suave e aspiracional
   Ex: "Viva com", "Desperte para", "Seu novo lar"
3. titulo_linha2: palavra ou expressão de impacto que ficará em dourado — o diferencial principal
   Ex: "vista pro mar", "espaço e conforto", "alto padrão"
4. titulo_linha3: complemento curto de 1 a 3 palavras que fecha a ideia
   Ex: "todos os dias", "na melhor localização", "com lazer completo"
5. subtitulo_normal: início de frase descritiva natural, máx 8 palavras
6. subtitulo_dourado: parte final mais impactante da frase, em dourado
7. diferenciais: exatamente 3 itens baseados nos dados reais
   titulo: palavra-chave em maiúsculas
   texto_normal: início natural da frase
   texto_dourado: parte final impactante em dourado
8. Responder SOMENTE JSON puro, sem markdown

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.

{"titulo_linha1":"abertura suave","titulo_linha2":"destaque dourado","titulo_linha3":"complemento","subtitulo_normal":"frase descritiva normal","subtitulo_dourado":"parte dourada impactante","diferenciais":[{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal","texto_dourado":"parte dourada"},{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal","texto_dourado":"parte dourada"},{"titulo":"PALAVRA-CHAVE","texto_normal":"texto normal","texto_dourado":"parte dourada"}]}`;
}

/**
 * Prompt para o Template 3 — layout claro, estilo editorial.
 * SCHEMA RETORNADO:
 *   titulo_normal  → string, parte normal do título
 *   titulo_dourado → string, parte em dourado do título
 *   subtitulo      → string, frase descritiva elegante
 *   diferenciais   → array[4]: { titulo, sub }
 */
export function buildTemplate3Prompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere os textos para um post de Instagram imobiliário (layout claro, estilo editorial) com base estritamente nos dados abaixo.

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
2. titulo_normal: parte inicial do título, tom elegante e aspiracional, máx 5 palavras
3. titulo_dourado: parte em dourado — o diferencial mais marcante do imóvel, máx 4 palavras
   Juntos formam uma frase fluida. Ex: titulo_normal="Viva com vista para" + titulo_dourado="o mar"
4. subtitulo: frase descritiva elegante e natural sobre o imóvel, máx 12 palavras
5. diferenciais: exatamente 4 itens baseados nos dados reais
   titulo: diferencial em maiúsculas
   sub: detalhe concreto e curto
6. Responder SOMENTE JSON puro, sem markdown

REGRA DE PREPOSIÇÃO: use sempre a preposição correta para o bairro.

{"titulo_normal":"parte normal do título","titulo_dourado":"parte dourada","subtitulo":"frase elegante e natural","diferenciais":[{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"},{"titulo":"DIFERENCIAL","sub":"detalhe curto"}]}`;
}

/**
 * Prompt para o Template 4 — Dark Premium (Navy & Dourado).
 * SCHEMA RETORNADO:
 *   titulo_linha1 → string: tipo do imóvel em 1-2 palavras
 *   titulo_linha2 → string: qualificador emocional em 2-4 palavras
 *   localizacao   → string: BAIRRO • CIDADE em maiúsculas
 */
export function buildTemplate4Prompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere os textos para um post de Instagram imobiliário (layout Dark Premium) com base estritamente nos dados abaixo.

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
2. titulo_linha1: o tipo do imóvel em 1 a 2 palavras curtas. Ex: "Casa", "Apartamento", "Cobertura"
3. titulo_linha2: qualificador emocional e específico de 2 a 4 palavras baseado nos dados reais
   Priorizar o principal diferencial: vista, localização, padrão, área, lazer
   Ex: "com Vista pro Mar", "Alto Padrão", "com Piscina Privativa"
   NUNCA use genéricos sem base nos dados
4. localizacao: BAIRRO • CIDADE em letras maiúsculas. Ex: "PITUBA • SALVADOR/BA"
5. Responder SOMENTE JSON puro, sem markdown

{"titulo_linha1":"tipo curto","titulo_linha2":"qualificador emocional","localizacao":"BAIRRO • CIDADE/UF"}`;
}

/**
 * Prompt para o Template 5 — Editorial Premium.
 * SCHEMA RETORNADO:
 *   titulo → string: headline editorial de 4-7 palavras
 */
export function buildTemplate5Prompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere o título editorial para um post de Instagram imobiliário com base nos dados abaixo.

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
2. titulo: headline editorial elegante de 4 a 7 palavras, estilo revista de arquitetura ou design
   Deve evocar o principal diferencial real do imóvel com tom aspiracional
   Ex: "Residência com Vista para o Mar", "Alto Padrão na Pituba", "Cobertura com Piscina Privativa"
   NUNCA use frases genéricas sem base nos dados
3. Responder SOMENTE JSON puro, sem markdown

{"titulo":"Headline editorial elegante de 4 a 7 palavras"}`;
}

/**
 * Prompt para o Template 6 — Cristal Petróleo (glassmorphism + moldura dourada).
 * SCHEMA RETORNADO:
 *   titulo → string: qualificador emocional de 2-4 palavras exibido em dourado
 */
export function buildTemplate6Prompt(dados) {
  return `Você é um redator especialista em marketing imobiliário de alto padrão no Brasil.
Gere o qualificador dourado para um post de Instagram imobiliário com base nos dados abaixo.

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
2. titulo: qualificador emocional e específico de 2 a 4 palavras exibido em dourado abaixo do tipo do imóvel
   Priorizar o principal diferencial real: vista, localização, padrão, área, lazer
   Ex: "com Vista pro Mar", "Alto Padrão", "com Piscina Privativa", "Cobertura Exclusiva"
   NUNCA use genéricos sem base nos dados
3. Responder SOMENTE JSON puro, sem markdown

{"titulo":"qualificador emocional de 2 a 4 palavras"}`;
}
