(function initInput(global) {
  class InputManager {
    constructor() {
      this.keysDown = new Set();
      this.pressedThisFrame = new Set();
      this.bindEvents();
    }

    bindEvents() {
      window.addEventListener("keydown", (event) => {
        const code = event.code;
        if (!this.keysDown.has(code)) {
          this.pressedThisFrame.add(code);
        }
        this.keysDown.add(code);

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "F1", "F2"].includes(code)) {
          event.preventDefault();
        }
      });

      window.addEventListener("keyup", (event) => {
        this.keysDown.delete(event.code);
      });
    }

    isDown(code) {
      return this.keysDown.has(code);
    }

    wasPressed(code) {
      return this.pressedThisFrame.has(code);
    }

    clearPressed() {
      this.pressedThisFrame.clear();
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Engine = global.InakaAdv.Engine || {};
  global.InakaAdv.Engine.InputManager = InputManager;
})(window);
