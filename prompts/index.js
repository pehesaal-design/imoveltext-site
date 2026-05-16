/**
 * MÓDULO: Prompt Builder — Compositor Central
 * RESPONSABILIDADE: Montar o prompt completo a partir dos módulos independentes
 * DEPENDÊNCIAS: Todos os módulos de prompts/
 * IMPACTO: Ponto único de entrada para construção de prompts
 *
 * PRINCÍPIO:
 *   Cada seção do prompt é uma unidade editável independente.
 *   buildPrompt() é apenas o compositor — une as peças na ordem correta.
 *   Editar uma seção (ex: regras do Instagram) não toca nas outras.
 *
 * ORDEM DE COMPOSIÇÃO:
 *   1. Persona + análise de imagem (condicional: com/sem fotos)
 *   2. Dados do imóvel (injetados dinamicamente)
 *   3. Tom do anúncio (Família / Luxo / Investimento)
 *   4. Regras gerais (guardrails universais — todas as plataformas)
 *   5. Regras da plataforma (apenas 1 arquivo carregado por geração)
 *   6. Score + dicas (avaliação separada do copywriting)
 *   7. Instrução de legendas (condicional: só se nFotos > 0)
 *   8. Formato de resposta (schema JSON)
 *
 * OTIMIZAÇÃO DE TOKENS:
 *   - legendas.js só incluído se nFotos > 0
 *   - Apenas 1 arquivo de plataforma por geração (não todos os 4)
 *   - Dados "não informado" devem ser filtrados antes de chamar buildPrompt()
 *     para evitar tokens desnecessários (responsabilidade do form-manager.js)
 *
 * @param {Object} dados         — dados do imóvel coletados do formulário
 * @param {string} dados.tipo
 * @param {string} dados.finalidade
 * @param {string} dados.bairro
 * @param {string} dados.preco
 * @param {string} dados.quartos
 * @param {string} dados.suites
 * @param {string} dados.area
 * @param {string} dados.obs
 * @param {string} plataforma    — 'ZAP/OLX' | 'Instagram' | 'WhatsApp' | 'Site'
 * @param {string} tom           — 'Família' | 'Luxo' | 'Investimento'
 * @param {number} nFotos        — quantidade de fotos enviadas
 * @returns {string}             — prompt completo pronto para envio à IA
 */

import { buildPersona }          from './persona.js';
import { tomDesc }               from './tons.js';
import { REGRAS_GERAIS }         from './regras-gerais.js';
import { SCORE_INSTRUCTION }     from './score.js';
import { buildLegendaInstruction } from './legendas.js';
import { buildFormatoResposta }  from './formato-resposta.js';

import { PROMPT_ZAP_OLX }    from './platforms/prompt-zap-olx.js';
import { PROMPT_INSTAGRAM }  from './platforms/prompt-instagram.js';
import { PROMPT_WHATSAPP }   from './platforms/prompt-whatsapp.js';
import { PROMPT_SITE }       from './platforms/prompt-site.js';

/** Mapa de regras por plataforma — apenas 1 carregado por geração */
const PLATFORM_PROMPTS = {
  'ZAP/OLX':    PROMPT_ZAP_OLX,
  'Instagram':  PROMPT_INSTAGRAM,
  'WhatsApp':   PROMPT_WHATSAPP,
  'Site':       PROMPT_SITE,
};

/**
 * Monta os dados do imóvel como bloco de texto estruturado.
 * Campos vazios são incluídos como "Não informado" para que a IA
 * saiba o que o corretor optou por não preencher (diferente de esquecer).
 */
function buildDadosImovel(dados) {
  return `DADOS DO IMÓVEL:
Tipo: ${dados.tipo || 'Não informado'} | Finalidade: ${dados.finalidade || 'Não informado'} | Bairro: ${dados.bairro || 'Não informado'} | Preço: ${dados.preco || 'Não informado'} | Quartos: ${dados.quartos || 'Não informado'} | Suítes: ${dados.suites || 'Não informado'} | Área: ${dados.area ? dados.area + 'm²' : 'Não informado'} | Observações do corretor: ${dados.obs || 'Nenhuma'}`;
}

/**
 * Compositor central — produz o prompt completo.
 * Chamado por scripts/generator/generator.js antes de chamarGemini().
 */
export function buildPrompt(dados, plataforma, tom, nFotos) {
  const plataformaPrompt = PLATFORM_PROMPTS[plataforma] || PROMPT_ZAP_OLX;

  const blocos = [
    buildPersona(nFotos),
    buildDadosImovel(dados),
    `TOM: ${tomDesc(tom)}`,
    REGRAS_GERAIS,
    plataformaPrompt,
    SCORE_INSTRUCTION,
    buildLegendaInstruction(nFotos),   // string vazia se nFotos = 0
    buildFormatoResposta(plataforma, nFotos),
  ];

  // Filtrar blocos vazios (ex: legendas quando nFotos = 0)
  return blocos.filter(Boolean).join('\n\n');
}
