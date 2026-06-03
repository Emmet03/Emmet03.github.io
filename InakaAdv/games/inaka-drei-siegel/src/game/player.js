(function initPlayer(global) {
  const { collidesWithMap } = global.InakaAdv.Engine.Collision;

  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 32;
      this.height = 32;
      this.speed = 160;
      this.direction = "down";
      this.hp = 5;
      this.maxHp = 5;
      this.attackCooldown = 0;
    }

    update(deltaTime, input, map, dialogueOpen) {
      if (this.attackCooldown > 0) {
        this.attackCooldown -= deltaTime;
      }

      if (dialogueOpen) {
        return;
      }

      let moveX = 0;
      let moveY = 0;

      const left = input.isDown("KeyA") || input.isDown("ArrowLeft");
      const right = input.isDown("KeyD") || input.isDown("ArrowRight");
      const up = input.isDown("KeyW") || input.isDown("ArrowUp");
      const down = input.isDown("KeyS") || input.isDown("ArrowDown");

      if (left !== right) {
        moveX = left ? -1 : 1;
        this.direction = left ? "left" : "right";
      } else if (up !== down) {
        moveY = up ? -1 : 1;
        this.direction = up ? "up" : "down";
      }

      const distance = this.speed * deltaTime;
      if (moveX !== 0) {
        this.tryMove(moveX * distance, 0, map);
      }
      if (moveY !== 0) {
        this.tryMove(0, moveY * distance, map);
      }

      if (input.wasPressed("Space") && this.attackCooldown <= 0) {
        this.attackCooldown = 0.25;
      }
    }

    tryMove(deltaX, deltaY, map) {
      const next = {
        x: this.x + deltaX,
        y: this.y + deltaY,
        width: this.width,
        height: this.height,
      };

      if (!collidesWithMap(next, map)) {
        this.x = next.x;
        this.y = next.y;
      }
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }

    getFacingTile(map) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      let targetX = centerX;
      let targetY = centerY;
      const distance = map.tileSize * 0.75;

      if (this.direction === "up") {
        targetY -= distance;
      } else if (this.direction === "down") {
        targetY += distance;
      } else if (this.direction === "left") {
        targetX -= distance;
      } else {
        targetX += distance;
      }

      return {
        tileX: Math.floor(targetX / map.tileSize),
        tileY: Math.floor(targetY / map.tileSize),
      };
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.Player = Player;
})(window);
