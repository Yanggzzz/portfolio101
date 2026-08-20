// ===== Command Palette (Cmd+K / Ctrl+K) =====
// Global commands, available on every page. Page-specific commands are
// declared inline in each HTML file as `window.pageCommands` before this
// script is loaded, and get merged in below.

(function () {
  const globalCommands = [
    { label: 'Go to Home',        hint: 'Page',   action: () => (location.href = 'index.html') },
    { label: 'Go to Experience',  hint: 'Page',   action: () => (location.href = 'experience.html') },
    { label: 'Go to Projects',    hint: 'Page',   action: () => (location.href = 'projects.html') },
    { label: 'Go to Contact',     hint: 'Page',   action: () => (location.href = 'contact.html') },
    { label: 'Email Hyacinth',    hint: 'Action', action: () => (location.href = 'mailto:hyacinthh.romitman5211@gmail.com') },
    { label: 'Open LinkedIn',     hint: 'Action', action: () => window.open('https://www.linkedin.com/in/hyc19', '_blank', 'noopener') }
  ];

  const commands = globalCommands.concat(window.pageCommands || []);

  // Build markup
  const overlay = document.createElement('div');
  overlay.className = 'cmdk-overlay';
  overlay.innerHTML =
    '<div class="cmdk-panel">' +
      '<input class="cmdk-input" type="text" placeholder="Type a command or search…" autocomplete="off" spellcheck="false">' +
      '<div class="cmdk-list"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.cmdk-input');
  const list = overlay.querySelector('.cmdk-list');
  let activeIndex = 0;
  let filtered = commands;

  function render() {
    list.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'cmdk-empty';
      empty.textContent = 'No matching commands';
      list.appendChild(empty);
      return;
    }
    filtered.forEach((cmd, i) => {
      const item = document.createElement('div');
      item.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
      item.innerHTML =
        '<span>' + cmd.label + '</span>' +
        '<span class="cmdk-hint">' + cmd.hint + '</span>';
      item.addEventListener('mouseenter', () => { activeIndex = i; render(); });
      item.addEventListener('click', () => runActive());
      list.appendChild(item);
    });
  }

  function filterCommands() {
    const q = input.value.trim().toLowerCase();
    filtered = q
      ? commands.filter(c => c.label.toLowerCase().includes(q))
      : commands;
    activeIndex = 0;
    render();
  }

  function runActive() {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    closePalette();
    cmd.action();
  }

  function openPalette() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filterCommands();
    setTimeout(() => input.focus(), 10);
  }

  function closePalette() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  input.addEventListener('input', filterCommands);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runActive();
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('active') ? closePalette() : openPalette();
    }
  });

  // Wire up any visible trigger buttons (nav pill)
  document.querySelectorAll('[data-cmdk-trigger]').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });

  // Label the shortcut hint based on platform
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  document.querySelectorAll('.cmdk-key').forEach(el => {
    el.textContent = isMac ? '⌘K' : 'Ctrl K';
  });
})();
