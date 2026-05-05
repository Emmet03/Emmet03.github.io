import { randomInt } from "./utils.js";

const particleMap = {
  gold: { emoji: "💰", color: "#efc15a" },
  wood: { emoji: "🪵", color: "#b98a56" },
  ammo: { emoji: "💣", color: "#d7f4ff" },
  repair: { emoji: "🪵", color: "#72ca8e" },
};

export function spawnLootParticles(game, x, y, loot) {
  Object.entries(loot).forEach(([type, amount]) => {
    if (!amount || amount <= 0) {
      return;
    }

    const particleStyle = particleMap[type] ?? particleMap.gold;
    const bursts = Math.min(6, Math.max(2, Math.ceil(amount / 8)));
    for (let index = 0; index < bursts; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomInt(28, 72);
      game.particles.push({
        x: x + randomInt(-24, 24),
        y: y + randomInt(-18, 18),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomInt(12, 34),
        life: 0,
        maxLife: randomInt(850, 1250),
        drift: randomInt(6, 18),
        emoji: particleStyle.emoji,
        color: particleStyle.color,
        label: `+${amount}`,
        size: randomInt(30, 40),
      });
    }
  });
}

export function spawnRepairParticles(game, x, y, amount) {
  spawnLootParticles(game, x, y, { repair: amount });
}

export function updateParticles(game, dt) {
  game.particles = game.particles.filter((particle) => {
    particle.life += dt * 1000;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += particle.drift * dt;
    return particle.life < particle.maxLife;
  });
}
