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
  const pages = [];
  const total = galeria.length;

  // Foto para o encerramento — última da galeria ou capa como fallback
  const srcEnc = galeria.length > 0
    ? galeria[galeria.length - 1].src
    : capa?.src || '';

  // ── CAPA ─────────────────────────────────────────────
  pages.push(pgBegeCapa({
    ...imovel,
    src:      capa?.src || '',
    corretor: corrData,
    total:    total + 1, // capa é a página 1
  }));

  // ── GALERIA ──────────────────────────────────────────
  // Consumir fotos em grupos conforme disponibilidade
  let i = 0;
  let pageNum = 2; // capa foi a página 1

  while (i < galeria.length) {
    const restantes = galeria.length - i;

    if (restantes >= 4) {
      // pgBegeTxt4 — painel + 4 fotos em grid 2×2
      const grupo  = galeria.slice(i, i + 4);
      const foto   = grupo[0]; // label e legenda da primeira foto do grupo
      pages.push(pgBegeTxt4({
        label:   foto.label   || '',
        legenda: foto.legenda || '',
        src1:    grupo[0]?.src || '',
        src2:    grupo[1]?.src || '',
        src3:    grupo[2]?.src || '',
        src4:    grupo[3]?.src || '',
        corretor: corrData,
        num:      pageNum,
        total:    total + 1,
      }));
      i += 4;

    } else if (restantes === 3) {
      // pgBegeGrid3 — 1 foto grande + 2 pequenas
      const grupo = galeria.slice(i, i + 3);
      pages.push(pgBegeGrid3({
        label:   grupo[0]?.label || '',
        src1:    grupo[0]?.src   || '',
        src2:    grupo[1]?.src   || '',
        src3:    grupo[2]?.src   || '',
        corretor: corrData,
        num:      pageNum,
        total:    total + 1,
      }));
      i += 3;

    } else if (restantes === 2) {
      // pgBegeTxt2 — texto + 2 fotos empilhadas
      const grupo = galeria.slice(i, i + 2);
      pages.push(pgBegeTxt2({
        label:   grupo[0]?.label   || '',
        legenda: grupo[0]?.legenda || '',
        src1:    grupo[0]?.src     || '',
        src2:    grupo[1]?.src     || '',
        corretor: corrData,
        num:      pageNum,
        total:    total + 1,
      }));
      i += 2;

    } else {
      // 1 foto restante — pgBegeTxt2 com segunda foto vazia
      const foto = galeria[i];
      pages.push(pgBegeTxt2({
        label:   foto?.label   || '',
        legenda: foto?.legenda || '',
        src1:    foto?.src     || '',
        src2:    '',
        corretor: corrData,
        num:      pageNum,
        total:    total + 1,
      }));
      i += 1;
    }

    pageNum++;
  }

  // ── ENCERRAMENTO ─────────────────────────────────────
  pages.push(pgBegeEnc({
    corretor: corrData,
    src:      srcEnc,
  }));

  return pages;
}
