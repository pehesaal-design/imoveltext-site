/**
 * MÓDULO: UI Sync — Sincronização de Interface com Estado
 * RESPONSABILIDADE: Manter a UI consistente com o AppState
 * DEPENDÊNCIAS:
 *   - state.js (AppState)
 *   - config.js (FREE_CREDITS, STRIPE_LINK)
 * IMPACTO: Afeta banner de créditos, pill de créditos, acesso ao PDF,
 *          visibilidade da seção do corretor
 *
 * SUBSTITUI as funções duplicadas do original:
 *   updateCreditsUI()  → atualiza pill + banner
 *   updatePDFAccess()  → atualiza lock do PDF + visibilidade do corretor
 *   Eram sempre chamadas juntas → unificadas em sincronizarUI()
 *
 * ESTADOS DO BANNER:
 *   free-b  → visitante ou usuário com créditos disponíveis
 *   low-b   → 1 crédito restante (aviso amarelo)
 *   empty-b → 0 créditos (aviso vermelho + botão de upgrade)
 *   pro-b   → usuário Pro (anúncios ilimitados)
 *
 * REGRA: sincronizarUI() é idempotente — pode ser chamada múltiplas
 *   vezes seguidas sem efeitos colaterais indesejados.
 * REGRA: Nunca chamar updateCreditsUI e updatePDFAccess separadamente
 *   — sempre usar sincronizarUI() para garantir consistência.
 */

import { AppState }                    from '../state.js';
import { STRIPE_LINK, FREE_CREDITS }   from '../config.js';

/**
 * Sincroniza toda a UI com o estado atual do AppState.
 * Ponto único de entrada — chame após qualquer mudança em AppState.auth.
 */
export function sincronizarUI() {
  _atualizarCreditsPill();
  _atualizarBanner();
  _atualizarAcessoPDF();
}

// ── CREDITS PILL ──────────────────────────────────────
/**
 * Atualiza a pílula de créditos no nav (dot colorido + label).
 * Três estados: disponível (verde) / baixo (âmbar) / vazio (vermelho) / pro (gold)
 */
function _atualizarCreditsPill() {
  const dot   = document.getElementById('cpill-dot');
  const label = document.getElementById('cpill-label');
  if (!dot || !label) return;

  const { isProUser, userCredits, currentUser } = AppState.auth;

  if (!currentUser) {
    label.textContent = `${FREE_CREDITS} grátis`;
    dot.className = 'cpill-dot';
    return;
  }

  if (isProUser) {
    label.textContent = 'Pro — ilimitado';
    dot.className = 'cpill-dot'; // verde padrão para Pro
    return;
  }

  label.textContent = `${userCredits} crédito${userCredits !== 1 ? 's' : ''}`;
  dot.className = 'cpill-dot'
    + (userCredits === 0   ? ' empty' : '')
    + (userCredits === 1   ? ' low'   : '');
}

// ── BANNER ────────────────────────────────────────────
/**
 * Atualiza o banner de status do gerador.
 * O banner muda dinamicamente conforme: não logado → créditos → Pro.
 */
function _atualizarBanner() {
  const banner       = document.getElementById('gen-banner');
  const bannerTitle  = document.getElementById('banner-title');
  const bannerSub    = document.getElementById('banner-sub');
  const upgradeBtn   = document.getElementById('banner-upgrade-btn');
  if (!banner || !bannerTitle || !bannerSub) return;

  const { isProUser, userCredits, currentUser } = AppState.auth;

  // Reset classes
  banner.className = 'gen-banner';

  if (isProUser) {
    banner.classList.add('pro-b');
    bannerTitle.textContent = 'Plano Pro — anúncios ilimitados';
    bannerSub.textContent   = 'Gere quantos anúncios precisar.';
    if (upgradeBtn) upgradeBtn.style.display = 'none';
    return;
  }

  if (!currentUser) {
    banner.classList.add('free-b');
    bannerTitle.textContent = 'Preencha e gere seu primeiro anúncio grátis';
    bannerSub.textContent   = 'Sem cadastro para começar — só na hora de gerar.';
    if (upgradeBtn) upgradeBtn.style.display = 'none';
    return;
  }

  if (userCredits === 0) {
    banner.classList.add('empty-b');
    bannerTitle.textContent = 'Seus créditos acabaram';
    bannerSub.textContent   = 'Assine o plano Pro para anúncios ilimitados + PDF profissional.';
    if (upgradeBtn) {
      upgradeBtn.style.display = 'inline-flex';
      upgradeBtn.onclick = () => window.open(STRIPE_LINK, '_blank');
    }
    return;
  }

  if (userCredits === 1) {
    banner.classList.add('low-b');
    bannerTitle.textContent = 'Último crédito gratuito';
    bannerSub.textContent   = 'Assine o Pro para não perder o ritmo.';
    if (upgradeBtn) {
      upgradeBtn.style.display = 'inline-flex';
      upgradeBtn.onclick = () => window.open(STRIPE_LINK, '_blank');
    }
    return;
  }

  // Créditos disponíveis (> 1)
  banner.classList.add('free-b');
  bannerTitle.textContent = `${userCredits} créditos disponíveis`;
  bannerSub.textContent   = 'Cada geração usa 1 crédito. Assine Pro para ilimitado.';
  if (upgradeBtn) upgradeBtn.style.display = 'none';
}

// ── ACESSO AO PDF ─────────────────────────────────────
/**
 * Atualiza o lock do botão de PDF e a visibilidade da seção do corretor.
 *
 * Pro:  lock oculto + seção do corretor visível
 * Free: lock visível + seção do corretor oculta
 *
 * Chamado também quando o resultado é exibido (pelo generator.js)
 * para garantir que o botão PDF apareça no estado correto.
 */
export function atualizarAcessoPDF() {
  const pdfLock        = document.getElementById('pdf-lock');
  const corretorSection = document.getElementById('corretor-section');

  const { isProUser } = AppState.auth;

  // Lock overlay do botão PDF
  if (pdfLock) {
    pdfLock.style.display = isProUser ? 'none' : 'flex';
  }

  // Seção de dados do corretor — exclusiva Pro
  if (corretorSection) {
    corretorSection.style.display = isProUser ? 'block' : 'none';
  }

  // Botão de geração do PDF — cursor correto conforme acesso
  const pdfBtn = document.getElementById('pdf-btn');
  if (pdfBtn) {
    pdfBtn.style.cursor = isProUser ? 'pointer' : 'default';
  }
}

// Alias para manter compatibilidade interna
function _atualizarAcessoPDF() {
  atualizarAcessoPDF();
}

// ── BOTÃO DE GERAÇÃO ──────────────────────────────────
/**
 * Alterna o estado de loading do botão principal de geração.
 * @param {boolean} loading — true = mostra spinner, false = restaura
 */
export function setLoadingBtn(loading) {
  const btn = document.getElementById('gen-btn');
  if (!btn) return;

  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      Analisando e gerando...
    `;
  } else {
    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      Analisar e gerar anúncio completo
    `;
  }
}

// ── SCROLL PARA O RESULTADO ───────────────────────────
/**
 * Faz scroll suave até a seção de resultado após geração.
 * CRÍTICO: melhora conversão mobile — sem isso o usuário não percebe
 * que o resultado apareceu abaixo do botão.
 */
export function scrollParaResultado() {
  const results = document.getElementById('results-section');
  if (results) {
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Faz scroll suave até o gerador (usado pelos CTAs da landing page).
 */
export function scrollToGen() {
  const gen = document.getElementById('gerador');
  if (gen) {
    gen.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
