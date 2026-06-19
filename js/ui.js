/**
 * ui.js – DOM-Updates und Animationen für Kuchen Clicker
 * ========================================================
 * Diese Datei verwaltet:
 *  - Initialisierung aller Event-Listener (Kuchen-Klick, Buttons, Dialog)
 *  - Aktualisierung der Statistik-Anzeigen (Kuchen, CPS, CPC)
 *  - Kuchen-Klick-Animation (Wackeln, Float-Zahlen, Partikel)
 *  - Achievement-Toast anzeigen
 *  - Achievement-Grid aktualisieren
 *  - Gebäude-Übersicht im linken Panel
 *  - Milestone-Fortschrittsanzeige
 *  - Offline-Banner anzeigen/verstecken
 *  - Speicher-Feedback-Animation
 *
 * Muss als LETZTE JS-Datei geladen werden (braucht alle anderen Module).
 */

'use strict';

const UI = (() => {

  // ------------------------------------------------------------------
  //  DOM-Referenzen (einmalig gecacht)
  // ------------------------------------------------------------------

  // Statistiken
  let _cookieCountEl   = null;
  let _cpsDisplayEl    = null;
  let _cpcDisplayEl    = null;
  let _totalCookiesEl  = null;

  // Kuchen-Bereich
  let _cakeBtnEl       = null;
  let _cakeEmojiEl     = null;
  let _cakeParticlesEl = null;
  let _cakeInfoEl      = null;

  // Linke Spalte
  let _ownedBuildingsEl = null;
  let _achievementsEl   = null;

  // Milestone
  let _milestoneTextEl  = null;
  let _milestoneProgEl  = null;

  // Buttons
  let _btnSaveEl        = null;
  let _btnResetEl       = null;

  // Dialog
  let _resetDialogEl    = null;
  let _resetConfirmEl   = null;
  let _resetCancelEl    = null;

  // Offline-Banner
  let _offlineBannerEl  = null;
  let _offlineBannerTxt = null;
  let _offlineCloseEl   = null;

  // Achievement-Toast
  let _toastEl          = null;
  let _toastTitleEl     = null;
  let _toastDescEl      = null;
  let _toastTimeout     = null;

  // ------------------------------------------------------------------
  //  INIT – alle DOM-Refs cachen und Events binden
  // ------------------------------------------------------------------

  /**
   * Initialisiert die UI: DOM-Elemente cachen, Event-Listener binden,
   * Shop initialisieren und erste Render-Runde starten.
   * Wird von Game.init() aufgerufen.
   */
  function init() {
    // DOM-Elemente cachen
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
    _milestoneTextEl  = document.getElementById('milestone-text');
    _milestoneProgEl  = document.getElementById('milestone-progress');
    _btnSaveEl        = document.getElementById('btn-save');
    _btnResetEl       = document.getElementById('btn-reset');
    _resetDialogEl    = document.getElementById('reset-dialog');
    _resetConfirmEl   = document.getElementById('reset-confirm');
    _resetCancelEl    = document.getElementById('reset-cancel');
    _offlineBannerEl  = document.getElementById('offline-banner');
    _offlineBannerTxt = document.getElementById('offline-banner-text');
    _offlineCloseEl   = document.getElementById('offline-banner-close');
    _toastEl          = document.getElementById('achievement-toast');
    _toastTitleEl     = document.getElementById('achievement-toast-title');
    _toastDescEl      = document.getElementById('achievement-toast-desc');

    // Event-Listener binden
    _bindEvents();

    // Shop initialisieren
    Shop.init();

    // Achievements-Grid initial befüllen
    updateAchievements();

    // Gebäude-Liste initial befüllen
    updateOwnedBuildings();

    // Milestone initial setzen
    updateMilestone();

    // Stats initial setzen
    updateStats();

    console.log('🎨 UI initialisiert.');
  }

  /**
   * Bindet alle Event-Listener an die interaktiven Elemente.
   */
  function _bindEvents() {
    // Kuchen-Klick
    _cakeBtnEl.addEventListener('click', (e) => Game.handleCakeClick(e));

    // Manuelles Speichern
    _btnSaveEl.addEventListener('click', () => {
      Save.save();
      showSaveFeedback();
    });

    // Reset-Button öffnet Dialog
    _btnResetEl.addEventListener('click', () => {
      _resetDialogEl.showModal();
    });

    // Dialog: Abbrechen
    _resetCancelEl.addEventListener('click', () => {
      _resetDialogEl.close();
    });

    // Dialog: Bestätigen → Spielstand löschen
    _resetConfirmEl.addEventListener('click', () => {
      _resetDialogEl.close();
      Game.resetGame();
    });

    // Dialog schließen wenn auf Backdrop geklickt
    _resetDialogEl.addEventListener('click', (e) => {
      if (e.target === _resetDialogEl) {
        _resetDialogEl.close();
      }
    });

    // Offline-Banner schließen
    _offlineCloseEl.addEventListener('click', () => {
      _offlineBannerEl.hidden = true;
    });

    // Keyboard: Escape schließt Dialog
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _resetDialogEl.open) {
        _resetDialogEl.close();
      }
    });
  }

  // ------------------------------------------------------------------
  //  STATISTIKEN AKTUALISIEREN
  // ------------------------------------------------------------------

  /**
   * Aktualisiert alle Statistik-Anzeigen im linken Panel.
   * Wird bei jedem Tick aufgerufen.
   */
  function updateStats() {
    const cookies = Math.floor(gameState.cookies);
    const cps     = gameState.cookiesPerSecond;
    const cpc     = gameState.cookiesPerClick;
    const total   = Math.floor(gameState.totalCookies);

    // Kuchen-Hauptzähler
    if (_cookieCountEl) {
      _cookieCountEl.textContent = formatNumber(cookies);
    }

    // Kuchen pro Sekunde
    if (_cpsDisplayEl) {
      _cpsDisplayEl.textContent = formatCps(cps);
    }

    // Kuchen pro Klick
    if (_cpcDisplayEl) {
      _cpcDisplayEl.textContent = formatNumber(cpc);
    }

    // Gesamt-Kuchen
    if (_totalCookiesEl) {
      _totalCookiesEl.textContent = formatNumber(total);
    }

    // Info-Text unter dem Kuchen aktualisieren
    if (_cakeInfoEl && cps > 0) {
      _cakeInfoEl.textContent = `${formatCps(cps)} Kuchen/s • ${formatNumber(cpc)} pro Klick`;
    }
  }

  // ------------------------------------------------------------------
  //  GEBÄUDE-ÜBERSICHT (linkes Panel)
  // ------------------------------------------------------------------

  /**
   * Aktualisiert die Gebäude-Besitz-Liste im linken Panel.
   * Zeigt nur Gebäude an die mindestens 1x gekauft wurden.
   */
  function updateOwnedBuildings() {
    if (!_ownedBuildingsEl) return;

    _ownedBuildingsEl.innerHTML = '';

    let hasAny = false;

    BUILDINGS.forEach(def => {
      const state = gameState.buildings[def.id];
      if (!state || state.count === 0) return;

      hasAny = true;

      const cpsContrib = def.baseCps * state.count * (state.multiplier ?? 1);

      const li = document.createElement('li');
      li.className = 'buildings-list__item';
      li.innerHTML = `
        <span class="buildings-list__name">
          <span>${def.icon}</span>
          <span>${def.name}</span>
        </span>
        <span class="buildings-list__cps">${formatCps(cpsContrib)}/s</span>
        <span class="buildings-list__count">${state.count}</span>
      `;
      _ownedBuildingsEl.appendChild(li);
    });

    if (!hasAny) {
      const empty = document.createElement('li');
      empty.className = 'buildings-list__empty';
      empty.textContent = 'Noch keine Gebäude';
      _ownedBuildingsEl.appendChild(empty);
    }
  }

  // ------------------------------------------------------------------
  //  ACHIEVEMENTS
  // ------------------------------------------------------------------

  /**
   * Rendert das Achievements-Grid neu.
   * Freigeschaltete Achievements leuchten, gesperrte sind ausgegraut.
   */
  function updateAchievements() {
    if (!_achievementsEl) return;

    _achievementsEl.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
      const isUnlocked = gameState.achievements[achievement.id] === true;

      const div = document.createElement('div');
      div.className = 'achievement-badge ' +
        (isUnlocked ? 'achievement-badge--unlocked' : 'achievement-badge--locked');

      div.setAttribute('data-tooltip',
        isUnlocked
          ? achievement.description
          : '???'
      );
      div.setAttribute('title',
        isUnlocked ? `${achievement.name}: ${achievement.description}` : 'Noch nicht freigeschaltet'
      );
      div.setAttribute('role', 'img');
      div.setAttribute('aria-label',
        isUnlocked ? achievement.name : 'Gesperrtes Achievement'
      );

      div.innerHTML = `
        <span class="achievement-badge__icon">${isUnlocked ? achievement.icon : '🔒'}</span>
        <span class="achievement-badge__name">${isUnlocked ? achievement.name : '???'}</span>
      `;

      _achievementsEl.appendChild(div);
    });
  }

  // ------------------------------------------------------------------
  //  ACHIEVEMENT TOAST
  // ------------------------------------------------------------------

  /**
   * Zeigt den Achievement-Toast für 3 Sekunden an.
   * @param {object} achievement – freigeschaltetes Achievement-Objekt
   */
  function showAchievementToast(achievement) {
    if (!_toastEl) return;

    // Text setzen
    _toastTitleEl.textContent = `🏆 ${achievement.name}`;
    _toastDescEl.textContent  = achievement.description;

    // Toast einblenden
    _toastEl.classList.add('achievement-toast--visible');

    // Eventuell laufenden Timeout abbrechen
    if (_toastTimeout) clearTimeout(_toastTimeout);

    // Nach 3.5 Sekunden wieder ausblenden
    _toastTimeout = setTimeout(() => {
      _toastEl.classList.remove('achievement-toast--visible');
    }, 3_500);
  }

  // ------------------------------------------------------------------
  //  MILESTONE-ANZEIGE
  // ------------------------------------------------------------------

  /**
   * Aktualisiert den Milestone-Text und den Fortschrittsbalken.
   */
  function updateMilestone() {
    if (!_milestoneTextEl || !_milestoneProgEl) return;

    const milestone = getCurrentMilestone();

    if (!milestone) {
      _milestoneTextEl.textContent = '🏆 Alle Milestones erreicht! Legende!';
      _milestoneProgEl.style.width = '100%';
      return;
    }

    _milestoneTextEl.textContent =
      `Nächstes Ziel: ${formatNumber(milestone.target)} Kuchen (${formatNumber(gameState.totalCookies)} bisher)`;

    const pct = milestone.progress * 100;
    _milestoneProgEl.style.width = pct + '%';

    // Fast-Fertig-Animation
    if (pct >= 90) {
      _milestoneProgEl.classList.add('milestone-progress--almost');
    } else {
      _milestoneProgEl.classList.remove('milestone-progress--almost');
    }
  }

  // ------------------------------------------------------------------
  //  KUCHEN-KLICK-ANIMATION
  // ------------------------------------------------------------------

  /**
   * Triggert die Wackel-Animation des Kuchens beim Klicken.
   * Entfernt die Klasse nach der Animationsdauer.
   */
  function triggerCakeAnimation() {
    if (!_cakeBtnEl) return;

    _cakeBtnEl.classList.remove('cake-btn--clicked');
    // Kurzer Reflow damit die Animation neu startet
    void _cakeBtnEl.offsetWidth;
    _cakeBtnEl.classList.add('cake-btn--clicked');

    // Klasse nach Animation entfernen (entspricht cakeWiggle-Dauer: 0.4s)
    setTimeout(() => {
      _cakeBtnEl.classList.remove('cake-btn--clicked');
    }, 450);
  }

  // ------------------------------------------------------------------
  //  FLOAT-ZAHLEN ANIMATION
  // ------------------------------------------------------------------

  /**
   * Erzeugt eine schwebende "+X 🍰" Zahl über dem Kuchen.
   * Position wird leicht randomisiert.
   * @param {number} amount – Anzahl der gewonnenen Kuchen
   * @param {MouseEvent|PointerEvent} event – Maus-Event für Position
   */
  function spawnFloatNumber(amount, event) {
    if (!_cakeParticlesEl) return;

    const span = document.createElement('span');
    span.className = 'float-number';

    // Große Beträge bekommen eine andere Klasse
    if (amount >= 100)  span.classList.add('float-number--big');
    if (amount >= 1000) span.classList.add('float-number--crit');

    span.textContent = `+${formatNumber(amount)} 🍰`;

    // Position relativ zum Partikel-Container
    const containerRect = _cakeParticlesEl.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    // Leichte Streuung (±30px horizontal)
    const offsetX = (Math.random() - 0.5) * 60;

    span.style.left = `${x + offsetX}px`;
    span.style.top  = `${y}px`;

    _cakeParticlesEl.appendChild(span);

    // Element nach Animation entfernen (1.2s laut animations.css)
    setTimeout(() => span.remove(), 1_300);
  }

  // ------------------------------------------------------------------
  //  PARTIKEL-EFFEKTE
  // ------------------------------------------------------------------

  /**
   * Erzeugt kleine Kuchen-Partikel die vom Klick-Punkt wegfliegen.
   * @param {MouseEvent} event
   */
  function spawnParticles(event) {
    if (!_cakeParticlesEl) return;

    // Anzahl der Partikel: 3-6
    const count = 3 + Math.floor(Math.random() * 4);

    const containerRect = _cakeParticlesEl.getBoundingClientRect();
    const cx = event.clientX - containerRect.left;
    const cy = event.clientY - containerRect.top;

    const emojis = ['🍰', '✨', '⭐', '🍬', '🎂'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'cake-particle';

      // Zufälliger Winkel und Distanz für CSS-Variable
      const angle = Math.random() * 360;
      const dist  = 40 + Math.random() * 60;
      const dx    = Math.cos((angle * Math.PI) / 180) * dist;
      const dy    = Math.sin((angle * Math.PI) / 180) * dist - 30; // leicht nach oben
      const rot   = (Math.random() - 0.5) * 180 + 'deg';

      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      particle.style.setProperty('--rot', rot);
      particle.style.left = cx + 'px';
      particle.style.top  = cy + 'px';
      particle.style.animationDelay = (Math.random() * 0.1) + 's';

      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      _cakeParticlesEl.appendChild(particle);

      // Nach Animation entfernen (0.8s laut animations.css)
      setTimeout(() => particle.remove(), 1_000);
    }
  }

  // ------------------------------------------------------------------
  //  OFFLINE-BANNER
  // ------------------------------------------------------------------

  /**
   * Zeigt das Offline-Progress-Banner mit der Anzahl der
   * produzierten Kuchen während der Abwesenheit.
   * @param {number} cookies – Anzahl der Offline-Kuchen
   */
  function showOfflineBanner(cookies) {
    if (!_offlineBannerEl || !_offlineBannerTxt) return;

    _offlineBannerTxt.textContent =
      `Willkommen zurück! Während deiner Abwesenheit wurden ` +
      `${formatNumber(cookies)} Kuchen 🍰 gebacken.`;

    _offlineBannerEl.hidden = false;
  }

  // ------------------------------------------------------------------
  //  SPEICHER-FEEDBACK
  // ------------------------------------------------------------------

  /**
   * Gibt dem Speichern-Button kurz visuelles Feedback.
   */
  function showSaveFeedback() {
    if (!_btnSaveEl) return;

    const original = _btnSaveEl.textContent;
    _btnSaveEl.textContent = '✅ Gespeichert!';
    _btnSaveEl.classList.add('btn--save-success');

    setTimeout(() => {
      _btnSaveEl.textContent = original;
      _btnSaveEl.classList.remove('btn--save-success');
    }, 1_500);
  }

  // ------------------------------------------------------------------
  //  Öffentliche API
  // ------------------------------------------------------------------
  return {
    init,
    updateStats,
    updateOwnedBuildings,
    updateAchievements,
    updateMilestone,
    triggerCakeAnimation,
    spawnFloatNumber,
    spawnParticles,
    showAchievementToast,
    showOfflineBanner,
    showSaveFeedback,
  };

})();

/* ==========================================================================
   SPIELSTART – Wird aufgerufen sobald die Seite vollständig geladen ist
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Spiel starten (Game.init() lädt den Spielstand und startet den Tick)
  Game.init();
});
