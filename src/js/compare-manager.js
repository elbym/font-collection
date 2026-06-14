(function () {
  var STORAGE_KEY = 'font-compare';
  var MAX = 4;

  function get() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function save(list) { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

  function toggle(slug, title, family, url) {
    var list = get();
    var idx = list.findIndex(function (f) { return f.slug === slug; });
    if (idx === -1) {
      if (list.length >= MAX) return;
      list.push({ slug: slug, title: title, family: family, url: url });
    } else {
      list.splice(idx, 1);
    }
    save(list);
    update();
  }

  function clear() { save([]); update(); }

  function update() {
    var list = get();
    var slugs = list.map(function (f) { return f.slug; });

    document.querySelectorAll('.compare-toggle').forEach(function (btn) {
      var active = slugs.indexOf(btn.dataset.slug) !== -1;
      btn.classList.toggle('is-selected', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.setAttribute('title', active ? 'Aus Vergleich entfernen' : 'Zum Vergleich hinzufügen');
      btn.textContent = active ? '✓' : '+';
    });

    var tray = document.getElementById('compare-tray');
    if (!tray) return;

    tray.hidden = list.length < 2;

    var items = tray.querySelector('.compare-tray__items');
    if (items) {
      items.innerHTML = '';
      list.forEach(function (f) {
        var item = document.createElement('span');
        item.className = 'compare-tray__item';
        var name = document.createElement('span');
        name.className = 'compare-tray__item-name font-' + f.slug;
        name.textContent = f.title;
        var rm = document.createElement('button');
        rm.className = 'compare-tray__remove';
        rm.textContent = '×';
        rm.setAttribute('aria-label', f.title + ' entfernen');
        rm.addEventListener('click', function () { toggle(f.slug, f.title, f.family, f.url); });
        item.appendChild(name);
        item.appendChild(rm);
        items.appendChild(item);
      });
    }
  }

  function initTray() {
    var tray = document.createElement('div');
    tray.id = 'compare-tray';
    tray.className = 'compare-tray';
    tray.hidden = true;
    tray.innerHTML =
      '<div class="compare-tray__inner">' +
        '<div class="compare-tray__items"></div>' +
        '<a class="compare-tray__go" href="/compare.html">Vergleichen →</a>' +
        '<button class="compare-tray__clear" aria-label="Auswahl leeren">✕</button>' +
      '</div>';
    document.body.appendChild(tray);
    tray.querySelector('.compare-tray__clear').addEventListener('click', clear);
  }

  function init() {
    initTray();
    update();
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.compare-toggle');
      if (!btn) return;
      toggle(btn.dataset.slug, btn.dataset.title, btn.dataset.family, btn.dataset.url);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
