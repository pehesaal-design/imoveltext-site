function _iconeParaDiferencial2(titulo) {
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

export function buildTemplate2HTML(dados, textos) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a0a0a; margin: 0; padding: 0; }
.flyer { width: 1080px; height: 1350px; position: relative; overflow: hidden; background: #0a0a0a; font-family: 'Montserrat', sans-serif; }
.foto { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
.overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 70%, rgba(0,0,0,0.97) 100%); }
.overlay-left { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 40%, transparent 70%); }
.content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 64px 72px 72px; }
.top { display: flex; flex-direction: column; }
.icone-imovel { width: 72px; height: 72px; color: #c8991f; margin-bottom: 32px; }
.bairro-tag { font-size: 13px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: rgba(200,153,31,0.8); margin-bottom: 20px; }
.titulo { font-family: 'Playfair Display', serif; font-size: 108px; font-weight: 900; line-height: 0.92; color: #ffffff; letter-spacing: -2px; }
.titulo .destaque { color: #c8991f; }
.separador { width: 60px; height: 2px; background: #c8991f; margin: 36px 0 28px; }
.subtitulo { font-size: 26px; font-weight: 400; color: rgba(255,255,255,0.85); line-height: 1.5; max-width: 520px; }
.subtitulo .gold { color: #c8991f; font-weight: 500; }
.bottom { display: flex; flex-direction: column; }
.diferenciais { display: flex; flex-direction: column; margin-bottom: 48px; }
.dif-item { display: flex; align-items: center; gap: 24px; padding: 24px 0; border-bottom: 1px solid rgba(200,153,31,0.2); }
.dif-item:first-child { border-top: 1px solid rgba(200,153,31,0.2); }
.dif-icon-wrap { width: 52px; height: 52px; border-radius: 50%; background: rgba(200,153,31,0.15); border: 1px solid rgba(200,153,31,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dif-icon { width: 26px; height: 26px; color: #c8991f; }
.dif-text { font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.9); line-height: 1.4; }
.dif-text .gold { color: #c8991f; font-weight: 600; }
.rodape { display: flex; align-items: center; justify-content: space-between; }
.dados-imovel { display: flex; gap: 32px; }
.dado { display: flex; flex-direction: column; gap: 4px; }
.dado-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.45); }
.dado-valor { font-size: 22px; font-weight: 700; color: #ffffff; }
.preco-wrap { text-align: right; }
.preco-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(200,153,31,0.7); margin-bottom: 4px; }
.preco-valor { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 700; color: #c8991f; line-height: 1; }
.corretor { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; }
.corretor-nome { font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; text-transform: uppercase; }
.corretor-tel { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.5); }
</style>
</head>
<body>
<div class="flyer">
  <img class="foto" src="${dados.fotoBase64}" alt="">
  <div class="overlay"></div>
  <div class="overlay-left"></div>
  <div class="content">
    <div class="top">
      <svg class="icone-imovel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
      <div class="bairro-tag">${dados.tipo} • ${dados.bairro} — ${dados.cidade || 'Salvador/BA'}</div>
      <div class="titulo">
        ${textos.titulo_linha1 || ''}<br>
        <span class="destaque">${textos.titulo_linha2 || ''}</span><br>
        ${textos.titulo_linha3 || ''}
      </div>
      <div class="separador"></div>
      <div class="subtitulo">
        ${textos.subtitulo_normal || ''}<br>
        <span class="gold">${textos.subtitulo_dourado || ''}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="diferenciais">
        ${(textos.diferenciais || []).slice(0,3).map(d => `
        <div class="dif-item">
          <div class="dif-icon-wrap">
            <svg class="dif-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              ${_iconeParaDiferencial2(d.titulo)}
            </svg>
          </div>
          <span class="dif-text">${d.texto_normal || ''} <span class="gold">${d.texto_dourado || ''}</span></span>
        </div>`).join('')}
      </div>
      <div class="rodape">
        <div class="dados-imovel">
          ${dados.quartos ? `<div class="dado"><span class="dado-label">Quartos</span><span class="dado-valor">${dados.quartos}</span></div>` : ''}
          ${dados.suites ? `<div class="dado"><span class="dado-label">Suítes</span><span class="dado-valor">${dados.suites}</span></div>` : ''}
          ${dados.area ? `<div class="dado"><span class="dado-label">Área</span><span class="dado-valor">${dados.area}m²</span></div>` : ''}
          ${dados.vagas ? `<div class="dado"><span class="dado-label">Vagas</span><span class="dado-valor">${dados.vagas}</span></div>` : ''}
        </div>
        <div class="preco-wrap">
          <div class="preco-label">Valor</div>
          <div class="preco-valor">${dados.preco ? (String(dados.preco).includes('R$') ? dados.preco : 'R$ ' + dados.preco) : 'Consultar'}</div>
        </div>
      </div>
      <div class="corretor">
        <span class="corretor-nome">${dados.corretor?.nome || ''}</span>
        <span class="corretor-tel">${dados.corretor?.tel || ''}</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}
