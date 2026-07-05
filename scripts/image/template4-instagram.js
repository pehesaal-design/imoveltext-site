export function buildTemplate4HTML(dados, textos) {
  const preco = dados.preco
    ? (String(dados.preco).includes('R$') ? dados.preco : 'R$ ' + dados.preco)
    : 'Consultar';

  const finalidade = (textos.finalidade || 'VENDA').toUpperCase();
  const localizacao = textos.localizacao
    || ((dados.bairro || '') + (dados.cidade ? ' • ' + dados.cidade : '')).toUpperCase();

  // Montar lista de amenidades com o que estiver disponível
  const amenidades = [];
  if (dados.suites) {
    amenidades.push({ num: dados.suites, label: 'SUÍTES', icon: _iconSuites() });
  } else if (dados.quartos) {
    amenidades.push({ num: dados.quartos, label: 'QUARTOS', icon: _iconQuartos() });
  }
  if (dados.vagas) {
    amenidades.push({ num: dados.vagas, label: 'VAGAS', icon: _iconVagas() });
  }
  if (dados.area) {
    amenidades.push({ num: dados.area + ' m²', label: 'ÁREA PRIVATIVA', icon: _iconArea() });
  }
  // 4ª amenidade via obs se possível
  if (amenidades.length < 4 && dados.quartos && dados.suites) {
    amenidades.push({ num: dados.quartos, label: 'QUARTOS', icon: _iconQuartos() });
  }

  const cols = Math.min(Math.max(amenidades.length, 2), 4);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: #0d1525; }

.card {
  width: 1080px;
  height: 1350px;
  border-radius: 44px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #0d1525;
  font-family: 'Montserrat', sans-serif;
  position: relative;
}

/* ── FOTO ───────────────────────────── */
.foto-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}
.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.foto-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(13, 21, 37, 0.35) 0%,
    rgba(13, 21, 37, 0.08) 35%,
    rgba(13, 21, 37, 0.55) 72%,
    rgba(13, 21, 37, 1.00) 100%
  );
}

/* ── BADGES ─────────────────────────── */
.badges {
  position: absolute;
  top: 52px;
  left: 56px;
  right: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.badge-tipo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 60px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(4px);
}
.badge-tipo svg {
  width: 18px;
  height: 18px;
  stroke: #ffffff;
  fill: none;
  stroke-width: 2;
  flex-shrink: 0;
}
.badge-exclusivo {
  padding: 15px 34px;
  border-radius: 60px;
  background: linear-gradient(130deg, #c8991f 0%, #deb84a 55%, #c8991f 100%);
  color: #0d1525;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
}

/* ── PAINEL ─────────────────────────── */
.panel {
  background: #0d1525;
  padding: 48px 60px 44px;
  flex-shrink: 0;
}

/* ── LINHA TÍTULO + PREÇO ───────────── */
.title-price-row {
  display: grid;
  grid-template-columns: 1.15fr 1px 1fr;
  align-items: start;
  margin-bottom: 36px;
}
.title-col { padding-right: 44px; }

.title-l1 {
  font-family: 'Fraunces', serif;
  font-size: 96px;
  font-weight: 900;
  color: #ffffff;
  line-height: 0.94;
  letter-spacing: -1px;
}
.title-l2 {
  font-family: 'Fraunces', serif;
  font-size: 96px;
  font-weight: 900;
  color: #c8991f;
  line-height: 1.02;
  letter-spacing: -1px;
}
.localizacao {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 18px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.localizacao svg {
  width: 17px;
  height: 17px;
  stroke: rgba(255, 255, 255, 0.4);
  fill: none;
  stroke-width: 2;
  flex-shrink: 0;
}

.divider-v { background: rgba(255, 255, 255, 0.12); }

.price-col { padding-left: 44px; }
.price-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 10px;
}
.price-value {
  font-family: 'Fraunces', serif;
  font-size: 66px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -1px;
}

/* ── DIVIDER H ──────────────────────── */
.divider-h {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
}

/* ── AMENIDADES ─────────────────────── */
.amenities {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  margin-bottom: 36px;
  gap: 0;
}
.amenity {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 28px;
}
.amenity:first-child { padding-left: 0; }
.amenity:last-child { padding-right: 0; }
.amenity + .amenity { border-left: 1px solid rgba(255, 255, 255, 0.1); }

.amen-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.amen-icon {
  width: 30px;
  height: 30px;
  color: #c8991f;
  flex-shrink: 0;
}
.amen-num {
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.5px;
}
.amen-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}

/* ── CTA ────────────────────────────── */
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  width: 100%;
  padding: 28px 40px;
  border-radius: 60px;
  background: linear-gradient(130deg, #b8880f 0%, #deb84a 45%, #c8991f 100%);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #0d1525;
  cursor: pointer;
}
.cta svg {
  width: 22px;
  height: 22px;
  stroke: #0d1525;
  fill: none;
  stroke-width: 2.5;
  flex-shrink: 0;
}
</style>
</head>
<body>
<div class="card">

  <!-- FOTO + BADGES -->
  <div class="foto-wrap">
    <img class="foto" src="${dados.fotoBase64}" alt="">
    <div class="foto-overlay"></div>
    <div class="badges">
      <div class="badge-tipo">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        ${finalidade}
      </div>
      <div class="badge-exclusivo">EXCLUSIVO</div>
    </div>
  </div>

  <!-- PAINEL INFERIOR -->
  <div class="panel">

    <!-- Título + Preço -->
    <div class="title-price-row">
      <div class="title-col">
        <div class="title-l1">${textos.titulo_linha1 || dados.tipo || ''}</div>
        <div class="title-l2">${textos.titulo_linha2 || ''}</div>
        <div class="localizacao">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          ${localizacao}
        </div>
      </div>
      <div class="divider-v"></div>
      <div class="price-col">
        <div class="price-label">A PARTIR DE</div>
        <div class="price-value">${preco}</div>
      </div>
    </div>

    <div class="divider-h"></div>

    <!-- Amenidades -->
    <div class="amenities">
      ${amenidades.map(a => `
      <div class="amenity">
        <div class="amen-top">
          <svg class="amen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${a.icon}</svg>
          <span class="amen-num">${a.num}</span>
        </div>
        <span class="amen-label">${a.label}</span>
      </div>`).join('')}
    </div>

    <!-- CTA -->
    <div class="cta">
      AGENDE UMA VISITA
      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </div>

  </div>
</div>
</body>
</html>`;
}

function _iconSuites() {
  return '<path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>';
}
function _iconQuartos() {
  return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
}
function _iconVagas() {
  return '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>';
}
function _iconArea() {
  return '<rect x="3" y="3" width="18" height="18" rx="1" stroke-dasharray="3 2"/>';
}
