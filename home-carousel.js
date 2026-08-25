// ===== Home page: vertical snap-scroll carousel (Hero, About) =====
// Manual navigation only: arrow buttons, dot clicks, mouse wheel, touch
// swipe, and Up/Down/PageUp/PageDown keys. Each slide can scroll
// internally if its content is taller than the viewport — the carousel
// only advances once you've reached the top or bottom of the current one.
(function () {
  const carousel = document.getElementById('home-carousel');
  if (!carousel) return; // not the Home page

  const track = document.getElementById('home-track');
  const slides = Array.from(track.querySelectorAll('.home-slide'));
  const dots = Array.from(document.querySelectorAll('.home-dot'));
  const upBtn = document.getElementById('home-up');
  const downBtn = document.getElementById('home-down');
  const navEl = document.querySelector('.statusbar');

  let current = 0;
  let animating = false;
  const ANIM_MS = 620;
  const WHEEL_LOCK_MS = 700;
  let wheelLocked = false;

  function syncNavHeight() {
    if (!navEl) return;
    document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px');
  }
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight);

  function activeInner() {
    return slides[current].querySelector('.home-slide-inner');
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    upBtn.disabled = current === 0;
    downBtn.disabled = current === slides.length - 1;
  }

  function goToSlide(index, edge) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current || animating) return;
    animating = true;

    const slideHeight = carousel.clientHeight;
    current = index;
    track.style.transform = 'translateY(-' + (current * slideHeight) + 'px)';

    const inner = activeInner();
    inner.scrollTop = edge === 'bottom' ? inner.scrollHeight : 0;

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
  }, { passive: false });

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

  window.addEventListener('resize', () => {
    track.style.transform = 'translateY(-' + (current * carousel.clientHeight) + 'px)';
  });

  updateUI();
})();
