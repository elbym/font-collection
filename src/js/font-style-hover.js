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

  document.querySelectorAll('h3[data-hover-styles]').forEach(function (el) {
    var variants = parseVariants(el.getAttribute('data-hover-styles') || '');
    if (variants.length < 2) return;

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

    el.addEventListener('mouseenter', function () {
      index = 0;
      applyStep();
      timer = setInterval(applyStep, INTERVAL_MS);
    });

    el.addEventListener('mouseleave', function () {
      clearInterval(timer);
      timer = null;
      el.style.fontWeight = originalWeight;
      el.style.fontStyle = originalStyle;
    });
  });
})();
