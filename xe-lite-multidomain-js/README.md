# XE-Lite Multi-Domain (Plain JavaScript + Next.js + Tailwind)

- Live rates via https://api.exchangerate.host/latest
- Multi-domain branding in `config/site.config.json`
- Tabs controlled by feature flags
- Plain JavaScript only (no TypeScript)

## Run locally
npm install
npm run dev

## Build
npm run build

## Structure
- pages/ (_app.js, index.js, providers.js, charts.js, live.js, advanced.js)
- components/ (Navbar.js, Converter.js, useSiteConfig.js)
- config/ (site.config.json)
- styles/ (globals.css)
- public/ (favicon.ico)
- package.json, postcss.config.js, tailwind.config.js, README.md
