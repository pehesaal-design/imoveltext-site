/**
 * MÓDULO: Light Layout — Orquestrador do Tema Bege
 * RESPONSABILIDADE: Decidir qual layout usar por contagem de fotos e montar páginas
 * DEPENDÊNCIAS: light-pages.js (templates)
 * IMPACTO: Alterações afetam apenas a estrutura do tema bege
 *
 * DIFERENÇA FUNDAMENTAL DO TEMA ESCURO:
 *   Tema escuro: seleciona layout por PROPORÇÃO da foto (V ou H)
 *   Tema bege:   seleciona layout por CONTAGEM de fotos disponíveis no grupo
 *
 * LÓGICA DE DISTRIBUIÇÃO:
 *   galeria vazia ou 1 foto → apenas capa + encerramento
 *   2–3 fotos               → capa + pgBegeTxt2 (1 foto + legenda) + encerramento
 *   4–6 fotos               → capa + pgBegeGrid3 (3 fotos) + encerramento
 *   7+ fotos                → capa + mix de pgBegeGrid3 e pgBegeTxt4 + encerramento
 *
 * FOTO DE ENCERRAMENTO:
 *   Usa a última foto da galeria (ou a foto de capa como fallback)
 *   para a página de encerramento do tema bege.
 *
 * @param {Object}   capa      — { src, prop, legenda } da foto de capa
 * @param {Object[]} galeria   — fotos restantes ordenadas por ambiente
 * @param {Object}   corrData  — { nome, tel, creci } do corretor
 * @param {Object}   imovel    — { titulo, bairro, preco, area, quartos, suites, tipo }
 * @returns {string[]}         — array de strings HTML (uma por página)
 */

import {
  pgBegeCapa,
  pgBegeTxt2,
  pgBegeGrid3,
  pgBegeTxt4,
  pgBegeEnc,
} from './light-pages.js';

export function montarPaginasBege(capa, galeria, corrData, imovel) {
  const pages  = [];
  const total  = galeria.length;

  // Foto para o encerramento — última da galeria ou capa como fallback
  const srcEnc = galeria.length > 0
    ? galeria[galeria.length - 1].src
    : capa?.src || '';

  // ── CAPA ─────────────────────────────────────────────
  pages.push(pgBegeCapa({
    ...imovel,
    src:      capa?.src || '',
    corretor: corrData,
    total:    total + 1,
  }));

  // ── SEPARAR POR PROPORÇÃO ─────────────────────────────
  // O campo prop ('h' ou 'v') foi preenchido por distribuirFotos() em pdf-utils.js.
  // Separar antes de montar evita misturar verticais e horizontais no mesmo grid:
  // pgBegeTxt4 (2×2) com fotos verticais gera espaços vazios e distorções.
  // .slice() para não mutar o array original.
  const fotosH = galeria.filter(f => f.prop === 'h').slice();
  const fotosV = galeria.filter(f => f.prop === 'v').slice();

  let pageNum = 2;

  // ── FASE 1: FOTOS HORIZONTAIS ─────────────────────────

  // pgBegeTxt4: grid 2×2 — compatível apenas com prop 'h'
  while (fotosH.length >= 4) {
    const g = fotosH.splice(0, 4);
    pages.push(pgBegeTxt4({
      label:    g[0].label   || '',
      legenda:  g[0].legenda || '',
      src1:     g[0].src,
      src2:     g[1].src,
      src3:     g[2].src,
      src4:     g[3].src,
      corretor: corrData,
      num:      pageNum++,
      total:    total + 1,
    }));
  }

  // pgBegeGrid3 ou pgBegeTxt2 para o restante das horizontais
  while (fotosH.length >= 1) {
    // Slots disponíveis para as 2 fotos pequenas após reservar 1 para a foto grande
    const disponiveis = (fotosH.length - 1) + fotosV.length;

    if (disponiveis >= 2) {
      // pgBegeGrid3: 1 grande H + 2 pequenas (H primeiro, depois V)
      const grande   = fotosH.shift();
      const pequenas = [];
      while (pequenas.length < 2 && fotosH.length > 0) pequenas.push(fotosH.shift());
      while (pequenas.length < 2 && fotosV.length > 0) pequenas.push(fotosV.shift());
      pages.push(pgBegeGrid3({
        label:    grande.label || '',
        src1:     grande.src,
        src2:     pequenas[0]?.src || '',
        src3:     pequenas[1]?.src || '',
        corretor: corrData,
        num:      pageNum++,
        total:    total + 1,
      }));

    } else if (fotosH.length >= 2) {
      // 2H disponíveis mas sem pool suficiente para grid3: empilhar via pgBegeTxt2
      const g = fotosH.splice(0, 2);
      pages.push(pgBegeTxt2({
        label:    g[0].label   || '',
        legenda:  g[0].legenda || '',
        src1:     g[0].src,
        src2:     g[1].src,
        corretor: corrData,
        num:      pageNum++,
        total:    total + 1,
      }));

    } else {
      // 1H restante: pgBegeTxt2 — segundo slot preenchido por fotosV ou vazio
      const foto  = fotosH.shift();
      const foto2 = fotosV.length > 0 ? fotosV.shift() : null;
      pages.push(pgBegeTxt2({
        label:    foto.label   || '',
        legenda:  foto.legenda || '',
        src1:     foto.src,
        src2:     foto2?.src || '',
        corretor: corrData,
        num:      pageNum++,
        total:    total + 1,
      }));
    }
  }

  // ── FASE 2: FOTOS VERTICAIS RESTANTES ─────────────────
  // pgBegeTxt2: empilhadas — layout ideal para proporção vertical
  while (fotosV.length >= 2) {
    const g = fotosV.splice(0, 2);
    pages.push(pgBegeTxt2({
      label:    g[0].label   || '',
      legenda:  g[0].legenda || '',
      src1:     g[0].src,
      src2:     g[1].src,
      corretor: corrData,
      num:      pageNum++,
      total:    total + 1,
    }));
  }

  if (fotosV.length === 1) {
    const foto = fotosV.shift();
    pages.push(pgBegeTxt2({
      label:    foto.label   || '',
      legenda:  foto.legenda || '',
      src1:     foto.src,
      src2:     '',
      corretor: corrData,
      num:      pageNum++,
      total:    total + 1,
    }));
  }

  // ── ENCERRAMENTO ─────────────────────────────────────
  pages.push(pgBegeEnc({
    corretor: corrData,
    src:      srcEnc,
  }));

  return pages;
}
