# Portfolio (elopre.dev) — project memory

## Stack
- Static frontend: `index.html` + `css/styles.css` + `js/main.js`
- Resume chatbot: `js/resumeChatbot.js` (browser + Node)
- API answers: `js/resumeAnswers.js`
- Chat AI: Gemini via `GEMINI_API_KEY` in `server.js` `POST /api/chat`. Retries 503/429, then tries `gemini-2.5-flash`. Local resume Q&A is fallback.
- Backend: `server.js` (Express + Resend contact email)
- Deploy: GitHub Pages (static site) + Render (`npm start` → `node server.js`). Browser on github.io / elopre.dev calls `https://portfolio-1-f9t6.onrender.com`.

## Layout
```
/
  index.html                 # page shell
  css/styles.css             # all site styles
  js/
    main.js                  # UI, contact form, chat widget, resume download
    resumeChatbot.js         # intent Q&A
    resumeAnswers.js         # Node wrapper + Gemini system prompt
    contractStudio.js        # private /studio (Render only, not linked)
    agreementPrint.js        # print / PDF agreement sheet
  assets/
    images/brand/            # logo, icon, logonobg
    images/projects/         # project covers
    images/profile/          # photo / avatar assets
    documents/               # resume PDF (public)
  templates/Agreement.pdf    # blank contract template for studio fill (blocked at /templates)
    videos/
  contracts/                 # client agreements — local only, gitignored
  server.js                  # contact API + static hosting
  docs/PROJECT_MEMORY.md
```

## Entry / screens → files
| Area | Files |
|------|--------|
| Home / bento / projects / about / contact | `index.html`, `css/styles.css`, `js/main.js` |
| Contact form + send overlay | `js/main.js`, `server.js` (`POST /api/contact`) |
| Resume download overlay | `js/main.js` → `assets/documents/Junior-Programmer-Elopre-Jhon.pdf` |
| Chat widget | `js/main.js` → `POST /api/chat` → Gemini (`GEMINI_API_KEY`) or `js/resumeChatbot.js` |
| Inquiry email HTML | `server.js` (logo: `assets/images/brand/logonobg.png` on GitHub Pages) |

## Preserve notes
- Keep root `index.html` so GitHub Pages continues to work.
- Keep `server.js` at repo root for Render `npm start`.
- Do not commit `.env`, `contracts/`, or `nodejs.msi`. Chat uses `GEMINI_API_KEY` on Render; never put the key in frontend JS.
- Client agreement studio: `Ctrl+Shift+A` opens `/studio`. Print / PDF fills `templates/Agreement.pdf` (same look as the blank template). `/templates` and `/assets/documents/Agreement.pdf` are blocked. Jhon emails the filled file.
- CORS must allow `elopre.dev`, `www.elopre.dev`, and `eloprejhon713.github.io` so Pages can call Render.
- Mobile: real phone width must work; no “Desktop site” workaround.
- Contact phone field: exactly 11 digits.
- Brand images live under `assets/images/brand/` — update email `logoUrl` if moved again.
- About GitHub graph is a custom heatmap (`.gh-activity` in `index.html` / `css/styles.css`, rendered by `js/main.js`). Data from `github-contributions-api.jogruber.de` for `eloprejhon713`. Keep it scrollable on phones.
