// ===== Home page hero: piece-by-piece reveal, name/links fade-in, =====
// ===== scroll-triggered illustration swap                        =====
(function () {
  const illoA = document.getElementById('illo-a');
  const wrap = document.getElementById('hero-illo-wrap');
  const loading = document.getElementById('hero-loading');
  const reveal = document.getElementById('hero-reveal');
  if (!illoA || !wrap || !reveal) return; // not the Home page

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    if (loading) loading.classList.add('done');
    reveal.classList.add('visible');
  } else {
    // ---- Stagger in each top-level piece of the illustration ----
    const outerGroup = illoA.querySelector(':scope > g');
    const pieces = outerGroup ? Array.from(outerGroup.children) : [];
    const stepDelay = 110;
    const duration = 550;

    pieces.forEach((piece, i) => {
      piece.classList.add('illo-piece');
      piece.style.transitionDelay = (i * stepDelay) + 'ms';
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        pieces.forEach(piece => piece.classList.add('in'));
      }, 60);
    });

    const totalTime = pieces.length * stepDelay + duration;

    setTimeout(() => {
      if (loading) loading.classList.add('done');
      reveal.classList.add('visible');
    }, totalTime + 250);
  }

  // ---- Scroll: swap to the second illustration past a small threshold ----
  function onScroll() {
    wrap.classList.toggle('stood', window.scrollY > 90);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
