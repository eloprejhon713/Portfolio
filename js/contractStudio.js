/**
 * Private contract studio â€” served only by Express after CONTRACT_PASS.
 * Do not link this from index.html or GitHub Pages.
 */

const crypto = require("crypto");
const { renderAgreementHtml } = require("./agreementPrint");
const { fillAgreementPdf } = require("./fillAgreementPdf");

const COOKIE = "elopre_studio";
const SERVICES = [
  "Web Development",
  "Mobile Development",
  "Desktop Development",
  "AI & Algorithm Development",
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
  const errMsg = error ? "Incorrect password. Please try again." : "";
  const warn = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Contract studio</title>
<link rel="icon" type="image/png" href="/assets/images/brand/icon.png">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#fff;--card:#fff;--field:#f7fafd;--text:#223548;--muted:#62778b;--border:#d4e0ea;
  --primary:#2563eb;--primary-d:#1e3a8a;--primary-l:#3b82f6;--tint:#dbeafe;--accent:#d97a45;--accent-w:#fcf5ee;
  box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 Outfit,system-ui,sans-serif;display:grid;place-items:center;padding:20px}
.shell{width:100%;max-width:880px;display:grid;grid-template-columns:1fr 1.1fr;background:var(--card);border:1px solid var(--border);border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(34,53,72,.12)}
.side{position:relative;padding:40px;color:var(--text);background:linear-gradient(160deg,var(--tint) 0%,var(--card) 100%);border-right:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center;gap:28px;overflow:hidden}
.side::before,.side::after{content:"";position:absolute;border-radius:50%;background:color-mix(in srgb,var(--primary) 10%,transparent)}
.side::before{width:260px;height:260px;right:-90px;top:-90px}
.side::after{width:180px;height:180px;left:-60px;bottom:-60px;background:color-mix(in srgb,var(--accent) 16%,transparent)}
.side>*{position:relative;z-index:1}
.logo{width:100%;display:flex;justify-content:center;padding-top:8px}
.logo img{display:block;width:min(100%,250px);height:auto;filter:drop-shadow(0 12px 18px rgba(30,58,138,.22))}
.side h1{font-size:28px;line-height:1.15;letter-spacing:-.02em;margin:0 0 10px;color:var(--text)}
.side p{margin:0;color:var(--muted);font-size:15px}
.points{list-style:none;margin:0;padding:0;display:grid;gap:10px;font-size:13.5px;color:var(--text);text-align:left}
.points li{display:flex;gap:10px;align-items:center}
.points svg{flex:none;color:var(--primary);background:var(--tint);border-radius:50%;padding:3px;width:20px;height:20px}
.main{padding:44px 40px;display:flex;flex-direction:column;justify-content:center}
.badge{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--accent);background:var(--accent-w);padding:5px 11px;border-radius:99px;margin-bottom:16px}
.main h2{font-size:24px;letter-spacing:-.02em;margin:0 0 4px}
.sub{color:var(--muted);margin:0 0 26px;font-size:14px}
label{display:block;font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.02em;margin-bottom:6px}
.pw{position:relative}
.pw input{width:100%;font:inherit;color:var(--text);background:var(--field);border:1px solid var(--border);border-radius:12px;padding:13px 48px 13px 44px;outline:none;transition:border-color .15s,box-shadow .15s}
.pw input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 20%,transparent)}
.pw.err input{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent)}
.pw .ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;display:flex}
.pw .eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:0;border-radius:8px;background:transparent;color:var(--muted);cursor:pointer;display:grid;place-items:center}
.pw .eye:hover{background:var(--tint);color:var(--primary)}
.msg{min-height:20px;margin:7px 0 14px;font-size:13px;color:var(--accent);display:flex;align-items:center;gap:6px}
.btn{width:100%;font:inherit;font-weight:600;border:0;border-radius:12px;padding:13px 18px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:.15s;text-decoration:none}
.btn.p{background:var(--primary);color:#fff;box-shadow:0 6px 16px color-mix(in srgb,var(--primary) 30%,transparent)}
.btn.p:hover{background:var(--primary-d);transform:translateY(-1px)}
.btn.p:disabled{opacity:.7;cursor:progress;transform:none}
.btn.g{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn.g:hover{border-color:var(--primary);color:var(--primary);background:var(--tint)}
.or{display:flex;align-items:center;gap:12px;color:var(--muted);font-size:12px;margin:16px 0}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--border)}
.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:s .7s linear infinite}
@keyframes s{to{transform:rotate(360deg)}}
.shake{animation:sh .35s}
@keyframes sh{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@media (max-width:760px){.shell{grid-template-columns:1fr}.side{padding:28px;gap:20px}.points{display:none}.main{padding:30px 24px}}
</style>
</head>
<body>
<div class="shell">
  <aside class="side">
    <div class="logo"><img src="/assets/images/brand/logonobg.png" alt="elopre.dev logo"></div>
    <div>
      <h1>Contract studio</h1>
      <p>Create and send client agreements in minutes.</p>
    </div>
    <ul class="points">
      <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Generate agreements fast</li>
      <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Export to PDF or Markdown</li>
      <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Private, owner-only access</li>
    </ul>
  </aside>
  <main class="main">
    <span class="badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Private</span>
    <h2>Welcome back</h2>
    <p class="sub">Private. Clients do not see this page.</p>
    <form id="login" method="post" action="/studio/login" novalidate>
      <label for="pw">Password</label>
      <div class="pw${errMsg ? " err shake" : ""}" id="box">
        <span class="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/></svg></span>
        <input id="pw" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" autofocus>
        <button type="button" class="eye" id="eye" aria-label="Show password">
          <svg id="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <div class="msg" id="msg" role="alert" aria-live="polite">${errMsg ? warn + errMsg : ""}</div>
      <button class="btn p" id="go" type="submit"><span id="goText">Open studio</span></button>
    </form>
    <div class="or">or</div>
    <a class="btn g" id="back" href="/">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to portfolio
    </a>
  </main>
</div>
<script>
const $=id=>document.getElementById(id);
const warn='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
function fail(text){
  $('box').classList.add('err');$('msg').innerHTML=warn+text;
  const b=$('box');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');
}
$('pw').addEventListener('input',()=>{$('box').classList.remove('err');$('msg').textContent=''});
$('eye').onclick=()=>{
  const show=$('pw').type==='password';
  $('pw').type=show?'text':'password';
  $('eye').setAttribute('aria-label',show?'Hide password':'Show password');
  $('eyeIcon').innerHTML=show
    ?'<path d="M17.9 17.9A10.1 10.1 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 4.1-5M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/>'
    :'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
};
$('login').addEventListener('submit',e=>{
  const v=$('pw').value;
  if(!v.trim()){e.preventDefault();fail('Please enter your password.');$('pw').focus();return}
  $('go').disabled=true;$('go').innerHTML='<span class="spin"></span><span>Checking…</span>';
});
</script>
</body>
</html>`;
}

function formPage() {
  const serviceChips = SERVICES.map((name) =>
    `<label class="chip"><input type="checkbox" name="services" value="${esc(name)}"><span>${esc(name)}</span></label>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Generate agreement</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/images/brand/icon.png">
<style>
:root{
  --bg:#fff;--card:#fff;--field:#f7fafd;--text:#223548;--muted:#62778b;--border:#d4e0ea;
  --primary:#2563eb;--primary-d:#1e3a8a;--primary-l:#3b82f6;--tint:#dbeafe;
  --accent:#d97a45;--ok:#2e8b57;
  box-sizing:border-box;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 Outfit,system-ui,sans-serif}
.app{max-width:1500px;margin:0 auto;padding:24px}
header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.brand{display:flex;align-items:center;gap:14px}
.logo{width:44px;height:44px;border-radius:12px;background:#0d1b3e;display:grid;place-items:center}
.logo img{width:26px;height:26px;object-fit:contain}
h1{font-size:24px;margin:0;letter-spacing:-.02em}
.sub{color:var(--muted);font-size:14px;margin:2px 0 0}
.status{display:flex;gap:10px;align-items:center;font-size:13px;color:var(--muted)}
.bar{width:140px;height:8px;border-radius:99px;background:var(--border);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--primary);transition:width .3s}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
.card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:22px;box-shadow:0 1px 2px rgba(34,53,72,.05)}
.card h2{display:flex;align-items:center;gap:10px;font-size:16px;margin:0 0 16px}
.num{width:26px;height:26px;border-radius:50%;background:var(--tint);color:var(--primary);display:grid;place-items:center;font-size:13px;font-weight:700}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
label{display:block;font-size:12px;font-weight:600;color:var(--muted);margin:0 0 5px;letter-spacing:.02em}
.f{margin-bottom:14px}
input,select,textarea{width:100%;font:inherit;color:var(--text);background:var(--field);border:1px solid var(--border);border-radius:10px;padding:10px 12px;outline:none}
textarea{resize:vertical;min-height:84px}
input:focus,select:focus,textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.2)}
input.bad{border-color:var(--accent)}
.money{position:relative}
.money span{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px;font-weight:600;pointer-events:none}
.money input{padding-left:54px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{position:relative}
.chip input{position:absolute;opacity:0;inset:0;cursor:pointer;width:100%;height:100%}
.chip span{display:inline-block;padding:7px 13px;border-radius:99px;border:1px solid var(--border);background:var(--field);font-size:13px;font-weight:500}
.chip input:checked+span{background:var(--primary);border-color:var(--primary);color:#fff}
.sum{margin-top:6px;padding:14px;border-radius:12px;background:var(--tint);font-size:13px}
.sum div{display:flex;justify-content:space-between;padding:2px 0}
.sum .st{margin-top:8px;padding-top:8px;border-top:1px dashed var(--border);font-weight:600}
.st.ok{color:var(--ok)}.st.warn{color:var(--accent)}
.actions{position:sticky;bottom:12px;margin-top:20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:14px 18px;background:var(--card);border:1px solid var(--border);border-radius:16px;box-shadow:0 8px 24px rgba(34,53,72,.12)}
.actions .sp{flex:1}
.btn{font:inherit;font-weight:600;border:0;border-radius:10px;padding:10px 18px;cursor:pointer;text-decoration:none;display:inline-flex}
.btn.p{background:var(--primary);color:#fff}
.btn.s{background:var(--tint);color:var(--primary)}
.btn.g{background:transparent;color:var(--muted);border:1px solid var(--border)}
.toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%) translateY(20px);background:#0f172a;color:#fff;padding:10px 18px;border-radius:10px;opacity:0;pointer-events:none;transition:.25s;font-size:14px}
.toast.on{opacity:1;transform:translateX(-50%)}
@media (max-width:1100px){.grid{grid-template-columns:1fr 1fr}.grid .card:last-child{grid-column:1/-1}}
@media (max-width:700px){.app{padding:14px}.grid{grid-template-columns:1fr}.row{grid-template-columns:1fr}.bar{display:none}}
</style>
</head>
<body>
<div class="app">
<header>
  <div class="brand">
    <div class="logo"><img src="/assets/images/brand/logonobg.png" alt=""></div>
    <div><h1>Generate agreement</h1><p class="sub">Fill this in, then Print / PDF. Email the file to the client.</p></div>
  </div>
  <div class="status"><span id="pct">0% complete</span><div class="bar"><i id="fill"></i></div></div>
</header>
<form id="f" method="post" action="/studio/generate" autocomplete="off">
<div class="grid">
<section class="card">
  <h2><span class="num">1</span>Client</h2>
  <div class="f"><label for="clientName">Client name / company</label><input id="clientName" name="clientName" data-req required></div>
  <div class="f"><label for="clientEmail">Client email</label><input id="clientEmail" name="clientEmail" type="email" data-req required></div>
  <div class="f"><label for="clientAddress">Address</label><input id="clientAddress" name="clientAddress" data-req></div>
  <div class="row">
    <div class="f"><label for="clientRep">Represented by</label><input id="clientRep" name="clientRep" data-req></div>
    <div class="f"><label for="clientTitle">Their title</label><input id="clientTitle" name="clientTitle" placeholder="Owner / Manager"></div>
  </div>
  <div class="row">
    <div class="f"><label for="effectiveDate">Effective / start</label><input id="effectiveDate" name="effectiveDate" type="date" data-req></div>
    <div class="f"><label for="handoverDate">Handover</label><input id="handoverDate" name="handoverDate" type="date" data-req></div>
  </div>
  <div class="row">
    <div class="f"><label for="revisions">Revision rounds</label><input id="revisions" name="revisions" type="number" min="0" value="2"></div>
    <div class="f"><label for="venue">Venue</label>
      <select id="venue" name="venue">
        <option>Taguig City</option>
        <option>Muntinlupa City</option>
        <option>Quezon City</option>
        <option>Makati City</option>
        <option>Manila</option>
      </select></div>
  </div>
</section>
<section class="card">
  <h2><span class="num">2</span>Project scope</h2>
  <div class="f"><label for="projectName">Project name</label><input id="projectName" name="projectName" data-req required></div>
  <div class="f"><label>Services</label><div class="chips" id="services">${serviceChips}</div></div>
  <div class="row">
    <div class="f"><label for="platforms">Platforms</label><input id="platforms" name="platforms" placeholder="Web / Android / iOS / Windows"></div>
    <div class="f"><label for="tech">Tech (optional)</label><input id="tech" name="tech" placeholder="Flutter, PHP, MySQL"></div>
  </div>
  <div class="f"><label for="features">Main features (one per line)</label><textarea id="features" name="features" placeholder="Login&#10;Dashboard&#10;Reports"></textarea></div>
  <div class="f"><label for="outOfScope">Out of scope</label><textarea id="outOfScope" name="outOfScope" placeholder="Content writing, app store accounts, ads"></textarea></div>
</section>
<section class="card">
  <h2><span class="num">3</span>Fees &amp; deliverables</h2>
  <div class="row">
    <div class="f"><label for="feeTotal">Total fee (PHP)</label><div class="money"><span>PHP</span><input id="feeTotal" name="feeTotal" type="number" min="0" data-req required></div></div>
    <div class="f"><label for="hourlyRate">Extra work / hour</label><div class="money"><span>PHP</span><input id="hourlyRate" name="hourlyRate" type="number" min="0"></div></div>
  </div>
  <div class="row">
    <div class="f"><label for="feeDeposit">Deposit amount</label><div class="money"><span>PHP</span><input id="feeDeposit" name="feeDeposit" type="number" min="0"></div></div>
    <div class="f"><label for="feeMid">Prototype amount</label><div class="money"><span>PHP</span><input id="feeMid" name="feeMid" type="number" min="0"></div></div>
  </div>
  <div class="row">
    <div class="f"><label for="feeStage">Staging amount</label><div class="money"><span>PHP</span><input id="feeStage" name="feeStage" type="number" min="0"></div></div>
    <div class="f"><label for="feeFinal">Final amount</label><div class="money"><span>PHP</span><input id="feeFinal" name="feeFinal" type="number" min="0"></div></div>
  </div>
  <div class="sum" id="sum"></div>
  <div class="f" style="margin-top:16px"><label>Deliverables</label>
    <div class="chips">
      <label class="chip"><input type="checkbox" name="deliverables" value="source" checked><span>Source code</span></label>
      <label class="chip"><input type="checkbox" name="deliverables" value="deploy"><span>Deployment</span></label>
      <label class="chip"><input type="checkbox" name="deliverables" value="readme" checked><span>README</span></label>
    </div></div>
  <div class="f" style="margin-bottom:0"><label for="portfolio">Portfolio</label>
    <select id="portfolio" name="portfolio">
      <option value="show">May show on elopre.dev</option>
      <option value="confidential">Do not show in portfolio</option>
    </select></div>
</section>
</div>
<div class="actions">
  <button class="btn p" type="submit" name="mode" value="pdf" id="print">Print / PDF</button>
  <button class="btn s" type="submit" name="mode" value="download" id="dl">Download .md</button>
  <span class="sp"></span>
  <a class="btn g" href="/studio/logout">Log out</a>
</div>
</form>
<div class="toast" id="toast"></div>
</div>
<script>
const $=id=>document.getElementById(id);
const php=n=>'PHP '+(Number(n)||0).toLocaleString('en-PH');
function refresh(){
  const req=[...document.querySelectorAll('[data-req]')];
  const svc=[...document.querySelectorAll('input[name="services"]:checked')].length;
  const done=req.filter(i=>i.value.trim()).length+(svc?1:0);
  const p=Math.round(done/(req.length+1)*100);
  $('pct').textContent=p+'% complete';
  $('fill').style.width=p+'%';
  const total=+$('feeTotal').value||0;
  const parts=[['Deposit','feeDeposit'],['Prototype','feeMid'],['Staging','feeStage'],['Final','feeFinal']];
  const sum=parts.reduce((a,[,id])=>a+(+$(id).value||0),0);
  const diff=total-sum;
  let h=parts.map(([n,id])=>'<div><span>'+n+'</span><b>'+php($(id).value)+'</b></div>').join('');
  h+='<div class="st '+(diff===0&&total?'ok':'warn')+'"><span>'+(diff===0&&total?'Milestones match total':diff>0?'Unallocated':'Over total by')+'</span><b>'+php(diff===0&&total?sum:Math.abs(diff))+'</b></div>';
  $('sum').innerHTML=h;
}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
function validate(){
  let ok=true;
  document.querySelectorAll('[data-req]').forEach(i=>{const bad=!i.value.trim();i.classList.toggle('bad',bad);if(bad)ok=false});
  if(!ok)toast('Please complete the highlighted fields');
  return ok;
}
$('f').addEventListener('input',refresh);
$('f').addEventListener('submit',e=>{if(!validate())e.preventDefault()});
refresh();
</script>
</body>
</html>`;
}

function filenameFor(body, ext) {
  return `${slug(body.clientName)}-agreement.${ext}`;
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

  app.post("/studio/generate", async (req, res) => {
    noindex(res);
    if (!configured() || !isAuthed(req)) return res.redirect(303, "/studio");
    const body = req.body || {};
    if (body.mode === "pdf" || body.mode === "preview") {
      try {
        const pdf = await fillAgreementPdf(body);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${filenameFor(body, "pdf")}"`);
        return res.send(pdf);
      } catch (error) {
        console.error("Agreement PDF failed:", error);
        return res.send(renderAgreementHtml(body));
      }
    }
    const markdown = buildAgreement(body);
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filenameFor(body, "md")}"`);
    return res.send(markdown);
  });
}

module.exports = { mount, buildAgreement };
