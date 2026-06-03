(function initSceneManager(global) {
  class SceneManager {
    constructor(maps) {
      this.maps = maps;
      this.currentMap = null;
    }

    loadMap(mapId) {
      const map = this.maps[mapId];
      if (!map) {
        throw new Error("Unknown map: " + mapId);
      }

      this.currentMap = {
        ...map,
        npcs: map.npcs.map((npc) => ({ ...npc })),
        enemies: map.enemies.map((enemy) => ({ ...enemy })),
        exits: map.exits.map((exit) => ({ ...exit })),
        tiles: map.tiles.map((row) => row.slice()),
      };

      return this.currentMap;
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Engine = global.InakaAdv.Engine || {};
  global.InakaAdv.Engine.SceneManager = SceneManager;
})(window);
