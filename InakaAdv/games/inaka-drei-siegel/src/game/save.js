(function initSave(global) {
  const STORAGE_KEY = "inaka-drei-siegel-save";

  function saveGame(gameState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.warn("Save failed", error);
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Load failed", error);
      return null;
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.Save = {
    saveGame,
    loadGame,
  };
})(window);
