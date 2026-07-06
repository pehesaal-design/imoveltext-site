/**
 * MÓDULO: Auth — Autenticação e Sessão
 * RESPONSABILIDADE: Login Google OAuth, estado do usuário, fluxo pendingGeneration
 * DEPENDÊNCIAS:
 *   - config.js  (SUPABASE_URL, SUPABASE_KEY, REDIRECT_URL, FREE_CREDITS)
 *   - state.js   (AppState, saveFormToSession, restoreFormFromSession)
 *   - ui/ui-sync.js (sincronizarUI)  ← importado dinamicamente para evitar circular
 *
 * FLUXO CRÍTICO — pendingGeneration:
 *
 *   O usuário preenche o formulário e clica "Gerar" sem estar logado.
 *   Em vez de perder o preenchimento, o sistema:
 *     1. Salva o formulário no sessionStorage (saveFormToSession)
 *     2. Seta AppState.generation.pendingGeneration = true
 *     3. Abre o modal de signup
 *     4. Usuário clica "Entrar com Google" → redirect OAuth
 *     5. Após retorno: init() detecta o usuário logado
 *     6. restoreFormFromSession() repopula o formulário
 *     7. pendingGeneration = true → gerar() é disparado automaticamente
 *
 *   RESULTADO: do ponto de vista do usuário, ele preencheu → clicou →
 *   fez login → recebeu o resultado. Sem fricção, sem retrabalho.
 *   É o principal driver de conversão do produto — não quebrar.
 *
 * SUPABASE AUTH:
 *   - Provider: Google OAuth
 *   - Tabela: users (gerenciada pelo Supabase Auth)
 *   - Dados extras: credits (int), is_pro (bool) na tabela pública
 *   - A anon key é pública por design — segurança via RLS policies
 */

import { SUPABASE_URL, SUPABASE_KEY, REDIRECT_URL, FREE_CREDITS } from '../config.js';
import {
  AppState,
  saveFormToSession,
  restoreFormFromSession,
} from '../state.js';
import { coletarDadosForm } from '../form/form-manager.js';
import { sincronizarUI } from '../ui/ui-sync.js';

// Envolve uma promise com timeout. Limpa o timer quando a promise original
// vence, evitando timer leaks e unhandled rejections.
function _withTimeout(promise, ms, message) {
  let id;
  const timer = new Promise((_, reject) => {
    id = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timer]).finally(() => clearTimeout(id));
}

// ── CLIENTE SUPABASE ──────────────────────────────────
// Inicializado uma única vez — reutilizado por todos os módulos via getSupabase()
let _supabase = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _supabase;
}

// ── INIT ─────────────────────────────────────────────
/**
 * Ponto de entrada principal — chamado por main.js no carregamento da página.
 *
 * PROCESSO:
 *   1. Inicializa o cliente Supabase
 *   2. Verifica se há sessão ativa (retorno do OAuth ou sessão persistida)
 *   3. Se logado: carrega dados do usuário e sincroniza a UI
 *   4. Se há pendingGeneration: restaura form e dispara geração
 *   5. Registra listener para mudanças de estado de auth (login/logout)
 *
 * @param {Function} onReady — callback chamado após init (recebe { user, isPending })
 */
export async function init(onReady = null) {
  const sb = getSupabase();

  // getSession() pode travar indefinidamente se o Supabase tenta renovar
  // o JWT via rede instável. Com timeout, init() sempre completa — seja com
  // sessão válida, sem sessão, ou com erro tratado.
  // O try/catch garante que onReady e onAuthStateChange sempre executam,
  // mantendo o botão Gerar funcional mesmo com falha de rede na inicialização.
  try {
    const { data: { session } } = await _withTimeout(
      sb.auth.getSession(),
      10_000,
      'Não foi possível verificar a sessão. Verifique sua conexão.'
    );

    if (session?.user) {
      await loadUser(session.user);
      AppState.auth.accessToken = session.access_token || '';

      // Verificar pendingGeneration — retorno do OAuth com form salvo
      const formSalvo = restoreFormFromSession();
      if (formSalvo?.pending) {
        _restaurarFormulario(formSalvo);
        AppState.generation.pendingGeneration = true;
      }

      if (onReady) onReady({ user: session.user, isPending: AppState.generation.pendingGeneration });
    } else {
      _atualizarNavGuestState();
      if (onReady) onReady({ user: null, isPending: false });
    }
  } catch (err) {
    console.error('[auth] Falha na inicialização de sessão:', err.message);
    _atualizarNavGuestState();
    if (onReady) onReady({ user: null, isPending: false });
  }

  // Listener para mudanças de auth (ex: logout em outra aba)
  // Registrado fora do try: deve funcionar mesmo se a sessão inicial falhou
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await loadUser(session.user);
      AppState.auth.accessToken = session.access_token || '';
    } else if (event === 'TOKEN_REFRESHED' && session) {
      // JWT renovado automaticamente pelo Supabase — atualizar cache
      AppState.auth.accessToken = session.access_token || '';
    } else if (event === 'SIGNED_OUT') {
      _limparEstadoAuth();
      _atualizarNavGuestState();
    }
  });
}

// ── LOAD USER ─────────────────────────────────────────
/**
 * Carrega dados do usuário do Supabase e atualiza o AppState.
 * Busca credits e is_pro da tabela pública de usuários.
 *
 * @param {Object} user — objeto de usuário do Supabase Auth
 */
export async function loadUser(user) {
  AppState.auth.currentUser = user;

  const sb = getSupabase();

  // Buscar créditos e status Pro da tabela pública
  const { data, error } = await sb
    .from('users')
    .select('credits, is_pro')
    .eq('id', user.id)
    .single();

  if (!error && data) {
    AppState.auth.userCredits = data.credits ?? FREE_CREDITS;
    AppState.auth.isProUser   = data.is_pro  ?? false;
  } else {
    // Usuário sem linha na tabela — definir memória e criar o registro.
    // Sem upsert aqui, decrementarCredito() faz UPDATE em linha inexistente
    // (0 rows affected, sem erro) e os créditos resetam a cada reload.
    AppState.auth.userCredits = FREE_CREDITS;
    AppState.auth.isProUser   = false;
    sb.from('users')
      .upsert({ id: user.id, credits: FREE_CREDITS, is_pro: false }, { onConflict: 'id' })
      .then(({ error: e }) => {
        if (e) console.error('[auth] Erro ao criar registro do usuário:', e);
      });
  }

  // Atualizar UI com estado do usuário
  _atualizarNavUserState(user);

  // Sincronizar banner, PDF access, etc.
  sincronizarUI();
}

// ── LOGIN GOOGLE ──────────────────────────────────────
/**
 * Inicia o fluxo de login com Google OAuth.
 * Chamado pelo botão "Entrar com Google" no modal de signup.
 *
 * ANTES do redirect: salva o formulário no sessionStorage para
 * restaurar após o retorno do OAuth (fluxo pendingGeneration).
 */
export async function loginGoogle() {
  // Coletar dados do DOM via form-manager e passar para saveFormToSession
  // state.js não acessa o DOM — quem conhece os campos é o form-manager
  const dadosForm = coletarDadosForm();
  saveFormToSession(dadosForm);

  const sb = getSupabase();
  await sb.auth.signInWithOAuth({
    provider:    'google',
    options: {
      redirectTo: REDIRECT_URL,
    },
  });
  // O redirect acontece aqui — código abaixo não é executado nesta sessão
}

// ── LOGOUT ────────────────────────────────────────────
/**
 * Faz logout e limpa o estado da aplicação.
 */
export async function logout() {
  const sb = getSupabase();
  await sb.auth.signOut();
  _limparEstadoAuth();
  _atualizarNavGuestState();
}

// ── DECREMENTAR CRÉDITO ───────────────────────────────
/**
 * Decrementa 1 crédito do usuário no Supabase e no AppState.
 * Executado em background após geração bem-sucedida — não bloqueia a UI.
 *
 * REGRA: Só decrementar se !isProUser — Pro tem créditos ilimitados.
 * REGRA: Só decrementar após parse bem-sucedido da resposta da IA —
 *        não cobrar por gerações que falharam.
 */
export async function decrementarCredito() {
  if (AppState.auth.isProUser) return;
  if (!AppState.auth.currentUser) return;

  AppState.auth.userCredits = Math.max(0, AppState.auth.userCredits - 1);

  // Persistir no Supabase em background (não await — não bloquear UI)
  const sb = getSupabase();
  sb.from('users')
    .update({ credits: AppState.auth.userCredits })
    .eq('id', AppState.auth.currentUser.id)
    .then(({ error }) => {
      if (error) console.error('[auth] Erro ao decrementar crédito:', error);
    });

  // Resincronizar UI com novo valor de créditos
  sincronizarUI();
}

// ── HELPERS PRIVADOS ──────────────────────────────────

/**
 * Atualiza o nav para o estado "usuário logado":
 * oculta nav-guest, exibe nav-user com avatar e créditos.
 */
function _atualizarNavUserState(user) {
  const navGuest  = document.getElementById('nav-guest');
  const navUser   = document.getElementById('nav-user');
  const navAvatar = document.getElementById('nav-avatar');

  if (navGuest) navGuest.style.display  = 'none';
  if (navUser)  navUser.style.display   = 'flex';
  if (navAvatar && user.user_metadata?.avatar_url) {
    navAvatar.src = user.user_metadata.avatar_url;
  }

  // Registrar evento de logout no botão
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.onclick = logout;
  }
}

/**
 * Atualiza o nav para o estado "visitante não logado".
 */
function _atualizarNavGuestState() {
  const navGuest = document.getElementById('nav-guest');
  const navUser  = document.getElementById('nav-user');

  if (navGuest) navGuest.style.display = 'block';
  if (navUser)  navUser.style.display  = 'none';
}

/**
 * Limpa o estado de autenticação no AppState.
 */
function _limparEstadoAuth() {
  AppState.auth.currentUser = null;
  AppState.auth.userCredits = 0;
  AppState.auth.isProUser   = false;
  AppState.auth.accessToken = '';
}

/**
 * Restaura o formulário no DOM a partir dos dados salvos no sessionStorage.
 * Repopula todos os campos: tipo, finalidade, bairro, preço, quartos,
 * suítes, área, obs, plataforma selecionada e tom selecionado.
 *
 * CRÍTICO: deve restaurar TODOS os campos incluindo os toggles de
 * plataforma e tom — sem isso o gerar() automático usa valores default
 * em vez do que o usuário havia selecionado.
 *
 * @param {Object} dados — dados salvos por saveFormToSession()
 */
function _restaurarFormulario(dados) {
  if (!dados) return;

  // Campos de texto
  const campos = ['tipo', 'finalidade', 'bairro', 'preco', 'quartos', 'suites', 'area', 'obs'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && dados[id]) el.value = dados[id];
  });

  // Restaurar plataforma no AppState e no toggle de botões
  if (dados.plataforma) {
    AppState.form.plataforma = dados.plataforma;
    document.querySelectorAll('#plataforma-group .tog-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.p === dados.plataforma);
    });
  }

  // Restaurar tom no AppState e no toggle de botões
  if (dados.tomAnuncio) {
    AppState.form.tomAnuncio = dados.tomAnuncio;
    document.querySelectorAll('#tom-group .tog-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tom === dados.tomAnuncio);
    });
  }
}
