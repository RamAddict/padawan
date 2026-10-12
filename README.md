# 🥁 Padawan

Free, open source practice-pad trainer for the **40 PAS International Drum Rudiments**.
Pick a rudiment, see the sticking, hear it played over an adjustable metronome, and play along on your pad. No login, no install, no tracking.

- Sticking with accents, flams, drags and buzz strokes, with the current note highlighted as it plays
- Metronome with an adjustable tempo (30–240 BPM) and separate click and rudiment volumes
- Speed trainer: +5 BPM every 4 loops
- Remembers your tempo per rudiment (localStorage)
- Keyboard: `Space` play/stop · `←` `→` rudiment · `↑` `↓` tempo

## Run locally

Plain static files, no build step:

```sh
python -m http.server 8787 -d public   # then open http://localhost:8787
node test.mjs                # checks the rudiment data
```

## Deploy

```sh
npx wrangler deploy
```

## Contributing

All rudiments live in [`public/rudiments.js`](public/rudiments.js) as a short pattern string, e.g. `'fR L R R fL R L L'` (`>` accent, `f` flam, `d` drag, `z` buzz, `-` rest). Corrections are welcome.

MIT licensed.
