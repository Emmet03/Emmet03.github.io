export function allyUpgradeCost(ally) {
  return 28 + (ally.upgradeLevel ?? 0) * 14;
}

export function renameAlly(game, allyId, newName) {
  const ally = game.allies.find((entry) => entry.id === allyId);
  if (!ally) {
    return { ok: false, tone: "danger", message: "Dieses Flottenschiff wurde nicht gefunden." };
  }

  const trimmed = newName.trim();
  if (!trimmed) {
    return { ok: false, tone: "danger", message: "Der neue Flottenname darf nicht leer sein." };
  }

  const previousName = ally.name;
  ally.name = trimmed;
  return {
    ok: true,
    tone: "success",
    message: `${previousName} segelt nun unter dem Namen ${ally.name}.`,
  };
}

export function upgradeAlly(game, allyId) {
  const ally = game.allies.find((entry) => entry.id === allyId);
  const nearbyIsland = game.islands.find((entry) => entry.id === game.nearIslandId);
  const shipyardModal = document.getElementById("shipyardModal");
  const shipyardOpen = Boolean(shipyardModal) && !shipyardModal.classList.contains("hidden");
  const atPirateIsland = !game.battle && (nearbyIsland?.kind === "pirate" || shipyardOpen);

  if (!ally) {
    return { ok: false, tone: "danger", message: "Dieses Flottenschiff wurde nicht gefunden." };
  }
  if (!atPirateIsland) {
    return { ok: false, tone: "danger", message: "Flotten-Upgrades sind nur im Piratenhafen möglich." };
  }

  const cost = allyUpgradeCost(ally);
  if (game.player.gold < cost) {
    return { ok: false, tone: "danger", message: `Nicht genug Gold für ${ally.name}.` };
  }

  game.player.gold -= cost;
  ally.upgradeLevel = (ally.upgradeLevel ?? 0) + 1;
  ally.maxHull += 10;
  ally.hull = Math.min(ally.maxHull, ally.hull + 8);
  ally.cannons += 1;
  ally.speed = Math.min(86, ally.speed + 4);

  return {
    ok: true,
    tone: "success",
    message: `${ally.name} wurde in der Werft verbessert.`,
  };
}

export function installFleetUi(game, ui, { log, refresh }) {
  ui.handleRenameAlly = (allyId) => {
    const ally = game.allies.find((entry) => entry.id === allyId);
    if (!ally) {
      log("Dieses Flottenschiff wurde nicht gefunden.", "danger");
      refresh();
      return;
    }

    const nextName = window.prompt("Neuer Name für das Flottenschiff:", ally.name);
    if (nextName === null) {
      return;
    }

    const result = renameAlly(game, allyId, nextName);
    log(result.message, result.tone);
    refresh();
  };

  ui.handleUpgradeAlly = (allyId) => {
    const result = upgradeAlly(game, allyId);
    log(result.message, result.tone);
    refresh();
  };
}
