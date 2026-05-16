/**
 * MÓDULO: Form Manager — Gerenciamento do Formulário
 * RESPONSABILIDADE: Coleta de dados do formulário, seleção de plataforma e tom
 * DEPENDÊNCIAS:
 *   - state.js (AppState)
 * IMPACTO: Afeta os dados enviados à IA e o comportamento do gerador
 *
 * FUNÇÕES EXPORTADAS:
 *   initForm()        → registra todos os event listeners do formulário
 *   coletarDadosForm() → lê os campos e retorna objeto de dados estruturado
 *   selectP(plat)     → seleciona plataforma e atualiza AppState + UI
 *   selectTom(tom)    → seleciona tom e atualiza AppState + UI
 *
 * SEPARAÇÃO DE RESPONSABILIDADES:
 *   form-manager.js   → dados textuais + toggles
 *   upload-manager.js → fotos (drag-drop, base64, thumbnails)
 *
 * DADOS COLETADOS POR coletarDadosForm():
 *   Retorna objeto limpo com todos os campos — campos vazios mantidos como
 *   string vazia (não removidos) para que o prompt saiba o que foi omitido.
 */

import { AppState } from '../state.js';

// ── INIT ─────────────────────────────────────────────
/**
 * Registra event listeners do formulário.
 * Chamado por main.js no DOMContentLoaded.
 */
export function initForm() {
  _initTogglePlataforma();
  _initToggleTom();
  _initCorretorFields();
}

// ── COLETA DE DADOS ───────────────────────────────────
/**
 * Lê todos os campos do formulário e retorna objeto estruturado.
 * Chamado por generator.js antes de montar o prompt.
 *
 * @returns {Object} Dados do imóvel prontos para buildPrompt()
 */
export function coletarDadosForm() {
  return {
    tipo:       _val('tipo'),
    finalidade: _val('finalidade'),
    bairro:     _val('bairro'),
    preco:      _val('preco'),
    quartos:    _val('quartos'),
    suites:     _val('suites'),
    area:       _val('area'),
    obs:        _val('obs'),
    plataforma: AppState.form.plataforma,
    tom:        AppState.form.tomAnuncio,
  };
}

/**
 * Coleta os dados do corretor para o PDF.
 * Retorna null se todos os campos estiverem vazios.
 *
 * @returns {Object} { nome, tel, creci }
 */
export function coletarDadosCorretor() {
  const nome  = _val('corr-nome');
  const tel   = _val('corr-tel');
  const creci = _val('corr-creci');
  return { nome, tel, creci };
}

// ── SELEÇÃO DE PLATAFORMA ─────────────────────────────
/**
 * Seleciona uma plataforma e atualiza AppState + UI.
 * Chamado pelos botões do grupo #plataforma-group.
 *
 * @param {string} plat — 'ZAP/OLX' | 'Instagram' | 'WhatsApp' | 'Site'
 */
export function selectP(plat) {
  AppState.form.plataforma = plat;

  document.querySelectorAll('#plataforma-group .tog-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.p === plat);
  });
}

// ── SELEÇÃO DE TOM ────────────────────────────────────
/**
 * Seleciona um tom e atualiza AppState + UI.
 * Chamado pelos botões do grupo #tom-group.
 *
 * @param {string} tom — 'Família' | 'Luxo' | 'Investimento'
 */
export function selectTom(tom) {
  AppState.form.tomAnuncio = tom;

  document.querySelectorAll('#tom-group .tog-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tom === tom);
  });
}

// ── HELPERS PRIVADOS ──────────────────────────────────

/** Lê valor de um campo do formulário com trim. */
function _val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

/** Registra listeners no grupo de botões de plataforma. */
function _initTogglePlataforma() {
  document.querySelectorAll('#plataforma-group .tog-btn').forEach(btn => {
    btn.addEventListener('click', () => selectP(btn.dataset.p));
  });
}

/** Registra listeners no grupo de botões de tom. */
function _initToggleTom() {
  document.querySelectorAll('#tom-group .tog-btn').forEach(btn => {
    btn.addEventListener('click', () => selectTom(btn.dataset.tom));
  });
}

/**
 * Sincroniza campos do corretor com AppState.pdf.corrData em tempo real.
 * Garante que os dados estejam prontos quando gerarPDF() for chamado,
 * sem precisar coletar no momento da geração.
 */
function _initCorretorFields() {
  const campos = [
    { id: 'corr-nome',  key: 'nome'  },
    { id: 'corr-tel',   key: 'tel'   },
    { id: 'corr-creci', key: 'creci' },
  ];

  campos.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        AppState.pdf.corrData[key] = el.value.trim();
      });
    }
  });
}
