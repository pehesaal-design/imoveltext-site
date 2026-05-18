/**
 * MÓDULO: OpenAI Client — Cliente da IA
 * RESPONSABILIDADE: Enviar prompt + fotos para a Edge Function e retornar JSON parseado
 * DEPENDÊNCIAS:
 *   - config.js (EDGE_FUNCTION)
 *   - auth/auth.js (getSupabase — para obter o token de sessão)
 * IMPACTO: Ponto único de contato com a API externa
 *
 * ARQUITETURA DA CHAMADA:
 *   Browser → POST Edge Function Supabase → OpenAI API → resposta JSON
 *
 *   A chave da OpenAI fica no servidor (Edge Function) — nunca exposta
 *   no cliente. O browser só conhece a URL da Edge Function e envia
 *   o token de sessão do Supabase para autenticação.
 *
 * PAYLOAD ENVIADO PARA A EDGE FUNCTION:
 *   {
 *     prompt: string,          — prompt completo montado por buildPrompt()
 *     fotos:  string[],        — array de base64 das imagens (inline_data)
 *   }
 *
 * RESPOSTA ESPERADA DA EDGE FUNCTION:
 *   JSON puro com os campos definidos em formato-resposta.js:
 *   { titulo, corpo, sugestoes, hashtags, legendas }
 *
 * RESILIÊNCIA — parseResposta():
 *   A IA às vezes retorna texto antes do JSON (ex: "Aqui está o resultado:").
 *   O parser tenta JSON.parse direto primeiro, depois usa regex para
 *   extrair o bloco JSON da resposta, e por último aplica defaults
 *   para campos ausentes — garantindo que o resultado sempre exibe
 *   algo útil mesmo com resposta parcialmente malformada.
 *
 * TIMEOUT:
 *   AbortController com 30 segundos — sem isso requests podem travar
 *   indefinidamente em conexões lentas ou mobile.
 */

import { EDGE_FUNCTION } from '../config.js';
import { getSupabase }   from '../auth/auth.js';

// Envolve uma promise com timeout. Limpa o timer quando a promise original
// vence, evitando timer leaks e unhandled rejections.
function _withTimeout(promise, ms, message) {
  let id;
  const timer = new Promise((_, reject) => {
    id = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timer]).finally(() => clearTimeout(id));
}

/**
 * Envia prompt e fotos para a Edge Function e retorna a resposta da IA.
 *
 * @param {string}   prompt — prompt completo gerado por buildPrompt()
 * @param {Object[]} fotos  — array de { src: base64 } das fotos enviadas
 * @returns {Promise<Object>} — objeto JSON parseado com campos do anúncio
 * @throws {Error} se a requisição falhar ou exceder o timeout
 */
export async function chamarIA(prompt, fotos = []) {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 60_000);

  try {
    const sb = getSupabase();

    // getSession pode travar se o Supabase renova o JWT em rede instável.
    // _withTimeout garante que o catch/finally sempre executa e limpa o timer
    // quando getSession vence a corrida (evita leak e unhandled rejection).
    const { data: { session } } = await _withTimeout(
      sb.auth.getSession(),
      10_000,
      'Sessão não respondeu. Recarregue a página e tente novamente.'
    );
    const token = session?.access_token || '';

    const response = await fetch(EDGE_FUNCTION, {
      method:  'POST',
      signal:  controller.signal,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt,
        fotos: fotos.map(f => f.src),
      }),
    });

    if (!response.ok) {
      throw new Error(`Edge Function retornou status ${response.status}`);
    }

    const raw = await response.text();
    return parseResposta(raw);

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('A geração demorou mais de 60 segundos. Tente novamente.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Faz o parse resiliente da resposta da IA.
 *
 * ESTRATÉGIA (3 tentativas em cascata):
 *   1. JSON.parse direto — funciona quando a IA retorna JSON puro
 *   2. Regex para extrair bloco {...} — funciona quando há texto antes/depois
 *   3. Defaults — retorna objeto com campos vazios para não travar a UI
 *
 * @param {string} raw — resposta bruta da Edge Function (texto)
 * @returns {Object} — { titulo, corpo, sugestoes, hashtags, legendas }
 */
export function parseResposta(raw) {
  // Tentativa 1: JSON puro
  try {
    const parsed = JSON.parse(raw);
    return _aplicarDefaults(parsed);
  } catch {
    // continua para tentativa 2
  }

  // Tentativa 2: extrair bloco JSON via regex
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return _aplicarDefaults(parsed);
    }
  } catch {
    // continua para defaults
  }

  // Tentativa 3: fallback com defaults
  console.warn('[openai-client] Não foi possível parsear a resposta da IA. Usando defaults.');
  return _defaults();
}

/**
 * Garante que todos os campos esperados existam no objeto parseado.
 * Campos ausentes recebem valores default — a UI nunca quebra por campo faltando.
 *
 * @param {Object} obj — objeto parcialmente parseado
 * @returns {Object} — objeto completo com todos os campos garantidos
 */
function _aplicarDefaults(obj) {
  const d = _defaults();
  return {
    titulo:    obj.titulo   || d.titulo,
    corpo:     obj.corpo    || d.corpo,
    sugestoes: Array.isArray(obj.sugestoes) ? obj.sugestoes : d.sugestoes,
    hashtags: {
      local:  Array.isArray(obj.hashtags?.local)  ? obj.hashtags.local  : [],
      tipo:   Array.isArray(obj.hashtags?.tipo)   ? obj.hashtags.tipo   : [],
      perfil: Array.isArray(obj.hashtags?.perfil) ? obj.hashtags.perfil : [],
    },
    legendas: Array.isArray(obj.legendas) ? obj.legendas : d.legendas,
  };
}

/** Objeto de defaults — usado quando o parse falha completamente. */
function _defaults() {
  return {
    titulo:    '',
    corpo:     '',
    sugestoes: [],
    hashtags:  { local: [], tipo: [], perfil: [] },
    legendas:  [],
  };
}
