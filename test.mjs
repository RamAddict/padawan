// Run: node test.mjs — every rudiment parses and fills whole beats.
import assert from 'node:assert';
import { RUDIMENTS, PT_NAMES, parse } from './public/rudiments.js';

assert.equal(RUDIMENTS.length, 40);
assert.equal(PT_NAMES.length, 40);
RUDIMENTS.forEach((r, i) => {
  assert.equal(r.n, i + 1);
  const notes = parse(r.p);
  assert.equal(notes.length % r.sub, 0, `${r.name}: ${notes.length} steps not a multiple of ${r.sub}`);
  assert.ok(notes[0], `${r.name}: should start on a note`);
});
assert.deepEqual(parse('>fL -'), [{ accent: true, orn: 'f', hand: 'L' }, null]);
assert.throws(() => parse('X'));
console.log('ok');
