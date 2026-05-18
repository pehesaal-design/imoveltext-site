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
Verifique os dados informados acima e identifique informações ausentes
que tornariam o anúncio mais completo e convincente para o comprador.

REGRA PRINCIPAL: Sempre tente retornar pelo menos 1 sugestão útil,
a menos que o anúncio já contenha absolutamente todas as informações abaixo.

Verifique cada item da lista abaixo — se não foi mencionado em NENHUM campo
(nem no formulário, nem nas Observações), inclua como sugestão:

CHECKLIST — inclua na sugestão se ausente:
□ Vagas de garagem
□ Valor do condomínio
□ Valor do IPTU
□ Andar do imóvel (se apartamento)
□ Área de lazer no condomínio (piscina, academia, salão de festas, etc.)
□ Se o imóvel é mobiliado, semimobiliado ou vazio
□ Vista (mar, cidade, área verde, etc.)

ATENÇÃO — NÃO sugira se já informado:
- Se as Observações do corretor mencionam o item, está informado
- Se o campo do formulário está preenchido, está informado
- Nunca sugira tipo, bairro, preço, quartos, suítes ou área

Formato das sugestões: frases curtas e diretas.
Exemplo: "Informar o número de vagas de garagem."
Máximo 3 sugestões.`;
