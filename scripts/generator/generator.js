/**
 * MÓDULO: Generator — Orquestrador da Geração
 * RESPONSABILIDADE: Coordenar o fluxo completo de geração de anúncio
 * DEPENDÊNCIAS:
 *   - state.js            (AppState, resetGenerationState)
 *   - config.js           (FREE_CREDITS)
 *   - auth/auth.js        (decrementarCredito)
 *   - api/openai-client.js (chamarIA)
 *   - prompts/index.js    (buildPrompt)
 *   - form/form-manager.js (coletarDadosForm, coletarDadosCorretor)
 *   - ui/ui-sync.js       (sincronizarUI, setLoadingBtn, scrollParaResultado, atualizarAcessoPDF)
 *   - ui/ui-modals.js     (showSignupModal, showPaywall, closeSignupModal)
 *   - renderers/*         (renderizarAnuncio, Score, Hashtags, Legendas)
 * IMPACTO: Módulo central do produto — coordena todo o fluxo de geração
 *
 * ESTE MÓDULO NÃO:
 *   - Monta prompts (responsabilidade de prompts/index.js)
 *   - Faz chamadas à API (responsabilidade de openai-client.js)
 *   - Renderiza cards (responsabilidade dos renderers/)
 *   - Gerencia auth (responsabilidade de auth.js)
 *
 * ESTE MÓDULO APENAS:
 *   - Verifica pré-condições (auth, créditos)
 *   - Coordena a sequência de chamadas
 *   - Salva resultado no AppState
 *   - Trata erros de forma centralizada
 *
 * FLUXO COMPLETO:
 *   1. Verificar auth → se não logado: salvar form + abrir modal OAuth
 *   2. Verificar créditos → se vazio: abrir paywall
 *   3. Coletar dados do form
 *   4. Mostrar loading
 *   5. Montar prompt via buildPrompt()
 *   6. Chamar IA via chamarIA()
 *   7. Salvar resultado no AppState.lastGeneration
 *   8. Renderizar cards progressivamente
 *   9. Decrementar crédito em background
 *  10. Scroll para o resultado
 */

import { AppState, resetGenerationState } from '../state.js';
import { decrementarCredito }             from '../auth/auth.js';
import { chamarIA }                       from '../api/openai-client.js';
import { buildPrompt }                    from '../../prompts/index.js';
import { coletarDadosForm, coletarDadosCorretor } from '../form/form-manager.js';
import {
  sincronizarUI,
  setLoadingBtn,
  scrollParaResultado,
  atualizarAcessoPDF,
} from '../ui/ui-sync.js';
import {
  showSignupModal,
  showPaywall,
  closeSignupModal,
} from '../ui/ui-modals.js';
import { renderizarAnuncio }   from './renderers/render-anuncio.js';
import { renderizarSugestoes } from './renderers/render-sugestoes.js';
import { renderizarHashtags }  from './renderers/render-hashtags.js';
import { renderizarLegendas }  from './renderers/render-legendas.js';

// Guarda contra re-entrada: impede chamadas concorrentes a gerar()
let _gerando = false;

/**
 * Função principal de geração — chamada pelo botão "Gerar" e pelo
 * fluxo automático pós-login (pendingGeneration).
 */
export async function gerar() {
  if (_gerando) return;

  const { auth, form, generation } = AppState;

  // ── 1. VERIFICAR AUTH ─────────────────────────────
  if (!auth.currentUser) {
    AppState.generation.pendingGeneration = true;
    showSignupModal();
    return;
  }

  // ── 2. VERIFICAR CRÉDITOS ─────────────────────────
  if (!auth.isProUser && auth.userCredits <= 0) {
    showPaywall();
    return;
  }

  // ── 3. COLETAR DADOS ──────────────────────────────
  const dados    = coletarDadosForm();
  const corrData = coletarDadosCorretor();

  // Salvar dados do corretor no AppState para o PDF
  AppState.pdf.corrData = corrData;

  // ── 4. PREPARAR UI ────────────────────────────────
  _gerando = true;
  setLoadingBtn(true);

  try {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.style.display = 'block';

    resetGenerationState();
    _ocultarResultados();
    // ── 5. MONTAR PROMPT ───────────────────────────
    const nFotos = form.fotos.length;
    const prompt = buildPrompt(dados, dados.plataforma, dados.tom, nFotos);

    // ── 6. CHAMAR IA ───────────────────────────────
    const resultado = await chamarIA(prompt, form.fotos);

    // ── 7. SALVAR NO APPSTATE ──────────────────────
    AppState.lastGeneration = {
      titulo:  resultado.titulo  || '',
      corpo:   resultado.corpo   || '',
      tipo:    dados.tipo        || '',
      bairro:  dados.bairro      || '',
      preco:   dados.preco       || '',
      area:    dados.area        || '',
      quartos: dados.quartos     || '',
      suites:  dados.suites      || '',
    };

    // ── 8. RENDERIZAR PROGRESSIVAMENTE ────────────
    // Título + corpo primeiro — sensação de resposta rápida
    renderizarAnuncio(resultado.titulo, resultado.corpo);

    // Sugestões de melhoria
    renderizarSugestoes(resultado.sugestoes);

    // Hashtags (condicional por plataforma)
    renderizarHashtags(resultado.hashtags, dados.plataforma);

    // Legendas + seletor de capa
    renderizarLegendas(resultado.legendas);

    // Exibir botão PDF com estado correto (lock ou desbloqueado)
    _exibirBotaoPDF();
    atualizarAcessoPDF();

    // ── 9. DECREMENTAR CRÉDITO (background) ───────
    // Não await — não bloqueia a UI. Só decrementa após parse bem-sucedido.
    decrementarCredito();
    sincronizarUI();

    // ── 10. SCROLL PARA O RESULTADO ───────────────
    scrollParaResultado();

    // Limpar flag de geração pendente
    generation.pendingGeneration = false;
    closeSignupModal();

  } catch (err) {
    _exibirErro(err.message || 'Erro ao gerar o anúncio. Tente novamente.');
  } finally {
    _gerando = false;
    setLoadingBtn(false);
  }
}

// ── HELPERS PRIVADOS ──────────────────────────────────

/** Oculta todos os cards de resultado antes de uma nova geração. */
function _ocultarResultados() {
  const ids = ['titulo-card', 'score-card', 'hash-card', 'captions-card',
               'capa-selector', 'pdf-wrap'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

/** Exibe o wrapper do botão PDF após geração bem-sucedida. */
function _exibirBotaoPDF() {
  const pdfWrap = document.getElementById('pdf-wrap');
  if (pdfWrap) pdfWrap.style.display = 'block';
}

/**
 * Exibe mensagem de erro no card de resultado.
 * Usa o card do anúncio para não criar novo elemento — menos disruptivo
 * que um alert() e mantém o usuário no contexto da página.
 */
function _exibirErro(mensagem) {
  const card     = document.getElementById('titulo-card');
  const corpoEl  = document.getElementById('result-body');
  const tituloEl = document.getElementById('titulo-body');

  if (card) card.style.display = 'block';
  if (tituloEl) tituloEl.textContent = '';
  if (corpoEl) {
    corpoEl.textContent = `⚠️ ${mensagem}`;
    corpoEl.style.color = '#ef4444';
  }
}
