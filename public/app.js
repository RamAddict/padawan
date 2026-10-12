import { RUDIMENTS, PT_NAMES, ES_NAMES, parse } from './rudiments.js';

const $ = (id) => document.getElementById(id);
const saved = JSON.parse(localStorage.getItem('padawan') || '{}');
const state = { idx: 0, bpms: {}, clickVol: 0.6, padVol: 0.5, trainer: false, custom: [], clickSound: 'beep',
  metro: { beats: 4, den: 4, sub: 1, acc: [2, 1, 1, 1] }, ...saved };
const save = () => localStorage.setItem('padawan', JSON.stringify(state));

// ---- i18n: English is in the HTML; other languages from the browser language (or chosen) ----
const lang = state.lang ?? (['pt', 'es'].find((l) => navigator.language.startsWith(l)) || 'en');
const PT = {
  title: 'Padawan · 40 rudimentos de bateria + metrônomo',
  sub: '40 rudimentos · treino no pad',
  legend: '<b style="color:var(--r)">D</b> direita · <b style="color:var(--l)">E</b> esquerda · <b style="color:var(--hi)">&gt;</b> acento · letras pequenas = notas de passagem (flam / drag) · <b>z</b> = buzz · sublinhado = um clique',
  tempo: 'Andamento (BPM)', click: 'Clique do metrônomo', sound: 'Som do rudimento',
  trainer: 'Treino de velocidade: +5 BPM a cada 4 voltas',
  footer: '<kbd>Espaço</kbd> tocar/parar · <kbd>←</kbd><kbd>→</kbd> rudimento · <kbd>↑</kbd><kbd>↓</kbd> andamento. Grátis e <a href="https://github.com/RamAddict/padawan">código aberto</a>. Baseado nos Rudimentos Internacionais da PAS.',
  play: '▶ Tocar', stop: '■ Parar', Rolls: 'Rulos', Diddles: 'Diddles', Flams: 'Flams', Drags: 'Drags',
  Mine: 'Meus rudimentos', new: '+ Novo rudimento', copy: ' (cópia)', confirmDel: 'Apagar este rudimento?',
  edTitle: 'Editor de rudimentos', edName: 'Nome', edSub: 'Notas por clique', edPattern: 'Padrão',
  edHelp: 'Uma nota por item, separadas por espaço: <b>D</b>/<b>E</b> mão · <b>&gt;</b> acento · <b>f</b> flam · <b>d</b> drag · <b>z</b> buzz · <b>-</b> pausa. Exemplo: <code>&gt;D E D D &gt;E D E E</code>',
  metro: 'Metrônomo livre', Metronome: 'Metrônomo', tsig: 'Compasso', subdiv: 'Subdivisão',
  sub1: '♩ Semínimas', sub2: '♫ Colcheias', sub3: '3 Tercinas', sub4: '♬ Semicolcheias', sub5: '5 Quintinas', sub6: '6 Sextinas',
  tapHint: 'Toque num tempo para alternar acento → normal → mudo.', beep: 'Bipe', clickS: 'Clique', wood: 'Bloco de madeira',
  about: 'Sobre', bad: 'Nota inválida: ', del: 'Apagar', cancel: 'Cancelar', save: 'Salvar', noName: 'Dê um nome.', empty: 'Adicione algumas notas.',
};
const ES = {
  title: 'Padawan · 40 rudimentos de batería + metrónomo',
  sub: '40 rudimentos · práctica en pad',
  legend: '<b style="color:var(--r)">D</b> derecha · <b style="color:var(--l)">I</b> izquierda · <b style="color:var(--hi)">&gt;</b> acento · letras pequeñas = notas de adorno (flam / drag) · <b>z</b> = buzz · subrayado = un clic',
  tempo: 'Tempo (BPM)', click: 'Clic del metrónomo', sound: 'Sonido del rudimento',
  trainer: 'Entrenador de velocidad: +5 BPM cada 4 vueltas',
  footer: '<kbd>Espacio</kbd> tocar/parar · <kbd>←</kbd><kbd>→</kbd> rudimento · <kbd>↑</kbd><kbd>↓</kbd> tempo. Gratis y de <a href="https://github.com/RamAddict/padawan">código abierto</a>. Basado en los Rudimentos Internacionales de la PAS.',
  play: '▶ Tocar', stop: '■ Parar', Rolls: 'Redobles', Diddles: 'Diddles', Flams: 'Flams', Drags: 'Drags',
  Mine: 'Mis rudimentos', new: '+ Nuevo rudimento', copy: ' (copia)', confirmDel: '¿Borrar este rudimento?',
  edTitle: 'Editor de rudimentos', edName: 'Nombre', edSub: 'Notas por clic', edPattern: 'Patrón',
  edHelp: 'Una nota por elemento, separadas por espacios: <b>D</b>/<b>I</b> mano · <b>&gt;</b> acento · <b>f</b> flam · <b>d</b> drag · <b>z</b> buzz · <b>-</b> silencio. Ejemplo: <code>&gt;D I D D &gt;I D I I</code>',
  metro: 'Metrónomo libre', Metronome: 'Metrónomo', tsig: 'Compás', subdiv: 'Subdivisión',
  sub1: '♩ Negras', sub2: '♫ Corcheas', sub3: '3 Tresillos', sub4: '♬ Semicorcheas', sub5: '5 Quintillos', sub6: '6 Seisillos',
  tapHint: 'Toca un tiempo para alternar acento → normal → silencio.', beep: 'Bip', clickS: 'Clic', wood: 'Bloque de madera',
  about: 'Acerca de', bad: 'Nota no válida: ', del: 'Borrar', cancel: 'Cancelar', save: 'Guardar', noName: 'Ponle un nombre.', empty: 'Agrega algunas notas.',
};
const STR = { pt: PT, es: ES }[lang];
const t = (k, en) => STR?.[k] ?? en;
const HANDS = { pt: 'DE', es: 'DI' }[lang] ?? 'RL'; // letters shown for right/left
const hand = (h) => HANDS['RL'.indexOf(h)];
const NAMES = { pt: PT_NAMES, es: ES_NAMES }[lang];
const isCustom = (r) => r.family === 'Mine';
const nameOf = (r) => (r.metro ? t('metro', r.name) : NAMES && !isCustom(r) ? NAMES[r.n - 1] : r.name);
const esc = (x) => x.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
// Pattern text as typed/shown uses the language's hand letters; stored patterns always use R/L.
const toShown = (p) => p.replace(/[RL](?=\s|$)/g, hand);
const fromShown = (p) => p.trim().replace(new RegExp(`[${HANDS}](?=\\s|$)`, 'g'), (h) => 'RL'[HANDS.indexOf(h)]);
document.documentElement.lang = lang;
if (STR) {
  document.title = STR.title;
  document.querySelectorAll('[data-t]').forEach((el) => (el.innerHTML = STR[el.dataset.t]));
}
$('lang').value = lang;
$('lang').onchange = (e) => { state.lang = e.target.value; save(); location.reload(); };

let rud, notes, cells;
// The free metronome is list entry 0; its sub/length come from state.metro.
const METRO = { n: 'metro', family: 'Metronome', name: 'Free metronome', bpm: 80, sub: 1, p: '', metro: true };
const all = () => [METRO, ...RUDIMENTS, ...state.custom];
const label = (r) => (r.metro ? '♩' : isCustom(r) ? '★' : r.n);
const bpm = () => state.bpms[rud.n] ?? rud.bpm;

// ---- list + score rendering ----
function renderList() {
  let family, html = '';
  all().forEach((r, i) => {
    if (r.family !== family) html += `<h2>${t((family = r.family), family)}</h2>`;
    html += `<button data-i="${i}"><span>${label(r)}</span>${esc(nameOf(r))}</button>`;
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

function renderMetro() {
  const m = state.metro;
  let html = '<div class="metro"><div class="pendulum"><div id="needle"></div></div><div class="beats">';
  for (let b = 0; b < m.beats; b++) html += `<div class="mbeat"><button class="dot l${m.acc[b]}" data-b="${b}">${b + 1}</button>${'<span class="subdot"></span>'.repeat(m.sub - 1)}</div>`;
  return html + '</div></div>';
}
// Beat 1 accented; compound meters (6/8, 9/8, 12/8) also accent every 3rd beat.
const defaultAcc = (beats, den) => Array.from({ length: beats }, (_, i) => (i === 0 || (den === 8 && beats % 3 === 0 && i % 3 === 0) ? 2 : 1));

function select(i) {
  const list = all();
  state.idx = (i + list.length) % list.length;
  rud = list[state.idx];
  document.querySelectorAll('#list button').forEach((b) => b.classList.toggle('on', +b.dataset.i === state.idx));
  document.querySelector('#list .on').scrollIntoView({ block: 'nearest' });
  $('title').innerHTML = `${rud.metro ? '' : label(rud) + '. '}${esc(nameOf(rud))}<small>${t(rud.family, isCustom(rud) ? 'My rudiments' : rud.family)}</small>`;
  if (rud.metro) {
    rud.sub = state.metro.sub;
    notes = Array(state.metro.beats * rud.sub).fill(null);
    $('score').innerHTML = renderMetro();
    cells = $('score').querySelectorAll('.dot, .subdot');
  } else {
    notes = parse(rud.p);
    $('score').innerHTML = renderScore(notes, rud.sub);
    cells = $('score').querySelectorAll('.note');
  }
  $('metroControls').hidden = !rud.metro;
  document.querySelector('.legend').hidden = $('edit').hidden = !!rud.metro;
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

// level: 2 accent, 1 normal, 0.5 subdivision, 0 muted
const SOUNDS = { beep: ['sine', 1100, 0.04, 1], click: ['square', 1500, 0.015, 0.4], wood: ['triangle', 700, 0.03, 1.2] };
function click(t, level) {
  if (!level || state.clickVol === 0) return;
  const [type, freq, decay, gain] = SOUNDS[state.clickSound] ?? SOUNDS.beep;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq * (level === 2 ? 1.6 : level === 1 ? 1 : 0.8);
  g.gain.setValueAtTime(state.clickVol * gain * (level === 2 ? 0.6 : level === 1 ? 0.35 : 0.18), t);
  g.gain.exponentialRampToValueAtTime(0.001, t + decay);
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
let timer, step = 0, nextT, loops = 0, beatNo = 0, wake;
const queue = [];

function tick() {
  while (nextT < ctx.currentTime + 0.12) {
    const dur = 60 / bpm() / rud.sub;
    const m = rud.metro && state.metro, onBeat = step % rud.sub === 0;
    if (onBeat) { beatNo++; click(nextT, m ? m.acc[step / rud.sub] : step === 0 ? 2 : 1); } else if (m) click(nextT, 0.5);
    if (notes[step]) hit(notes[step], nextT, dur);
    queue.push({ t: nextT, i: step, beat: beatNo });
    nextT += dur;
    if (++step >= notes.length) {
      step = 0;
      if (state.trainer && ++loops % 4 === 0) setBpm(bpm() + 5);
    }
  }
}

let last;
function draw() {
  if (!timer) return;
  let cur;
  while (queue.length && queue[0].t <= ctx.currentTime) cur = queue.shift();
  if (cur) { cells.forEach((c, i) => c.classList.toggle('now', i === cur.i)); last = cur; }
  if (rud.metro && last && $('needle')) {
    // pendulum: at an extreme on each beat, swinging to the other side by the next one
    const p = Math.min(1, (ctx.currentTime - last.t + (last.i % rud.sub) * 60 / bpm() / rud.sub) / (60 / bpm()));
    $('needle').style.transform = `rotate(${(last.beat % 2 ? -28 : 28) * Math.cos(Math.PI * p)}deg)`;
  }
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
  step = 0; loops = 0; beatNo = 0; last = null; nextT = ctx.currentTime + 0.1;
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
$('clickSound').value = state.clickSound;
$('clickSound').onchange = (e) => { state.clickSound = e.target.value; save(); };
let taps = [];
$('tap').onclick = () => {
  const now = performance.now();
  if (now - (taps.at(-1) ?? 0) > 2000) taps = [];
  taps = [...taps, now].slice(-5);
  if (taps.length > 1) setBpm((60000 * (taps.length - 1)) / (now - taps[0]));
};

// ---- free metronome controls ----
$('mBeats').innerHTML = Array.from({ length: 12 }, (_, i) => `<option>${i + 1}</option>`).join('');
$('mBeats').value = state.metro.beats; $('mDen').value = state.metro.den; $('mSub').value = state.metro.sub;
$('mBeats').onchange = $('mDen').onchange = () => {
  const m = state.metro;
  m.beats = +$('mBeats').value; m.den = +$('mDen').value; m.acc = defaultAcc(m.beats, m.den);
  save(); restartIfPlaying(() => select(state.idx));
};
$('mSub').onchange = () => { state.metro.sub = +$('mSub').value; save(); restartIfPlaying(() => select(state.idx)); };
$('score').onclick = (e) => {
  const b = e.target.closest('[data-b]');
  if (!b) return;
  const acc = state.metro.acc, i = +b.dataset.b;
  acc[i] = (acc[i] + 2) % 3; // accent -> normal -> mute -> accent
  b.classList.remove('l0', 'l1', 'l2'); b.classList.add(`l${acc[i]}`);
  save();
};
$('trainer').checked = state.trainer;
$('trainer').onchange = (e) => { state.trainer = e.target.checked; loops = 0; save(); };

document.addEventListener('keydown', (e) => {
  if (document.querySelector('dialog[open]') || e.target.tagName === 'SELECT' || (e.target.tagName === 'INPUT' && e.target.type !== 'range' && e.target.type !== 'checkbox')) return;
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
