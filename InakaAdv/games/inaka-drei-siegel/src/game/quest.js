(function initQuest(global) {
  const { INITIAL_FLAGS } = global.InakaAdv.Data;

  function createGameState() {
    return {
      flags: { ...INITIAL_FLAGS },
    };
  }

  function setFlag(gameState, flagName, value) {
    gameState.flags[flagName] = value;
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.createGameState = createGameState;
  global.InakaAdv.Game.setFlag = setFlag;
})(window);
