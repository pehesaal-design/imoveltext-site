function _iconeParaDiferencial3(titulo) {
  const t = (titulo || '').toLowerCase();
  if (t.includes('vista') || t.includes('mar') || t.includes('praia'))
    return '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  if (t.includes('garagem') || t.includes('vaga') || t.includes('carro'))
    return '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>';
  if (t.includes('lazer') || t.includes('piscina') || t.includes('churras'))
    return '<path d="M2 12h20M2 12c2-4 4-6 6-6s4 4 6 4 4-4 6-4M2 12c2 4 4 6 6 6s4-4 6-4 4 4 6 4"/>';
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
  return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
}

export function buildTemplate3HTML(dados, textos) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #f5f0e8; margin: 0; padding: 0; }
.flyer { width: 1080px; height: 1350px; position: relative; overflow: hidden; background: #f5f0e8; font-family: 'Montserrat', sans-serif; }
.foto-wrap { position: absolute; top: 0; left: 0; right: 0; height: 620px; overflow: hidden; }
.foto { width: 100%; height: 100%; object-fit: cover; display: block; }
.triangulo-dir { position: absolute; top: 0; right: 0; width: 0; height: 0; border-style: solid; border-width: 0 160px 160px 0; border-color: transparent #f5f0e8 transparent transparent; z-index: 3; }
.corte { position: absolute; top: 540px; left: 0; width: 100%; height: 120px; z-index: 2; }
.fundo-claro { position: absolute; top: 600px; left: 0; right: 0; bottom: 0; background: #f5f0e8; z-index: 1; }
.content { position: absolute; top: 640px; left: 0; right: 0; bottom: 0; z-index: 3; padding: 0 72px 56px; display: flex; flex-direction: column; justify-content: space-between; }
.marca { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
.marca-icone { width: 52px; height: 52px; color: #c8991f; }
.marca-texto { display: flex; flex-direction: column; gap: 2px; }
.marca-nome { font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #1a1a1a; }
.marca-sub { font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #c8991f; }
.titulo { font-family: 'Playfair Display', serif; font-size: 76px; font-weight: 700; line-height: 1.05; color: #1a1a1a; letter-spacing: -1px; margin-bottom: 28px; }
.titulo .dourado { color: #c8991f; }
.separador { width: 52px; height: 2px; background: #c8991f; margin-bottom: 24px; }
.subtitulo { font-size: 24px; font-weight: 300; color: #555; line-height: 1.6; letter-spacing: 0.5px; }
.icones { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(200,153,31,0.3); padding-top: 32px; }
.icone-item { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 0 12px; border-right: 1px solid rgba(200,153,31,0.25); }
.icone-item:last-child { border-right: none; }
.icone-svg { width: 40px; height: 40px; color: #c8991f; }
.icone-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #1a1a1a; line-height: 1.5; }
</style>
</head>
<body>
<div class="flyer">
  <div class="foto-wrap">
    <img class="foto" src="${dados.fotoBase64}" alt="">
  </div>
  <div class="triangulo-dir"></div>
  <svg class="corte" viewBox="0 0 1080 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,80 L1080,0 L1080,120 L0,120 Z" fill="#f5f0e8"/>
  </svg>
  <div class="fundo-claro"></div>
  <div class="content">
    <div>
      <div class="marca">
        <svg class="marca-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M9 22V12h6v10"/>
        </svg>
        <div class="marca-texto">
          <span class="marca-nome">${dados.tipo} • ${dados.bairro}</span>
          <span class="marca-sub">${dados.cidade || 'Salvador / BA'}</span>
        </div>
      </div>
      <div class="titulo">
        ${textos.titulo_normal || ''}<br>
        <span class="dourado">${textos.titulo_dourado || ''}</span>
      </div>
      <div class="separador"></div>
      <div class="subtitulo">${textos.subtitulo || ''}</div>
    </div>
    <div class="icones">
      ${(textos.diferenciais || []).slice(0,4).map(d => `
      <div class="icone-item">
        <svg class="icone-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          ${_iconeParaDiferencial3(d.titulo)}
        </svg>
        <span class="icone-label">${d.titulo}<br><span style="font-weight:400;opacity:0.7">${d.sub}</span></span>
      </div>`).join('')}
    </div>
  </div>
</div>
</body>
</html>`;
}
