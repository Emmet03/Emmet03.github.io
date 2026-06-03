(function initDialogues(global) {
  const DIALOGUES = {
    elderIntro: {
      id: "elderIntro",
      pages: [
        "Der Nebel haengt seit Tagen ueber dem Waldweg. Reisende kehren nicht zurueck.",
        "Man sagt, beim verdorbenen Schrein flackert nachts ein kaltes Licht zwischen den Baeumen.",
        "Wenn du den Mut hast, folge der forestRoad und suche nach einem der drei Siegel.",
      ],
      onComplete(gameState) {
        gameState.flags.heardPortalRumor = true;
        gameState.flags.shrineQuestStarted = true;
      },
    },
    villagerWarning: {
      id: "villagerWarning",
      pages: [
        "Ich habe Schritte im Nebel gehoert, obwohl niemand auf dem Weg zu sehen war.",
      ],
    },
    houseLocked: {
      id: "houseLocked",
      pages: [
        "Die Tuer ist verschlossen.",
      ],
    },
    shrineSeal: {
      id: "shrineSeal",
      pages: [
        "Ein kalter Hauch steigt aus dem Stein. Zwischen den Rissen glimmt ein altes Zeichen.",
        "Du spuerst, dass dies nur das erste von drei Siegeln ist.",
      ],
      onComplete(gameState) {
        gameState.flags.firstSealFound = true;
      },
    },
  };

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.DIALOGUES = DIALOGUES;
})(window);
