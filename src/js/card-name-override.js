(function () {
  var input = document.getElementById('global-name-override');
  var headings = document.querySelectorAll('.card header h3');
  if (!input || !headings.length) return;

  headings.forEach(function (h3) {
    h3.dataset.originalText = h3.textContent;
  });

  input.addEventListener('input', function () {
    var value = input.value.trim();
    headings.forEach(function (h3) {
      h3.textContent = value || h3.dataset.originalText;
    });
  });
})();
