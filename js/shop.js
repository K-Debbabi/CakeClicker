'use strict';

const Shop = (() => {

  let _buildingsListEl = null;
  let _upgradesListEl  = null;
  let _tabBuildings    = null;
  let _tabUpgrades     = null;
  let _tabPrestige     = null;
  let _panelBuildings  = null;
  let _panelUpgrades   = null;
  let _panelPrestige   = null;
  let _prestigePanelEl = null;
  let _activeTab = 'buildings';

  function init() {
    _buildingsListEl = document.getElementById('buildings-list');
    _upgradesListEl  = document.getElementById('upgrades-list');
    _tabBuildings    = document.getElementById('tab-buildings');
    _tabUpgrades     = document.getElementById('tab-upgrades');
    _tabPrestige     = document.getElementById('tab-prestige');
    _panelBuildings  = document.getElementById('shop-buildings');
    _panelUpgrades   = document.getElementById('shop-upgrades');
    _panelPrestige   = document.getElementById('shop-prestige');
    _prestigePanelEl = document.getElementById('prestige-panel');

    _tabBuildings.addEventListener('click', () => switchTab('buildings'));
    _tabUpgrades.addEventListener('click',  () => switchTab('upgrades'));
    _tabPrestige.addEventListener('click',  () => switchTab('prestige'));
  }

  function switchTab(tab) {
    _activeTab = tab;
    [['buildings', _tabBuildings, _panelBuildings],
     ['upgrades',  _tabUpgrades,  _panelUpgrades],
     ['prestige',  _tabPrestige,  _panelPrestige]].forEach(([name, btn, panel]) => {
      const active = name === tab;
      btn?.classList.toggle('shop-tab--active', active);
      btn?.setAttribute('aria-selected', active);
      panel?.classList.toggle('shop-panel--active', active);
    });

    if (tab === 'prestige') _renderPrestige();
  }

  function render() {
    _renderBuildings();
    _renderUpgrades();
    if (_activeTab === 'prestige') _renderPrestige();
  }

  function _renderBuildings() {
    if (!_buildingsListEl) return;
    _buildingsListEl.innerHTML = '';

    BUILDINGS.forEach(def => {
      const state  = gameState.buildings[def.id];
      const price  = Game.getBuildingPrice(def.id);
      const count  = state?.count ?? 0;
      const canBuy = gameState.cookies >= price;
      const cpsContrib = def.baseCps * count * (state?.multiplier ?? 1);

      const li = document.createElement('li');
      li.className = 'building-card ' + (canBuy ? 'building-card--affordable' : 'building-card--unaffordable');
      li.setAttribute('data-building-id', def.id);
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', canBuy ? '0' : '-1');
      li.setAttribute('aria-label', `${def.name} kaufen für ${formatNumber(price)} Kuchen`);
      if (count > 0) li.setAttribute('data-tooltip', `Produziert ${formatCps(cpsContrib)} Kuchen/s`);

      li.innerHTML = `
        <span class="building-card__icon">${def.icon}</span>
        <div class="building-card__info">
          <div class="building-card__name">${def.name}</div>
          <div class="building-card__desc">${def.description}</div>
          <div class="building-card__cps">+${formatCps(def.baseCps * (state?.multiplier ?? 1))}/s pro Stück</div>
        </div>
        <div class="building-card__right">
          <div class="building-card__price">
            <span class="building-card__price-icon">🍰</span>${formatNumber(price)}
          </div>
          <div class="building-card__count">${count}</div>
        </div>
      `;

      li.addEventListener('click', () => _onBuildingClick(def.id, li));
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _onBuildingClick(def.id, li); }
      });
      _buildingsListEl.appendChild(li);
    });
  }

  function _renderUpgrades() {
    if (!_upgradesListEl) return;
    _upgradesListEl.innerHTML = '';
    let anyVisible = false;

    UPGRADES.forEach(u => {
      const isUnlocked  = u.condition(gameState);
      const isPurchased = gameState.upgrades[u.id] === true;
      const canAfford   = gameState.cookies >= u.price;

      if (!isUnlocked && !isPurchased) return;
      anyVisible = true;

      const li = document.createElement('li');
      let cls = 'upgrade-card';
      if (isPurchased)      cls += ' upgrade-card--purchased';
      else if (canAfford)   cls += ' upgrade-card--affordable';
      else                  cls += ' upgrade-card--unavailable';

      li.className = cls;
      li.setAttribute('data-upgrade-id', u.id);
      if (!isPurchased) {
        li.setAttribute('role', 'button');
        li.setAttribute('tabindex', canAfford ? '0' : '-1');
      }

      li.innerHTML = `
        <span class="upgrade-card__icon">${u.icon}</span>
        <div class="upgrade-card__info">
          <div class="upgrade-card__name">${u.name}</div>
          <div class="upgrade-card__desc">${u.description}</div>
          <div class="upgrade-card__effect">${_effectText(u)}</div>
        </div>
        ${!isPurchased ? `<div class="upgrade-card__price">🍰 ${formatNumber(u.price)}</div>` : ''}
      `;

      if (!isPurchased) {
        li.addEventListener('click', () => _onUpgradeClick(u.id, li));
        li.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _onUpgradeClick(u.id, li); }
        });
      }
      _upgradesListEl.appendChild(li);
    });

    if (!anyVisible) {
      const empty = document.createElement('li');
      empty.className = 'shop-empty';
      empty.textContent = '✨ Backe mehr Kuchen um Upgrades freizuschalten!';
      _upgradesListEl.appendChild(empty);
    }
  }

  function _renderPrestige() {
    if (!_prestigePanelEl) return;
    _prestigePanelEl.innerHTML = '';

    const chips    = Game.getPrestigeChips();
    const total    = gameState.heavenlyChips;
    const newTotal = total + chips;
    const newMult  = 1 + (newTotal * 0.01);
    const can      = Game.canPrestige();

    // Info card
    const info = document.createElement('div');
    info.className = 'prestige-chip-card';
    info.innerHTML = `
      <h3>☁️ Himmlische Chips</h3>
      <span class="prestige-chip-card__value">${total}</span>
      <p>Jeder himmlische Chip erhöht <strong>alle Produktion dauerhaft</strong> um 1%.
         Chips bleiben nach dem Aufstieg erhalten.<br><br>
         Aktueller Bonus: <strong>x${gameState.heavenlyChipsMultiplier.toFixed(2)}</strong></p>
    `;
    _prestigePanelEl.appendChild(info);

    if (can) {
      const cta = document.createElement('div');
      cta.className = 'prestige-chip-card';
      cta.style.borderColor = 'rgba(74, 222, 128, 0.5)';
      cta.innerHTML = `
        <h3 style="color:var(--accent-green)">🚀 Aufsteigen möglich!</h3>
        <p>Du hast genug Kuchen für einen Aufstieg.</p>
        <div style="margin:12px 0;display:flex;flex-direction:column;gap:6px;font-size:0.8rem;color:var(--text-secondary)">
          <div style="display:flex;justify-content:space-between"><span>Neue Chips:</span><span style="color:var(--accent-gold)">+${chips}</span></div>
          <div style="display:flex;justify-content:space-between"><span>Gesamt:</span><span style="color:var(--accent-gold)">${newTotal}</span></div>
          <div style="display:flex;justify-content:space-between"><span>Neuer Bonus:</span><span style="color:var(--accent-gold)">x${newMult.toFixed(2)}</span></div>
        </div>
        <button class="btn btn--prestige" id="shop-prestige-btn" style="width:100%;margin-top:8px">
          👑 Jetzt aufsteigen!
        </button>
      `;
      _prestigePanelEl.appendChild(cta);
      document.getElementById('shop-prestige-btn')?.addEventListener('click', () => {
        _openPrestigeDialog();
      });
    } else {
      const locked = document.createElement('div');
      locked.className = 'prestige-panel__empty';
      const needed = CONFIG.PRESTIGE_THRESHOLD;
      const progress = Math.min(1, gameState.totalCookies / needed) * 100;
      locked.innerHTML = `
        <div style="font-size:2rem;margin-bottom:8px">🔒</div>
        <p>Backe <strong>${formatNumber(needed)} Kuchen</strong> um aufzusteigen.</p>
        <p style="margin-top:8px;color:var(--accent-gold)">${progress.toFixed(2)}% erreicht</p>
        <p style="margin-top:4px;font-size:0.75rem">Du hast ${formatNumber(gameState.totalCookies)} Kuchen gebacken.</p>
      `;
      _prestigePanelEl.appendChild(locked);
    }

    if (gameState.prestigeCount > 0) {
      const hist = document.createElement('div');
      hist.className = 'prestige-chip-card';
      hist.style.marginTop = '8px';
      hist.innerHTML = `
        <h3>📜 Aufstiegs-Historie</h3>
        <p>Aufgestiegen: <strong>${gameState.prestigeCount}x</strong></p>
        <p>Gesammelte Chips: <strong>${total}</strong></p>
        <p>Permanenter Bonus: <strong>x${gameState.heavenlyChipsMultiplier.toFixed(2)}</strong></p>
      `;
      _prestigePanelEl.appendChild(hist);
    }
  }

  function _openPrestigeDialog() {
    const chips    = Game.getPrestigeChips();
    const newTotal = gameState.heavenlyChips + chips;
    const newMult  = 1 + (newTotal * 0.01);

    const nc = document.getElementById('prestige-new-chips');
    const tc = document.getElementById('prestige-total-chips');
    const nb = document.getElementById('prestige-new-bonus');
    if (nc) nc.textContent = '+' + chips;
    if (tc) tc.textContent = newTotal;
    if (nb) nb.textContent = 'x' + newMult.toFixed(2);

    document.getElementById('prestige-dialog')?.showModal();
  }

  function _onBuildingClick(id, el) {
    if (Game.buyBuilding(id)) {
      el.classList.add('building-card--just-bought');
      setTimeout(() => el.classList.remove('building-card--just-bought'), 400);
    }
  }

  function _onUpgradeClick(id, el) {
    if (Game.buyUpgrade(id)) {
      el.classList.add('upgrade-card--just-bought');
      setTimeout(() => el.classList.remove('upgrade-card--just-bought'), 400);
    }
  }

  function updateAffordability() {
    const buildingCards = _buildingsListEl?.querySelectorAll('.building-card') ?? [];
    buildingCards.forEach(card => {
      const id     = card.getAttribute('data-building-id');
      const price  = Game.getBuildingPrice(id);
      const canBuy = gameState.cookies >= price;
      const was    = card.classList.contains('building-card--affordable');

      card.classList.toggle('building-card--affordable',   canBuy);
      card.classList.toggle('building-card--unaffordable', !canBuy);

      const priceEl = card.querySelector('.building-card__price');
      if (priceEl) priceEl.innerHTML = `<span class="building-card__price-icon">🍰</span>${formatNumber(price)}`;

      if (canBuy && !was) {
        card.classList.add('building-card--newly-affordable');
        setTimeout(() => card.classList.remove('building-card--newly-affordable'), 800);
      }
    });

    const upgCards = _upgradesListEl?.querySelectorAll('.upgrade-card:not(.upgrade-card--purchased)') ?? [];
    upgCards.forEach(card => {
      const u = UPGRADES.find(x => x.id === card.getAttribute('data-upgrade-id'));
      if (!u) return;
      const can = gameState.cookies >= u.price;
      card.classList.toggle('upgrade-card--affordable', can);
      card.classList.toggle('upgrade-card--unavailable', !can);
    });
  }

  function _effectText(u) {
    switch (u.type) {
      case 'click':         return `✨ Klick × ${u.multiplier}`;
      case 'crit_chance':   return `💥 Krit-Chance +${(u.critBonus * 100).toFixed(0)}%`;
      case 'building': {
        const def = BUILDINGS.find(b => b.id === u.buildingId);
        return `🏠 ${def?.name ?? 'Gebäude'} × ${u.multiplier}`;
      }
      case 'all_buildings': return `🌟 Alle Gebäude × ${u.multiplier}`;
      default: return '';
    }
  }

  return { init, render, switchTab, updateAffordability };

})();
