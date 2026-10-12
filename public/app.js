import { RUDIMENTS, PT_NAMES, parse } from './rudiments.js';

const $ = (id) => document.getElementById(id);
const saved = JSON.parse(localStorage.getItem('padawan') || '{}');
const state = { idx: 0, bpms: {}, clickVol: 0.6, padVol: 0.5, trainer: false, custom: [], ...saved };
const save = () => localStorage.setItem('padawan', JSON.stringify(state));

// ---- i18n: English is in the HTML; Portuguese when the browser language is pt-* (or chosen) ----
const pt = (state.lang ?? (navigator.language.startsWith('pt') ? 'pt' : 'en')) === 'pt';
const PT = {
  sub: '40 rudimentos · treino no pad',
  legend: '<b style="color:var(--r)">D</b> direita · <b style="color:var(--l)">E</b> esquerda · <b style="color:var(--hi)">&gt;</b> acento · letras pequenas = notas de passagem (flam / drag) · <b>z</b> = buzz · sublinhado = um clique',
  tempo: 'Andamento (BPM)', click: 'Clique do metrônomo', sound: 'Som do rudimento',
  trainer: 'Treino de velocidade: +5 BPM a cada 4 voltas',
  footer: '<kbd>Espaço</kbd> tocar/parar · <kbd>←</kbd><kbd>→</kbd> rudimento · <kbd>↑</kbd><kbd>↓</kbd> andamento. Grátis e <a href="https://github.com/RamAddict/padawan">código aberto</a>. Baseado nos Rudimentos Internacionais da PAS.',
  play: '▶ Tocar', stop: '■ Parar', Rolls: 'Rulos', Diddles: 'Diddles', Flams: 'Flams', Drags: 'Drags',
  Mine: 'Meus rudimentos', new: '+ Novo rudimento', copy: ' (cópia)', confirmDel: 'Apagar este rudimento?',
  edTitle: 'Editor de rudimentos', edName: 'Nome', edSub: 'Notas por clique', edPattern: 'Padrão',
  edHelp: 'Uma nota por item, separadas por espaço: <b>D</b>/<b>E</b> mão · <b>&gt;</b> acento · <b>f</b> flam · <b>d</b> drag · <b>z</b> buzz · <b>-</b> pausa. Exemplo: <code>&gt;D E D D &gt;E D E E</code>',
  about: 'Sobre', bad: 'Nota inválida: ', del: 'Apagar', cancel: 'Cancelar', save: 'Salvar', noName: 'Dê um nome.', empty: 'Adicione algumas notas.',
};
const t = (k, en) => (pt ? PT[k] : en);
const hand = (h) => (pt ? { R: 'D', L: 'E' }[h] : h);
const isCustom = (r) => typeof r.n === 'string';
const nameOf = (r) => (pt && !isCustom(r) ? PT_NAMES[r.n - 1] : r.name);
const esc = (x) => x.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
// Pattern text as typed/shown: Portuguese uses D/E for the hands; stored patterns always use R/L.
const toShown = (p) => p.replace(/[RL](?=\s|$)/g, hand);
const fromShown = (p) => (pt ? p.trim().replace(/[DE](?=\s|$)/g, (h) => (h === 'D' ? 'R' : 'L')) : p.trim());
if (pt) {
  document.documentElement.lang = 'pt-BR';
  document.title = 'Padawan · 40 rudimentos de bateria + metrônomo';
  document.querySelectorAll('[data-t]').forEach((el) => (el.innerHTML = PT[el.dataset.t]));
}
$('lang').textContent = pt ? 'English' : 'Português';
$('lang').onclick = () => { state.lang = pt ? 'en' : 'pt'; save(); location.reload(); };

let rud, notes, cells;
const all = () => [...RUDIMENTS, ...state.custom];
const bpm = () => state.bpms[rud.n] ?? rud.bpm;

// ---- list + score rendering ----
function renderList() {
  let family, html = '';
  all().forEach((r, i) => {
    if (r.family !== family) html += `<h2>${t((family = r.family), family)}</h2>`;
    html += `<button data-i="${i}"><span>${isCustom(r) ? '★' : r.n}</span>${esc(nameOf(r))}</button>`;
  });
  if (family !== 'Mine') html += `<h2>${t('Mine', 'My rudiments')}</h2>`;
  $('items').innerHTML = html + `<button data-new>${t('new', '+ New rudiment')}</button>`;
}
$('items').onclick = (e) => {
  const b = e.target.closest('button');
  if (b?.dataset.i) restartIfPlaying(() => select(+b.dataset.i));
  if (b?.hasAttribute('data-new')) openEditor(null);
};

function renderScore(notes, sub) {
  let html = '';
  notes.forEach((x, s) => {
    if (s % sub === 0) html += `${s ? '</div>' : ''}<div class="beat${s ? '' : ' down'}">`;
    if (!x) { html += '<div class="note rest"><div class="acc"></div><div class="st">·</div></div>'; return; }
    const g = hand(x.hand === 'R' ? 'L' : 'R').toLowerCase();
    const grace = x.orn === 'f' ? `<sup>${g}</sup>` : x.orn === 'd' ? `<sup>${g + g}</sup>` : '';
    html += `<div class="note ${x.hand}"><div class="acc">${x.accent ? '&gt;' : ''}</div><div class="st">${grace}${hand(x.hand)}${x.orn === 'z' ? '<sup>z</sup>' : ''}</div></div>`;
  });
  return notes.length ? html + '</div>' : '';
}

function select(i) {
  const list = all();
  state.idx = (i + list.length) % list.length;
  rud = list[state.idx];
  notes = parse(rud.p);
  document.querySelectorAll('#list button').forEach((b) => b.classList.toggle('on', +b.dataset.i === state.idx));
  document.querySelector('#list .on').scrollIntoView({ block: 'nearest' });
  $('title').innerHTML = `${isCustom(rud) ? '★' : rud.n}. ${esc(nameOf(rud))}<small>${t(rud.family, isCustom(rud) ? 'My rudiments' : rud.family)}</small>`;
  $('score').innerHTML = renderScore(notes, rud.sub);
  cells = $('score').querySelectorAll('.note');
  step = 0;
  setBpm(bpm());
}

function setBpm(v) {
  v = Math.max(30, Math.min(240, Math.round(v)));
  state.bpms[rud.n] = v;
  $('bpm').value = v;
  $('bpmOut').textContent = v;
  for (const b of $('presets').children) b.classList.toggle('on', +b.textContent === v);
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
function pad(t, vel, hand, decay = 0.06) {
  if (state.padVol === 0 || t < ctx.currentTime) return;
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noise;
  f.type = 'bandpass'; f.frequency.value = hand === 'R' ? 2200 : 1700; f.Q.value = 1.2;
  g.gain.setValueAtTime(vel * state.padVol * 2, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + decay);
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
  const g = x.hand === 'R' ? 'L' : 'R';
  const v = x.accent ? 1 : x.orn === 'f' ? 0.75 : 0.45; // flams are full strokes
  if (x.orn === 'f') pad(t - Math.min(0.05, dur * 0.4), 0.35, g, 0.03); // grace spacing shrinks at fast tempos
  if (x.orn === 'd') { const gap = Math.min(0.035, dur * 0.3); pad(t - 2 * gap, 0.3, g, 0.025); pad(t - gap, 0.3, g, 0.025); }
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
    $('play').textContent = t('play', '▶ Play');
    return;
  }
  if (!ctx) initAudio();
  await ctx.resume();
  step = 0; loops = 0; nextT = ctx.currentTime + 0.1;
  timer = setInterval(tick, 25); tick();
  requestAnimationFrame(draw);
  wake = await navigator.wakeLock?.request('screen').catch(() => null);
  $('play').textContent = t('stop', '■ Stop');
}

// ---- wiring ----
const restartIfPlaying = (fn) => { const p = !!timer; if (p) toggle(); fn(); if (p) toggle(); };
$('play').onclick = toggle;
$('prev').onclick = () => restartIfPlaying(() => select(state.idx - 1));
$('next').onclick = () => restartIfPlaying(() => select(state.idx + 1));
$('up').onclick = () => setBpm(bpm() + 5);
$('down').onclick = () => setBpm(bpm() - 5);
$('bpm').oninput = (e) => setBpm(+e.target.value);
$('presets').onclick = (e) => { if (e.target.tagName === 'BUTTON') setBpm(+e.target.textContent); };
for (const k of ['clickVol', 'padVol']) {
  $(k).value = state[k];
  $(k).oninput = (e) => { state[k] = +e.target.value; save(); };
}
$('trainer').checked = state.trainer;
$('trainer').onchange = (e) => { state.trainer = e.target.checked; loops = 0; save(); };

document.addEventListener('keydown', (e) => {
  if (document.querySelector('dialog[open]') || (e.target.tagName === 'INPUT' && e.target.type !== 'range' && e.target.type !== 'checkbox')) return;
  const k = { ' ': () => toggle(), ArrowLeft: () => $('prev').click(), ArrowRight: () => $('next').click(),
    ArrowUp: () => setBpm(bpm() + 1), ArrowDown: () => setBpm(bpm() - 1) }[e.key];
  if (k) { e.preventDefault(); e.target.blur?.(); k(); }
});

// ---- editor: custom rudiments live in localStorage (state.custom) ----
let editing; // the custom rudiment being edited, or null for a new one
const KEYS = ['R', 'L', '>R', '>L', 'fR', 'fL', 'dR', 'dL', 'zR', 'zL', '-'];
$('edKeys').innerHTML = KEYS.map((k) => `<button type="button" class="b" data-k="${k}">${esc(toShown(k))}</button>`).join('') + '<button type="button" class="b" data-k="">⌫</button>';
$('edKeys').onclick = (e) => {
  const k = e.target.closest('button')?.dataset.k;
  if (k === undefined) return;
  const toks = $('edPattern').value.trim().split(/\s+/).filter(Boolean);
  k ? toks.push(toShown(k)) : toks.pop();
  $('edPattern').value = toks.join(' ');
  preview();
};

function preview() {
  try {
    const n = $('edPattern').value.trim() ? parse(fromShown($('edPattern').value)) : [];
    $('edPreview').innerHTML = renderScore(n, +$('edSub').value);
    $('edErr').textContent = '';
    return true;
  } catch (err) {
    $('edErr').textContent = t('bad', 'Not a valid note: ') + /"(.*?)"/.exec(err.message)[1];
  }
}
$('edPattern').oninput = $('edSub').onchange = preview;

function openEditor(r) {
  editing = r && isCustom(r) ? r : null;
  $('edName').value = r ? nameOf(r) + (editing ? '' : t('copy', ' (copy)')) : '';
  $('edSub').value = r ? r.sub : 4;
  $('edPattern').value = r ? toShown(r.p) : '';
  $('edDel').hidden = !editing;
  preview();
  $('editor').showModal();
}
$('edit').onclick = () => openEditor(rud);
$('aboutBtn').onclick = () => $('about').showModal();
$('edCancel').onclick = () => $('editor').close();
$('edSave').onclick = () => {
  const name = $('edName').value.trim(), sub = +$('edSub').value;
  const toks = fromShown($('edPattern').value).split(/\s+/).filter(Boolean);
  if (!preview()) return;
  if (!name) return ($('edErr').textContent = t('noName', 'Give it a name.'));
  if (!toks.length) return ($('edErr').textContent = t('empty', 'Add some notes.'));
  while (toks.length % sub) toks.push('-'); // fill the last beat with rests
  const r = { n: editing?.n ?? `c${Date.now()}`, name, family: 'Mine', sub, bpm: 70, p: toks.join(' ') };
  if (editing) state.custom[state.custom.indexOf(editing)] = r; else state.custom.push(r);
  save(); renderList();
  $('editor').close();
  restartIfPlaying(() => select(all().indexOf(r)));
};
$('edDel').onclick = () => {
  if (!confirm(t('confirmDel', 'Delete this rudiment?'))) return;
  state.custom = state.custom.filter((c) => c !== editing);
  delete state.bpms[editing.n];
  save(); renderList();
  $('editor').close();
  restartIfPlaying(() => select(Math.min(state.idx, all().length - 1)));
};

$('play').textContent = t('play', '▶ Play');
renderList();
select(state.idx);
