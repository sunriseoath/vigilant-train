export const createRenderer = (canvas) => {
  const ctx = canvas.getContext("2d");

  const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawEdges = (layer) => {
    ctx.strokeStyle = "#2b2b3d";
    ctx.lineWidth = 2;
    layer.nodes.forEach((node) => {
      const x = node.position.x * canvas.width;
      const y = node.position.y * canvas.height;
      node.neighbors.forEach((neighborId) => {
        const neighbor = layer.nodes.find((item) => item.id === neighborId);
        if (!neighbor) {
          return;
        }
        const nx = neighbor.position.x * canvas.width;
        const ny = neighbor.position.y * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
      });
    });
  };

  const drawNode = (node, { isActive, isCollected }) => {
    const x = node.position.x * canvas.width;
    const y = node.position.y * canvas.height;
    const baseRadius = node.id.includes("entry") || node.id.includes("exit") ? 10 : 6;
    const radius = isActive ? baseRadius + 4 : baseRadius;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (isActive) {
      ctx.fillStyle = "#ffffff";
    } else if (node.id.includes("entry")) {
      ctx.fillStyle = "#4ade80";
    } else if (node.id.includes("exit")) {
      ctx.fillStyle = "#f97316";
    } else if (node.coins > 0 && !isCollected) {
      ctx.fillStyle = "#f2c94c";
    } else {
      ctx.fillStyle = isCollected ? "#3f3f4f" : "#6d4aff";
    }
    ctx.fill();
  };

  const drawLayer = (layer, { opacity, activeNodeId, collectedNodes }) => {
    ctx.globalAlpha = opacity;
    drawEdges(layer);
    layer.nodes.forEach((node) => {
      drawNode(node, {
        isActive: node.id === activeNodeId,
        isCollected: collectedNodes.has(node.id),
      });
    });
    ctx.globalAlpha = 1;
  };

  const renderTimeline = (timeline, { activeLayerId, activeNodeId, collectedNodes }) => {
    clear();
    timeline.layers.forEach((layer, index) => {
      const opacity = layer.id === activeLayerId ? 1 : Math.max(0.15, 1 - index * 0.2);
      drawLayer(layer, { opacity, activeNodeId, collectedNodes });
    });
  };

  const pickNodeAt = (event, layer) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hitRadius = 14;
    return layer.nodes.find((node) => {
      const nx = node.position.x * canvas.width;
      const ny = node.position.y * canvas.height;
      const dx = nx - x;
      const dy = ny - y;
      return Math.hypot(dx, dy) <= hitRadius;
    });
  };

  return {
    renderTimeline,
    pickNodeAt,
  };
};
