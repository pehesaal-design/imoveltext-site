/**
 * MÓDULO: PDF Utils — Utilitários Compartilhados
 * RESPONSABILIDADE: Funções puras de análise e distribuição de fotos
 * DEPENDÊNCIAS: Nenhuma (funções puras sem acesso ao DOM ou estado)
 * IMPACTO: Alterações afetam AMBOS os temas de PDF (escuro e bege)
 *
 * FUNÇÕES EXPORTADAS:
 *   AMBIENTE_LABELS    → constante única de labels de ambiente (elimina duplicação)
 *   propFoto()         → detecta proporção vertical ou horizontal de uma foto
 *   classificarAmbiente() → identifica o ambiente pelo texto da legenda
 *   distribuirFotos()  → separa capa e ordena galeria por ambiente
 *   getLabel()         → retorna o label de ambiente para um índice
 *   imgTag()           → gera tag <img> ou placeholder <div> para templates
 *
 * CRÍTICO — DUPLO USO DAS LEGENDAS:
 *   classificarAmbiente() usa o texto das legendas geradas pela IA.
 *   A qualidade da ordenação das fotos no PDF depende diretamente da
 *   qualidade das legendas. Por isso legendas.js instrui a IA a incluir
 *   a palavra do ambiente (ex: "piscina", "cozinha") em cada legenda.
 *
 * ORDENAÇÃO POR AMBIENTE:
 *   A galeria é ordenada por código de ambiente crescente, criando a
 *   narrativa coerente do PDF: exterior → lazer → social → íntimo.
 *   Fachada(0) → Lazer(1) → Sala(2) → Cozinha(3) → Quarto(4) →
 *   Escritório(5) → Detalhe(6) → Banheiro(8)
 */

/**
 * Labels de ambiente — constante única compartilhada por ambos os temas.
 * ANTES: duplicada em montarPaginas() e montarPaginasBege() — mudança
 * exigia edição em dois lugares. AGORA: fonte única de verdade.
 *
 * Índices mapeados por classificarAmbiente():
 *   0 → Fachada / Exterior
 *   1 → Área de Lazer
 *   2 → Sala de Estar
 *   3 → Cozinha
 *   4 → Quarto
 *   5 → Escritório
 *   6 → Detalhe (default quando ambiente não identificado)
 *   7 → Detalhe (alias)
 *   8 → Banheiro
 */
export const AMBIENTE_LABELS = [
  'Fachada',        // 0
  'Área de Lazer',  // 1
  'Sala de Estar',  // 2
  'Cozinha',        // 3
  'Quarto',         // 4
  'Escritório',     // 5
  'Detalhe',        // 6
  'Detalhe',        // 7
  'Banheiro',       // 8
];

/**
 * Retorna o label de ambiente para um índice.
 * @param {number} ordem — índice de classificação (0–8)
 * @returns {string} Label legível do ambiente
 */
export function getLabel(ordem) {
  return AMBIENTE_LABELS[Math.min(ordem, 8)] || 'Detalhe';
}

/**
 * Detecta a proporção de uma foto — vertical ou horizontal.
 * Usada pelo tema escuro para decidir qual layout aplicar (L1V vs L1H, L2 vs L3).
 *
 * LÓGICA:
 *   naturalHeight > naturalWidth * 1.15 → 'v' (retrato / vertical)
 *   caso contrário                      → 'h' (paisagem / horizontal)
 *   O threshold de 1.15 evita classificar fotos quase-quadradas como verticais.
 *
 * @param {string} src — src da imagem (base64 ou URL)
 * @returns {Promise<'v'|'h'>} Proporção detectada
 */
export function propFoto(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.naturalHeight > img.naturalWidth * 1.15 ? 'v' : 'h');
    };
    img.onerror = () => resolve('h'); // fallback: tratar como horizontal
    img.src = src;
  });
}

/**
 * Classifica o ambiente de uma foto pelo texto da legenda gerada pela IA.
 * Usa regex nas palavras-chave da legenda para identificar o tipo de ambiente.
 *
 * FALLBACK: código 6 (Detalhe) quando nenhuma palavra-chave é encontrada.
 * Isso garante que fotos não classificadas apareçam no meio do PDF,
 * não no início nem no final.
 *
 * @param {string} legenda — texto da legenda gerada pela IA para esta foto
 * @returns {number} Código de ambiente (0–8)
 */
export function classificarAmbiente(legenda) {
  if (!legenda) return 6;

  const l = legenda.toLowerCase();

  // Ordem importa: verificar do mais específico ao mais genérico
  if (/fachada|prédio|edificio|entrada|hall|portaria|externo|exterior|jardim/.test(l)) return 0;
  if (/piscina|lazer|churrasqueira|gourmet|varanda|sacada/.test(l))                    return 1;
  if (/sala|living|estar|jantar/.test(l))                                               return 2;
  if (/cozinha|copa/.test(l))                                                           return 3;
  if (/quarto|suíte|suite|master|dormitório/.test(l))                                   return 4;
  if (/clos|escritório|home.?office/.test(l))                                           return 5;
  if (/banheiro|lavabo|wc|box|chuveiro/.test(l))                                        return 8;

  return 6; // Detalhe — ambiente não identificado
}

/**
 * Distribui as fotos entre capa e galeria ordenada por ambiente.
 *
 * PROCESSO:
 *   1. Separa a foto de capa (fotoCapaIdx) das demais
 *   2. Para cada foto restante, detecta proporção e classifica ambiente
 *   3. Ordena a galeria por código de ambiente crescente
 *   4. Retorna { capa, galeria[] }
 *
 * RESULTADO:
 *   capa    → objeto { src, prop, legenda } da foto selecionada como capa
 *   galeria → array de objetos { src, prop, legenda, ambiente, label }
 *             ordenados por narrativa: exterior → lazer → social → íntimo
 *
 * @param {Array<{src: string}>} fotos       — array de fotos (base64)
 * @param {string[]}             legendas    — legendas na ordem das fotos
 * @param {number}               fotoCapaIdx — índice da foto de capa selecionada
 * @returns {Promise<{capa: Object, galeria: Object[]}>}
 */
export async function distribuirFotos(fotos, legendas, fotoCapaIdx) {
  if (!fotos || fotos.length === 0) {
    return { capa: null, galeria: [] };
  }

  // Foto de capa — detecta proporção
  const idxCapa = fotoCapaIdx ?? 0;
  const fotoCapa = fotos[idxCapa];
  const propCapa = await propFoto(fotoCapa.src);

  const capa = {
    src:     fotoCapa.src,
    prop:    propCapa,
    legenda: legendas?.[idxCapa] || '',
  };

  // Fotos restantes — detectar proporção e classificar ambiente em paralelo
  const fotosSemCapa = fotos
    .map((foto, i) => ({ foto, i }))
    .filter(({ i }) => i !== idxCapa);

  const galariaComDados = await Promise.all(
    fotosSemCapa.map(async ({ foto, i }) => {
      const legenda  = legendas?.[i] || '';
      const prop     = await propFoto(foto.src);
      const ambiente = classificarAmbiente(legenda);
      return {
        src:      foto.src,
        prop,
        legenda,
        ambiente,
        label:    getLabel(ambiente),
        indexOriginal: i,
      };
    })
  );

  // Ordenar por ambiente — narrativa coerente no PDF
  const galeria = galariaComDados.sort((a, b) => a.ambiente - b.ambiente);

  return { capa, galeria };
}

/**
 * Gera a tag <img> para uso nos templates HTML do PDF.
 * Retorna um placeholder <div> quando não há src disponível.
 *
 * CRÍTICO — HACK ONCLONE:
 *   O html2canvas não captura <img> com src base64 diretamente.
 *   O callback onclone em pdf-core.renderPagina() converte cada <img>
 *   em background-image no elemento pai. Para isso funcionar, o elemento
 *   pai precisa ter position:relative e os estilos de background prontos.
 *   Ver: scripts/pdf/pdf-core.js → renderPagina() → onclone
 *
 * @param {string} src — src da imagem (base64)
 * @param {string} cls — classe CSS do elemento pai (container da imagem)
 * @returns {string} HTML da imagem ou placeholder
 */
export function imgTag(src, cls = '') {
  if (!src) {
    return `<div class="${cls}" style="background:#1a1208;display:flex;align-items:center;justify-content:center;">
      <span style="color:rgba(255,255,255,0.2);font-size:11px;font-family:'DM Sans',sans-serif;">sem foto</span>
    </div>`;
  }

  return `<div class="${cls}" style="position:relative;overflow:hidden;">
    <img src="${src}" style="width:100%;height:100%;object-fit:contain;display:block;" alt=""/>
  </div>`;
}
