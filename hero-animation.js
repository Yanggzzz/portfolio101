// ===== Home page hero: loading bar, piece-by-piece reveal, illustration =====
// ===== swap once loading hits 100%, then name/links fade in            =====
(function () {
  const illoA = document.getElementById('illo-a');
  const wrap = document.getElementById('hero-illo-wrap');
  const loadingWrap = document.getElementById('hero-loading-wrap');
  const bar = document.getElementById('hero-loading-bar');
  const pct = document.getElementById('hero-loading-pct');
  const reveal = document.getElementById('hero-reveal');
  if (!illoA || !wrap || !reveal) return; // not the Home page

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finish() {
    wrap.classList.add('stood');           // swap to the second illustration
    if (loadingWrap) loadingWrap.classList.add('done');
    reveal.classList.add('visible');
  }

  if (prefersReducedMotion) {
    finish();
    return;
  }

  // ---- Stagger in each top-level piece of the illustration ----
  const outerGroup = illoA.querySelector(':scope > g');
  const pieces = outerGroup ? Array.from(outerGroup.children) : [];
  const stepDelay = 90;
  const pieceDuration = 500;

  pieces.forEach((piece, i) => {
    piece.classList.add('illo-piece');
    piece.style.transitionDelay = (i * stepDelay) + 'ms';
  });

  const totalTime = Math.max(1800, pieces.length * stepDelay + pieceDuration + 300);

  requestAnimationFrame(() => {
    setTimeout(() => {
      pieces.forEach(piece => piece.classList.add('in'));
    }, 40);
  });

  // ---- Drive an actual 0→100% progress bar over the same duration ----
  if (bar && pct) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / totalTime);
      const percent = Math.round(progress * 100);
      bar.style.width = percent + '%';
      pct.textContent = percent + '%';
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    requestAnimationFrame(tick);
  } else {
    setTimeout(finish, totalTime);
  }
})();
