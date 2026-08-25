// ===== Experience page: stacked accordion tiles =====
// Desktop: hovering a tile opens it (accordion — only one open at a time).
// Mobile/touch: tapping a tile's header toggles it open/closed, since
// there's no hover to rely on.
(function () {
  const stack = document.getElementById('tile-stack');
  if (!stack) return; // not the Experience page

  const tiles = Array.from(stack.querySelectorAll('.stack-tile'));
  const canHover = window.matchMedia('(hover: hover)').matches;

  function openTile(tile) {
    tiles.forEach(t => t.classList.toggle('expanded', t === tile));
  }

  tiles.forEach(tile => {
    const head = tile.querySelector('.tile-head');

    // Desktop: hover to preview/open.
    if (canHover) {
      tile.addEventListener('mouseenter', () => openTile(tile));
    }

    // All devices: click/tap the header toggles it directly.
    head.addEventListener('click', () => {
      const isOpen = tile.classList.contains('expanded');
      if (isOpen) {
        tile.classList.remove('expanded');
      } else {
        openTile(tile);
      }
    });
  });
})();
