/**
 * MÓDULO: State — Estado Central da Aplicação
 * RESPONSABILIDADE: Fonte única de verdade para todo o estado da aplicação
 * DEPENDÊNCIAS: Nenhuma (módulo raiz sem imports)
 * IMPACTO: Todos os módulos que leem ou escrevem estado dependem deste arquivo
 *
 * SUBSTITUI as 12 variáveis globais do sistema original:
 *   currentUser, userCredits, isProUser      → AppState.auth.*
 *   fotos, plataforma, tomAnuncio            → AppState.form.*
 *   pendingGeneration, hashtagsGeradas,
 *   fotoCapaIdx                              → AppState.generation.*
 *   lastTitulo, lastCorpo, lastTipo,
 *   lastBairro, lastPreco, lastArea,
 *   lastQuartos, lastSuites                  → AppState.lastGeneration.*
 *   temaPDF                                  → AppState.pdf.*
 *
 * VANTAGENS SOBRE VARIÁVEIS GLOBAIS:
 *   - Rastreável: console.log(AppState) mostra todo o estado de uma vez
 *   - Encapsulado: nenhum módulo acessa estado sem importar este arquivo
 *   - Sem colisão: nomes estruturados evitam conflitos entre módulos
 *   - Auditável: mudanças de estado localizáveis via grep de 'AppState.'
 *
 * PADRÃO DE USO:
 *   import { AppState } from '../state.js';
 *   AppState.auth.currentUser = user;        // escrita
 *   const user = AppState.auth.currentUser;  // leitura
 *
 * REGRA: Nunca criar variáveis globais fora deste objeto.
 * REGRA: Nunca importar e desestruturar AppState em const separadas —
 *        isso quebra a reatividade (cópias não refletem atualizações).
 *   ❌  const { fotos } = AppState.form;  → cópia estática
 *   ✅  AppState.form.fotos               → sempre atualizado
 */

export const AppState = {

  // ── AUTH ───────────────────────────────────────────
  // Controlado por: scripts/auth/auth.js
  auth: {
    currentUser:  null,   // objeto de usuário do Supabase (null = não logado)
    userCredits:  0,      // créditos restantes (int)
    isProUser:    false,  // true = anúncios ilimitados + PDF desbloqueado
    accessToken:  '',     // token JWT cacheado — evita getSession() em cada geração
  },

  // ── FORM ───────────────────────────────────────────
  // Controlado por: scripts/form/form-manager.js e upload-manager.js
  form: {
    fotos:      [],           // array de { src: base64 } — até 15 fotos
    plataforma: 'ZAP/OLX',   // plataforma selecionada no toggle
    tomAnuncio: 'Família',    // tom selecionado no toggle
  },

  // ── GENERATION FLOW ────────────────────────────────
  // Controlado por: scripts/generator/generator.js e auth/auth.js
  generation: {
    pendingGeneration: false,  // true = disparar geração automática pós-login OAuth
    hashtagsGeradas:   [],     // array de hashtags para o card + legendas para PDF
    legendasGeradas:   [],     // legendas por foto (na ordem das fotos)
    fotoCapaIdx:       0,      // índice da foto selecionada como capa do PDF
  },

  // ── LAST GENERATION ────────────────────────────────
  // Populado por generator.js após geração bem-sucedida.
  // Consumido por pdf-core.js para montar os templates de capa.
  // CRÍTICO: pdf-core.js depende destes dados — não limpar entre gerações
  //          sem garantir que o PDF não está sendo gerado simultaneamente.
  lastGeneration: {
    titulo:  '',
    corpo:   '',
    tipo:    '',
    bairro:  '',
    preco:   '',
    area:    '',
    quartos: '',
    suites:  '',
  },

  // ── PDF ────────────────────────────────────────────
  // Controlado por: scripts/pdf/pdf-core.js e ui/ui-sync.js
  pdf: {
    tema:     'escuro',  // tema único
    corrData: {          // dados do corretor para o rodapé do PDF
      nome:  '',
      tel:   '',
      creci: '',
    },
  },

};

/**
 * Reseta o estado de geração antes de uma nova geração.
 * Chamado por generator.js no início de gerar().
 * Preserva auth e form — apenas limpa resultados anteriores.
 */
export function resetGenerationState() {
  AppState.generation.hashtagsGeradas = [];
  AppState.generation.legendasGeradas = [];
  AppState.generation.fotoCapaIdx     = 0;
  AppState.lastGeneration = {
    titulo:  '',
    corpo:   '',
    tipo:    '',
    bairro:  '',
    preco:   '',
    area:    '',
    quartos: '',
    suites:  '',
  };
}

/**
 * Salva o estado do formulário no sessionStorage antes do redirect OAuth.
 * Recebe os dados coletados pelo form-manager.coletarDadosForm() como
 * parâmetro — state.js não acessa o DOM diretamente.
 *
 * CRÍTICO: preserva o preenchimento do usuário durante o redirect OAuth.
 * Sem isso, o usuário perde tudo que preencheu ao fazer login.
 * Restaurado por restoreFormFromSession() em auth.js após o redirect.
 *
 * @param {Object} dadosForm — dados coletados pelo form-manager.coletarDadosForm()
 */
export function saveFormToSession(dadosForm) {
  const dados = {
    plataforma: AppState.form.plataforma,
    tomAnuncio: AppState.form.tomAnuncio,
    tipo:       dadosForm.tipo       || '',
    finalidade: dadosForm.finalidade || '',
    bairro:     dadosForm.bairro     || '',
    preco:      dadosForm.preco      || '',
    quartos:    dadosForm.quartos    || '',
    suites:     dadosForm.suites     || '',
    area:       dadosForm.area       || '',
    obs:        dadosForm.obs        || '',
    pending:    true,
  };
  sessionStorage.setItem('imoveltext_form', JSON.stringify(dados));
}

/**
 * Restaura o estado do formulário do sessionStorage após o redirect OAuth.
 * Chamado por auth.js em init() quando detecta retorno do OAuth.
 *
 * @returns {Object|null} Dados restaurados ou null se não havia dados salvos
 */
export function restoreFormFromSession() {
  const raw = sessionStorage.getItem('imoveltext_form');
  if (!raw) return null;

  try {
    const dados = JSON.parse(raw);
    sessionStorage.removeItem('imoveltext_form'); // limpar após restaurar
    return dados;
  } catch {
    sessionStorage.removeItem('imoveltext_form');
    return null;
  }
}
