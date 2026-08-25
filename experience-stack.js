// ===== Experience page: overlapping card-deck tiles =====
// Hover lifts a card (pure CSS :hover — no JS needed for that part).
// Clicking a card's header grows it in place to reveal its content;
// clicking it again, clicking empty deck space, or pressing Escape
// closes it back into the stack.
(function () {
  const stack = document.getElementById('tile-stack');
  if (!stack) return; // not the Experience page

  const tiles = Array.from(stack.querySelectorAll('.stack-tile'));

  function setExpanded(tile) {
    tiles.forEach(t => t.classList.toggle('expanded', t === tile));
    stack.classList.add('has-expanded');
  }

  function collapseAll() {
    tiles.forEach(t => t.classList.remove('expanded'));
    stack.classList.remove('has-expanded');
  }

  tiles.forEach(tile => {
    const head = tile.querySelector('.tile-head');
    head.addEventListener('click', () => {
      const isOpen = tile.classList.contains('expanded');
      isOpen ? collapseAll() : setExpanded(tile);
    });
  });

  // Click on empty deck background (not on any card) closes the open one.
  stack.addEventListener('click', (e) => {
    if (e.target === stack) collapseAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') collapseAll();
  });
})();
