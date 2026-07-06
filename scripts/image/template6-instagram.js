export function buildTemplate6HTML(dados, textos) {
  const preco = dados.preco
    ? (String(dados.preco).includes('R$') ? dados.preco : 'R$ ' + dados.preco)
    : 'Consultar';

  const status     = dados.transacao || 'VENDA';
  const localizacao = [dados.bairro, dados.cidade].filter(Boolean).join(' • ').toUpperCase();
  const tipoMain   = dados.tipo || '';
  const tituloGold = textos.titulo || '';

  // Features dinâmicas com o que estiver disponível
  const feats = [];
  if (dados.suites) {
    feats.push({ num: dados.suites,       label: 'Suítes',          icon: _iconSuites() });
  } else if (dados.quartos) {
    feats.push({ num: dados.quartos,      label: 'Quartos',         icon: _iconSuites() });
  }
  if (dados.quartos && dados.suites) {
    feats.splice(1, 0, { num: dados.quartos, label: 'Quartos',      icon: _iconSuites() });
  }
  if (dados.vagas) {
    feats.push({ num: dados.vagas,        label: 'Vagas',           icon: _iconVagas() });
  }
  if (dados.area) {
    feats.push({ num: dados.area + ' m²', label: 'Área privativa',  icon: _iconArea() });
  }

  const featsHTML = feats.map((f, i) => `
    ${i > 0 ? '<li class="features__sep" aria-hidden="true"></li>' : ''}
    <li class="features__item">
      <svg class="icon icon--feature" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${f.icon}</svg>
      <span class="features__text">
        <strong>${f.num}</strong>
        <small>${f.label}</small>
      </span>
    </li>`).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: #000; font-family: 'Inter', sans-serif; }
img { display: block; max-width: 100%; }
ul { list-style: none; }
a { text-decoration: none; color: inherit; }

:root {
  --gold: #e6bd7d;
  --gold-deep: #c79a52;
  --gold-line: rgba(228, 190, 130, 0.8);
  --dark: #10151a;
  --white: #ffffff;
  --text-dim: rgba(255, 255, 255, 0.68);
  --text-dim-strong: rgba(255, 255, 255, 0.82);
  --glass-bg: rgba(12, 16, 20, 0.58);
  --divider-line: rgba(255, 255, 255, 0.16);
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body: 'Inter', -apple-system, sans-serif;
}

.post {
  position: relative;
  width: 1080px;
  height: 1350px;
  overflow: hidden;
  background: #000;
}

.post__photo {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.post__frame {
  position: absolute;
  inset: 21px;
  z-index: 5;
  border: 1.5px solid var(--gold-line);
  border-radius: 54px;
  pointer-events: none;
}

.post__header {
  position: absolute;
  top: 62px;
  left: 56px;
  right: 56px;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 0 26px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

.badge--outline {
  background: rgba(9, 13, 17, 0.5);
  border: 1.5px solid var(--gold-line);
  color: var(--white);
}

.badge__icon { width: 20px; height: 20px; color: var(--white); flex-shrink: 0; }

.badge--solid {
  padding: 0 32px;
  background: linear-gradient(180deg, #dcb877 0%, var(--gold-deep) 100%);
  color: var(--dark);
}

.info-card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 800px;
  z-index: 3;
  padding: 64px 100px 56px;
  background: var(--glass-bg);
  border-radius: 56px 56px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  backdrop-filter: blur(26px) saturate(150%);
  box-shadow: 0 -40px 90px rgba(0, 0, 0, 0.30);
}

.info-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 44px;
}

.info-card__title-group { flex: 1; min-width: 0; }

.info-card__title {
  display: flex;
  flex-direction: column;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 62px;
  line-height: 1.08;
  letter-spacing: -0.01em;
}

.info-card__title-main  { color: var(--white); }
.info-card__title-accent { color: var(--gold); font-weight: 700; }

.info-card__location {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim-strong);
}

.icon--pin { width: 19px; height: 19px; color: var(--gold); flex-shrink: 0; }

.info-card__price-group {
  display: flex;
  flex-direction: column;
  padding-top: 6px;
  flex-shrink: 0;
}

.info-card__price-label {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.info-card__price-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 48px;
  line-height: 1;
  color: var(--white);
  white-space: nowrap;
}

.info-card__divider--vertical {
  width: 1px;
  align-self: stretch;
  background: var(--divider-line);
  margin-top: 4px;
}

.info-card__divider--horizontal {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--divider-line);
  margin: 40px 0 36px;
}

.features {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.features__item { display: flex; align-items: center; gap: 16px; }

.icon--feature { width: 34px; height: 34px; color: var(--gold); flex-shrink: 0; }

.features__text {
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  white-space: nowrap;
}

.features__text strong {
  font-size: 27px;
  font-weight: 700;
  color: var(--white);
  line-height: 1.25;
}

.features__text small {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 2px;
}

.features__sep { width: 1px; height: 38px; background: var(--divider-line); }

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 40px 100px 0;
  padding: 23px 32px;
  background: linear-gradient(180deg, #dcb877 0%, var(--gold-deep) 100%);
  border-radius: 999px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--dark);
}

.cta__arrow { width: 22px; height: 22px; color: var(--dark); }
</style>
</head>
<body>
<main class="post">

  <img class="post__photo" src="${dados.fotoBase64}" alt="${tipoMain}">
  <div class="post__frame" aria-hidden="true"></div>

  <header class="post__header">
    <div class="badge badge--outline">
      <svg class="badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 20v-5h4v5" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
      <span>${status}</span>
    </div>
    <div class="badge badge--solid"><span>EXCLUSIVO</span></div>
  </header>

  <section class="info-card">

    <div class="info-card__top">
      <div class="info-card__title-group">
        <h1 class="info-card__title">
          <span class="info-card__title-main">${tipoMain}</span>
          <span class="info-card__title-accent">${tituloGold}</span>
        </h1>
        <div class="info-card__location">
          <svg class="icon icon--pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M12 21.5s7-6.9 7-11.7A7 7 0 0 0 5 9.8c0 4.8 7 11.7 7 11.7Z" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="9.8" r="2.3" stroke-width="1.6"/>
          </svg>
          <span>${localizacao}</span>
        </div>
      </div>

      <span class="info-card__divider info-card__divider--vertical"></span>

      <div class="info-card__price-group">
        <span class="info-card__price-label">A partir de</span>
        <span class="info-card__price-value">${preco}</span>
      </div>
    </div>

    <span class="info-card__divider info-card__divider--horizontal"></span>

    <ul class="features">${featsHTML}</ul>

    <a class="cta" href="#">
      <span>Agende uma visita</span>
      <svg class="cta__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>

  </section>

</main>
</body>
</html>`;
}

function _iconSuites() {
  return '<path d="M3 18.5v-5.8A2.2 2.2 0 0 1 5.2 10.5h13.6A2.2 2.2 0 0 1 21 12.7v5.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 16.2h18" stroke-linecap="round"/><path d="M5.5 10.5V8.3a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v2.2" stroke-linejoin="round"/><path d="M13.5 10.5V8.3a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v2.2" stroke-linejoin="round"/><path d="M3.8 18.5v2M20.2 18.5v2" stroke-linecap="round"/>';
}

function _iconVagas() {
  return '<path d="M4.5 15.5 6 11a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 11l1.5 4.5" stroke-linejoin="round"/><path d="M3.8 15.5h16.4a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-.8.8h-1a.8.8 0 0 1-.8-.8v-.9H5.6v.9a.8.8 0 0 1-.8.8h-1a.8.8 0 0 1-.8-.8v-2.4a.8.8 0 0 1 .8-.8Z" stroke-linejoin="round"/><circle cx="7.3" cy="13" r=".9" fill="currentColor"/><circle cx="16.7" cy="13" r=".9" fill="currentColor"/>';
}

function _iconArea() {
  return '<rect x="5" y="5" width="14" height="14" rx="1.2"/><path d="M9 15 15 9" stroke-linecap="round"/><path d="M9 9h1.8M9 9v1.8" stroke-linecap="round"/><path d="M15 15h-1.8M15 15v-1.8" stroke-linecap="round"/>';
}
