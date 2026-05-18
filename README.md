# Lord Shiva Hindu Temples Amsterdam

Production site for [shivatemple.nl](https://shivatemple.nl/).

## Local preview

```powershell
.\build-dist.ps1
npx serve dist -l 4173 -s
```

Open http://localhost:4173/

## Deploy to GoDaddy

1. Run `.\build-dist.ps1`
2. Upload everything inside the `dist/` folder to `public_html`

## Project layout

- `index.html` — SEO shell, sponsor/calendar scripts, React entry
- `inject.js` — Maps, events calendar, and other runtime patches
- `assets/` — Production JS/CSS bundle (`index-BcyvbPgd.js`, `index-CamUc_Fe.css`)
- `api/contact.php` — Contact form handler
- `event-sponsors.html` — Event sponsors page
