/**
 * MÓDULO: Regras Gerais
 * RESPONSABILIDADE: Guardrails universais de qualidade para todos os anúncios
 * DEPENDÊNCIAS: Nenhuma (módulo estático puro de texto)
 * IMPACTO: Afeta TODAS as plataformas igualmente — é o filtro de qualidade base
 *
 * REGRA: Este arquivo é completamente estático — sem parâmetros, sem lógica.
 * REGRA: Editar aqui afeta todas as plataformas simultaneamente.
 * REGRA: Nunca remover as regras de preposição regional — são diferencial de
 *        credibilidade para o público de Salvador/BA e outras cidades.
 *
 * POR QUE CADA REGRA EXISTE:
 *   "Sem asteriscos/markdown"  → IA tende a usar negrito — quebra o texto copiado
 *   "Sem frases clichê"        → "Imóvel dos sonhos" aparece em 90% dos anúncios
 *   "Sem inventar dados"       → Responsabilidade legal do corretor
 *   "Sem especular materiais"  → Não pode afirmar "mármore" sem confirmação
 *   Preposições regionais      → "Em Pituba" soa errado para quem é de Salvador
 */

export const REGRAS_GERAIS = `REGRAS OBRIGATÓRIAS (valem para todas as plataformas):
- Sem asteriscos, markdown ou negrito — EXCETO no Instagram onde quebras de linha e emojis são permitidos e necessários
- Sem frases clichê: "não perca", "imóvel dos sonhos", "oportunidade única", "imperdível", "realização de um sonho"
- Sem descrever sequência de ambientes ("ao entrar você verá...") a menos que o corretor tenha informado explicitamente
- Sem inventar dados que não estão nos dados fornecidos nem visíveis nas fotos
- Sem especular materiais (mármore, granito, porcelanato) sem confirmação explícita
- Preposição correta conforme o bairro: use "na Pituba", "no Itaigara", "na Barra", "no Horto" — nunca "em Pituba" ou "em Itaigara"
- Finalidade ALUGUEL: use linguagem de locação — destaque praticidade,
  conforto, mobilidade e conveniência. PROIBIDO usar: "investimento",
  "patrimônio", "valorização", "aquisição", "oportunidade de negócio"
- Finalidade VENDA: pode usar linguagem de aquisição, valorização,
  patrimônio e investimento quando relevante
- O título deve ser natural e escaneável, nunca uma sequência seca de
  palavras. ERRADO: "Apartamento 3 quartos Barra vista mar".
  CORRETO: "Apartamento com vista mar e 3 quartos na Barra" ou
  "Apartamento mobiliado para aluguel na Graça"
- Quando finalidade for ALUGUEL, o título deve deixar isso explícito:
  "para aluguel" ou "para locação"`;
