import { spawnEnemy } from "./state.js";
import { randomInt, clamp } from "./utils.js";
import { addLog, updateHud, setSeaState, showGameOver } from "./ui.js";
import { findNearbyIsland } from "./world.js";
import { mapSize } from "./constants.js";
import { spawnLootParticles } from "./particles.js";
import { notifyQuestEvent } from "./quests.js";

export function startBattle(game, ui, enemyRef) {
  const player = game.player;
  player.braceActive = false;

  const enemySource = enemyRef ?? spawnEnemy(999, player.x + 140, player.y + 140);
  const battleProfile = createBattleProfile(enemySource, player.fame);

  game.battle = {
    enemy: {
      id: enemySource.id,
      name: enemySource.name,
      kind: enemySource.kind ?? "hostile",
      shipClass: enemySource.shipClass ?? "raider",
      hull: battleProfile.maxHull,
      maxHull: battleProfile.maxHull,
      cannons: battleProfile.cannons,
      reward: battleProfile.reward,
    },
    enemyRef: enemyRef ?? null,
    turn: "player",
    message: battleIntroMessage(enemySource),
    locked: false,
  };

  setSeaState(game, ui, enemySource.kind === "hostile" ? "Feindlicher Kontakt" : "Schiff in Reichweite");
  addLog(game, ui, `Begegnung mit ${game.battle.enemy.name}.`, enemySource.kind === "hostile" ? "danger" : "normal");
  ui.shipyardModal.classList.add("hidden");
  ui.battleModal.classList.remove("hidden");
  updateBattleUi(game, ui);
}

export function updateBattleUi(game, ui) {
  if (!game.battle) {
    ui.battleModal.classList.add("hidden");
    return;
  }

  const { enemy, turn, message, locked } = game.battle;
  const player = game.player;

  ui.enemyName.textContent = enemy.name;
  ui.battleTurnLabel.textContent = turn === "player" ? "Dein Zug" : "Gegner am Zug";
  ui.battleMessage.textContent = message;
  ui.playerBattleShip.src = "textures/ship(pointetRight).png";
  ui.enemyBattleShip.src = "textures/ship(pointetRight).png";
  ui.playerBattleStats.textContent = `${Math.ceil(player.hull)} / ${player.maxHull} HP`;
  ui.enemyBattleStats.textContent = `${Math.ceil(enemy.hull)} / ${enemy.maxHull} HP`;
  ui.playerHpBar.style.width = `${clamp((player.hull / player.maxHull) * 100, 0, 100)}%`;
  ui.enemyHpBar.style.width = `${clamp((enemy.hull / enemy.maxHull) * 100, 0, 100)}%`;
  ui.battleRiskLabel.textContent = battleRiskLabel(player, enemy);
  ui.battleRewardPreview.textContent = battleRewardPreview(enemy);

  document.querySelectorAll(".battle-action").forEach((button) => {
    button.disabled = turn !== "player" || locked;
  });
}

export function resolveBattleAction(game, ui, action) {
  const battle = game.battle;
  if (!battle || battle.turn !== "player" || battle.locked) {
    return;
  }

  const player = game.player;
  const enemy = battle.enemy;
  battle.locked = true;
  player.braceActive = false;

  if (action === "broadside") {
    if (player.ammo <= 0) {
      battle.message = "Keine Munition mehr. Die Breitseite bleibt stumm.";
      battle.locked = false;
      updateBattleUi(game, ui);
      return;
    }
    player.ammo -= 1;
    const damage = randomInt(12, 20) + player.cannons * 4;
    enemy.hull = Math.max(0, enemy.hull - damage);
    battle.message = `Deine Breitseite trifft und verursacht ${damage} Schaden.`;
  }

  if (action === "repair") {
    if (player.wood <= 0) {
      battle.message = "Kein Holz an Bord. Reparaturen sind unmoeglich.";
      battle.locked = false;
      updateBattleUi(game, ui);
      return;
    }
    player.wood -= 1;
    const repair = randomInt(12, 20);
    player.hull = Math.min(player.maxHull, player.hull + repair);
    battle.message = `Die Mannschaft flickt den Rumpf und stellt ${repair} HP wieder her.`;
  }

  if (action === "brace") {
    player.braceActive = true;
    battle.message = "Die Crew geht in Deckung. Der naechste Treffer wird abgeschwaecht.";
  }

  if (action === "flee") {
    const escapeChance = 0.45 + Math.min(0.25, player.fame * 0.02);
    if (Math.random() < escapeChance) {
      battle.message = "Du nutzt Wind und Gischt und entkommst.";
      updateBattleUi(game, ui);
      endBattle(game, ui, "fled");
      return;
    }
    battle.message = "Die Flucht misslingt. Der Gegner bleibt dran.";
  }

  updateHud(game, ui);
  updateBattleUi(game, ui);

  if (enemy.hull <= 0) {
    endBattle(game, ui, "won");
    return;
  }

  battle.turn = "enemy";
  updateBattleUi(game, ui);
  window.setTimeout(() => enemyTurn(game, ui), 900);
}

export function enemyTurn(game, ui) {
  const battle = game.battle;
  if (!battle) {
    return;
  }

  const player = game.player;
  const enemy = battle.enemy;

  if (enemy.kind === "civilian") {
    battle.message = `${enemy.name} geraet in Panik und versucht nur zu entkommen.`;
    battle.turn = "player";
    battle.locked = false;
    updateHud(game, ui);
    updateBattleUi(game, ui);
    return;
  }

  let damage = randomInt(8, 15) + enemy.cannons * 4;
  if (enemy.kind === "merchant") {
    damage = Math.max(0, Math.floor(damage * 0.45));
    if (damage === 0 || Math.random() < 0.45) {
      battle.message = `${enemy.name} feuert hektisch, richtet aber keinen Schaden an.`;
      battle.turn = "player";
      battle.locked = false;
      updateHud(game, ui);
      updateBattleUi(game, ui);
      return;
    }
  }

  if (player.braceActive) {
    damage = Math.floor(damage * 0.55);
  }

  player.hull = Math.max(0, player.hull - damage);
  battle.message = `${enemy.name} feuert zurueck und verursacht ${damage} Schaden.`;
  player.braceActive = false;

  if (player.hull <= 0) {
    updateHud(game, ui);
    updateBattleUi(game, ui);
    endBattle(game, ui, "lost");
    return;
  }

  battle.turn = "player";
  battle.locked = false;
  updateHud(game, ui);
  updateBattleUi(game, ui);
}

export function endBattle(game, ui, result) {
  const battle = game.battle;
  if (!battle) {
    return;
  }

  const enemyName = battle.enemy.name;
  if (battle.enemyRef) {
    battle.enemyRef.inactiveUntil = Date.now() + 15000;
    battle.enemyRef.hull = battle.enemy.maxHull;
    battle.enemyRef.maxHull = battle.enemy.maxHull;
    battle.enemyRef.cannons = battle.enemy.cannons;
    battle.enemyRef.x = randomInt(180, mapSize.width - 180);
    battle.enemyRef.y = randomInt(180, mapSize.height - 180);
    battle.enemyRef.angle = Math.random() * Math.PI * 2;
  }

  if (result === "won") {
    const reward = battle.enemy.reward;
    const gold = randomInt(reward.goldMin, reward.goldMax);
    const wood = randomInt(reward.woodMin, reward.woodMax);
    const ammo = randomInt(reward.ammoMin, reward.ammoMax);
    game.player.gold += gold;
    game.player.wood += wood;
    game.player.ammo += ammo;
    game.player.fame += reward.fame;
    spawnLootParticles(game, game.player.x, game.player.y - 34, { gold, wood, ammo });
    notifyQuestEvent(game, ui, { type: "sink_ship", enemy: battle.enemy });
    notifyQuestEvent(game, ui, { type: "collect_resource", resource: "wood", amount: wood });
    notifyQuestEvent(game, ui, { type: "collect_resource", resource: "ammo", amount: ammo });
    notifyQuestEvent(game, ui, { type: "collect_resource", resource: "gold", amount: gold });
    addLog(game, ui, `${enemyName} versenkt: +${gold} Gold, +${wood} Holz, +${ammo} Munition.`, "success");
    setSeaState(game, ui, reward.seaState);
  } else if (result === "lost") {
    game.gameOver = true;
    addLog(game, ui, `Von ${enemyName} besiegt. Deine Reise endet hier.`, "danger");
    setSeaState(game, ui, "Das Meer hat dich verschlungen");
    showGameOver(ui, `${enemyName} hat dein Schiff versenkt. Dein letzter Ruf lag bei ${game.player.fame}.`);
  } else if (result === "fled") {
    addLog(game, ui, `Du entkommst ${enemyName} im Nebel.`, "normal");
    setSeaState(game, ui, "Verfolgung abgeschuettelt");
  }

  game.battle = null;
  updateHud(game, ui);
  updateBattleUi(game, ui);
  findNearbyIsland(game, ui);
}

function createBattleProfile(enemySource, fame) {
  const kind = enemySource.kind ?? "hostile";
  const shipClass = enemySource.shipClass ?? "raider";
  if (kind === "merchant") {
    return {
      maxHull: enemySource.maxHull + fame * 3,
      cannons: Math.max(0, enemySource.cannons),
      reward: {
        goldMin: 28,
        goldMax: 54,
        woodMin: 1,
        woodMax: 3,
        ammoMin: 1,
        ammoMax: 4,
        fame: 1,
        seaState: "Beute aus einem Haendler",
      },
    };
  }

  if (kind === "civilian") {
    return {
      maxHull: enemySource.maxHull + fame * 2,
      cannons: 0,
      reward: {
        goldMin: 8,
        goldMax: 22,
        woodMin: 0,
        woodMax: 2,
        ammoMin: 0,
        ammoMax: 2,
        fame: 0,
        seaState: "Ein ziviles Schiff ueberrumpelt",
      },
    };
  }

  return {
    maxHull: enemySource.maxHull + fame * 8 + (shipClass === "warship" ? 18 : 0) + (shipClass === "captain" ? 26 : 0),
    cannons: enemySource.cannons + Math.floor(fame / 3) + (shipClass === "captain" ? 1 : 0),
    reward: {
      goldMin: shipClass === "captain" ? 58 : 20,
      goldMax: shipClass === "captain" ? 96 : 44,
      woodMin: 1,
      woodMax: 4,
      ammoMin: 2,
      ammoMax: 6,
      fame: shipClass === "captain" ? 4 : 2,
      seaState: shipClass === "captain" ? "Ein beruechtigter Kapitaen faellt" : "Sieg auf offener See",
    },
  };
}

function battleIntroMessage(enemySource) {
  if (enemySource.kind === "merchant") {
    return "Ein Haendlerschiff versucht auszuweichen und bereitet nur eine schwache Verteidigung vor.";
  }
  if (enemySource.kind === "civilian") {
    return "Ein ziviles Schiff geraet in Panik. Es kann sich kaum wehren.";
  }
  return "Ein feindliches Schiff kreuzt deinen Kurs.";
}

function battleRiskLabel(player, enemy) {
  const playerPower = player.hull + player.cannons * 18 + player.sailLevel * 8;
  const enemyPower = enemy.hull + enemy.cannons * 20;
  const ratio = playerPower / Math.max(1, enemyPower);

  if (ratio > 1.4) {
    return "Gute Chancen auf Sieg";
  }
  if (ratio > 1.05) {
    return "Leichter Vorteil fuer dich";
  }
  if (ratio > 0.8) {
    return "Riskanter, aber machbar";
  }
  return "Gefaehrlicher Kampf";
}

function battleRewardPreview(enemy) {
  if (enemy.kind === "merchant") {
    return "Reiche Beute, aber wenig Gegenwehr";
  }
  if (enemy.kind === "civilian") {
    return "Kleine Beute, kaum Gefahr";
  }
  return "Standardbeute, dafuer harte Gegenwehr";
}
