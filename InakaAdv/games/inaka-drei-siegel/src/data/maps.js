(function initMaps(global) {
  const TILE_SIZE = 64;

  const MAPS = {
    startVillage: {
      id: "startVillage",
      name: "Startdorf",
      tileSize: TILE_SIZE,
      startPosition: { x: 2.5 * TILE_SIZE, y: 5.25 * TILE_SIZE },
      tiles: [
        ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
        ["G", "H1", "G", "G", "G", "G", "G", "H2", "G", "G"],
        ["G", "G", "G", "W", "W", "W", "G", "G", "G", "G"],
        ["G", "G", "P", "P", "P", "P", "P", "P", "G", "G"],
        ["G", "G", "P", "G", "G", "G", "G", "P", "G", "G"],
        ["G", "G", "P", "G", "T", "G", "G", "P", "G", "G"],
        ["G", "G", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["G", "G", "G", "G", "R", "G", "G", "G", "G", "G"],
      ],
      npcs: [
        { id: "elder", name: "Dorfaeltester", tileX: 3, tileY: 4, dialogueId: "elderIntro", spritePath: "./assets/sprites/npc/elder.png" },
        { id: "villager", name: "Bewohner", tileX: 6, tileY: 4, dialogueId: "villagerWarning", spritePath: "./assets/sprites/npc/villager.png" },
      ],
      enemies: [],
      exits: [
        {
          id: "toForestRoad",
          tileX: 9,
          tileY: 6,
          targetMapId: "forestRoad",
          targetPosition: { x: 1.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
        },
      ],
    },
    forestRoad: {
      id: "forestRoad",
      name: "Waldweg",
      tileSize: TILE_SIZE,
      startPosition: { x: 1.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
      tiles: [
        ["T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T", "T"],
        ["T", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "T"],
        ["T", "G", "W", "W", "G", "G", "G", "W", "W", "G", "G", "T"],
        ["T", "G", "G", "G", "P", "P", "P", "G", "G", "G", "G", "T"],
        ["P", "P", "P", "P", "P", "G", "P", "P", "P", "P", "P", "P"],
        ["T", "G", "G", "G", "P", "G", "G", "G", "G", "G", "G", "T"],
        ["T", "G", "R", "G", "P", "P", "P", "G", "R", "G", "G", "T"],
        ["T", "G", "G", "G", "G", "G", "P", "G", "G", "G", "G", "T"],
        ["T", "T", "T", "T", "T", "T", "P", "P", "P", "P", "P", "P"],
      ],
      npcs: [],
      enemies: [
        { id: "wisp1", typeId: "shadowWisp", tileX: 8, tileY: 3 },
      ],
      exits: [
        {
          id: "toStartVillage",
          tileX: 0,
          tileY: 4,
          targetMapId: "startVillage",
          targetPosition: { x: 8.2 * TILE_SIZE, y: 6.2 * TILE_SIZE },
        },
        {
          id: "toShrine",
          tileX: 11,
          tileY: 8,
          targetMapId: "corruptedShrine",
          targetPosition: { x: 1.5 * TILE_SIZE, y: 5.2 * TILE_SIZE },
        },
      ],
    },
    corruptedShrine: {
      id: "corruptedShrine",
      name: "Verdorbener Schrein",
      tileSize: TILE_SIZE,
      startPosition: { x: 1.5 * TILE_SIZE, y: 5.2 * TILE_SIZE },
      tiles: [
        ["T", "T", "T", "T", "T", "T", "T", "T", "T"],
        ["T", "G", "G", "G", "X", "G", "G", "G", "T"],
        ["T", "G", "W", "G", "X", "G", "W", "G", "T"],
        ["T", "G", "G", "P", "P", "P", "G", "G", "T"],
        ["T", "G", "G", "G", "S", "G", "G", "G", "T"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["T", "G", "R", "G", "G", "G", "R", "G", "T"],
        ["T", "T", "T", "T", "T", "T", "T", "T", "T"],
      ],
      npcs: [],
      enemies: [
        { id: "wisp2", typeId: "shadowWisp", tileX: 5, tileY: 2 },
      ],
      exits: [
        {
          id: "toForestRoad",
          tileX: 0,
          tileY: 5,
          targetMapId: "forestRoad",
          targetPosition: { x: 10.25 * TILE_SIZE, y: 7.5 * TILE_SIZE },
        },
      ],
    },
  };

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.MAPS = MAPS;
})(window);
