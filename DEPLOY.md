# Portfolio Dashboard — GitHub Pages Deployment Guide

This app is a fully static React + Vite app. No server needed. GitHub Pages hosts it for free.

---

## Prerequisites

- A GitHub account
- Node.js 18+ installed locally
- Git installed locally

---

## Step 1 — Fork or Push to GitHub

### Option A: Push to your existing robotics-portfolio repo

```bash
# From inside portfolio-dashboard/
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git checkout -b main
git add .
git commit -m "feat: add portfolio dashboard"
git push -u origin main
```

### Option B: Create a new repo dedicated to the dashboard

1. Go to https://github.com/new
2. Name it `portfolio-dashboard` (or any name you like)
3. Leave it public, do NOT initialize with README
4. Then run the commands in Option A above

---

## Step 2 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Click **Save**

---

## Step 3 — Verify the Workflow Files

The repo includes two GitHub Actions workflows in `.github/workflows/`:

### `deploy.yml`
- Triggers on every push to `main`
- Runs `npm ci && npm run build`
- Deploys the `dist/` folder to GitHub Pages

### `update-progress.yml`
- Triggers when `public/data/progress.json` is pushed
- Rebuilds and redeploys so the dashboard reflects your latest progress

---

## Step 4 — First Deploy

```bash
# Make any small change (e.g. update public/data/progress.json with your name)
git add public/data/progress.json
git commit -m "chore: initial progress data"
git push origin main
```

1. Go to your repo → **Actions** tab
2. Watch the `Deploy to GitHub Pages` workflow run
3. When it shows a green checkmark, your site is live

---

## Step 5 — Find Your URL

Your dashboard will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Example:
```
https://kibutsuji-muzan07.github.io/robotics-portfolio/
```

---

## Step 6 — Update Progress Data (the tutor cron does this automatically)

Every time the AI tutor cron runs and verifies a day, it updates:

- `public/data/progress.json` — served at runtime
- `client/src/data/progress.json` — bundled at build time (fallback)

If you want to update it manually:

```bash
# Edit public/data/progress.json with your latest progress
git add public/data/progress.json client/src/data/progress.json
git commit -m "progress: Day B-X completed"
git push origin main
```

This triggers `update-progress.yml` which rebuilds and redeploys automatically.

---

## Troubleshooting

### Site shows 404
- Make sure `vite.config.ts` has `base: "./"` (already set)
- Make sure GitHub Pages source is set to **GitHub Actions**, not a branch

### Blank page / assets not loading
- Open browser DevTools → Console
- If you see path errors, check that `base: "./"` is in `vite.config.ts`

### Odometer not animating
- This is a React animation — it only works in a real browser. Works on GitHub Pages.

### Add Track not saving after refresh
- By design: custom tracks use in-memory state (localStorage is blocked in iframes)
- On GitHub Pages (outside iframes), localStorage works fine — tracks persist

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
# Open http://localhost:5173

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## File Structure (Key Files)

```
portfolio-dashboard/
├── client/
│   └── src/
│       ├── App.tsx                  # Root: Router, QueryClient, AddTrackModal
│       ├── components/
│       │   ├── Odometer.tsx         # Car speedometer SVG (animated)
│       │   ├── AddTrackModal.tsx    # Add Track form (weeks × days/week)
│       │   ├── TrackCard.tsx        # Track overview card
│       │   └── Sidebar.tsx          # Navigation
│       ├── pages/
│       │   ├── Overview.tsx         # Main dashboard: odometer + KPI cards
│       │   ├── TrackDetail.tsx      # Per-track day list
│       │   └── ActivityLog.tsx      # Timeline of all activity
│       ├── hooks/useProgress.ts     # Loads progress.json (fetch + bundled fallback)
│       ├── types.ts                 # TypeScript types
│       └── data/progress.json       # Bundled data (build-time import, fallback)
├── public/
│   └── data/
│       └── progress.json            # Runtime fetch source (update this for live data)
├── .github/
│   └── workflows/
│       ├── deploy.yml               # Deploy on push to main
│       └── update-progress.yml      # Rebuild on progress.json update
├── vite.config.ts                   # base: "./" — critical for GitHub Pages
├── package.json                     # Pure frontend deps (no Express, no Drizzle)
└── DEPLOY.md                        # This file
```

---

## Data Format (progress.json)

The dashboard reads `public/data/progress.json`. Key fields:

```json
{
  "active_track": "B",
  "sprint_mode": true,
  "sprint_start": "2026-05-02",
  "sprint_end_target": "2026-06-28",
  "track_b": {
    "current_day": 2,
    "day_status": "not_started",
    "days_completed": [1],
    "quiz_scores": [
      { "day": 1, "score": 9, "max_score": 10, "pct": 90 }
    ]
  },
  "streak": 4,
  "total_study_hours": 11.5,
  "github_commits": 11
}
```

The odometer shows: `(days_completed.length / sprint_total_days) × 100%`

---

*Generated by AI Engineering Tutor — Track B Sprint 2026*
