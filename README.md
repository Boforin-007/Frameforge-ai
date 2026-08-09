# FrameForge AI

Design branded ID cards, generate them in bulk from a spreadsheet, and export PNG, ZIP, or PDF — with scannable QR verification pages.

## Features

- **Template library** — built-in starting layouts plus your own saved templates ("My templates")
- **Drag-and-drop editor** — live canvas (Konva) with text, photo, logo, shape, and QR elements
- **Projects** — save, reopen, rename, and delete designs
- **Bulk import** — upload a CSV of people, map columns, generate a batch of cards, and download as ZIP or PDF
- **Downloads** — every export is recorded and can be re-downloaded
- **Verification** — QR codes on cards link to public `/verify/<id>` pages that confirm the credential
- **Settings** — profile photo, name, organization, and password

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19, react-konva (canvas editor)
- MongoDB (Mongoose)
- Tailwind CSS v4
- Auth via HTTP-only JWT cookies (jose + bcryptjs)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string (Atlas or local). |
| `AUTH_SECRET` | Yes | Random 32-byte hex string for signing session cookies. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `NEXT_PUBLIC_VERIFY_BASE_URL` | No | Base URL embedded in card QR codes. Defaults to `https://verify.frameforge.ai`. |

### Set up MongoDB Atlas

1. Create a free M0 cluster at https://www.mongodb.com/cloud/atlas
2. Add a database user (Database Access) and allow access from anywhere (Network Access)
3. Copy the "Connect → Drivers" connection string and put it in `MONGODB_URI`

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run start     # start the production server
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```

## Notes

- Generated exports (PNG/ZIP/PDF) are written to `storage/exports/<userId>/` and served through authenticated API routes. Both `/storage/` and `/public/uploads/` are gitignored.
- For production, set `NEXT_PUBLIC_VERIFY_BASE_URL` to your deployed domain so card QR codes resolve correctly.
