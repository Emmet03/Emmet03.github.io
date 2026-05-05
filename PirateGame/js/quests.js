import { randomInt } from "./utils.js";
import { addLog, updateHud } from "./ui.js";

export function initializeQuestBoard(game) {
  game.quests = {
    offers: createQuestOffers(game, null),
    active: null,
  };
}

export function createQuestOffers(game, harborId) {
  const factories = [
    createGoldDeliveryQuest,
    createPlunderQuest,
    createWarshipQuest,
    createCaptainQuest,
    createGatherDeliveryQuest,
    createMessageQuest,
  ];

  return factories
    .map((factory) => factory(game, harborId))
    .filter(Boolean)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

export function renderQuestUi(game, ui) {
  const active = game.quests?.active;
  const offer = game.quests?.offers?.[0];

  if (active?.type === "gold_delivery") {
    active.currentGold = game.player.gold;
  }

  ui.activeQuestTitle.textContent = active ? active.title : "Kein Auftrag aktiv";
  ui.activeQuestDescription.textContent = active ? describeQuest(active) : "Im Piratenhafen kannst du einen Auftrag annehmen.";
  ui.activeQuestProgress.textContent = active ? progressText(active) : "Noch kein Fortschritt";

  ui.questOfferTitle.textContent = offer ? offer.title : "Keine Vertraege verfuegbar";
  ui.questOfferDescription.textContent = offer ? describeQuest(offer) : "Schau spaeter wieder vorbei.";

  ui.acceptQuestBtn.disabled = !offer || Boolean(active);
  ui.rerollQuestBtn.disabled = Boolean(active);
  ui.completeQuestBtn.disabled = !canTurnInActiveQuest(game);
}

export function acceptQuest(game, ui) {
  const offer = game.quests?.offers?.[0];
  if (!offer || game.quests.active) {
    return;
  }

  game.quests.active = structuredClone(offer);
  if (game.quests.active.type === "captain_hunt") {
    assignCaptainTarget(game, game.quests.active);
  }

  addLog(game, ui, `Neuer Auftrag: ${game.quests.active.title}`, "success");
  game.quests.offers = createQuestOffers(game, game.nearIslandId);
  renderQuestUi(game, ui);
  updateHud(game, ui);
}

export function rerollQuestOffers(game, ui) {
  game.quests.offers = createQuestOffers(game, game.nearIslandId);
  addLog(game, ui, "Die Schmuggler bieten neue Vertraege an.", "normal");
  renderQuestUi(game, ui);
}

export function tryTurnInQuest(game, ui) {
  if (!canTurnInActiveQuest(game)) {
    return false;
  }

  const quest = game.quests.active;
  if (quest.type === "gold_delivery") {
    game.player.gold -= quest.required;
  }
  if (quest.type === "gather_delivery") {
    game.player[quest.resource] = Math.max(0, game.player[quest.resource] - Math.min(game.player[quest.resource], quest.required));
  }

  game.player.gold += quest.reward.gold;
  game.player.wood += quest.reward.wood;
  game.player.ammo += quest.reward.ammo;
  game.player.fame += quest.reward.fame;

  addLog(game, ui, `Auftrag abgeschlossen: ${quest.title}.`, "success");
  addLog(game, ui, `Belohnung: +${quest.reward.gold} Gold, +${quest.reward.wood} Holz, +${quest.reward.ammo} Munition.`, "success");
  game.quests.active = null;
  game.quests.offers = createQuestOffers(game, game.nearIslandId);
  renderQuestUi(game, ui);
  updateHud(game, ui);
  return true;
}

export function handleQuestIslandInteraction(game, ui, island) {
  const quest = game.quests?.active;
  if (!quest) {
    return false;
  }

  if (quest.type === "message_run") {
    if (!quest.pickedUp && island.id === quest.sourceIslandId) {
      quest.pickedUp = true;
      addLog(game, ui, `Die Nachricht wurde auf ${island.name} aufgenommen.`, "success");
      renderQuestUi(game, ui);
      return true;
    }
    if (quest.pickedUp && island.id === quest.destinationIslandId) {
      quest.completed = true;
      addLog(game, ui, `Die Nachricht wurde auf ${island.name} uebergeben. Kehre zum Piratenhafen zurueck oder kassiere spaeter neue Vertraege.`, "success");
      renderQuestUi(game, ui);
      return true;
    }
  }

  return false;
}

export function notifyQuestEvent(game, ui, event) {
  const quest = game.quests?.active;
  if (!quest) {
    return;
  }

  if (quest.type === "plunder_islands" && event.type === "plunder" && quest.targetIslandIds.includes(event.island.id)) {
    quest.completedIds = Array.from(new Set([...(quest.completedIds ?? []), event.island.id]));
    quest.completed = quest.completedIds.length >= quest.targetIslandIds.length;
  }

  if (quest.type === "sink_warship" && event.type === "sink_ship" && event.enemy.kind === "hostile" && event.enemy.shipClass === "warship") {
    quest.kills = (quest.kills ?? 0) + 1;
    quest.completed = quest.kills >= quest.required;
  }

  if (quest.type === "captain_hunt" && event.type === "sink_ship" && event.enemy.id === quest.targetEnemyId) {
    quest.completed = true;
  }

  if (quest.type === "gather_delivery" && event.type === "collect_resource") {
    if (event.resource === quest.resource) {
      quest.progress = Math.min(quest.required, (quest.progress ?? 0) + event.amount);
      quest.completed = quest.progress >= quest.required;
    }
  }

  if (quest.type === "gold_delivery" && event.type === "visit_harbor" && event.harborId === quest.targetHarborId && game.player.gold >= quest.required) {
    quest.completed = true;
  }

  if (quest.type === "gather_delivery" && event.type === "visit_harbor" && event.harborId === quest.targetHarborId && (quest.progress ?? 0) >= quest.required) {
    quest.completed = true;
  }

  renderQuestUi(game, ui);
}

export function canTurnInActiveQuest(game) {
  const quest = game.quests?.active;
  if (!quest) {
    return false;
  }

  const currentIsland = game.islands.find((entry) => entry.id === game.nearIslandId);
  const atPirateHarbor = currentIsland?.kind === "pirate";

  if (quest.type === "message_run") {
    return quest.completed && atPirateHarbor;
  }
  if (quest.type === "plunder_islands" || quest.type === "sink_warship" || quest.type === "captain_hunt") {
    return quest.completed && atPirateHarbor;
  }
  if (quest.type === "gold_delivery") {
    return atPirateHarbor && currentIsland.id === quest.targetHarborId && game.player.gold >= quest.required;
  }
  if (quest.type === "gather_delivery") {
    return atPirateHarbor && currentIsland.id === quest.targetHarborId && (quest.progress ?? 0) >= quest.required;
  }
  return false;
}

function describeQuest(quest) {
  if (quest.type === "gold_delivery") {
    return `Bringe ${quest.required} Gold nach ${quest.targetHarborName}.`;
  }
  if (quest.type === "plunder_islands") {
    return `Pluendere ${quest.targetIslandNames.join(" und ")}.`;
  }
  if (quest.type === "sink_warship") {
    return `Versenke ${quest.required} feindliches Kriegsschiff.`;
  }
  if (quest.type === "captain_hunt") {
    return `Jage ${quest.targetName}, den Schrecken der See.`;
  }
  if (quest.type === "gather_delivery") {
    return `Sammle ${quest.required} ${resourceLabel(quest.resource)} und liefere sie nach ${quest.targetHarborName}.`;
  }
  if (quest.type === "message_run") {
    return `Hole eine geheime Nachricht von ${quest.sourceIslandName} und bringe sie nach ${quest.destinationIslandName}.`;
  }
  return quest.title;
}

function progressText(quest) {
  if (quest.type === "gold_delivery") {
    return `An Bord: ${quest.currentGold ?? 0} / ${quest.required} Gold`;
  }
  if (quest.type === "plunder_islands") {
    return `Gepluendert: ${(quest.completedIds ?? []).length} / ${quest.targetIslandIds.length}`;
  }
  if (quest.type === "sink_warship") {
    return `Versenkt: ${quest.kills ?? 0} / ${quest.required}`;
  }
  if (quest.type === "captain_hunt") {
    return quest.completed ? "Das Ziel ist versenkt" : `Gesucht: ${quest.targetName}`;
  }
  if (quest.type === "gather_delivery") {
    return `Gesammelt: ${quest.progress ?? 0} / ${quest.required} ${resourceLabel(quest.resource)}`;
  }
  if (quest.type === "message_run") {
    if (!quest.pickedUp) {
      return `Nachricht noch nicht abgeholt: ${quest.sourceIslandName}`;
    }
    return quest.completed ? "Nachricht uebergeben" : `Bringe die Nachricht nach ${quest.destinationIslandName}`;
  }
  return "";
}

function createGoldDeliveryQuest(game, harborId) {
  const harbors = pirateHarbors(game).filter((entry) => entry.id !== harborId);
  if (harbors.length === 0) {
    return null;
  }
  const target = harbors[randomInt(0, harbors.length - 1)];
  return {
    id: `gold-${target.id}`,
    type: "gold_delivery",
    title: "Schmugglerkasse",
    targetHarborId: target.id,
    targetHarborName: target.name,
    required: randomInt(55, 110),
    reward: rewardPack(36, 72, 2),
  };
}

function createPlunderQuest(game) {
  const wild = game.islands.filter((entry) => entry.kind === "wild");
  if (wild.length < 2) {
    return null;
  }
  const shuffled = [...wild].sort(() => Math.random() - 0.5).slice(0, 2);
  return {
    id: `plunder-${shuffled.map((entry) => entry.id).join("-")}`,
    type: "plunder_islands",
    title: "Zwei schnelle Ueberfaelle",
    targetIslandIds: shuffled.map((entry) => entry.id),
    targetIslandNames: shuffled.map((entry) => entry.name),
    completedIds: [],
    reward: rewardPack(44, 82, 2),
  };
}

function createWarshipQuest() {
  return {
    id: `warship-${randomInt(100, 999)}`,
    type: "sink_warship",
    title: "Kriegsschiff jagen",
    required: 1,
    kills: 0,
    reward: rewardPack(52, 88, 3),
  };
}

function createCaptainQuest() {
  const captainNames = ["Captain Blackwake", "Captain Rotzahn", "Captain Vane", "Captain Moorcliff"];
  const targetName = captainNames[randomInt(0, captainNames.length - 1)];
  return {
    id: `captain-${targetName}`,
    type: "captain_hunt",
    title: "Kopfgeldjagd",
    targetName,
    targetEnemyId: null,
    completed: false,
    reward: rewardPack(70, 110, 4),
  };
}

function createGatherDeliveryQuest(game, harborId) {
  const harbors = pirateHarbors(game).filter((entry) => entry.id !== harborId);
  if (harbors.length === 0) {
    return null;
  }
  const target = harbors[randomInt(0, harbors.length - 1)];
  const resource = ["wood", "ammo", "gold"][randomInt(0, 2)];
  const required = resource === "gold" ? randomInt(70, 110) : randomInt(8, 16);
  return {
    id: `gather-${resource}-${target.id}`,
    type: "gather_delivery",
    title: "Vorratslauf",
    resource,
    required,
    progress: 0,
    targetHarborId: target.id,
    targetHarborName: target.name,
    reward: rewardPack(40, 76, 2),
  };
}

function createMessageQuest(game) {
  const islands = game.islands.filter((entry) => entry.kind === "wild");
  if (islands.length < 2) {
    return null;
  }
  const [source, destination] = [...islands].sort(() => Math.random() - 0.5).slice(0, 2);
  return {
    id: `message-${source.id}-${destination.id}`,
    type: "message_run",
    title: "Geheime Nachricht",
    sourceIslandId: source.id,
    sourceIslandName: source.name,
    destinationIslandId: destination.id,
    destinationIslandName: destination.name,
    pickedUp: false,
    completed: false,
    reward: rewardPack(38, 70, 2),
  };
}

function pirateHarbors(game) {
  return game.islands.filter((entry) => entry.kind === "pirate");
}

function rewardPack(minGold, maxGold, fame) {
  return {
    gold: randomInt(minGold, maxGold),
    wood: randomInt(1, 4),
    ammo: randomInt(2, 6),
    fame,
  };
}

function resourceLabel(resource) {
  if (resource === "wood") {
    return "Holz";
  }
  if (resource === "ammo") {
    return "Munition";
  }
  return "Gold";
}

function assignCaptainTarget(game, quest) {
  const hostile = game.enemies.filter((enemy) => enemy.kind === "hostile");
  if (hostile.length === 0) {
    return;
  }
  const target = hostile[randomInt(0, hostile.length - 1)];
  target.name = quest.targetName;
  target.shipClass = "captain";
  target.maxHull += 22;
  target.cannons += 1;
  quest.targetEnemyId = target.id;
}
