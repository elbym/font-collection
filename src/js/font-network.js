(function () {
  var container = document.querySelector('.font-network');
  var dataEl = document.getElementById('font-network-data');
  if (!container || !dataEl || typeof ForceGraph !== 'function') return;

  var data = JSON.parse(dataEl.textContent);
  var highlightId = container.dataset.highlight || null;
  var baseUrl = container.dataset.baseUrl || '/';

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

  // Pulls font nodes toward a fixed per-category point on a circle so that
  // categories form visually distinct clusters instead of one dense blob.
  // Tag/author nodes are pulled toward the average target of the fonts they
  // connect to, so they settle near the category (or categories) they belong to.
  function forceCluster() {
    var strength = 0.5;
    var radius = 200;
    var nodes;

    function force(alpha) {
      nodes.forEach(function (d) {
        var target = d.__clusterTarget;
        if (!target) return;
        d.vx += (target.x * radius - d.x) * strength * alpha;
        d.vy += (target.y * radius - d.y) * strength * alpha;
      });
    }

    force.initialize = function (_nodes) {
      nodes = _nodes;
    };
    force.radius = function (v) {
      if (!arguments.length) return radius;
      radius = v;
      return force;
    };

    return force;
  }

  function assignClusterTargets(nodes, links) {
    var categories = Object.keys(CATEGORY_COLORS).concat(['other']);
    var centers = {};
    categories.forEach(function (cat, i) {
      var angle = (2 * Math.PI * i) / categories.length;
      centers[cat] = { x: Math.cos(angle), y: Math.sin(angle) };
    });

    var nodeById = {};
    nodes.forEach(function (n) { nodeById[n.id] = n; });

    nodes.forEach(function (n) {
      if (n.group === 'font') {
        var cat = (n.category || 'other').toLowerCase();
        n.__clusterTarget = centers[cat] || centers.other;
      }
    });

    var accum = {};
    links.forEach(function (link) {
      var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      var targetId = typeof link.target === 'object' ? link.target.id : link.target;
      var sourceNode = nodeById[sourceId];
      var targetNode = nodeById[targetId];
      if (!sourceNode || !targetNode) return;

      var fontNode = sourceNode.group === 'font' ? sourceNode : (targetNode.group === 'font' ? targetNode : null);
      var otherNode = fontNode === sourceNode ? targetNode : sourceNode;
      if (!fontNode || !otherNode || otherNode.group === 'font') return;

      var t = fontNode.__clusterTarget;
      if (!t) return;
      accum[otherNode.id] = accum[otherNode.id] || { x: 0, y: 0, count: 0 };
      accum[otherNode.id].x += t.x;
      accum[otherNode.id].y += t.y;
      accum[otherNode.id].count++;
    });

    Object.keys(accum).forEach(function (id) {
      var a = accum[id];
      nodeById[id].__clusterTarget = { x: a.x / a.count, y: a.y / a.count };
    });
  }

  assignClusterTargets(data.nodes, data.links);

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
        window.location.href = baseUrl + node.url + '.html';
      }
    });

  var clusterRadius = Math.max(160, Math.min(container.clientWidth, container.clientHeight || window.innerHeight * 0.7) * 0.6);
  graph.d3Force('cluster', forceCluster().radius(clusterRadius));
  var chargeForce = graph.d3Force('charge');
  if (chargeForce && typeof chargeForce.strength === 'function') {
    chargeForce.strength(-140);
  }

  var didInitialZoom = false;
  graph.onEngineStop(function () {
    if (didInitialZoom) return;
    didInitialZoom = true;
    if (highlightId) {
      var node = data.nodes.find(function (n) { return n.id === highlightId; });
      if (node) {
        graph.centerAt(node.x, node.y, 600);
        graph.zoom(3, 600);
      }
    } else {
      graph.zoom(2, 600);
    }
  });

  window.addEventListener('resize', function () {
    graph.width(container.clientWidth);
  });
})();
