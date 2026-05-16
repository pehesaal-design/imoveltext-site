/**
 * MÓDULO: Config — Constantes de Ambiente
 * RESPONSABILIDADE: Centralizar todas as constantes que variam por ambiente
 * DEPENDÊNCIAS: Nenhuma (módulo raiz sem imports)
 * IMPACTO: Alterações aqui afetam autenticação, pagamento e limites do sistema
 *
 * REGRA: Este é o ÚNICO arquivo que muda entre ambientes (dev/staging/prod).
 * REGRA: Nunca espalhar URLs ou chaves em outros módulos — tudo centralizado aqui.
 * REGRA: SUPABASE_KEY é a anon key (pública por design do Supabase) —
 *        a segurança real está nas Row Level Security policies do banco.
 *
 * STRIPE_LINK: Atualmente placeholder — substituir pela URL real do
 *   checkout do Stripe antes de ir para produção.
 *   Buscar por 'STRIPE_PENDENTE' no projeto para localizar todos os usos.
 */

// ── SUPABASE ──────────────────────────────────────────
export const SUPABASE_URL  = 'https://ynahunwezjbnbvyjxvfz.supabase.co';
export const SUPABASE_KEY  = 'sb_publishable_GDsLQZy_Zsdhr3icE7PByQ_smjPROkn';

// URL de redirect após o OAuth do Google.
// Em dev: 'http://localhost:5500' ou equivalente.
// Em prod: URL do domínio real.
export const REDIRECT_URL  = window.location.origin;

// ── STRIPE ────────────────────────────────────────────
// TODO: substituir por URL real do checkout Stripe antes de produção
export const STRIPE_LINK   = 'STRIPE_PENDENTE';

// ── LIMITES DO PLANO FREE ─────────────────────────────
export const FREE_CREDITS  = 3;

// ── EDGE FUNCTION ─────────────────────────────────────
// Endpoint da Edge Function do Supabase que chama a Gemini API.
// Nunca chamar a Gemini diretamente do cliente — a chave fica no servidor.
export const EDGE_FUNCTION = `${SUPABASE_URL}/functions/v1/gerar`;
