import { mapSize } from "./constants.js";
import { cardinalDirection, playerShipSize } from "./utils.js";

export function drawSea(ctx, canvas, game, textures) {
  if (textures.sea.complete && textures.sea.naturalWidth) {
    const pattern = ctx.createPattern(textures.sea, "repeat");
    ctx.save();
    ctx.fillStyle = pattern;
    ctx.translate(-game.camera.x, -game.camera.y);
    ctx.fillRect(game.camera.x, game.camera.y, canvas.width, canvas.height);
    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = "#0f4054";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  for (let i = 0; i < 40; i += 1) {
    const x = ((i * 173) % mapSize.width) - game.camera.x * 0.8;
    const y = ((i * 241) % mapSize.height) - game.camera.y * 0.8;
    ctx.fillStyle = "rgba(215, 244, 255, 0.07)";
    ctx.beginPath();
    ctx.ellipse(x, y, 28, 8, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawIslands(ctx, game, textures) {
  for (const island of game.islands) {
    const distanceToPlayer = Math.hypot(game.player.x - island.x, game.player.y - island.y);
    if (distanceToPlayer > game.weather.visibilityRange && game.nearIslandId !== island.id) {
      continue;
    }
    const screenX = island.x - game.camera.x;
    const screenY = island.y - game.camera.y;
    const size = island.kind === "pirate" ? island.radius * 2.55 : island.radius * 2.2;
    const texture = island.kind === "pirate" ? textures.pirateIsland : textures.island;

    ctx.save();
    ctx.translate(screenX, screenY);
    if (texture.complete && texture.naturalWidth) {
      ctx.drawImage(texture, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = island.kind === "pirate" ? "#8a6c46" : "#b8a167";
      ctx.beginPath();
      ctx.arc(0, 0, island.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (game.nearIslandId === island.id) {
      ctx.strokeStyle = island.kind === "pirate" ? "rgba(210, 91, 71, 0.88)" : "rgba(239, 193, 90, 0.85)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, island.radius + 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function drawEnemies(ctx, game, textures) {
  const now = Date.now();
  for (const enemy of game.enemies) {
    if (enemy.inactiveUntil > now) {
      continue;
    }
    if (Math.hypot(game.player.x - enemy.x, game.player.y - enemy.y) > game.weather.visibilityRange) {
      continue;
    }

    const screenX = enemy.x - game.camera.x;
    const screenY = enemy.y - game.camera.y;
    const size = 92;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(enemy.angle);
    ctx.globalAlpha = 0.92;

    if (textures.ship.complete && textures.ship.naturalWidth) {
      ctx.drawImage(textures.ship, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = enemyFillColor(enemy.kind);
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(-18, -14);
      ctx.lineTo(-28, 0);
      ctx.lineTo(-18, 14);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = enemyMarkerColor(enemy.kind);
    ctx.fillRect(-20, -44, 40, 5);
    ctx.restore();
  }
}

export function drawPlayer(ctx, game, textures) {
  const p = game.player;
  const screenX = p.x - game.camera.x;
  const screenY = p.y - game.camera.y;
  const size = playerShipSize(p);

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(p.angle);
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;

  if (textures.ship.complete && textures.ship.naturalWidth) {
    ctx.drawImage(textures.ship, -size / 2, -size / 2, size, size);
  } else {
    ctx.fillStyle = "#8b673c";
    ctx.beginPath();
    ctx.moveTo(42, 0);
    ctx.lineTo(-22, -18);
    ctx.lineTo(-32, 0);
    ctx.lineTo(-22, 18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  drawPlayerStatus(ctx, game, screenX, screenY + 52);
}

export function drawPlayerStatus(ctx, game, x, y) {
  const p = game.player;
  ctx.save();
  ctx.fillStyle = "rgba(5, 14, 20, 0.62)";
  ctx.fillRect(x - 48, y, 96, 10);
  ctx.fillStyle = "#71d591";
  ctx.fillRect(x - 48, y, 96 * (p.hull / p.maxHull), 10);
  ctx.restore();
}

export function drawCompass(ctx, canvas, game) {
  ctx.save();
  const compassX = game.nearIslandId ? canvas.width - 356 : canvas.width - 92;
  ctx.translate(compassX, 84);
  ctx.fillStyle = "rgba(5, 14, 20, 0.58)";
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(239, 193, 90, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.rotate(game.wind.angle);
  ctx.strokeStyle = "rgba(114, 202, 142, 0.95)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(20, 0);
  ctx.stroke();
  ctx.fillStyle = "rgba(114, 202, 142, 0.95)";
  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(12, -7);
  ctx.lineTo(12, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.rotate(game.player.angle);
  ctx.strokeStyle = "#f4ead0";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(18, 0);
  ctx.stroke();
  ctx.fillStyle = "#efc15a";
  ctx.beginPath();
  ctx.moveTo(24, 0);
  ctx.lineTo(10, -8);
  ctx.lineTo(10, 8);
  ctx.closePath();
  ctx.fill();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "rgba(5, 14, 20, 0.72)";
  const panelX = game.nearIslandId ? canvas.width - 442 : canvas.width - 178;
  ctx.fillRect(panelX, 132, 146, 42);
  ctx.fillStyle = "#d7f4ff";
  ctx.font = "12px Trebuchet MS";
  ctx.fillText(`Wind: ${cardinalDirection(game.wind.angle)}`, panelX + 12, 148);
  ctx.fillText(`Bonus: +${Math.round(game.wind.strength * 100)}%`, panelX + 12, 164);
  ctx.restore();
}

export function draw(ctx, canvas, game, textures) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSea(ctx, canvas, game, textures);
  drawWeatherZone(ctx, game);
  drawIslands(ctx, game, textures);
  drawEnemies(ctx, game, textures);
  drawPlayer(ctx, game, textures);
  drawParticles(ctx, game);
  drawMinimap(ctx, canvas, game);
  drawCompass(ctx, canvas, game);
  drawWeatherOverlay(ctx, canvas, game);
}

export function drawParticles(ctx, game) {
  for (const particle of game.particles) {
    const alpha = 1 - (particle.life / particle.maxLife);
    const screenX = particle.x - game.camera.x;
    const screenY = particle.y - game.camera.y - (particle.life / particle.maxLife) * 18;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.textAlign = "center";
    ctx.font = `${particle.size}px Segoe UI Emoji, Apple Color Emoji, sans-serif`;
    ctx.fillText(particle.emoji, screenX, screenY);

    ctx.font = "bold 14px Trebuchet MS";
    ctx.fillStyle = particle.color;
    ctx.fillText(particle.label, screenX, screenY - 24);
    ctx.restore();
  }
}

function enemyMarkerColor(kind) {
  if (kind === "merchant") {
    return "rgba(239, 193, 90, 0.95)";
  }
  if (kind === "civilian") {
    return "rgba(114, 202, 142, 0.95)";
  }
  return "rgba(210, 91, 71, 0.95)";
}

function enemyFillColor(kind) {
  if (kind === "merchant") {
    return "#8d6a2b";
  }
  if (kind === "civilian") {
    return "#4f775f";
  }
  return "#6e4a29";
}

function drawMinimap(ctx, canvas, game) {
  const width = 186;
  const height = 132;
  const x = 18;
  const y = 18;

  ctx.save();
  ctx.fillStyle = "rgba(5, 14, 20, 0.72)";
  ctx.strokeStyle = "rgba(203, 178, 110, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 16);
  ctx.fill();
  ctx.stroke();

  for (const island of game.islands) {
    const px = x + (island.x / mapSize.width) * width;
    const py = y + (island.y / mapSize.height) * height;
    ctx.fillStyle = island.kind === "pirate" ? "#d25b47" : "#dbc18e";
    ctx.beginPath();
    ctx.arc(px, py, island.kind === "pirate" ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const now = Date.now();
  for (const enemy of game.enemies) {
    if (enemy.inactiveUntil > now) {
      continue;
    }
    const px = x + (enemy.x / mapSize.width) * width;
    const py = y + (enemy.y / mapSize.height) * height;
    ctx.fillStyle = enemyMarkerColor(enemy.kind);
    ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
  }

  const playerX = x + (game.player.x / mapSize.width) * width;
  const playerY = y + (game.player.y / mapSize.height) * height;
  ctx.fillStyle = "#d7f4ff";
  ctx.beginPath();
  ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
  ctx.fill();

  const viewW = (canvas.width / mapSize.width) * width;
  const viewH = (canvas.height / mapSize.height) * height;
  const viewX = x + (game.camera.x / mapSize.width) * width;
  const viewY = y + (game.camera.y / mapSize.height) * height;
  ctx.strokeStyle = "rgba(215, 244, 255, 0.55)";
  ctx.strokeRect(viewX, viewY, viewW, viewH);

  ctx.fillStyle = "#f4ead0";
  ctx.font = "12px Trebuchet MS";
  ctx.fillText("Minimap", x + 12, y + 16);
  ctx.restore();
}

function drawWeatherZone(ctx, game) {
  const zone = game.weather.zone;
  if (!zone) {
    return;
  }

  const screenX = zone.x - game.camera.x;
  const screenY = zone.y - game.camera.y;
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = zone.type === "current" ? "#7bc7df" : "#cfe68c";
  ctx.beginPath();
  ctx.arc(screenX, screenY, zone.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWeatherOverlay(ctx, canvas, game) {
  const weather = game.weather;
  if (weather.overlayAlpha > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(190, 210, 220, ${weather.overlayAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (weather.type === "rain" || weather.type === "storm" || weather.type === "thunder") {
    ctx.save();
    ctx.strokeStyle = weather.type === "storm" ? "rgba(210, 230, 255, 0.16)" : "rgba(210, 230, 255, 0.12)";
    for (let i = 0; i < 44; i += 1) {
      const x = (i * 43 + game.lastTime * 0.06) % (canvas.width + 60);
      const y = (i * 27 + game.lastTime * 0.1) % (canvas.height + 80);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y + 18);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (weather.type === "thunder" && weather.flashUntil > Date.now()) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}
