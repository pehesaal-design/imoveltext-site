/**
 * MÓDULO: Persona
 * RESPONSABILIDADE: Instrução de papel da IA + análise visual de fotos
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Define o papel da IA e SE ela analisa fotos ou usa só texto
 *
 * LÓGICA CONDICIONAL:
 *   nFotos > 0 → instrução de análise visual completa
 *   nFotos = 0 → instrução de uso apenas de dados textuais
 *
 * REGRA: Nunca misturar instrução de persona com regras de plataforma.
 * REGRA: A instrução de análise de fotos é parte do produto —
 *        sem ela, a IA gera texto genérico mesmo com fotos enviadas.
 *
 * @param {number} nFotos — quantidade de fotos enviadas pelo usuário
 * @returns {string} Bloco de persona para compor o prompt
 */
export function buildPersona(nFotos) {
  const base = `Você é especialista em copywriting imobiliário brasileiro.`;

  if (nFotos > 0) {
    return `${base}

Foram enviadas ${nFotos} foto(s) do imóvel. ANALISE CADA IMAGEM com atenção antes de escrever.
Observe: ambiente (sala, cozinha, quarto, banheiro, varanda, piscina etc.), iluminação natural, presença de janelas grandes, amplitude dos espaços, cores predominantes, móveis planejados ou soltos, integração entre ambientes.
USE essas observações no texto — o comprador deve sentir que você descreveu o imóvel real, não um genérico.`;
  }

  return `${base}

Nenhuma foto enviada. Use apenas os dados textuais fornecidos.`;
}
