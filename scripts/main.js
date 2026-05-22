/**
 * MÓDULO: Main — Entry Point da Aplicação
 * RESPONSABILIDADE: Inicializar todos os módulos e registrar eventos globais
 * DEPENDÊNCIAS: Todos os módulos da aplicação
 * IMPACTO: Ponto de entrada — carregado por último no index.html
 *
 * ORDEM DE INICIALIZAÇÃO:
 *   1. UI estática (reveal, modais) — sem dependência de auth
 *   2. Form + upload — sem dependência de auth
 *   3. Auth — verifica sessão, restaura form se necessário
 *   4. Eventos globais — botão gerar, botão PDF, seletor de tema
 *
 * FLUXO PÓS-AUTH:
 *   Se init() detectar pendingGeneration (retorno do OAuth):
 *     → form já foi restaurado por auth.js → _verificarPendingGeneration()
 *     → gerar() é disparado automaticamente
 *
 * CARREGAMENTO NO index.html:
 *   <script type="module" src="scripts/main.js"></script>
 *   Deve ser o último script — após config.js e state.js.
 *   type="module" garante que os imports funcionem corretamente.
 */

import { init }          from './auth/auth.js';
import { initForm }      from './form/form-manager.js';
import { initUpload }    from './form/upload-manager.js';
import { initModals }    from './ui/ui-modals.js';
import { initReveal }    from './ui/ui-reveal.js';
import { sincronizarUI } from './ui/ui-sync.js';
import { gerar }                from './generator/generator.js';
import { gerarPDF }             from './pdf/pdf-core.js';
import { gerarImagemTemplate, selecionarTemplate } from './image/image-generator.js';
import { AppState }             from './state.js';

window.selecionarTemplate = selecionarTemplate;

// ── INICIALIZAÇÃO ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // 1. UI estática — não depende de auth
  initReveal();
  initModals();

  // 2. Form e upload
  initForm();
  initUpload();

  // 3. Auth — verifica sessão e restaura estado se necessário
  await init(({ isPending }) => {
    sincronizarUI();

    // Disparar geração automática se usuário retornou do OAuth com form salvo
    if (isPending) {
      _verificarPendingGeneration();
    }
  });

  // 4. Eventos globais
  _registrarEventos();
});

// ── EVENTOS GLOBAIS ───────────────────────────────────
function _registrarEventos() {

  // Botão principal de geração
  const btnGerar = document.getElementById('gen-btn');
  if (btnGerar) {
    btnGerar.addEventListener('click', gerar);
  }

  // Botão de geração de imagem para Instagram
  document.getElementById('image-gen-btn')
    ?.addEventListener('click', gerarImagemTemplate);

  // Botão de geração do PDF
  const btnPDF = document.getElementById('pdf-btn');
  if (btnPDF) {
    // async necessário para await no import dinâmico
    btnPDF.addEventListener('click', async () => {
      if (!AppState.auth.isProUser) {
        // Usuário free — clicar no botão abre o paywall
        // CORREÇÃO: await obrigatório — sem ele showPaywall era uma Promise, não a função
        const { showPaywall } = await import('./ui/ui-modals.js');
        showPaywall();
        return;
      }
      gerarPDF(AppState.pdf.tema, _atualizarProgressoPDF);
    });
  }

}

// ── PENDING GENERATION ────────────────────────────────
/**
 * Verifica se há geração pendente após retorno do OAuth.
 * Aguarda 300ms para garantir que o DOM e a sessão estejam prontos.
 */
function _verificarPendingGeneration() {
  if (AppState.generation.pendingGeneration) {
    setTimeout(gerar, 300);
  }
}

// ── PROGRESSO DO PDF ──────────────────────────────────
/**
 * Callback de progresso da geração do PDF.
 * Atualiza o texto do botão durante a renderização página a página.
 *
 * @param {number} atual — página atual sendo renderizada
 * @param {number} total — total de páginas
 */
function _atualizarProgressoPDF(atual, total) {
  const btn = document.getElementById('pdf-btn');
  if (btn) {
    btn.textContent = `Gerando PDF... ${atual}/${total}`;
    if (atual === total) {
      // Restaurar texto original após pequeno delay
      setTimeout(() => {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
          </svg>
          Gerar PDF profissional
        `;
      }, 1500);
    }
  }
}
