// ============ Retour en haut au refresh ============
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({ top: 0, behavior: 'instant' });

// ============ Ouverture ============
const ouverture = document.getElementById('ouverture');
const entete = document.getElementById('entete');

// mode QA (captures headless) : ?qa → tout visible, zéro animation
const QA = new URLSearchParams(location.search).has('qa');
if (QA) {
  document.documentElement.classList.add('qa');
  document.querySelectorAll('.reveal, .reveal-img').forEach(el => el.classList.add('vu'));
  if (ouverture) ouverture.remove();
  entete.classList.add('visible');
}

function fermerOuverture() {
  if (!ouverture || ouverture.classList.contains('part')) return;
  ouverture.classList.add('part');
  entete.classList.add('visible');
  setTimeout(() => ouverture.classList.add('retire'), 1100);
}

if (ouverture) {
  const skip = document.getElementById('ouv-skip');
  if (skip) skip.addEventListener('click', fermerOuverture);
  ouverture.addEventListener('click', fermerOuverture);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fermerOuverture();
  } else {
    setTimeout(fermerOuverture, 3400);
  }
} else {
  entete.classList.add('visible');
}

// ============ Header fond au scroll ============
addEventListener('scroll', () => {
  entete.classList.toggle('fond', scrollY > 40);
}, { passive: true });

// ============ Menu mobile ============
const burger = document.getElementById('burger');
const voile = document.getElementById('voile-menu');
if (burger && voile) {
  burger.addEventListener('click', () => {
    const ouvert = voile.classList.toggle('ouvert');
    burger.classList.toggle('ouvert', ouvert);
    burger.setAttribute('aria-expanded', ouvert);
    document.body.style.overflow = ouvert ? 'hidden' : '';
  });
  voile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    voile.classList.remove('ouvert');
    burger.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

// ============ Révélations au scroll ============
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vu');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal, .reveal-img').forEach(el => io.observe(el));
