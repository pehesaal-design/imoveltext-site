import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY   = Deno.env.get('STRIPE_SECRET_KEY')       ?? '';
const SUPABASE_URL        = Deno.env.get('SUPABASE_URL')             ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── STRIPE HELPERS ────────────────────────────────────

async function buscarClientePorEmail(email: string): Promise<string | null> {
  const res = await fetch(
    `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0]?.id ?? null;
}

async function temAssinaturaAtiva(customerId: string): Promise<boolean> {
  const res = await fetch(
    `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active&limit=1`,
    { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } },
  );
  if (!res.ok) return false;
  const data = await res.json();
  return (data.data?.length ?? 0) > 0;
}

// ── HANDLER ───────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS });
  }

  // Autenticação — o JWT do usuário deve estar no header Authorization
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401, headers: CORS });
  }

  let email: string;
  try {
    const body = await req.json();
    email = (body.email ?? '').trim().toLowerCase();
    if (!email) throw new Error('email ausente');
  } catch {
    return new Response('Bad Request: email ausente', { status: 400, headers: CORS });
  }

  // 1. Buscar cliente no Stripe pelo email
  const customerId = await buscarClientePorEmail(email);

  if (!customerId) {
    return new Response(
      JSON.stringify({ isPro: false, motivo: 'cliente não encontrado no Stripe' }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
    );
  }

  // 2. Verificar se tem assinatura ativa
  const isPro = await temAssinaturaAtiva(customerId);

  // 3. Atualizar tabela profiles (service role bypassa RLS)
  if (isPro) {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { error } = await sb
      .from('profiles')
      .upsert({ email, is_pro: true }, { onConflict: 'email' });
    if (error) {
      console.error('[verificar-assinatura] Erro ao atualizar profiles:', error);
    }
  }

  console.log(`[verificar-assinatura] ${email} → isPro=${isPro}`);
  return new Response(
    JSON.stringify({ isPro }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } },
  );
});
