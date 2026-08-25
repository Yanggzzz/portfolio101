// ===== Site-wide interactivity: scroll reveals, staggered chips, cursor glow =====
(function () {
  // Mark JS as active — CSS only hides .reveal content once this class is present,
  // so nothing stays invisible if JS fails to run.
  document.documentElement.classList.add('js-ready');

  // Auto-tag common components as reveal targets (no HTML edits needed).
  // Content inside the Experience page's carousel cards is excluded — it's
  // shown/hidden by which card is centered, not scroll position, so a
  // separate scroll-triggered fade would fight with that or never fire.
  const revealSelectors = '.card, .job, .cert-card, .testimonial-card, .project-tile, .skillset';
  const revealEls = Array.from(document.querySelectorAll(revealSelectors))
    .filter(el => !el.closest('.exp-body-wrap'));
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Stagger skill chips within each skillset as it reveals (skip the
  // carousel — handled by its own active-card transition instead).
  document.querySelectorAll('.skillset').forEach(group => {
    if (group.closest('.exp-body-wrap')) return;
    const chips = group.querySelectorAll('.skill');
    chips.forEach((chip, i) => { chip.style.transitionDelay = (i * 40) + 'ms'; });
  });

  // Cursor-follow glow on hero ticket cards.
  document.querySelectorAll('.ticket').forEach(ticket => {
    ticket.addEventListener('mousemove', (e) => {
      const rect = ticket.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      ticket.style.setProperty('--mx', mx + '%');
      ticket.style.setProperty('--my', my + '%');
    });
  });
})();
