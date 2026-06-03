(function initNpc(global) {
  function getNpcAtTile(map, tileX, tileY) {
    return map.npcs.find((npc) => npc.tileX === tileX && npc.tileY === tileY) || null;
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.getNpcAtTile = getNpcAtTile;
})(window);
