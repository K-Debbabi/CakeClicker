/**
 * shop.js – Shop-Logik für Kuchen Clicker
 * =========================================
 * Diese Datei verwaltet:
 *  - Rendern der Gebäude-Liste im Shop
 *  - Rendern der Upgrade-Liste im Shop
 *  - Tab-Navigation (Gebäude ↔ Upgrades)
 *  - Kauf-Events für Gebäude und Upgrades
 *  - Aktualisieren der Kaufbarkeits-Klassen (grün/grau)
 *
 * Abhängigkeiten: game.js (BUILDINGS, UPGRADES, gameState, Game)
 */

'use strict';

const Shop = (() => {

  // ------------------------------------------------------------------
  //  DOM-Referenzen (einmalig gecacht)
  // ------------------------------------------------------------------

  /** Liste der Gebäude-Karten im Shop */
  let _buildingsListEl  = null;

  /** Liste der Upgrade-Karten im Shop */
  let _upgradesListEl   = null;

  /** Tab-Buttons */
  let _tabBuildings     = null;
  let _tabUpgrades      = null;

  /** Panel-Container */
  let _panelBuildings   = null;
  let _panelUpgrades    = null;

  /** Aktuell aktiver Tab */
  let _activeTab = 'buildings';

  // ------------------------------------------------------------------
  //  Initialisierung
  // ------------------------------------------------------------------

  /**
   * Initialisiert den Shop: DOM-Elemente cachen, Events binden.
   * Wird von UI.init() aufgerufen.
   */
  function init() {
    _buildingsListEl = document.getElementById('buildings-list');
    _upgradesListEl  = document.getElementById('upgrades-list');
    _tabBuildings    = document.getElementById('tab-buildings');
    _tabUpgrades     = document.getElementById('tab-upgrades');
    _panelBuildings  = document.getElementById('shop-buildings');
    _panelUpgrades   = document.getElementById('shop-upgrades');

    // Tab-Klick-Events
    _tabBuildings.addEventListener('click', () => switchTab('buildings'));
    _tabUpgrades.addEventListener('click',  () => switchTab('upgrades'));
  }

  // ------------------------------------------------------------------
  //  Tab-Navigation
  // ------------------------------------------------------------------

  /**
   * Wechselt zwischen den Tabs 'buildings' und 'upgrades'.
   * @param {'buildings'|'upgrades'} tab
   */
  function switchTab(tab) {
    _activeTab = tab;

    // Tab-Buttons aktualisieren
    _tabBuildings.classList.toggle('shop-tab--active', tab === 'buildings');
    _tabUpgrades.classList.toggle('shop-tab--active',  tab === 'upgrades');
    _tabBuildings.setAttribute('aria-selected', tab === 'buildings');
    _tabUpgrades.setAttribute('aria-selected',  tab === 'upgrades');

    // Panels anzeigen/verstecken
    _panelBuildings.classList.toggle('shop-panel--active', tab === 'buildings');
    _panelUpgrades.classList.toggle('shop-panel--active',  tab === 'upgrades');
  }

  // ------------------------------------------------------------------
  //  Shop rendern
  // ------------------------------------------------------------------

  /**
   * Rendert den gesamten Shop neu (Gebäude + Upgrades).
   * Wird nach Käufen aufgerufen.
   */
  function render() {
    _renderBuildings();
    _renderUpgrades();
  }

  /**
   * Rendert die Gebäude-Liste im Shop.
   * Erstellt für jedes Gebäude eine Karte mit Preis und Kaufbarkeit.
   */
  function _renderBuildings() {
    if (!_buildingsListEl) return;

    // Bestehende Kinder entfernen
    _buildingsListEl.innerHTML = '';

    BUILDINGS.forEach(buildingDef => {
      const state  = gameState.buildings[buildingDef.id];
      const price  = Game.getBuildingPrice(buildingDef.id);
      const count  = state ? state.count : 0;
      const canBuy = gameState.cookies >= price;

      // CPS-Beitrag dieses Gebäudes
      const totalBuildingCps = buildingDef.baseCps * count * (state?.multiplier ?? 1);

      // Listenitem erstellen
      const li = document.createElement('li');
      li.className = 'building-card ' + (canBuy ? 'building-card--affordable' : 'building-card--unaffordable');
      li.setAttribute('data-building-id', buildingDef.id);
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', canBuy ? '0' : '-1');
      li.setAttribute('aria-label', `${buildingDef.name} kaufen für ${formatNumber(price)} Kuchen`);

      // Tooltip mit CPS-Beitrag (nur wenn schon gekauft)
      if (count > 0) {
        li.setAttribute('data-tooltip', `Produziert ${formatCps(totalBuildingCps)} Kuchen/s`);
      }

      li.innerHTML = `
        <span class="building-card__icon">${buildingDef.icon}</span>
        <div class="building-card__info">
          <div class="building-card__name">${buildingDef.name}</div>
          <div class="building-card__desc">${buildingDef.description}</div>
          <div class="building-card__cps">+${formatCps(buildingDef.baseCps * (state?.multiplier ?? 1))}/s pro Stück</div>
        </div>
        <div class="building-card__right">
          <div class="building-card__price">
            <span class="building-card__price-icon">🍰</span>${formatNumber(price)}
          </div>
          <div class="building-card__count">${count}</div>
        </div>
      `;

      // Klick-Event: Gebäude kaufen
      li.addEventListener('click', () => _onBuildingClick(buildingDef.id, li));

      // Tastatur-Unterstützung (Enter/Space)
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _onBuildingClick(buildingDef.id, li);
        }
      });

      _buildingsListEl.appendChild(li);
    });
  }

  /**
   * Rendert die Upgrade-Liste im Shop.
   * Zeigt nur Upgrades die bereits verfügbar sind (Bedingung erfüllt).
   * Gekaufte Upgrades werden ausgegraut angezeigt.
   */
  function _renderUpgrades() {
    if (!_upgradesListEl) return;

    _upgradesListEl.innerHTML = '';

    let anyVisible = false;

    UPGRADES.forEach(upgrade => {
      // Bedingung prüfen (soll Upgrade überhaupt sichtbar sein?)
      const isUnlocked  = upgrade.condition(gameState);
      const isPurchased = gameState.upgrades[upgrade.id] === true;
      const canAfford   = gameState.cookies >= upgrade.price;

      // Nicht freigeschaltet UND noch nicht gekauft → verstecken
      if (!isUnlocked && !isPurchased) return;

      anyVisible = true;

      const li = document.createElement('li');

      // CSS-Klasse je nach Zustand
      let cardClass = 'upgrade-card';
      if (isPurchased) {
        cardClass += ' upgrade-card--purchased';
      } else if (canAfford) {
        cardClass += ' upgrade-card--affordable';
      } else {
        cardClass += ' upgrade-card--unavailable';
      }

      li.className = cardClass;
      li.setAttribute('data-upgrade-id', upgrade.id);

      if (!isPurchased) {
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', canAfford ? '0' : '-1');
        li.setAttribute('aria-label', `${upgrade.name} kaufen für ${formatNumber(upgrade.price)} Kuchen`);
      }

      // Effekt-Beschreibung je nach Upgrade-Typ
      const effectText = _getEffectText(upgrade);

      li.innerHTML = `
        <span class="upgrade-card__icon">${upgrade.icon}</span>
        <div class="upgrade-card__info">
          <div class="upgrade-card__name">${upgrade.name}</div>
          <div class="upgrade-card__desc">${upgrade.description}</div>
          <div class="upgrade-card__effect">${effectText}</div>
        </div>
        ${!isPurchased ? `
        <div class="upgrade-card__price">
          🍰 ${formatNumber(upgrade.price)}
        </div>
        ` : ''}
      `;

      // Klick-Event nur wenn nicht gekauft
      if (!isPurchased) {
        li.addEventListener('click', () => _onUpgradeClick(upgrade.id, li));
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            _onUpgradeClick(upgrade.id, li);
          }
        });
      }

      _upgradesListEl.appendChild(li);
    });

    // Leer-Zustand anzeigen
    if (!anyVisible) {
      const empty = document.createElement('li');
      empty.className = 'shop-empty';
      empty.textContent = 'Backe mehr Kuchen um Upgrades freizuschalten!';
      _upgradesListEl.appendChild(empty);
    }
  }

  // ------------------------------------------------------------------
  //  Kauf-Handler
  // ------------------------------------------------------------------

  /**
   * Handler für Klick auf eine Gebäude-Karte.
   * @param {string} buildingId
   * @param {HTMLElement} cardEl – das Karten-Element
   */
  function _onBuildingClick(buildingId, cardEl) {
    const success = Game.buyBuilding(buildingId);
    if (success) {
      // Kurzfristige Kauf-Animation
      cardEl.classList.add('building-card--just-bought');
      setTimeout(() => cardEl.classList.remove('building-card--just-bought'), 500);
    }
  }

  /**
   * Handler für Klick auf eine Upgrade-Karte.
   * @param {string} upgradeId
   * @param {HTMLElement} cardEl – das Karten-Element
   */
  function _onUpgradeClick(upgradeId, cardEl) {
    const success = Game.buyUpgrade(upgradeId);
    if (success) {
      cardEl.classList.add('upgrade-card--just-bought');
      setTimeout(() => cardEl.classList.remove('upgrade-card--just-bought'), 500);
    }
  }

  // ------------------------------------------------------------------
  //  Kaufbarkeit aktualisieren (Performance-Optimierung)
  // ------------------------------------------------------------------

  /**
   * Aktualisiert nur die CSS-Klassen (kaufbar/nicht kaufbar) der
   * bereits gerenderten Karten, ohne den DOM neu aufzubauen.
   * Wird häufiger aufgerufen als render() (pro Shop-Render-Tick).
   */
  function updateAffordability() {
    // Gebäude-Karten
    const buildingCards = _buildingsListEl?.querySelectorAll('.building-card') ?? [];
    buildingCards.forEach(card => {
      const id    = card.getAttribute('data-building-id');
      const price = Game.getBuildingPrice(id);
      const canBuy = gameState.cookies >= price;

      const wasAffordable = card.classList.contains('building-card--affordable');

      card.classList.toggle('building-card--affordable',   canBuy);
      card.classList.toggle('building-card--unaffordable', !canBuy);

      // Preis-Anzeige aktualisieren
      const priceEl = card.querySelector('.building-card__price');
      if (priceEl) {
        priceEl.innerHTML = `<span class="building-card__price-icon">🍰</span>${formatNumber(price)}`;
      }

      // Kurze Highlight-Animation wenn gerade kaufbar geworden
      if (canBuy && !wasAffordable) {
        card.classList.add('building-card--newly-affordable');
        setTimeout(() => card.classList.remove('building-card--newly-affordable'), 1000);
      }
    });

    // Upgrade-Karten (nur kaufbar/nicht-kaufbar, nicht neu rendern)
    const upgradeCards = _upgradesListEl?.querySelectorAll('.upgrade-card:not(.upgrade-card--purchased)') ?? [];
    upgradeCards.forEach(card => {
      const id      = card.getAttribute('data-upgrade-id');
      const upgrade = UPGRADES.find(u => u.id === id);
      if (!upgrade) return;

      const canAfford = gameState.cookies >= upgrade.price;
      card.classList.toggle('upgrade-card--affordable',   canAfford);
      card.classList.toggle('upgrade-card--unavailable', !canAfford);
    });
  }

  // ------------------------------------------------------------------
  //  Hilfsfunktionen
  // ------------------------------------------------------------------

  /**
   * Gibt einen lesbaren Effekt-Text für ein Upgrade zurück.
   * @param {object} upgrade – Upgrade-Objekt
   * @returns {string}
   */
  function _getEffectText(upgrade) {
    const mult = upgrade.multiplier;
    switch (upgrade.type) {
      case 'click':
        return `✨ Klick-Stärke × ${mult}`;
      case 'building': {
        const def = BUILDINGS.find(b => b.id === upgrade.buildingId);
        return `🏠 ${def ? def.name : 'Gebäude'} × ${mult}`;
      }
      case 'all_buildings':
        return `🌟 Alle Gebäude × ${mult}`;
      default:
        return '';
    }
  }

  // ------------------------------------------------------------------
  //  Öffentliche API
  // ------------------------------------------------------------------
  return {
    init,
    render,
    switchTab,
    updateAffordability,
  };

})();
