# Portfolio (elopre.dev) — project memory

## Stack
- Static frontend: `index.html` + `css/styles.css` + `js/main.js`
- Resume chatbot: `js/resumeChatbot.js` (browser + Node)
- API answers: `js/resumeAnswers.js`
- Backend: `server.js` (Express + Resend contact email)
- Deploy: GitHub Pages (static) + Render (`npm start` → `node server.js`)

## Layout
```
/
  index.html                 # page shell
  css/styles.css             # all site styles
  js/
    main.js                  # UI, contact form, chat widget, resume download
    resumeChatbot.js         # intent Q&A
    resumeAnswers.js         # Node wrapper + Anthropic system prompt
  assets/
    images/brand/            # logo, icon, logonobg
    images/projects/         # project covers
    images/profile/          # photo / avatar assets
    documents/               # resume PDF
    videos/
  server.js                  # contact API + static hosting
  docs/PROJECT_MEMORY.md
```

## Entry / screens → files
| Area | Files |
|------|--------|
| Home / bento / projects / about / contact | `index.html`, `css/styles.css`, `js/main.js` |
| Contact form + send overlay | `js/main.js`, `server.js` (`POST /api/contact`) |
| Resume download overlay | `js/main.js` → `assets/documents/Junior-Programmer-Elopre-Jhon.pdf` |
| Chat widget | `js/main.js` + `js/resumeChatbot.js` |
| Inquiry email HTML | `server.js` (logo: `assets/images/brand/logonobg.png` on GitHub Pages) |

## Preserve notes
- Keep root `index.html` so GitHub Pages continues to work.
- Keep `server.js` at repo root for Render `npm start`.
- Do not commit `.env` or `nodejs.msi`.
- Mobile: real phone width must work; no “Desktop site” workaround.
- Contact phone field: exactly 11 digits.
- Brand images live under `assets/images/brand/` — update email `logoUrl` if moved again.
