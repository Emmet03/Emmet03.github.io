import { mapSize } from "./constants.js";
import { randomInt, clamp, normalizeAngle, cardinalDirection, playerShipSize } from "./utils.js";
import { addLog, updateHud, setSeaState } from "./ui.js";
import { startBattle, updateBattleUi } from "./battle.js";
import { spawnLootParticles, spawnRepairParticles } from "./particles.js";
import { notifyQuestEvent, renderQuestUi, handleQuestIslandInteraction } from "./quests.js";

export function islandStatusText(island) {
  const sizeLabel =
    island.radius >= 160 ? "Grosse Insel" :
    island.radius >= 120 ? "Mittlere Insel" :
    "Kleine Insel";

  if (island.kind === "pirate") {
    return `${sizeLabel}: Piratenhafen mit Werft und Schmugglern. Hier kannst du Gold in Upgrades investieren.`;
  }

  if (!island.plunderedAt) {
    return `${sizeLabel}: Die Kueste wirkt unbewacht. Mit E oder per Button kannst du einen schnellen Ueberfall wagen.`;
  }
  const elapsed = Date.now() - island.plunderedAt;
  if (elapsed > 35000) {
    return `${sizeLabel}: Neue Vorraete scheinen angekommen zu sein. Die Insel koennte wieder lohnend sein.`;
  }
  return `${sizeLabel}: Die Insel wurde kuerzlich gepluendert. Die Bewohner verstecken ihre Beute noch.`;
}

export function findNearbyIsland(game, ui) {
  const p = game.player;
  let found = null;
  for (const island of game.islands) {
    const distance = Math.hypot(p.x - island.x, p.y - island.y);
    if (distance < island.radius + 72) {
      found = island;
      break;
    }
  }
  game.nearIslandId = found ? found.id : null;
  if (found) {
    ui.islandName.textContent = found.name;
    ui.islandDescription.textContent = islandStatusText(found);
    ui.plunderBtn.disabled = found.kind === "pirate";
    ui.plunderBtn.textContent = found.kind === "pirate" ? "Werft mit E oeffnen" : "Pluendern";
    ui.islandCard.classList.remove("hidden");
  } else {
    ui.plunderBtn.disabled = false;
    ui.plunderBtn.textContent = "Pluendern";
    ui.islandCard.classList.add("hidden");
    ui.shipyardModal.classList.add("hidden");
  }

  if (found && found.kind !== "pirate") {
    ui.shipyardModal.classList.add("hidden");
  }
}

export function openNearbyIslandAction(game, ui) {
  const island = game.islands.find((entry) => entry.id === game.nearIslandId);
  if (!island) {
    plunderIsland(game, ui);
    return;
  }

  if (handleQuestIslandInteraction(game, ui, island)) {
    return;
  }

  if (island.kind === "pirate") {
    openShipyard(game, ui, island);
    notifyQuestEvent(game, ui, { type: "visit_harbor", harborId: island.id });
    return;
  }

  plunderIsland(game, ui);
}

export function plunderIsland(game, ui) {
  const island = game.islands.find((entry) => entry.id === game.nearIslandId);
  if (!island) {
    addLog(game, ui, "Keine Insel in Reichweite.", "danger");
    return;
  }

  if (island.kind === "pirate") {
    addLog(game, ui, `${island.name} ist ein Piratenhafen. Dort wird gehandelt, nicht gepluendert.`, "normal");
    return;
  }

  const recentlyPlundered = island.plunderedAt && Date.now() - island.plunderedAt < 35000;
  if (recentlyPlundered) {
    addLog(game, ui, `${island.name} hat im Moment kaum noch Vorraete.`, "danger");
    ui.islandDescription.textContent = islandStatusText(island);
    return;
  }

  const loot = {
    wood: randomInt(1, 3) + Math.floor(island.radius / 40),
    ammo: randomInt(2, 5) + Math.floor(island.radius / 45),
    gold: randomInt(10, 18) + Math.floor(island.radius / 6),
  };

  game.player.wood += loot.wood;
  game.player.ammo += loot.ammo;
  game.player.gold += loot.gold;
  game.player.fame += 1;
  island.plunderedAt = Date.now();
  spawnLootParticles(game, island.x, island.y, loot);
  notifyQuestEvent(game, ui, { type: "plunder", island });
  notifyQuestEvent(game, ui, { type: "collect_resource", resource: "wood", amount: loot.wood });
  notifyQuestEvent(game, ui, { type: "collect_resource", resource: "ammo", amount: loot.ammo });
  notifyQuestEvent(game, ui, { type: "collect_resource", resource: "gold", amount: loot.gold });

  addLog(game, ui, `${island.name} gepluendert: +${loot.wood} Holz, +${loot.ammo} Munition, +${loot.gold} Gold.`, "success");
  ui.islandDescription.textContent = islandStatusText(island);
  updateHud(game, ui);
}

export function updateWind(game, ui) {
  const now = Date.now();
  if (now < game.wind.nextShiftAt) {
    return;
  }

  const previousDirection = cardinalDirection(game.wind.angle);
  game.wind.angle = Math.random() * Math.PI * 2;
  game.wind.strength = randomInt(10, 22) / 100;
  game.wind.nextShiftAt = now + randomInt(14000, 24000);

  const nextDirection = cardinalDirection(game.wind.angle);
  addLog(game, ui, `Der Wind dreht von ${previousDirection} nach ${nextDirection}.`, "normal");
}

export function updateWeather(game, ui, dt) {
  const now = Date.now();
  if (now >= game.weather.nextShiftAt) {
    rotateWeather(game, ui);
  }

  if (game.weather.type === "thunder" && Math.random() < dt * 0.08) {
    game.weather.flashUntil = now + 180;
    if (Math.random() < 0.18) {
      const damage = randomInt(2, 6);
      game.player.hull = Math.max(1, game.player.hull - damage);
      addLog(game, ui, `Blitzschlag in der Naehe. ${damage} Schaden am Schiff!`, "danger");
      updateHud(game, ui);
    }
  }
}

export function updateEnemies(game, ui, dt) {
  const now = Date.now();
  const p = game.player;
  const safeHarbor = game.islands.some((island) => (
    island.kind === "pirate" && Math.hypot(p.x - island.x, p.y - island.y) < island.radius + 110
  ));
  const detectionRange = Math.min(280, game.weather.visibilityRange * 0.35);
  let nearbyType = null;

  for (const enemy of game.enemies) {
    if (enemy.inactiveUntil > now) {
      continue;
    }

    enemy.angle += (Math.random() - 0.5) * 0.8 * dt;
    enemy.x += Math.cos(enemy.angle) * enemy.speed * dt;
    enemy.y += Math.sin(enemy.angle) * enemy.speed * dt;

    if (enemy.x < 80 || enemy.x > mapSize.width - 80) {
      enemy.angle = Math.PI - enemy.angle;
      enemy.x = clamp(enemy.x, 80, mapSize.width - 80);
    }
    if (enemy.y < 80 || enemy.y > mapSize.height - 80) {
      enemy.angle = -enemy.angle;
      enemy.y = clamp(enemy.y, 80, mapSize.height - 80);
    }

    const distance = Math.hypot(enemy.x - p.x, enemy.y - p.y);
    if (distance < detectionRange) {
      if (enemy.kind === "hostile") {
        nearbyType = "hostile";
      } else if (nearbyType !== "hostile") {
        nearbyType = enemy.kind;
      }
    }
    if (!game.battle && !safeHarbor && distance < 90) {
      startBattle(game, ui, enemy);
      return;
    }
  }

  const seaState =
    nearbyType === "hostile" ? "Feindliche Segel am Horizont" :
    nearbyType === "merchant" ? "Haendlerschiff in Sicht" :
    nearbyType === "civilian" ? "Ziviles Schiff in Sicht" :
    "Ruhige Gewaesser";
  setSeaState(game, ui, seaState);
}

export function updatePlayer(game, ui, canvas, keys, dt) {
  if (game.battle) {
    return;
  }

  const p = game.player;
  const turnSpeed = 2.8 * game.weather.steeringFactor;
  const accel = 80;
  const thrustDrag = 0.992;
  const idleDrag = 0.985;
  const baseMaxSpeed = 135;
  let thrust = 0;

  updateWind(game, ui);
  updateWeather(game, ui, dt);

  if (keys.has("ArrowLeft") || keys.has("a")) {
    p.angle -= turnSpeed * dt;
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    p.angle += turnSpeed * dt;
  }
  if (keys.has("ArrowUp") || keys.has("w")) {
    thrust = 1;
  }
  if (keys.has("ArrowDown") || keys.has("s")) {
    thrust = -0.5;
  }

  const windAlignment = Math.cos(normalizeAngle(p.angle - game.wind.angle));
  const windBoost = thrust > 0 ? Math.max(0, windAlignment) * game.wind.strength : 0;
  const headwindPenalty = thrust > 0 ? Math.max(0, -windAlignment) * 0.18 : 0;
  const zoneWindBoost = zoneBonus(game, "tailwind", p.x, p.y) ? 0.18 : 0;
  const effectiveAccel = accel * (1 + windBoost - headwindPenalty + zoneWindBoost) * p.sailSpeedBonus * game.weather.accelFactor;
  const maxSpeed = baseMaxSpeed * (1 + windBoost * 0.65) * p.sailSpeedBonus;
  const windCurrent = (7 + game.wind.strength * 26) * game.weather.driftFactor;
  const currentZone = zoneBonus(game, "current", p.x, p.y);

  p.speed += thrust * effectiveAccel * dt;
  p.speed *= Math.pow(thrust !== 0 ? thrustDrag : idleDrag, dt * 60);
  p.speed = clamp(p.speed, -40, maxSpeed);

  p.driftX += Math.cos(game.wind.angle) * windCurrent * dt * 0.18;
  p.driftY += Math.sin(game.wind.angle) * windCurrent * dt * 0.18;
  if (currentZone) {
    p.driftX += Math.cos(currentZone.angle) * currentZone.strength * dt;
    p.driftY += Math.sin(currentZone.angle) * currentZone.strength * dt;
  }
  p.driftX *= Math.pow(0.989, dt * 60);
  p.driftY *= Math.pow(0.989, dt * 60);

  const movementX = Math.cos(p.angle) * p.speed + p.driftX;
  const movementY = Math.sin(p.angle) * p.speed + p.driftY;

  p.x += movementX * dt;
  p.y += movementY * dt;
  p.x = clamp(p.x, 60, mapSize.width - 60);
  p.y = clamp(p.y, 60, mapSize.height - 60);

  resolveIslandCollision(game);

  game.camera.x = clamp(p.x - canvas.width / 2, 0, mapSize.width - canvas.width);
  game.camera.y = clamp(p.y - canvas.height / 2, 0, mapSize.height - canvas.height);

  findNearbyIsland(game, ui);
  updateEnemies(game, ui, dt);
}

export function repairAtSea(game, ui) {
  const player = game.player;
  if (game.battle) {
    addLog(game, ui, "Mitten im Gefecht geht das nur als Kampfaktion.", "danger");
    return;
  }
  if (player.wood < 1) {
    addLog(game, ui, "Kein Holz an Bord fuer Reparaturen.", "danger");
    return;
  }
  if (player.hull >= player.maxHull) {
    addLog(game, ui, "Der Rumpf ist bereits vollstaendig repariert.", "normal");
    return;
  }

  player.wood -= 1;
  const repair = randomInt(14, 24);
  player.hull = Math.min(player.maxHull, player.hull + repair);
  spawnRepairParticles(game, player.x, player.y - 20, repair);
  addLog(game, ui, `Die Crew repariert auf See ${repair} Huellenpunkte.`, "success");
  updateHud(game, ui);
  updateBattleUi(game, ui);
}

export function applyUpgrade(game, ui, type) {
  const player = game.player;
  const nearbyIsland = game.islands.find((entry) => entry.id === game.nearIslandId);
  const atPirateIsland = nearbyIsland?.kind === "pirate" && !game.battle;

  if (!atPirateIsland) {
    addLog(game, ui, "Fuer Upgrades musst du an einer Pirateninsel anlegen.", "danger");
    updateHud(game, ui);
    return;
  }

  if (type === "hull" && player.gold >= 45) {
    player.gold -= 45;
    player.maxHull += 12;
    player.hull = Math.min(player.maxHull, player.hull + 12);
    upgradeTier(game);
    addLog(game, ui, "Die Werft verstaerkt den Rumpf.", "success");
  }
  if (type === "cannons" && player.gold >= 60) {
    player.gold -= 60;
    player.cannons += 1;
    upgradeTier(game);
    addLog(game, ui, "Neue Kanonen wurden an Deck montiert.", "success");
  }
  if (type === "sails" && player.gold >= 55) {
    player.gold -= 55;
    player.sailLevel += 1;
    player.sailSpeedBonus = 1 + player.sailLevel * 0.08;
    upgradeTier(game);
    addLog(game, ui, `Die Segel werden verbessert. Fahrtbonus liegt jetzt bei ${Math.round((player.sailSpeedBonus - 1) * 100)}%.`, "success");
  }
  if (type === "ammo" && player.gold >= 20) {
    player.gold -= 20;
    player.ammo += 8;
    addLog(game, ui, "Pulverkammer nachgefuellt.", "success");
  }
  updateHud(game, ui);
  updateBattleUi(game, ui);
  renderQuestUi(game, ui);
}

export function openShipyard(game, ui, island) {
  ui.shipyardTitle.textContent = island.name;
  ui.shipyardDescription.textContent = `${island.name} ist ein sicherer Piratenhafen. Hier greifen dich andere Schiffe nicht an.`;
  ui.shipyardModal.classList.remove("hidden");
  updateHud(game, ui);
  renderQuestUi(game, ui);
}

export function closeShipyard(ui) {
  ui.shipyardModal.classList.add("hidden");
}

function resolveIslandCollision(game) {
  const player = game.player;
  const shipRadius = Math.max(28, playerShipSize(player) * 0.26);

  for (const island of game.islands) {
    const dx = player.x - island.x;
    const dy = player.y - island.y;
    const distance = Math.hypot(dx, dy) || 0.001;
    const collisionRadius = island.radius * 0.5 + shipRadius;

    if (distance >= collisionRadius) {
      continue;
    }

    const overlap = collisionRadius - distance;
    const normalX = dx / distance;
    const normalY = dy / distance;

    player.x += normalX * overlap;
    player.y += normalY * overlap;
    player.speed *= 0.72;
    player.driftX *= 0.45;
    player.driftY *= 0.45;

    if (Math.cos(player.angle) * normalX + Math.sin(player.angle) * normalY < -0.1) {
      player.speed *= 0.4;
    }
  }
}

export function upgradeTier(game) {
  const score = game.player.maxHull + game.player.cannons * 16 + game.player.sailLevel * 10;
  if (score > 190) {
    game.player.tier = "Man O' War";
  } else if (score > 155) {
    game.player.tier = "Brigantine";
  } else if (score > 125) {
    game.player.tier = "Cutter";
  } else {
    game.player.tier = "Sloop";
  }
}

function rotateWeather(game, ui) {
  const choices = [
    {
      type: "clear",
      label: "Klares Wetter",
      description: "Ruhige See und gute Sicht.",
      visibilityRange: 99999,
      steeringFactor: 1,
      accelFactor: 1,
      driftFactor: 1,
      overlayAlpha: 0,
      zone: null,
    },
    {
      type: "storm",
      label: "Sturmfront",
      description: "Starke Drift und schlechtere Steuerung.",
      visibilityRange: 980,
      steeringFactor: 0.82,
      accelFactor: 0.88,
      driftFactor: 1.7,
      overlayAlpha: 0.08,
      zone: null,
    },
    {
      type: "fog",
      label: "Dichter Nebel",
      description: "Inseln und Schiffe tauchen erst spaet aus dem Dunst auf.",
      visibilityRange: 620,
      steeringFactor: 1,
      accelFactor: 1,
      driftFactor: 1,
      overlayAlpha: 0.18,
      zone: null,
    },
    {
      type: "rain",
      label: "Schwerer Regen",
      description: "Regen drueckt die Stimmung und verringert die Sicht leicht.",
      visibilityRange: 1180,
      steeringFactor: 0.95,
      accelFactor: 0.97,
      driftFactor: 1.08,
      overlayAlpha: 0.1,
      zone: null,
    },
    {
      type: "thunder",
      label: "Gewitter",
      description: "Seltene Blitze bedrohen die Crew auf offener See.",
      visibilityRange: 980,
      steeringFactor: 0.9,
      accelFactor: 0.92,
      driftFactor: 1.25,
      overlayAlpha: 0.14,
      zone: null,
    },
    {
      type: "current",
      label: "Starke Stroemung",
      description: "Eine regionale Stroemung zieht das Schiff seitlich mit.",
      visibilityRange: 99999,
      steeringFactor: 1,
      accelFactor: 1,
      driftFactor: 1,
      overlayAlpha: 0.03,
      zone: createZone("current"),
    },
    {
      type: "tailwind",
      label: "Rueckenwind-Zone",
      description: "Eine guenstige Windzone bringt extra Tempo.",
      visibilityRange: 99999,
      steeringFactor: 1,
      accelFactor: 1,
      driftFactor: 1,
      overlayAlpha: 0.02,
      zone: createZone("tailwind"),
    },
  ];

  const next = choices[randomInt(0, choices.length - 1)];
  Object.assign(game.weather, next, {
    nextShiftAt: Date.now() + randomInt(18000, 32000),
    flashUntil: 0,
  });
  addLog(game, ui, `Wetterwechsel: ${game.weather.label}.`, "normal");
  updateHud(game, ui);
}

function createZone(type) {
  return {
    type,
    x: randomInt(420, mapSize.width - 420),
    y: randomInt(420, mapSize.height - 420),
    radius: randomInt(220, 420),
    angle: Math.random() * Math.PI * 2,
    strength: type === "current" ? randomInt(16, 28) : randomInt(10, 18),
  };
}

function zoneBonus(game, type, x, y) {
  const zone = game.weather.zone;
  if (!zone || zone.type !== type) {
    return null;
  }
  return Math.hypot(x - zone.x, y - zone.y) <= zone.radius ? zone : null;
}
