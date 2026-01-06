import { createTimeline, appendNewLayer } from "./core/timeline.js";
import { createRenderer } from "./ui/renderer.js";
import { createHud } from "./ui/hud.js";
import { createRunLog } from "./ui/log.js";
import { loadTimeline, saveTimeline } from "./storage/localStore.js";
import { getInitialScoreState, updateScore } from "./modes/scoring.js";

const startButton = document.querySelector("#start-run");
const modeInputs = document.querySelectorAll("input[name=mode]");
const canvas = document.querySelector("#dungeon-canvas");

let timeline = loadTimeline() ?? createTimeline();
const renderer = createRenderer(canvas);
const hud = createHud();
const runLog = createRunLog(document.querySelector("#run-log"));

let currentMode = "untimed";
let scoreState = getInitialScoreState();
let timerId = null;
let activeLayerIndex = 0;
let activeNodeId = timeline.layers[0].entry;
const collectedNodes = new Set();

const syncMode = () => {
  currentMode = [...modeInputs].find((input) => input.checked)?.value ?? "untimed";
};

const resetTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const startTimer = () => {
  if (currentMode !== "timed") {
    return;
  }
  timerId = setInterval(() => {
    scoreState = updateScore(scoreState, { timeDelta: 1 });
    hud.update(scoreState, timeline.layers[activeLayerIndex]);
  }, 1000);
};

const render = () => {
  renderer.renderTimeline(timeline, {
    activeLayerId: timeline.layers[activeLayerIndex]?.id,
    activeNodeId,
    collectedNodes,
  });
};

const resetRunState = () => {
  activeLayerIndex = 0;
  activeNodeId = timeline.layers[0].entry;
  collectedNodes.clear();
  scoreState = getInitialScoreState();
};

const startRun = () => {
  syncMode();
  resetTimer();

  timeline = appendNewLayer(timeline);
  resetRunState();

  hud.update(scoreState, timeline.layers[activeLayerIndex]);
  render();

  runLog.addEntry(`Started ${currentMode} run on layer ${timeline.layers[0].id}`);

  saveTimeline(timeline);
  startTimer();
};

const completeRun = () => {
  resetTimer();
  runLog.addEntry("Reached the exit! A new day is added to the dungeon.");
  startRun();
};

const moveToNode = (nodeId) => {
  const layer = timeline.layers[activeLayerIndex];
  const node = layer.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return;
  }

  activeNodeId = nodeId;

  if (node.coins > 0 && !collectedNodes.has(nodeId)) {
    collectedNodes.add(nodeId);
    scoreState = updateScore(scoreState, { coinsDelta: node.coins });
  }

  hud.update(scoreState, layer);
  render();

  if (nodeId === layer.exit) {
    completeRun();
  }
};

const handleCanvasClick = (event) => {
  const layer = timeline.layers[activeLayerIndex];
  const picked = renderer.pickNodeAt(event, layer);
  if (!picked) {
    return;
  }

  const currentNode = layer.nodes.find((node) => node.id === activeNodeId);
  if (!currentNode?.neighbors.includes(picked.id)) {
    return;
  }

  moveToNode(picked.id);
};

modeInputs.forEach((input) => input.addEventListener("change", syncMode));
startButton.addEventListener("click", startRun);
canvas.addEventListener("click", handleCanvasClick);

render();
hud.update(scoreState, timeline.layers[activeLayerIndex]);
