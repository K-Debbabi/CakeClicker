/**
 * save.js – Speichern und Laden des Spielstands
 * ===============================================
 * Diese Datei kümmert sich um:
 *  - Speichern des gameState in localStorage (manuell + Auto-Save)
 *  - Laden des Spielstands beim Start
 *  - Offline-Progress: Kuchen berechnen die während Abwesenheit entstanden
 *  - Spielstand löschen (Reset)
 *  - Migration von alten Speicherständen (Versions-Check)
 *
 * Abhängigkeiten: game.js (CONFIG, gameState, BUILDINGS, ACHIEVEMENTS)
 */

'use strict';

const Save = (() => {

  // ------------------------------------------------------------------
  //  SPEICHERN
  // ------------------------------------------------------------------

  /**
   * Speichert den aktuellen gameState als JSON in localStorage.
   * Der Zeitstempel wird vor dem Speichern aktualisiert.
   */
  function save() {
    try {
      // Speicher-Zeitstempel setzen
      gameState.lastSaveTime = Date.now();

      // Zu speicherndes Objekt zusammenstellen
      const saveData = {
        version:        CONFIG.SAVE_VERSION,
        savedAt:        gameState.lastSaveTime,

        // Spielstand-Werte
        cookies:         gameState.cookies,
        totalCookies:    gameState.totalCookies,
        totalClicks:     gameState.totalClicks,
        clickMultiplier: gameState.clickMultiplier,

        // Gebäude-Zustände
        buildings:      gameState.buildings,

        // Upgrades (welche gekauft)
        upgrades:       gameState.upgrades,

        // Achievements (welche freigeschaltet)
        achievements:   gameState.achievements,

        // Letzer Tick-Zeitstempel für Offline-Berechnung
        lastTickTime:   gameState.lastTickTime,
      };

      localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
      console.log('💾 Spielstand gespeichert:', new Date().toLocaleTimeString('de-DE'));
    } catch (error) {
      console.error('❌ Fehler beim Speichern:', error);
    }
  }

  // ------------------------------------------------------------------
  //  LADEN
  // ------------------------------------------------------------------

  /**
   * Lädt den Spielstand aus localStorage und überschreibt den gameState.
   * Wenn kein Spielstand vorhanden, wird der Default-State beibehalten.
   * @returns {boolean} true wenn ein Spielstand geladen wurde
   */
  function load() {
    try {
      const raw = localStorage.getItem(CONFIG.SAVE_KEY);
      if (!raw) {
        console.log('📂 Kein Spielstand gefunden – Neues Spiel wird gestartet.');
        return false;
      }

      const saveData = JSON.parse(raw);

      // Version prüfen und ggf. migrieren
      if (!saveData.version || saveData.version < CONFIG.SAVE_VERSION) {
        console.log('🔄 Alter Spielstand wird migriert...');
        _migrate(saveData);
      }

      // Werte in gameState übertragen
      gameState.cookies          = saveData.cookies         ?? 0;
      gameState.totalCookies     = saveData.totalCookies    ?? 0;
      gameState.totalClicks      = saveData.totalClicks     ?? 0;
      gameState.clickMultiplier  = saveData.clickMultiplier ?? 1;
      gameState.lastTickTime     = saveData.lastTickTime    ?? Date.now();
      gameState.lastSaveTime     = saveData.savedAt         ?? Date.now();

      // Gebäude-Zustände laden (nur vorhandene Gebäude übernehmen)
      if (saveData.buildings) {
        BUILDINGS.forEach(def => {
          if (saveData.buildings[def.id]) {
            gameState.buildings[def.id] = {
              count:      saveData.buildings[def.id].count      ?? 0,
              multiplier: saveData.buildings[def.id].multiplier ?? 1,
            };
          }
        });
      }

      // Upgrades laden und Effekte neu anwenden
      if (saveData.upgrades) {
        UPGRADES.forEach(upgrade => {
          if (saveData.upgrades[upgrade.id] === true) {
            gameState.upgrades[upgrade.id] = true;
            // Upgrade-Effekt auf gameState anwenden
            _applyUpgrade(upgrade);
          }
        });
      }

      // Achievements laden
      if (saveData.achievements) {
        ACHIEVEMENTS.forEach(achievement => {
          if (saveData.achievements[achievement.id] === true) {
            gameState.achievements[achievement.id] = true;
          }
        });
      }

      console.log('✅ Spielstand geladen:', new Date(saveData.savedAt).toLocaleString('de-DE'));
      return true;

    } catch (error) {
      console.error('❌ Fehler beim Laden:', error);
      return false;
    }
  }

  // ------------------------------------------------------------------
  //  OFFLINE-PROGRESS
  // ------------------------------------------------------------------

  /**
   * Berechnet wie viele Kuchen während der Abwesenheit produziert wurden.
   * Begrenzt auf CONFIG.MAX_OFFLINE_SECONDS Sekunden.
   * Muss NACH load() aufgerufen werden.
   *
   * @returns {number} Anzahl der Offline-Kuchen (0 wenn nicht anwendbar)
   */
  function calculateOfflineProgress() {
    const now         = Date.now();
    const lastTick    = gameState.lastTickTime ?? now;
    const offlineMs   = now - lastTick;
    const offlineSecs = offlineMs / 1000;

    // Weniger als 60 Sekunden → keinen Offline-Progress anzeigen
    if (offlineSecs < 60) return 0;

    // Maximal MAX_OFFLINE_SECONDS berücksichtigen
    const cappedSecs = Math.min(offlineSecs, CONFIG.MAX_OFFLINE_SECONDS);

    // CPS aus dem aktuellen gameState berechnen
    // (Upgrades wurden bereits in load() angewendet)
    let cps = 0;
    BUILDINGS.forEach(def => {
      const state = gameState.buildings[def.id];
      if (!state || state.count === 0) return;
      cps += def.baseCps * state.count * (state.multiplier ?? 1);
    });

    const offlineCookies = Math.floor(cps * cappedSecs);

    console.log(
      `⏰ Offline seit ${Math.floor(cappedSecs / 60)} Minuten → ` +
      `${formatNumber(offlineCookies)} Kuchen produziert.`
    );

    return offlineCookies;
  }

  // ------------------------------------------------------------------
  //  SPIELSTAND LÖSCHEN
  // ------------------------------------------------------------------

  /**
   * Löscht den Spielstand aus localStorage.
   * Danach wird die Seite neu geladen (Game.resetGame).
   */
  function deleteSave() {
    try {
      localStorage.removeItem(CONFIG.SAVE_KEY);
      console.log('🗑️ Spielstand gelöscht.');
    } catch (error) {
      console.error('❌ Fehler beim Löschen:', error);
    }
  }

  // ------------------------------------------------------------------
  //  INTERNE HILFSFUNKTIONEN
  // ------------------------------------------------------------------

  /**
   * Wendet den Effekt eines Upgrades auf den gameState an.
   * Wird beim Laden aufgerufen um alle gekauften Upgrades zu reaktivieren.
   * Entspricht der Logik in Game._applyUpgradeEffect.
   * @param {object} upgrade
   */
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
    }
  }

  /**
   * Migriert einen alten Spielstand auf das aktuelle Format.
   * Fügt fehlende Felder mit Standardwerten hinzu.
   * @param {object} saveData – geladenes Objekt aus localStorage
   */
  function _migrate(saveData) {
    // Version 1 → 2: clickMultiplier hinzufügen
    if (!saveData.clickMultiplier) {
      saveData.clickMultiplier = 1;
    }
    if (!saveData.totalClicks) {
      saveData.totalClicks = 0;
    }
    if (!saveData.lastTickTime) {
      saveData.lastTickTime = Date.now();
    }
    saveData.version = CONFIG.SAVE_VERSION;
    console.log('✅ Migration abgeschlossen.');
  }

  // ------------------------------------------------------------------
  //  Öffentliche API
  // ------------------------------------------------------------------
  return {
    save,
    load,
    calculateOfflineProgress,
    deleteSave,
  };

})();
