(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progressFill');
  const currentEl = document.getElementById('currentSlide');
  const totalEl = document.getElementById('totalSlides');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const drawer = document.getElementById('sourceDrawer');
  const sourceBtn = document.getElementById('sourceBtn');
  const sourceClose = document.getElementById('sourceClose');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  let current = 0;

  const isMobile = () => window.matchMedia('(max-width:760px)').matches;

  function go(index, writeHash = true) {
    if (isMobile()) return;
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    const n = current + 1;
    currentEl.textContent = String(n).padStart(2, '0');
    totalEl.textContent = String(slides.length).padStart(2, '0');
    progress.style.width = `${(n / slides.length) * 100}%`;
    document.title = `${slides[current].dataset.title} — 2035`;
    if (writeHash) history.replaceState(null, '', `#${n}`);
  }

  function toggleSources(force) {
    const open = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  }

  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
  sourceBtn.addEventListener('click', () => toggleSources());
  sourceClose.addEventListener('click', () => toggleSources(false));
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (drawer.classList.contains('is-open')) {
      if (e.key === 'Escape' || e.key.toLowerCase() === 's') toggleSources(false);
      return;
    }
    if (['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key.toLowerCase() === 's') toggleSources();
    else if (e.key.toLowerCase() === 'f') toggleFullscreen();
  });

  const initial = Number(location.hash.slice(1));
  go(Number.isFinite(initial) && initial > 0 ? initial - 1 : 0, false);
})();
