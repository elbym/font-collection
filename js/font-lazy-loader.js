(function () {
  var loaded = {};

  // Mark fonts already loaded via <link rel="stylesheet"> so idle prefetch doesn't re-queue them.
  document.querySelectorAll('link[rel="stylesheet"][href*="/css/webfonts/"]').forEach(function (link) {
    var m = /\/css\/webfonts\/([^/]+)\.css/.exec(link.href);
    if (m) loaded[m[1]] = true;
  });

  // CSS class names starting with 'font-' that are NOT font-family slugs
  var notFontSlugs = { content: 1, search: 1 };

  // First segment of a hyphenated slug that indicates a CSS utility class, not a font name.
  var cssUtilWords = { size: 1, family: 1, weight: 1, style: 1, color: 1, display: 1, variant: 1, card: 1, poster: 1, image: 1, list: 1 };

  var _assetBase = null;
  function getAssetBase() {
    if (_assetBase !== null) return _assetBase;
    var link = document.querySelector('link[rel="stylesheet"][href*="/css/styles"]');
    _assetBase = link ? link.href.replace(/\/css\/styles\.css.*$/, '') : '';
    return _assetBase;
  }

  function loadFont(slug) {
    if (loaded[slug]) return;
    loaded[slug] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getAssetBase() + '/css/webfonts/' + slug + '.css';
    if (window.fitty) {
      link.addEventListener('load', function () {
        requestAnimationFrame(function () { fitty.fitAll(); });
      });
    }
    document.head.appendChild(link);
  }

  // Auto-detect font-* CSS classes and add data-font-slug where missing.
  // Slugs with hyphens (e.g. font-family-card-list, font-size-28) are excluded.
  var fontClassRe = /(?:^| )font-([a-z][a-z0-9-]{3,})(?= |$)/;
  document.querySelectorAll('[class]').forEach(function (el) {
    if (el === document.body || el.hasAttribute('data-font-slug')) return;
    var m = fontClassRe.exec(el.getAttribute('class') || '');
    if (!m) return;
    var slug = m[1];
    if (cssUtilWords[slug.split('-')[0]] || notFontSlugs[slug]) return;
    el.setAttribute('data-font-slug', slug);
  });

  var targets = document.querySelectorAll('[data-font-slug]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      loadFont(el.getAttribute('data-font-slug'));
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var slug = entry.target.getAttribute('data-font-slug');
      if (slug) loadFont(slug);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '300px 0px' });

  targets.forEach(function (el) {
    observer.observe(el);
  });

  // After page load: prefetch remaining font CSS files during browser idle time
  // so the CSS is already cached when the IntersectionObserver triggers loadFont().
  window.addEventListener('load', function () {
    var idle = window.requestIdleCallback
      ? function (fn) { requestIdleCallback(fn, { timeout: 3000 }); }
      : function (fn) { setTimeout(fn, 1000); };

    idle(function () {
      var base = getAssetBase();
      targets.forEach(function (el) {
        var slug = el.getAttribute('data-font-slug');
        if (!slug || loaded[slug]) return;
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'style';
        link.href = base + '/css/webfonts/' + slug + '.css';
        document.head.appendChild(link);
      });
    });
  });
})();
