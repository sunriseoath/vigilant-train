export const createNode = (id, layerId, options = {}) => ({
  id,
  layerId,
  coins: options.coins ?? 0,
  position: options.position ?? { x: 0, y: 0 },
  neighbors: new Set(),
});

export const connectNodes = (a, b) => {
  a.neighbors.add(b.id);
  b.neighbors.add(a.id);
};

export const finalizeGraph = (nodes) =>
  nodes.map((node) => ({
    ...node,
    neighbors: [...node.neighbors],
  }));
