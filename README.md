# Custom Mailers

Custom Mailers is a standalone, browser-only letter-size campaign-literature
builder. It is published by the `tools4abdul/cliposition` Pages workflow at
`https://tools4abdul.com/generator/mailer/`; it is not part of the sign-generator
application.

## Knowledge and provenance

`tools4abdul/cliposition` is authoritative for policy language. Its normalized
records at `shared/candidates/abdul/data/issues.json` supply issue ids, ordering,
categories, titles, summaries, talking points, sources, additional sources, and
tags. `scripts/sync-knowledge.mjs` runs at build time, validates that input, and
generates the deliberately smaller mailer model at `js/data/knowledge.generated.js`.
That generated file is ignored and never edited by hand. The UI reads it only via
`js/data/position-source.js`.

The adapter copies approved strings exactly; it does not use an LLM, paraphrase,
or create short policy copy. It preserves `source` and `additionalSources` for
auditability even though citations are not printed beside each claim.

`js/data/campaign-config.js` owns presentation configuration such as the QR
destination. `npm run prepare:qr` regenerates the SVG from that configured HTTPS
destination. Candidate photos, logos, typefaces, templates, and layouts remain
mailer-local presentation assets.

## Develop

Clone the canonical repository beside this one, then install and run:

```powershell
git clone https://github.com/tools4abdul/cliposition.git ../cliposition
npm ci
npm run build
python -m http.server 8080 -d dist
```

`npm run build` uses `../cliposition/shared/candidates/abdul/data/issues.json` by
default. In another checkout, pass its explicit path instead:

```powershell
$env:CANONICAL_KB_PATH = 'C:\path\to\cliposition\shared\candidates\abdul\data\issues.json'
npm run build
```

For an intentionally remote source, set `CANONICAL_KB_URL`. A missing, invalid,
or empty canonical source fails the build; there is no stale policy fallback.

Run `npm test` for adapter/base-path checks. The app autosaves only its own state
under `tools4abdul.mailer.session` in local storage.

## Deploy integration

The Pages workflow in `tools4abdul/cliposition` checks out this repository,
passes its local canonical data path to the build, and copies `dist/` into
`dist/generator/mailer/` in the combined Pages artifact. This keeps both apps
independently buildable while making one deployment responsible for the final
mount. Relative assets and `<base href="./">` make direct navigation and refresh
under `/generator/mailer/` safe.

## Content audit

The retired `js/data/positions.js` was a shadow policy corpus. All 39 local ids
map to the canonical library. The canonical library additionally supplies four
issues absent from that old file: `medical-debt`, `utility-bills`,
`gordie-howe-bridge`, and `line-5`; pending canonical records are deliberately
not published. The historic wording differences are not retained: the canonical
records win. Photos, logo options, colorways, templates, font files, and QR
configuration are presentation/asset data and remain local.
