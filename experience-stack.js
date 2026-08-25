// ===== Experience page: tab bar =====
// Click a tab to switch sections. A pill highlight slides smoothly to
// whichever tab is active, and keyboard arrow keys move between tabs
// when one of them has focus (standard tab-list behavior).
(function () {
  const tabsEl = document.getElementById('exp-tabs');
  if (!tabsEl) return; // not the Experience page

  const highlight = document.getElementById('exp-tab-highlight');
  const tabs = Array.from(tabsEl.querySelectorAll('.exp-tab'));
  const panels = Array.from(document.querySelectorAll('.exp-panel'));

  function moveHighlightTo(tab) {
    highlight.style.width = tab.offsetWidth + 'px';
    highlight.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }

  function activate(index) {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
    moveHighlightTo(tabs[index]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
  });

  tabsEl.addEventListener('keydown', (e) => {
    const current = tabs.findIndex(t => t.classList.contains('active'));
    if (e.key === 'ArrowRight') { e.preventDefault(); activate((current + 1) % tabs.length); tabs[(current + 1) % tabs.length].focus(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); const prev = (current - 1 + tabs.length) % tabs.length; activate(prev); tabs[prev].focus(); }
  });

  // Keep the highlight aligned if the window resizes (tab widths can change,
  // especially on mobile where labels hide and only icons remain).
  window.addEventListener('resize', () => {
    const current = tabs.findIndex(t => t.classList.contains('active'));
    moveHighlightTo(tabs[current === -1 ? 0 : current]);
  });

  // Initial position — wait a tick so fonts/layout have settled.
  requestAnimationFrame(() => moveHighlightTo(tabs[0]));
})();
