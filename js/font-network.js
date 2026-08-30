(function () {
  var container = document.querySelector('.font-network');
  var dataEl = document.getElementById('font-network-data');
  if (!container || !dataEl || typeof ForceGraph !== 'function') return;

  var data = JSON.parse(dataEl.textContent);
  var highlightId = container.dataset.highlight || null;
  var baseUrl = container.dataset.baseUrl || '/';

  // On specimen pages (highlightId set), fade out every node that isn't
  // directly linked to the current font so its immediate neighborhood stands out.
  var connectedIds = null;
  if (highlightId) {
    connectedIds = new Set([highlightId]);
    data.links.forEach(function (link) {
      var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      var targetId = typeof link.target === 'object' ? link.target.id : link.target;
      if (sourceId === highlightId) connectedIds.add(targetId);
      if (targetId === highlightId) connectedIds.add(sourceId);
    });
  }

  function isDimmed(node) {
    return !!connectedIds && !connectedIds.has(node.id);
  }

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

  // The active font is only highlighted visually — it lays out with the rest
  // of the network. The camera pans to wherever it settles (see onEngineStop).
  var highlightNode = highlightId && data.nodes.find(function (n) { return n.id === highlightId; });

  // ForceAtlas2 (Jacomy et al.) as custom d3-force forces: degree-weighted
  // repulsion, linear edge attraction, degree-weighted gravity to center.
  var degree = {};
  data.links.forEach(function (l) {
    degree[l.source] = (degree[l.source] || 0) + 1;
    degree[l.target] = (degree[l.target] || 0) + 1;
  });

  function forceAtlas2Repulsion(scaling) {
    var nodes;
    function force(alpha) {
      var n = nodes.length;
      for (var i = 0; i < n; i++) {
        var a = nodes[i];
        var da = (degree[a.id] || 0) + 1;
        for (var j = i + 1; j < n; j++) {
          var b = nodes[j];
          var db = (degree[b.id] || 0) + 1;
          var dx = a.x - b.x, dy = a.y - b.y;
          var d2 = dx * dx + dy * dy || 0.01;
          var k = (scaling * da * db / d2) * alpha;
          var fx = dx * k, fy = dy * k;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }
    }
    force.initialize = function (n) { nodes = n; };
    return force;
  }

  function forceAtlas2Attraction(strength) {
    var links;
    function force(alpha) {
      for (var i = 0; i < links.length; i++) {
        var l = links[i];
        var s = l.source, t = l.target;
        var dx = t.x - s.x, dy = t.y - s.y;
        var k = strength * alpha;
        var fx = dx * k, fy = dy * k;
        s.vx += fx; s.vy += fy;
        t.vx -= fx; t.vy -= fy;
      }
    }
    force.links = function (l) { links = l; return force; };
    force.id = function () { return force; };
    return force;
  }

  function forceAtlas2Gravity(gravity) {
    var nodes;
    function force(alpha) {
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        var da = (degree[a.id] || 0) + 1;
        var dist = Math.sqrt(a.x * a.x + a.y * a.y) || 1;
        var k = (gravity * da * alpha) / dist;
        a.vx -= a.x * k;
        a.vy -= a.y * k;
      }
    }
    force.initialize = function (n) { nodes = n; };
    return force;
  }

  function nodeColor(node) {
    if (node.group === 'font') return CATEGORY_COLORS[(node.category || '').toLowerCase()] || TAG_COLOR;
    if (node.group === 'author') return AUTHOR_COLOR;
    return TAG_COLOR;
  }

  // Node size reflects how many connections (links) a node has, so hub
  // tags/authors and heavily-tagged fonts stand out from sparsely linked ones.
  var MIN_RADIUS = 3;
  var MAX_RADIUS = 18;

  (function computeDegrees() {
    var degree = {};
    data.links.forEach(function (link) {
      var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      var targetId = typeof link.target === 'object' ? link.target.id : link.target;
      degree[sourceId] = (degree[sourceId] || 0) + 1;
      degree[targetId] = (degree[targetId] || 0) + 1;
    });

    var maxDegree = 1;
    data.nodes.forEach(function (n) {
      var d = degree[n.id] || 0;
      n.__degree = d;
      if (d > maxDegree) maxDegree = d;
    });
    data.nodes.forEach(function (n) {
      n.__maxDegree = maxDegree;
    });
  })();

  function nodeRadius(node) {
    var ratio = node.__maxDegree ? node.__degree / node.__maxDegree : 0;
    var base = MIN_RADIUS + Math.sqrt(ratio) * (MAX_RADIUS - MIN_RADIUS);
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

      ctx.save();
      ctx.globalAlpha = isDimmed(node) ? 0.5 : 1;

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

      ctx.restore();
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
    // ponytail: FA2 constants — repulsion/attraction/gravity scaled down ~3x
    // from the original 5 / 0.15 / 0.5013. Same ratio, so the equilibrium
    // layout is unchanged, but per-tick forces are gentler (less fling/jitter).
    // Tune in-browser if the graph feels too loose or too tight.
    .d3Force('charge', forceAtlas2Repulsion(1.8))
    .d3Force('link', forceAtlas2Attraction(0.05).links(data.links))
    .d3Force('center', null)
    .d3Force('gravity', forceAtlas2Gravity(0.18))
    .d3VelocityDecay(0.5)
    .onNodeClick(function (node) {
      if (node.group === 'font' && node.url && node.id !== highlightId) {
        window.location.href = baseUrl + node.url + '.html';
      }
    });

  var clusterRadius = Math.max(160, Math.min(container.clientWidth, container.clientHeight || window.innerHeight * 0.7) * 0.6);
  graph.d3Force('cluster', forceCluster().radius(clusterRadius));
  var chargeForce = graph.d3Force('charge');
  if (chargeForce && typeof chargeForce.strength === 'function') {
    var CHARGE_PER_RADIUS = -10;
    chargeForce.strength(function (node) {
      return CHARGE_PER_RADIUS * nodeRadius(node);
    });
  }

  var didInitialZoom = false;
  graph.onEngineStop(function () {
    if (didInitialZoom) return;
    didInitialZoom = true;
    if (highlightNode) {
      graph.centerAt(highlightNode.x || 0, highlightNode.y || 0, 600);
      graph.zoom(3, 600);
    } else {
      graph.zoom(2, 600);
    }
  });

  window.addEventListener('resize', function () {
    graph.width(container.clientWidth);
  });
})();
