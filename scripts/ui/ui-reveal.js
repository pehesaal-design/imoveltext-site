/**
 * MÓDULO: UI Reveal — Animações de Scroll
 * RESPONSABILIDADE: Ativar animações de entrada dos elementos ao entrar no viewport
 * DEPENDÊNCIAS: Nenhuma (puro DOM)
 * IMPACTO: Afeta apenas a landing page (seções estáticas)
 *
 * CLASSES OBSERVADAS:
 *   .reveal   → fadeIn + translateY (de baixo para cima)
 *   .reveal-l → fadeIn + translateX (da esquerda)
 *   .reveal-r → fadeIn + translateX (da direita)
 *
 * ESTADO INICIAL (definido em tokens.css):
 *   opacity: 0 + transform deslocado
 *
 * ESTADO FINAL (classe .in adicionada pelo Observer):
 *   opacity: 1 + transform: none
 *
 * DELAYS em cascata (definidos em tokens.css):
 *   .d1 → 0.1s | .d2 → 0.2s | .d3 → 0.3s | .d4 → 0.4s
 *
 * THRESHOLD: 0.15 — elemento precisa estar 15% visível para ativar.
 * rootMargin: '-40px' — ativa um pouco antes do topo exato do viewport.
 */

/**
 * Inicializa o IntersectionObserver para animações de scroll.
 * Chamado por main.js no DOMContentLoaded.
 */
export function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if (!els.length) return;

  // Verificar suporte (Safari antigo)
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todos sem animação
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target); // anima apenas uma vez
        }
      });
    },
    {
      threshold:  0.15,
      rootMargin: '-40px 0px',
    }
  );

  els.forEach(el => observer.observe(el));
}
