// ===== Experience page: vertical card carousel =====
// Manual-only navigation: arrow buttons, dot clicks, mouse wheel, touch
// swipe, and Up/Down/PageUp/PageDown keys. Each slide can internally
// scroll if its content is taller than the viewport — the carousel only
// advances to the next/previous slide once you've reached the top or
// bottom of the current one, so nothing gets clipped.
(function () {
  const carousel = document.getElementById('xp-carousel');
  if (!carousel) return; // not the Experience page

  const track = document.getElementById('xp-track');
  const slides = Array.from(track.querySelectorAll('.xp-slide'));
  const dots = Array.from(document.querySelectorAll('.xp-dot'));
  const upBtn = document.getElementById('xp-up');
  const downBtn = document.getElementById('xp-down');
  const progressEl = document.getElementById('xp-progress');
  const navEl = document.querySelector('.statusbar');

  let current = 0;
  let animating = false;
  const ANIM_MS = 620;
  const WHEEL_LOCK_MS = 700;
  let wheelLocked = false;

  // Keep the carousel's height in sync with the actual nav bar height.
  function syncNavHeight() {
    if (!navEl) return;
    document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px');
  }
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight);

  function activeInner() {
    return slides[current].querySelector('.xp-slide-inner');
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    upBtn.disabled = current === 0;
    downBtn.disabled = current === slides.length - 1;
    progressEl.textContent =
      String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }

  function goToSlide(index, edge) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current || animating) return;
    animating = true;

    const track2 = track; // shift the whole track by slide height
    const slideHeight = carousel.clientHeight;
    current = index;
    track2.style.transform = 'translateY(-' + (current * slideHeight) + 'px)';

    // Land the new slide scrolled to the edge you're arriving from, so
    // wheel/swipe navigation feels continuous rather than resetting.
    const inner = activeInner();
    if (edge === 'bottom') {
      inner.scrollTop = inner.scrollHeight;
    } else {
      inner.scrollTop = 0;
    }

    updateUI();
    setTimeout(() => { animating = false; }, ANIM_MS);
  }

  upBtn.addEventListener('click', () => goToSlide(current - 1, 'bottom'));
  downBtn.addEventListener('click', () => goToSlide(current + 1, 'top'));
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.index, 10);
      goToSlide(i, i < current ? 'bottom' : 'top');
    });
  });

  // ---- Wheel: only advance once the active slide is scrolled to its edge ----
  carousel.addEventListener('wheel', (e) => {
    const inner = activeInner();
    const atTop = inner.scrollTop <= 1;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;

    if (e.deltaY > 12 && atBottom) {
      e.preventDefault();
      if (!wheelLocked) { wheelLocked = true; goToSlide(current + 1, 'top'); setTimeout(() => wheelLocked = false, WHEEL_LOCK_MS); }
    } else if (e.deltaY < -12 && atTop) {
      e.preventDefault();
      if (!wheelLocked) { wheelLocked = true; goToSlide(current - 1, 'bottom'); setTimeout(() => wheelLocked = false, WHEEL_LOCK_MS); }
    }
    // otherwise let the slide scroll internally as normal
  }, { passive: false });

  // ---- Touch swipe: same edge-aware logic ----
  let touchStartY = null;
  carousel.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(deltaY) < 50) return;

    const inner = activeInner();
    const atTop = inner.scrollTop <= 1;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;

    if (deltaY > 0 && atBottom) goToSlide(current + 1, 'top');
    else if (deltaY < 0 && atTop) goToSlide(current - 1, 'bottom');
  }, { passive: true });

  // ---- Keyboard ----
  document.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) return;
    const inner = activeInner();
    const atTop = inner.scrollTop <= 1;
    const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;

    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && atBottom) {
      e.preventDefault();
      goToSlide(current + 1, 'top');
    } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && atTop) {
      e.preventDefault();
      goToSlide(current - 1, 'bottom');
    }
  });

  // Keep slide height in sync on resize (track offset is in px, not vh,
  // so it must be recalculated when the viewport changes).
  window.addEventListener('resize', () => {
    track.style.transform = 'translateY(-' + (current * carousel.clientHeight) + 'px)';
  });

  updateUI();
})();
