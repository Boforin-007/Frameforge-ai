# HACKER HOUSE — GOA · Identity Generator

The one-click identity generator for HACKER HOUSE GOA builders. Enter your
details, drop in a photo, hit generate, and download a verified HACKER HOUSE
GOA ID card as PNG or PDF — with a scannable QR that links to a public
verification page.

No database, no accounts. Everything runs on local file storage.

## Features

- **One-click ID generator** — your ID number is generated automatically
  (`HH-2026-XXXX`), the QR and verification link embed themselves, and the card
  preview updates live as you type.
- **Photo adjustment** — upload a photo and fine-tune zoom + pan before export.
- **Live canvas editor** — full Konva editor with text, photo, logo, shape, and
  QR elements for full control.
- **Bulk import** — generate a batch of ID cards from a CSV with column mapping.
- **Downloads** — every export is recorded and can be re-downloaded.
- **Verification** — QR codes on cards link to public `/verify/<id>` pages that
  confirm the credential.
- **Records & projects** — manage saved cards, templates, and projects from the
  dashboard.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19, react-konva (canvas editor)
- Tailwind CSS v4
- Local file storage (`storage/` JSON) — no database, no auth

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page leads
straight into the app — there is no login.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_VERIFY_BASE_URL` | No | Base URL embedded in card QR codes. Defaults to `https://verify.hhgoa.in`. |

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run start     # start the production server
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

## Notes

- All data (templates, generated cards, profile) is stored as JSON under
  `storage/data/`. Exports are written to `storage/exports/workspace/`. The
  whole `storage/` folder is gitignored.
- For production, set `NEXT_PUBLIC_VERIFY_BASE_URL` to your deployed domain so
  card QR codes resolve correctly.