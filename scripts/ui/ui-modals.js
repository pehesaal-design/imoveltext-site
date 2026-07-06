/**
 * MÓDULO: UI Modals — Controle dos Modais
 * RESPONSABILIDADE: Abrir/fechar modais de signup (OAuth) e paywall (upgrade)
 * DEPENDÊNCIAS:
 *   - state.js  (AppState)
 *   - auth/auth.js (loginGoogle)
 *   - payment/stripe-checkout.js (iniciarAssinatura)
 * IMPACTO: Afeta o fluxo de conversão (login + upgrade)
 *
 * MODAIS EXISTENTES:
 *   #signup-modal  → exibido quando não autenticado e tenta gerar
 *   #paywall-modal → exibido quando créditos = 0 ou tenta PDF sem Pro
 *
 * CRÍTICO — TEXTO DO SIGNUP MODAL:
 *   O parágrafo "Dados preenchidos mantidos. Sem spam, sem cartão."
 *   é a garantia visual do fluxo pendingGeneration.
 *   Não alterar — é parte da proposta de valor do fluxo de conversão.
 *
 * PADRÃO DE FECHAMENTO:
 *   Click no overlay externo fecha o modal (UX padrão).
 *   Click dentro do modal não fecha (stopPropagation via CSS pointer-events).
 */

import { AppState }          from '../state.js';
import { loginGoogle }       from '../auth/auth.js';
import { iniciarAssinatura } from '../payment/stripe-checkout.js';

// ── INIT MODAIS ───────────────────────────────────────
/**
 * Registra todos os event listeners dos modais.
 * Chamado por main.js no DOMContentLoaded.
 */
export function initModals() {
  _initSignupModal();
  _initPaywallModal();
  _initBotoesAssinar();
}

// ── SIGNUP MODAL ──────────────────────────────────────
export function showSignupModal() {
  const modal = document.getElementById('signup-modal');
  if (modal) modal.style.display = 'flex';
}

export function closeSignupModal() {
  const modal = document.getElementById('signup-modal');
  if (modal) modal.style.display = 'none';
}

function _initSignupModal() {
  // Botão de login Google
  const btnLogin = document.getElementById('btn-login-google');
  if (btnLogin) {
    btnLogin.addEventListener('click', loginGoogle);
  }

  // Click no overlay externo fecha o modal
  const overlay = document.getElementById('signup-modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSignupModal();
    });
  }
}

// ── PAYWALL MODAL ─────────────────────────────────────
export function showPaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) modal.style.display = 'flex';
}

export function closePaywall() {
  const modal = document.getElementById('paywall-modal');
  if (modal) modal.style.display = 'none';
}

function _initPaywallModal() {
  // Botão "Agora não" — fecha o modal
  const btnFechar = document.getElementById('btn-fechar-paywall');
  if (btnFechar) {
    btnFechar.addEventListener('click', closePaywall);
  }

  // Click no overlay externo fecha o modal
  const overlay = document.getElementById('paywall-modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePaywall();
    });
  }
}

// Alias mantido para compatibilidade — bindings centralizados em main.js
export function assinar() {
  iniciarAssinatura();
}

function _initBotoesAssinar() {
  // Bindings de #btn-assinar-planos e #btn-assinar-paywall gerenciados em main.js
}
