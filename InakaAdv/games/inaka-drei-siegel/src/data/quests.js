(function initQuests(global) {
  const INITIAL_FLAGS = {
    heardPortalRumor: false,
    shrineQuestStarted: false,
    firstSealFound: false,
  };

  const QUESTS = {
    mainQuest: {
      id: "mainQuest",
      title: "Die drei Siegel",
      description: "Finde Hinweise am verdorbenen Schrein und bereite die Siegel gegen das Portal vor.",
    },
  };

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.INITIAL_FLAGS = INITIAL_FLAGS;
  global.InakaAdv.Data.QUESTS = QUESTS;
})(window);
