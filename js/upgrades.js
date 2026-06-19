'use strict';

/* ==========================================================================
   UPGRADES – Kuchen Clicker ULTRA (35+ Upgrades)
   ========================================================================== */
const UPGRADES = [

  // ─── CLICK UPGRADES ───────────────────────────────────────────────────────

  {
    id: 'bessere_butter', name: 'Bessere Butter', icon: '🧈',
    description: 'Hochwertige Almbutter macht jeden Klick doppelt so lecker.',
    price: 50, type: 'click', multiplier: 2,
    condition: s => s.totalClicks >= 1,
  },
  {
    id: 'zuckerguss', name: 'Zuckerguss', icon: '🍬',
    description: 'Glänzender Zuckerguss verleiht jedem Klick extra Kraft.',
    price: 250, type: 'click', multiplier: 2,
    condition: s => s.totalCookies >= 100,
  },
  {
    id: 'goldene_backform', name: 'Goldene Backform', icon: '🥇',
    description: 'Eine vergoldete Backform bringt dreifachen Kuchengenuss.',
    price: 5_000, type: 'click', multiplier: 3,
    condition: s => s.totalCookies >= 2_000,
  },
  {
    id: 'kristallzucker', name: 'Kristallzucker', icon: '💎',
    description: 'Seltener Kristallzucker – doppelt so süß, doppelt so mächtig.',
    price: 50_000, type: 'click', multiplier: 2,
    condition: s => s.totalCookies >= 30_000,
  },
  {
    id: 'goldener_spatel', name: 'Goldener Spatel', icon: '🔱',
    description: 'Der legendäre goldene Spatel des Meisterbäckers.',
    price: 500_000, type: 'click', multiplier: 5,
    condition: s => s.totalCookies >= 200_000,
  },
  {
    id: 'zauberstab_baecker', name: 'Zauberstab des Bäckers', icon: '🪄',
    description: 'Magische Kräfte fließen in jeden Klick. Zehnfache Kraft!',
    price: 5_000_000, type: 'click', multiplier: 10,
    condition: s => s.totalCookies >= 1_000_000,
  },
  {
    id: 'goetterklick', name: 'Götterklick', icon: '⚡',
    description: 'Der Fingerdruck eines Gottes. Unvorstellbare Klickkraft.',
    price: 100_000_000, type: 'click', multiplier: 20,
    condition: s => s.totalCookies >= 50_000_000,
  },
  {
    id: 'kosmischer_finger', name: 'Kosmischer Finger', icon: '🌌',
    description: 'Dein Finger enthält die Kraft eines ganzen Universums.',
    price: 5_000_000_000, type: 'click', multiplier: 50,
    condition: s => s.totalCookies >= 1_000_000_000,
  },

  // ─── CRIT UPGRADES ────────────────────────────────────────────────────────

  {
    id: 'scharfe_augen', name: 'Scharfe Augen', icon: '👁️',
    description: 'Du triffst öfter kritisch. +3% kritische Trefferchance.',
    price: 10_000, type: 'crit_chance', critBonus: 0.03,
    condition: s => s.totalCriticalClicks >= 1,
  },
  {
    id: 'meisterpräzision', name: 'Meisterpräzision', icon: '🎯',
    description: 'Präzision eines Meisterbäckers. +5% kritische Trefferchance.',
    price: 500_000, type: 'crit_chance', critBonus: 0.05,
    condition: s => s.totalCriticalClicks >= 10,
  },
  {
    id: 'goettliche_praezision', name: 'Göttliche Präzision', icon: '✨',
    description: 'Göttliche Präzision beim Klicken. +7% kritische Trefferchance.',
    price: 50_000_000, type: 'crit_chance', critBonus: 0.07,
    condition: s => s.totalCriticalClicks >= 50,
  },

  // ─── HAUSBACKOFEN ─────────────────────────────────────────────────────────

  {
    id: 'backschule', name: 'Backschule', icon: '📚',
    description: 'Professionelle Backkurse verdoppeln die Ofeneffizienz.',
    price: 200, type: 'building', buildingId: 'hausbackofen', multiplier: 2,
    condition: s => (s.buildings['hausbackofen']?.count ?? 0) >= 1,
  },
  {
    id: 'dampfbackofen', name: 'Dampfbackofen', icon: '♨️',
    description: 'Moderner Dampfgarer verdoppelt die Ofenproduktion nochmals.',
    price: 2_500, type: 'building', buildingId: 'hausbackofen', multiplier: 2,
    condition: s => (s.buildings['hausbackofen']?.count ?? 0) >= 5,
  },
  {
    id: 'ultraofen', name: 'Ultra-Ofen', icon: '🌋',
    description: 'Vulkanische Hitze für dreifache Ofenleistung.',
    price: 100_000, type: 'building', buildingId: 'hausbackofen', multiplier: 3,
    condition: s => (s.buildings['hausbackofen']?.count ?? 0) >= 20,
  },

  // ─── KLEINE BÄCKEREI ──────────────────────────────────────────────────────

  {
    id: 'profi_mixer', name: 'Profi-Mixer', icon: '🥣',
    description: 'Industriemixer für doppelte Bäckereikapazität.',
    price: 1_500, type: 'building', buildingId: 'kleine_baeckerei', multiplier: 2,
    condition: s => (s.buildings['kleine_baeckerei']?.count ?? 0) >= 1,
  },
  {
    id: 'baeckerei_expansion', name: 'Bäckerei-Expansion', icon: '📐',
    description: 'Anbau und Erweiterung. Viermal mehr Kapazität.',
    price: 20_000, type: 'building', buildingId: 'kleine_baeckerei', multiplier: 4,
    condition: s => (s.buildings['kleine_baeckerei']?.count ?? 0) >= 5,
  },

  // ─── KONDITOREI ───────────────────────────────────────────────────────────

  {
    id: 'konditor_kurs', name: 'Konditor-Meisterkurs', icon: '🎓',
    description: 'Zertifizierte Konditoren verdoppeln die Tortenproduktion.',
    price: 10_000, type: 'building', buildingId: 'konditorei', multiplier: 2,
    condition: s => (s.buildings['konditorei']?.count ?? 0) >= 1,
  },
  {
    id: 'schweizer_schokolade', name: 'Schweizer Schokolade', icon: '🍫',
    description: 'Edle Schokolade verdoppelt Qualität und Menge der Konditorei.',
    price: 100_000, type: 'building', buildingId: 'konditorei', multiplier: 2,
    condition: s => (s.buildings['konditorei']?.count ?? 0) >= 5,
  },

  // ─── KUCHENFABRIK ─────────────────────────────────────────────────────────

  {
    id: 'auto_kuchenform', name: 'Automatische Kuchenformen', icon: '🤖',
    description: 'Robotergestützte Formen verdoppeln den Fabrikausstoß.',
    price: 60_000, type: 'building', buildingId: 'kuchenfabrik', multiplier: 2,
    condition: s => (s.buildings['kuchenfabrik']?.count ?? 0) >= 1,
  },
  {
    id: 'nano_roboter', name: 'Nano-Roboter', icon: '🔬',
    description: 'Winzige Nano-Roboter optimieren jeden Produktionsschritt. x3 Fabrik.',
    price: 5_000_000, type: 'building', buildingId: 'kuchenfabrik', multiplier: 3,
    condition: s => (s.buildings['kuchenfabrik']?.count ?? 0) >= 10,
  },

  // ─── MAGISCHE KUCHENMASCHINE ──────────────────────────────────────────────

  {
    id: 'magische_hefe', name: 'Magische Hefe', icon: '🧪',
    description: 'Geheimnisvolle Hefe verdoppelt die Maschinenleistung.',
    price: 400_000, type: 'building', buildingId: 'magische_kuchenmaschine', multiplier: 2,
    condition: s => (s.buildings['magische_kuchenmaschine']?.count ?? 0) >= 1,
  },
  {
    id: 'arkane_kristalle', name: 'Arkane Kristalle', icon: '🔮',
    description: 'Arkane Kraftkristalle dreifachen die magische Produktion.',
    price: 10_000_000, type: 'building', buildingId: 'magische_kuchenmaschine', multiplier: 3,
    condition: s => (s.buildings['magische_kuchenmaschine']?.count ?? 0) >= 5,
  },

  // ─── KUCHENPORTAL ─────────────────────────────────────────────────────────

  {
    id: 'dimensionsloch', name: 'Dimensionsloch', icon: '🌀',
    description: 'Ein stabiles Dimensionsloch verdoppelt den Portaldurchfluss.',
    price: 3_000_000, type: 'building', buildingId: 'kuchenportal', multiplier: 2,
    condition: s => (s.buildings['kuchenportal']?.count ?? 0) >= 1,
  },

  // ─── ZEITBÄCKEREI ─────────────────────────────────────────────────────────

  {
    id: 'zeitkristall', name: 'Zeitkristall', icon: '⌚',
    description: 'Komprimierte Zeitkristalle verdoppeln die Zeitbäckerei.',
    price: 20_000_000, type: 'building', buildingId: 'zeitbaeckerei', multiplier: 2,
    condition: s => (s.buildings['zeitbaeckerei']?.count ?? 0) >= 1,
  },

  // ─── KUCHENPLANET ─────────────────────────────────────────────────────────

  {
    id: 'planetenkern', name: 'Kuchenplanetenkern', icon: '🔥',
    description: 'Der glühende Kern des Kuchenplaneten produziert dreifach.',
    price: 200_000_000, type: 'building', buildingId: 'kuchenplanet', multiplier: 3,
    condition: s => (s.buildings['kuchenplanet']?.count ?? 0) >= 1,
  },

  // ─── KUCHENGALAXIE ────────────────────────────────────────────────────────

  {
    id: 'schwarzes_loch', name: 'Kuchen-Schwarzes-Loch', icon: '⚫',
    description: 'Das Schwarze Loch der Galaxis komprimiert und verdoppelt alle Energie.',
    price: 5_000_000_000, type: 'building', buildingId: 'kuchengalaxie', multiplier: 2,
    condition: s => (s.buildings['kuchengalaxie']?.count ?? 0) >= 1,
  },

  // ─── GLOBALE UPGRADES ─────────────────────────────────────────────────────

  {
    id: 'geheimrezept', name: 'Geheimes Familienrezept', icon: '📜',
    description: 'Ein uraltes Rezept steigert ALLE Gebäude um 50%.',
    price: 25_000, type: 'all_buildings', multiplier: 1.5,
    condition: s => s.totalCookies >= 10_000,
  },
  {
    id: 'zauberzucker', name: 'Zauberzucker', icon: '🌈',
    description: 'Magischer Zucker aus dem Feenwald. Verdoppelt alle Gebäude!',
    price: 500_000, type: 'all_buildings', multiplier: 2,
    condition: s => s.totalCookies >= 200_000,
  },
  {
    id: 'kuchengott_segen', name: 'Segen des Kuchengottes', icon: '🌟',
    description: 'Der Kuchengott segnet alle Gebäude. Dreifache Kraft!',
    price: 10_000_000, type: 'all_buildings', multiplier: 3,
    condition: s => s.totalCookies >= 5_000_000,
  },
  {
    id: 'universum_rezept', name: 'Universalrezept', icon: '🔭',
    description: 'Die Ur-Formel des Universums. x5 für alle Gebäude!',
    price: 1_000_000_000, type: 'all_buildings', multiplier: 5,
    condition: s => s.totalCookies >= 500_000_000,
  },
  {
    id: 'goettliches_backen', name: 'Göttliches Backen', icon: '⚡',
    description: 'Göttliches Wissen transformiert alle Gebäude. x10!',
    price: 100_000_000_000, type: 'all_buildings', multiplier: 10,
    condition: s => s.totalCookies >= 50_000_000_000,
  },

];
