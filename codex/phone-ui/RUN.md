# Run PLOT

## Easiest (no setup)
1. Double-click: `start_plot.command`
2. App opens automatically at `http://127.0.0.1:8080/index.html`
3. To stop server, double-click: `STOP_PLOT.command`

## Live TMDB data (optional later)
1. Copy env: `cp .env.example .env`
2. Add token in `.env`: `TMDB_READ_TOKEN=...`
3. In `plot.config.js`, set `mode: 'proxy'`
4. Start with `start_plot.command`
