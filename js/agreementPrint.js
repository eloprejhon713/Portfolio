/**
 * Print / PDF sheet for the private contract studio. Not linked from the public site.
 */

const SERVICES = [
  "Web Development",
  "Mobile Development",
  "Desktop Development",
  "Algorithm Design",
];

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asList(body, key) {
  const value = body[key];
  return Array.isArray(value) ? value : value ? [value] : [];
}

function ph(value, fallback) {
  const text = String(value || "").trim();
  const shown = esc(text || fallback);
  const filled = text ? " fill" : "";
  return `<b class="ph${filled}" data-o="${esc(fallback)}">${shown}</b>`;
}

function box(on) {
  return on ? " checked" : "";
}

function featureLis(body) {
  const lines = String(body.features || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const items = lines.length ? lines.slice() : ["", "", ""];
  while (items.length < 3) items.push("");
  return items.map((line) => `<li class="ed">${esc(line)}</li>`).join("");
}

function renderAgreementHtml(body) {
  const services = asList(body, "services");
  const deliverables = asList(body, "deliverables");
  const serviceBoxes = SERVICES.map(
    (name) => `<label class="cb"><input type="checkbox"${box(services.includes(name))}>${esc(name)}</label>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Software Development Services Agreement</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/images/brand/icon.png">
<style>
:root{box-sizing:border-box;color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
--white:#ffffff;--off-white:#f4f6fb;--bg:#eef1f8;--black:#070810;--navy:#0d1b3e;--navy-mid:#172554;--navy-light:#1e3a8a;--blue:#2563eb;--blue-soft:#3b82f6;--blue-pale:#dbeafe;--text:#0f172a;--text-muted:#64748b;--border:#e2e8f0;--border-dark:#cbd5e1;--surface:#f1f5f9;--font:'Outfit',sans-serif}
*,*::before,*::after{box-sizing:inherit;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0}
body{background:var(--bg);color:var(--text);font-family:var(--font);-webkit-font-smoothing:antialiased}
.bar{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 24px;background:rgba(255,255,255,.8);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;border:1px solid var(--border-dark);background:var(--white);color:var(--navy);font:600 .88rem var(--font);cursor:pointer;transition:.2s}
.btn:hover{border-color:var(--blue);color:var(--blue)}
.btn.dark{background:var(--navy);border-color:var(--navy);color:#fff;box-shadow:0 10px 24px -10px rgba(13,27,62,.7)}
.btn.dark:hover{background:var(--navy-light);color:#fff}
.btn svg{width:16px;height:16px}
.right{display:flex;align-items:center;gap:12px}
.cnt{font-size:.8rem;font-weight:500;color:var(--text-muted);background:var(--surface);border:1px solid var(--border);padding:7px 14px;border-radius:999px}
.sheet{font-size:15px;max-width:860px;margin:28px auto 60px;background:var(--white);border:1px solid var(--border);border-radius:10px;box-shadow:0 24px 60px -24px rgba(13,27,62,.3);overflow:hidden}
.hero{background:linear-gradient(135deg,var(--navy),var(--navy-light));color:#fff;padding:38px 48px 34px;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-70px;top:-70px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.07)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;position:relative;z-index:1}
.brand em{font-style:normal;color:var(--blue-pale)}
.lg{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.14);display:grid;place-items:center;overflow:hidden}
.lg img{width:22px;height:22px;object-fit:contain;display:block}
.kick{margin-top:26px;font-size:.72em;letter-spacing:.18em;text-transform:uppercase;opacity:.7;position:relative}
h1{margin:6px 0 0;font-size:2.1em;line-height:1.1;letter-spacing:-.03em;position:relative}
.body{padding:34px 48px 46px}
p,li{line-height:1.7;margin:0 0 8px}
ol,ul{padding-left:1.35em;margin:6px 0 10px}
li::marker{color:var(--blue);font-weight:600}
.lead{font-size:1.05em}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}
.pt{border:1px solid var(--border);background:var(--off-white);border-radius:14px;padding:16px 18px;break-inside:avoid}
.pt small{display:inline-block;font-size:.68em;font-weight:700;letter-spacing:.14em;color:var(--blue);background:var(--blue-pale);padding:3px 10px;border-radius:999px;margin-bottom:10px}
.pt p{margin:0;font-size:.94em}
.note{border-left:3px solid var(--blue-soft);background:var(--off-white);padding:12px 16px;border-radius:0 12px 12px 0;font-size:.9em;color:var(--navy-mid);margin:18px 0 6px;break-inside:avoid}
.doc{counter-reset:s}
.sec{margin-top:28px}
.sec h2{display:flex;align-items:center;gap:12px;margin:0 0 10px;font-size:1.15em;color:var(--navy);letter-spacing:-.01em;break-after:avoid;padding-bottom:8px;border-bottom:1px solid var(--border)}
.sec h2::before{counter-increment:s;content:counter(s);width:28px;height:28px;border-radius:9px;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:.78em;flex:none}
.t{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--border);border-radius:12px;overflow:hidden;font-size:.92em;margin:12px 0;break-inside:avoid}
.t th{background:var(--navy);color:#fff;text-align:left;padding:10px 14px;font-weight:600;font-size:.84em;letter-spacing:.05em}
.t td{padding:10px 14px;border-top:1px solid var(--border);vertical-align:top}
.t tr:nth-child(even) td{background:var(--off-white)}
.t tr:first-child td{border-top:0}
.ph{background:var(--blue-pale);color:var(--navy-light);padding:1px 7px;border-radius:6px;font-weight:600;outline:0;cursor:text;transition:box-shadow .15s}
.ph:hover,.ph:focus{box-shadow:0 0 0 2px var(--blue-soft)}
.ph.fill{background:none;color:var(--text);padding:0 2px;border-radius:0;border-bottom:1.5px solid var(--blue-soft);box-shadow:none}
.ed{outline:0;min-width:70px;height:40px}.ed:focus{background:var(--blue-pale)}
.sig td{width:36%}.sig td:first-child{width:28%;color:var(--text-muted);font-weight:600}.sig td.s{height:62px}
.sig td.s{background-image:linear-gradient(var(--border-dark),var(--border-dark));background-repeat:no-repeat;background-size:calc(100% - 28px) 1px;background-position:14px calc(100% - 14px)}
.sched{break-before:page;margin-top:44px}
.sh{display:flex;align-items:center;gap:14px;padding:20px 24px;border-radius:16px;background:linear-gradient(135deg,var(--navy),var(--navy-light));color:#fff;margin-bottom:18px}
.sh small{display:block;font-size:.7em;letter-spacing:.16em;text-transform:uppercase;opacity:.7}
.sh h2{margin:2px 0 0;font-size:1.45em;letter-spacing:-.02em}
.sched h3{display:flex;align-items:center;gap:10px;margin:24px 0 8px;font-size:.78em;letter-spacing:.14em;text-transform:uppercase;color:var(--blue);break-after:avoid}
.sched h3::after{content:"";flex:1;height:1px;background:var(--border)}
.kv{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;margin-bottom:6px}
.kv div{border:1px solid var(--border);border-radius:12px;padding:10px 14px;background:var(--off-white);break-inside:avoid}
.kv small{display:block;font-size:.68em;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:3px}
label.cb{display:flex;align-items:center;gap:10px;padding:5px 0;cursor:pointer;line-height:1.5}
input[type=checkbox]{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:1.5px solid var(--border-dark);border-radius:5px;flex:none;margin:0;cursor:pointer;display:grid;place-items:center;background:#fff;transition:.15s}
input[type=checkbox]:checked{background:var(--navy);border-color:var(--navy)}
input[type=checkbox]:checked::after{content:"";width:8px;height:4px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px)}
@page{size:A4;margin:16mm 14mm 18mm}
@media (max-width:640px){.hero,.body{padding-left:22px;padding-right:22px}.parties,.kv{grid-template-columns:1fr}.sheet{margin:14px 10px 40px}.bar{padding:10px 14px}.cnt{display:none}.sig td{font-size:.85em}}
@media print{
body{background:#fff}.bar{display:none}
.sheet{font-size:10pt;margin:0;max-width:none;border:0;border-radius:0;box-shadow:none;overflow:visible}
.hero{border-radius:14px;padding:26px 30px 24px;margin-bottom:6mm}.body{padding:0}
.sec{margin-top:18px}.sec,.pt,.note{break-inside:avoid}
.ph:not(.fill){background:none;color:var(--text-muted);padding:0;border-bottom:1px dotted var(--border-dark);box-shadow:none}
.ph.fill{border-bottom:0}
.sched{margin-top:0}
}
</style>
</head>
<body>
<div class="bar">
  <a class="btn" href="/studio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Back to form</a>
  <div class="right"><span class="cnt" id="cnt"></span><button class="btn dark" id="print" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print / PDF</button></div>
</div>
<article class="sheet">
<header class="hero">
  <div class="brand"><div class="lg"><img src="/assets/images/brand/logonobg.png" alt="elopre.dev"></div><span>elopre<em>.dev</em></span></div>
  <div class="kick">Agreement</div>
  <h1>Software Development<br>Services Agreement</h1>
</header>
<div class="body">
<p class="lead"><strong>This Agreement</strong> is entered into as of ${ph(body.effectiveDate, "[Date]")} (“Effective Date”)</p>
<div class="parties">
  <div class="pt"><small>BETWEEN</small><p><strong>Jhon Elopre</strong>, an independent software developer doing business as <strong>elopre.dev</strong>, with email <strong>eloprepotchy@gmail.com</strong> (“Developer”)</p></div>
  <div class="pt"><small>AND</small><p>${ph(body.clientName, "[Client full legal name / company]")}, with address ${ph(body.clientAddress, "[address]")}, email ${ph(body.clientEmail, "[email]")}, represented by ${ph(body.clientRep, "[name / title]")} (“Client”)</p></div>
</div>
<p>Developer and Client are each a “Party” and together the “Parties.”</p>
<div class="note">This is a working template, not legal advice. For a large or long project, have a Philippine lawyer review it.</div>

<div class="doc">
<section class="sec"><h2>Purpose</h2>
<p>Client engages Developer to design, develop, and deliver software as described in <strong>Schedule A (Statement of Work)</strong>, under one or more of the Developer’s services:</p>
<table class="t"><tr><th>Service</th><th>Typical work</th></tr>
<tr><td><strong>Web Development</strong></td><td>Responsive web applications — frontend, backend, and integrations</td></tr>
<tr><td><strong>Mobile Development</strong></td><td>Cross-platform mobile apps (e.g. Flutter) with API / device integration</td></tr>
<tr><td><strong>Desktop Development</strong></td><td>Desktop software for Windows, macOS, and/or Linux</td></tr>
<tr><td><strong>Algorithm Design</strong></td><td>Algorithms, data structures, performance tuning, and complex logic</td></tr></table>
<p>Only the service(s) ticked in Schedule A are included. Work outside Schedule A needs a written change order (Section 7).</p></section>

<section class="sec"><h2>Term</h2>
<p>This Agreement starts on the Effective Date and ends when (a) all deliverables in Schedule A are accepted, and (b) final payment is received — unless ended earlier under Section 13.</p></section>

<section class="sec"><h2>Developer’s duties</h2>
<p>Developer shall:</p>
<ol><li>Perform the work in Schedule A in a professional manner.</li><li>Use reasonable skill consistent with a software developer of similar experience.</li><li>Keep Client informed of progress at the milestones in Schedule A.</li><li>Deliver source code, build instructions, and agreed credentials at handover.</li><li>Fix defects reported during the warranty period (Section 10) that are within scope.</li></ol>
<p>Developer does <strong>not</strong> promise specific business results (sales, downloads, rankings, or user growth).</p></section>

<section class="sec"><h2>Client’s duties</h2>
<p>Client shall:</p>
<ol><li>Give requirements, content, logos, copy, accounts, and decisions on time.</li><li>Name one contact who can approve work.</li><li>Pay invoices on the dates in Schedule A.</li><li>Provide access (hosting, app stores, APIs, domains, databases) when needed.</li><li>Test deliverables within the review period in Section 8.</li></ol>
<p>Delay by Client (late content, late feedback, late payment) extends the timeline by at least the same number of days, and may pause work.</p></section>

<section class="sec"><h2>Fees and payment</h2>
<ol><li><strong>Total fee:</strong> <strong>PHP ${ph(body.feeTotal, "[amount]")}</strong> (or as broken down in Schedule A).</li>
<li><strong>Payment schedule</strong> (default if Schedule A is silent):
<ul><li><strong>50%</strong> deposit — due on signing; work starts after cleared funds.</li><li><strong>25%</strong> — due on working prototype / staging.</li><li><strong>25%</strong> — due on delivery, before final handover of source / live access.</li></ul></li>
<li>Fees are in <strong>Philippine Peso</strong> unless Schedule A says otherwise.</li>
<li>Late payment of more than <strong>7 days</strong>: Developer may pause work and charge <strong>2% per month</strong> on the unpaid amount, or the maximum allowed by law, whichever is less.</li>
<li>Deposit is <strong>non-refundable</strong> once work has started, except if Developer cancels without cause.</li>
<li>Third-party costs (hosting, domains, app store fees, SMS, maps, paid APIs, SSL, licenses) are <strong>Client’s</strong> unless Schedule A says Developer will buy them and bill at cost.</li></ol></section>

<section class="sec"><h2>Timeline</h2>
<p>Target dates are in Schedule A. They are estimates, not guarantees. They move if:</p>
<ul><li>Client changes scope;</li><li>Client is late with materials or approval;</li><li>A third-party service (host, store, API) is delayed; or</li><li>Force majeure (Section 15).</li></ul></section>

<section class="sec"><h2>Changes and extra work</h2>
<p>A <strong>Change Request</strong> is anything not listed in Schedule A, including new screens, new platforms, new integrations, extra revisions beyond the agreed number, or a change in approved design.</p>
<ol><li>Client sends the request in writing (email is enough).</li><li>Developer replies with effect on <strong>fee, timeline, and scope</strong>.</li><li>Work on that change starts only after Client confirms in writing (and pays any extra deposit if required).</li></ol>
<p>Silence or “please just add it” in chat is not approval of extra fee.</p>
<p><strong>Included revisions:</strong> ${ph(body.revisions, "[e.g. 2]")} rounds of reasonable revisions on already-delivered items in a milestone. After that, hourly or a fixed add-on applies: <strong>PHP ${ph(body.hourlyRate, "[rate]")} / hour</strong> or a quoted lump sum.</p></section>

<section class="sec"><h2>Review and acceptance</h2>
<ol><li>After each milestone (or final delivery), Client has <strong>7 calendar days</strong> to review and list written defects (something that does not match Schedule A).</li><li>If Client does not respond in 7 days, that milestone is <strong>deemed accepted</strong>.</li><li>Cosmetic taste (“make it pop,” “I imagined it differently”) after approval of a design/wireframe is a Change Request, not a defect.</li><li>Developer will fix in-scope defects within a reasonable time, then the 7-day clock runs again for those fixes only.</li></ol></section>

<section class="sec"><h2>Intellectual property</h2>
<ol><li><strong>Before full payment:</strong> all work product (code, designs made for this project, documentation) stays with the <strong>Developer</strong>.</li>
<li><strong>After full payment:</strong> Developer assigns to Client the rights in the <strong>custom work created specifically for this project</strong>, so Client may use, modify, and run it for their business.</li>
<li>Developer keeps rights in:
<ul><li>pre-existing tools, snippets, templates, and know-how;</li><li>generic components reused across projects;</li><li>Developer’s portfolio right to show the work (unless Client asks in writing for confidentiality).</li></ul></li>
<li>Client warrants that materials they give (logo, text, photos, data) are theirs to use. Client will cover Developer if a third party claims those materials infringe their rights.</li>
<li>Open-source and third-party libraries stay under <strong>their own licenses</strong>. Developer will note major ones at handover. Client is responsible for complying with those licenses after handover.</li></ol></section>

<section class="sec"><h2>Warranty</h2>
<p>For <strong>30 days</strong> after final acceptance, Developer will fix, at no extra fee, bugs that:</p>
<ul><li>exist in the delivered, in-scope software; and</li><li>are reproducible; and</li><li>are not caused by Client changes, new hosting, new OS/store rules, or third-party APIs.</li></ul>
<p>This warranty does <strong>not</strong> cover new features, content updates, or “it should also do X.”</p>
<p>After 30 days, support is a new paid engagement.</p>
<p><strong>No other warranty.</strong> Software is delivered “as is” except for this section. Developer does not warrant uninterrupted or error-free operation of the internet, app stores, or third-party APIs.</p></section>

<section class="sec"><h2>Limitation of liability</h2>
<ol><li>Developer’s total liability under this Agreement is limited to the <strong>fees actually paid by Client</strong> for the project.</li><li>Developer is not liable for indirect or consequential loss: lost profits, lost data, business interruption, or reputation — except for fraud or willful misconduct.</li><li>Client is responsible for backups, production data, and compliance (privacy, DPA, app store, industry rules) unless Schedule A expressly includes that work.</li></ol></section>

<section class="sec"><h2>Confidentiality</h2>
<p>Each Party will keep the other’s non-public business, technical, and personal information confidential, and use it only to perform this Agreement. This lasts <strong>2 years</strong> after the Agreement ends, and indefinitely for source code and credentials.</p>
<p>Developer may list the project name and a short description in a portfolio unless Schedule A marks the project <strong>Confidential / no portfolio</strong>.</p></section>

<section class="sec"><h2>Termination</h2>
<p><strong>By either Party, for cause:</strong> if the other Party materially breaches and does not fix it within <strong>14 days</strong> after written notice.</p>
<p><strong>By Client, for convenience:</strong> Client may stop the project in writing. Client pays:</p>
<ul><li>all work completed and in progress up to the stop date (at the agreed fee or hourly rate); and</li><li>the deposit, which remains earned if work has started.</li></ul>
<p><strong>By Developer:</strong> if Client is more than <strong>14 days</strong> late on payment, or does not provide required materials after written reminder.</p>
<p>On termination, Developer delivers work already paid for. Unpaid work is not handed over. Sections 9–12 and 16 survive.</p></section>

<section class="sec"><h2>Independent contractor</h2>
<p>Developer is an <strong>independent contractor</strong>, not an employee, partner, or agent of Client. Developer sets their own hours and tools. This Agreement does not create employment under Philippine labor law. Developer is responsible for their own taxes.</p></section>

<section class="sec"><h2>Force majeure</h2>
<p>Neither Party is liable for delay caused by events beyond reasonable control (calamity, outage, war, epidemic, government action, failure of Google/Apple/cloud providers). The affected Party must give notice. If delay lasts more than <strong>60 days</strong>, either Party may end the Agreement and settle payment for work done.</p></section>

<section class="sec"><h2>General</h2>
<ol><li><strong>Entire agreement.</strong> This document plus Schedule A is the full agreement. Chat messages do not change it unless both Parties confirm the change in writing.</li><li><strong>Amendments</strong> must be in writing (email confirmation is enough).</li><li><strong>Severability.</strong> If one clause is invalid, the rest stays in force.</li><li><strong>No waiver.</strong> Failure to enforce a right once is not a waiver later.</li><li><strong>Assignment.</strong> Client may not assign this Agreement without Developer’s written consent.</li><li><strong>Governing law.</strong> Laws of the <strong>Republic of the Philippines</strong>. Venue: courts of ${ph(body.venue, "[Taguig City / Muntinlupa City / as agreed]")}.</li><li><strong>Notices.</strong> Email to the addresses above is enough. Deemed received the next business day.</li></ol></section>

<section class="sec" style="break-inside:avoid"><h2>Signatures</h2>
<p>By signing, the Parties agree to this Agreement and Schedule A.</p>
<table class="t sig"><tr><th></th><th>Developer</th><th>Client</th></tr>
<tr><td>Name</td><td>Jhon Elopre</td><td>${ph(body.clientRep || body.clientName, "[Name]")}</td></tr>
<tr><td>Role</td><td>Developer, elopre.dev</td><td>${ph(body.clientTitle, "[Title]")}</td></tr>
<tr><td>Signature</td><td class="s"></td><td class="s"></td></tr>
<tr><td>Date</td><td class="s"></td><td class="s"></td></tr></table></section>
</div>

<section class="sched">
<div class="sh"><div><small>Schedule A</small><h2>Statement of Work</h2></div></div>
<div class="kv">
<div><small>Project name</small>${ph(body.projectName, "[e.g. Food ordering app / Barangay portal]")}</div>
<div><small>Client contact</small>${ph([body.clientRep, body.clientEmail].filter(Boolean).join(", "), "[name, phone, email]")}</div>
<div><small>Start date</small>${ph(body.effectiveDate, "[date]")}</div>
<div><small>Target handover</small>${ph(body.handoverDate, "[date]")}</div></div>

<h3>A. Services included (tick)</h3>
${serviceBoxes}

<h3>B. What will be built (be specific)</h3>
<ul><li>Platforms: ${ph(body.platforms, "[Web / Android / iOS / Windows / macOS / Linux]")}</li>
<li>Main features (list):<ol>${featureLis(body)}</ol></li>
<li>Out of scope (list so it is clear): ${ph(body.outOfScope, "content writing, app store developer account, paid ads, SEO ranking, 24/7 hosting support, future modules")}</li></ul>

<h3>C. Deliverables</h3>
<label class="cb"><input type="checkbox"${box(deliverables.includes("source"))}>Source code (Git repo or ZIP)</label>
<label class="cb"><input type="checkbox"${box(deliverables.includes("deploy"))}>Staging / production deployment as agreed</label>
<label class="cb"><input type="checkbox"${box(deliverables.includes("readme"))}>Basic admin or README (how to run / build)</label>
<label class="cb"><input type="checkbox"${box(deliverables.includes("other"))}>Others: ${ph(body.otherDeliverable, "[Figma, APK/AAB, installer, API docs]")}</label>

<h3>D. Tech (if already agreed)</h3>
<p>${ph(body.tech, "HTML/CSS/JS, PHP, React, Flutter, Firebase, MySQL — or Developer chooses reasonable stack.")}</p>

<h3>E. Milestones and fees</h3>
<table class="t"><tr><th>Milestone</th><th>What’s due</th><th>Date</th><th>Amount (PHP)</th></tr>
<tr><td>1. Deposit / kickoff</td><td>Agreement signed, requirements locked</td><td class="ed">${esc(body.effectiveDate || "")}</td><td class="ed">${esc(body.feeDeposit || "")}</td></tr>
<tr><td>2. Prototype / design approval</td><td class="ed"></td><td class="ed"></td><td class="ed">${esc(body.feeMid || "")}</td></tr>
<tr><td>3. Feature-complete staging</td><td class="ed"></td><td class="ed"></td><td class="ed">${esc(body.feeStage || "")}</td></tr>
<tr><td>4. Final acceptance + handover</td><td class="ed"></td><td class="ed">${esc(body.handoverDate || "")}</td><td class="ed">${esc(body.feeFinal || "")}</td></tr>
<tr><td><strong>Total</strong></td><td></td><td></td><td class="ed">${esc(body.feeTotal || "")}</td></tr></table>
<p><strong>Revision rounds included:</strong> ${ph(body.revisions, "[2]")} &nbsp;·&nbsp; <strong>Extra work rate:</strong> PHP ${ph(body.hourlyRate, "[____]")} / hour</p>

<h3>F. Hosting &amp; accounts</h3>
<p><strong>Client provides:</strong> ${ph(body.clientProvides, "[domain, hosting, Play Console, Apple Developer, Firebase, payment gateway]")}<br><strong>Developer provides:</strong> ${ph(body.devProvides, "[local/dev environment only, unless listed]")}</p>

<h3>G. Portfolio</h3>
<label class="cb"><input type="checkbox"${box(body.portfolio !== "confidential")}>Developer may show this project on elopre.dev / GitHub</label>
<label class="cb"><input type="checkbox"${box(body.portfolio === "confidential")}>Confidential — no public case study</label>
</section>
</div>
</article>
<script>
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const phs=$$(".ph"),cnt=$("#cnt");
function upd(){let n=0;phs.forEach(p=>{const t=p.textContent.trim(),f=t!==""&&t!==p.dataset.o;p.classList.toggle("fill",f);if(f)n++});if(cnt)cnt.textContent=n+" / "+phs.length+" fields filled"}
phs.forEach(p=>{
  if(!p.dataset.o)p.dataset.o=p.textContent;p.contentEditable="true";p.spellcheck=false;
  p.addEventListener("focus",()=>{if(!p.classList.contains("fill")){const r=document.createRange();r.selectNodeContents(p);const s=getSelection();s.removeAllRanges();s.addRange(r)}});
  p.addEventListener("input",upd);
  p.addEventListener("blur",()=>{if(!p.textContent.trim()){p.textContent=p.dataset.o;upd()}});
  p.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();p.blur()}});
  p.addEventListener("paste",e=>{e.preventDefault();document.execCommand("insertText",false,(e.clipboardData.getData("text")||"").replace(/\\s+/g," "))});
});
$$(".ed").forEach(e=>{e.contentEditable="true";e.spellcheck=false});
$("#print").onclick=()=>{document.activeElement&&document.activeElement.blur();try{window.print()}catch(e){}};
upd();
</script>
</body>
</html>`;
}

module.exports = { renderAgreementHtml };
