import { allyUpgradeCost } from "./fleet.js";

export function createUi() {
  return {
    hullStat: document.getElementById("hullStat"),
    cannonStat: document.getElementById("cannonStat"),
    woodStat: document.getElementById("woodStat"),
    ammoStat: document.getElementById("ammoStat"),
    goldStat: document.getElementById("goldStat"),
    fameStat: document.getElementById("fameStat"),
    shipTier: document.getElementById("shipTier"),
    captainNameStat: document.getElementById("captainNameStat"),
    shipNameStat: document.getElementById("shipNameStat"),
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
    startModal: document.getElementById("startModal"),
    captainNameInput: document.getElementById("captainNameInput"),
    shipNameInput: document.getElementById("shipNameInput"),
    randomizeNamesBtn: document.getElementById("randomizeNamesBtn"),
    startGameBtn: document.getElementById("startGameBtn"),
    weatherTitle: document.getElementById("weatherTitle"),
    weatherDescription: document.getElementById("weatherDescription"),
    activeQuestTitle: document.getElementById("activeQuestTitle"),
    activeQuestDescription: document.getElementById("activeQuestDescription"),
    activeQuestProgress: document.getElementById("activeQuestProgress"),
    activeQuestReward: document.getElementById("activeQuestReward"),
    fleetSummary: document.getElementById("fleetSummary"),
    fleetList: document.getElementById("fleetList"),
    upgradeHullBtn: document.getElementById("upgradeHullBtn"),
    upgradeCannonsBtn: document.getElementById("upgradeCannonsBtn"),
    upgradeSailsBtn: document.getElementById("upgradeSailsBtn"),
    refillAmmoBtn: document.getElementById("refillAmmoBtn"),
    upgradeProwBtn: document.getElementById("upgradeProwBtn"),
    upgradeFireAmmoBtn: document.getElementById("upgradeFireAmmoBtn"),
    questSectionTitle: document.getElementById("questSectionTitle"),
    questSectionStatus: document.getElementById("questSectionStatus"),
    questOfferTitle: document.getElementById("questOfferTitle"),
    questOfferDescription: document.getElementById("questOfferDescription"),
    questOfferReward: document.getElementById("questOfferReward"),
    acceptQuestBtn: document.getElementById("acceptQuestBtn"),
    completeQuestBtn: document.getElementById("completeQuestBtn"),
    rerollQuestBtn: document.getElementById("rerollQuestBtn"),
    shipyardFleetList: document.getElementById("shipyardFleetList"),
    toggleControlsBtn: document.getElementById("toggleControlsBtn"),
    controlsPanelBody: document.getElementById("controlsPanelBody"),
    toggleHarborBtn: document.getElementById("toggleHarborBtn"),
    harborPanelBody: document.getElementById("harborPanelBody"),
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
  const shipyardOpen = !ui.shipyardModal.classList.contains("hidden");
  const atPirateIsland = nearbyIsland?.kind === "pirate" && !game.battle;
  const fleetUpgradeAvailable = !game.battle && (atPirateIsland || shipyardOpen);

  ui.hullStat.textContent = `${Math.max(0, Math.ceil(p.hull))} / ${p.maxHull}`;
  ui.captainNameStat.textContent = p.captainName;
  ui.shipNameStat.textContent = p.shipName;
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
    ? `Sicherer Ankerplatz auf ${nearbyIsland.name}. Drücke E oder nutze den Button für die Werft.`
    : "Lege an einer Pirateninsel an und drücke E, um die Werft zu öffnen.";

  ui.repairShipBtn.disabled = p.wood < 1 || p.hull >= p.maxHull || Boolean(game.battle);
  ui.upgradeHullBtn.disabled = !atPirateIsland || p.gold < 45;
  ui.upgradeCannonsBtn.disabled = !atPirateIsland || p.gold < 60;
  ui.upgradeSailsBtn.disabled = !atPirateIsland || p.gold < 55;
  ui.refillAmmoBtn.disabled = !atPirateIsland || p.gold < 20;
  ui.upgradeProwBtn.disabled = !atPirateIsland || p.gold < 85 || p.modules?.armoredProw;
  ui.upgradeFireAmmoBtn.disabled = !atPirateIsland || p.gold < 90 || p.modules?.fireAmmo;
  renderFleetUi(game, ui, fleetUpgradeAvailable);
}

export function setSeaState(game, ui, label) {
  if (game.seaState === label) {
    return;
  }
  game.seaState = label;
  updateHud(game, ui);
}

export function setPanelOpen(button, panelBody, open) {
  button.setAttribute("aria-expanded", String(open));
  panelBody.classList.toggle("hidden", !open);
}

export function togglePanel(button, panelBody) {
  const open = button.getAttribute("aria-expanded") === "true";
  setPanelOpen(button, panelBody, !open);
}

export function showGameOver(ui, message) {
  ui.gameOverText.textContent = message;
  ui.gameOverModal.classList.remove("hidden");
}

export function hideGameOver(ui) {
  ui.gameOverModal.classList.add("hidden");
}

export function showStartModal(ui) {
  ui.startModal.classList.remove("hidden");
}

export function hideStartModal(ui) {
  ui.startModal.classList.add("hidden");
}

export function renderFleetUi(game, ui, allowFleetUpgrades = false) {
  const allies = game.allies ?? [];
  ui.fleetSummary.textContent = allies.length ? `${allies.length} Schiffe` : "Keine Begleiter";

  const renderTarget = (container, options = {}) => {
    const {
      allowUpgrades = false,
      showActions = true,
    } = options;

    container.innerHTML = "";
    if (!allies.length) {
      const empty = document.createElement("p");
      empty.className = "panel-copy";
      empty.textContent = "Noch keine verbündeten Schiffe.";
      container.appendChild(empty);
      return;
    }

    allies.forEach((ally) => {
      const card = document.createElement("div");
      card.className = "fleet-card";

      const heading = document.createElement("div");
      heading.className = "fleet-card-header";
      heading.innerHTML = `<strong>${ally.name}</strong><span>Lvl ${ally.upgradeLevel ?? 0}</span>`;

      const status = document.createElement("p");
      status.className = "panel-copy fleet-meta";
      const targetLabel = ally.targetIslandName ? `Ziel: ${ally.targetIslandName}` : "Ziel: Eskorte";
      status.textContent = `${Math.ceil(ally.hull)} / ${ally.maxHull} HP, ${ally.cannons} Kanonen, ${targetLabel}`;

      card.appendChild(heading);
      card.appendChild(status);

      if (showActions) {
        const actions = document.createElement("div");
        actions.className = "fleet-actions";

        const renameBtn = document.createElement("button");
        renameBtn.className = "ghost-button";
        renameBtn.type = "button";
        renameBtn.dataset.action = "rename-ally";
        renameBtn.dataset.allyId = ally.id;
        renameBtn.textContent = "Umbenennen";
        if (typeof ui.handleRenameAlly === "function") {
          renameBtn.addEventListener("click", () => ui.handleRenameAlly(ally.id));
        }
        actions.appendChild(renameBtn);

        const upgradeBtn = document.createElement("button");
        upgradeBtn.className = "action-button";
        upgradeBtn.type = "button";
        upgradeBtn.dataset.action = "upgrade-ally";
        upgradeBtn.dataset.allyId = ally.id;
        const cost = allyUpgradeCost(ally);
        upgradeBtn.textContent = `Verbessern (${cost} Gold)`;
        upgradeBtn.disabled = !allowUpgrades || game.player.gold < cost;
        if (typeof ui.handleUpgradeAlly === "function") {
          upgradeBtn.addEventListener("click", () => ui.handleUpgradeAlly(ally.id));
        }
        actions.appendChild(upgradeBtn);

        card.appendChild(actions);
      }

      container.appendChild(card);
    });
  };

  renderTarget(ui.fleetList, { showActions: false });
  renderTarget(ui.shipyardFleetList, { allowUpgrades: allowFleetUpgrades, showActions: true });
}
