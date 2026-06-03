(function initEnemyData(global) {
  const ENEMY_TYPES = {
    shadowWisp: {
      id: "shadowWisp",
      name: "Shadow Wisp",
      width: 28,
      height: 28,
      speed: 60,
      hp: 1,
      color: "#7f5cff",
      spritePath: "./assets/sprites/enemies/shadow-wisp.png",
    },
  };

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.ENEMY_TYPES = ENEMY_TYPES;
})(window);
