(function initTiles(global) {
  const TILE_SIZE = 64;

  const TILE_DEFS = {
    G: {
      id: "G",
      name: "Grass",
      walkable: true,
      color: "#3f8f3b",
      spritePath: "./assets/tiles/grass.png",
      debugColor: "rgba(63, 143, 59, 0.2)",
    },
    W: {
      id: "W",
      name: "Water",
      walkable: false,
      color: "#215fbd",
      spritePath: "./assets/tiles/water.png",
      debugColor: "rgba(33, 95, 189, 0.2)",
    },
    P: {
      id: "P",
      name: "Path",
      walkable: true,
      color: "#9f7f4a",
      spritePath: "./assets/tiles/path.png",
      debugColor: "rgba(159, 127, 74, 0.2)",
    },
    T: {
      id: "T",
      name: "Tree",
      walkable: false,
      color: "#1d5f21",
      spritePath: "./assets/tiles/tree.png",
      debugColor: "rgba(29, 95, 33, 0.2)",
    },
    R: {
      id: "R",
      name: "Rock",
      walkable: false,
      color: "#6a6a6a",
      spritePath: "./assets/tiles/rock.png",
      debugColor: "rgba(106, 106, 106, 0.2)",
    },
    B: {
      id: "B",
      name: "Bridge",
      walkable: true,
      color: "#7a5232",
      spritePath: "./assets/tiles/bridge.png",
      debugColor: "rgba(122, 82, 50, 0.2)",
    },
    H1: {
      id: "H1",
      name: "Small House",
      walkable: false,
      color: "#8b4c29",
      spritePath: "./assets/tiles/house-small.png",
      debugColor: "rgba(139, 76, 41, 0.2)",
      interaction: {
        dialogueId: "houseLocked",
      },
    },
    H2: {
      id: "H2",
      name: "Large House",
      walkable: false,
      color: "#6f3a20",
      spritePath: "./assets/tiles/house-large.png",
      debugColor: "rgba(111, 58, 32, 0.2)",
      interaction: {
        dialogueId: "houseLocked",
      },
    },
    S: {
      id: "S",
      name: "Shrine",
      walkable: false,
      color: "#b7a67a",
      spritePath: "./assets/tiles/shrine.png",
      debugColor: "rgba(183, 166, 122, 0.2)",
      interaction: {
        dialogueId: "shrineSeal",
        setFlags: ["firstSealFound"],
      },
    },
    X: {
      id: "X",
      name: "Corrupted Ground",
      walkable: false,
      color: "#6f174d",
      spritePath: "./assets/tiles/corrupted-ground.png",
      debugColor: "rgba(111, 23, 77, 0.2)",
    },
  };

  function getTileDef(tileId) {
    return TILE_DEFS[tileId] || TILE_DEFS.G;
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.TILE_SIZE = TILE_SIZE;
  global.InakaAdv.Data.TILE_DEFS = TILE_DEFS;
  global.InakaAdv.Data.getTileDef = getTileDef;
})(window);
