/**
 * MÓDULO: Score
 * RESPONSABILIDADE: Instrução de avaliação de qualidade do anúncio (0–100)
 * DEPENDÊNCIAS: Nenhuma (módulo estático puro de texto)
 * IMPACTO: Afeta o score retornado e as dicas geradas pela IA
 *
 * ESCALA DE PONTOS:
 *   Localização: bairro (+10), cidade/estado (+5), referências próximas (+10)
 *   Preço:       preço (+10)
 *   Dados:       área (+8), quartos (+8), vagas (+6), condomínio (+8)
 *   Perfil:      tipo (+5), finalidade (+5)
 *   Fotos:       3+ fotos (+10), 5+ fotos (+5 adicional), ambientes variados (+10)
 *   Total máximo: 100
 *
 * CRÍTICO: A instrução "NÃO use valores fixos" é necessária porque a IA
 * tendia a sempre retornar 72 ou 85 independente dos dados.
 * O cálculo deve ser feito item a item, somando apenas os pontos dos
 * itens efetivamente presentes.
 *
 * DICAS: Geradas APENAS sobre o que está faltando — nunca criticar o que
 * o corretor já informou. Máximo 3 dicas, objetivas e acionáveis.
 */

export const SCORE_INSTRUCTION = `SCORE — calcule somando os pontos AGORA, item por item:
Bairro informado? +10 | Cidade/estado? +5 | Referências próximas nas obs? +10
Preço informado? +10 | Área m²? +8 | Quartos? +8 | Vagas nas obs? +6 | Condomínio/IPTU nas obs? +8
Tipo especificado? +5 | Finalidade? +5
Fotos: 3+? +10 | 5+? +5 adicional | Ambientes variados? +10
ATENÇÃO: calcule o valor REAL somando os pontos dos itens presentes. NÃO use valores fixos como 72 ou 85.

DICAS: gere exatamente 3 itens baseados SOMENTE no que está faltando (itens que não somaram pontos).
Nunca mencione como falta algo que já foi informado nos dados ou visível nas fotos.
Formato: frases curtas e acionáveis. Ex: "Adicione o número de vagas de garagem."`;
