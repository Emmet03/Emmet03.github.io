import {
  captainFirstNames,
  captainTitles,
  enemyLayout,
  islandNamePrefixes,
  islandNameSuffixes,
  mapSize,
  pirateIslandNames,
  playerDefaults,
  shipConfigs,
  shipPrefixes,
  shipSuffixes,
  weatherConfig,
  windConfig,
  worldConfig,
} from "./constants.js";
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

  for (let id = 1; id <= worldConfig.islandCount; id += 1) {
    const kind = id <= worldConfig.pirateIslandCount ? "pirate" : "wild";
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
    startIsland.x = worldConfig.islandStartPosition.x;
    startIsland.y = worldConfig.islandStartPosition.y;
  }

  return islands;
}

export function createWindState() {
  return {
    angle: Math.random() * Math.PI * 2,
    strength: randomInt(windConfig.strengthMin, windConfig.strengthMax) / 100,
    nextShiftAt: Date.now() + randomInt(windConfig.shiftDelayMinMs, windConfig.shiftDelayMaxMs),
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
    nextShiftAt: Date.now() + randomInt(weatherConfig.defaultNextShiftMinMs, weatherConfig.defaultNextShiftMaxMs),
    flashUntil: 0,
    zone: null,
  };
}

export function randomCaptainName() {
  return `${captainFirstNames[randomInt(0, captainFirstNames.length - 1)]} ${captainTitles[randomInt(0, captainTitles.length - 1)]}`;
}

export function randomShipName() {
  return `${shipPrefixes[randomInt(0, shipPrefixes.length - 1)]} ${shipSuffixes[randomInt(0, shipSuffixes.length - 1)]}`;
}

export function spawnEnemy(id, x, y) {
  return spawnShip(id, x, y, "hostile");
}

export function spawnShip(id, x, y, kind = "hostile") {
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
  return enemyLayout.map((kind, index) => (
    spawnShip(
      index + 1,
      randomInt(worldConfig.enemySpawnMargin, mapSize.width - worldConfig.enemySpawnMargin),
      randomInt(worldConfig.enemySpawnMargin, mapSize.height - worldConfig.enemySpawnMargin),
      kind,
    )
  ));
}

export function createGameState() {
  return {
    player: {
      captainName: randomCaptainName(),
      shipName: randomShipName(),
      x: worldConfig.playerStart.x,
      y: worldConfig.playerStart.y,
      angle: 0,
      speed: 0,
      driftX: 0,
      driftY: 0,
      maxHull: playerDefaults.maxHull,
      hull: playerDefaults.hull,
      wood: playerDefaults.wood,
      ammo: playerDefaults.ammo,
      gold: playerDefaults.gold,
      cannons: playerDefaults.cannons,
      sailLevel: playerDefaults.sailLevel,
      sailSpeedBonus: playerDefaults.sailSpeedBonus,
      fame: playerDefaults.fame,
      tier: playerDefaults.tier,
      braceActive: false,
      modules: {
        armoredProw: false,
        fireAmmo: false,
      },
    },
    camera: { x: 0, y: 0 },
    islands: createIslands(),
    enemies: createEnemies(),
    allies: [],
    allyCounter: 1,
    nearIslandId: null,
    logs: [],
    battle: null,
    gameOver: false,
    particles: [],
    encounterMeter: 0,
    seaState: "Ruhige Gewässer",
    wind: createWindState(),
    weather: createWeatherState(),
    quests: {
      offers: [],
      active: null,
    },
    started: false,
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
  for (let attempt = 0; attempt < worldConfig.islandPlacementAttempts; attempt += 1) {
    const candidate = {
      id,
      name: generateIslandName(kind, id),
      x: randomInt(worldConfig.islandPlacementMargin, mapSize.width - worldConfig.islandPlacementMargin),
      y: randomInt(worldConfig.islandPlacementMargin, mapSize.height - worldConfig.islandPlacementMargin),
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
    return pirateIslandNames[(id - 1) % pirateIslandNames.length];
  }

  const prefix = islandNamePrefixes[randomInt(0, islandNamePrefixes.length - 1)];
  const suffix = islandNameSuffixes[randomInt(0, islandNameSuffixes.length - 1)];
  return `${prefix}${suffix}`;
}

function isValidIslandPlacement(candidate, islands) {
  const safeFromSpawn = Math.hypot(
    candidate.x - worldConfig.playerStart.x,
    candidate.y - worldConfig.playerStart.y,
  ) > worldConfig.islandPlacementMargin;

  if (!safeFromSpawn) {
    return false;
  }

  return islands.every((island) => {
    const distance = Math.hypot(candidate.x - island.x, candidate.y - island.y);
    const padding = candidate.kind === "pirate" || island.kind === "pirate"
      ? worldConfig.islandPlacementPadding.pirate
      : worldConfig.islandPlacementPadding.wild;
    return distance > candidate.radius + island.radius + padding;
  });
}
