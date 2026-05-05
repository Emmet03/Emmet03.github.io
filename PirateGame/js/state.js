import { encounterNames, islandNamePrefixes, islandNameSuffixes, mapSize } from "./constants.js";
import { randomInt } from "./utils.js";

export function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

export function createTextures() {
  return {
    sea: loadImage("textures/sea_repeat.png"),
    island: loadImage("textures/island.png"),
    pirateIsland: loadImage("textures/pirateisland.png"),
    ship: loadImage("textures/ship(pointetRight).png"),
  };
}

export function createIslands() {
  const islands = [];
  const islandCount = 12;
  const pirateCount = 3;

  for (let id = 1; id <= islandCount; id += 1) {
    const kind = id <= pirateCount ? "pirate" : "wild";
    const radius = kind === "pirate" ? randomInt(108, 152) : randomInt(82, 176);
    const placed = placeIsland(id, kind, radius, islands);
    if (placed) {
      islands.push(placed);
    }
  }

  if (islands.length > 0) {
    const startIsland = islands.reduce((best, current) => (
      current.x + current.y < best.x + best.y ? current : best
    ), islands[0]);
    startIsland.x = 420;
    startIsland.y = 320;
  }

  return islands;
}

export function createWindState() {
  return {
    angle: Math.random() * Math.PI * 2,
    strength: randomInt(10, 22) / 100,
    nextShiftAt: Date.now() + randomInt(14000, 24000),
  };
}

export function createWeatherState() {
  return {
    type: "clear",
    label: "Klares Wetter",
    description: "Ruhige See und gute Sicht.",
    visibilityRange: 99999,
    steeringFactor: 1,
    accelFactor: 1,
    driftFactor: 1,
    overlayAlpha: 0,
    nextShiftAt: Date.now() + randomInt(18000, 32000),
    flashUntil: 0,
    zone: null,
  };
}

export function spawnEnemy(id, x, y) {
  return spawnShip(id, x, y, "hostile");
}

export function spawnShip(id, x, y, kind = "hostile") {
  const shipConfigs = {
    hostile: {
      names: encounterNames,
      speedMin: 40,
      speedMax: 72,
      hullMin: 55,
      hullMax: 85,
      cannonMin: 1,
      cannonMax: 3,
    },
    merchant: {
      names: ["Bernstein Handel", "Salzkrone", "Kupfermoeve", "Blue Ledger"],
      speedMin: 34,
      speedMax: 58,
      hullMin: 42,
      hullMax: 62,
      cannonMin: 0,
      cannonMax: 1,
    },
    civilian: {
      names: ["Morgenstern", "Lagunenfisch", "Mira", "Seewind"],
      speedMin: 28,
      speedMax: 50,
      hullMin: 34,
      hullMax: 52,
      cannonMin: 0,
      cannonMax: 0,
    },
  };

  const config = shipConfigs[kind] ?? shipConfigs.hostile;
  const shipClass = kind === "hostile"
    ? ["raider", "corsair", "warship"][randomInt(0, 2)]
    : kind;
  return {
    id,
    kind,
    shipClass,
    name: config.names[(id - 1) % config.names.length],
    x,
    y,
    angle: Math.random() * Math.PI * 2,
    speed: randomInt(config.speedMin, config.speedMax),
    maxHull: randomInt(config.hullMin, config.hullMax),
    hull: 0,
    cannons: randomInt(config.cannonMin, config.cannonMax),
    inactiveUntil: 0,
  };
}

export function createEnemies() {
  const layout = [
    "hostile",
    "merchant",
    "civilian",
    "hostile",
    "merchant",
    "civilian",
    "hostile",
    "merchant",
    "civilian",
  ];

  return layout.map((kind, index) => (
    spawnShip(
      index + 1,
      randomInt(280, mapSize.width - 280),
      randomInt(280, mapSize.height - 280),
      kind,
    )
  ));
}

export function createGameState() {
  return {
    player: {
      x: 480,
      y: 300,
      angle: 0,
      speed: 0,
      driftX: 0,
      driftY: 0,
      maxHull: 100,
      hull: 100,
      wood: 12,
      ammo: 16,
      gold: 60,
      cannons: 2,
      sailLevel: 0,
      sailSpeedBonus: 1,
      fame: 0,
      tier: "Sloop",
      braceActive: false,
    },
    camera: { x: 0, y: 0 },
    islands: createIslands(),
    enemies: createEnemies(),
    nearIslandId: null,
    logs: [],
    battle: null,
    gameOver: false,
    particles: [],
    encounterMeter: 0,
    seaState: "Ruhige Gewaesser",
    wind: createWindState(),
    weather: createWeatherState(),
    quests: {
      offers: [],
      active: null,
    },
    lastTime: performance.now(),
  };
}

export function resetGameState(game) {
  const next = createGameState();
  Object.keys(game).forEach((key) => {
    delete game[key];
  });
  Object.assign(game, next);
}

function placeIsland(id, kind, radius, islands) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const candidate = {
      id,
      name: generateIslandName(kind, id),
      x: randomInt(260, mapSize.width - 260),
      y: randomInt(260, mapSize.height - 260),
      radius,
      plunderedAt: 0,
      kind,
    };

    if (isValidIslandPlacement(candidate, islands)) {
      return candidate;
    }
  }

  return null;
}

function generateIslandName(kind, id) {
  if (kind === "pirate") {
    const pirateNames = ["Blacktide Haven", "Ravenrock Port", "Skullmoor Anchorage", "Redwake Den"];
    return pirateNames[(id - 1) % pirateNames.length];
  }

  const prefix = islandNamePrefixes[randomInt(0, islandNamePrefixes.length - 1)];
  const suffix = islandNameSuffixes[randomInt(0, islandNameSuffixes.length - 1)];
  return `${prefix}${suffix}`;
}

function isValidIslandPlacement(candidate, islands) {
  const safeFromSpawn = Math.hypot(candidate.x - 480, candidate.y - 300) > 260;
  if (!safeFromSpawn) {
    return false;
  }

  return islands.every((island) => {
    const distance = Math.hypot(candidate.x - island.x, candidate.y - island.y);
    const padding = candidate.kind === "pirate" || island.kind === "pirate" ? 180 : 140;
    return distance > candidate.radius + island.radius + padding;
  });
}
