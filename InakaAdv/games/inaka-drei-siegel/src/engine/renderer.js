(function initRenderer(global) {
  const { TILE_DEFS } = global.InakaAdv.Data;
  const ENTITY_SPRITE_SIZE = 77;

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = false;
      this.tileImageCache = new Map();
      this.spriteImageCache = new Map();
    }

    clear() {
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGame(state) {
      this.clear();
      this.drawMap(state.currentMap, state.camera, state.debug.showTileCoords);
      this.drawExits(state.currentMap, state.camera, state.debug.enabled);
      this.drawNpcs(state.currentMap.npcs, state.currentMap.tileSize, state.camera);
      this.drawEnemies(state.enemies, state.camera);
      this.drawPlayer(state.player, state.camera);
      this.drawDialogue(state.dialogue);

      if (state.debug.enabled) {
        this.drawDebugOverlay(state);
      }
    }

    drawMap(map, camera, showTileCoords) {
      const ctx = this.ctx;
      const tileSize = map.tileSize;
      const startCol = Math.max(0, Math.floor(camera.x / tileSize));
      const endCol = Math.min(map.tiles[0].length, Math.ceil((camera.x + this.canvas.width) / tileSize));
      const startRow = Math.max(0, Math.floor(camera.y / tileSize));
      const endRow = Math.min(map.tiles.length, Math.ceil((camera.y + this.canvas.height) / tileSize));

      for (let row = startRow; row < endRow; row += 1) {
        for (let col = startCol; col < endCol; col += 1) {
          const tileId = map.tiles[row][col];
          const def = TILE_DEFS[tileId];
          const screenX = (col * tileSize) - camera.x;
          const screenY = (row * tileSize) - camera.y;

          this.drawTile(def, screenX, screenY, tileSize);

          if (!def.walkable) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
            ctx.fillRect(screenX, screenY, tileSize, tileSize);
          }

          ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
          ctx.strokeRect(screenX, screenY, tileSize, tileSize);

          if (showTileCoords) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
            ctx.fillRect(screenX + 4, screenY + 4, 30, 18);
            ctx.fillStyle = "#f4f0da";
            ctx.font = "10px monospace";
            ctx.fillText(col + "," + row, screenX + 6, screenY + 16);
          }
        }
      }
    }

    drawTile(tileDef, x, y, size) {
      const ctx = this.ctx;
      const image = this.getTileImage(tileDef);

      if (image && image.complete && image.naturalWidth > 0) {
        ctx.drawImage(image, x, y, size, size);
        return;
      }

      ctx.fillStyle = tileDef.color;
      ctx.fillRect(x, y, size, size);
    }

    getTileImage(tileDef) {
      if (!tileDef.spritePath) {
        return null;
      }

      if (this.tileImageCache.has(tileDef.id)) {
        return this.tileImageCache.get(tileDef.id);
      }

      const image = new Image();
      image.src = tileDef.spritePath;
      this.tileImageCache.set(tileDef.id, image);
      return image;
    }

    getSpriteImage(spritePath) {
      if (!spritePath) {
        return null;
      }

      if (this.spriteImageCache.has(spritePath)) {
        return this.spriteImageCache.get(spritePath);
      }

      const image = new Image();
      image.src = spritePath;
      this.spriteImageCache.set(spritePath, image);
      return image;
    }

    drawPlayer(player, camera) {
      const ctx = this.ctx;
      const screenX = player.x - camera.x;
      const screenY = player.y - camera.y;
      const sprite = this.getSpriteImage("./assets/sprites/player/hero-" + player.direction + ".png");

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        const spriteX = screenX + (player.width / 2) - (ENTITY_SPRITE_SIZE / 2);
        const spriteY = screenY + player.height - ENTITY_SPRITE_SIZE;
        ctx.drawImage(sprite, spriteX, spriteY, ENTITY_SPRITE_SIZE, ENTITY_SPRITE_SIZE);
        return;
      }

      ctx.fillStyle = "#d2c061";
      ctx.fillRect(screenX, screenY, player.width, player.height);

      ctx.fillStyle = "#3a2514";
      if (player.direction === "up") {
        ctx.fillRect(screenX + 10, screenY, 12, 6);
      } else if (player.direction === "down") {
        ctx.fillRect(screenX + 10, screenY + player.height - 6, 12, 6);
      } else if (player.direction === "left") {
        ctx.fillRect(screenX, screenY + 10, 6, 12);
      } else {
        ctx.fillRect(screenX + player.width - 6, screenY + 10, 6, 12);
      }
    }

    drawNpcs(npcs, tileSize, camera) {
      const ctx = this.ctx;
      const npcSize = Math.floor(tileSize * 0.5);
      const offset = Math.floor((tileSize - npcSize) / 2);
      npcs.forEach((npc) => {
        const x = (npc.tileX * tileSize) + offset - camera.x;
        const y = (npc.tileY * tileSize) + offset - camera.y;

        const sprite = this.getSpriteImage(npc.spritePath);
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
          const baseX = (npc.tileX * tileSize) + (tileSize / 2) - camera.x;
          const baseY = ((npc.tileY + 1) * tileSize) - camera.y;
          ctx.drawImage(
            sprite,
            baseX - (ENTITY_SPRITE_SIZE / 2),
            baseY - ENTITY_SPRITE_SIZE,
            ENTITY_SPRITE_SIZE,
            ENTITY_SPRITE_SIZE
          );
          return;
        }

        ctx.fillStyle = "#c77b7b";
        ctx.fillRect(x, y, npcSize, npcSize);
      });
    }

    drawEnemies(enemies, camera) {
      const ctx = this.ctx;
      enemies.forEach((enemy) => {
        const sprite = this.getSpriteImage(enemy.spritePath);
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
          const baseX = enemy.x - camera.x + (enemy.width / 2);
          const baseY = enemy.y - camera.y + enemy.height;
          ctx.drawImage(
            sprite,
            baseX - (ENTITY_SPRITE_SIZE / 2),
            baseY - ENTITY_SPRITE_SIZE,
            ENTITY_SPRITE_SIZE,
            ENTITY_SPRITE_SIZE
          );
          return;
        }

        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x - camera.x + (enemy.width / 2), enemy.y - camera.y + (enemy.height / 2), enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawExits(map, camera, debugEnabled) {
      if (!debugEnabled) {
        return;
      }

      const ctx = this.ctx;
      map.exits.forEach((exit) => {
        const x = (exit.tileX * map.tileSize) - camera.x;
        const y = (exit.tileY * map.tileSize) - camera.y;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.strokeRect(x + 8, y + 8, map.tileSize - 16, map.tileSize - 16);
      });
    }

    drawDialogue(dialogue) {
      if (!dialogue.isOpen) {
        return;
      }

      const ctx = this.ctx;
      const boxHeight = 92;
      const boxY = this.canvas.height - boxHeight - 12;
      ctx.fillStyle = "rgba(14, 10, 8, 0.92)";
      ctx.fillRect(12, boxY, this.canvas.width - 24, boxHeight);
      ctx.strokeStyle = "#d0b17a";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, boxY, this.canvas.width - 24, boxHeight);

      ctx.fillStyle = "#f4ebd4";
      ctx.font = "16px monospace";
      if (dialogue.speaker) {
        ctx.fillText(dialogue.speaker, 24, boxY + 24);
      }

      const lines = this.wrapText(dialogue.currentText, 70);
      lines.forEach((line, index) => {
        ctx.fillText(line, 24, boxY + 48 + (index * 18));
      });

      ctx.font = "12px monospace";
      ctx.fillStyle = "#c8bc9c";
      ctx.fillText("E - weiter", this.canvas.width - 104, boxY + boxHeight - 16);
    }

    drawDebugOverlay(state) {
      const ctx = this.ctx;
      const tile = global.InakaAdv.Engine.Collision.getTileAtPixel(
        state.currentMap,
        state.player.x + state.player.width / 2,
        state.player.y + state.player.height / 2
      );
      const debugLines = [
        "Map: " + state.currentMap.id,
        "Pixel: " + Math.round(state.player.x) + ", " + Math.round(state.player.y),
        "Tile: " + Math.floor((state.player.x + state.player.width / 2) / state.currentMap.tileSize) + ", " + Math.floor((state.player.y + state.player.height / 2) / state.currentMap.tileSize),
        "Blick: " + state.player.direction,
        "Tile unter Spieler: " + (tile.tileId || "none"),
        "Flags: " + JSON.stringify(state.gameState.flags),
      ];

      ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
      ctx.fillRect(10, 10, 325, 112);
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(10, 10, 325, 112);
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px monospace";
      debugLines.forEach((line, index) => {
        ctx.fillText(line, 18, 28 + (index * 16));
      });

      this.drawBlockingTileOverlays(state.currentMap, state.camera);
      this.drawEntityHitboxes(state.player, state.currentMap.npcs, state.camera, state.currentMap.tileSize);
    }

    drawBlockingTileOverlays(map, camera) {
      const ctx = this.ctx;
      for (let row = 0; row < map.tiles.length; row += 1) {
        for (let col = 0; col < map.tiles[row].length; col += 1) {
          const def = TILE_DEFS[map.tiles[row][col]];
          if (def.walkable) {
            continue;
          }
          const x = (col * map.tileSize) - camera.x;
          const y = (row * map.tileSize) - camera.y;
          ctx.fillStyle = "rgba(255, 80, 80, 0.15)";
          ctx.fillRect(x, y, map.tileSize, map.tileSize);
        }
      }
    }

    drawEntityHitboxes(player, npcs, camera, tileSize) {
      const ctx = this.ctx;
      const npcSize = Math.floor(tileSize * 0.5);
      const offset = Math.floor((tileSize - npcSize) / 2);
      ctx.strokeStyle = "#ffff00";
      ctx.strokeRect(player.x - camera.x, player.y - camera.y, player.width, player.height);

      ctx.strokeStyle = "#7bff7b";
      npcs.forEach((npc) => {
        const x = (npc.tileX * tileSize) + offset - camera.x;
        const y = (npc.tileY * tileSize) + offset - camera.y;
        ctx.strokeRect(x, y, npcSize, npcSize);
      });
    }

    wrapText(text, maxChars) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine ? currentLine + " " + word : word;
        if (testLine.length > maxChars) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Engine = global.InakaAdv.Engine || {};
  global.InakaAdv.Engine.Renderer = Renderer;
})(window);
