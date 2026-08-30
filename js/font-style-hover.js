(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var INTERVAL_MS = 220;

  function parseVariants(raw) {
    var seen = {};
    var variants = [];
    raw.split(',').forEach(function (token) {
      if (!token || seen[token]) return;
      seen[token] = true;
      var weight = parseInt(token, 10);
      if (!weight) return;
      variants.push({
        weight: weight,
        style: token.charAt(token.length - 1) === 'i' ? 'italic' : 'normal',
      });
    });
    return variants;
  }

  var cards = [];
  document.querySelectorAll('h3[data-hover-styles]').forEach(function (el) {
    var variants = parseVariants(el.getAttribute('data-hover-styles') || '');
    if (variants.length < 2) return;

    var slugEl = el.closest('[data-font-slug]');
    var card = {
      el: el,
      header: el.closest('header'),
      cardEl: el.closest('.card'),
      slug: slugEl ? slugEl.getAttribute('data-font-slug') : null,
      family: el.getAttribute('data-font-family'),
      variants: variants,
    };
    cards.push(card);

    var originalWeight = el.style.fontWeight;
    var originalStyle = el.style.fontStyle;
    var timer = null;
    var index = 0;

    function applyStep() {
      index = (index + 1) % variants.length;
      var v = variants[index];
      el.style.fontWeight = v.weight;
      el.style.fontStyle = v.style;
    }

    var hovering = false;

    el.addEventListener('mouseenter', function () {
      hovering = true;
      // Load this card's weight files + reserve its size on first hover only —
      // doing it up front for every card on the page flooded the network with
      // woff2 downloads and thrashed layout right after load.
      preloadCard(card).then(function () {
        if (!hovering || timer) return;
        index = 0;
        applyStep();
        timer = setInterval(applyStep, INTERVAL_MS);
      });
    });

    el.addEventListener('mouseleave', function () {
      hovering = false;
      clearInterval(timer);
      timer = null;
      el.style.fontWeight = originalWeight;
      el.style.fontStyle = originalStyle;
    });
  });

  if (!cards.length) return;

  // ── Background preload ────────────────────────────────────────────
  // Once the page has settled, fetch every weight/style file the hover cycle
  // needs so switching styles on mouseenter doesn't stall on the network,
  // then measure the tallest instance so the card can reserve room for it
  // up front instead of resizing when a bold/wide style wraps onto a new line.
  var _assetBase = null;
  function getAssetBase() {
    if (_assetBase !== null) return _assetBase;
    var link = document.querySelector('link[rel="stylesheet"][href*="/css/styles"]');
    _assetBase = link ? link.href.replace(/\/css\/styles\.css.*$/, '') : '';
    return _assetBase;
  }

  var cssReady = {};
  function ensureFontCss(slug) {
    if (cssReady[slug]) return cssReady[slug];
    cssReady[slug] = new Promise(function (resolve) {
      if (document.querySelector('link[rel="stylesheet"][href*="/css/webfonts/' + slug + '.css"]')) {
        resolve();
        return;
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = getAssetBase() + '/css/webfonts/' + slug + '.css';
      link.addEventListener('load', resolve);
      link.addEventListener('error', resolve);
      document.head.appendChild(link);
    });
    return cssReady[slug];
  }

  // Reserve enough height and width for the heaviest normal/italic instance so
  // cycling through weights during hover never resizes the card: height because
  // a bold/wide instance may wrap onto a second line, width because the flex
  // grid would otherwise regrow the card to fit a wider unbroken word.
  function reserveHeight(card) {
    if (!card.header) return;
    var maxWeightNormal = 0;
    var maxWeightItalic = 0;
    card.variants.forEach(function (v) {
      if (v.style === 'italic') maxWeightItalic = Math.max(maxWeightItalic, v.weight);
      else maxWeightNormal = Math.max(maxWeightNormal, v.weight);
    });
    var candidates = [];
    if (maxWeightNormal) candidates.push({ weight: maxWeightNormal, style: 'normal' });
    if (maxWeightItalic) candidates.push({ weight: maxWeightItalic, style: 'italic' });

    var prevWeight = card.el.style.fontWeight;
    var prevStyle = card.el.style.fontStyle;
    var prevWhiteSpace = card.el.style.whiteSpace;
    var maxHeight = card.header.getBoundingClientRect().height;
    var maxWidth = card.cardEl ? card.cardEl.getBoundingClientRect().width : 0;

    // Measure each candidate unwrapped so a single wide word can't be masked
    // by line-wrapping — that's the width we actually need to reserve.
    card.el.style.whiteSpace = 'nowrap';
    candidates.forEach(function (v) {
      card.el.style.fontWeight = v.weight;
      card.el.style.fontStyle = v.style;
      maxHeight = Math.max(maxHeight, card.header.getBoundingClientRect().height);
      if (card.cardEl) maxWidth = Math.max(maxWidth, card.el.scrollWidth);
    });

    card.el.style.fontWeight = prevWeight;
    card.el.style.fontStyle = prevStyle;
    card.el.style.whiteSpace = prevWhiteSpace;

    if (maxHeight > card.header.getBoundingClientRect().height) {
      card.header.style.minHeight = Math.ceil(maxHeight) + 'px';
    }
    if (card.cardEl && maxWidth > card.cardEl.getBoundingClientRect().width) {
      card.cardEl.style.minWidth = Math.ceil(maxWidth) + 'px';
    }
  }

  // Memoised per card: loads the weight files this card's hover cycle needs,
  // then reserves the card's size once so cycling never resizes it. Resolves
  // when the card is ready to animate.
  function preloadCard(card) {
    if (card._preload) return card._preload;
    if (!card.slug || !card.family || !('fonts' in document)) {
      card._preload = Promise.resolve();
      return card._preload;
    }
    card._preload = ensureFontCss(card.slug).then(function () {
      var loads = card.variants.map(function (v) {
        try {
          return document.fonts.load((v.style === 'italic' ? 'italic ' : '') + v.weight + ' 16px "' + card.family + '"');
        } catch (e) {
          return Promise.resolve();
        }
      });
      return Promise.all(loads);
    }).then(function () {
      reserveHeight(card);
    });
    return card._preload;
  }
})();
