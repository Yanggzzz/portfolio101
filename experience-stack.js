// ===== Experience page: horizontal peek carousel =====
// The centered card grows to full size with a bottom-anchored scale, so it
// visually "stands taller" like a fanned deck — sizing is recalculated
// continuously as you drag, not just switched on/off at rest.
(function () {
  const carousel = document.getElementById('exp-carousel');
  if (!carousel) return; // not the Experience page

  const track = document.getElementById('exp-track');
  const cards = Array.from(track.querySelectorAll('.exp-card'));
  const dots = Array.from(document.querySelectorAll('.exp-dot'));
  const prevBtn = document.getElementById('exp-prev');
  const nextBtn = document.getElementById('exp-next');

  let current = 0;
  let rafPending = false;

  // ---- Size/dim/layer every card continuously based on live distance
  //      from center, and track which one is currently closest ----
  function updateActive() {
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    const maxDist = trackRect.width / 2 + 40;

    let closestIndex = 0;
    let closestDist = Infinity;

    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      const t = Math.min(dist / maxDist, 1); // 0 = centered, 1 = far off to the side

      const scale = 1 - t * 0.22;   // full size at center, ~78% at the edges
      const opacity = 1 - t * 0.35; // fully visible at center, still readable at the edges
      const z = Math.round(10 - t * 9);

      card.style.transform = 'scale(' + scale.toFixed(3) + ')';
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = z;

      if (dist < closestDist) { closestDist = dist; closestIndex = i; }
    });

    if (closestIndex !== current || !cards[current].classList.contains('active')) {
      current = closestIndex;
      cards.forEach((card, i) => card.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
  }

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { updateActive(); rafPending = false; });
  }

  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // ---- Jump to a specific card, centered ----
  function scrollToIndex(index) {
    index = Math.max(0, Math.min(cards.length - 1, index));
    const card = cards[index];
    const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: target, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollToIndex(current - 1));
  nextBtn.addEventListener('click', () => scrollToIndex(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => scrollToIndex(parseInt(dot.dataset.index, 10)));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollToIndex(current - 1);
    else if (e.key === 'ArrowRight') scrollToIndex(current + 1);
  });

  // ---- Mouse click-and-drag to scroll (touch already scrolls natively) ----
  let isDragging = false;
  let dragStartX = 0;
  let scrollStart = 0;

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    isDragging = true;
    dragStartX = e.clientX;
    scrollStart = track.scrollLeft;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    track.scrollLeft = scrollStart - (e.clientX - dragStartX);
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    // Let scroll-snap settle to the nearest card now that dragging is done.
    scrollToIndex(current);
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);

  // ---- Initial state ----
  updateActive();
})();
