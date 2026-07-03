/**
 * MÓDULO: Dark Pages — Templates do Tema Escuro
 * RESPONSABILIDADE: Funções puras que retornam HTML dos layouts do tema escuro
 * DEPENDÊNCIAS: pdf-utils.js (imgTag, getLabel)
 * IMPACTO: Alterações afetam apenas o tema escuro
 *
 * PRINCÍPIO: Cada função é pura — recebe dados, retorna string HTML.
 * Sem acesso ao AppState, sem side effects, sem manipulação do DOM.
 * Testável isoladamente: basta chamar a função e inspecionar o HTML.
 *
 * ASSINATURA PADRÃO:
 *   function pgNome(dados) → string HTML
 *   dados = { titulo, bairro, preco, area, quartos, suites, tipo,
 *             src (foto principal), src1/src2 (fotos secundárias),
 *             label, legenda, leg1/leg2,
 *             corretor: { nome, tel, creci },
 *             num, total, mes, ano }
 *
 * ESTILOS: Definidos em styles/pdf/pdf-dark.css
 *          Classes .pf, .pf-l1v, .pf-l1h, .pf-l2, .pf-l3, .pf-l4, .pf-l5, .pf-l6
 *
 * HACK ONCLONE: As <img> são convertidas em background-image pelo
 *   callback onclone do html2canvas. O wrapper div precisa de
 *   position:relative para o background funcionar corretamente.
 *   Ver: scripts/pdf/pdf-core.js → renderPagina()
 *
 * NOTA LAYOUTS L4/L5: Definidos mas verificar uso real em dark-layout.js
 *   antes de remover. Marcados com ⚠️ para rastreabilidade.
 */

import { imgTag, getLabel } from '../pdf-utils.js';

/**
 * Formata preço para exibição: adiciona "R$" e separador de milhar.
 * Strings já com "R$" passam sem alteração. Strings não numéricas (ex: "Consultar") passam sem prefixo.
 */
function formatarPreco(valor) {
  if (valor === undefined || valor === null || valor === '') return '—';
  const s = String(valor).trim();
  if (!s) return '—';
  if (s.includes('R$')) return s;
  if (/^[\d.,]+$/.test(s)) {
    const numero = parseFloat(s.replace(/\./g, '').replace(',', '.'));
    if (!isNaN(numero)) return 'R$ ' + Math.round(numero).toLocaleString('pt-BR');
    return 'R$ ' + s;
  }
  return s;
}

/**
 * Círculo decorativo — identidade visual do tema escuro.
 * Posicionado absolutamente com tamanho e coordenadas variáveis por layout.
 * @param {number} top  — posição top em px (use negativo para fora da borda)
 * @param {number} left — posição left em px
 * @param {number} size — diâmetro em px
 */
function circ(top, left, size) {
  return `<div class="pf-circ" style="width:${size}px;height:${size}px;top:${top}px;left:${left}px;"></div>`;
}

/**
 * Ficha técnica — grid de itens do imóvel.
 * Compartilhado entre L1V e L1H.
 */
function fichaHtml({ bairro, preco, area, quartos, suites, tipo }) {
  const itens = [
    { label: 'Local',    valor: bairro              || '—' },
    { label: 'Preço',    valor: formatarPreco(preco),  dest: true },
    { label: 'Área',     valor: area     ? area + ' m²' : '—' },
    { label: 'Quartos',  valor: quartos  || '—' },
    { label: 'Suítes',   valor: suites   || '—' },
    { label: 'Tipo',     valor: tipo     || '—' },
  ];

  return itens.map(({ label, valor, dest }) => `
    <div class="pf-ficha-item">
      <span class="pf-ficha-label">${label}</span>
      <span class="pf-ficha-valor${dest ? ' dest' : ''}">${valor}</span>
    </div>`
  ).join('');
}

/**
 * Footer padrão — nome do corretor + CRECI.
 */
function footerHtml({ nome, tel, creci }) {
  return `
    <div class="pf-footer">
      <span class="pf-footer-nome">${nome || 'ImóvelStudio'}</span>
      <span class="pf-footer-creci">${creci ? `CRECI ${creci}` : ''}</span>
    </div>`;
}

/* ══════════════════════════════════════════════════════
   L1V — Capa com Foto Vertical
   [painel esq 36%] [foto dir 64%]
   ══════════════════════════════════════════════════════ */
export function pgCapaV({ titulo, bairro, preco, area, quartos, suites, tipo, src, corretor, mes, ano }) {
  return `
<div class="pf pf-l1v">

  <!-- Painel esquerdo -->
  <div class="pf-l1v-panel pf-panel">
    ${circ(-80, -80, 300)}
    ${circ(40, -60, 160)}

    <div class="pf-brand">ImóvelStudio · ${mes || ''} ${ano || ''}</div>
    <div class="pf-badge">${tipo || 'Imóvel'}</div>
    <div class="pf-titulo" style="font-size:28px">${titulo || ''}</div>

    <div class="pf-ficha">
      ${fichaHtml({ bairro, preco, area, quartos, suites, tipo })}
    </div>

    ${footerHtml(corretor || {})}
  </div>

  <!-- Foto vertical direita -->
  <div class="pf-l1v-foto">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L1H — Capa com Foto Horizontal
   [foto full com overlay] [painel dir 38%]
   ══════════════════════════════════════════════════════ */
export function pgCapaH({ titulo, bairro, preco, area, quartos, suites, tipo, src, corretor, mes, ano }) {
  return `
<div class="pf pf-l1h">

  <!-- Foto full-width com overlay -->
  <div class="pf-l1h-foto-ph">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    <div class="pf-l1h-overlay"></div>
  </div>

  <!-- Painel direito -->
  <div class="pf-l1h-panel pf-panel">
    ${circ(-60, -60, 280)}
    ${circ(30, 20, 120)}

    <div class="pf-brand">ImóvelStudio · ${mes || ''} ${ano || ''}</div>
    <div class="pf-badge">${tipo || 'Imóvel'}</div>
    <div class="pf-titulo" style="font-size:26px">${titulo || ''}</div>

    <div class="pf-ficha">
      ${fichaHtml({ bairro, preco, area, quartos, suites, tipo })}
    </div>

    ${footerHtml(corretor || {})}
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L2 — Texto Esquerdo + Foto Vertical Direita
   [painel esq 36%] [foto vertical dir 64%]
   ══════════════════════════════════════════════════════ */
export function pgTextoFoto({ label, legenda, src, corretor, num, total }) {
  return `
<div class="pf pf-l2">

  <!-- Painel esquerdo com texto -->
  <div class="pf-l2-panel pf-panel">
    ${circ(-50, -50, 200)}
    ${circ(20, -30, 100)}

    <div class="pf-num">${num || '1'} / ${total || '1'}</div>
    <div class="pf-label-ambiente" style="font-size:26px">${label || ''}</div>
    <div class="pf-legenda" style="font-size:20px;flex:1">${legenda || ''}</div>

    ${footerHtml(corretor || {})}
  </div>

  <!-- Foto vertical direita -->
  <div class="pf-l2-foto">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L3 — Foto Horizontal Full-Width
   [header] [foto full flex:1] [footer]
   ══════════════════════════════════════════════════════ */
export function pgFotoFull({ label, legenda, src, corretor, num, total }) {
  return `
<div class="pf pf-l3">

  <!-- Header -->
  <div class="pf-l3-header">
    <div class="pf-label-ambiente" style="font-size:22px;margin-bottom:0">${label || ''}</div>
    <div class="pf-num" style="margin-bottom:0">${num || '1'} / ${total || '1'}</div>
  </div>

  <!-- Foto full-width -->
  <div class="pf-l3-foto">
    <img src="${src || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>

  <!-- Footer -->
  <div class="pf-l3-footer">
    <div class="pf-legenda" style="font-size:17px;flex:1">${legenda || ''}</div>
    <div class="pf-footer-nome" style="text-align:right;white-space:nowrap;margin-left:24px">
      ${corretor?.nome || ''}
    </div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L4 — 2 Fotos Horizontais Lado a Lado
   [header] [foto1 | foto2] [footer]
   ⚠️ Verificar uso real em dark-layout.js antes de remover
   ══════════════════════════════════════════════════════ */
export function pg2FotasH({ label, legenda, src1, src2, corretor, num, total }) {
  return `
<div class="pf pf-l4">

  <!-- Header -->
  <div class="pf-l4-header">
    <div class="pf-label-ambiente" style="font-size:18px;margin-bottom:0">${label || ''}</div>
    <div class="pf-num" style="margin-bottom:0">${num || '1'} / ${total || '1'}</div>
  </div>

  <!-- 2 fotos lado a lado -->
  <div class="pf-l4-fotos">
    <div class="pf-l4-foto">
      <img src="${src1 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pf-l4-foto">
      <img src="${src2 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
  </div>

  <!-- Footer -->
  <div class="pf-l4-footer">
    <div class="pf-legenda" style="font-size:14px;flex:1">${legenda || ''}</div>
    <div class="pf-footer-nome">${corretor?.nome || ''}</div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L5 — 2 Fotos Verticais Lado a Lado
   [col1 foto+legenda] [divisor] [col2 foto+legenda]
   ⚠️ Verificar uso real em dark-layout.js antes de remover
   ══════════════════════════════════════════════════════ */
export function pg2FotasV({ label, leg1, leg2, src1, src2, corretor, num, total }) {
  return `
<div class="pf pf-l5">

  <!-- Coluna 1 -->
  <div class="pf-l5-col">
    <div class="pf-l5-header">
      <div class="pf-num" style="margin-bottom:4px">${num || '1'} / ${total || '1'}</div>
      <div class="pf-label-ambiente" style="font-size:16px;margin-bottom:0">${label || ''}</div>
    </div>
    <div class="pf-l5-foto">
      <img src="${src1 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pf-l5-legenda-bar">
      <div class="pf-legenda" style="font-size:14px">${leg1 || ''}</div>
    </div>
  </div>

  <!-- Divisor vertical -->
  <div class="pf-l5-div"></div>

  <!-- Coluna 2 -->
  <div class="pf-l5-col">
    <div class="pf-l5-foto">
      <img src="${src2 || ''}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
    </div>
    <div class="pf-l5-legenda-bar">
      <div class="pf-legenda" style="font-size:14px">${leg2 || ''}</div>
    </div>
    <div class="pf-l5-footer-abs">
      <div class="pf-footer-nome">${corretor?.nome || ''}</div>
      <div class="pf-footer-creci">${corretor?.creci ? `CRECI ${corretor.creci}` : ''}</div>
    </div>
  </div>

</div>`.trim();
}

/* ══════════════════════════════════════════════════════
   L6 — Encerramento
   [centralizado, fundo escuro, dados do corretor + ícones]
   ══════════════════════════════════════════════════════ */
export function pgEncerramento({ corretor }) {
  const { nome, tel, creci } = corretor || {};

  return `
<div class="pf pf-l6">

  ${circ(-150, -100, 400)}
  ${circ(-60, -60, 200)}
  ${circ(40, 120, 120)}

  <div class="pf-l6-logo">ImóvelStudio</div>

  <div class="pf-l6-titulo">Entre em<br>contato</div>

  <div class="pf-l6-contatos">
    ${nome ? `
    <div class="pf-l6-item">
      <div class="pf-l6-icon">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <span class="pf-l6-text">${nome}</span>
    </div>` : ''}

    ${tel ? `
    <div class="pf-l6-item">
      <div class="pf-l6-icon">
        <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </div>
      <span class="pf-l6-text">${tel}</span>
    </div>` : ''}

    ${creci ? `
    <div class="pf-l6-item">
      <div class="pf-l6-icon">
        <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
      </div>
      <span class="pf-l6-text">CRECI ${creci}</span>
    </div>` : ''}
  </div>

  <div class="pf-l6-divider"></div>

  <div class="pf-l6-rodape">Gerado por ImóvelStudio · Marketing Imobiliário</div>

</div>`.trim();
}
