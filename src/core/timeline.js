import { createLayerGraph } from "./generator.js";
import { createSeed } from "./random.js";

export const createTimeline = () => {
  const seed = createSeed();
  return {
    layers: [createLayerGraph({ id: 0, seed })],
    createdAt: new Date().toISOString(),
  };
};

export const appendNewLayer = (timeline) => {
  const nextId = timeline.layers[0]?.id + 1 ?? 0;
  const seed = createSeed();
  const newestLayer = createLayerGraph({ id: nextId, seed });

  return {
    ...timeline,
    layers: [newestLayer, ...timeline.layers],
  };
};
