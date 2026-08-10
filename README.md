# FrameForge AI

Design branded ID cards, generate them in bulk from a spreadsheet, and export PNG, ZIP, or PDF — with scannable QR verification pages. Built for HH Goa builders, identity edition 2026.

No database, no accounts. Everything runs with local file storage on disk.

## Features

- **Template library** — built-in starting layouts plus your own saved templates ("My templates")
- **Drag-and-drop editor** — live canvas (Konva) with text, photo, logo, shape, and QR elements
- **Projects** — save, reopen, rename, and delete designs
- **Bulk import** — upload a CSV of people, map columns, generate a batch of cards, and download as ZIP or PDF
- **Downloads** — every export is recorded and can be re-downloaded
- **Verification** — QR codes on cards link to public `/verify/<id>` pages that confirm the credential
- **Settings** — profile photo, name, and organization; plus a "Reset workspace" danger zone

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

Open [http://localhost:3000](http://localhost:3000). The landing page leads straight into the app — there is no login.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_VERIFY_BASE_URL` | No | Base URL embedded in card QR codes. Defaults to `https://verify.frameforge.ai`. |

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run start     # start the production server
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

## Notes

- All data (projects, templates, generated cards, profile) is stored as JSON under `storage/data/`. Exports are written to `storage/exports/workspace/`. The whole `storage/` folder is gitignored.
- For production, set `NEXT_PUBLIC_VERIFY_BASE_URL` to your deployed domain so card QR codes resolve correctly.