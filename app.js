import { RUDIMENTS, parse } from './rudiments.js';

const $ = (id) => document.getElementById(id);
const saved = JSON.parse(localStorage.getItem('padawan') || '{}');
const state = { idx: 0, bpms: {}, clickVol: 0.6, padVol: 0.5, trainer: false, ...saved };
const save = () => localStorage.setItem('padawan', JSON.stringify(state));

let rud, notes, cells;
const bpm = () => state.bpms[rud.n] ?? rud.bpm;

// ---- list + score rendering ----
let family;
for (const r of RUDIMENTS) {
  if (r.family !== family) $('list').insertAdjacentHTML('beforeend', `<h2>${(family = r.family)}</h2>`);
  $('list').insertAdjacentHTML('beforeend', `<button data-i="${r.n - 1}"><span>${r.n}</span>${r.name}</button>`);
}
$('list').onclick = (e) => { const b = e.target.closest('button'); if (b) select(+b.dataset.i); };

function select(i) {
  state.idx = (i + RUDIMENTS.length) % RUDIMENTS.length;
  rud = RUDIMENTS[state.idx];
  notes = parse(rud.p);
  document.querySelectorAll('#list button').forEach((b) => b.classList.toggle('on', +b.dataset.i === state.idx));
  document.querySelector('#list .on').scrollIntoView({ block: 'nearest' });
  $('title').innerHTML = `${rud.n}. ${rud.name}<small>${rud.family}</small>`;
  let html = '';
  notes.forEach((x, s) => {
    if (s % rud.sub === 0) html += `${s ? '</div>' : ''}<div class="beat${s ? '' : ' down'}">`;
    if (!x) { html += '<div class="note rest"><div class="acc"></div><div class="st">·</div></div>'; return; }
    const g = x.hand === 'R' ? 'l' : 'r';
    const grace = x.orn === 'f' ? `<sup>${g}</sup>` : x.orn === 'd' ? `<sup>${g + g}</sup>` : '';
    html += `<div class="note ${x.hand}"><div class="acc">${x.accent ? '&gt;' : ''}</div><div class="st">${grace}${x.hand}${x.orn === 'z' ? '<sup>z</sup>' : ''}</div></div>`;
  });
  $('score').innerHTML = html + '</div>';
  cells = $('score').querySelectorAll('.note');
  step = 0;
  setBpm(bpm());
}

function setBpm(v) {
  v = Math.max(30, Math.min(240, Math.round(v)));
  state.bpms[rud.n] = v;
  $('bpm').value = v;
  $('bpmOut').textContent = v;
  save();
}

// ---- audio ----
let ctx, noise;
function initAudio() {
  ctx = new AudioContext();
  noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

// A practice-pad "tock": band-passed noise burst. Right hand pitched slightly higher.
function pad(t, vel, hand) {
  if (state.padVol === 0 || t < ctx.currentTime) return;
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noise;
  f.type = 'bandpass'; f.frequency.value = hand === 'R' ? 2200 : 1700; f.Q.value = 1.2;
  g.gain.setValueAtTime(vel * state.padVol * 2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t); src.stop(t + 0.08);
}

function click(t, down) {
  if (state.clickVol === 0) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.value = down ? 1760 : 1100;
  g.gain.setValueAtTime(state.clickVol * (down ? 0.6 : 0.35), t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + 0.05);
}

function hit(x, t, dur) {
  const v = x.accent ? 1 : 0.45, g = x.hand === 'R' ? 'L' : 'R';
  const gap = Math.min(0.035, dur * 0.4); // grace spacing; shrinks at fast tempos
  if (x.orn === 'f') pad(t - gap, 0.15, g);
  if (x.orn === 'd') { pad(t - 2 * gap, 0.15, g); pad(t - gap, 0.15, g); }
  if (x.orn === 'z') { for (let k = 0; k < 4; k++) pad(t + (k * dur) / 4, v * (1 - k * 0.2), x.hand); return; }
  pad(t, v, x.hand);
}

// ---- scheduler (lookahead pattern: setInterval queues audio slightly ahead of time) ----
let timer, step = 0, nextT, loops = 0, wake;
const queue = [];

function tick() {
  while (nextT < ctx.currentTime + 0.12) {
    const dur = 60 / bpm() / rud.sub;
    if (step % rud.sub === 0) click(nextT, step === 0);
    if (notes[step]) hit(notes[step], nextT, dur);
    queue.push({ t: nextT, i: step });
    nextT += dur;
    if (++step >= notes.length) {
      step = 0;
      if (state.trainer && ++loops % 4 === 0) setBpm(bpm() + 5);
    }
  }
}

function draw() {
  if (!timer) return;
  let cur;
  while (queue.length && queue[0].t <= ctx.currentTime) cur = queue.shift();
  if (cur) cells.forEach((c, i) => c.classList.toggle('now', i === cur.i));
  requestAnimationFrame(draw);
}

async function toggle() {
  if (timer) {
    clearInterval(timer); timer = null; queue.length = 0;
    cells.forEach((c) => c.classList.remove('now'));
    wake?.release();
    $('play').textContent = '▶ Play';
    return;
  }
  if (!ctx) initAudio();
  await ctx.resume();
  step = 0; loops = 0; nextT = ctx.currentTime + 0.1;
  timer = setInterval(tick, 25); tick();
  requestAnimationFrame(draw);
  wake = await navigator.wakeLock?.request('screen').catch(() => null);
  $('play').textContent = '■ Stop';
}

// ---- wiring ----
const restartIfPlaying = (fn) => { const p = !!timer; if (p) toggle(); fn(); if (p) toggle(); };
$('play').onclick = toggle;
$('prev').onclick = () => restartIfPlaying(() => select(state.idx - 1));
$('next').onclick = () => restartIfPlaying(() => select(state.idx + 1));
$('list').addEventListener('click', () => { if (timer) restartIfPlaying(() => {}); });
$('up').onclick = () => setBpm(bpm() + 5);
$('down').onclick = () => setBpm(bpm() - 5);
$('bpm').oninput = (e) => setBpm(+e.target.value);
for (const k of ['clickVol', 'padVol']) {
  $(k).value = state[k];
  $(k).oninput = (e) => { state[k] = +e.target.value; save(); };
}
$('trainer').checked = state.trainer;
$('trainer').onchange = (e) => { state.trainer = e.target.checked; loops = 0; save(); };

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type !== 'range' && e.target.type !== 'checkbox') return;
  const k = { ' ': () => toggle(), ArrowLeft: () => $('prev').click(), ArrowRight: () => $('next').click(),
    ArrowUp: () => setBpm(bpm() + 1), ArrowDown: () => setBpm(bpm() - 1) }[e.key];
  if (k) { e.preventDefault(); e.target.blur?.(); k(); }
});

select(state.idx);
