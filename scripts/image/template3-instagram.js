function _iconeParaDiferencial3(titulo) {
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
body { background: #ede8dc; margin: 0; padding: 0; }
.flyer { width: 1080px; height: 1350px; position: relative; overflow: hidden; background: #ede8dc; font-family: 'Montserrat', sans-serif; }

.foto-wrap { position: absolute; top: 0; left: 0; right: 0; height: 560px; overflow: hidden; }
.foto { width: 100%; height: 100%; object-fit: cover; display: block; }
.foto-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to bottom, transparent 0%, transparent 30%, #1a3a4a 100%); z-index: 2; }

.triangulo-dir { position: absolute; top: 0; right: 0; border-style: solid; border-width: 0 180px 180px 0; border-color: transparent #1a3a4a transparent transparent; z-index: 3; }

.faixa-azul { position: absolute; top: 560px; left: 0; right: 0; height: 100px; background: #1a3a4a; z-index: 2; display: flex; align-items: center; padding: 0 72px; gap: 20px; }
.marca-icone { width: 40px; height: 40px; color: #a67c1a; flex-shrink: 0; }
.marca-nome { font-size: 18px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; }
.marca-sub { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: rgba(166,124,26,0.85); margin-top: 3px; }

.faixa-esq { position: absolute; top: 660px; left: 0; width: 8px; bottom: 0; background: #1a3a4a; z-index: 3; }

.zona-texto { position: absolute; top: 660px; left: 0; right: 0; height: 520px; background: #ede8dc; z-index: 1; padding: 48px 72px 0; display: flex; flex-direction: column; justify-content: flex-start; gap: 20px; }

.titulo { font-family: 'Playfair Display', serif; font-size: 74px; font-weight: 700; line-height: 1.05; color: #0d0d0d; letter-spacing: -1px; }
.titulo .dourado { color: #a67c1a; }
.separador { width: 52px; height: 3px; background: #1a3a4a; }
.subtitulo { font-size: 23px; font-weight: 400; color: #2a2a2a; line-height: 1.6; }

.zona-icones { position: absolute; top: 1180px; left: 0; right: 0; height: 170px; background: #ede8dc; z-index: 2; border-top: 2px solid rgba(26,58,74,0.25); display: grid; grid-template-columns: repeat(4, 1fr); align-items: center; padding: 0 40px; }

.icone-item { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 0 12px; border-right: 2px solid rgba(26,58,74,0.15); }
.icone-item:last-child { border-right: none; }
.icone-svg { width: 38px; height: 38px; color: #1a3a4a; }
.icone-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #1a1a1a; line-height: 1.6; }
</style>
</head>
<body>
<div class="flyer">

  <div class="foto-wrap">
    <img class="foto" src="${dados.fotoBase64}" alt="">
    <div class="foto-fade"></div>
  </div>

  <div class="triangulo-dir"></div>

  <div class="faixa-azul">
    <svg class="marca-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/>
    </svg>
    <div>
      <div class="marca-nome">${dados.tipo} • ${dados.bairro}</div>
      <div class="marca-sub">${dados.cidade || 'Salvador / BA'}</div>
    </div>
  </div>

  <div class="faixa-esq"></div>

  <div class="zona-texto">
    <div class="titulo">
      ${textos.titulo_normal || ''}<br>
      <span class="dourado">${textos.titulo_dourado || ''}</span>
    </div>
    <div class="separador"></div>
    <div class="subtitulo">${textos.subtitulo || ''}</div>
  </div>

  <div class="zona-icones">
    ${(textos.diferenciais || []).slice(0,4).map(d => `
    <div class="icone-item">
      <svg class="icone-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        ${_iconeParaDiferencial3(d.titulo)}
      </svg>
      <span class="icone-label">${d.titulo}<br><span style="font-weight:400;opacity:0.7">${d.sub}</span></span>
    </div>`).join('')}
  </div>

</div>
</body>
</html>`;
}
