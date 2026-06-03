(function initCamera(global) {
  class Camera {
    constructor(viewWidth, viewHeight) {
      this.viewWidth = viewWidth;
      this.viewHeight = viewHeight;
      this.x = 0;
      this.y = 0;
    }

    follow(target, map) {
      const mapWidth = map.tiles[0].length * map.tileSize;
      const mapHeight = map.tiles.length * map.tileSize;
      const desiredX = target.x + (target.width / 2) - (this.viewWidth / 2);
      const desiredY = target.y + (target.height / 2) - (this.viewHeight / 2);

      this.x = Math.max(0, Math.min(desiredX, Math.max(0, mapWidth - this.viewWidth)));
      this.y = Math.max(0, Math.min(desiredY, Math.max(0, mapHeight - this.viewHeight)));
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Engine = global.InakaAdv.Engine || {};
  global.InakaAdv.Engine.Camera = Camera;
})(window);
