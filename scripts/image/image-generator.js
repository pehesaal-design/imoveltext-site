/**
 * MÓDULO: Image Generator — Gerador de Imagem para Instagram
 * RESPONSABILIDADE: Orquestrar a geração do template de imagem 1080×1350
 * DEPENDÊNCIAS:
 *   - state.js                       (AppState)
 *   - config.js                      (EDGE_FUNCTION)
 *   - auth/auth.js                   (getSupabase — fallback de token)
 *   - prompts/template-image.js      (buildTemplatePrompt)
 *   - image/template-instagram.js    (buildTemplateHTML)
 * IMPACTO: Módulo isolado — não altera nenhum fluxo existente de geração
 *
 * FLUXO:
 *   1. Verificar pré-condições (dados + fotos)
 *   2. Chamar Edge Function com prompt de template (chamada separada da principal)
 *   3. Parsear resposta JSON { titulo, subtitulo, descricao, diferenciais }
 *   4. Renderizar iframe com template 1080×1350 escalado
 *   5. Renderizar seletor de fotos
 *   6. Ativar botão de download (html2canvas scale:3)
 *
 * NOTA: Usa fetch direto à Edge Function (não chamarIA) pois o schema de
 * resposta do template diverge do schema padrão { titulo, corpo, hashtags, legendas }
 * tratado por parseResposta() — fazê-lo passaria pela _aplicarDefaults() que
 * descartaria os campos subtitulo, descricao e diferenciais.
 */

import { AppState }            from '../state.js';
import { EDGE_FUNCTION }       from '../config.js';
import { getSupabase }         from '../auth/auth.js';
import { buildTemplatePrompt, buildTemplate2Prompt, buildTemplate3Prompt, buildTemplate4Prompt, buildTemplate5Prompt } from '../../prompts/template-image.js';
import { buildTemplateHTML }   from './template-instagram.js';
import { buildTemplate2HTML }  from './template2-instagram.js';
import { buildTemplate3HTML }  from './template3-instagram.js';
import { buildTemplate4HTML }  from './template4-instagram.js';
import { buildTemplate5HTML }  from './template5-instagram.js';

let _currentDados       = null;
let _currentTextos      = null;
let _selectedIdx        = 0;
let _downloadBound      = false;
let _templateSelecionado = 4;

export function selecionarTemplate(n) {
  _templateSelecionado = n;
  document.querySelectorAll('.template-btn').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.template) === n);
  });
}

/**
 * Função principal — chamada pelo botão "Gerar imagem para Instagram".
 * Verifica pré-condições, chama a IA, renderiza template e seletor de fotos.
 */
export async function gerarImagemTemplate() {
  // 1. Verificar se há dados de uma geração anterior
  if (!AppState.lastGeneration.titulo && !AppState.lastGeneration.tipo) return;

  // 2. Verificar se há fotos
  if (!AppState.form.fotos.length) {
    alert('Envie ao menos uma foto para gerar a imagem para Instagram.');
    return;
  }

  const btn = document.getElementById('image-gen-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Gerando...'; }

  // Reset defensivo — garante que dados antigos não apareçam se a geração falhar
  _currentDados  = null;
  _currentTextos = null;

  try {
    // 3. Índice de foto inicial (usa a capa do PDF se já selecionada)
    _selectedIdx = AppState.generation.fotoCapaIdx || 0;

    // 4. Montar dados para o prompt com snapshot do estado atual
    const snap = AppState.lastGeneration;
    const dadosPrompt = {
      tipo:       snap.tipo       || '',
      finalidade: snap.finalidade || '',
      bairro:     snap.bairro     || '',
      preco:      snap.preco      || '',
      area:       snap.area       || '',
      quartos:    snap.quartos    || '',
      suites:     snap.suites     || '',
      vagas:      snap.vagas      || '',
      obs:        snap.obs        || '',
    };

    // 5. Chamar IA com o prompt correto para o template selecionado
    const prompt = _templateSelecionado === 2
      ? buildTemplate2Prompt(dadosPrompt)
      : _templateSelecionado === 3
      ? buildTemplate3Prompt(dadosPrompt)
      : _templateSelecionado === 4
      ? buildTemplate4Prompt(dadosPrompt)
      : _templateSelecionado === 5
      ? buildTemplate5Prompt(dadosPrompt)
      : buildTemplatePrompt(dadosPrompt);
    const textos = await _chamarIATemplate(prompt);

    // 6. Reler AppState.lastGeneration APÓS o await para pegar o valor mais recente
    //    (evita usar preço/tipo de uma geração anterior se o usuário gerou de novo
    //     enquanto aguardava a resposta da IA de template)
    const lg = AppState.lastGeneration;

    _currentDados = {
      tipo:       lg.tipo       || '',
      transacao:  _mapFinalidade(lg.finalidade),
      bairro:     lg.bairro     || '',
      cidade:     'Salvador/BA',
      preco:      lg.preco      || '',
      quartos:    lg.quartos    || '',
      suites:     lg.suites     || '',
      area:       lg.area       || '',
      vagas:      lg.vagas      || '',
      obs:        lg.obs        || '',
      fotoBase64: AppState.form.fotos[_selectedIdx]?.src || '',
      corretor: {
        nome: AppState.pdf.corrData.nome || '',
        tel:  AppState.pdf.corrData.tel  || '',
      },
    };

    if (_templateSelecionado === 1) {
      _currentTextos = {
        titulo:       textos.titulo       || lg.tipo   || '',
        subtitulo:    textos.subtitulo    || lg.bairro || '',
        descricao:    textos.descricao    || '',
        diferenciais: Array.isArray(textos.diferenciais) ? textos.diferenciais : [],
      };
    } else {
      _currentTextos = {
        ...textos,
        diferenciais: Array.isArray(textos.diferenciais) ? textos.diferenciais : [],
      };
    }

    // 7. Renderizar iframe e seletor
    _renderFrame();
    _renderFotoSelector();

    // 8. Mostrar preview
    const wrap = document.getElementById('image-preview-wrap');
    if (wrap) wrap.style.display = 'block';

    // 9. Conectar botão de download (apenas uma vez)
    if (!_downloadBound) {
      _downloadBound = true;
      document.getElementById('image-download-btn')
        ?.addEventListener('click', _abrirTemplate);
    }

  } catch (err) {
    console.error('[image-generator] Erro:', err);
    alert('Erro ao gerar a imagem. Tente novamente.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Gerar imagem para Instagram'; }
  }
}

// ── UTILITÁRIOS ───────────────────────────────────────

function _mapFinalidade(finalidade) {
  const f = (finalidade || '').toLowerCase();
  if (f.includes('aluguel')) return 'ALUGUEL';
  if (f.includes('temporada')) return 'TEMPORADA';
  return 'VENDA';
}

// ── CHAMADA À IA ──────────────────────────────────────

/**
 * Envia o prompt do template para a Edge Function e retorna o JSON parseado.
 * Parse resiliente em 2 tentativas (igual ao padrão de parseResposta).
 */
async function _chamarIATemplate(prompt) {
  let token = AppState.auth.accessToken || '';

  if (!token) {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    token = session?.access_token || '';
  }

  const response = await fetch(EDGE_FUNCTION, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, fotos: [] }),
  });

  if (!response.ok) {
    throw new Error(`Edge Function retornou status ${response.status}`);
  }

  const raw = await response.text();

  // Tentativa 1: JSON puro
  try { return JSON.parse(raw); } catch { /* continua */ }

  // Tentativa 2: extrair bloco JSON via regex
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch { /* continua */ }
  }

  console.warn('[image-generator] Não foi possível parsear a resposta da IA.');
  return {};
}

// ── RENDERIZAÇÃO ──────────────────────────────────────

/**
 * Injeta o template HTML no iframe e aplica escala para preview.
 * A escala é calculada para ajustar a largura de 1080px ao container.
 */
function _renderFrame() {
  const frame = document.getElementById('image-frame');
  if (!frame || !_currentDados || !_currentTextos) return;

  const html = _templateSelecionado === 2
    ? buildTemplate2HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 3
    ? buildTemplate3HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 4
    ? buildTemplate4HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 5
    ? buildTemplate5HTML(_currentDados, _currentTextos)
    : buildTemplateHTML(_currentDados, _currentTextos);

  frame.onload = () => {
    const containerWidth = frame.parentElement?.offsetWidth || 540;
    const scale = containerWidth / 1080;
    frame.style.width = '1080px';
    frame.style.height = '1350px';
    frame.style.transform = `scale(${scale})`;
    frame.style.transformOrigin = 'top left';
    frame.style.marginBottom = `${(1350 * scale - 1350)}px`;
  };

  frame.srcdoc = html;
}

/**
 * Renderiza os thumbnails das fotos do formulário.
 * Clicar em um thumbnail atualiza a foto no template e re-renderiza.
 */
function _renderFotoSelector() {
  const selector = document.getElementById('image-foto-selector');
  if (!selector) return;

  selector.innerHTML = '';

  AppState.form.fotos.forEach((foto, idx) => {
    const img = document.createElement('img');
    img.src = foto.src;
    img.title = `Foto ${idx + 1}`;
    img.style.cssText = [
      'width:64px',
      'height:64px',
      'object-fit:cover',
      'border-radius:6px',
      'cursor:pointer',
      `border:2px solid ${idx === _selectedIdx ? '#d4a856' : 'transparent'}`,
      `opacity:${idx === _selectedIdx ? '1' : '0.55'}`,
      'transition:all 0.2s',
    ].join(';');

    img.addEventListener('click', () => {
      _selectedIdx = idx;
      if (_currentDados) {
        _currentDados.fotoBase64 = AppState.form.fotos[idx].src;
      }
      _renderFrame();
      _renderFotoSelector();
    });

    selector.appendChild(img);
  });
}

// ── DOWNLOAD ──────────────────────────────────────────

/**
 * Captura o iframe com html2canvas em scale:3 e faz download do PNG.
 * Aguarda fonts.ready do iframe antes de capturar para evitar fallback de fonte.
 */
function _abrirTemplate() {
  if (!_currentDados || !_currentTextos) {
    alert('Gere a imagem antes de abrir o template.');
    return;
  }

  const html = _templateSelecionado === 2
    ? buildTemplate2HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 3
    ? buildTemplate3HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 4
    ? buildTemplate4HTML(_currentDados, _currentTextos)
    : _templateSelecionado === 5
    ? buildTemplate5HTML(_currentDados, _currentTextos)
    : buildTemplateHTML(_currentDados, _currentTextos);
  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
