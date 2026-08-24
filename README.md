# Alive Conference Digital Booklet

This is the starter shell for the 2026 Alive Conference digital booklet. It is a simple interactive site that can live in GitHub Pages or be adapted later for a more advanced host.

## What To Edit

Most booklet content lives in `data/content.js`.

- `event`: conference name, theme title, date, location, and welcome copy.
- `theme`: optional hero image and brand colors.
- `schedule`: the one-day schedule.
- `speakers`: speaker names, roles, photos, and bios.
- `workshops`: breakout leader name, role, workshop title, room, track, and description.
- `info`: practical details like lunch, check-in, offering, help desk, or merch.
- `showSponsors`: change this to `true` when you want the sponsor section/button to appear.
- `sponsors`: sponsor names, logos, and ad blurbs.

## Where To Put Assets

- Theme graphics: `assets/theme/`
- Speaker photos: `assets/speakers/`
- Sponsor logos or ads: `assets/sponsors/`
- General conference photos: `assets/photos/`

After adding an image, reference it in `data/content.js` like this:

```js
photo: "assets/speakers/scotty-jones.jpg"
```

or:

```js
heroImage: "assets/theme/alive-2026-background.jpg"
```

## Suggested Info To Gather

Use `docs/content-intake.md` as the working checklist. Once you fill it in, Codex can turn it into the live booklet content.

## Local Preview

Open `index.html` in a browser, or run a tiny local server from this folder:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages

Once this folder is in GitHub, GitHub Pages can publish directly from the main branch root. No build step is needed.
