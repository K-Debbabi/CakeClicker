/**
 * game.js – Zentrale Spiellogik für Kuchen Clicker
 * =====================================================
 * Diese Datei enthält:
 *  - CONFIG: Alle Spielkonstanten an einem Ort
 *  - BUILDINGS: Array mit allen Gebäude-Definitionen
 *  - ACHIEVEMENTS: Array mit allen Erfolgs-Definitionen
 *  - gameState: Das zentrale Spielzustands-Objekt
 *  - Game: Modul mit Init-, Tick- und Kern-Spielfunktionen
 *
 * Muss als ERSTE JS-Datei geladen werden, da alle anderen
 * Module auf Game und gameState zugreifen.
 */

'use strict';

/* ==========================================================================
   KONFIGURATION – Alle Spielkonstanten hier anpassen
   ========================================================================== */
const CONFIG = {
  /** Tick-Rate in Millisekunden (100ms = 10 Ticks/Sekunde) */
  TICK_INTERVAL_MS: 100,

  /** Auto-Save alle X Millisekunden */
  AUTO_SAVE_INTERVAL_MS: 30_000,

  /** Maximale Offline-Zeit die angerechnet wird (8 Stunden in Sekunden) */
  MAX_OFFLINE_SECONDS: 8 * 60 * 60,

  /** Gebäude-Preis steigt pro Kauf um diesen Faktor (Cookie Clicker: 1.15) */
  BUILDING_PRICE_SCALE: 1.15,

  /** Basiswert für Kuchen pro Klick */
  BASE_COOKIES_PER_CLICK: 1,

  /** LocalStorage-Schlüssel */
  SAVE_KEY: 'kuchenClicker_save',

  /** Version des Spielstands (für Migrations-Kompatibilität) */
  SAVE_VERSION: 2,

  /** Anzahl der Ticks bis Shop-UI neu gerendert wird */
  SHOP_RENDER_TICKS: 5,
};

/* ==========================================================================
   GEBÄUDE-DEFINITIONEN
   Jedes Gebäude ist ein Objekt mit folgenden Feldern:
     id          – eindeutiger String-Schlüssel
     name        – Anzeigename
     icon        – Emoji für die Anzeige
     description – kurze Beschreibung (erscheint im Shop)
     baseCps     – Kuchen pro Sekunde pro Gebäude (Basis)
     basePrice   – Startpreis (steigt mit jeder Kauf-Instanz)
   ========================================================================== */
const BUILDINGS = [
  {
    id:          'hausbackofen',
    name:        'Hausbackofen',
    icon:        '🔥',
    description: 'Ein alter, zuverlässiger Ofen. Backt gemütlich vor sich hin.',
    baseCps:     0.1,
    basePrice:   15,
  },
  {
    id:          'kleine_baeckerei',
    name:        'Kleine Bäckerei',
    icon:        '🏠',
    description: 'Eine gemütliche Backstube in der Nachbarschaft.',
    baseCps:     0.5,
    basePrice:   100,
  },
  {
    id:          'konditorei',
    name:        'Konditorei',
    icon:        '🎂',
    description: 'Spezialisiert auf feine Torten und Kunstwerke aus Teig.',
    baseCps:     4,
    basePrice:   500,
  },
  {
    id:          'kuchenfabrik',
    name:        'Kuchenfabrik',
    icon:        '🏭',
    description: 'Automatisierte Produktion – Kuchen am laufenden Band!',
    baseCps:     20,
    basePrice:   3_000,
  },
  {
    id:          'magische_kuchenmaschine',
    name:        'Magische Kuchenmaschine',
    icon:        '✨',
    description: 'Von Zauberlehrlingen konstruiert. Backkunst trifft Magie.',
    baseCps:     100,
    basePrice:   20_000,
  },
  {
    id:          'kuchenportal',
    name:        'Kuchenportal',
    icon:        '🌀',
    description: 'Liefert Kuchen aus anderen Dimensionen. Quantengebäck.',
    baseCps:     400,
    basePrice:   100_000,
  },
  {
    id:          'zeitbaeckerei',
    name:        'Zeitbäckerei',
    icon:        '⏳',
    description: 'Backt Kuchen aus der Vergangenheit und der Zukunft gleichzeitig.',
    baseCps:     1_600,
    basePrice:   500_000,
  },
];

/* ==========================================================================
   ACHIEVEMENTS-DEFINITIONEN
   Jedes Achievement hat:
     id          – eindeutiger Schlüssel
     name        – Anzeigename
     description – was wurde erreicht
     icon        – Emoji
     condition   – Funktion(state) → boolean: Wird bei jedem Tick geprüft
   ========================================================================== */
const ACHIEVEMENTS = [
  {
    id:          'erster_bissen',
    name:        'Erster Bissen',
    description: 'Klicke zum ersten Mal auf den Kuchen.',
    icon:        '👆',
    condition:   (s) => s.totalClicks >= 1,
  },
  {
    id:          'fleissiger_baecker',
    name:        'Fleißiger Bäcker',
    description: 'Klicke 100-mal auf den Kuchen.',
    icon:        '💪',
    condition:   (s) => s.totalClicks >= 100,
  },
  {
    id:          'klick_profi',
    name:        'Klick-Profi',
    description: 'Klicke 1.000-mal auf den Kuchen.',
    icon:        '🖱️',
    condition:   (s) => s.totalClicks >= 1_000,
  },
  {
    id:          'erstes_gebaeude',
    name:        'Erstes Gebäude',
    description: 'Kaufe dein erstes Gebäude.',
    icon:        '🏗️',
    condition:   (s) => Object.values(s.buildings).some(b => b.count >= 1),
  },
  {
    id:          'kleine_baeckerei_besitzer',
    name:        'Bäckerei-Besitzer',
    description: 'Besitze insgesamt 5 Gebäude.',
    icon:        '🏠',
    condition:   (s) => Object.values(s.buildings).reduce((sum, b) => sum + b.count, 0) >= 5,
  },
  {
    id:          'grossbetrieb',
    name:        'Großbetrieb',
    description: 'Besitze insgesamt 25 Gebäude.',
    icon:        '🏙️',
    condition:   (s) => Object.values(s.buildings).reduce((sum, b) => sum + b.count, 0) >= 25,
  },
  {
    id:          'tausend_kuchen',
    name:        '1.000 Kuchen',
    description: 'Backe insgesamt 1.000 Kuchen.',
    icon:        '🍰',
    condition:   (s) => s.totalCookies >= 1_000,
  },
  {
    id:          'zehntausend_kuchen',
    name:        '10.000 Kuchen',
    description: 'Backe insgesamt 10.000 Kuchen.',
    icon:        '🎂',
    condition:   (s) => s.totalCookies >= 10_000,
  },
  {
    id:          'million_kuchen',
    name:        'Kuchenmillionär',
    description: 'Backe insgesamt 1.000.000 Kuchen.',
    icon:        '💰',
    condition:   (s) => s.totalCookies >= 1_000_000,
  },
  {
    id:          'milliarde_kuchen',
    name:        'Kuchenmilliardär',
    description: 'Backe insgesamt 1.000.000.000 Kuchen.',
    icon:        '👑',
    condition:   (s) => s.totalCookies >= 1_000_000_000,
  },
  {
    id:          'erster_upgrade',
    name:        'Upgrade-Enthusiast',
    description: 'Kaufe dein erstes Upgrade.',
    icon:        '⬆️',
    condition:   (s) => Object.values(s.upgrades).filter(Boolean).length >= 1,
  },
  {
    id:          'upgrade_sammler',
    name:        'Upgrade-Sammler',
    description: 'Kaufe 5 verschiedene Upgrades.',
    icon:        '🌟',
    condition:   (s) => Object.values(s.upgrades).filter(Boolean).length >= 5,
  },
  {
    id:          'zehn_cps',
    name:        'Fleißige Produktion',
    description: 'Erreiche 10 Kuchen pro Sekunde.',
    icon:        '⚡',
    condition:   (s) => s.cookiesPerSecond >= 10,
  },
  {
    id:          'hundert_cps',
    name:        'Kuchenmaschinerie',
    description: 'Erreiche 100 Kuchen pro Sekunde.',
    icon:        '🚀',
    condition:   (s) => s.cookiesPerSecond >= 100,
  },
  {
    id:          'konditorei_besitzer',
    name:        'Konditor-Meister',
    description: 'Besitze eine Konditorei.',
    icon:        '🎓',
    condition:   (s) => s.buildings['konditorei']?.count >= 1,
  },
];

/* ==========================================================================
   MILESTONES – Ziele die nacheinander angezeigt werden
   ========================================================================== */
const MILESTONES = [
  { label: 'Erste 10 Kuchen backen!',       target: 10 },
  { label: 'Erste 100 Kuchen backen!',      target: 100 },
  { label: '1.000 Kuchen backen!',          target: 1_000 },
  { label: '10.000 Kuchen backen!',         target: 10_000 },
  { label: '100.000 Kuchen backen!',        target: 100_000 },
  { label: '1 Million Kuchen backen!',      target: 1_000_000 },
  { label: '1 Milliarde Kuchen backen!',    target: 1_000_000_000 },
  { label: '1 Billion Kuchen backen!',      target: 1_000_000_000_000 },
];

/* ==========================================================================
   ZENTRALES SPIELZUSTANDS-OBJEKT
   Alle veränderlichen Spieldaten befinden sich hier.
   Dieses Objekt wird in localStorage gespeichert/geladen.
   ========================================================================== */
let gameState = {
  /** Aktuell verfügbare Kuchen */
  cookies:            0,

  /** Gesamt jemals produzierte Kuchen (für Achievements) */
  totalCookies:       0,

  /** Gesamte Klicks aller Zeiten */
  totalClicks:        0,

  /** Berechnete Kuchen pro Sekunde (wird beim Tick neu berechnet) */
  cookiesPerSecond:   0,

  /** Berechnete Kuchen pro Klick (Basiswert * Multiplikator) */
  cookiesPerClick:    CONFIG.BASE_COOKIES_PER_CLICK,

  /** Multiplikator für Klick-Kuchen (durch Upgrades veränderbar) */
  clickMultiplier:    1,

  /**
   * Gebäude-Zustände: { [buildingId]: { count, totalCps, multiplier } }
   * Wird beim Start aus BUILDINGS initialisiert.
   */
  buildings:          {},

  /**
   * Upgrade-Status: { [upgradeId]: boolean }
   * true = gekauft, false/undefined = nicht gekauft
   */
  upgrades:           {},

  /**
   * Achievement-Status: { [achievementId]: boolean }
   */
  achievements:       {},

  /** Unix-Timestamp des letzten Speicherns */
  lastSaveTime:       Date.now(),

  /** Unix-Timestamp des letzten Ticks (für Offline-Berechnung) */
  lastTickTime:       Date.now(),
};

/* ==========================================================================
   GAME-MODUL – Kern-Spiellogik
   ========================================================================== */
const Game = (() => {

  /** Interne Tick-Counter */
  let _tickCount = 0;

  // ------------------------------------------------------------------
  //  Initialisierung
  // ------------------------------------------------------------------

  /**
   * Initialisiert das Spiel:
   * 1. Gebäude-Zustände aus BUILDINGS-Definitionen aufbauen
   * 2. Spielstand aus localStorage laden
   * 3. Offline-Progress berechnen
   * 4. Tick-Loop starten
   * 5. UI erstmalig rendern
   */
  function init() {
    _initBuildingStates();
    _initUpgradeStates();
    _initAchievementStates();

    // Spielstand laden (überschreibt die Default-Werte)
    Save.load();

    // Offline-Progress berechnen und anzeigen
    const offlineCookies = Save.calculateOfflineProgress();
    if (offlineCookies > 0) {
      gameState.cookies      += offlineCookies;
      gameState.totalCookies += offlineCookies;
      UI.showOfflineBanner(offlineCookies);
    }

    // Abgeleitete Werte neu berechnen
    _recalculate();

    // UI initialisieren
    UI.init();
    Shop.render();

    // Tick-Loop starten
    setInterval(_tick, CONFIG.TICK_INTERVAL_MS);

    // Auto-Save starten
    setInterval(() => {
      Save.save();
      UI.showSaveFeedback();
    }, CONFIG.AUTO_SAVE_INTERVAL_MS);

    console.log('🍰 Kuchen Clicker gestartet!');
  }

  /**
   * Initialisiert den buildings-Bereich des gameState
   * aus den BUILDINGS-Definitionen.
   * Wird beim ersten Start aufgerufen, bestehende Werte
   * werden beim Laden überschrieben.
   */
  function _initBuildingStates() {
    BUILDINGS.forEach(b => {
      if (!gameState.buildings[b.id]) {
        gameState.buildings[b.id] = {
          count:      0,       // Anzahl gekaufter Gebäude
          multiplier: 1,       // Multiplikator (durch Upgrades)
        };
      }
    });
  }

  /**
   * Initialisiert den upgrades-Bereich des gameState
   * aus den UPGRADES-Definitionen (in upgrades.js).
   */
  function _initUpgradeStates() {
    if (typeof UPGRADES !== 'undefined') {
      UPGRADES.forEach(u => {
        if (gameState.upgrades[u.id] === undefined) {
          gameState.upgrades[u.id] = false;
        }
      });
    }
  }

  /**
   * Initialisiert den achievements-Bereich des gameState.
   */
  function _initAchievementStates() {
    ACHIEVEMENTS.forEach(a => {
      if (gameState.achievements[a.id] === undefined) {
        gameState.achievements[a.id] = false;
      }
    });
  }

  // ------------------------------------------------------------------
  //  Tick-System
  // ------------------------------------------------------------------

  /**
   * Wird CONFIG.TICK_INTERVAL_MS-mal pro Sekunde aufgerufen.
   * Berechnet passives Einkommen und aktualisiert die UI.
   */
  function _tick() {
    _tickCount++;

    const deltaSeconds = CONFIG.TICK_INTERVAL_MS / 1000;

    // Passives Einkommen berechnen und hinzufügen
    const passiveGain = gameState.cookiesPerSecond * deltaSeconds;
    if (passiveGain > 0) {
      gameState.cookies      += passiveGain;
      gameState.totalCookies += passiveGain;
    }

    // Letzten Tick-Zeitstempel aktualisieren (für Offline-Progress)
    gameState.lastTickTime = Date.now();

    // Achievements prüfen
    _checkAchievements();

    // UI aktualisieren (Hauptzähler immer)
    UI.updateStats();

    // Shop-UI nur alle paar Ticks rendern (Performance)
    if (_tickCount % CONFIG.SHOP_RENDER_TICKS === 0) {
      Shop.updateAffordability();
      UI.updateOwnedBuildings();
      UI.updateMilestone();
    }
  }

  // ------------------------------------------------------------------
  //  Kern-Berechnungen
  // ------------------------------------------------------------------

  /**
   * Berechnet alle abgeleiteten Werte neu:
   *  - cookiesPerSecond (aus Gebäuden + Multiplikatoren)
   *  - cookiesPerClick  (Basis * Multiplikator)
   * Muss aufgerufen werden wenn Gebäude/Upgrades geändert werden.
   */
  function _recalculate() {
    let totalCps = 0;

    // Für jedes Gebäude: Basis-CPS * Anzahl * Gebäude-Multiplikator
    BUILDINGS.forEach(buildingDef => {
      const state = gameState.buildings[buildingDef.id];
      if (!state) return;
      const cps = buildingDef.baseCps * state.count * state.multiplier;
      totalCps += cps;
    });

    gameState.cookiesPerSecond = totalCps;
    gameState.cookiesPerClick  = Math.max(
      1,
      CONFIG.BASE_COOKIES_PER_CLICK * gameState.clickMultiplier
    );
  }

  /**
   * Prüft alle Achievements und schaltet sie frei falls Bedingung erfüllt.
   */
  function _checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      // Bereits freigeschaltet → überspringen
      if (gameState.achievements[achievement.id]) return;

      // Bedingung prüfen
      if (achievement.condition(gameState)) {
        gameState.achievements[achievement.id] = true;
        UI.showAchievementToast(achievement);
        UI.updateAchievements();
      }
    });
  }

  // ------------------------------------------------------------------
  //  Klick-Handler
  // ------------------------------------------------------------------

  /**
   * Wird aufgerufen wenn der Spieler auf den Kuchen klickt.
   * Fügt cookiesPerClick Kuchen hinzu und triggert Animationen.
   */
  function handleCakeClick(event) {
    const gained = gameState.cookiesPerClick;

    gameState.cookies      += gained;
    gameState.totalCookies += gained;
    gameState.totalClicks  += 1;

    // Float-Zahl Animation starten
    UI.spawnFloatNumber(gained, event);

    // Partikel-Effekt
    UI.spawnParticles(event);

    // Kuchen-Wackel-Animation
    UI.triggerCakeAnimation();

    // Stats sofort aktualisieren (nicht auf nächsten Tick warten)
    UI.updateStats();
  }

  // ------------------------------------------------------------------
  //  Gebäude-Kauf
  // ------------------------------------------------------------------

  /**
   * Berechnet den aktuellen Preis für ein Gebäude basierend auf
   * der bereits gekauften Anzahl.
   * Formel: basePrice * scaleFactor ^ count
   * @param {string} buildingId – ID des Gebäudes
   * @returns {number} aktueller Preis (gerundet)
   */
  function getBuildingPrice(buildingId) {
    const def   = BUILDINGS.find(b => b.id === buildingId);
    const state = gameState.buildings[buildingId];
    if (!def || !state) return Infinity;
    return Math.floor(def.basePrice * Math.pow(CONFIG.BUILDING_PRICE_SCALE, state.count));
  }

  /**
   * Kauft ein Gebäude wenn genug Kuchen vorhanden sind.
   * @param {string} buildingId – ID des Gebäudes
   * @returns {boolean} true wenn Kauf erfolgreich
   */
  function buyBuilding(buildingId) {
    const price = getBuildingPrice(buildingId);
    if (gameState.cookies < price) return false;

    gameState.cookies                       -= price;
    gameState.buildings[buildingId].count   += 1;

    // Abgeleitete Werte neu berechnen
    _recalculate();

    // UI sofort aktualisieren
    UI.updateStats();
    Shop.render();
    UI.updateOwnedBuildings();

    return true;
  }

  // ------------------------------------------------------------------
  //  Upgrade-Kauf
  // ------------------------------------------------------------------

  /**
   * Kauft ein Upgrade wenn Bedingungen erfüllt und genug Kuchen vorhanden.
   * Wendet den Effekt sofort an.
   * @param {string} upgradeId – ID des Upgrades
   * @returns {boolean} true wenn Kauf erfolgreich
   */
  function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    // Bereits gekauft?
    if (gameState.upgrades[upgradeId]) return false;

    // Genug Kuchen?
    if (gameState.cookies < upgrade.price) return false;

    // Kaufen
    gameState.cookies          -= upgrade.price;
    gameState.upgrades[upgradeId] = true;

    // Upgrade-Effekt anwenden
    _applyUpgradeEffect(upgrade);

    // Neu berechnen
    _recalculate();

    // UI aktualisieren
    UI.updateStats();
    Shop.render();

    return true;
  }

  /**
   * Wendet den Effekt eines Upgrades auf den gameState an.
   * @param {object} upgrade – Upgrade-Objekt aus UPGRADES
   */
  function _applyUpgradeEffect(upgrade) {
    switch (upgrade.type) {
      case 'click':
        // Klick-Multiplikator erhöhen
        gameState.clickMultiplier *= upgrade.multiplier;
        break;

      case 'building':
        // Multiplikator eines bestimmten Gebäudes erhöhen
        if (gameState.buildings[upgrade.buildingId]) {
          gameState.buildings[upgrade.buildingId].multiplier *= upgrade.multiplier;
        }
        break;

      case 'all_buildings':
        // Multiplikator ALLER Gebäude erhöhen
        Object.keys(gameState.buildings).forEach(id => {
          gameState.buildings[id].multiplier *= upgrade.multiplier;
        });
        break;

      default:
        console.warn('Unbekannter Upgrade-Typ:', upgrade.type);
    }
  }

  // ------------------------------------------------------------------
  //  Spielstand zurücksetzen
  // ------------------------------------------------------------------

  /**
   * Setzt den gesamten Spielstand zurück (nach Bestätigung).
   * Löscht localStorage und lädt die Seite neu.
   */
  function resetGame() {
    Save.deleteSave();
    window.location.reload();
  }

  // ------------------------------------------------------------------
  //  Öffentliche API
  // ------------------------------------------------------------------
  return {
    init,
    handleCakeClick,
    getBuildingPrice,
    buyBuilding,
    buyUpgrade,
    resetGame,
    recalculate: _recalculate,
  };

})();

/* ==========================================================================
   HILFSFUNKTIONEN (global verfügbar)
   ========================================================================== */

/**
 * Formatiert eine Zahl für die Anzeige.
 * Unter 1.000: normale Darstellung (z.B. 42)
 * Ab 1.000: Tausender-Trennzeichen (z.B. 1.234)
 * Ab 1.000.000: Kurzschreibweise (z.B. 1,23 Mio.)
 * @param {number} n – zu formatierende Zahl
 * @param {number} [decimals=1] – Nachkommastellen für Kurzform
 * @returns {string} formatierter String
 */
function formatNumber(n, decimals = 1) {
  if (typeof n !== 'number' || isNaN(n)) return '0';

  n = Math.floor(n);

  if (n < 1_000) {
    return n.toString();
  }
  if (n < 1_000_000) {
    return n.toLocaleString('de-DE');
  }
  if (n < 1_000_000_000) {
    return (n / 1_000_000).toFixed(decimals) + ' Mio.';
  }
  if (n < 1_000_000_000_000) {
    return (n / 1_000_000_000).toFixed(decimals) + ' Mrd.';
  }
  if (n < 1_000_000_000_000_000) {
    return (n / 1_000_000_000_000).toFixed(decimals) + ' Bio.';
  }
  return (n / 1_000_000_000_000_000).toFixed(decimals) + ' Brd.';
}

/**
 * Formatiert Kuchen-pro-Sekunde Wert mit Dezimalstellen.
 * @param {number} n
 * @returns {string}
 */
function formatCps(n) {
  if (n < 1)    return n.toFixed(2);
  if (n < 10)   return n.toFixed(1);
  return formatNumber(n, 1);
}

/**
 * Gibt das aktuelle Milestone-Objekt zurück, also das nächste
 * noch nicht erreichte Ziel.
 * @returns {{ label: string, target: number, progress: number } | null}
 */
function getCurrentMilestone() {
  for (const m of MILESTONES) {
    if (gameState.totalCookies < m.target) {
      return {
        ...m,
        progress: Math.min(1, gameState.totalCookies / m.target),
      };
    }
  }
  // Alle Milestones erreicht
  return null;
}
