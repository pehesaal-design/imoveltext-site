/**
 * MÓDULO: Upload Manager — Gerenciamento de Fotos
 * RESPONSABILIDADE: Upload, drag-drop, conversão base64, thumbnails e seletor de capa
 * DEPENDÊNCIAS:
 *   - state.js (AppState)
 * IMPACTO: Afeta as fotos enviadas à IA e usadas no PDF
 *
 * FUNÇÕES EXPORTADAS:
 *   initUpload()       → registra todos os event listeners de upload
 *   renderThumbs()     → renderiza o grid de thumbnails removíveis
 *   remFoto(idx)       → remove uma foto pelo índice
 *   selecionarCapa(idx) → define a foto de capa do PDF
 *   renderCapaThumbs() → renderiza o seletor de capa após geração
 *
 * LIMITE: 15 fotos máximo (controlado por MAX_FOTOS)
 *
 * CONVERSÃO BASE64:
 *   Fotos são convertidas para base64 via FileReader e armazenadas em
 *   AppState.form.fotos[] como { src: 'data:image/...;base64,...' }.
 *   Esse mesmo base64 é enviado como inline_data no payload da IA
 *   e usado diretamente nos templates HTML do PDF.
 *
 * DRAG-AND-DROP:
 *   Toda a .upload-zone é a área de drop — não só o botão.
 *   O estado visual muda com a classe .drag-over durante o drag.
 *   Quando há fotos, a classe .has-files adiciona borda sólida verde.
 */

import { AppState } from '../state.js';

const MAX_FOTOS = 15;

// ── INIT ─────────────────────────────────────────────
/**
 * Registra todos os event listeners de upload.
 * Chamado por main.js no DOMContentLoaded.
 */
export function initUpload() {
  const input   = document.getElementById('foto-input');
  const dropZone = document.getElementById('drop-zone');

  if (!input || !dropZone) return;

  // Input file tradicional
  input.addEventListener('change', (e) => {
    _processarArquivos(Array.from(e.target.files));
    input.value = ''; // reset para permitir re-upload do mesmo arquivo
  });

  // Drag and drop — toda a zona
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const arquivos = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    _processarArquivos(arquivos);
  });
}

// ── PROCESSAR ARQUIVOS ────────────────────────────────
/**
 * Converte arquivos de imagem para base64 e adiciona ao AppState.
 * Respeita o limite de MAX_FOTOS — ignora o excedente silenciosamente.
 *
 * @param {File[]} arquivos — array de objetos File
 */
async function _processarArquivos(arquivos) {
  const disponiveis = MAX_FOTOS - AppState.form.fotos.length;
  const paraProcessar = arquivos.slice(0, disponiveis);

  const base64s = await Promise.all(
    paraProcessar.map(arquivo => _fileParaBase64(arquivo))
  );

  base64s.forEach(src => {
    if (src) AppState.form.fotos.push({ src });
  });

  renderThumbs();
  _atualizarEstadoZone();
}

/**
 * Converte um File para base64 via FileReader.
 * @param {File} arquivo
 * @returns {Promise<string>} base64 da imagem
 */
function _fileParaBase64(arquivo) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = ()  => resolve(null);
    reader.readAsDataURL(arquivo);
  });
}

// ── THUMBNAILS ────────────────────────────────────────
/**
 * Renderiza o grid de thumbnails com botão de remoção individual.
 * Chamado após qualquer mudança em AppState.form.fotos[].
 */
export function renderThumbs() {
  const container = document.getElementById('thumbs');
  if (!container) return;

  container.innerHTML = AppState.form.fotos.map((foto, idx) => `
    <div class="thumb">
      <img src="${foto.src}" alt="Foto ${idx + 1}"/>
      <button
        class="thumb-remove"
        onclick="window._remFoto(${idx})"
        title="Remover foto"
        aria-label="Remover foto ${idx + 1}"
      >
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `).join('');
}

// ── REMOVER FOTO ──────────────────────────────────────
/**
 * Remove uma foto pelo índice e re-renderiza os thumbnails.
 * Exposto como window._remFoto para uso nos onclick inline dos thumbs.
 *
 * @param {number} idx — índice da foto a remover
 */
export function remFoto(idx) {
  AppState.form.fotos.splice(idx, 1);

  // Ajustar fotoCapaIdx se a foto removida era a capa ou estava antes dela
  if (AppState.generation.fotoCapaIdx >= idx && AppState.generation.fotoCapaIdx > 0) {
    AppState.generation.fotoCapaIdx--;
  }

  renderThumbs();
  _atualizarEstadoZone();

  // Re-renderizar seletor de capa se estiver visível
  const capaSelector = document.getElementById('capa-selector');
  if (capaSelector && capaSelector.style.display !== 'none') {
    renderCapaThumbs();
  }
}

// ── SELETOR DE CAPA ───────────────────────────────────
/**
 * Renderiza o seletor de foto de capa do PDF após a geração.
 * Exibe thumbnails clicáveis — o selecionado recebe classe .selected.
 * Chamado por generator.js após renderizar o resultado.
 */
export function renderCapaThumbs() {
  const container = document.getElementById('capa-thumbs');
  if (!container) return;

  container.innerHTML = AppState.form.fotos.map((foto, idx) => `
    <div
      class="capa-thumb-item ${idx === AppState.generation.fotoCapaIdx ? 'selected' : ''}"
      onclick="window._selecionarCapa(${idx})"
      title="Definir como capa"
    >
      <img src="${foto.src}" alt="Foto ${idx + 1}"/>
    </div>
  `).join('');
}

/**
 * Define a foto de capa do PDF pelo índice.
 * Atualiza AppState e re-renderiza o seletor para refletir a seleção.
 *
 * @param {number} idx — índice da foto escolhida como capa
 */
export function selecionarCapa(idx) {
  AppState.generation.fotoCapaIdx = idx;
  renderCapaThumbs(); // atualiza a classe .selected
}

// ── HELPERS PRIVADOS ──────────────────────────────────

/**
 * Atualiza o estado visual da upload zone:
 *   - Com fotos: borda sólida verde (.has-files)
 *   - Sem fotos: borda pontilhada padrão
 */
function _atualizarEstadoZone() {
  const zone = document.getElementById('drop-zone');
  if (!zone) return;
  zone.classList.toggle('has-files', AppState.form.fotos.length > 0);
}

// ── EXPOSIÇÃO GLOBAL (para onclick inline) ────────────
// Necessário porque os onclick são gerados via innerHTML e não têm
// acesso ao escopo do módulo ES. Serão substituídos por event delegation
// em uma refatoração futura se necessário.
window._remFoto       = remFoto;
window._selecionarCapa = selecionarCapa;
