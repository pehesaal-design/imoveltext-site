export function buildTemplate5HTML(dados, textos) {
  const preco = dados.preco
    ? (String(dados.preco).includes('R$') ? dados.preco : 'R$ ' + dados.preco)
    : 'Consultar';

  const status     = dados.transacao || 'VENDA';
  const localizacao = [dados.bairro, dados.cidade].filter(Boolean).join(' • ').toUpperCase();
  const titulo     = textos.titulo || dados.tipo || '';

  // Montar features dinamicamente com os campos disponíveis
  const feats = [];
  if (dados.suites) {
    feats.push({ num: dados.suites, label: 'Suítes',         icon: _iconSuites() });
  } else if (dados.quartos) {
    feats.push({ num: dados.quartos, label: 'Quartos',       icon: _iconSuites() });
  }
  if (dados.vagas) {
    feats.push({ num: dados.vagas,   label: 'Vagas',         icon: _iconVagas() });
  }
  if (dados.area) {
    feats.push({ num: dados.area + 'm²', label: 'Área privativa', icon: _iconArea() });
  }
  if (dados.quartos && dados.suites) {
    feats.splice(1, 0, { num: dados.quartos, label: 'Quartos', icon: _iconSuites() });
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
  --gold: #e2b06c;
  --gold-line: rgba(226, 176, 108, 0.85);
  --white: #ffffff;
  --text-dim: rgba(255, 255, 255, 0.72);
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

.post__scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 46%,
    rgba(0, 0, 0, 0.35) 58%,
    rgba(0, 0, 0, 0.68) 72%,
    rgba(0, 0, 0, 0.90) 88%,
    rgba(0, 0, 0, 0.96) 100%
  );
}

.badge {
  position: absolute;
  top: 56px;
  left: 56px;
  z-index: 4;
  padding: 17px 30px;
  background: rgba(10, 14, 20, 0.30);
  border: 1.5px solid var(--gold-line);
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.content {
  position: absolute;
  left: 64px;
  right: 64px;
  bottom: 64px;
  z-index: 4;
}

.content__kicker {
  display: block;
  font-family: var(--font-body);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--white);
  margin-bottom: 8px;
}

.content__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 78px;
  line-height: 1.02;
  color: var(--white);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.content__location {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.icon--pin { width: 19px; height: 19px; color: var(--gold); flex-shrink: 0; }

.content__rule {
  display: block;
  width: 140px;
  height: 1.5px;
  background: var(--gold);
  margin: 20px 0 28px;
}

.content__price-label {
  display: block;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 10px;
}

.content__price {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 54px;
  line-height: 1;
  color: var(--white);
  margin-bottom: 44px;
}

.features {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 44px;
}

.features__item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon--feature { width: 32px; height: 32px; color: var(--gold); flex-shrink: 0; }

.features__text {
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  white-space: nowrap;
}

.features__text strong {
  font-size: 25px;
  font-weight: 700;
  color: var(--white);
  line-height: 1.25;
}

.features__text small {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-top: 2px;
}

.features__sep {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.25);
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 20px 36px;
  background: rgba(10, 14, 20, 0.25);
  border: 1.5px solid var(--gold-line);
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--white);
}

.cta__icon { width: 20px; height: 20px; color: var(--gold); flex-shrink: 0; }
.cta__arrow { width: 20px; height: 20px; color: var(--white); flex-shrink: 0; }
</style>
</head>
<body>
<main class="post">

  <img class="post__photo" src="${dados.fotoBase64}" alt="${titulo}">
  <div class="post__scrim" aria-hidden="true"></div>

  <div class="badge"><span>${status}</span></div>

  <section class="content">
    <span class="content__kicker">${dados.tipo || ''}</span>
    <h1 class="content__title">${titulo}</h1>

    <div class="content__location">
      <svg class="icon icon--pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 21.5s7-6.9 7-11.7A7 7 0 0 0 5 9.8c0 4.8 7 11.7 7 11.7Z" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="12" cy="9.8" r="2.3" stroke-width="1.6"/>
      </svg>
      <span>${localizacao}</span>
    </div>

    <span class="content__rule"></span>

    <span class="content__price-label">A partir de</span>
    <p class="content__price">${preco}</p>

    <ul class="features">${featsHTML}</ul>

    <a class="cta" href="#">
      <svg class="cta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="15" rx="2" stroke-width="1.6"/>
        <path d="M4 10h16" stroke-width="1.6"/>
        <path d="M8 3.5v3.5M16 3.5v3.5" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
      <span>Agende uma visita</span>
      <svg class="cta__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
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
