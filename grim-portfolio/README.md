# GRIM Portfolio

> Shefan Tharani // grim-sudo

## Project Structure

```
grim-portfolio/
├── index.html        ← Main portfolio
├── admin.html        ← Data editor GUI
├── css/
│   └── style.css     ← All styles (Syne + Bebas Neue + JetBrains Mono)
└── js/
    ├── data.js       ← ⚠️ Edit your content here (or via admin.html)
    └── main.js       ← All portfolio logic
```

## How to Edit Content

### Option A — Admin GUI (recommended)
1. Open `admin.html` in a browser
2. Edit identity, socials, skills, projects, achievements
3. Go to **Export** tab → click **Generate**
4. Copy the output → replace contents of `js/data.js`
5. Refresh `index.html`

### Option B — Direct Edit
Open `js/data.js` and edit the `GRIM_DATA` object directly.

## Deploy to GitHub Pages

1. Rename or copy the project folder to your repo root
2. Push to GitHub
3. Settings → Pages → Deploy from branch → `main` / `(root)`
4. Your site will be live at `https://grim-sudo.github.io/`

## Features

- 🌐 Watch Dogs ctOS boot globe
- 🔢 Matrix rain background
- 🕹 Interactive terminal with full command set
- 📊 Radar chart + animated skill bars
- 🗺 Live network topology map
- 🐙 GitHub API integration
- 🔗 Social links section
- ✍️  Snap-bracket custom cursor
- 📱 Fully responsive
- ⚡ Zero dependencies — pure HTML/CSS/JS
