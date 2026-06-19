'use strict';

/* ==========================================================================
   NEWS TICKER HEADLINES
   ========================================================================== */
const NEWS_HEADLINES = [
  '📰 Kuchenwissenschaftler beweisen: Kuchen macht nachweislich glücklicher als Geld.',
  '📰 Zeitbäckerei meldet Lieferverzögerungen aus dem Jahr 3045 – Kuchen kommt trotzdem pünktlich.',
  '📰 Kuchenplanet in der Milchstraße entdeckt – Bewohner ausschließlich Bäcker.',
  '📰 Quantenphysiker stellen fest: Schrödinger hatte keinen Kuchen – er war hungrig.',
  '📰 Interdimensionale Kuchen-Lieferkette kollabiert – Portale vorübergehend überlastet.',
  '📰 Göttliche Bäckerei verkündet: Universum ist aus 98% Kuchen und 2% Raum zusammengesetzt.',
  '📰 Unsterbliche Kuchenquelle sprudelt stärker denn je – Experten ratlos.',
  '📰 Kuchenfabrik bricht Produktionsrekord – Fließband läuft seit 847 Jahren ohne Pause.',
  '📰 Neues Upgrade entdeckt: Göttlicher Spatel steigert Klickkraft um unendliche Menge.',
  '📰 Glückskuchen erscheint: Klicke ihn bevor er verschwindet!',
  '📰 Konditorei-Meister gewinnt Weltmeisterschaft mit geheimem Multidimensional-Rezept.',
  '📰 Himmlische Chips: Neue Währung aus Kuchenresten gewinnt internationales Vertrauen.',
  '📰 Magische Hefe von Zauberlehrlingen als neues Wundermittel klassifiziert.',
  '📰 Zeitreise-Bäcker aus dem Jahr 2387 meldet: "Euer Kuchen-Imperium ist legendär."',
  '📰 BREAKING: Kritischer Treffer erzielt – Wissenschaftler sprechen von Naturphänomen.',
  '📰 Kuchen-Galaxie expandiert – Astronom misst neue Kuchenmaterie am Rand des Universums.',
  '📰 Goldener Kuchen erschienen – Kuchenjäger in Alarmbereitschaft!',
  '📰 Kombo x100 erreicht: Spieler bricht internationalen Klick-Weltrekord.',
  '📰 Nano-Roboter in Kuchenfabrik optimieren Sahne-Verteilung auf Molekülebene.',
  '📰 Dimesnionsloch erzeugt Kuchen aus reiner Fantasie – Physiker kapitulieren.',
  '📰 Universalrezept entschlüsselt: Geheimzutat war die ganze Zeit Butter.',
  '📰 Kuchenimperium übertrifft BIP aller Nationen zusammen – Finanzminister neidisch.',
  '📰 Prestige-Aufstieg gemessen: Himmlische Chips strahlen bei 4200 Kelvin.',
  '📰 Kuchen-Sturm über der Hauptstadt – Bürgermeister freut sich, Meteorologen verwirrt.',
  '📰 FRENZY-Modus aktiviert! Produktionsrekorde werden gerade gebrochen!',
  '📰 Kristallzucker aus Paralleldimension importiert – schmeckt wie Unmöglichkeit.',
  '📰 Göttliches Backen bestätigt: Götter bevorzugen Sahnetorte.',
  '📰 Arkane Kristalle in Maschinen implantiert – Magie läuft jetzt auf Steuern.',
  '📰 Schwarzes Loch der Kuchengalaxie saugt Kalorienangaben ins Nichts. Gesundheitsminister begeistert.',
  '📰 Kuchenpapst verkündet: 2025 ist das Jahr des ewigen Kuchens.',
];

/* ==========================================================================
   UI MODULE
   ========================================================================== */
const UI = (() => {

  // DOM refs
  let _cookieCountEl   = null;
  let _cpsDisplayEl    = null;
  let _cpcDisplayEl    = null;
  let _totalCookiesEl  = null;
  let _cakeBtnEl       = null;
  let _cakeEmojiEl     = null;
  let _cakeParticlesEl = null;
  let _cakeInfoEl      = null;
  let _ownedBuildingsEl = null;
  let _achievementsEl  = null;
  let _achievementCountEl = null;
  let _milestoneTextEl = null;
  let _milestoneProgEl = null;
  let _btnSaveEl       = null;
  let _btnResetEl      = null;
  let _btnPrestigeEl   = null;
  let _prestigeSectionEl = null;
  let _prestigeChipsPreviewEl = null;
  let _resetDialogEl   = null;
  let _resetConfirmEl  = null;
  let _resetCancelEl   = null;
  let _prestigeDialogEl = null;
  let _prestigeConfirmEl = null;
  let _prestigeCancelEl = null;
  let _offlineBannerEl  = null;
  let _offlineBannerTxt = null;
  let _offlineCloseEl   = null;
  let _toastEl          = null;
  let _toastTitleEl     = null;
  let _toastDescEl      = null;
  let _toastTimeout     = null;
  let _frenzyBarEl      = null;
  let _frenzyProgressEl = null;
  let _frenzyTimerEl    = null;
  let _frenzyLabelEl    = null;
  let _frenzyNotifEl    = null;
  let _frenzyNotifTextEl = null;
  let _comboDisplayEl   = null;
  let _comboValueEl     = null;
  let _comboBonusEl     = null;
  let _newsTickerTextEl = null;
  let _goldenContainerEl = null;
  let _bgParticlesEl    = null;

  // Prestige stats
  let _prestigeStatEl      = null;
  let _heavenlyStatEl      = null;
  let _prestigeMultStatEl  = null;
  let _prestigeCountDispEl = null;
  let _heavenlyChipsDispEl = null;
  let _prestigeMultDispEl  = null;

  // Web Audio
  let _audioCtx = null;

  // ------------------------------------------------------------------
  //  INIT
  // ------------------------------------------------------------------
  function init() {
    _cookieCountEl    = document.getElementById('cookie-count');
    _cpsDisplayEl     = document.getElementById('cps-display');
    _cpcDisplayEl     = document.getElementById('cpc-display');
    _totalCookiesEl   = document.getElementById('total-cookies');
    _cakeBtnEl        = document.getElementById('cake-btn');
    _cakeEmojiEl      = document.getElementById('cake-emoji');
    _cakeParticlesEl  = document.getElementById('cake-particles');
    _cakeInfoEl       = document.getElementById('cake-info-text');
    _ownedBuildingsEl = document.getElementById('owned-buildings-list');
    _achievementsEl   = document.getElementById('achievements-grid');
    _achievementCountEl = document.getElementById('achievement-count');
    _milestoneTextEl  = document.getElementById('milestone-text');
    _milestoneProgEl  = document.getElementById('milestone-progress');
    _btnSaveEl        = document.getElementById('btn-save');
    _btnResetEl       = document.getElementById('btn-reset');
    _btnPrestigeEl    = document.getElementById('btn-prestige');
    _prestigeSectionEl   = document.getElementById('prestige-section');
    _prestigeChipsPreviewEl = document.getElementById('prestige-chips-preview');
    _resetDialogEl    = document.getElementById('reset-dialog');
    _resetConfirmEl   = document.getElementById('reset-confirm');
    _resetCancelEl    = document.getElementById('reset-cancel');
    _prestigeDialogEl  = document.getElementById('prestige-dialog');
    _prestigeConfirmEl = document.getElementById('prestige-confirm');
    _prestigeCancelEl  = document.getElementById('prestige-cancel');
    _offlineBannerEl  = document.getElementById('offline-banner');
    _offlineBannerTxt = document.getElementById('offline-banner-text');
    _offlineCloseEl   = document.getElementById('offline-banner-close');
    _toastEl          = document.getElementById('achievement-toast');
    _toastTitleEl     = document.getElementById('achievement-toast-title');
    _toastDescEl      = document.getElementById('achievement-toast-desc');
    _frenzyBarEl      = document.getElementById('frenzy-bar');
    _frenzyProgressEl = document.getElementById('frenzy-progress');
    _frenzyTimerEl    = document.getElementById('frenzy-timer');
    _frenzyLabelEl    = document.getElementById('frenzy-label');
    _frenzyNotifEl    = document.getElementById('frenzy-notification');
    _frenzyNotifTextEl = document.getElementById('frenzy-notification-text');
    _comboDisplayEl   = document.getElementById('combo-display');
    _comboValueEl     = document.getElementById('combo-value');
    _comboBonusEl     = document.getElementById('combo-bonus');
    _newsTickerTextEl = document.getElementById('news-ticker-text');
    _goldenContainerEl = document.getElementById('golden-cakes-container');
    _bgParticlesEl    = document.getElementById('bg-particles');

    _prestigeStatEl      = document.getElementById('prestige-stat');
    _heavenlyStatEl      = document.getElementById('heavenly-stat');
    _prestigeMultStatEl  = document.getElementById('prestige-mult-stat');
    _prestigeCountDispEl = document.getElementById('prestige-count-display');
    _heavenlyChipsDispEl = document.getElementById('heavenly-chips-display');
    _prestigeMultDispEl  = document.getElementById('prestige-mult-display');

    _bindEvents();
    _initAudio();
    _spawnBackgroundParticles();
    _startNewsTicker();

    Shop.init();
    updateAchievements();
    updateOwnedBuildings();
    updateMilestone();
    updateStats();
    updatePrestigeSection();
  }

  function _bindEvents() {
    _cakeBtnEl?.addEventListener('click', e => Game.handleCakeClick(e));

    _btnSaveEl?.addEventListener('click', () => { Save.save(); showSaveFeedback(); });

    _btnResetEl?.addEventListener('click', () => _resetDialogEl?.showModal());
    _resetCancelEl?.addEventListener('click', () => _resetDialogEl?.close());
    _resetConfirmEl?.addEventListener('click', () => { _resetDialogEl?.close(); Game.resetGame(); });
    _resetDialogEl?.addEventListener('click', e => { if (e.target === _resetDialogEl) _resetDialogEl.close(); });

    _btnPrestigeEl?.addEventListener('click', () => _openPrestigeDialog());
    _prestigeCancelEl?.addEventListener('click', () => _prestigeDialogEl?.close());
    _prestigeConfirmEl?.addEventListener('click', () => { _prestigeDialogEl?.close(); Game.prestige(); });
    _prestigeDialogEl?.addEventListener('click', e => { if (e.target === _prestigeDialogEl) _prestigeDialogEl.close(); });

    _offlineCloseEl?.addEventListener('click', () => _offlineBannerEl && (_offlineBannerEl.hidden = true));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        _resetDialogEl?.close();
        _prestigeDialogEl?.close();
      }
    });
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
    _prestigeDialogEl?.showModal();
  }

  // ------------------------------------------------------------------
  //  AUDIO (Web Audio API – procedural sounds)
  // ------------------------------------------------------------------
  function _initAudio() {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { _audioCtx = null; }
  }

  function playSound(type) {
    if (!_audioCtx) return;
    try {
      if (_audioCtx.state === 'suspended') _audioCtx.resume();
      switch (type) {
        case 'click':     _playTone(440, 0.06, 'sine',     0.08); break;
        case 'crit':      _playCrit();                             break;
        case 'buy':       _playTone(523, 0.12, 'sine',     0.12); break;
        case 'upgrade':   _playArpeggio([523, 659, 784], 0.08);   break;
        case 'achievement': _playArpeggio([523, 659, 784, 1047], 0.1); break;
        case 'golden':    _playArpeggio([660, 880, 1100, 1320], 0.1); break;
        case 'frenzy':    _playFrenzySfx();                        break;
      }
    } catch (e) { /* ignore audio errors */ }
  }

  function _playTone(freq, duration, type, volume) {
    if (!_audioCtx) return;
    const osc  = _audioCtx.createOscillator();
    const gain = _audioCtx.createGain();
    osc.connect(gain);
    gain.connect(_audioCtx.destination);
    osc.type      = type;
    osc.frequency.setValueAtTime(freq, _audioCtx.currentTime);
    gain.gain.setValueAtTime(volume * 0.3, _audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + duration);
    osc.start();
    osc.stop(_audioCtx.currentTime + duration);
  }

  function _playCrit() {
    if (!_audioCtx) return;
    [220, 330, 440, 660, 880].forEach((f, i) => {
      const osc  = _audioCtx.createOscillator();
      const gain = _audioCtx.createGain();
      osc.connect(gain);
      gain.connect(_audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, _audioCtx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.1, _audioCtx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + i * 0.05 + 0.2);
      osc.start(_audioCtx.currentTime + i * 0.05);
      osc.stop(_audioCtx.currentTime + i * 0.05 + 0.2);
    });
  }

  function _playArpeggio(freqs, volume) {
    if (!_audioCtx) return;
    freqs.forEach((f, i) => {
      const osc  = _audioCtx.createOscillator();
      const gain = _audioCtx.createGain();
      osc.connect(gain);
      gain.connect(_audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, _audioCtx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(volume * 0.3, _audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, _audioCtx.currentTime + i * 0.08 + 0.15);
      osc.start(_audioCtx.currentTime + i * 0.08);
      osc.stop(_audioCtx.currentTime + i * 0.08 + 0.2);
    });
  }

  function _playFrenzySfx() {
    if (!_audioCtx) return;
    for (let i = 0; i < 10; i++) {
      const freq = 200 + i * 80;
      _playTone(freq, 0.15, 'sawtooth', 0.08);
    }
  }

  // ------------------------------------------------------------------
  //  STATS
  // ------------------------------------------------------------------
  function updateStats() {
    if (_cookieCountEl)  _cookieCountEl.textContent  = formatNumber(Math.floor(gameState.cookies));
    if (_cpsDisplayEl)   _cpsDisplayEl.textContent   = formatCps(gameState.cookiesPerSecond);
    if (_cpcDisplayEl)   _cpcDisplayEl.textContent   = formatNumber(gameState.cookiesPerClick);
    if (_totalCookiesEl) _totalCookiesEl.textContent = formatNumber(Math.floor(gameState.totalCookies));

    if (_cakeInfoEl && gameState.cookiesPerSecond > 0) {
      const frenzyMult = gameState.frenzyActive ? gameState.frenzyMultiplier : 1;
      const eff = gameState.cookiesPerSecond * frenzyMult;
      _cakeInfoEl.textContent = `${formatCps(eff)} Kuchen/s • ${formatNumber(gameState.cookiesPerClick)} pro Klick`;
    }

    // Prestige stats
    if (gameState.prestigeCount > 0 || gameState.heavenlyChips > 0) {
      _prestigeStatEl     && (_prestigeStatEl.hidden = false);
      _heavenlyStatEl     && (_heavenlyStatEl.hidden = false);
      _prestigeMultStatEl && (_prestigeMultStatEl.hidden = false);
      if (_prestigeCountDispEl) _prestigeCountDispEl.textContent = gameState.prestigeCount;
      if (_heavenlyChipsDispEl) _heavenlyChipsDispEl.textContent = gameState.heavenlyChips;
      if (_prestigeMultDispEl)  _prestigeMultDispEl.textContent  = 'x' + gameState.heavenlyChipsMultiplier.toFixed(2);
    }

    // Cake emoji evolves with total cookies
    if (_cakeEmojiEl) {
      if      (gameState.totalCookies >= 1e15)  _cakeEmojiEl.textContent = '♾️';
      else if (gameState.totalCookies >= 1e12)  _cakeEmojiEl.textContent = '🌌';
      else if (gameState.totalCookies >= 1e9)   _cakeEmojiEl.textContent = '⚡';
      else if (gameState.totalCookies >= 1e6)   _cakeEmojiEl.textContent = '🎆';
      else if (gameState.totalCookies >= 1e3)   _cakeEmojiEl.textContent = '🎂';
      else                                       _cakeEmojiEl.textContent = '🍰';
    }
  }

  // ------------------------------------------------------------------
  //  OWNED BUILDINGS
  // ------------------------------------------------------------------
  function updateOwnedBuildings() {
    if (!_ownedBuildingsEl) return;
    _ownedBuildingsEl.innerHTML = '';
    let hasAny = false;

    BUILDINGS.forEach(def => {
      const state = gameState.buildings[def.id];
      if (!state || state.count === 0) return;
      hasAny = true;
      const cps = def.baseCps * state.count * (state.multiplier ?? 1);
      const li = document.createElement('li');
      li.className = 'buildings-list__item';
      li.innerHTML = `
        <span class="buildings-list__name">
          <span>${def.icon}</span><span>${def.name}</span>
        </span>
        <span class="buildings-list__cps">${formatCps(cps)}/s</span>
        <span class="buildings-list__count">${state.count}</span>
      `;
      _ownedBuildingsEl.appendChild(li);
    });

    if (!hasAny) {
      const li = document.createElement('li');
      li.className = 'buildings-list__empty';
      li.textContent = 'Noch keine Gebäude';
      _ownedBuildingsEl.appendChild(li);
    }
  }

  // ------------------------------------------------------------------
  //  ACHIEVEMENTS
  // ------------------------------------------------------------------
  function updateAchievements() {
    if (!_achievementsEl) return;
    _achievementsEl.innerHTML = '';
    let unlocked = 0;

    ACHIEVEMENTS.forEach(a => {
      const isUnlocked = gameState.achievements[a.id] === true;
      if (isUnlocked) unlocked++;

      const div = document.createElement('div');
      div.className = 'achievement-badge ' + (isUnlocked ? 'achievement-badge--unlocked' : 'achievement-badge--locked');
      div.setAttribute('data-tooltip', isUnlocked ? a.description : '???');
      div.setAttribute('title', isUnlocked ? `${a.name}: ${a.description}` : 'Gesperrt');
      div.setAttribute('role', 'img');
      div.setAttribute('aria-label', isUnlocked ? a.name : 'Gesperrtes Achievement');
      div.innerHTML = `
        <span class="achievement-badge__icon">${isUnlocked ? a.icon : '🔒'}</span>
        <span class="achievement-badge__name">${isUnlocked ? a.name : '???'}</span>
      `;
      if (isUnlocked) div.classList.add('anim-pop');
      _achievementsEl.appendChild(div);
    });

    if (_achievementCountEl) {
      _achievementCountEl.textContent = `${unlocked}/${ACHIEVEMENTS.length}`;
    }
  }

  // ------------------------------------------------------------------
  //  ACHIEVEMENT TOAST
  // ------------------------------------------------------------------
  function showAchievementToast(a) {
    if (!_toastEl) return;
    _toastTitleEl.textContent = `🏆 ${a.name}`;
    _toastDescEl.textContent  = a.description;
    _toastEl.classList.add('achievement-toast--visible');
    if (_toastTimeout) clearTimeout(_toastTimeout);
    _toastTimeout = setTimeout(() => _toastEl.classList.remove('achievement-toast--visible'), 3_500);
    playSound('achievement');
  }

  // ------------------------------------------------------------------
  //  MILESTONE
  // ------------------------------------------------------------------
  function updateMilestone() {
    if (!_milestoneTextEl || !_milestoneProgEl) return;
    const m = getCurrentMilestone();
    if (!m) {
      _milestoneTextEl.textContent = '🏆 Alle Milestones erreicht – Du bist eine Legende!';
      _milestoneProgEl.style.width = '100%';
      return;
    }
    _milestoneTextEl.textContent =
      `Nächstes Ziel: ${formatNumber(m.target)} Kuchen (${formatNumber(gameState.totalCookies)} bisher)`;
    const pct = m.progress * 100;
    _milestoneProgEl.style.width = pct + '%';
    _milestoneProgEl.classList.toggle('milestone-progress--almost', pct >= 90);
  }

  // ------------------------------------------------------------------
  //  PRESTIGE SECTION
  // ------------------------------------------------------------------
  function updatePrestigeSection() {
    if (!_prestigeSectionEl || !_prestigeChipsPreviewEl) return;
    const can   = Game.canPrestige();
    const chips = Game.getPrestigeChips();
    _prestigeSectionEl.hidden = !can;
    if (can) _prestigeChipsPreviewEl.textContent = chips;
  }

  // ------------------------------------------------------------------
  //  CAKE ANIMATION
  // ------------------------------------------------------------------
  function triggerCakeAnimation(isCrit) {
    if (!_cakeBtnEl) return;
    _cakeBtnEl.classList.remove('cake-btn--clicked');
    void _cakeBtnEl.offsetWidth;
    _cakeBtnEl.classList.add('cake-btn--clicked');
    setTimeout(() => _cakeBtnEl.classList.remove('cake-btn--clicked'), 450);
    playSound(isCrit ? 'crit' : 'click');
  }

  // ------------------------------------------------------------------
  //  FLOAT NUMBERS
  // ------------------------------------------------------------------
  function spawnFloatNumber(amount, event, isCrit) {
    if (!_cakeParticlesEl) return;
    const span = document.createElement('span');
    span.className = 'float-number';
    if (isCrit)          span.classList.add('float-number--crit');
    else if (amount >= 1000) span.classList.add('float-number--big');

    span.textContent = isCrit
      ? `💥 KRITISCH! +${formatNumber(amount)}`
      : `+${formatNumber(amount)} 🍰`;

    const rect = _cakeParticlesEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) + (Math.random() - 0.5) * 60;
    const y = (event.clientY - rect.top);
    span.style.left = `${x}px`;
    span.style.top  = `${y}px`;
    _cakeParticlesEl.appendChild(span);
    setTimeout(() => span.remove(), isCrit ? 1600 : 1300);
  }

  // ------------------------------------------------------------------
  //  CRIT EFFECT
  // ------------------------------------------------------------------
  function triggerCritEffect(amount, event) {
    // Screen flash
    const flash = document.createElement('div');
    flash.className = 'crit-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // Screen shake on body
    document.body.classList.remove('body--shake');
    void document.body.offsetWidth;
    document.body.classList.add('body--shake');
    setTimeout(() => document.body.classList.remove('body--shake'), 400);

    // Float number
    spawnFloatNumber(amount, event, true);
  }

  // ------------------------------------------------------------------
  //  PARTICLES
  // ------------------------------------------------------------------
  function spawnParticles(event, isCrit) {
    if (!_cakeParticlesEl) return;
    const count = isCrit ? 12 : (3 + Math.floor(Math.random() * 4));
    const emojis = isCrit
      ? ['💥', '⭐', '✨', '🌟', '💫', '🔥']
      : ['🍰', '✨', '⭐', '🍬', '🎂', '💖'];

    const rect = _cakeParticlesEl.getBoundingClientRect();
    const cx = event.clientX - rect.left;
    const cy = event.clientY - rect.top;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'cake-particle';
      const angle = Math.random() * 360;
      const dist  = (isCrit ? 80 : 40) + Math.random() * 80;
      const dx    = Math.cos((angle * Math.PI) / 180) * dist;
      const dy    = Math.sin((angle * Math.PI) / 180) * dist - 40;
      const rot   = (Math.random() - 0.5) * 360 + 'deg';
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', rot);
      p.style.left  = cx + 'px';
      p.style.top   = cy + 'px';
      p.style.animationDelay = (Math.random() * 0.08) + 's';
      p.style.fontSize = (0.8 + Math.random() * 0.6) + 'rem';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      _cakeParticlesEl.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  // ------------------------------------------------------------------
  //  COMBO DISPLAY
  // ------------------------------------------------------------------
  function updateComboDisplay(combo, mult, active) {
    if (!_comboValueEl) return;
    _comboValueEl.textContent = `x${combo}`;
    if (_comboBonusEl) {
      _comboBonusEl.textContent = mult > 1 ? `(${mult}x Bonus)` : '';
    }
    _comboDisplayEl?.classList.toggle('combo-display--active', active && mult <= 2);
    _comboDisplayEl?.classList.toggle('combo-display--fire',   mult > 2);

    _comboValueEl.classList.remove('combo-display__value--pop');
    void _comboValueEl.offsetWidth;
    if (combo > 1) _comboValueEl.classList.add('combo-display__value--pop');
  }

  // ------------------------------------------------------------------
  //  FRENZY BAR
  // ------------------------------------------------------------------
  function startFrenzyBar(duration) {
    if (_frenzyBarEl) _frenzyBarEl.hidden = false;
    playSound('frenzy');
  }

  function updateFrenzyBar(remainingSecs, totalDuration) {
    if (!_frenzyProgressEl || !_frenzyTimerEl) return;
    const pct = Math.max(0, (remainingSecs / totalDuration) * 100);
    _frenzyProgressEl.style.width = pct + '%';
    _frenzyTimerEl.textContent = Math.ceil(remainingSecs) + 's';
  }

  function stopFrenzyBar() {
    if (_frenzyBarEl) _frenzyBarEl.hidden = true;
  }

  // ------------------------------------------------------------------
  //  FRENZY NOTIFICATION
  // ------------------------------------------------------------------
  function showFrenzyNotification(text) {
    if (!_frenzyNotifEl || !_frenzyNotifTextEl) return;
    _frenzyNotifTextEl.textContent = text;
    _frenzyNotifEl.hidden = false;
    setTimeout(() => { if (_frenzyNotifEl) _frenzyNotifEl.hidden = true; }, 2500);
  }

  // ------------------------------------------------------------------
  //  GOLDEN CAKE
  // ------------------------------------------------------------------
  function spawnGoldenCake() {
    if (!_goldenContainerEl) return;

    const el = document.createElement('div');
    el.className = 'golden-cake';
    el.textContent = '✨';
    el.setAttribute('title', 'Goldener Kuchen! Schnell klicken!');

    const padding = 80;
    const maxX = window.innerWidth  - padding * 2;
    const maxY = window.innerHeight - padding * 2 - 36; // minus ticker
    el.style.left = (padding + Math.random() * maxX) + 'px';
    el.style.top  = (padding + Math.random() * maxY) + 'px';

    const ring = document.createElement('div');
    ring.className = 'golden-cake__timer-ring';
    el.appendChild(ring);

    el.addEventListener('click', () => {
      el.classList.add('golden-cake--clicked');
      playSound('golden');
      Game.handleGoldenCakeClick();
      setTimeout(() => el.remove(), 500);
    });

    _goldenContainerEl.appendChild(el);

    // Auto-remove after lifetime
    setTimeout(() => {
      if (el.parentNode) {
        el.classList.add('golden-cake--vanish');
        setTimeout(() => el.remove(), 400);
      }
    }, CONFIG.GOLDEN_CAKE_LIFETIME * 1000);
  }

  // ------------------------------------------------------------------
  //  GOLDEN BONUS ANNOUNCEMENT
  // ------------------------------------------------------------------
  function showGoldenBonus(name, desc, amount) {
    const el = document.createElement('div');
    el.className = 'golden-bonus-float';
    el.innerHTML = `${name}<br><small style="font-size:0.6em;font-family:var(--font-main)">${desc}${amount > 0 ? '<br>+' + formatNumber(amount) + ' 🍰' : ''}</small>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // ------------------------------------------------------------------
  //  COOKIE STORM
  // ------------------------------------------------------------------
  function triggerCookieStorm() {
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.style.cssText = `
          position:fixed;
          left:${Math.random()*100}vw;
          top:-40px;
          font-size:${1.5 + Math.random()}rem;
          pointer-events:none;
          z-index:600;
          animation:particleBurst 2s ease-in forwards;
          --dx:${(Math.random()-0.5)*100}px;
          --dy:${100 + Math.random()*300}px;
          --rot:${(Math.random()-0.5)*720}deg;
        `;
        el.textContent = ['🍰','🎂','🧁','🍩','🍪'][Math.floor(Math.random()*5)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
      }, i * 80);
    }
  }

  // ------------------------------------------------------------------
  //  BACKGROUND PARTICLES
  // ------------------------------------------------------------------
  function _spawnBackgroundParticles() {
    if (!_bgParticlesEl) return;
    const items = ['✨', '⭐', '🌟', '💫', '🔮', '🍰', '🎂', '🍬'];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'bg-particle';
      p.textContent = items[Math.floor(Math.random() * items.length)];
      p.style.left   = Math.random() * 100 + 'vw';
      p.style.top    = Math.random() * 100 + 'vh';
      p.style.fontSize = (0.4 + Math.random() * 1.2) + 'rem';
      p.style.opacity  = (0.03 + Math.random() * 0.1).toString();
      p.style.animationDuration = (10 + Math.random() * 30) + 's';
      p.style.animationDelay    = (-Math.random() * 30) + 's';
      _bgParticlesEl.appendChild(p);
    }
  }

  // ------------------------------------------------------------------
  //  NEWS TICKER
  // ------------------------------------------------------------------
  function _startNewsTicker() {
    if (!_newsTickerTextEl) return;
    const show = () => {
      const h = NEWS_HEADLINES[Math.floor(Math.random() * NEWS_HEADLINES.length)];
      _newsTickerTextEl.textContent = h + '   ';
      _newsTickerTextEl.style.animation = 'none';
      void _newsTickerTextEl.offsetWidth;
      _newsTickerTextEl.style.animation = 'tickerScroll 40s linear';
    };
    show();
    setInterval(show, 42_000);
  }

  // ------------------------------------------------------------------
  //  OFFLINE BANNER
  // ------------------------------------------------------------------
  function showOfflineBanner(cookies) {
    if (!_offlineBannerEl || !_offlineBannerTxt) return;
    _offlineBannerTxt.textContent =
      `Willkommen zurück! Während deiner Abwesenheit wurden ${formatNumber(cookies)} Kuchen 🍰 gebacken.`;
    _offlineBannerEl.hidden = false;
  }

  // ------------------------------------------------------------------
  //  SAVE FEEDBACK
  // ------------------------------------------------------------------
  function showSaveFeedback() {
    if (!_btnSaveEl) return;
    const orig = _btnSaveEl.textContent;
    _btnSaveEl.textContent = '✅ Gespeichert!';
    setTimeout(() => { _btnSaveEl.textContent = orig; }, 1500);
  }

  // ------------------------------------------------------------------
  //  Public API
  // ------------------------------------------------------------------
  return {
    init,
    updateStats,
    updateOwnedBuildings,
    updateAchievements,
    updateMilestone,
    updatePrestigeSection,
    updateComboDisplay,
    triggerCakeAnimation,
    spawnFloatNumber,
    triggerCritEffect,
    spawnParticles,
    showAchievementToast,
    showOfflineBanner,
    showSaveFeedback,
    spawnGoldenCake,
    showGoldenBonus,
    triggerCookieStorm,
    startFrenzyBar,
    updateFrenzyBar,
    stopFrenzyBar,
    showFrenzyNotification,
    playSound,
  };

})();

/* ==========================================================================
   START
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
