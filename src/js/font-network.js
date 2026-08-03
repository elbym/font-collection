(function () {
  var container = document.querySelector('.font-network');
  var dataEl = document.getElementById('font-network-data');
  if (!container || !dataEl || typeof ForceGraph !== 'function') return;

  var data = JSON.parse(dataEl.textContent);
  var highlightId = container.dataset.highlight || null;

  var CATEGORY_COLORS = {
    sans: '#4C6EF5',
    serif: '#F76707',
    display: '#E64980',
    monospace: '#12B886',
    script: '#BE4BDB',
    blackletter: '#862E2E',
    comicsans: '#FAB005'
  };
  var TAG_COLOR = '#adb5bd';
  var AUTHOR_COLOR = '#495057';
  var HIGHLIGHT_COLOR = '#212529';
  var RING_COLOR = '#FF1493';

  function nodeColor(node) {
    if (node.group === 'font') return CATEGORY_COLORS[(node.category || '').toLowerCase()] || TAG_COLOR;
    if (node.group === 'author') return AUTHOR_COLOR;
    return TAG_COLOR;
  }

  function nodeRadius(node) {
    var base = node.group === 'font' ? 7 : 4;
    return node.id === highlightId ? base + 4 : base;
  }

  var graph = ForceGraph()(container)
    .graphData(data)
    .nodeId('id')
    .nodeLabel('name')
    .linkColor(function () { return 'rgba(128,128,128,0.5)'; })
    .linkWidth(1)
    .nodeCanvasObject(function (node, ctx, globalScale) {
      var r = nodeRadius(node);
      var isHighlight = node.id === highlightId;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = nodeColor(node);
      ctx.fill();

      if (isHighlight) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = RING_COLOR;
        ctx.stroke();
      }

      if (isHighlight || node.group === 'font' || globalScale > 2.5) {
        var fontSize = 12 / globalScale;
        ctx.font = (isHighlight ? 'bold ' : '') + fontSize + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isHighlight ? HIGHLIGHT_COLOR : 'rgba(120,120,120,0.9)';
        ctx.fillText(node.name, node.x, node.y + r + 2);
      }

      if (isHighlight) {
        var markerSize = 11 / globalScale;
        ctx.font = 'bold ' + markerSize + 'px sans-serif';
        ctx.fillStyle = HIGHLIGHT_COLOR;
        ctx.fillText('Sie sind hier ↓', node.x, node.y - r - markerSize - 2);
      }
    })
    .nodePointerAreaPaint(function (node, color, ctx) {
      var r = nodeRadius(node);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
      ctx.fill();
    })
    .width(container.clientWidth)
    .height(container.clientHeight || Math.round(window.innerHeight * 0.7))
    .onNodeClick(function (node) {
      if (node.group === 'font' && node.url && node.id !== highlightId) {
        window.location.href = '/' + node.url + '.html';
      }
    });

  if (highlightId) {
    graph.onEngineStop(function () {
      var node = data.nodes.find(function (n) { return n.id === highlightId; });
      if (node) {
        graph.centerAt(node.x, node.y, 600);
        graph.zoom(3, 600);
      }
    });
  }

  window.addEventListener('resize', function () {
    graph.width(container.clientWidth);
  });
})();
