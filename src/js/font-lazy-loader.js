(function () {
  var loaded = {};
  // CSS class names starting with 'font-' that are NOT font-family slugs
  var notFontSlugs = { content: 1 };

  function getAssetBase() {
    var link = document.querySelector('link[rel="stylesheet"][href*="/css/styles"]');
    if (!link) return '';
    return link.href.replace(/\/css\/styles\.css.*$/, '');
  }

  function loadFont(slug) {
    if (loaded[slug]) return;
    loaded[slug] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getAssetBase() + '/css/webfonts/' + slug + '.css';
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
    if (slug.indexOf('-') !== -1 || notFontSlugs[slug]) return;
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
