(function initMain(global) {
  const { MAPS } = global.InakaAdv.Data;
  const { InputManager, Camera, SceneManager, Renderer } = global.InakaAdv.Engine;
  const { Player, DialogueManager, createGameState, instantiateEnemies, handleInteraction, checkExitCollision, Save } = global.InakaAdv.Game;

  const canvas = document.getElementById("gameCanvas");
  const renderer = new Renderer(canvas);
  const input = new InputManager();
  const camera = new Camera(canvas.width, canvas.height);
  const sceneManager = new SceneManager(MAPS);

  const gameState = Save.loadGame() || createGameState();
  const dialogue = new DialogueManager();

  const state = {
    currentMap: null,
    player: null,
    enemies: [],
    camera,
    dialogue,
    gameState,
    debug: {
      enabled: false,
      showTileCoords: false,
    },
  };

  function loadMap(mapId, spawnPosition) {
    state.currentMap = sceneManager.loadMap(mapId);
    const position = spawnPosition || state.currentMap.startPosition || { x: 64, y: 64 };
    if (!state.player) {
      state.player = new Player(position.x, position.y);
    } else {
      state.player.setPosition(position.x, position.y);
    }
    state.enemies = instantiateEnemies(state.currentMap, state.currentMap.tileSize);
    dialogue.close();
    camera.follow(state.player, state.currentMap);
  }

  function update(deltaTime) {
    if (input.wasPressed("F1")) {
      state.debug.enabled = !state.debug.enabled;
    }
    if (input.wasPressed("F2")) {
      state.debug.showTileCoords = !state.debug.showTileCoords;
    }

    if (dialogue.isOpen) {
      if (input.wasPressed("KeyE")) {
        dialogue.advance(gameState);
        Save.saveGame(gameState);
      }
      camera.follow(state.player, state.currentMap);
      input.clearPressed();
      return;
    }

    state.player.update(deltaTime, input, state.currentMap, dialogue.isOpen);

    if (input.wasPressed("KeyE")) {
      handleInteraction(state);
      Save.saveGame(gameState);
    }

    const exit = checkExitCollision(state);
    if (exit) {
      loadMap(exit.targetMapId, exit.targetPosition);
    }

    camera.follow(state.player, state.currentMap);
    input.clearPressed();
  }

  function render() {
    renderer.drawGame(state);
  }

  let lastTime = performance.now();

  function gameLoop(now) {
    const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    update(deltaTime);
    render();
    requestAnimationFrame(gameLoop);
  }

  loadMap("startVillage");
  requestAnimationFrame(gameLoop);
})(window);
