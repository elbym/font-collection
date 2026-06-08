// Detects which characters in the .ascii grid are not provided by the specimen
// font by comparing canvas pixel output: if rendering with the specimen font
// looks identical to rendering with only the serif fallback, the specimen font
// has no glyph for that codepoint and the browser fell through to the fallback.
(function () {
  document.fonts.ready.then(function () {
    var section = document.querySelector(".ascii");
    if (!section) return;

    var firstSpan = section.querySelector(".l");
    if (!firstSpan) return;

    // Primary font name from computed style, e.g. "Fira Sans" or 'Inter'
    var primaryFont = getComputedStyle(firstSpan).fontFamily.split(",")[0].trim();

    var W = 24, H = 24, SIZE = 16;
    var canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Returns a cheap integer hash of the canvas pixels for fast comparison.
    function pixelHash(char, fontStr) {
      ctx.clearRect(0, 0, W, H);
      ctx.font = SIZE + "px " + fontStr;
      ctx.fillStyle = "#000";
      ctx.fillText(char, 2, SIZE);
      var d = ctx.getImageData(0, 0, W, H).data;
      var h = 0;
      for (var i = 0; i < d.length; i++) h = (h * 31 + d[i]) | 0;
      return h;
    }

    section.querySelectorAll(".l").forEach(function (span) {
      var char = span.textContent.trim();
      if (!char) return;
      // With specimen font in the stack vs. with serif fallback only.
      // If hashes match the browser fell back to serif for both → glyph missing.
      if (pixelHash(char, primaryFont + ", serif") === pixelHash(char, "serif")) {
        span.classList.add("char--missing");
      }
    });
  });
})();
