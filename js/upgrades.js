/**
 * upgrades.js – Alle Upgrade-Definitionen für Kuchen Clicker
 * ============================================================
 * Diese Datei definiert das UPGRADES-Array mit allen verfügbaren
 * Upgrades. Jedes Upgrade-Objekt enthält:
 *
 *   id          {string}   – eindeutiger Schlüssel (kein Leerzeichen)
 *   name        {string}   – Anzeigename im Shop
 *   icon        {string}   – Emoji-Icon
 *   description {string}   – kurze Beschreibung was das Upgrade macht
 *   price       {number}   – Kosten in Kuchen
 *   type        {string}   – 'click' | 'building' | 'all_buildings'
 *   multiplier  {number}   – Faktor um den die Produktion steigt
 *   buildingId  {string}   – (nur für type='building') welches Gebäude
 *   condition   {function} – (state) => boolean: Wann im Shop sichtbar?
 *
 * Muss NACH game.js und VOR shop.js geladen werden.
 */

'use strict';

/* ==========================================================================
   UPGRADES-ARRAY – mindestens 15 Upgrades, verschiedene Typen
   ========================================================================== */
const UPGRADES = [

  // ─────────────────────────────────────────────
  //  KLICK-UPGRADES (verbessern cookiesPerClick)
  // ─────────────────────────────────────────────

  {
    id:          'bessere_butter',
    name:        'Bessere Butter',
    icon:        '🧈',
    description: 'Hochwertige Almbutter macht jeden Klick doppelt so lecker.',
    price:       50,
    type:        'click',
    multiplier:  2,
    // Sofort verfügbar nach ein paar Klicks
    condition:   (s) => s.totalClicks >= 1,
  },

  {
    id:          'zuckerguss',
    name:        'Zuckerguss',
    icon:        '🍬',
    description: 'Glänzender Zuckerguss verleiht jedem Kuchen extra Kraft.',
    price:       250,
    type:        'click',
    multiplier:  2,
    // Nach 100 Gesamtkuchen
    condition:   (s) => s.totalCookies >= 100,
  },

  {
    id:          'goldene_backform',
    name:        'Goldene Backform',
    icon:        '🥇',
    description: 'Eine vergoldete Backform bringt dreifachen Kuchengenuss.',
    price:       5_000,
    type:        'click',
    multiplier:  3,
    // Ab 2.000 Gesamtkuchen
    condition:   (s) => s.totalCookies >= 2_000,
  },

  {
    id:          'kristallzucker',
    name:        'Kristallzucker',
    icon:        '💎',
    description: 'Seltener Kristallzucker – doppelt so süß, doppelt so mächtig.',
    price:       50_000,
    type:        'click',
    multiplier:  2,
    condition:   (s) => s.totalCookies >= 30_000,
  },

  {
    id:          'goldener_spatel',
    name:        'Goldener Spatel',
    icon:        '🔱',
    description: 'Der legendäre goldene Spatel des Meisterbäckers. Extrem wirksam.',
    price:       500_000,
    type:        'click',
    multiplier:  5,
    condition:   (s) => s.totalCookies >= 200_000,
  },

  {
    id:          'zauberstab_des_baeckers',
    name:        'Zauberstab des Bäckers',
    icon:        '🪄',
    description: 'Magische Kräfte fließen in jeden Klick. Zehnfache Kraft!',
    price:       5_000_000,
    type:        'click',
    multiplier:  10,
    condition:   (s) => s.totalCookies >= 1_000_000,
  },

  // ─────────────────────────────────────────────
  //  HAUSBACKOFEN-UPGRADES
  // ─────────────────────────────────────────────

  {
    id:          'backschule',
    name:        'Backschule',
    icon:        '📚',
    description: 'Professionelle Backkurse verdoppeln die Effizienz aller Hausbacköfen.',
    price:       200,
    type:        'building',
    buildingId:  'hausbackofen',
    multiplier:  2,
    // Erst wenn 1 Hausbackofen vorhanden
    condition:   (s) => s.buildings['hausbackofen']?.count >= 1,
  },

  {
    id:          'dampfbackofen',
    name:        'Dampfbackofen',
    icon:        '♨️',
    description: 'Moderner Dampfgarer verdoppelt die Produktion der Hausbacköfen nochmals.',
    price:       2_500,
    type:        'building',
    buildingId:  'hausbackofen',
    multiplier:  2,
    condition:   (s) => s.buildings['hausbackofen']?.count >= 5,
  },

  // ─────────────────────────────────────────────
  //  KLEINE BÄCKEREI-UPGRADES
  // ─────────────────────────────────────────────

  {
    id:          'profi_mixer',
    name:        'Profi-Mixer',
    icon:        '🥣',
    description: 'Industrielle Rührmaschinen für die Bäckerei. Doppelte Kapazität!',
    price:       1_500,
    type:        'building',
    buildingId:  'kleine_baeckerei',
    multiplier:  2,
    condition:   (s) => s.buildings['kleine_baeckerei']?.count >= 1,
  },

  {
    id:          'grosbbaeckerei_expansion',
    name:        'Bäckerei-Expansion',
    icon:        '📐',
    description: 'Anbau und Erweiterung. Die Bäckereien produzieren viermal mehr.',
    price:       20_000,
    type:        'building',
    buildingId:  'kleine_baeckerei',
    multiplier:  4,
    condition:   (s) => s.buildings['kleine_baeckerei']?.count >= 5,
  },

  // ─────────────────────────────────────────────
  //  KONDITOREI-UPGRADES
  // ─────────────────────────────────────────────

  {
    id:          'konditor_kurs',
    name:        'Konditor-Meisterkurs',
    icon:        '🎓',
    description: 'Zertifizierte Konditoren verdoppeln die Tortenproduktion.',
    price:       10_000,
    type:        'building',
    buildingId:  'konditorei',
    multiplier:  2,
    condition:   (s) => s.buildings['konditorei']?.count >= 1,
  },

  {
    id:          'schweizer_schokolade',
    name:        'Schweizer Schokolade',
    icon:        '🍫',
    description: 'Edle Schokolade aus der Schweiz verdoppelt Qualität und Menge.',
    price:       100_000,
    type:        'building',
    buildingId:  'konditorei',
    multiplier:  2,
    condition:   (s) => s.buildings['konditorei']?.count >= 5,
  },

  // ─────────────────────────────────────────────
  //  KUCHENFABRIK-UPGRADES
  // ─────────────────────────────────────────────

  {
    id:          'automatische_kuchenform',
    name:        'Automatische Kuchenformen',
    icon:        '🤖',
    description: 'Robotergestützte Formen verdoppeln den Fabrik-Ausstoß.',
    price:       60_000,
    type:        'building',
    buildingId:  'kuchenfabrik',
    multiplier:  2,
    condition:   (s) => s.buildings['kuchenfabrik']?.count >= 1,
  },

  // ─────────────────────────────────────────────
  //  GLOBALE UPGRADES (alle Gebäude)
  // ─────────────────────────────────────────────

  {
    id:          'geheimrezept',
    name:        'Geheimes Familienrezept',
    icon:        '📜',
    description: 'Ein uraltes Rezept steigert die Produktion ALLER Gebäude um 50%.',
    price:       25_000,
    type:        'all_buildings',
    multiplier:  1.5,
    condition:   (s) => s.totalCookies >= 10_000,
  },

  {
    id:          'zauberzucker',
    name:        'Zauberzucker',
    icon:        '🌈',
    description: 'Magischer Zucker aus dem Feenwald. Verdoppelt alle Gebäude!',
    price:       500_000,
    type:        'all_buildings',
    multiplier:  2,
    condition:   (s) => s.totalCookies >= 200_000,
  },

  {
    id:          'kuchengott_segen',
    name:        'Segen des Kuchengottes',
    icon:        '✨',
    description: 'Der Kuchengott selbst segnet alle deine Gebäude. Dreifache Kraft!',
    price:       10_000_000,
    type:        'all_buildings',
    multiplier:  3,
    condition:   (s) => s.totalCookies >= 5_000_000,
  },

  // ─────────────────────────────────────────────
  //  MAGISCHE KUCHENMASCHINE-UPGRADES
  // ─────────────────────────────────────────────

  {
    id:          'magische_hefe',
    name:        'Magische Hefe',
    icon:        '🧪',
    description: 'Geheimnisvolle Hefe aus dem Zauberwald. Verdoppelt die Maschinen.',
    price:       400_000,
    type:        'building',
    buildingId:  'magische_kuchenmaschine',
    multiplier:  2,
    condition:   (s) => s.buildings['magische_kuchenmaschine']?.count >= 1,
  },

];
