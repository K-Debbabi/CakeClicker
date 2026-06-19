'use strict';

const Save = (() => {

  function save() {
    try {
      gameState.lastSaveTime = Date.now();
      const data = {
        version:         CONFIG.SAVE_VERSION,
        savedAt:         gameState.lastSaveTime,

        // Base values
        cookies:         gameState.cookies,
        totalCookies:    gameState.totalCookies,
        totalClicks:     gameState.totalClicks,

        // Prestige (permanent)
        prestigeCount:           gameState.prestigeCount,
        heavenlyChips:           gameState.heavenlyChips,
        heavenlyChipsMultiplier: gameState.heavenlyChipsMultiplier,

        // Stats
        goldenCakesClicked:   gameState.goldenCakesClicked,
        totalCriticalClicks:  gameState.totalCriticalClicks,

        // Building COUNTS only – multipliers are recomputed from upgrades on load
        buildings: Object.fromEntries(
          BUILDINGS.map(def => [def.id, { count: gameState.buildings[def.id]?.count ?? 0 }])
        ),

        // Which upgrades were purchased
        upgrades: gameState.upgrades,

        // Which achievements were unlocked
        achievements: gameState.achievements,

        lastTickTime: gameState.lastTickTime,
      };
      localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(CONFIG.SAVE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw);
      if (!data.version || data.version < CONFIG.SAVE_VERSION) _migrate(data);

      // Base values
      gameState.cookies       = data.cookies       ?? 0;
      gameState.totalCookies  = data.totalCookies  ?? 0;
      gameState.totalClicks   = data.totalClicks   ?? 0;
      gameState.lastTickTime  = data.lastTickTime  ?? Date.now();
      gameState.lastSaveTime  = data.savedAt       ?? Date.now();

      // Stats
      gameState.goldenCakesClicked  = data.goldenCakesClicked  ?? 0;
      gameState.totalCriticalClicks = data.totalCriticalClicks ?? 0;

      // Prestige
      gameState.prestigeCount           = data.prestigeCount           ?? 0;
      gameState.heavenlyChips           = data.heavenlyChips           ?? 0;
      gameState.heavenlyChipsMultiplier = data.heavenlyChipsMultiplier ?? 1;

      // Building counts (reset multipliers to 1 — they'll be rebuilt by upgrades below)
      if (data.buildings) {
        BUILDINGS.forEach(def => {
          const saved = data.buildings[def.id];
          gameState.buildings[def.id] = {
            count:      saved?.count ?? 0,
            multiplier: 1, // always reset; upgrades rebuild this
          };
        });
      }

      // Reset derived click values before upgrade application
      gameState.clickMultiplier = 1;
      gameState.critChance      = CONFIG.BASE_CRIT_CHANCE;

      // Apply bought upgrades to rebuild all multipliers correctly
      if (data.upgrades) {
        UPGRADES.forEach(u => {
          if (data.upgrades[u.id] === true) {
            gameState.upgrades[u.id] = true;
            _applyUpgrade(u);
          }
        });
      }

      // Achievements
      if (data.achievements) {
        ACHIEVEMENTS.forEach(a => {
          if (data.achievements[a.id] === true) {
            gameState.achievements[a.id] = true;
          }
        });
      }

      return true;
    } catch (e) {
      console.error('Load error:', e);
      return false;
    }
  }

  function calculateOfflineProgress() {
    const now         = Date.now();
    const offlineSecs = (now - (gameState.lastTickTime ?? now)) / 1000;
    if (offlineSecs < 60) return 0;

    const capped = Math.min(offlineSecs, CONFIG.MAX_OFFLINE_SECONDS);
    let cps = 0;
    BUILDINGS.forEach(def => {
      const state = gameState.buildings[def.id];
      if (!state || state.count === 0) return;
      cps += def.baseCps * state.count * (state.multiplier ?? 1);
    });
    cps *= gameState.heavenlyChipsMultiplier;
    return Math.floor(cps * capped);
  }

  function deleteSave() {
    try { localStorage.removeItem(CONFIG.SAVE_KEY); } catch (e) { /* ignore */ }
  }

  function _applyUpgrade(upgrade) {
    switch (upgrade.type) {
      case 'click':
        gameState.clickMultiplier *= upgrade.multiplier;
        break;
      case 'building':
        if (gameState.buildings[upgrade.buildingId]) {
          gameState.buildings[upgrade.buildingId].multiplier *= upgrade.multiplier;
        }
        break;
      case 'all_buildings':
        Object.keys(gameState.buildings).forEach(id => {
          if (gameState.buildings[id]) {
            gameState.buildings[id].multiplier *= upgrade.multiplier;
          }
        });
        break;
      case 'crit_chance':
        gameState.critChance = Math.min(gameState.critChance + upgrade.critBonus, 0.25);
        break;
    }
  }

  function _migrate(data) {
    // Ensure all v3 fields exist with safe defaults
    if (data.clickMultiplier === undefined)        data.clickMultiplier        = 1;
    if (data.totalClicks === undefined)            data.totalClicks            = 0;
    if (data.lastTickTime === undefined)           data.lastTickTime           = Date.now();
    if (data.goldenCakesClicked === undefined)     data.goldenCakesClicked     = 0;
    if (data.totalCriticalClicks === undefined)    data.totalCriticalClicks    = 0;
    if (data.prestigeCount === undefined)          data.prestigeCount          = 0;
    if (data.heavenlyChips === undefined)          data.heavenlyChips          = 0;
    if (data.heavenlyChipsMultiplier === undefined) data.heavenlyChipsMultiplier = 1;

    // Strip out saved multipliers (old v1/v2 saves had them baked in)
    // The load routine now resets them to 1 and rebuilds from upgrades, so this is safe.
    if (data.buildings) {
      Object.keys(data.buildings).forEach(id => {
        if (data.buildings[id]) data.buildings[id].multiplier = 1;
      });
    }

    data.version = CONFIG.SAVE_VERSION;
  }

  return { save, load, calculateOfflineProgress, deleteSave };

})();
