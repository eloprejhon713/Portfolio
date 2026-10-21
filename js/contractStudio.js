/**
 * Private contract studio â€” served only by Express after CONTRACT_PASS.
 * Do not link this from index.html or GitHub Pages.
 */

const crypto = require("crypto");
const { renderAgreementHtml } = require("./agreementPrint");

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
  return text || fallback || "â€”";
}

function slug(value) {
  return String(value || "client")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "client";
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
  const deliverables = Array.isArray(body.deliverables)
    ? body.deliverables
    : body.deliverables
      ? [body.deliverables]
      : [];
  const total = dash(body.feeTotal, "[Amount]");
  const venue = dash(body.venue, "[Agreed City]");
  const privacy = body.portfolio === "confidential"
    ? "Confidential â€” no public case study"
    : "May show on elopre.dev / GitHub";

  return `# SOFTWARE DEVELOPMENT SERVICES AGREEMENT

This Software Development Services Agreement (â€œAgreementâ€) is entered into on **${dash(body.effectiveDate, "[Effective Date]")}** by and between **Jhon Elopre**, doing business as **elopre.dev** (â€œDeveloperâ€; email: eloprepotchy@gmail.com) and **${dash(body.clientName, "[Clientâ€™s Full Legal Name / Company]")}** (â€œClientâ€; address: ${dash(body.clientAddress, "[Address]")}; email: ${dash(body.clientEmail, "[Email]")}; representative, if applicable: ${dash([body.clientRep, body.clientTitle].filter(Boolean).join(", "), "[Name and Title]")}). The Developer and Client are collectively referred to as the â€œParties.â€

## Project details

- **Project & dates:** ${dash(body.projectName, "[Project]")} Â· Start ${dash(body.effectiveDate, "[date]")} Â· Handover ${dash(body.handoverDate, "[date]")}
- **Services & platforms:** ${picked.join(", ") || "â€”"} Â· ${dash(body.platforms, "[platforms]")}
- **Scope:** ${features.join("; ") || "â€”"}
- **Deliverables:** ${[
    deliverables.includes("source") && "Source code",
    deliverables.includes("deploy") && "Deployment",
    deliverables.includes("readme") && "README",
  ].filter(Boolean).join(", ") || "â€”"}
- **Out of scope:** ${dash(body.outOfScope, "â€”")}
- **Fees:** PHP ${total} Â· 50% on signing / 25% prototype / 25% handover
- **Revisions:** ${dash(body.revisions, "2")} rounds Â· Extra PHP ${dash(body.hourlyRate, "[rate]")} / hour
- **Privacy:** ${privacy}
- **Venue:** ${venue}, Philippines

## 1. Services and project scope

The Developer shall design, develop, test, and deliver the software described in the Project Details above (â€œProjectâ€). Only the features, platforms, and deliverables expressly listed are included in the project fee. Any additional feature, integration, platform, or material change requires written approval of the additional fee and revised timeline.

## 2. Responsibilities and timeline

The Developer shall perform the agreed services with reasonable professional care and provide progress updates at agreed milestones. The Client shall provide accurate requirements, content, access, feedback, approvals, and payments on time. Target dates are estimates and may be extended due to Client delays, approved changes, third-party delays, or events beyond reasonable control. The Developer may pause affected work after written notice if required information or payment is missing.

## 3. Fees and payment

The total project fee is PHP ${total}, payable as specified above. Unless otherwise agreed in writing, payment is 50% upon signing, 25% at the agreed prototype/staging milestone, and 25% before final handover. Work begins after the initial payment clears. If payment is more than seven (7) calendar days overdue, the Developer may pause work after written notice and charge interest of 2% per month or the maximum lawful rate, whichever is lower. The Client shall pay hosting, domains, licenses, paid APIs, app-store fees, and other third-party costs unless expressly included.

## 4. Changes and revisions

The included revision rounds and rate for additional work shall be recorded above. New features or changes to approved requirements are additional work. The Developer shall begin additional work only after the Client approves the added fee and timeline in writing, including by email.

## 5. Review and acceptance

The Client shall have seven (7) calendar days after delivery to report in writing any reproducible issue that materially fails to meet the agreed requirements. A deliverable is accepted upon written approval, production use (excluding testing), or no defect report within the review period after notice that review has started. Acceptance does not remove warranty rights.

## 6. Intellectual property

Upon full payment, the Developer assigns to the Client the transferable rights in custom work created specifically for the Project. Until full payment, that work remains with the Developer, subject to applicable law. The Developer retains ownership of pre-existing code, reusable tools, templates, libraries, and general know-how, and grants the Client a license to use Developer-owned components included in the delivered software as needed to operate it. Third-party and open-source components remain subject to their respective licenses.

## 7. Limited warranty and support

For thirty (30) calendar days after final acceptance, the Developer shall correct reproducible bugs that materially prevent the software from meeting the agreed requirements, at no additional development fee. The warranty excludes new features, misuse, unauthorized modifications, third-party outages or changes, and issues caused by systems outside the Developerâ€™s control. Maintenance and support after the warranty period require a separate agreement.

## 8. Confidentiality and data protection

Each Party shall protect the other Partyâ€™s non-public business, technical, and personal information and use it only for the Project. This obligation continues for two (2) years after termination; trade secrets and credentials remain protected as required by law. Both Parties shall comply with applicable Philippine data-protection laws. Unless otherwise agreed, the Client is responsible for production data, backups, account security, and business compliance.

## 9. Liability

To the maximum extent permitted by law, the Developerâ€™s total liability under this Agreement shall not exceed the project fees actually paid by the Client. Neither Party shall be liable for indirect or consequential losses, except where liability cannot lawfully be limited, including fraud or willful misconduct.

## 10. Termination and general terms

Either Party may terminate for a material breach not remedied within fourteen (14) calendar days after written notice. The Client may cancel by written notice and shall pay for completed work, reasonable work in progress, and approved non-cancellable costs; amounts already paid shall be credited against sums due. The Developer may suspend or terminate if payment is more than fourteen (14) days overdue or essential Client materials remain unavailable after written reminder. Fully paid deliverables shall be handed over; unpaid work need not be transferred. The Parties are independent contractors. This Agreement and the Project Details above are the entire agreement; changes must be approved in writing. Philippine law governs. Disputes are subject to applicable jurisdiction and venue rules in ${venue}, Philippines. Electronic signatures may be used where permitted by law.

By signing below, the Parties confirm they have read, understood, and accepted this Agreement and the completed Project Details.

**Developer:** Jhon Elopre / elopre.dev Â· Signature ______________ Date ____________

**Client:** ${dash(body.clientName, "[Client name / company]")} Â· Signature ______________ Date ____________
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
  return shell("Contract studio â€” elopre.dev", `
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
  return shell("New agreement â€” elopre.dev", `
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
          <button class="primary" type="submit" name="mode" value="preview">Preview / PDF</button>
          <button class="ghost" type="submit" name="mode" value="download">Download .md</button>
          <a class="btn ghost" href="/studio/logout">Log out</a>
        </div>
      </form>
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
      return res.send(renderAgreementHtml(body));
    }
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(markdown);
  });
}

module.exports = { mount, buildAgreement };
