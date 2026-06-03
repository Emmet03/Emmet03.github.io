(function initInteraction(global) {
  const { getNpcAtTile } = global.InakaAdv.Game;
  const { getTileIdAt } = global.InakaAdv.Engine.Collision;
  const { TILE_DEFS } = global.InakaAdv.Data;

  function handleInteraction(state) {
    const facingTile = state.player.getFacingTile(state.currentMap);
    const npc = getNpcAtTile(state.currentMap, facingTile.tileX, facingTile.tileY);
    if (npc) {
      state.dialogue.open(npc.dialogueId, npc.name);
      return;
    }

    const tileId = getTileIdAt(state.currentMap, facingTile.tileX, facingTile.tileY);
    if (!tileId) {
      return;
    }

    const tileDef = TILE_DEFS[tileId];
    if (!tileDef || !tileDef.interaction) {
      return;
    }

    const interaction = tileDef.interaction;
    if (Array.isArray(interaction.setFlags)) {
      interaction.setFlags.forEach((flagName) => {
        state.gameState.flags[flagName] = true;
      });
    }
    if (interaction.dialogueId) {
      state.dialogue.open(interaction.dialogueId, tileDef.name);
    }
  }

  function checkExitCollision(state) {
    const playerTileX = Math.floor((state.player.x + state.player.width / 2) / state.currentMap.tileSize);
    const playerTileY = Math.floor((state.player.y + state.player.height / 2) / state.currentMap.tileSize);
    return state.currentMap.exits.find((exit) => exit.tileX === playerTileX && exit.tileY === playerTileY) || null;
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.handleInteraction = handleInteraction;
  global.InakaAdv.Game.checkExitCollision = checkExitCollision;
})(window);
