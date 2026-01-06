import { createNode, connectNodes, finalizeGraph } from "./graph.js";
import { mulberry32 } from "./random.js";

const DEFAULT_CONFIG = {
  depth: 6,
  branchFactor: 2,
  mergeChance: 0.65,
  coinChance: 0.35,
};

export const createLayerGraph = ({ id, seed, config = {} }) => {
  const options = { ...DEFAULT_CONFIG, ...config };
  const rng = mulberry32(seed);

  const nodes = [];
  const entry = createNode(`layer-${id}-entry`, id, {
    position: { x: 0.1, y: 0.5 },
  });
  nodes.push(entry);

  let frontier = [entry];
  for (let depth = 0; depth < options.depth; depth += 1) {
    const nextFrontier = [];
    frontier.forEach((node, index) => {
      for (let branch = 0; branch < options.branchFactor; branch += 1) {
        const nodeId = `layer-${id}-${depth}-${index}-${branch}`;
        const nextNode = createNode(nodeId, id, {
          coins: rng() > 1 - options.coinChance ? Math.ceil(rng() * 3) : 0,
          position: {
            x: 0.2 + depth * 0.12 + rng() * 0.08,
            y: 0.2 + rng() * 0.6,
          },
        });
        connectNodes(node, nextNode);
        nodes.push(nextNode);
        nextFrontier.push(nextNode);
      }
    });

    nextFrontier.forEach((node, index) => {
      const shouldMerge = rng() < options.mergeChance && nextFrontier.length > 1;
      if (shouldMerge) {
        const mergeTarget = nextFrontier[(index + 1) % nextFrontier.length];
        connectNodes(node, mergeTarget);
      }
    });

    frontier = nextFrontier;
  }

  const exit = createNode(`layer-${id}-exit`, id, {
    position: { x: 0.9, y: 0.5 },
  });
  frontier.forEach((node) => connectNodes(node, exit));
  nodes.push(exit);

  return {
    id,
    seed,
    createdAt: new Date().toISOString(),
    entry: entry.id,
    exit: exit.id,
    nodes: finalizeGraph(nodes),
  };
};
