function _iconeParaDiferencial(titulo) {
  const t = (titulo || '').toLowerCase();
  if (t.includes('vista') || t.includes('mar') || t.includes('praia'))
    return '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  if (t.includes('garagem') || t.includes('vaga') || t.includes('carro'))
    return '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>';
  if (t.includes('lazer') || t.includes('piscina') || t.includes('churras'))
    return '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/><line x1="12" y1="12" x2="12" y2="19"/>';
  if (t.includes('segurança') || t.includes('portaria') || t.includes('24h'))
    return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
  if (t.includes('localização') || t.includes('localiz') || t.includes('perto') || t.includes('próximo'))
    return '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>';
  if (t.includes('mobil') || t.includes('decorad') || t.includes('planejad'))
    return '<path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>';
  if (t.includes('andar') || t.includes('alto') || t.includes('cobertura'))
    return '<polyline points="18 15 12 9 6 15"/>';
  if (t.includes('área') || t.includes('espaço') || t.includes('amplo'))
    return '<rect x="3" y="3" width="18" height="18" rx="1" stroke-dasharray="3 2"/>';
  // ícone padrão: diamante
  return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
}

export function buildTemplateHTML(dados, textos) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
:root { --navy: #0b1828; --navy-card: #0e1f38; --gold: #c8991f; --gold-light: #deb84a; --white: #ffffff; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: #060f1c; font-family: 'Montserrat', sans-serif; }
.flyer { width: 1080px; height: 1350px; background: var(--navy); display: flex; flex-direction: column; overflow: hidden; }
.hero { position: relative; width: 1080px; height: 560px; flex-shrink: 0; overflow: hidden; background: linear-gradient(160deg,#1a3050 0%,#0b1828 60%,#050d18 100%); }
.hero-photo { width: 100%; height: 100%; object-fit: cover; opacity: 0.82; display: block; }
.hero-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; background: linear-gradient(135deg,#1a3a5c,#0d2240,#050f20); color: rgba(200,153,31,0.45); font-size: 18px; letter-spacing: 3px; text-transform: uppercase; }
.hero-placeholder svg { opacity: 0.3; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(6,15,28,0.60) 0%, rgba(6,15,28,0.15) 45%, rgba(6,15,28,0.72) 100%); }
.hero-content { position: absolute; top: 0; left: 0; right: 0; padding: 52px 60px 0; text-align: center; }
.label-residencial { font-size: 18px; font-weight: 600; letter-spacing: 9px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 10px; }
.title-villa { font-size: 110px; font-weight: 900; line-height: 0.95; letter-spacing: -2px; text-transform: uppercase; margin-bottom: 20px; }
.title-villa .w { color: var(--white); }
.title-villa .g { color: var(--gold-light); }
.subtitle-row { display: flex; align-items: center; justify-content: center; gap: 18px; }
.sub-line { flex: 1; height: 1.5px; background: var(--gold); max-width: 110px; }
.sub-text { font-size: 14px; font-weight: 700; letter-spacing: 4.5px; text-transform: uppercase; color: var(--white); white-space: nowrap; }
.middle { flex: none; height: 320px; display: grid; grid-template-columns: 1fr 2px 1fr; padding: 38px 46px 28px; gap: 0; background: var(--navy); align-content: start; }
.div-v { background: linear-gradient(to bottom, transparent, var(--gold) 15%, var(--gold) 85%, transparent); opacity: 0.45; margin: 0 6px; }
.tag { display: inline-block; background: var(--gold); color: var(--navy); font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 7px 18px; border-radius: 3px; margin-bottom: 22px; }
.feat-list { list-style: none; display: flex; flex-direction: column; gap: 17px; }
.feat-item { display: flex; align-items: flex-start; gap: 14px; }
.feat-icon { width: 24px; height: 24px; flex-shrink: 0; margin-top: 1px; color: var(--gold-light); }
.feat-text { font-size: 14px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--white); line-height: 1.45; }
.col-right { padding-left: 36px; }
.invest-head { font-size: 38px; font-weight: 900; line-height: 1.12; text-transform: uppercase; margin-bottom: 18px; }
.invest-head .w { color: var(--white); }
.invest-head .g { color: var(--gold-light); }
.invest-sub { font-size: 15px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--white); line-height: 1.55; opacity: 0.85; }
.price-block { margin: 0 38px 16px; border: 2.5px solid var(--gold); border-radius: 8px; padding: 16px 36px; text-align: center; background: linear-gradient(135deg, #0e1f38 0%, #0b1828 100%); flex-shrink: 0; }
.price-label { font-size: 15px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-light); margin-bottom: 6px; }
.price-value { font-size: 72px; font-weight: 900; color: var(--white); line-height: 1; letter-spacing: -2px; margin-bottom: 14px; }
.price-div { height: 2px; background: linear-gradient(to right, transparent, var(--gold), transparent); margin-bottom: 12px; }
.footer { background: #0a1626; border-top: 2px solid rgba(200,153,31,0.3); display: grid; grid-template-columns: repeat(4, 1fr); padding: 24px 30px 28px; gap: 6px; flex-shrink: 0; min-height: 160px; }
.foot-item { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; }
.foot-icon { width: 40px; height: 40px; color: var(--gold-light); }
.foot-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--white); line-height: 1.45; opacity: 0.9; overflow: visible; white-space: normal; word-break: break-word; }
.foot-item + .foot-item { border-left: 1px solid rgba(200,153,31,0.18); }
</style>
</head>
<body>
<div class="flyer">
  <div class="hero">
    <img class="hero-photo" src="${dados.fotoBase64}" alt="">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="label-residencial">${dados.tipo} • ${dados.bairro}</div>
      <div class="title-villa">
        <span class="w">${textos.titulo}</span>
      </div>
      <div class="subtitle-row">
        <div class="sub-line"></div>
        <div class="sub-text">${textos.subtitulo}</div>
        <div class="sub-line"></div>
      </div>
    </div>
  </div>
  <div class="middle">
    <div class="col-left">
      <div class="tag">Características</div>
      <ul class="feat-list">
        ${dados.quartos ? `
        <li class="feat-item">
          <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="feat-text">${dados.quartos} Quartos</span>
        </li>` : ''}
        ${dados.suites ? `
        <li class="feat-item">
          <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/>
            <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>
          </svg>
          <span class="feat-text">${dados.suites} Suítes</span>
        </li>` : ''}
        ${dados.area ? `
        <li class="feat-item">
          <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="1" stroke-dasharray="3 2"/>
          </svg>
          <span class="feat-text">${dados.area}m² de Área Privativa</span>
        </li>` : ''}
        ${dados.vagas ? `
        <li class="feat-item">
          <svg class="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span class="feat-text">${dados.vagas} Vaga${Number(dados.vagas) > 1 ? 's' : ''} de Garagem</span>
        </li>` : ''}
      </ul>
    </div>
    <div class="div-v"></div>
    <div class="col-right">
      <div class="tag">Destaques</div>
      <div class="invest-head">
        <span class="g">${textos.descricao}</span>
      </div>
    </div>
  </div>
  <div class="price-block">
    <div class="price-label">Valor</div>
    <div class="price-value">${dados.preco ? (String(dados.preco).includes('R$') ? dados.preco : 'R$ ' + dados.preco) : 'Consultar'}</div>
    <div class="price-div"></div>
  </div>
  <div class="footer">
    ${textos.diferenciais.map(d => `
<div class="foot-item">
  <svg class="foot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    ${_iconeParaDiferencial(d.titulo)}
  </svg>
  <span class="foot-label">${d.titulo}<br>
    <span style="opacity:0.7;font-weight:500">${d.sub}</span>
  </span>
</div>`).join('')}
  </div>
</div>
</body>
</html>`;
}
