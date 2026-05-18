/**
 * MÓDULO: Sugestões de Melhoria
 * RESPONSABILIDADE: Instrução para a IA sugerir dados ausentes no anúncio
 * DEPENDÊNCIAS: Nenhuma (módulo puro de texto)
 * IMPACTO: Composto por prompts/index.js em buildPrompt()
 *
 * PRINCÍPIO:
 *   A IA só sugere campos genuinamente ausentes — se um dado aparece
 *   nas Observações do corretor, ele já está informado e não deve ser sugerido.
 *   O array vazio [] é o resultado esperado quando o anúncio está completo.
 */

export const SUGESTOES_INSTRUCTION = `SUGESTÕES DE MELHORIA:
Analise os dados informados acima e verifique se falta alguma informação
relevante que melhoraria significativamente o anúncio.

REGRAS OBRIGATÓRIAS:
- Retorne no máximo 3 sugestões
- Sugira APENAS informações que estão completamente ausentes nos dados
- Se um item estiver nas Observações do corretor, está informado — NÃO sugira
- Se um campo estiver preenchido, está informado — NÃO sugira
- Se não faltar nada relevante, retorne array vazio []
- Sugestões devem ser curtas e acionáveis

Informações que valem sugerir se ausentes:
- Número de vagas de garagem (se não mencionado em nenhum campo)
- Valor do condomínio (se não mencionado em nenhum campo)
- Valor do IPTU (se não mencionado em nenhum campo)
- Andar do imóvel, se apartamento (se não mencionado)
- Se tem área de lazer no condomínio (se não mencionado)
- Se o imóvel é mobiliado (se não mencionado)
- Vista ou orientação solar (se não mencionado)

NÃO sugira campos que já estão no formulário (tipo, bairro, preço,
quartos, suítes, área) — esses já são obrigatórios e visíveis para o corretor.`;
