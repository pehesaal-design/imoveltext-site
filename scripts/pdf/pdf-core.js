/**
 * MÓDULO: PDF Core — Orquestrador de Geração
 * RESPONSABILIDADE: Geração, renderização e exportação do PDF
 * DEPENDÊNCIAS:
 *   - pdf-utils.js       (distribuirFotos)
 *   - dark/dark-layout.js (montarPaginas)
 *   - html2canvas (global — carregado via CDN no index.html)
 *   - jsPDF (global — carregado via CDN no index.html)
 *   - AppState (importado de scripts/state.js)
 *
 * IMPACTO: Alterações aqui afetam a geração do PDF (tema escuro).
 *
 * ════════════════════════════════════════════════════════
 * PARÂMETROS CRÍTICOS DO html2canvas — NÃO ALTERAR:
 *
 *   scale: 2.5
 *     → Resolução mínima para qualidade profissional impressa.
 *     → Reduzir prejudica qualidade; aumentar pode travar em mobile.
 *
 *   useCORS: true
 *     → Necessário para imagens base64 e fontes externas.
 *
 *   foreignObjectRendering: false
 *     → Mais compatível cross-browser. true causa falhas em alguns casos.
 *
 *   imageTimeout: 10000
 *     → Fotos grandes (base64 de alta resolução) precisam de tempo.
 *     → Reduzir pode causar imagens em branco no PDF.
 *
 *   width: 1123, height: 794
 *     → Dimensões exatas do template — devem bater com o CSS (.pf, .pf-b).
 *
 * ════════════════════════════════════════════════════════
 * HACK ONCLONE — CRÍTICO E INSUBSTITUÍVEL:
 *
 *   O html2canvas não consegue capturar <img> com src base64 diretamente
 *   quando o elemento está em position:fixed fora da tela (left:-9999px).
 *   Solução: no callback onclone, converter cada <img> em background-image
 *   no elemento pai, e zerar a opacidade da <img> original.
 *
 *   Por que funciona: background-image via CSS é renderizado corretamente
 *   pelo html2canvas mesmo em elementos offscreen, ao contrário de <img>.
 *
 *   NÃO REMOVER este hack. Sem ele, as fotos não aparecem no PDF gerado.
 *
 * ════════════════════════════════════════════════════════
 * DELAY DE 400ms — CRÍTICO:
 *
 *   WebFonts (Playfair Display, Cormorant Garamond) precisam de tempo
 *   para renderizar depois que as imagens carregam. Sem o delay, o
 *   html2canvas captura o template com fontes substitutas (sans-serif),
 *   quebrando a tipografia do PDF.
 *
 * ════════════════════════════════════════════════════════
 * ELEMENTO #pdf-template — CRÍTICO:
 *
 *   position:fixed; left:-9999px — mantém renderizável mas fora da tela.
 *   NÃO usar display:none — html2canvas não captura elementos ocultos.
 *   Definido em styles/tokens.css.
 */

import { distribuirFotos } from './pdf-utils.js';
import { montarPaginas }   from './dark/dark-layout.js';
import { AppState }        from '../state.js';

/**
 * Renderiza uma página HTML no #pdf-template e captura como JPEG base64.
 *
 * PROCESSO:
 *   1. Injeta HTML no #pdf-template
 *   2. Aguarda carregamento de todas as imagens (com timeout de 5s)
 *   3. Aguarda 400ms adicionais para WebFonts
 *   4. Captura via html2canvas com hack onclone
 *   5. Retorna JPEG base64 (qualidade 0.95)
 *
 * @param {string} html — HTML da página (retornado pelas funções pg*)
 * @returns {Promise<string>} JPEG base64 da página capturada
 */
export async function renderPagina(html) {
  const tpl = document.getElementById('pdf-template');
  if (!tpl) throw new Error('Elemento #pdf-template não encontrado no DOM.');

  tpl.innerHTML = html;

  // Aguardar carregamento de todas as imagens com timeout de 5s
  const imgs = Array.from(tpl.querySelectorAll('img'));
  await Promise.all(
    imgs.map(img =>
      new Promise(resolve => {
        if (img.complete) return resolve();
        img.onload  = resolve;
        img.onerror = resolve; // não travar se uma imagem falhar
        setTimeout(resolve, 5000); // timeout de segurança
      })
    )
  );

  // Delay para WebFonts renderizarem antes do snapshot
  await new Promise(r => setTimeout(r, 400));

  // Captura com html2canvas
  const canvas = await html2canvas(tpl, {
    scale:                 2.5,
    useCORS:               true,
    foreignObjectRendering: false,
    imageTimeout:          10000,
    width:                 1123,
    height:                794,
    backgroundColor:       null,

    /*
     * HACK ONCLONE — converter <img> em background-image no elemento pai.
     * Sem isso, imagens base64 não aparecem no canvas gerado pelo html2canvas.
     * Este callback é chamado com o clone do DOM antes da captura.
     */
    onclone: (clonedDoc) => {
      clonedDoc.querySelectorAll('img').forEach(img => {
        const parent = img.parentElement;
        if (img.src && img.src !== 'about:blank' && parent) {
          parent.style.backgroundImage    = `url('${img.src}')`;
          parent.style.backgroundSize     = 'contain';
          parent.style.backgroundPosition = 'center center';
          parent.style.backgroundRepeat   = 'no-repeat';
        }
        img.style.opacity = '0'; // ocultar a <img> original
      });
    },
  });

  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Orquestrador principal — gera e exporta o PDF completo.
 *
 * PROCESSO:
 *   1. Lê dados do AppState (fotos, legendas, corretor, lastGeneration)
 *   2. Distribui fotos entre capa e galeria ordenada
 *   3. Monta array de páginas HTML conforme o tema
 *   4. Renderiza cada página via renderPagina()
 *   5. Adiciona ao jsPDF e exporta o arquivo
 *
 * @param {string} tema — 'escuro'
 * @param {Function} [onProgresso] — callback(atual, total) para feedback de progresso
 */
export async function gerarPDF(tema = 'escuro', onProgresso = null) {
  const fotos       = AppState.form.fotos;
  const legendas    = AppState.generation.legendasGeradas;
  const fotoCapaIdx = AppState.generation.fotoCapaIdx;
  const imovel      = AppState.lastGeneration;
  const corrData    = AppState.pdf.corrData;

  // Validações básicas
  if (!fotos || fotos.length === 0) {
    throw new Error('Nenhuma foto disponível para gerar o PDF.');
  }
  if (!imovel?.titulo) {
    throw new Error('Gere o anúncio antes de exportar o PDF.');
  }

  // 1. Distribuir fotos
  const legendasArr = Array.isArray(legendas) ? legendas : [];
  const { capa, galeria } = await distribuirFotos(fotos, legendasArr, fotoCapaIdx ?? 0);

  // Dados do corretor
  const corrDataFinal = corrData || { nome: '', tel: '', creci: '' };

  // 2. Montar páginas HTML
  const pages = montarPaginas(capa, galeria, corrDataFinal, imovel);

  // 3. Inicializar jsPDF em modo landscape
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit:        'px',
    format:      [1123, 794],
  });

  const total = pages.length;

  // 4. Renderizar cada página e adicionar ao PDF
  for (let i = 0; i < pages.length; i++) {
    if (onProgresso) onProgresso(i + 1, total);

    const jpeg = await renderPagina(pages[i]);

    if (i > 0) doc.addPage([1123, 794], 'landscape');
    doc.addImage(jpeg, 'JPEG', 0, 0, 1123, 794);
  }

  // 5. Limpar o template após uso
  const tpl = document.getElementById('pdf-template');
  if (tpl) tpl.innerHTML = '';

  // 6. Exportar
  const nomeArquivo = _gerarNomeArquivo(imovel, tema);
  doc.save(nomeArquivo);
}

/**
 * Gera o nome do arquivo PDF baseado nos dados do imóvel.
 * Ex: "imovelstudio-apartamento-pituba-escuro.pdf"
 */
function _gerarNomeArquivo(imovel, tema) {
  const tipo   = (imovel?.tipo    || 'imovel').toLowerCase().replace(/\s+/g, '-');
  const bairro = (imovel?.bairro  || '').toLowerCase().replace(/\s+/g, '-');
  const partes = ['imovelstudio', tipo, bairro, tema].filter(Boolean);
  return partes.join('-') + '.pdf';
}
