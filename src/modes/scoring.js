export const getInitialScoreState = () => ({
  coins: 0,
  timeSeconds: 0,
  score: 0,
});

export const updateScore = (state, { coinsDelta = 0, timeDelta = 0 }) => {
  const nextCoins = state.coins + coinsDelta;
  const nextTime = state.timeSeconds + timeDelta;
  const score = nextCoins * 10 - nextTime;

  return {
    coins: nextCoins,
    timeSeconds: nextTime,
    score,
  };
};
