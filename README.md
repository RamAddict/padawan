# 🥁 Padawan

Free, open source practice-pad trainer for the **40 PAS International Drum Rudiments**.
Pick a rudiment, see the sticking, hear it played over an adjustable metronome, and play along on your pad. No login, no install, no tracking.

- Sticking with accents, flams, drags and buzz strokes, with the current note highlighted as it plays
- Metronome with an adjustable tempo (30–240 BPM) and separate click and rudiment volumes
- Quick tempo buttons (60/80/100/120/140) and a speed trainer: +5 BPM every 4 loops
- Free metronome: time signature, subdivisions (8ths, triplets, 16ths, quintuplets, sextuplets), per-beat accent/mute, pendulum, tap tempo, 3 click sounds
- Editor for your own rudiments (or copies of the built-in ones), saved in your browser
- English, Portuguese and Spanish, picked from the browser language
- Light, dark or system theme
- Remembers your tempo per rudiment (localStorage)
- Keyboard: `Space` play/stop · `←` `→` rudiment · `↑` `↓` tempo

## Run locally

Plain static files, no build step:

```sh
python -m http.server 8787 -d public   # then open http://localhost:8787
node test.mjs                # checks the rudiment data
```

## Deploy

Every push to `main` deploys `public/` to GitHub Pages ([workflow](.github/workflows/pages.yml)): https://ramaddict.github.io/padawan/

## Contributing

All rudiments live in [`public/rudiments.js`](public/rudiments.js) as a short pattern string, e.g. `'fR L R R fL R L L'` (`>` accent, `f` flam, `d` drag, `z` buzz, `-` rest). Corrections are welcome.

MIT licensed.
