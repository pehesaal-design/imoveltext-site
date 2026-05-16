/**
 * MÓDULO: Dark Layout — Orquestrador do Tema Escuro
 * RESPONSABILIDADE: Decidir qual layout usar para cada foto e montar o array de páginas
 * DEPENDÊNCIAS: dark-pages.js (templates), pdf-utils.js (getLabel)
 * IMPACTO: Alterações afetam apenas a estrutura do tema escuro
 *
 * LÓGICA DE SELEÇÃO DE LAYOUT:
 *   Capa:    foto.prop === 'v' → pgCapaV   |   foto.prop === 'h' → pgCapaH
 *   Galeria: foto.prop === 'v' → pgTextoFoto (L2, painel + foto vertical)
 *            foto.prop === 'h' → pgFotoFull  (L3, foto full-width)
 *
 * RESULTADO: pages[] — array de strings HTML, uma por página do PDF.
 *   Ordem: [capa, ...galeria ordenada por ambiente, encerramento]
 *
 * TOTAL: passado para cada página para exibir "X / Total" corretamente.
 *   total = galeria.length (não conta capa nem encerramento).
 *
 * @param {Object}   capa      — { src, prop, legenda } da foto de capa
 * @param {Object[]} galeria   — fotos restantes ordenadas por ambiente
 * @param {Object}   corrData  — { nome, tel, creci } do corretor
 * @param {Object}   imovel    — { titulo, bairro, preco, area, quartos, suites, tipo }
 * @returns {string[]}         — array de strings HTML (uma por página)
 */

import {
  pgCapaV,
  pgCapaH,
  pgTextoFoto,
  pgFotoFull,
  pgEncerramento,
} from './dark-pages.js';

export function montarPaginas(capa, galeria, corrData, imovel) {
  const pages = [];

  // Data atual para o brand da capa
  const agora = new Date();
  const mes   = agora.toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
  const ano   = agora.getFullYear();

  // ── CAPA ─────────────────────────────────────────────
  const dadosCapa = {
    ...imovel,
    src:      capa?.src || '',
    corretor: corrData,
    mes,
    ano,
  };

  if (capa?.prop === 'v') {
    pages.push(pgCapaV(dadosCapa));
  } else {
    pages.push(pgCapaH(dadosCapa));
  }

  // ── GALERIA ──────────────────────────────────────────
  const total = galeria.length;

  galeria.forEach((foto, idx) => {
    const num    = idx + 1;
    const label  = foto.label || '';
    const legenda = foto.legenda || '';

    if (foto.prop === 'v') {
      // Foto vertical → painel de texto à esquerda + foto à direita (L2)
      pages.push(pgTextoFoto({
        label,
        legenda,
        src:      foto.src,
        corretor: corrData,
        num,
        total,
      }));
    } else {
      // Foto horizontal → foto full-width com header e footer (L3)
      pages.push(pgFotoFull({
        label,
        legenda,
        src:      foto.src,
        corretor: corrData,
        num,
        total,
      }));
    }
  });

  // ── ENCERRAMENTO ─────────────────────────────────────
  pages.push(pgEncerramento({ corretor: corrData }));

  return pages;
}
