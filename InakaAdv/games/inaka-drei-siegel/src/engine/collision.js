(function initCollision(global) {
  const { TILE_DEFS } = global.InakaAdv.Data;

  function getMapBounds(map) {
    return {
      width: map.tiles[0].length * map.tileSize,
      height: map.tiles.length * map.tileSize,
    };
  }

  function getTileIdAt(map, tileX, tileY) {
    if (tileY < 0 || tileY >= map.tiles.length || tileX < 0 || tileX >= map.tiles[0].length) {
      return null;
    }
    return map.tiles[tileY][tileX];
  }

  function getTileAtPixel(map, pixelX, pixelY) {
    const tileX = Math.floor(pixelX / map.tileSize);
    const tileY = Math.floor(pixelY / map.tileSize);
    const tileId = getTileIdAt(map, tileX, tileY);
    return { tileId, tileX, tileY };
  }

  function isWalkableTile(map, tileX, tileY) {
    const tileId = getTileIdAt(map, tileX, tileY);
    if (!tileId) {
      return false;
    }
    return TILE_DEFS[tileId]?.walkable === true;
  }

  function collidesWithMap(entity, map) {
    const bounds = getMapBounds(map);
    if (entity.x < 0 || entity.y < 0 || entity.x + entity.width > bounds.width || entity.y + entity.height > bounds.height) {
      return true;
    }

    const inset = 2;
    const points = [
      { x: entity.x + inset, y: entity.y + inset },
      { x: entity.x + entity.width - inset, y: entity.y + inset },
      { x: entity.x + inset, y: entity.y + entity.height - inset },
      { x: entity.x + entity.width - inset, y: entity.y + entity.height - inset },
    ];

    return points.some((point) => {
      const tile = getTileAtPixel(map, point.x, point.y);
      return !isWalkableTile(map, tile.tileX, tile.tileY);
    });
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Engine = global.InakaAdv.Engine || {};
  global.InakaAdv.Engine.Collision = {
    getMapBounds,
    getTileIdAt,
    getTileAtPixel,
    isWalkableTile,
    collidesWithMap,
  };
})(window);
