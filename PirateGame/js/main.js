import { createTextures, createGameState, resetGameState } from "./state.js";
import { createUi, addLog, updateHud, hideGameOver } from "./ui.js";
import { updatePlayer, openNearbyIslandAction, plunderIsland, repairAtSea, applyUpgrade, findNearbyIsland, closeShipyard } from "./world.js";
import { resolveBattleAction } from "./battle.js";
import { draw } from "./render.js";
import { updateParticles } from "./particles.js";
import { initializeQuestBoard, renderQuestUi, acceptQuest, rerollQuestOffers, tryTurnInQuest } from "./quests.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ui = createUi();
const textures = createTextures();
const game = createGameState();
const keys = new Set();

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(640, Math.floor(bounds.width));
  const height = Math.max(500, Math.floor(bounds.height));
  canvas.width = width;
  canvas.height = height;
}

function tick(now) {
  const dt = Math.min(0.033, (now - game.lastTime) / 1000);
  game.lastTime = now;
  if (!game.gameOver) {
    updatePlayer(game, ui, canvas, keys, dt);
  }
  updateParticles(game, dt);
  draw(ctx, canvas, game, textures);
  requestAnimationFrame(tick);
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  keys.add(key);
  if (key === "e") {
    openNearbyIslandAction(game, ui);
  }
  if (key === "r") {
    repairAtSea(game, ui);
  }
  if (key === "escape") {
    closeShipyard(ui);
  }
  if (game.gameOver) {
    return;
  }
}

function handleKeyUp(event) {
  keys.delete(event.key.toLowerCase());
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("resize", resizeCanvas);

ui.plunderBtn.addEventListener("click", () => plunderIsland(game, ui));
ui.repairShipBtn.addEventListener("click", () => repairAtSea(game, ui));
ui.closeShipyardBtn.addEventListener("click", () => closeShipyard(ui));
ui.restartGameBtn.addEventListener("click", restartGame);
ui.upgradeHullBtn.addEventListener("click", () => applyUpgrade(game, ui, "hull"));
ui.upgradeCannonsBtn.addEventListener("click", () => applyUpgrade(game, ui, "cannons"));
ui.upgradeSailsBtn.addEventListener("click", () => applyUpgrade(game, ui, "sails"));
ui.refillAmmoBtn.addEventListener("click", () => applyUpgrade(game, ui, "ammo"));
ui.acceptQuestBtn.addEventListener("click", () => acceptQuest(game, ui));
ui.completeQuestBtn.addEventListener("click", () => tryTurnInQuest(game, ui));
ui.rerollQuestBtn.addEventListener("click", () => rerollQuestOffers(game, ui));

document.querySelectorAll(".battle-action").forEach((button) => {
  button.addEventListener("click", () => resolveBattleAction(game, ui, button.dataset.action));
});

resizeCanvas();
initializeQuestBoard(game);
addLog(game, ui, "Kurs gesetzt. Halte Ausschau nach Inseln und feindlichen Segeln.");
addLog(game, ui, "Die Mannschaft startet mit etwas Holz, Munition und einer leichten Sloop.");
updateHud(game, ui);
findNearbyIsland(game, ui);
renderQuestUi(game, ui);
requestAnimationFrame(tick);

function restartGame() {
  resetGameState(game);
  keys.clear();
  hideGameOver(ui);
  closeShipyard(ui);
  initializeQuestBoard(game);
  addLog(game, ui, "Neue Reise beginnt. Die Crew sticht erneut in See.");
  addLog(game, ui, "Halte Ausschau nach Inseln, Beute und feindlichen Segeln.");
  updateHud(game, ui);
  findNearbyIsland(game, ui);
  renderQuestUi(game, ui);
}
