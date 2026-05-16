/**
 * MÓDULO: Light Pages — Templates do Tema Bege
 * RESPONSABILIDADE: Funções puras que retornam HTML dos layouts do tema bege
 * DEPENDÊNCIAS: pdf-utils.js (imgTag)
 * IMPACTO: Alterações afetam apenas o tema bege (Claro Minimalista)
 *
 * PRINCÍPIO: Idêntico ao dark-pages.js — funções puras, sem estado,
 * sem acesso ao DOM. Recebe dados, retorna string HTML.
 *
 * LAYOUTS DISPONÍVEIS:
 *   pgBegeCapa   → Foto esq 46% + painel bege dir 54% (ficha técnica)
 *   pgBegeTxt2   → Painel claro esq 36% + 2 fotos empilhadas dir
 *   pgBegeGrid3  → 1 foto grande + 2 fotos pequenas (grid 3)
 *   pgBegeTxt4   → Painel bege esq 28% + grid 2×2 de fotos
 *   pgBegeEnc    → Encerramento: painel bege esq 44% + foto dir
 *
 * ESTILOS: Definidos em styles/pdf/pdf-light.css
 *          Classes .pf-b, .pfb-capa, .pfb-txt2, .pfb-grid3, .pfb-txt4, .pfb-enc
 *
 * DIFERENÇA DO TEMA ESCURO:
 *   - Tema escuro seleciona layout por proporção da foto (V ou H)
 *   - Tema bege seleciona layout por CONTAGEM de fotos disponíveis
 *   Ver: light-layout.js → montarPaginasBege()
 */

/* ══════════════════════════════════════════════════════
   HELPERS INTERNOS — Tema bege
   ══════════════════════════════════════════════════════ */

/**
 * Ficha técnica do tema bege — grid 2 colunas sobre fundo bege.
 */
function fichaBegeHtml({ bairro, preco, area, quartos, suites, tipo }) {
  const itens = [
    { label: 'Local',    valor: bairro   || '—' },
    { label: 'Preço',    valor: preco    || '—' },
    { label: 'Área',     valor: area     ? area + ' m²' : '—' },
    { label: 'Quartos',  valor: quartos  || '—' },
    { label: 'Suítes',   valor: suites   || '—' },
    { label: 'Tipo',     valor: tipo     || '—' },
  ];

  return `<div class="pfb-ficha">
    ${itens.map(({ label, valor }) => `
      <div class="pfb-ficha-item">
        <div class="pfb-ficha-label">${label}</div>
        <div class="pfb-ficha-valor">${valor}</div>
      </div>`
    ).join('')}
  </div>`;
}

/**
 * Footer do painel bege — nome + CRECI + número de página.
 */
function footerBegeHtml({ nome, creci }, num, total) {
  return `
    <div class="pfb-footer">
      <div class="pfb-footer-nome">${nome || 'ImóvelText'}</div>
      <div class="pfb-footer-creci">${creci ? `CRECI ${creci}` : ''}</div>
      ${num && total ? `<div class="pfb-footer-pag">pág. ${num} / ${total}</div>` : ''}
    </div>`;
}

/**
 * Footer do painel claro — nome + CRECI sobre fundo #F7F4EF.
 */
function footerClaroHtml({ nome, creci }) {
  return `
    <div class="pfb-footer-light">
      <div class="pfb-footer-light-nome">${nome || 'ImóvelText'}</div>
      <div class="pfb-footer-light-creci">${creci ? `CRECI ${creci}` : ''}</div>
    </div>`;
}

/* ══════════════════════════════════════════════════════
   BEGE CAPA (pgBegeCapa)
   [foto esq 46%] [painel bege dir 54%]
   ══════════════════════════════════════════════════════ */
export function pgBegeCapa({ titulo, bairro, preco, area, quartos, suites, tipo, src, corretor, total }) {
  return `
<div class="pf-b pfb-capa">

  <!-- Foto esquerda -->
  <div class="pfb-capa-foto">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>

  <!-- Painel bege direita -->
  <div class="pfb-panel pfb-capa-panel">
    <div class="pfb-brand">IMÓVELTEXT</div>
    <div class="pfb-titulo" style="font-size:34px">${titulo || ''}</div>

    ${fichaBegeHtml({ bairro, preco, area, quartos, suites, tipo })}

    ${footerBegeHtml(corretor || {}, 1, total)}
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   BEGE TXT2 (pgBegeTxt2)
   [painel claro esq 36%] [2 fotos empilhadas dir]
   ══════════════════════════════════════════════════════ */
export function pgBegeTxt2({ label, legenda, src1, src2, corretor, num, total }) {
  return `
<div class="pf-b pfb-txt2">

  <!-- Painel claro esquerda -->
  <div class="pfb-panel-light pfb-txt2-panel">
    <div class="pfb-num">${num || ''} / ${total || ''}</div>
    <div class="pfb-titulo-dark" style="font-size:26px">${label || ''}</div>
    <div class="pfb-legenda">${legenda || ''}</div>

    ${footerClaroHtml(corretor || {})}
  </div>

  <!-- 2 fotos empilhadas direita -->
  <div class="pfb-txt2-fotos">
    <div class="pfb-txt2-foto">
      <img src="${src1 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pfb-txt2-foto">
      <img src="${src2 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   BEGE GRID3 (pgBegeGrid3)
   [1 foto grande flex:1.2] [coluna 2 fotos pequenas flex:0.8]
   Header e footer absolutos sobre o grid
   ══════════════════════════════════════════════════════ */
export function pgBegeGrid3({ label, src1, src2, src3, corretor, num, total }) {
  return `
<div class="pf-b pfb-grid3">

  <!-- Header absoluto -->
  <div class="pfb-abs-header">
    <div class="pfb-titulo-dark" style="font-size:16px;margin-bottom:0">${label || ''}</div>
    <div class="pfb-num" style="margin-bottom:0">${num || ''} / ${total || ''}</div>
  </div>

  <!-- Grid de 3 fotos -->
  <div class="pfb-grid3-inner">
    <div class="pfb-grid3-foto-grande">
      <img src="${src1 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pfb-grid3-col">
      <div class="pfb-grid3-foto-pequena">
        <img src="${src2 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
      </div>
      <div class="pfb-grid3-foto-pequena">
        <img src="${src3 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
      </div>
    </div>
  </div>

  <!-- Footer absoluto -->
  <div class="pfb-abs-footer">
    <div class="pfb-footer-light-creci">${corretor?.nome || ''}</div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   BEGE TXT4 (pgBegeTxt4)
   [painel bege esq 28%] [grid 2×2 de fotos]
   ══════════════════════════════════════════════════════ */
export function pgBegeTxt4({ label, legenda, src1, src2, src3, src4, corretor, num, total }) {
  return `
<div class="pf-b pfb-txt4">

  <!-- Painel bege esquerda -->
  <div class="pfb-panel pfb-txt4-panel">
    <div class="pfb-num">${num || ''} / ${total || ''}</div>
    <div class="pfb-titulo" style="font-size:22px">${label || ''}</div>
    <div class="pfb-legenda-bege" style="font-size:13px">${legenda || ''}</div>

    ${footerBegeHtml(corretor || {}, num, total)}
  </div>

  <!-- Grid 2×2 de fotos -->
  <div class="pfb-txt4-grid">
    <div class="pfb-txt4-foto">
      <img src="${src1 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pfb-txt4-foto">
      <img src="${src2 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pfb-txt4-foto">
      <img src="${src3 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pfb-txt4-foto">
      <img src="${src4 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   BEGE ENCERRAMENTO (pgBegeEnc)
   [painel bege esq 44%] [foto dir]
   ══════════════════════════════════════════════════════ */
export function pgBegeEnc({ corretor, src }) {
  const { nome, tel, creci } = corretor || {};

  return `
<div class="pf-b pfb-enc">

  <!-- Painel bege esquerda -->
  <div class="pfb-panel pfb-enc-panel">

    <div class="pfb-enc-titulo">Entre em<br>contato</div>

    <div class="pfb-enc-contatos">
      ${nome ? `
      <div class="pfb-enc-item">
        <div class="pfb-enc-icon">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span class="pfb-enc-text">${nome}</span>
      </div>` : ''}

      ${tel ? `
      <div class="pfb-enc-item">
        <div class="pfb-enc-icon">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        </div>
        <span class="pfb-enc-text">${tel}</span>
      </div>` : ''}

      ${creci ? `
      <div class="pfb-enc-item">
        <div class="pfb-enc-icon">
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
        </div>
        <span class="pfb-enc-text">CRECI ${creci}</span>
      </div>` : ''}
    </div>

    <div class="pfb-enc-divider"></div>
    <div class="pfb-enc-rodape">Gerado por ImóvelText · Marketing Imobiliário</div>

  </div>

  <!-- Foto direita -->
  <div class="pfb-enc-foto">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>

</div>`.trim();
}
