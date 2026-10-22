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
    fillAgreementPdf.js      # Print / PDF: Python fill, pdf-lib fallback
  scripts/
    fill_agreement.py        # PyMuPDF fill of templates/Agreement.pdf
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
| Services | `#panel-services` in `index.html` + `.services-grid` in `css/styles.css` — 4 checklist cards (Web, Mobile, Desktop, AI & Algorithm). Contact + studio use the same 04 name. |
| Contact form + send overlay | `#panel-contact` in `index.html`, `js/main.js`, `server.js` (`POST /api/contact` via Resend). Schedule a call writes a 30-min Asia/Manila event on the Jhon Elopre Google Calendar (`eloprepotchy@gmail.com`) via a service account, and still attaches an ICS invite to the email. |
| Resume download overlay | `js/main.js` → `assets/documents/Junior-Programmer-Elopre-Jhon.pdf` |
| Chat widget | `js/main.js` → `POST /api/chat` → Gemini (`GEMINI_API_KEY`) or `js/resumeChatbot.js` |
| Inquiry email HTML | `server.js` (logo: `assets/images/brand/logonobg.png` on GitHub Pages) |
| Contract studio login + generator | `js/contractStudio.js` (`GET /studio`, `POST /studio/login`) |
| Agreement Print / PDF | `scripts/fill_agreement.py` via `js/fillAgreementPdf.js` |

## Preserve notes
- Keep root `index.html` so GitHub Pages continues to work.
- Keep `server.js` at repo root for Render `npm start`.
- Do not commit `.env`, `contracts/`, `Calendar/` (service-account JSON), or `nodejs.msi`. Chat uses `GEMINI_API_KEY` on Render; never put the key in frontend JS.
- Client agreement studio: `Ctrl+Shift+A` or chat “contract” / “agreement” / “kontrata” opens `/studio` (password still required). Login is a split-shell card (`loginPage()` in `js/contractStudio.js`); Back to portfolio goes to `/` on the same host. The form is the 3-column generator. Print / PDF fills `templates/Agreement.pdf` via `scripts/fill_agreement.py` (PyMuPDF). Downloaded PDF is `{client-name}-agreement.pdf`. Writes one fitted line in each white Project Details cell so text does not spill onto the navy headers. pdf-lib in `js/fillAgreementPdf.js` is the fallback. Jhon emails the filled file.
- CORS must allow `elopre.dev`, `www.elopre.dev`, and `eloprejhon713.github.io` so Pages can call Render.
- Mobile: real phone width must work; no “Desktop site” workaround.
- Services (`#panel-services`) is 4 checklist cards. Do not restyle other panels when changing Services. Phone width stacks cards and lists to one column. Each checklist row uses the same pale chip hover (`#f1f5f9`, 12px radius).
- Tech Stack (`#panel-stack`) pills use Simple Icons (`cdn.simpleicons.org/{slug}/1e3a8a`). LSTM and Matplotlib have no brand mark there — keep the inline navy SVGs. The Home “Tools I work with” ticker uses the same set, including the AI / data-science chips.
- Contact phone field: exactly 11 digits.
- Contact (`#panel-contact`) is the split info + form card. Do not restyle other panels when changing Contact. Phone width stacks the two columns. Send still uses `POST /api/contact` / Resend. “Schedule a call” inserts a 30-minute Asia/Manila event on `GOOGLE_CALENDAR_ID` (Jhon Elopre / `eloprepotchy@gmail.com`) with `googleapis` + the local service-account JSON. Event title is `Discovery Call — {name} · {service}`; description uses CLIENT / PROJECT / MESSAGE / QUICK ACTIONS; location is the client phone; reminders are 30 and 10 minutes. ICS stays as an email attachment. On Render set `GOOGLE_SERVICE_ACCOUNT_JSON` (one-line JSON) and share that calendar with `portfolio-calendar@gmp-demo-project-907641364.iam.gserviceaccount.com` as Make changes to events. Never commit the key.
- Brand images live under `assets/images/brand/` — update email `logoUrl` if moved again.
- About GitHub graph is a custom heatmap (`.gh-activity` in `index.html` / `css/styles.css`, rendered by `js/main.js`). Data from `github-contributions-api.jogruber.de` for `eloprejhon713`. Keep it scrollable on phones.
