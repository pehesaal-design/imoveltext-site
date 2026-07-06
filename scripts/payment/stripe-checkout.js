/**
 * MÓDULO: Stripe Checkout
 * RESPONSABILIDADE: Iniciar assinatura Pro via Stripe Payment Link
 *   e processar retorno após pagamento confirmado.
 * DEPENDÊNCIAS:
 *   - config.js  (STRIPE_PAYMENT_LINK)
 *   - state.js   (AppState)
 *   - auth/auth.js (getSupabase)
 */

import { STRIPE_PAYMENT_LINK } from '../config.js';
import { AppState }   from '../state.js';
import { getSupabase } from '../auth/auth.js';

// ── INICIAR ASSINATURA ────────────────────────────────

/**
 * Abre o Stripe Payment Link em nova aba.
 * Se não estiver logado, abre o modal de login primeiro.
 */
export function iniciarAssinatura() {
  if (!AppState.auth.currentUser) {
    document.getElementById('signup-modal').style.display = 'flex';
    return;
  }

  const base        = window.location.origin + window.location.pathname;
  const successUrl  = encodeURIComponent(`${base}?assinatura=sucesso`);
  const email       = encodeURIComponent(AppState.auth.currentUser.email || '');

  // Pré-preenche o email e define URL de retorno via query params do Payment Link
  const url = `${STRIPE_PAYMENT_LINK}?prefilled_email=${email}&success_url=${successUrl}`;

  window.open(url, '_blank');
}

// ── VERIFICAR RETORNO ─────────────────────────────────

/**
 * Chamado no carregamento da página.
 * Detecta ?assinatura=sucesso, atualiza estado e persiste no banco.
 */
export async function verificarRetornoStripe() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('assinatura') !== 'sucesso') return;

  // Limpar parâmetro da URL sem reload
  const url = new URL(window.location.href);
  url.searchParams.delete('assinatura');
  window.history.replaceState({}, '', url);

  // Atualizar estado local imediatamente
  AppState.auth.isProUser = true;

  // Persistir no Supabase (background — não bloqueia UI)
  if (AppState.auth.currentUser) {
    const sb = getSupabase();
    sb.from('profiles')
      .upsert({ id: AppState.auth.currentUser.id, is_pro: true }, { onConflict: 'id' })
      .then(({ error }) => {
        if (error) console.error('[stripe-checkout] Erro ao salvar is_pro:', error);
      });
  }

  // Resincronizar UI (desbloqueio de PDF, créditos ilimitados, etc.)
  const { sincronizarUI } = await import('../ui/ui-sync.js');
  sincronizarUI();

  _mostrarBoasVindas();
}

// ── BANNER DE BOAS-VINDAS ─────────────────────────────

function _mostrarBoasVindas() {
  if (!document.getElementById('stripe-success-style')) {
    const style = document.createElement('style');
    style.id = 'stripe-success-style';
    style.textContent = `
      @keyframes _stripeSlideDown {
        from { opacity:0; transform:translate(-50%,-20px); }
        to   { opacity:1; transform:translate(-50%,0); }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.style.cssText = [
    'position:fixed',
    'top:24px',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:9999',
    'background:linear-gradient(135deg,#1a7a4a,#22a05a)',
    'color:#fff',
    'padding:16px 28px',
    'border-radius:12px',
    'font-size:15px',
    'font-weight:600',
    'box-shadow:0 8px 30px rgba(0,0,0,.30)',
    'display:flex',
    'align-items:center',
    'gap:12px',
    'max-width:90vw',
    'white-space:nowrap',
    'animation:_stripeSlideDown .35s ease',
  ].join(';');

  banner.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Bem-vindo ao Pro! Seus recursos premium estão liberados.</span>
  `;

  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 6000);
}
