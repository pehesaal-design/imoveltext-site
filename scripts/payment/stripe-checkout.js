/**
 * MÓDULO: Stripe Checkout
 * RESPONSABILIDADE: Iniciar assinatura Pro via Stripe Payment Link
 *   e processar retorno após pagamento confirmado.
 * DEPENDÊNCIAS:
 *   - config.js  (STRIPE_PAYMENT_LINK)
 *   - state.js   (AppState)
 *   - auth/auth.js (getSupabase)
 */

import { STRIPE_PAYMENT_LINK, EDGE_VERIFY_ASSINATURA } from '../config.js';
import { AppState }    from '../state.js';
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
 * Detecta ?assinatura=sucesso, confirma com a Edge Function e libera Pro.
 */
export async function verificarRetornoStripe() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('assinatura') !== 'sucesso') return;

  // Limpar parâmetro da URL sem reload
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('assinatura');
  window.history.replaceState({}, '', cleanUrl);

  // Só prosseguir se houver usuário logado com email
  const user  = AppState.auth.currentUser;
  const email = user?.email;
  if (!email) return;

  // Mostrar loading enquanto verifica no Stripe
  const loadingBanner = _mostrarLoading();

  try {
    // Obter token JWT para autenticar a chamada à Edge Function
    let token = AppState.auth.accessToken || '';
    if (!token) {
      const sb = getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      token = session?.access_token || '';
    }

    const res = await fetch(EDGE_VERIFY_ASSINATURA, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error(`Edge Function retornou ${res.status}`);

    const { isPro } = await res.json();

    loadingBanner.remove();

    if (!isPro) {
      _mostrarAvisoNaoConfirmado();
      return;
    }

    // Assinatura confirmada — liberar acesso
    AppState.auth.isProUser = true;

    const { sincronizarUI } = await import('../ui/ui-sync.js');
    sincronizarUI();

    _mostrarBoasVindas();

  } catch (err) {
    loadingBanner.remove();
    console.error('[stripe-checkout] Erro ao verificar assinatura:', err);
    _mostrarAvisoNaoConfirmado();
  }
}

// ── BANNERS ───────────────────────────────────────────

function _injetarKeyframe() {
  if (document.getElementById('stripe-success-style')) return;
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

function _criarBanner(bg, html) {
  _injetarKeyframe();
  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed', 'top:24px', 'left:50%', 'transform:translateX(-50%)',
    'z-index:9999', `background:${bg}`, 'color:#fff', 'padding:16px 28px',
    'border-radius:12px', 'font-size:15px', 'font-weight:600',
    'box-shadow:0 8px 30px rgba(0,0,0,.30)', 'display:flex',
    'align-items:center', 'gap:12px', 'max-width:90vw', 'white-space:nowrap',
    'animation:_stripeSlideDown .35s ease',
  ].join(';');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

function _mostrarLoading() {
  return _criarBanner(
    '#1a2744',
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round">
       <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
     </svg>
     <span>Verificando assinatura...</span>`,
  );
}

function _mostrarAvisoNaoConfirmado() {
  const el = _criarBanner(
    '#7a3a1a',
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
       <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
       <line x1="12" y1="16" x2="12.01" y2="16"/>
     </svg>
     <span>Assinatura ainda não confirmada. Tente novamente em instantes.</span>`,
  );
  setTimeout(() => el.remove(), 7000);
}

function _mostrarBoasVindas() {
  const el = _criarBanner(
    'linear-gradient(135deg,#1a7a4a,#22a05a)',
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
       <polyline points="20 6 9 17 4 12"/>
     </svg>
     <span>Bem-vindo ao Pro! Seus recursos premium estão liberados.</span>`,
  );
  setTimeout(() => el.remove(), 6000);
}
