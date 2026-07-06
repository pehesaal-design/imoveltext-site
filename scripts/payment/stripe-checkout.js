/**
 * MÓDULO: Stripe Checkout
 * RESPONSABILIDADE: Iniciar assinatura Pro via Stripe Payment Link
 *   e processar retorno após pagamento confirmado.
 * DEPENDÊNCIAS:
 *   - config.js  (STRIPE_PAYMENT_LINK, EDGE_VERIFY_ASSINATURA)
 *   - state.js   (AppState)
 *   - auth/auth.js (getSupabase)
 *
 * FLUXO DE VERIFICAÇÃO:
 *   1. Usuário clica em "Assinar" → Payment Link abre em nova aba
 *   2. Ao voltar para a aba original, listener `focus` dispara verificação
 *   3. Edge Function consulta Stripe e confirma assinatura ativa
 *   4. Se confirmado → libera Pro + persiste no banco
 *
 * NOTA: Stripe Payment Links NÃO suportam o parâmetro `success_url` via URL.
 *   Para redirecionar após pagamento, configurar no Dashboard:
 *   Stripe → Payment Links → After payment → Redirect to website
 *   URL: https://pehesaal-design.github.io/imovelstudio-site?assinatura=sucesso
 */

import { STRIPE_PAYMENT_LINK, EDGE_VERIFY_ASSINATURA } from '../config.js';
import { AppState }    from '../state.js';
import { getSupabase } from '../auth/auth.js';

// ── INICIAR ASSINATURA ────────────────────────────────

/**
 * Abre o Payment Link em nova aba e registra listener de retorno.
 * Se não estiver logado, abre o modal de login primeiro.
 */
export function iniciarAssinatura() {
  if (!AppState.auth.currentUser) {
    document.getElementById('signup-modal').style.display = 'flex';
    return;
  }

  const email = encodeURIComponent(AppState.auth.currentUser.email || '');
  const url   = `${STRIPE_PAYMENT_LINK}?prefilled_email=${email}`;

  console.log('[stripe] Abrindo Payment Link:', STRIPE_PAYMENT_LINK);
  window.open(url, '_blank');

  // Quando o usuário voltar para esta aba após pagar, verificar automaticamente.
  // Usar flag para não disparar múltiplas vezes se trocar de aba sem pagar.
  let _verificado = false;
  function _onFocus() {
    if (_verificado) return;
    _verificado = true;
    window.removeEventListener('focus', _onFocus);
    // Aguardar 1.5s para o Stripe processar o pagamento antes de consultar
    console.log('[stripe] Aba em foco após Payment Link — verificando em 1.5s...');
    setTimeout(() => _verificarAssinatura('foco'), 1500);
  }
  window.addEventListener('focus', _onFocus);
}

// ── VERIFICAR RETORNO POR URL ─────────────────────────

/**
 * Chamado no carregamento da página.
 * Detecta ?assinatura=sucesso (redirect configurado no Dashboard do Stripe).
 */
export async function verificarRetornoStripe() {
  const params = new URLSearchParams(window.location.search);
  const param  = params.get('assinatura');

  console.log('[stripe] verificarRetornoStripe() — params:', window.location.search);

  if (param !== 'sucesso') {
    console.log('[stripe] Parâmetro assinatura ausente ou diferente de "sucesso" — nenhuma ação.');
    return;
  }

  console.log('[stripe] Parâmetro ?assinatura=sucesso detectado — iniciando verificação.');

  // Limpar parâmetro da URL sem reload
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('assinatura');
  window.history.replaceState({}, '', cleanUrl);

  await _verificarAssinatura('url');
}

// ── VERIFICAÇÃO CENTRAL ───────────────────────────────

/**
 * Consulta a Edge Function para confirmar assinatura ativa no Stripe.
 * Chamada tanto pela detecção de URL quanto pelo listener de foco.
 *
 * @param {string} origem — 'url' | 'foco' (para logging)
 */
async function _verificarAssinatura(origem) {
  const user  = AppState.auth.currentUser;
  const email = user?.email;

  console.log(`[stripe] _verificarAssinatura(${origem}) — usuário:`, email || 'NÃO LOGADO');

  if (!email) {
    console.warn('[stripe] Usuário não está logado — não é possível verificar assinatura.');
    return;
  }

  const loadingBanner = _mostrarLoading();

  try {
    // Obter token JWT
    let token = AppState.auth.accessToken || '';
    if (!token) {
      console.log('[stripe] Token não cacheado — buscando sessão...');
      const sb = getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      token = session?.access_token || '';
    }

    if (!token) {
      throw new Error('Não foi possível obter token JWT — usuário não autenticado.');
    }

    console.log('[stripe] Chamando Edge Function:', EDGE_VERIFY_ASSINATURA);
    console.log('[stripe] Email enviado:', email);

    const res = await fetch(EDGE_VERIFY_ASSINATURA, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    console.log('[stripe] Resposta da Edge Function — status:', res.status);

    if (!res.ok) {
      const texto = await res.text();
      throw new Error(`Edge Function retornou ${res.status}: ${texto}`);
    }

    const json = await res.json();
    console.log('[stripe] Resposta JSON:', json);

    const { isPro } = json;

    loadingBanner.remove();

    if (!isPro) {
      console.log('[stripe] Assinatura não confirmada pelo Stripe.');
      if (origem === 'url') _mostrarAvisoNaoConfirmado();
      return;
    }

    // Assinatura confirmada — liberar acesso
    console.log('[stripe] Assinatura ATIVA — liberando Pro.');
    AppState.auth.isProUser = true;

    const { sincronizarUI } = await import('../ui/ui-sync.js');
    sincronizarUI();

    _mostrarBoasVindas();

  } catch (err) {
    loadingBanner.remove();
    console.error('[stripe] Erro ao verificar assinatura:', err);
    if (origem === 'url') _mostrarAvisoNaoConfirmado();
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
