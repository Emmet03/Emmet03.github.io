export const mapSize = { width: 3600, height: 2600 };

export const encounterNames = [
  "Brackwasser-Brig",
  "Schatten der Lagune",
  "Sturmzahn",
  "Roter Korsar",
  "Nebelkrähe",
];

export const captainFirstNames = ["Mara", "Inez", "Rufus", "Silas", "Elara", "Tomas", "Vera", "Jonah"];
export const captainTitles = ["Blackwake", "Saltfin", "Redreef", "Stormglass", "Grimm", "Morrow", "Ashwind", "Crowe"];
export const shipPrefixes = ["Sea", "Storm", "Black", "Gold", "Iron", "Red", "Night", "Scarlet"];
export const shipSuffixes = ["Warden", "Siren", "Crown", "Marauder", "Drift", "Comet", "Dancer", "Raven"];

export const islandNamePrefixes = [
  "Gold",
  "Schwarz",
  "Sturm",
  "Nebel",
  "Korallen",
  "Eisen",
  "Levia",
  "Fähr",
  "Drachen",
  "Morgen",
  "Raben",
  "Salz",
  "Smaragd",
  "Knochen",
];

export const islandNameSuffixes = [
  "hafen",
  "bergen",
  "küste",
  "riff",
  "klippe",
  "bucht",
  "haven",
  "holm",
  "grund",
  "wacht",
  "mark",
  "fels",
];

export const pirateIslandNames = ["Blacktide Haven", "Ravenrock Port", "Skullmoor Anchorage", "Redwake Den"];

export const worldConfig = {
  islandCount: 12,
  pirateIslandCount: 3,
  islandPlacementPadding: {
    pirate: 180,
    wild: 140,
  },
  islandPlacementMargin: 260,
  islandPlacementAttempts: 500,
  islandStartPosition: { x: 420, y: 320 },
  playerStart: { x: 480, y: 300 },
  enemySpawnMargin: 280,
  shipBoundsMargin: 60,
  enemyBoundsMargin: 80,
  safeHarborRadiusBonus: 110,
  nearbyIslandRadiusBonus: 72,
  battleTriggerDistance: 90,
  allyTargetReachBonus: 28,
  allyLootCooldownMs: 2000,
  islandRecoverMs: 35000,
};

export const windConfig = {
  strengthMin: 10,
  strengthMax: 22,
  shiftDelayMinMs: 14000,
  shiftDelayMaxMs: 24000,
};

export const weatherConfig = {
  defaultNextShiftMinMs: 32000,
  defaultNextShiftMaxMs: 52000,
  thunderFlashMs: 180,
};

export const playerDefaults = {
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
};

export const shipConfigs = {
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
    names: ["Bernstein Handel", "Salzkrone", "Kupfermöwe", "Blue Ledger"],
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

export const enemyLayout = [
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

export const shipUpgradeCosts = {
  hull: 45,
  cannons: 60,
  sails: 55,
  ammo: 20,
  prow: 85,
  fireAmmo: 90,
};
