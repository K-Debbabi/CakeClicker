'use strict';

/* ==========================================================================
   CONFIG
   ========================================================================== */
const CONFIG = {
  TICK_INTERVAL_MS:       100,
  AUTO_SAVE_INTERVAL_MS:  30_000,
  MAX_OFFLINE_SECONDS:    8 * 60 * 60,
  BUILDING_PRICE_SCALE:   1.15,
  BASE_COOKIES_PER_CLICK: 1,
  SAVE_KEY:               'kuchenClicker_save',
  SAVE_VERSION:           3,
  SHOP_RENDER_TICKS:      5,
  BASE_CRIT_CHANCE:       0.01,
  CRIT_MULTIPLIER:        7,
  GOLDEN_CAKE_MIN_INTERVAL: 60,    // seconds
  GOLDEN_CAKE_MAX_INTERVAL: 300,
  GOLDEN_CAKE_LIFETIME:     13,    // seconds
  FRENZY_DURATION:          77,    // seconds
  CLICK_FRENZY_DURATION:    13,    // seconds
  PRESTIGE_THRESHOLD:       1e12,  // 1 trillion to prestige
};

/* ==========================================================================
   BUILDINGS
   ========================================================================== */
const BUILDINGS = [
  {
    id: 'hausbackofen', name: 'Hausbackofen', icon: '🔥',
    description: 'Ein alter, zuverlässiger Ofen. Backt gemütlich vor sich hin.',
    baseCps: 0.1, basePrice: 15,
  },
  {
    id: 'kleine_baeckerei', name: 'Kleine Bäckerei', icon: '🏠',
    description: 'Eine gemütliche Backstube in der Nachbarschaft.',
    baseCps: 0.5, basePrice: 100,
  },
  {
    id: 'konditorei', name: 'Konditorei', icon: '🎂',
    description: 'Spezialisiert auf feine Torten und Kunstwerke aus Teig.',
    baseCps: 4, basePrice: 500,
  },
  {
    id: 'kuchenfabrik', name: 'Kuchenfabrik', icon: '🏭',
    description: 'Automatisierte Produktion – Kuchen am laufenden Band!',
    baseCps: 20, basePrice: 3_000,
  },
  {
    id: 'magische_kuchenmaschine', name: 'Magische Kuchenmaschine', icon: '✨',
    description: 'Von Zauberlehrlingen konstruiert. Backkunst trifft Magie.',
    baseCps: 100, basePrice: 20_000,
  },
  {
    id: 'kuchenportal', name: 'Kuchenportal', icon: '🌀',
    description: 'Liefert Kuchen aus anderen Dimensionen. Quantengebäck.',
    baseCps: 400, basePrice: 100_000,
  },
  {
    id: 'zeitbaeckerei', name: 'Zeitbäckerei', icon: '⏳',
    description: 'Backt Kuchen aus Vergangenheit und Zukunft gleichzeitig.',
    baseCps: 1_600, basePrice: 500_000,
  },
  {
    id: 'kuchenplanet', name: 'Kuchenplanet', icon: '🌍',
    description: 'Ein ganzer Planet aus reinem Kuchenteig. Planetare Backkapazität.',
    baseCps: 8_000, basePrice: 5_000_000,
  },
  {
    id: 'kuchengalaxie', name: 'Kuchengalaxie', icon: '🌌',
    description: 'Millionen Kuchensterne erzeugen endlose Kuchenenergie.',
    baseCps: 40_000, basePrice: 50_000_000,
  },
  {
    id: 'kuchenuniversum', name: 'Kuchenuniversum', icon: '🔭',
    description: 'Das gesamte Universum besteht aus Kuchen. Du hast es erschaffen.',
    baseCps: 200_000, basePrice: 500_000_000,
  },
  {
    id: 'goettliche_baeckerei', name: 'Göttliche Bäckerei', icon: '⚡',
    description: 'Götter selbst kneten hier den heiligen Teig der Schöpfung.',
    baseCps: 1_000_000, basePrice: 10_000_000_000,
  },
  {
    id: 'unsterbliche_kuchenquelle', name: 'Unsterbliche Kuchenquelle', icon: '♾️',
    description: 'Die Urquelle aller Kuchen. Jenseits von Zeit und Raum.',
    baseCps: 10_000_000, basePrice: 500_000_000_000,
  },
];

/* ==========================================================================
   ACHIEVEMENTS
   ========================================================================== */
const ACHIEVEMENTS = [
  // Click milestones
  { id: 'erster_bissen',     name: 'Erster Bissen',      description: 'Klicke zum ersten Mal.',            icon: '👆', condition: s => s.totalClicks >= 1 },
  { id: 'fleissig',          name: 'Fleißiger Bäcker',   description: '100 Klicks.',                        icon: '💪', condition: s => s.totalClicks >= 100 },
  { id: 'klick_profi',       name: 'Klick-Profi',        description: '1.000 Klicks.',                      icon: '🖱️', condition: s => s.totalClicks >= 1_000 },
  { id: 'klick_wahnsinn',    name: 'Klick-Wahnsinn',     description: '10.000 Klicks.',                     icon: '⚡', condition: s => s.totalClicks >= 10_000 },
  { id: 'klick_gott',        name: 'Klick-Gott',         description: '100.000 Klicks.',                    icon: '🌩️', condition: s => s.totalClicks >= 100_000 },

  // Cookie production
  { id: 'tausend',           name: '1.000 Kuchen',       description: '1.000 Kuchen gebacken.',             icon: '🍰', condition: s => s.totalCookies >= 1_000 },
  { id: 'zehntausend',       name: '10.000 Kuchen',      description: '10.000 Kuchen gebacken.',            icon: '🎂', condition: s => s.totalCookies >= 10_000 },
  { id: 'million',           name: 'Millionär',          description: '1 Million Kuchen gebacken.',         icon: '💰', condition: s => s.totalCookies >= 1_000_000 },
  { id: 'milliarde',         name: 'Milliardär',         description: '1 Milliarde Kuchen gebacken.',       icon: '👑', condition: s => s.totalCookies >= 1_000_000_000 },
  { id: 'billion',           name: 'Billionär',          description: '1 Billion Kuchen gebacken.',         icon: '🚀', condition: s => s.totalCookies >= 1_000_000_000_000 },
  { id: 'quadrillion',       name: 'Kuchenimperator',   description: '1 Billiarde Kuchen gebacken.',       icon: '🌌', condition: s => s.totalCookies >= 1_000_000_000_000_000 },

  // Buildings
  { id: 'erstes_gebaeude',   name: 'Erstes Gebäude',     description: 'Kaufe dein erstes Gebäude.',         icon: '🏗️', condition: s => Object.values(s.buildings).some(b => b.count >= 1) },
  { id: 'fuenf_gebaeude',    name: 'Bäckereibesitzer',   description: 'Besitze 5 Gebäude.',                 icon: '🏠', condition: s => Object.values(s.buildings).reduce((n, b) => n + b.count, 0) >= 5 },
  { id: 'zwanzig_gebaeude',  name: 'Industriebäcker',    description: 'Besitze 20 Gebäude.',                icon: '🏙️', condition: s => Object.values(s.buildings).reduce((n, b) => n + b.count, 0) >= 20 },
  { id: 'fuenfzig_gebaeude', name: 'Kuchenkonzern',      description: 'Besitze 50 Gebäude.',                icon: '🌆', condition: s => Object.values(s.buildings).reduce((n, b) => n + b.count, 0) >= 50 },
  { id: 'hundert_gebaeude',  name: 'Kuchenimperium',     description: 'Besitze 100 Gebäude.',               icon: '🏰', condition: s => Object.values(s.buildings).reduce((n, b) => n + b.count, 0) >= 100 },

  // CPS thresholds
  { id: 'zehn_cps',          name: 'Fleißig',            description: '10 Kuchen/s erreicht.',              icon: '🔥', condition: s => s.cookiesPerSecond >= 10 },
  { id: 'hundert_cps',       name: 'Kuchenmaschinerie',  description: '100 Kuchen/s erreicht.',             icon: '⚙️', condition: s => s.cookiesPerSecond >= 100 },
  { id: 'tausend_cps',       name: 'Kuchenstrom',        description: '1.000 Kuchen/s erreicht.',           icon: '⚡', condition: s => s.cookiesPerSecond >= 1_000 },
  { id: 'million_cps',       name: 'Kuchenflut',         description: '1 Million Kuchen/s erreicht.',       icon: '🌊', condition: s => s.cookiesPerSecond >= 1_000_000 },
  { id: 'milliarde_cps',     name: 'Göttliche Rate',     description: '1 Milliarde Kuchen/s erreicht.',     icon: '🌟', condition: s => s.cookiesPerSecond >= 1_000_000_000 },

  // Upgrades
  { id: 'erstes_upgrade',    name: 'Upgrade-Fan',        description: 'Kaufe dein erstes Upgrade.',         icon: '⬆️', condition: s => Object.values(s.upgrades).filter(Boolean).length >= 1 },
  { id: 'zehn_upgrades',     name: 'Upgrade-Sammler',    description: '10 Upgrades gekauft.',               icon: '🌟', condition: s => Object.values(s.upgrades).filter(Boolean).length >= 10 },
  { id: 'zwanzig_upgrades',  name: 'Upgrade-Meister',    description: '20 Upgrades gekauft.',               icon: '💎', condition: s => Object.values(s.upgrades).filter(Boolean).length >= 20 },

  // Golden cakes
  { id: 'goldener_kuchen',   name: 'Goldener Treffer',   description: 'Klicke deinen ersten goldenen Kuchen.', icon: '✨', condition: s => s.goldenCakesClicked >= 1 },
  { id: 'goldener_profi',    name: 'Goldenjäger',        description: '10 goldene Kuchen geklickt.',        icon: '🌟', condition: s => s.goldenCakesClicked >= 10 },
  { id: 'goldener_gott',     name: 'Goldener Gott',      description: '50 goldene Kuchen geklickt.',        icon: '🏆', condition: s => s.goldenCakesClicked >= 50 },

  // Crits
  { id: 'erster_crit',       name: 'Kritischer Treffer', description: 'Erziele deinen ersten Kritischen Treffer.', icon: '💥', condition: s => s.totalCriticalClicks >= 1 },
  { id: 'crit_profi',        name: 'Kritisch-Meister',   description: '100 kritische Treffer erzielt.',    icon: '🎯', condition: s => s.totalCriticalClicks >= 100 },

  // Buildings specific
  { id: 'konditorei_besitzer', name: 'Konditor-Meister', description: 'Besitze eine Konditorei.',          icon: '🎓', condition: s => (s.buildings['konditorei']?.count ?? 0) >= 1 },
  { id: 'planet_besitzer',   name: 'Planetenbackgott',   description: 'Besitze einen Kuchenplaneten.',     icon: '🌍', condition: s => (s.buildings['kuchenplanet']?.count ?? 0) >= 1 },
  { id: 'universum_besitzer',name: 'Schöpfer',           description: 'Besitze ein Kuchenuniversum.',      icon: '🔭', condition: s => (s.buildings['kuchenuniversum']?.count ?? 0) >= 1 },

  // Prestige
  { id: 'erster_aufstieg',   name: 'Aufsteiger',         description: 'Steige zum ersten Mal auf.',        icon: '👑', condition: s => s.prestigeCount >= 1 },
  { id: 'dritter_aufstieg',  name: 'Legionär',           description: 'Steige dreimal auf.',               icon: '🌠', condition: s => s.prestigeCount >= 3 },
];

/* ==========================================================================
   MILESTONES
   ========================================================================== */
const MILESTONES = [
  { label: 'Erste 10 Kuchen!',              target: 10 },
  { label: 'Erste 100 Kuchen!',             target: 100 },
  { label: '1.000 Kuchen!',                 target: 1_000 },
  { label: '10.000 Kuchen!',                target: 10_000 },
  { label: '100.000 Kuchen!',               target: 100_000 },
  { label: '1 Million Kuchen!',             target: 1_000_000 },
  { label: '1 Milliarde Kuchen!',           target: 1_000_000_000 },
  { label: '1 Billion Kuchen!',             target: 1_000_000_000_000 },
  { label: '1 Billiarde Kuchen!',           target: 1_000_000_000_000_000 },
  { label: '1 Trillion Kuchen – Prestige!', target: 1_000_000_000_000_000_000 },
];

/* ==========================================================================
   GAME STATE
   ========================================================================== */
let gameState = {
  cookies:           0,
  totalCookies:      0,
  totalClicks:       0,
  cookiesPerSecond:  0,
  cookiesPerClick:   CONFIG.BASE_COOKIES_PER_CLICK,
  clickMultiplier:   1,
  buildings:         {},
  upgrades:          {},
  achievements:      {},
  lastSaveTime:      Date.now(),
  lastTickTime:      Date.now(),

  // New fields
  goldenCakesClicked:   0,
  totalCriticalClicks:  0,
  critChance:           CONFIG.BASE_CRIT_CHANCE,

  // Prestige
  prestigeCount:            0,
  heavenlyChips:            0,
  heavenlyChipsMultiplier:  1,

  // Transient (not saved)
  frenzyActive:       false,
  frenzyEndTime:      0,
  frenzyMultiplier:   1,
  clickFrenzyActive:  false,
  clickFrenzyEndTime: 0,
};

/* ==========================================================================
   GOLDEN CAKE BONUSES
   ========================================================================== */
const GOLDEN_BONUSES = [
  {
    type: 'lucky',
    name: '🍀 Glückskuchen!',
    desc: '+ 15 Minuten Produktion',
    apply() {
      const bonus = Math.floor(gameState.cookiesPerSecond * 60 * 15);
      gameState.cookies      += bonus;
      gameState.totalCookies += bonus;
      return bonus;
    },
  },
  {
    type: 'frenzy',
    name: '🔥 FRENZY!',
    desc: 'x7 Produktion für 77 Sekunden',
    apply() {
      gameState.frenzyActive     = true;
      gameState.frenzyMultiplier = 7;
      gameState.frenzyEndTime    = Date.now() + CONFIG.FRENZY_DURATION * 1000;
      UI.startFrenzyBar(CONFIG.FRENZY_DURATION);
      UI.showFrenzyNotification('🔥 FRENZY! x7 Produktion!');
      return 0;
    },
  },
  {
    type: 'click_frenzy',
    name: '⚡ KLICK-RAUSCH!',
    desc: 'x777 Klick-Kraft für 13 Sekunden',
    apply() {
      gameState.clickFrenzyActive  = true;
      gameState.clickFrenzyEndTime = Date.now() + CONFIG.CLICK_FRENZY_DURATION * 1000;
      UI.showFrenzyNotification('⚡ KLICK-RAUSCH! x777!');
      document.getElementById('panel-center')?.classList.add('panel--click-frenzy');
      setTimeout(() => {
        document.getElementById('panel-center')?.classList.remove('panel--click-frenzy');
      }, CONFIG.CLICK_FRENZY_DURATION * 1000);
      return 0;
    },
  },
  {
    type: 'cookie_storm',
    name: '🌧️ Kuchen-Sturm!',
    desc: '+ 5 Minuten Produktion und Partikel-Regen',
    apply() {
      const bonus = Math.floor(gameState.cookiesPerSecond * 60 * 5);
      gameState.cookies      += bonus;
      gameState.totalCookies += bonus;
      UI.triggerCookieStorm();
      return bonus;
    },
  },
];

/* ==========================================================================
   GAME MODULE
   ========================================================================== */
const Game = (() => {

  let _tickCount = 0;
  let _lastClickTime = 0;
  let _combo = 1;
  let _comboResetTimer = null;

  // ------------------------------------------------------------------
  //  Init
  // ------------------------------------------------------------------
  function init() {
    _initBuildingStates();
    _initUpgradeStates();
    _initAchievementStates();

    Save.load();

    const offline = Save.calculateOfflineProgress();
    if (offline > 0) {
      gameState.cookies      += offline;
      gameState.totalCookies += offline;
      UI.showOfflineBanner(offline);
    }

    _recalculate();
    UI.init();
    Shop.render();

    setInterval(_tick, CONFIG.TICK_INTERVAL_MS);
    setInterval(() => { Save.save(); UI.showSaveFeedback(); }, CONFIG.AUTO_SAVE_INTERVAL_MS);

    // Start golden cake spawner
    _scheduleNextGoldenCake();

    console.log('🍰 Kuchen Clicker ULTRA gestartet!');
  }

  function _initBuildingStates() {
    BUILDINGS.forEach(b => {
      if (!gameState.buildings[b.id]) {
        gameState.buildings[b.id] = { count: 0, multiplier: 1 };
      }
    });
  }

  function _initUpgradeStates() {
    if (typeof UPGRADES !== 'undefined') {
      UPGRADES.forEach(u => {
        if (gameState.upgrades[u.id] === undefined) {
          gameState.upgrades[u.id] = false;
        }
      });
    }
  }

  function _initAchievementStates() {
    ACHIEVEMENTS.forEach(a => {
      if (gameState.achievements[a.id] === undefined) {
        gameState.achievements[a.id] = false;
      }
    });
  }

  // ------------------------------------------------------------------
  //  Tick
  // ------------------------------------------------------------------
  function _tick() {
    _tickCount++;
    const now = Date.now();
    const dt  = CONFIG.TICK_INTERVAL_MS / 1000;

    // Check frenzy expiry
    if (gameState.frenzyActive && now > gameState.frenzyEndTime) {
      gameState.frenzyActive    = false;
      gameState.frenzyMultiplier = 1;
      document.getElementById('panel-center')?.classList.remove('panel--frenzy');
      UI.stopFrenzyBar();
    }
    if (gameState.clickFrenzyActive && now > gameState.clickFrenzyEndTime) {
      gameState.clickFrenzyActive = false;
    }

    // Update frenzy bar
    if (gameState.frenzyActive) {
      const remaining = (gameState.frenzyEndTime - now) / 1000;
      UI.updateFrenzyBar(remaining, CONFIG.FRENZY_DURATION);
    }

    // Passive income (with frenzy multiplier)
    const frenzyMult = gameState.frenzyActive ? gameState.frenzyMultiplier : 1;
    const gain = gameState.cookiesPerSecond * dt * frenzyMult;
    if (gain > 0) {
      gameState.cookies      += gain;
      gameState.totalCookies += gain;
    }

    gameState.lastTickTime = now;

    _checkAchievements();
    UI.updateStats();

    if (_tickCount % CONFIG.SHOP_RENDER_TICKS === 0) {
      Shop.updateAffordability();
      UI.updateOwnedBuildings();
      UI.updateMilestone();
      UI.updatePrestigeSection();
    }
  }

  // ------------------------------------------------------------------
  //  Recalculate
  // ------------------------------------------------------------------
  function _recalculate() {
    let totalCps = 0;
    BUILDINGS.forEach(def => {
      const state = gameState.buildings[def.id];
      if (!state) return;
      totalCps += def.baseCps * state.count * state.multiplier;
    });

    // Apply heavenly chips multiplier
    totalCps *= gameState.heavenlyChipsMultiplier;

    gameState.cookiesPerSecond = totalCps;
    gameState.cookiesPerClick  = Math.max(1, CONFIG.BASE_COOKIES_PER_CLICK * gameState.clickMultiplier);
  }

  // ------------------------------------------------------------------
  //  Achievements
  // ------------------------------------------------------------------
  function _checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (gameState.achievements[a.id]) return;
      if (a.condition(gameState)) {
        gameState.achievements[a.id] = true;
        UI.showAchievementToast(a);
        UI.updateAchievements();
      }
    });
  }

  // ------------------------------------------------------------------
  //  Cake Click
  // ------------------------------------------------------------------
  function handleCakeClick(event) {
    const now = Date.now();

    // Combo system
    if (now - _lastClickTime < 350) {
      _combo = Math.min(_combo + 1, 100);
    } else {
      _combo = 1;
    }
    _lastClickTime = now;
    clearTimeout(_comboResetTimer);
    _comboResetTimer = setTimeout(() => {
      _combo = 1;
      UI.updateComboDisplay(1, 1, false);
    }, 2000);

    const comboMult = _getComboMultiplier(_combo);

    // Critical hit
    const isCrit = Math.random() < gameState.critChance;
    const critMult = isCrit ? CONFIG.CRIT_MULTIPLIER : 1;

    // Click frenzy
    const clickFrenzyMult = gameState.clickFrenzyActive ? 777 : 1;

    let gained = gameState.cookiesPerClick * comboMult * critMult * clickFrenzyMult;
    // Also scale by heavenly chips
    gained *= gameState.heavenlyChipsMultiplier;

    gameState.cookies      += gained;
    gameState.totalCookies += gained;
    gameState.totalClicks  += 1;

    if (isCrit) {
      gameState.totalCriticalClicks += 1;
      UI.triggerCritEffect(gained, event);
    } else {
      UI.spawnFloatNumber(gained, event, isCrit);
    }

    UI.spawnParticles(event, isCrit);
    UI.triggerCakeAnimation(isCrit);
    UI.updateComboDisplay(_combo, comboMult, _combo >= 5);
    UI.updateStats();
  }

  function _getComboMultiplier(combo) {
    if (combo >= 100) return 5;
    if (combo >= 50)  return 3;
    if (combo >= 20)  return 2;
    if (combo >= 10)  return 1.5;
    if (combo >= 5)   return 1.2;
    return 1;
  }

  // ------------------------------------------------------------------
  //  Golden Cake
  // ------------------------------------------------------------------
  function _scheduleNextGoldenCake() {
    const delay = (CONFIG.GOLDEN_CAKE_MIN_INTERVAL +
      Math.random() * (CONFIG.GOLDEN_CAKE_MAX_INTERVAL - CONFIG.GOLDEN_CAKE_MIN_INTERVAL)) * 1000;
    setTimeout(() => {
      UI.spawnGoldenCake();
      _scheduleNextGoldenCake();
    }, delay);
  }

  function handleGoldenCakeClick() {
    gameState.goldenCakesClicked += 1;
    const bonus = GOLDEN_BONUSES[Math.floor(Math.random() * GOLDEN_BONUSES.length)];
    const amount = bonus.apply();
    UI.showGoldenBonus(bonus.name, bonus.desc, amount);
    if (bonus.type === 'frenzy') {
      document.getElementById('panel-center')?.classList.add('panel--frenzy');
    }
    _recalculate();
    UI.updateStats();
  }

  // ------------------------------------------------------------------
  //  Buildings
  // ------------------------------------------------------------------
  function getBuildingPrice(buildingId) {
    const def   = BUILDINGS.find(b => b.id === buildingId);
    const state = gameState.buildings[buildingId];
    if (!def || !state) return Infinity;
    return Math.floor(def.basePrice * Math.pow(CONFIG.BUILDING_PRICE_SCALE, state.count));
  }

  function buyBuilding(buildingId) {
    const price = getBuildingPrice(buildingId);
    if (gameState.cookies < price) return false;

    gameState.cookies -= price;
    gameState.buildings[buildingId].count += 1;
    _recalculate();
    UI.updateStats();
    Shop.render();
    UI.updateOwnedBuildings();
    UI.playSound('buy');
    return true;
  }

  // ------------------------------------------------------------------
  //  Upgrades
  // ------------------------------------------------------------------
  function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade || gameState.upgrades[upgradeId]) return false;
    if (gameState.cookies < upgrade.price) return false;

    gameState.cookies -= upgrade.price;
    gameState.upgrades[upgradeId] = true;
    _applyUpgradeEffect(upgrade);
    _recalculate();
    UI.updateStats();
    Shop.render();
    UI.playSound('upgrade');
    return true;
  }

  function _applyUpgradeEffect(upgrade) {
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
          gameState.buildings[id].multiplier *= upgrade.multiplier;
        });
        break;
      case 'crit_chance':
        gameState.critChance = Math.min(gameState.critChance + upgrade.critBonus, 0.25);
        break;
      default:
        console.warn('Unbekannter Upgrade-Typ:', upgrade.type);
    }
  }

  // ------------------------------------------------------------------
  //  Prestige
  // ------------------------------------------------------------------
  function getPrestigeChips() {
    return Math.floor(Math.sqrt(gameState.totalCookies / CONFIG.PRESTIGE_THRESHOLD));
  }

  function canPrestige() {
    return getPrestigeChips() >= 1;
  }

  function prestige() {
    if (!canPrestige()) return;

    const newChips = getPrestigeChips();
    gameState.heavenlyChips           += newChips;
    gameState.prestigeCount           += 1;
    gameState.heavenlyChipsMultiplier  = 1 + (gameState.heavenlyChips * 0.01);

    // Reset run state
    gameState.cookies        = 0;
    gameState.totalCookies   = 0;
    gameState.totalClicks    = 0;
    gameState.clickMultiplier = 1;
    gameState.critChance      = CONFIG.BASE_CRIT_CHANCE;
    gameState.goldenCakesClicked  = 0;
    gameState.totalCriticalClicks = 0;
    gameState.frenzyActive    = false;
    gameState.frenzyMultiplier = 1;
    gameState.clickFrenzyActive = false;

    BUILDINGS.forEach(b => {
      gameState.buildings[b.id] = { count: 0, multiplier: 1 };
    });
    UPGRADES.forEach(u => { gameState.upgrades[u.id] = false; });
    ACHIEVEMENTS.forEach(a => { gameState.achievements[a.id] = false; });

    _recalculate();
    Save.save();
    window.location.reload();
  }

  // ------------------------------------------------------------------
  //  Reset
  // ------------------------------------------------------------------
  function resetGame() {
    Save.deleteSave();
    window.location.reload();
  }

  // ------------------------------------------------------------------
  //  Public API
  // ------------------------------------------------------------------
  return {
    init,
    handleCakeClick,
    handleGoldenCakeClick,
    getBuildingPrice,
    buyBuilding,
    buyUpgrade,
    canPrestige,
    getPrestigeChips,
    prestige,
    resetGame,
    recalculate: _recalculate,
  };

})();

/* ==========================================================================
   HELPERS
   ========================================================================== */
function formatNumber(n, decimals = 1) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  n = Math.floor(n);
  if (n < 1_000) return n.toString();
  if (n < 1_000_000) return n.toLocaleString('de-DE');
  if (n < 1_000_000_000)             return (n / 1_000_000).toFixed(decimals) + ' Mio.';
  if (n < 1_000_000_000_000)         return (n / 1_000_000_000).toFixed(decimals) + ' Mrd.';
  if (n < 1_000_000_000_000_000)     return (n / 1_000_000_000_000).toFixed(decimals) + ' Bio.';
  if (n < 1_000_000_000_000_000_000) return (n / 1_000_000_000_000_000).toFixed(decimals) + ' Brd.';
  return (n / 1_000_000_000_000_000_000).toFixed(decimals) + ' Tri.';
}

function formatCps(n) {
  if (n < 1)  return n.toFixed(2);
  if (n < 10) return n.toFixed(1);
  return formatNumber(n, 1);
}

function getCurrentMilestone() {
  for (const m of MILESTONES) {
    if (gameState.totalCookies < m.target) {
      return { ...m, progress: Math.min(1, gameState.totalCookies / m.target) };
    }
  }
  return null;
}
