# team Dashboard (React + Vite + Tailwind + Vercel)

A modern gaming-style dashboard that fetches your Steam library and Counter-Strike 2 stats using Steam Web API.
Includes charts, highlights, and areas of improvement.

## Features
- SteamID64 or vanity input; resolves vanity to ID
- Dropdown of all your Steam games
- CS2 (appid 730) player stats
- Charts: K/D bar, Headshot% pie, Accuracy line (synthetic trend)
- Computed insights (K/D, accuracy, HS%, damage per minute) + improvement suggestions
- Latest CS2 news

## One-time Setup
1. **Create a Steam Web API Key** at https://steamcommunity.com/dev/apikey
2. On **Vercel**, set a Project Environment Variable: `STEAM_API_KEY=<your key>`
3. Deploy. Vercel will host the static Vite app and the `/api/steam/*` serverless functions.

## Local Dev
```bash
npm i
npm run dev
```

> Serverless functions run on Vercel. For local testing, you can run via `vercel dev` or mock the API.

## Notes
- Some CS2 stats may be private or unavailable; ensure your game details are public on Steam.
- The accuracy trend is synthesized from totals as Steam doesn't expose per-match history here.
