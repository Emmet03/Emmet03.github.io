(function initItemData(global) {
  const ITEMS = {
    firstSeal: {
      id: "firstSeal",
      name: "Erstes Siegel",
      description: "Ein altes Zeichen gegen die Verbannten.",
    },
  };

  global.InakaAdv = global.InakaAdv || {};
  global.InakaAdv.Data = global.InakaAdv.Data || {};
  global.InakaAdv.Data.ITEMS = ITEMS;
})(window);
