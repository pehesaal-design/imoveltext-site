/**
 * MÓDULO: Formato de Resposta
 * RESPONSABILIDADE: Schema JSON esperado na resposta da IA
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Qualquer mudança aqui exige atualização do parseResposta()
 *          em scripts/api/gemini-client.js — são acoplados por contrato.
 *
 * CAMPOS DO JSON:
 *   titulo    → string, máx 80 chars: tipo + quartos + bairro + diferencial
 *   corpo     → string: texto do anúncio formatado para a plataforma
 *   hashtags  → object: { local[], tipo[], perfil[] } — 4 tags cada
 *   legendas  → array[nFotos]: uma legenda por foto, na ordem enviada
 *
 * HASHTAGS: sempre geradas no JSON, mesmo para ZAP/OLX e WhatsApp.
 * A filtragem de exibição é feita no cliente via platform-config.showHashtags.
 * Isso evita chamadas condicionais à IA e simplifica o parseResposta().
 *
 * CRÍTICO: "SOMENTE JSON puro" — sem markdown, sem texto antes ou depois.
 * A IA (Gemini) frequentemente retorna texto antes do JSON, por isso o
 * parseResposta() tem fallback regex. Mas a instrução aqui minimiza isso.
 *
 * @param {string} plataforma — plataforma selecionada (para referência no schema)
 * @param {number} nFotos — quantidade de fotos (define o tamanho do array legendas)
 * @returns {string} Instrução de formato de resposta para compor o prompt
 */
export function buildFormatoResposta(plataforma, nFotos) {
  const legendasSchema = nFotos > 0
    ? `"legendas":["legenda foto 1","legenda foto 2"${nFotos > 2 ? ',…' : ''}]`
    : `"legendas":[]`;

  return `Responda SOMENTE com JSON puro, sem markdown, sem texto antes ou depois:
{"titulo":"tipo+quartos+bairro+diferencial em até 80 chars",
 "corpo":"texto COMPLETO formatado para ${plataforma} — para Instagram deve conter obrigatoriamente os 4 blocos: abertura, corpo, lista visual com emojis e CTA",
 "hashtags":{"local":["#tag1","#tag2","#tag3","#tag4"],
              "tipo":["#tag1","#tag2","#tag3","#tag4"],
              "perfil":["#tag1","#tag2","#tag3","#tag4"]},
 ${legendasSchema}}`;
}
