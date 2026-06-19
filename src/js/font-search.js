(function () {
  'use strict';

  var form = document.querySelector('.font-search');
  var input = document.getElementById('font-search-input');
  var dropdown = document.getElementById('font-search-results');
  if (!input || !dropdown || !form) return;

  var pagefindUrl = form.dataset.pagefindUrl || '/pagefind/pagefind.js';
  var searchPageUrl = form.dataset.searchUrl || '/search.html';
  var rawBase = form.dataset.pathPrefix || '/';
  var pathPrefix = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  var pagefind = null;
  var activeIndex = -1;
  var debounceTimer = null;

  function loadPagefind() {
    if (pagefind) return Promise.resolve();
    return import(pagefindUrl).then(function (pf) {
      pagefind = pf;
    }).catch(function () {
      // pagefind index not built yet (dev mode without prior build)
    });
  }

  function setActive(index) {
    var items = dropdown.querySelectorAll('[role="option"]');
    items.forEach(function (el, i) {
      el.classList.toggle('is-active', i === index);
      if (i === index) {
        el.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', el.id);
      }
    });
    if (index < 0) input.removeAttribute('aria-activedescendant');
    activeIndex = index;
  }

  function closeDropdown() {
    dropdown.hidden = true;
    dropdown.innerHTML = '';
    activeIndex = -1;
    input.setAttribute('aria-expanded', 'false');
  }

  function renderResults(dataList, term) {
    dropdown.innerHTML = '';

    dataList.forEach(function (item, i) {
      var title = item.meta && item.meta.title
        ? item.meta.title.replace(/\s*\|.*$/, '').trim()
        : item.url;
      var li = document.createElement('li');
      li.id = 'font-search-option-' + i;
      li.setAttribute('role', 'option');
      var a = document.createElement('a');
      a.href = pathPrefix + item.url;
      a.textContent = title;
      li.appendChild(a);
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        window.location.href = pathPrefix + item.url;
      });
      dropdown.appendChild(li);
    });

    var footer = document.createElement('li');
    footer.className = 'search-all-link';
    var footerA = document.createElement('a');
    footerA.href = searchPageUrl;
    footerA.textContent = 'Alle Ergebnisse →';
    footer.appendChild(footerA);
    dropdown.appendChild(footer);

    dropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    activeIndex = -1;
  }

  function search(term) {
    term = term.trim();
    if (term.length < 2) { closeDropdown(); return; }
    if (!pagefind) { closeDropdown(); return; }

    pagefind.search(term).then(function (result) {
      var hits = result.results.slice(0, 8);
      if (!hits.length) { closeDropdown(); return; }
      return Promise.all(hits.map(function (r) { return r.data(); }));
    }).then(function (dataList) {
      if (!dataList) return;
      renderResults(dataList, term);
    }).catch(function () {
      closeDropdown();
    });
  }

  input.addEventListener('input', function () {
    var val = this.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { search(val); }, 200);
  });

  input.addEventListener('keydown', function (e) {
    if (dropdown.hidden) return;
    var items = dropdown.querySelectorAll('[role="option"]');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      var link = items[activeIndex].querySelector('a');
      if (link) window.location.href = link.href;
    } else if (e.key === 'Escape') {
      closeDropdown();
      input.blur();
    }
  });

  input.addEventListener('blur', function () {
    setTimeout(closeDropdown, 150);
  });

  input.addEventListener('focus', function () {
    loadPagefind().then(function () {
      if (input.value.trim().length >= 2) search(input.value);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.location.href = searchPageUrl;
  });

  // Preload pagefind after a short idle moment
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(function () { loadPagefind(); }, { timeout: 3000 });
  } else {
    setTimeout(loadPagefind, 2000);
  }
})();
