(function initDialogue(global) {
  const { DIALOGUES } = global.InakaAdv.Data;

  class DialogueManager {
    constructor() {
      this.isOpen = false;
      this.currentDialogue = null;
      this.pageIndex = 0;
      this.currentText = "";
      this.speaker = "";
    }

    open(dialogueId, speaker) {
      const dialogue = DIALOGUES[dialogueId];
      if (!dialogue) {
        return;
      }
      this.isOpen = true;
      this.currentDialogue = dialogue;
      this.pageIndex = 0;
      this.speaker = speaker || "";
      this.currentText = dialogue.pages[0] || "";
    }

    advance(gameState) {
      if (!this.isOpen || !this.currentDialogue) {
        return false;
      }

      this.pageIndex += 1;
      if (this.pageIndex >= this.currentDialogue.pages.length) {
        if (typeof this.currentDialogue.onComplete === "function") {
          this.currentDialogue.onComplete(gameState);
        }
        this.close();
        return true;
      }

      this.currentText = this.currentDialogue.pages[this.pageIndex];
      return false;
    }

    close() {
      this.isOpen = false;
      this.currentDialogue = null;
      this.pageIndex = 0;
      this.currentText = "";
      this.speaker = "";
    }
  }

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Game = global.InakaAdv.Game || {};
  global.InakaAdv.Game.DialogueManager = DialogueManager;
})(window);
