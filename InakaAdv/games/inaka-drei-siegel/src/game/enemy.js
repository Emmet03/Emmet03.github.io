(function initEnemy(global) {
  const { ENEMY_TYPES } = global.InakaAdv.Data;

  function instantiateEnemies(map, tileSize) {
    return map.enemies.map((entry) => {
      const type = ENEMY_TYPES[entry.typeId];
      return {
        id: entry.id,
        typeId: entry.typeId,
        name: type.name,
        x: (entry.tileX * tileSize) + ((tileSize - type.width) / 2),
        y: (entry.tileY * tileSize) + ((tileSize - type.height) / 2),
        width: type.width,
        height: type.height,
        hp: type.hp,
        color: type.color,
        spritePath: type.spritePath,
      };
    });
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.instantiateEnemies = instantiateEnemies;
})(window);
