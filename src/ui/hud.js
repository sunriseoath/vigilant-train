export const createHud = () => {
  const layerEl = document.querySelector("#hud-layer");
  const coinsEl = document.querySelector("#hud-coins");
  const timeEl = document.querySelector("#hud-time");
  const scoreEl = document.querySelector("#hud-score");

  const update = (scoreState, currentLayer) => {
    layerEl.textContent = currentLayer?.id ?? 0;
    coinsEl.textContent = scoreState.coins;
    timeEl.textContent = scoreState.timeSeconds;
    scoreEl.textContent = scoreState.score;
  };

  return { update };
};
