export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

export function cardinalDirection(angle) {
  const directions = ["Ost", "Süd", "West", "Nord"];
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const index = Math.round(normalized / (Math.PI / 2)) % 4;
  return directions[index];
}

export function playerShipSize(player) {
  const growth = player.cannons * 4 + player.sailLevel * 3 + Math.floor((player.maxHull - 100) / 6);
  return 126 + Math.min(44, growth);
}
