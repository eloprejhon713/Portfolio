/**
 * Private contract studio — served only by Express after CONTRACT_PASS.
 * Do not link this from index.html or GitHub Pages.
 */

const crypto = require("crypto");

const COOKIE = "elopre_studio";
const SERVICES = [
  "Web Development",
  "Mobile Development",
  "Desktop Development",
  "Algorithm Design",
];

function configured() {
  return Boolean(process.env.CONTRACT_PASS);
}

function token() {
  const pass = process.env.CONTRACT_PASS;
  if (!pass) return "";
  return crypto.createHmac("sha256", pass).update("elopre-studio-v1").digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (!left.length || left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "")
    .split(";")
    .forEach((part) => {
      const i = part.indexOf("=");
      if (i < 1) return;
      out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    });
  return out;
}

function isAuthed(req) {
  return configured() && safeEqual(parseCookies(req)[COOKIE], token());
}

function cookieHeader(req, clear) {
  const proto = String((req && req.headers && req.headers["x-forwarded-proto"]) || "");
  const secure = proto === "https" || process.env.NODE_ENV === "production" ? "; Secure" : "";
  if (clear) {
    return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
  }
  return `${COOKIE}=${encodeURIComponent(token())}; Path=/; Max-Age=${8 * 3600}; HttpOnly; SameSite=Lax${secure}`;
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dash(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback || "—";
}

function slug(value) {
  return String(value || "client")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "client";
}

function ticks(selected) {
  return SERVICES.map((name) => `- [${selected.includes(name) ? "x" : " "}] ${name}`).join("\n");
}

function buildAgreement(body) {
  const services = Array.isArray(body.services)
    ? body.services
    : body.services
      ? [body.services]
      : [];
  const picked = SERVICES.filter((name) => services.includes(name));
  const features = String(body.features || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const featureList = features.length
    ? features.map((line, i) => `  ${i + 1}. ${line}`).join("\n")
    : "  1. …";
  const deliverables = Array.isArray(body.deliverables)
    ? body.deliverables
    : body.deliverables
      ? [body.deliverables]
      : [];
  const total = dash(body.feeTotal, "[amount]");
  const revisions = dash(body.revisions, "2");
  const hourly = dash(body.hourlyRate, "____");
  const venue = dash(body.venue, "Taguig City / Muntinlupa City / as agreed");
  const portfolio = body.portfolio === "confidential"
    ? "- [ ] Developer may show this project on elopre.dev / GitHub\n- [x] Confidential — no public case study"
    : "- [x] Developer may show this project on elopre.dev / GitHub\n- [ ] Confidential — no public case study";

  return `# SOFTWARE DEVELOPMENT SERVICES AGREEMENT

**This Agreement** is entered into as of **${dash(body.effectiveDate, "[Date]")}** (“Effective Date”)

**BETWEEN:**

**Jhon Elopre**, an independent software developer doing business as **elopre.dev**, with email **eloprepotchy@gmail.com** (“Developer”)

**AND:**

**${dash(body.clientName, "[Client full legal name / company]")}**, with address **${dash(body.clientAddress, "[address]")}**, email **${dash(body.clientEmail, "[email]")}**, represented by **${dash(body.clientRep, "[name / title]")}** (“Client”)

Developer and Client are each a “Party” and together the “Parties.”

This is a working template, not legal advice. For a large or long project, have a Philippine lawyer review it.

---

## 1. Purpose

Client engages Developer to design, develop, and deliver software as described in **Schedule A (Statement of Work)**, under one or more of the Developer’s services:

| Service | Typical work |
|---|---|
| **Web Development** | Responsive web applications — frontend, backend, and integrations |
| **Mobile Development** | Cross-platform mobile apps (e.g. Flutter) with API / device integration |
| **Desktop Development** | Desktop software for Windows, macOS, and/or Linux |
| **Algorithm Design** | Algorithms, data structures, performance tuning, and complex logic |

Only the service(s) ticked in Schedule A are included. Work outside Schedule A needs a written change order (Section 7).

---

## 2. Term

This Agreement starts on the Effective Date and ends when (a) all deliverables in Schedule A are accepted, and (b) final payment is received — unless ended earlier under Section 13.

---

## 3. Developer’s duties

Developer shall:

1. Perform the work in Schedule A in a professional manner.
2. Use reasonable skill consistent with a software developer of similar experience.
3. Keep Client informed of progress at the milestones in Schedule A.
4. Deliver source code, build instructions, and agreed credentials at handover.
5. Fix defects reported during the warranty period (Section 10) that are within scope.

Developer does **not** promise specific business results (sales, downloads, rankings, or user growth).

---

## 4. Client’s duties

Client shall:

1. Give requirements, content, logos, copy, accounts, and decisions on time.
2. Name one contact who can approve work.
3. Pay invoices on the dates in Schedule A.
4. Provide access (hosting, app stores, APIs, domains, databases) when needed.
5. Test deliverables within the review period in Section 8.

Delay by Client (late content, late feedback, late payment) extends the timeline by at least the same number of days, and may pause work.

---

## 5. Fees and payment

1. **Total fee:** **PHP ${total}** (or as broken down in Schedule A).
2. **Payment schedule** (default if Schedule A is silent):
   - **50%** deposit — due on signing; work starts after cleared funds.
   - **25%** — due on working prototype / staging.
   - **25%** — due on delivery, before final handover of source / live access.
3. Fees are in **Philippine Peso** unless Schedule A says otherwise.
4. Late payment of more than **7 days**: Developer may pause work and charge **2% per month** on the unpaid amount, or the maximum allowed by law, whichever is less.
5. Deposit is **non-refundable** once work has started, except if Developer cancels without cause.
6. Third-party costs (hosting, domains, app store fees, SMS, maps, paid APIs, SSL, licenses) are **Client’s** unless Schedule A says Developer will buy them and bill at cost.

---

## 6. Timeline

Target dates are in Schedule A. They are estimates, not guarantees. They move if:

- Client changes scope;
- Client is late with materials or approval;
- A third-party service (host, store, API) is delayed; or
- Force majeure (Section 15).

---

## 7. Changes and extra work

A **Change Request** is anything not listed in Schedule A, including new screens, new platforms, new integrations, extra revisions beyond the agreed number, or a change in approved design.

1. Client sends the request in writing (email is enough).
2. Developer replies with effect on **fee, timeline, and scope**.
3. Work on that change starts only after Client confirms in writing (and pays any extra deposit if required).

Silence or “please just add it” in chat is not approval of extra fee.

**Included revisions:** **${revisions}** rounds of reasonable revisions on already-delivered items in a milestone. After that, hourly or a fixed add-on applies: **PHP ${hourly} / hour** or a quoted lump sum.

---

## 8. Review and acceptance

1. After each milestone (or final delivery), Client has **7 calendar days** to review and list written defects (something that does not match Schedule A).
2. If Client does not respond in 7 days, that milestone is **deemed accepted**.
3. Cosmetic taste (“make it pop,” “I imagined it differently”) after approval of a design/wireframe is a Change Request, not a defect.
4. Developer will fix in-scope defects within a reasonable time, then the 7-day clock runs again for those fixes only.

---

## 9. Intellectual property

1. **Before full payment:** all work product (code, designs made for this project, documentation) stays with the **Developer**.
2. **After full payment:** Developer assigns to Client the rights in the **custom work created specifically for this project**, so Client may use, modify, and run it for their business.
3. Developer keeps rights in:
   - pre-existing tools, snippets, templates, and know-how;
   - generic components reused across projects;
   - Developer’s portfolio right to show the work (unless Client asks in writing for confidentiality).
4. Client warrants that materials they give (logo, text, photos, data) are theirs to use. Client will cover Developer if a third party claims those materials infringe their rights.
5. Open-source and third-party libraries stay under **their own licenses**. Developer will note major ones at handover. Client is responsible for complying with those licenses after handover.

---

## 10. Warranty

For **30 days** after final acceptance, Developer will fix, at no extra fee, bugs that:

- exist in the delivered, in-scope software; and
- are reproducible; and
- are not caused by Client changes, new hosting, new OS/store rules, or third-party APIs.

This warranty does **not** cover new features, content updates, or “it should also do X.”

After 30 days, support is a new paid engagement.

**No other warranty.** Software is delivered “as is” except for this section. Developer does not warrant uninterrupted or error-free operation of the internet, app stores, or third-party APIs.

---

## 11. Limitation of liability

1. Developer’s total liability under this Agreement is limited to the **fees actually paid by Client** for the project.
2. Developer is not liable for indirect or consequential loss: lost profits, lost data, business interruption, or reputation — except for fraud or willful misconduct.
3. Client is responsible for backups, production data, and compliance (privacy, DPA, app store, industry rules) unless Schedule A expressly includes that work.

---

## 12. Confidentiality

Each Party will keep the other’s non-public business, technical, and personal information confidential, and use it only to perform this Agreement. This lasts **2 years** after the Agreement ends, and indefinitely for source code and credentials.

Developer may list the project name and a short description in a portfolio unless Schedule A marks the project **Confidential / no portfolio**.

---

## 13. Termination

**By either Party, for cause:** if the other Party materially breaches and does not fix it within **14 days** after written notice.

**By Client, for convenience:** Client may stop the project in writing. Client pays:

- all work completed and in progress up to the stop date (at the agreed fee or hourly rate); and
- the deposit, which remains earned if work has started.

**By Developer:** if Client is more than **14 days** late on payment, or does not provide required materials after written reminder.

On termination, Developer delivers work already paid for. Unpaid work is not handed over. Sections 9–12 and 16 survive.

---

## 14. Independent contractor

Developer is an **independent contractor**, not an employee, partner, or agent of Client. Developer sets their own hours and tools. This Agreement does not create employment under Philippine labor law. Developer is responsible for their own taxes.

---

## 15. Force majeure

Neither Party is liable for delay caused by events beyond reasonable control (calamity, outage, war, epidemic, government action, failure of Google/Apple/cloud providers). The affected Party must give notice. If delay lasts more than **60 days**, either Party may end the Agreement and settle payment for work done.

---

## 16. General

1. **Entire agreement.** This document plus Schedule A is the full agreement. Chat messages do not change it unless both Parties confirm the change in writing.
2. **Amendments** must be in writing (email confirmation is enough).
3. **Severability.** If one clause is invalid, the rest stays in force.
4. **No waiver.** Failure to enforce a right once is not a waiver later.
5. **Assignment.** Client may not assign this Agreement without Developer’s written consent.
6. **Governing law.** Laws of the **Republic of the Philippines**. Venue: courts of **${venue}**.
7. **Notices.** Email to the addresses above is enough. Deemed received the next business day.

---

## 17. Signatures

By signing, the Parties agree to this Agreement and Schedule A.

| | Developer | Client |
|---|---|---|
| Name | Jhon Elopre | ${dash(body.clientRep || body.clientName, "[Name]")} |
| Role | Developer, elopre.dev | ${dash(body.clientTitle, "[Title]")} |
| Signature | _______________ | _______________ |
| Date | _______________ | _______________ |

---

# SCHEDULE A — Statement of Work

**Project name:** ${dash(body.projectName, "[project]")}  
**Client contact:** ${dash(body.clientRep, "[name]")}, ${dash(body.clientEmail, "[email]")}  
**Start date:** ${dash(body.startDate, "[date]")}  **Target handover:** ${dash(body.handoverDate, "[date]")}

### A. Services included (tick)

${ticks(picked)}

### B. What will be built (be specific)

- Platforms: ${dash(body.platforms, "[Web / Android / iOS / Windows / macOS / Linux]")}
- Main features (list):
${featureList}
- Out of scope:  
  ${dash(body.outOfScope, "content writing, app store accounts, paid ads, SEO ranking, 24/7 hosting support, future modules")}

### C. Deliverables

- [${deliverables.includes("source") ? "x" : " "}] Source code (Git repo or ZIP)
- [${deliverables.includes("deploy") ? "x" : " "}] Staging / production deployment as agreed
- [${deliverables.includes("readme") ? "x" : " "}] Basic admin or README (how to run / build)
- [${deliverables.includes("other") ? "x" : " "}] ${dash(body.otherDeliverable, "Others: Figma, APK/AAB, installer, API docs")}

### D. Tech (if already agreed)

${dash(body.tech, "Developer chooses a reasonable stack.")}

### E. Milestones and fees

| Milestone | What’s due | Date | Amount (PHP) |
|---|---|---|---|
| 1. Deposit / kickoff | Agreement signed, requirements locked | ${dash(body.effectiveDate)} | ${dash(body.feeDeposit)} |
| 2. Prototype / design approval | | ${dash(body.midDate)} | ${dash(body.feeMid)} |
| 3. Feature-complete staging | | ${dash(body.stageDate)} | ${dash(body.feeStage)} |
| 4. Final acceptance + handover | | ${dash(body.handoverDate)} | ${dash(body.feeFinal)} |
| **Total** | | | **${total}** |

**Revision rounds included:** ${revisions}  
**Extra work rate:** PHP ${hourly} / hour

### F. Hosting & accounts

Client provides: ${dash(body.clientProvides, "domain, hosting, store / cloud accounts as needed")}  
Developer provides: ${dash(body.devProvides, "local/dev environment only, unless listed")}

### G. Portfolio

${portfolio}
`.trim() + "\n";
}

function shell(title, body, extraHead) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/images/brand/icon.png">
<style>
  :root { --bg:#eef1f8; --text:#0f172a; --muted:#64748b; --blue:#2563eb; --border:#e2e8f0; --navy:#0d1b3e; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Outfit,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
  .wrap { width:min(880px, calc(100% - 32px)); margin:28px auto 48px; }
  .brand { display:flex; align-items:center; gap:10px; margin-bottom:18px; font-weight:700; color:var(--navy); }
  .brand img { width:34px; height:34px; object-fit:contain; }
  .card { background:#fff; border:1px solid var(--border); border-radius:22px; padding:22px; box-shadow:0 4px 24px rgba(13,27,62,.06); }
  h1 { font-size:1.35rem; margin-bottom:6px; }
  .sub { color:var(--muted); font-size:.92rem; margin-bottom:18px; }
  label { display:block; font-size:.78rem; font-weight:600; color:var(--muted); margin:12px 0 6px; }
  input, select, textarea { width:100%; border:1px solid var(--border); border-radius:12px; padding:11px 12px; font:inherit; background:#f8fafc; }
  textarea { min-height:96px; resize:vertical; }
  .row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .checks { display:flex; flex-wrap:wrap; gap:8px 14px; margin-top:6px; }
  .checks label { display:flex; align-items:center; gap:7px; margin:0; font-size:.9rem; font-weight:500; color:var(--text); }
  .checks input { width:auto; }
  .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
  button, .btn { border:0; border-radius:999px; padding:11px 18px; font:inherit; font-weight:600; cursor:pointer; text-decoration:none; display:inline-flex; }
  .primary { background:var(--blue); color:#fff; }
  .ghost { background:#eef2ff; color:var(--navy); }
  .err { background:#fef2f2; color:#991b1b; border-radius:12px; padding:10px 12px; margin-bottom:12px; font-size:.9rem; }
  pre { white-space:pre-wrap; font-size:.86rem; line-height:1.55; }
  @media (max-width:640px) { .row { grid-template-columns:1fr; } .wrap { margin-top:16px; } }
  @media print { .noprint { display:none; } .card { box-shadow:none; border:0; } body { background:#fff; } }
</style>
${extraHead || ""}
</head>
<body>
  <div class="wrap">${body}</div>
</body>
</html>`;
}

function loginPage(error) {
  return shell("Contract studio — elopre.dev", `
    <div class="brand noprint"><img src="/assets/images/brand/logonobg.png" alt="">elopre<em style="color:#2563eb;font-style:normal">.dev</em></div>
    <div class="card">
      <h1>Contract studio</h1>
      <p class="sub">Private. Clients do not see this page.</p>
      ${error ? `<div class="err">${esc(error)}</div>` : ""}
      <form method="post" action="/studio/login">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required autofocus autocomplete="current-password">
        <div class="actions">
          <button class="primary" type="submit">Open studio</button>
        </div>
      </form>
    </div>`);
}

function formPage() {
  const serviceBoxes = SERVICES.map((name) =>
    `<label><input type="checkbox" name="services" value="${esc(name)}"> ${esc(name)}</label>`
  ).join("");
  return shell("New agreement — elopre.dev", `
    <div class="brand noprint"><img src="/assets/images/brand/logonobg.png" alt="">elopre<em style="color:#2563eb;font-style:normal">.dev</em></div>
    <div class="card">
      <h1>Generate agreement</h1>
      <p class="sub">Fill this, download the file, then you email it to the client.</p>
      <form method="post" action="/studio/generate">
        <div class="row">
          <div><label for="clientName">Client name / company</label><input id="clientName" name="clientName" required></div>
          <div><label for="clientEmail">Client email</label><input id="clientEmail" name="clientEmail" type="email" required></div>
        </div>
        <label for="clientAddress">Address</label>
        <input id="clientAddress" name="clientAddress">
        <div class="row">
          <div><label for="clientRep">Represented by</label><input id="clientRep" name="clientRep"></div>
          <div><label for="clientTitle">Their title</label><input id="clientTitle" name="clientTitle" placeholder="Owner / Manager"></div>
        </div>
        <label for="projectName">Project name</label>
        <input id="projectName" name="projectName" required>
        <label>Services</label>
        <div class="checks">${serviceBoxes}</div>
        <label for="platforms">Platforms</label>
        <input id="platforms" name="platforms" placeholder="Web / Android / iOS / Windows">
        <label for="features">Main features (one per line)</label>
        <textarea id="features" name="features" placeholder="Login&#10;Dashboard&#10;Reports"></textarea>
        <label for="outOfScope">Out of scope</label>
        <textarea id="outOfScope" name="outOfScope" placeholder="Content writing, app store accounts, ads"></textarea>
        <label for="tech">Tech (optional)</label>
        <input id="tech" name="tech" placeholder="Flutter, PHP, MySQL">
        <div class="row">
          <div><label for="feeTotal">Total fee (PHP)</label><input id="feeTotal" name="feeTotal" required></div>
          <div><label for="hourlyRate">Extra work / hour</label><input id="hourlyRate" name="hourlyRate"></div>
        </div>
        <div class="row">
          <div><label for="feeDeposit">Deposit amount</label><input id="feeDeposit" name="feeDeposit"></div>
          <div><label for="feeMid">Prototype amount</label><input id="feeMid" name="feeMid"></div>
        </div>
        <div class="row">
          <div><label for="feeStage">Staging amount</label><input id="feeStage" name="feeStage"></div>
          <div><label for="feeFinal">Final amount</label><input id="feeFinal" name="feeFinal"></div>
        </div>
        <div class="row">
          <div><label for="effectiveDate">Effective / start</label><input id="effectiveDate" name="effectiveDate" type="date"></div>
          <div><label for="handoverDate">Handover</label><input id="handoverDate" name="handoverDate" type="date"></div>
        </div>
        <div class="row">
          <div><label for="revisions">Revision rounds</label><input id="revisions" name="revisions" value="2"></div>
          <div>
            <label for="venue">Venue</label>
            <select id="venue" name="venue">
              <option>Taguig City</option>
              <option>Muntinlupa City</option>
              <option>as agreed</option>
            </select>
          </div>
        </div>
        <label>Deliverables</label>
        <div class="checks">
          <label><input type="checkbox" name="deliverables" value="source" checked> Source code</label>
          <label><input type="checkbox" name="deliverables" value="deploy"> Deployment</label>
          <label><input type="checkbox" name="deliverables" value="readme" checked> README</label>
        </div>
        <label for="portfolio">Portfolio</label>
        <select id="portfolio" name="portfolio">
          <option value="show">May show on elopre.dev</option>
          <option value="confidential">Confidential</option>
        </select>
        <div class="actions noprint">
          <button class="primary" type="submit" name="mode" value="download">Download .md</button>
          <button class="ghost" type="submit" name="mode" value="preview">Preview</button>
          <a class="btn ghost" href="/studio/logout">Log out</a>
        </div>
      </form>
    </div>`);
}

function previewPage(markdown, filename) {
  return shell("Agreement preview — elopre.dev", `
    <div class="brand noprint"><img src="/assets/images/brand/logonobg.png" alt="">elopre<em style="color:#2563eb;font-style:normal">.dev</em></div>
    <div class="card">
      <div class="actions noprint" style="margin-top:0;margin-bottom:16px">
        <a class="btn primary" href="/studio">Back to form</a>
        <button class="ghost" type="button" onclick="window.print()">Print / PDF</button>
      </div>
      <p class="sub noprint">File name: ${esc(filename)} — print to PDF if you want a signed copy.</p>
      <pre>${esc(markdown)}</pre>
    </div>`);
}

function filenameFor(body) {
  return `Elopre-Agreement-${slug(body.clientName)}-${slug(body.projectName)}.md`;
}

function noindex(res) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-store");
}

function mount(app) {
  app.get("/studio", (req, res) => {
    noindex(res);
    if (!configured()) return res.status(404).end();
    if (!isAuthed(req)) return res.status(401).send(loginPage(""));
    return res.send(formPage());
  });

  app.post("/studio/login", (req, res) => {
    noindex(res);
    if (!configured()) return res.status(404).end();
    if (!safeEqual(req.body && req.body.password, process.env.CONTRACT_PASS)) {
      return res.status(401).send(loginPage("Wrong password."));
    }
    res.setHeader("Set-Cookie", cookieHeader(req, false));
    return res.redirect(303, "/studio");
  });

  app.get("/studio/logout", (req, res) => {
    noindex(res);
    res.setHeader("Set-Cookie", cookieHeader(req, true));
    return res.redirect(303, "/studio");
  });

  app.post("/studio/generate", (req, res) => {
    noindex(res);
    if (!configured() || !isAuthed(req)) return res.redirect(303, "/studio");
    const body = req.body || {};
    const markdown = buildAgreement(body);
    const filename = filenameFor(body);
    if (body.mode === "preview") {
      return res.send(previewPage(markdown, filename));
    }
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(markdown);
  });
}

module.exports = { mount, buildAgreement };
