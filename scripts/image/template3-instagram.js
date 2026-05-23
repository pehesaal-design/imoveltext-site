function _iconeParaDiferencial3(titulo) {
  const t = (titulo || '').toLowerCase();
  if (t.includes('vista') || t.includes('mar') || t.includes('praia'))
    return '<circle cx="12" cy="9" r="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="5.6" y1="5.6" x2="7" y2="7"/><line x1="18.4" y1="5.6" x2="17" y2="7"/><path d="M3 17 Q6 14.5 9 17 Q12 19.5 15 17 Q18 14.5 21 17"/><path d="M3 20.5 Q6 18 9 20.5 Q12 23 15 20.5 Q18 18 21 20.5"/>';
  if (t.includes('garagem') || t.includes('vaga') || t.includes('carro'))
    return '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>';
  if (t.includes('lazer') || t.includes('piscina') || t.includes('churras'))
    return '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/><line x1="12" y1="12" x2="12" y2="19"/>';
  if (t.includes('segurança') || t.includes('portaria') || t.includes('24h'))
    return '<path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>';
  if (t.includes('localização') || t.includes('localiz') || t.includes('perto') || t.includes('próximo'))
    return '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>';
  if (t.includes('mobil') || t.includes('decorad') || t.includes('planejad'))
    return '<path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>';
  if (t.includes('acabamento') || t.includes('alto padrão') || t.includes('luxo'))
    return '<path d="M6 3h12l4 6-10 12L2 9z"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="8" y1="3" x2="6" y2="9"/><line x1="16" y1="3" x2="18" y2="9"/>';
  if (t.includes('invest') || t.includes('valoriz'))
    return '<circle cx="8" cy="10" r="4"/><line x1="12" y1="10" x2="21" y2="10"/><line x1="19" y1="10" x2="19" y2="13"/><line x1="17" y1="10" x2="17" y2="12"/>';
  return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
}

export function buildTemplate3HTML(dados, textos) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root { --gold: #B8923A; --teal-dark: #0D2B30; --card-bg: #FAFAF7; --text-dark: #1A1A1A; --text-mid: #3A3A3A; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: var(--card-bg); font-family: 'Montserrat', sans-serif; }
.card { width: 1080px; height: 1350px; overflow: hidden; display: flex; flex-direction: column; background: var(--card-bg); }
.hero { width: 1080px; height: 560px; flex-shrink: 0; position: relative; overflow: hidden; }
.hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; display: block; }
.hero::after { content: ''; position: absolute; bottom: 0; left: 0; width: 320px; height: 230px; background: var(--teal-dark); clip-path: polygon(0 45%, 0 100%, 100% 100%); }
.hero::before { content: ''; position: absolute; top: 0; right: 0; width: 200px; height: 160px; background: var(--card-bg); clip-path: polygon(100% 0, 100% 100%, 0 0); z-index: 2; }
.body { flex: 1; position: relative; background: var(--card-bg); padding: 56px 76px 48px 76px; display: flex; flex-direction: column; overflow: hidden; }
.logo-row { display: flex; align-items: center; gap: 18px; margin-bottom: 40px; flex-shrink: 0; position: relative; z-index: 1; }
.logo-icon svg { width: 50px; height: 56px; }
.logo-text { display: flex; flex-direction: column; }
.logo-name { font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 20px; letter-spacing: .22em; color: var(--text-dark); line-height: 1; }
.logo-sub { font-family: 'Montserrat', sans-serif; font-weight: 300; font-size: 10px; letter-spacing: .18em; color: var(--gold); margin-top: 5px; }
.headline { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 58px; line-height: 1.1; color: var(--text-dark); max-width: 62%; margin-bottom: 28px; flex-shrink: 0; position: relative; z-index: 1; }
.headline em { font-style: normal; color: var(--gold); }
.rule { width: 52px; height: 2px; background: var(--gold); margin-bottom: 22px; flex-shrink: 0; position: relative; z-index: 1; }
.tagline { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 26px; color: var(--text-mid); line-height: 1.55; max-width: 58%; flex: 1; position: relative; z-index: 1; }
.features { display: grid; grid-template-columns: repeat(4, 1fr); height: 110px; flex-shrink: 0; border-top: 1px solid rgba(0,0,0,.1); padding-top: 28px; align-items: start; position: relative; z-index: 1; }
.feature { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 6px; position: relative; }
.feature:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 5%; height: 90%; width: 1px; background: rgba(0,0,0,.1); }
.feature svg { width: 36px; height: 36px; stroke: var(--gold); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.feature-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dark); text-align: center; line-height: 1.5; }
</style>
</head>
<body>
<article class="card">
  <div class="hero">
    <img src="${dados.fotoBase64}" alt="">
  </div>
  <div class="body">
    <div class="logo-row">
      <div class="logo-icon">
        <svg viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 41 L4 18 L19 5 L34 18 L34 41" stroke="#B8923A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 41 L12 24 L19 16 L26 24 L26 41" stroke="#B8923A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="19" cy="5" r="1.5" fill="#B8923A"/>
        </svg>
      </div>
      <div class="logo-text">
        <span class="logo-name">${dados.tipo} • ${dados.bairro}</span>
        <span class="logo-sub">${dados.cidade || 'Salvador / BA'}</span>
      </div>
    </div>
    <h1 class="headline">
      ${textos.titulo_normal || ''} <em>${textos.titulo_dourado || ''}</em>
    </h1>
    <div class="rule"></div>
    <p class="tagline">${textos.subtitulo || ''}</p>
    <div class="features">
      ${(textos.diferenciais || []).slice(0,4).map(d => `
      <div class="feature">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          ${_iconeParaDiferencial3(d.titulo)}
        </svg>
        <span class="feature-label">${d.titulo}<br><span style="font-weight:400;opacity:0.7">${d.sub}</span></span>
      </div>`).join('')}
    </div>
  </div>
</article>
</body>
</html>`;
}
