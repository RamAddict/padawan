// The 40 PAS International Drum Rudiments.
// Pattern tokens (space separated, one per grid step):
//   R / L   stroke          >   accent prefix       -  rest
//   fR      flam (grace from opposite hand)
//   dR      drag (two graces from opposite hand)
//   zR      buzz / multiple bounce stroke
// `sub` = grid steps per metronome beat. Patterns must fill whole beats.

export const RUDIMENTS = [
  // I. Roll rudiments: single stroke
  { n: 1, name: 'Single Stroke Roll', family: 'Rolls', sub: 4, bpm: 80, p: 'R L R L R L R L' },
  { n: 2, name: 'Single Stroke Four', family: 'Rolls', sub: 6, bpm: 60, p: '>L - - L R L >R - - R L R' },
  { n: 3, name: 'Single Stroke Seven', family: 'Rolls', sub: 6, bpm: 60, p: 'R L R L R L >R - - - - - L R L R L R >L - - - - -' },
  // multiple bounce
  { n: 4, name: 'Multiple Bounce Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'zR zL zR zL' },
  { n: 5, name: 'Triple Stroke Roll', family: 'Rolls', sub: 6, bpm: 60, p: 'R R R L L L R R R L L L' },
  // double stroke open
  { n: 6, name: 'Double Stroke Open Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L' },
  { n: 7, name: 'Five Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L >R - - - L L R R >L - - -' },
  { n: 8, name: 'Six Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: '>R - L L R R >L -' },
  { n: 9, name: 'Seven Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'L L R R L L >R - R R L L R R >L -' },
  { n: 10, name: 'Nine Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L >R - - - L L R R L L R R >L - - -' },
  { n: 11, name: 'Ten Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L >R - >L -' },
  { n: 12, name: 'Eleven Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L R R >L - L L R R L L R R L L >R -' },
  { n: 13, name: 'Thirteen Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L R R L L >R - - - L L R R L L R R L L R R >L - - -' },
  { n: 14, name: 'Fifteen Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L R R L L R R >L - L L R R L L R R L L R R L L >R -' },
  { n: 15, name: 'Seventeen Stroke Roll', family: 'Rolls', sub: 4, bpm: 70, p: 'R R L L R R L L R R L L R R L L >R - - - L L R R L L R R L L R R L L R R >L - - -' },

  // II. Diddle rudiments
  { n: 16, name: 'Single Paradiddle', family: 'Diddles', sub: 4, bpm: 80, p: '>R L R R >L R L L' },
  { n: 17, name: 'Double Paradiddle', family: 'Diddles', sub: 6, bpm: 60, p: '>R L R L R R >L R L R L L' },
  { n: 18, name: 'Triple Paradiddle', family: 'Diddles', sub: 4, bpm: 70, p: '>R L R L R L R R >L R L R L R L L' },
  { n: 19, name: 'Single Paradiddle-Diddle', family: 'Diddles', sub: 6, bpm: 60, p: '>R L R R L L >R L R R L L' },

  // III. Flam rudiments
  { n: 20, name: 'Flam', family: 'Flams', sub: 2, bpm: 70, p: 'fR - fL -' },
  { n: 21, name: 'Flam Accent', family: 'Flams', sub: 3, bpm: 70, p: 'fR L R fL R L' },
  { n: 22, name: 'Flam Tap', family: 'Flams', sub: 4, bpm: 70, p: 'fR R fL L' },
  { n: 23, name: 'Flamacue', family: 'Flams', sub: 4, bpm: 70, p: 'fR >L R L fR - - - fL >R L R fL - - -' },
  { n: 24, name: 'Flam Paradiddle', family: 'Flams', sub: 4, bpm: 70, p: 'fR L R R fL R L L' },
  { n: 25, name: 'Single Flammed Mill', family: 'Flams', sub: 4, bpm: 70, p: 'fR R L R fL L R L' },
  { n: 26, name: 'Flam Paradiddle-Diddle', family: 'Flams', sub: 6, bpm: 60, p: 'fR L R R L L fL R L L R R' },
  { n: 27, name: 'Pataflafla', family: 'Flams', sub: 4, bpm: 70, p: 'fR L R fL fR L R fL' },
  { n: 28, name: 'Swiss Army Triplet', family: 'Flams', sub: 3, bpm: 70, p: 'fR R L fR R L' },
  { n: 29, name: 'Inverted Flam Tap', family: 'Flams', sub: 4, bpm: 70, p: 'fR L fL R' },
  { n: 30, name: 'Flam Drag', family: 'Flams', sub: 4, bpm: 60, p: 'fR - L L R - fL - R R L -' },

  // IV. Drag rudiments
  { n: 31, name: 'Drag', family: 'Drags', sub: 2, bpm: 70, p: 'dR - dL -' },
  { n: 32, name: 'Single Drag Tap', family: 'Drags', sub: 2, bpm: 70, p: 'dR >L dL >R' },
  { n: 33, name: 'Double Drag Tap', family: 'Drags', sub: 3, bpm: 60, p: 'dR dR >L dL dL >R' },
  { n: 34, name: 'Lesson 25', family: 'Drags', sub: 4, bpm: 70, p: 'dR L >R - dR L >R -' },
  { n: 35, name: 'Single Dragadiddle', family: 'Drags', sub: 4, bpm: 70, p: '>dR L R R >dL R L L' },
  { n: 36, name: 'Drag Paradiddle #1', family: 'Drags', sub: 4, bpm: 60, p: '>R - dR L R R >L - dL R L L' },
  { n: 37, name: 'Drag Paradiddle #2', family: 'Drags', sub: 4, bpm: 60, p: '>R - dR - dR L R R >L - dL - dL R L L' },
  { n: 38, name: 'Single Ratamacue', family: 'Drags', sub: 4, bpm: 70, p: 'dR L R >L dL R L >R' },
  { n: 39, name: 'Double Ratamacue', family: 'Drags', sub: 6, bpm: 50, p: 'dR dR L R >L - dL dL R L >R -' },
  { n: 40, name: 'Triple Ratamacue', family: 'Drags', sub: 4, bpm: 60, p: 'dR dR dR L R >L - - dL dL dL R L >R - -' },
];

// "fR" -> { hand: 'R', accent: false, orn: 'f' }; "-" -> null
export function parse(pattern) {
  return pattern.trim().split(/\s+/).map((t) => {
    if (t === '-') return null;
    const m = /^(>?)([fdz]?)([RL])$/.exec(t);
    if (!m) throw new Error(`bad token "${t}" in "${pattern}"`);
    return { accent: !!m[1], orn: m[2], hand: m[3] };
  });
}

// Portuguese names, same order as RUDIMENTS.
export const PT_NAMES = [
  'Rulo de Toques Simples', 'Toque Simples de Quatro', 'Toque Simples de Sete', 'Rulo de Múltiplos Toques',
  'Rulo de Toques Triplos', 'Rulo de Toques Duplos', 'Rulo de 5 Toques', 'Rulo de 6 Toques', 'Rulo de 7 Toques',
  'Rulo de 9 Toques', 'Rulo de 10 Toques', 'Rulo de 11 Toques', 'Rulo de 13 Toques', 'Rulo de 15 Toques', 'Rulo de 17 Toques',
  'Paradiddle Simples', 'Paradiddle Duplo', 'Paradiddle Triplo', 'Paradiddle-Diddle Simples',
  'Flam', 'Flam Acentuado', 'Flam Tap', 'Flamacue', 'Flam Paradiddle', 'Flammed Mill Simples', 'Flam Paradiddle-Diddle',
  'Pataflafla', 'Tercina Suíça', 'Flam Tap Invertido', 'Flam Drag',
  'Drag', 'Drag Tap Simples', 'Drag Tap Duplo', 'Lição 25', 'Dragadiddle Simples', 'Drag Paradiddle nº 1',
  'Drag Paradiddle nº 2', 'Ratamacue Simples', 'Ratamacue Duplo', 'Ratamacue Triplo',
];

export const ES_NAMES = [
  'Redoble de Golpes Simples', 'Golpe Simple de Cuatro', 'Golpe Simple de Siete', 'Redoble de Rebote Múltiple',
  'Redoble de Golpes Triples', 'Redoble de Golpes Dobles', 'Redoble de 5 Golpes', 'Redoble de 6 Golpes', 'Redoble de 7 Golpes',
  'Redoble de 9 Golpes', 'Redoble de 10 Golpes', 'Redoble de 11 Golpes', 'Redoble de 13 Golpes', 'Redoble de 15 Golpes', 'Redoble de 17 Golpes',
  'Paradiddle Simple', 'Paradiddle Doble', 'Paradiddle Triple', 'Paradiddle-Diddle Simple',
  'Flam', 'Flam Acentuado', 'Flam Tap', 'Flamacue', 'Flam Paradiddle', 'Flammed Mill Simple', 'Flam Paradiddle-Diddle',
  'Pataflafla', 'Tresillo Suizo', 'Flam Tap Invertido', 'Flam Drag',
  'Drag', 'Drag Tap Simple', 'Drag Tap Doble', 'Lección 25', 'Dragadiddle Simple', 'Drag Paradiddle nº 1',
  'Drag Paradiddle nº 2', 'Ratamacue Simple', 'Ratamacue Doble', 'Ratamacue Triple',
];
