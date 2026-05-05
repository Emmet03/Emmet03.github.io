export function createUi() {
  return {
    hullStat: document.getElementById("hullStat"),
    cannonStat: document.getElementById("cannonStat"),
    woodStat: document.getElementById("woodStat"),
    ammoStat: document.getElementById("ammoStat"),
    goldStat: document.getElementById("goldStat"),
    fameStat: document.getElementById("fameStat"),
    shipTier: document.getElementById("shipTier"),
    seaState: document.getElementById("seaState"),
    logEntries: document.getElementById("logEntries"),
    islandCard: document.getElementById("islandCard"),
    islandName: document.getElementById("islandName"),
    islandDescription: document.getElementById("islandDescription"),
    plunderBtn: document.getElementById("plunderBtn"),
    shipyardModal: document.getElementById("shipyardModal"),
    shipyardTitle: document.getElementById("shipyardTitle"),
    shipyardDescription: document.getElementById("shipyardDescription"),
    closeShipyardBtn: document.getElementById("closeShipyardBtn"),
    battleModal: document.getElementById("battleModal"),
    gameOverModal: document.getElementById("gameOverModal"),
    gameOverText: document.getElementById("gameOverText"),
    restartGameBtn: document.getElementById("restartGameBtn"),
    enemyName: document.getElementById("enemyName"),
    battleTurnLabel: document.getElementById("battleTurnLabel"),
    battleMessage: document.getElementById("battleMessage"),
    battleRiskLabel: document.getElementById("battleRiskLabel"),
    battleRewardPreview: document.getElementById("battleRewardPreview"),
    playerBattleShip: document.getElementById("playerBattleShip"),
    enemyBattleShip: document.getElementById("enemyBattleShip"),
    playerHpBar: document.getElementById("playerHpBar"),
    enemyHpBar: document.getElementById("enemyHpBar"),
    playerBattleStats: document.getElementById("playerBattleStats"),
    enemyBattleStats: document.getElementById("enemyBattleStats"),
    repairShipBtn: document.getElementById("repairShipBtn"),
    shipyardStatus: document.getElementById("shipyardStatus"),
    weatherTitle: document.getElementById("weatherTitle"),
    weatherDescription: document.getElementById("weatherDescription"),
    activeQuestTitle: document.getElementById("activeQuestTitle"),
    activeQuestDescription: document.getElementById("activeQuestDescription"),
    activeQuestProgress: document.getElementById("activeQuestProgress"),
    upgradeHullBtn: document.getElementById("upgradeHullBtn"),
    upgradeCannonsBtn: document.getElementById("upgradeCannonsBtn"),
    upgradeSailsBtn: document.getElementById("upgradeSailsBtn"),
    refillAmmoBtn: document.getElementById("refillAmmoBtn"),
    questOfferTitle: document.getElementById("questOfferTitle"),
    questOfferDescription: document.getElementById("questOfferDescription"),
    acceptQuestBtn: document.getElementById("acceptQuestBtn"),
    completeQuestBtn: document.getElementById("completeQuestBtn"),
    rerollQuestBtn: document.getElementById("rerollQuestBtn"),
  };
}

export function renderLogs(game, ui) {
  ui.logEntries.innerHTML = "";
  game.logs.forEach((entry) => {
    const node = document.createElement("div");
    node.className = "log-entry";
    const prefix = entry.tone === "danger" ? "Alarm" : entry.tone === "success" ? "Beute" : "Log";
    node.innerHTML = `<strong>${prefix}:</strong> ${entry.message}`;
    ui.logEntries.appendChild(node);
  });
}

export function addLog(game, ui, message, tone = "normal") {
  game.logs.unshift({ message, tone });
  game.logs = game.logs.slice(0, 7);
  renderLogs(game, ui);
}

export function updateHud(game, ui) {
  const p = game.player;
  const nearbyIsland = game.islands.find((entry) => entry.id === game.nearIslandId);
  const atPirateIsland = nearbyIsland?.kind === "pirate" && !game.battle;

  ui.hullStat.textContent = `${Math.max(0, Math.ceil(p.hull))} / ${p.maxHull}`;
  ui.cannonStat.textContent = p.cannons;
  ui.woodStat.textContent = p.wood;
  ui.ammoStat.textContent = p.ammo;
  ui.goldStat.textContent = p.gold;
  ui.fameStat.textContent = p.fame;
  ui.shipTier.textContent = p.tier;
  ui.seaState.textContent = game.seaState;
  ui.weatherTitle.textContent = game.weather.label;
  ui.weatherDescription.textContent = game.weather.description;
  ui.shipyardStatus.textContent = atPirateIsland
    ? `Sicherer Ankerplatz auf ${nearbyIsland.name}. Druecke E fuer die Werft.`
    : "Lege an einer Pirateninsel an und druecke E, um die Werft zu oeffnen.";

  ui.repairShipBtn.disabled = p.wood < 1 || p.hull >= p.maxHull || Boolean(game.battle);
  ui.upgradeHullBtn.disabled = !atPirateIsland || p.gold < 45;
  ui.upgradeCannonsBtn.disabled = !atPirateIsland || p.gold < 60;
  ui.upgradeSailsBtn.disabled = !atPirateIsland || p.gold < 55;
  ui.refillAmmoBtn.disabled = !atPirateIsland || p.gold < 20;
}

export function setSeaState(game, ui, label) {
  game.seaState = label;
  updateHud(game, ui);
}

export function showGameOver(ui, message) {
  ui.gameOverText.textContent = message;
  ui.gameOverModal.classList.remove("hidden");
}

export function hideGameOver(ui) {
  ui.gameOverModal.classList.add("hidden");
}
