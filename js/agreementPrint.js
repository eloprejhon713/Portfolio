/**
 * 2-page print / PDF sheet matching assets/documents/Agreement.pdf.
 * Served only from the private contract studio.
 */

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

function text(value, fallback) {
  const shown = String(value || "").trim();
  return shown ? esc(shown) : `<span class="blank">${esc(fallback)}</span>`;
}

function lines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderAgreementHtml(body) {
  const services = asList(body, "services");
  const deliverables = asList(body, "deliverables");
  const features = lines(body.features);
  const serviceLine = services.length ? services.join(", ") : "—";
  const featureLine = features.length ? features.join("; ") : "—";
  const deliverableNames = [];
  if (deliverables.includes("source")) deliverableNames.push("Source code");
  if (deliverables.includes("deploy")) deliverableNames.push("Deployment");
  if (deliverables.includes("readme")) deliverableNames.push("README");
  if (deliverables.includes("other")) deliverableNames.push(body.otherDeliverable || "Other");
  const deliverableLine = deliverableNames.length ? deliverableNames.join(", ") : "—";
  const privacy = body.portfolio === "confidential" ? "Confidential — no public case study" : "May show on elopre.dev / GitHub";
  const paymentBits = [
    body.feeDeposit ? `Deposit PHP ${body.feeDeposit}` : "50% on signing",
    body.feeMid || body.feeStage ? `Prototype/staging PHP ${body.feeMid || body.feeStage}` : "25% at prototype/staging",
    body.feeFinal ? `Final PHP ${body.feeFinal}` : "25% before handover",
  ].join(" · ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Software Development Services Agreement</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="/assets/images/brand/icon.png">
<style>
:root{--white:#fff;--off-white:#f4f6fb;--bg:#eef1f8;--navy:#0d1b3e;--navy-mid:#172554;--navy-light:#1e3a8a;--blue:#2563eb;--blue-pale:#dbeafe;--text:#0f172a;--text-muted:#64748b;--border:#e2e8f0;--border-dark:#cbd5e1;--surface:#f1f5f9;--font:'Outfit',sans-serif}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0}
body{background:var(--bg);color:var(--text);font-family:var(--font);-webkit-font-smoothing:antialiased}
.bar{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 24px;background:rgba(255,255,255,.88);border-bottom:1px solid var(--border)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;border:1px solid var(--border-dark);background:#fff;color:var(--navy);font:600 .88rem var(--font);cursor:pointer;text-decoration:none}
.btn.dark{background:var(--navy);border-color:var(--navy);color:#fff}
.sheet{max-width:820px;margin:22px auto 48px;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 24px 60px -24px rgba(13,27,62,.28);padding:28px 36px 34px}
.kicker{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);padding-bottom:10px;border-bottom:1px solid var(--border)}
.kicker img{width:22px;height:22px;object-fit:contain}
h1{margin:16px 0 4px;font-size:1.55rem;line-height:1.15;letter-spacing:-.03em;color:var(--navy)}
.sub{margin:0 0 16px;font-size:.82rem;color:var(--text-muted)}
.lead{font-size:.95rem;line-height:1.65;margin:0 0 16px}
.blank{color:var(--navy-light);background:var(--blue-pale);padding:0 5px;border-radius:5px;font-weight:600}
.box-title{margin:18px 0 8px;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--blue);font-weight:700}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{border:1px solid var(--border);background:var(--off-white);border-radius:12px;padding:12px 14px;min-height:92px}
.card h3{margin:0 0 6px;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)}
.card p{margin:0;font-size:.88rem;line-height:1.5}
.sec{margin-top:16px}
.sec h2{margin:0 0 6px;font-size:.92rem;color:var(--navy)}
.sec p{margin:0;font-size:.88rem;line-height:1.62}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:22px}
.sign .card{min-height:120px;background:#fff}
.line{margin-top:28px;border-top:1px solid var(--border-dark);padding-top:8px;font-size:.82rem;color:var(--text-muted)}
@media (max-width:640px){.sheet{margin:12px 10px 36px;padding:18px 16px}.grid,.sign{grid-template-columns:1fr}.bar{padding:10px 14px}}
@media print{body{background:#fff}.bar{display:none}.sheet{margin:0;max-width:none;border:0;box-shadow:none;border-radius:0;padding:0}.sec{break-inside:avoid}}
@page{size:A4;margin:14mm 13mm}
</style>
</head>
<body>
<div class="bar">
  <a class="btn" href="/studio">Back to form</a>
  <button class="btn dark" id="print" type="button">Print / PDF</button>
</div>
<article class="sheet">
  <div class="kicker"><span><img src="/assets/images/brand/logonobg.png" alt=""> elopre.dev</span><span>Software Development Services Agreement</span></div>
  <h1>Software Development Services Agreement</h1>
  <p class="sub">elopre.dev · Independent Software Development Services</p>
  <p class="lead">This Software Development Services Agreement (“Agreement”) is entered into on ${text(body.effectiveDate, "[Effective Date]")} by and between <strong>Jhon Elopre</strong>, doing business as <strong>elopre.dev</strong> (“Developer”; email: eloprepotchy@gmail.com) and ${text(body.clientName, "[Client’s Full Legal Name / Company]")} (“Client”; address: ${text(body.clientAddress, "[Address]")}; email: ${text(body.clientEmail, "[Email]")}; representative, if applicable: ${text([body.clientRep, body.clientTitle].filter(Boolean).join(", "), "[Name and Title]")}). The Developer and Client are collectively referred to as the “Parties.”</p>

  <div class="box-title">Project details — to be completed before signing</div>
  <div class="grid">
    <div class="card"><h3>Project &amp; dates</h3><p><strong>${text(body.projectName, "[Project name]")}</strong><br>Start ${text(body.effectiveDate, "[date]")} · Handover ${text(body.handoverDate, "[date]")}</p></div>
    <div class="card"><h3>Services &amp; platforms</h3><p>${esc(serviceLine)}<br>${text(body.platforms, "[Web / Android / iOS / Windows / macOS / Linux]")}</p></div>
    <div class="card"><h3>Scope &amp; deliverables</h3><p>${esc(featureLine)}<br>${esc(deliverableLine)}${body.outOfScope ? `<br><span class="muted">Out of scope: ${esc(body.outOfScope)}</span>` : ""}</p></div>
    <div class="card"><h3>Fees &amp; payment</h3><p>Total <strong>PHP ${text(body.feeTotal, "[Amount]")}</strong><br>${esc(paymentBits)}</p></div>
    <div class="card"><h3>Revisions &amp; additional work</h3><p>${text(body.revisions, "2")} included rounds<br>Extra work PHP ${text(body.hourlyRate, "[rate]")} / hour</p></div>
    <div class="card"><h3>Privacy &amp; dispute venue</h3><p>${esc(privacy)}<br>Venue: ${text(body.venue, "[Agreed City]")}, Philippines</p></div>
  </div>

  <section class="sec"><h2>1. Services and project scope</h2><p>The Developer shall design, develop, test, and deliver the software described in the Project Details above (“Project”). Only the features, platforms, and deliverables expressly listed are included in the project fee. Any additional feature, integration, platform, or material change requires written approval of the additional fee and revised timeline.</p></section>
  <section class="sec"><h2>2. Responsibilities and timeline</h2><p>The Developer shall perform the agreed services with reasonable professional care and provide progress updates at agreed milestones. The Client shall provide accurate requirements, content, access, feedback, approvals, and payments on time. Target dates are estimates and may be extended due to Client delays, approved changes, third-party delays, or events beyond reasonable control. The Developer may pause affected work after written notice if required information or payment is missing.</p></section>
  <section class="sec"><h2>3. Fees and payment</h2><p>The total project fee is PHP ${text(body.feeTotal, "[Amount]")}, payable as specified above. Unless otherwise agreed in writing, payment is 50% upon signing, 25% at the agreed prototype/staging milestone, and 25% before final handover. Work begins after the initial payment clears. If payment is more than seven (7) calendar days overdue, the Developer may pause work after written notice and charge interest of 2% per month or the maximum lawful rate, whichever is lower. The Client shall pay hosting, domains, licenses, paid APIs, app-store fees, and other third-party costs unless expressly included.</p></section>
  <section class="sec"><h2>4. Changes and revisions</h2><p>The included revision rounds and rate for additional work shall be recorded above. New features or changes to approved requirements are additional work. The Developer shall begin additional work only after the Client approves the added fee and timeline in writing, including by email.</p></section>
  <section class="sec"><h2>5. Review and acceptance</h2><p>The Client shall have seven (7) calendar days after delivery to report in writing any reproducible issue that materially fails to meet the agreed requirements. A deliverable is accepted upon written approval, production use (excluding testing), or no defect report within the review period after notice that review has started. Acceptance does not remove warranty rights.</p></section>
  <section class="sec"><h2>6. Intellectual property</h2><p>Upon full payment, the Developer assigns to the Client the transferable rights in custom work created specifically for the Project. Until full payment, that work remains with the Developer, subject to applicable law. The Developer retains ownership of pre-existing code, reusable tools, templates, libraries, and general know-how, and grants the Client a license to use Developer-owned components included in the delivered software as needed to operate it. Third-party and open-source components remain subject to their respective licenses.</p></section>
  <section class="sec"><h2>7. Limited warranty and support</h2><p>For thirty (30) calendar days after final acceptance, the Developer shall correct reproducible bugs that materially prevent the software from meeting the agreed requirements, at no additional development fee. The warranty excludes new features, misuse, unauthorized modifications, third-party outages or changes, and issues caused by systems outside the Developer’s control. Maintenance and support after the warranty period require a separate agreement.</p></section>
  <section class="sec"><h2>8. Confidentiality and data protection</h2><p>Each Party shall protect the other Party’s non-public business, technical, and personal information and use it only for the Project. This obligation continues for two (2) years after termination; trade secrets and credentials remain protected as required by law. Both Parties shall comply with applicable Philippine data-protection laws. Unless otherwise agreed, the Client is responsible for production data, backups, account security, and business compliance.</p></section>
  <section class="sec"><h2>9. Liability</h2><p>To the maximum extent permitted by law, the Developer’s total liability under this Agreement shall not exceed the project fees actually paid by the Client. Neither Party shall be liable for indirect or consequential losses, except where liability cannot lawfully be limited, including fraud or willful misconduct.</p></section>
  <section class="sec"><h2>10. Termination and general terms</h2><p>Either Party may terminate for a material breach not remedied within fourteen (14) calendar days after written notice. The Client may cancel by written notice and shall pay for completed work, reasonable work in progress, and approved non-cancellable costs; amounts already paid shall be credited against sums due. The Developer may suspend or terminate if payment is more than fourteen (14) days overdue or essential Client materials remain unavailable after written reminder. Fully paid deliverables shall be handed over; unpaid work need not be transferred. The Parties are independent contractors. This Agreement and the Project Details above are the entire agreement; changes must be approved in writing. Philippine law governs. Disputes are subject to applicable jurisdiction and venue rules in ${text(body.venue, "[Agreed City]")}, Philippines. Electronic signatures may be used where permitted by law.</p></section>

  <p class="lead" style="margin-top:20px">By signing below, the Parties confirm they have read, understood, and accepted this Agreement and the completed Project Details.</p>
  <div class="sign">
    <div class="card">
      <h3>Developer</h3>
      <p><strong>Jhon Elopre / elopre.dev</strong></p>
      <div class="line">Signature ______________________ &nbsp; Date ____________</div>
    </div>
    <div class="card">
      <h3>Client</h3>
      <p><strong>${text(body.clientName, "[Client name / company]")}</strong></p>
      <div class="line">Signature ______________________ &nbsp; Date ____________</div>
    </div>
  </div>
</article>
<script>
document.getElementById("print").onclick=function(){document.activeElement&&document.activeElement.blur();window.print();};
</script>
</body>
</html>`;
}

module.exports = { renderAgreementHtml };
