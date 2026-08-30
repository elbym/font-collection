// Top-bar theme switch: cycles system → light → dark → system.
// State is stored in localStorage['theme'] ('light' | 'dark'; absent = system)
// and mirrored onto <html data-theme>. The pre-paint snippet in base.njk
// applies the stored value before first render; this only handles the button.
(function () {
  var KEY = 'theme';
  var ORDER = ['system', 'light', 'dark'];
  var META = {
    system: { icon: '🖥', label: 'System' },
    light: { icon: '☀', label: 'Hell' },
    dark: { icon: '🌙', label: 'Dunkel' }
  };

  function current() {
    try {
      var t = localStorage.getItem(KEY);
      return t === 'light' || t === 'dark' ? t : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function apply(mode) {
    var root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch (e) {}

    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var m = META[mode];
    btn.querySelector('[data-theme-icon]').textContent = m.icon;
    btn.querySelector('[data-theme-label]').textContent = m.label;
    btn.setAttribute('title', 'Farbschema: ' + m.label + ' (klicken zum Wechseln)');
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      apply(ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length]);
    });
  });
})();
