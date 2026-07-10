import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY    = Deno.env.get('STRIPE_SECRET_KEY')    ?? '';
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')          ?? '';
const SUPABASE_SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// ── HELPERS ───────────────────────────────────────────

/**
 * Verifica a assinatura do webhook Stripe.
 * Stripe assina cada evento com HMAC-SHA256 — sem verificação, qualquer POST
 * malicioso poderia ativar planos Pro sem pagamento real.
 */
async function verificarAssinatura(body: string, header: string): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) return false;

  const parts     = header.split(',');
  const tPart     = parts.find(p => p.startsWith('t='));
  const v1Part    = parts.find(p => p.startsWith('v1='));
  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const signature = v1Part.slice(3);
  const payload   = `${timestamp}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(STRIPE_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const mac      = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(mac))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return expected === signature;
}

/**
 * Busca o email do cliente no Stripe pela customer ID.
 */
async function buscarEmailCliente(customerId: string): Promise<string | null> {
  const res = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.email ?? null;
}

// ── HANDLER ───────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body      = await req.text();
  const sigHeader = req.headers.get('stripe-signature') ?? '';

  // Verificar assinatura — rejeitar se inválida
  const valido = await verificarAssinatura(body, sigHeader);
  if (!valido) {
    console.error('[stripe-webhook] Assinatura inválida');
    return new Response('Unauthorized', { status: 401 });
  }

  let evento: Record<string, unknown>;
  try {
    evento = JSON.parse(body);
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const tipo = evento.type as string;

  if (tipo !== 'customer.subscription.created' && tipo !== 'customer.subscription.updated' && tipo !== 'customer.subscription.deleted') {
    // Evento irrelevante — retornar 200 para o Stripe não retentar
    return new Response(JSON.stringify({ recebido: true }), { status: 200 });
  }

  const assinatura  = (evento.data as Record<string, unknown>)?.object as Record<string, unknown>;
  const status      = assinatura?.status as string;
  const customerId  = assinatura?.customer as string;

  if (!customerId) {
    return new Response('Bad Request: customer ausente', { status: 400 });
  }

  const isPro = status === 'active' || status === 'trialing';

  // Buscar email do cliente no Stripe
  const email = await buscarEmailCliente(customerId);
  if (!email) {
    console.error('[stripe-webhook] Não foi possível obter email do cliente:', customerId);
    return new Response('Erro ao buscar cliente', { status: 500 });
  }

  // Atualizar tabela users usando service role (bypassa RLS)
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: linhasAfetadas, error } = await sb
    .from('users')
    .update({ is_pro: isPro })
    .eq('email', email)
    .select('id');

  if (error) {
    console.error('[stripe-webhook] Erro ao atualizar users:', error);
    return new Response('Erro interno', { status: 500 });
  }

  if (!linhasAfetadas || linhasAfetadas.length === 0) {
    console.error(`[stripe-webhook] Nenhum usuário encontrado com email ${email} — update não teve efeito`);
  } else {
    console.log(`[stripe-webhook] users.is_pro=${isPro} aplicado para ${email} (id: ${linhasAfetadas[0].id})`);
  }

  console.log(`[stripe-webhook] ${email} → is_pro=${isPro} (status: ${status})`);
  return new Response(JSON.stringify({ ok: true, email, isPro }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
