# njanuar.dev

Personal site monorepo.

```
njanuar.dev/
├── frontend/   # Vite + React site
├── backend/    # (reserved for future API)
└── .github/
    └── workflows/
        └── deploy.yml
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deploy

Pushes to `main` that touch `frontend/**` build and publish to GitHub Pages via `.github/workflows/deploy.yml`.

In the repo: **Settings → Pages → Source → GitHub Actions**.
