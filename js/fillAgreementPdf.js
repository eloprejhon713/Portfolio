const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

function templatePath() {
  return [
    path.join(__dirname, "..", "templates", "Agreement.pdf"),
    path.join(__dirname, "..", "assets", "documents", "Agreement.pdf"),
    path.join(__dirname, "..", "contracts", "Agreement.pdf"),
  ].find((file) => fs.existsSync(file));
}

function safe(value) {
  return String(value || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .trim();
}

function asList(body, key) {
  const value = body[key];
  return Array.isArray(value) ? value : value ? [value] : [];
}

function wrap(font, text, size, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(next, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function cover(page, x, y, width, height) {
  page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1) });
}

function write(page, font, text, x, y, size = 8) {
  if (!text) return;
  page.drawText(text, { x, y, size, font, color: rgb(0.06, 0.09, 0.16) });
}

function writeBox(page, font, lines, x, y, size = 7.4) {
  lines.filter(Boolean).forEach((line, i) => {
    write(page, font, line, x, y - i * 9, size);
  });
}

async function fillAgreementPdf(body) {
  const file = templatePath();
  if (!file) throw new Error("Agreement.pdf template is missing");

  const doc = await PDFDocument.load(fs.readFileSync(file));
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [page1, page2] = doc.getPages();

  const client = safe(body.clientName) || "[Client's Full Legal Name / Company]";
  const address = safe(body.clientAddress) || "[Address]";
  const email = safe(body.clientEmail) || "[Email]";
  const rep = safe([body.clientRep, body.clientTitle].filter(Boolean).join(", ")) || "[Name and Title]";
  const date = safe(body.effectiveDate) || "[Effective Date]";
  const handover = safe(body.handoverDate) || "[date]";
  const project = safe(body.projectName) || "[Project name]";
  const platforms = safe(body.platforms) || "[Platforms]";
  const amount = safe(body.feeTotal) || "[Amount]";
  const revisions = safe(body.revisions) || "2";
  const hourly = safe(body.hourlyRate) || "[rate]";
  const venue = safe(body.venue) || "[Agreed City]";
  const services = asList(body, "services").join(", ") || "[Services]";
  const features = String(body.features || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("; ") || "[Scope]";
  const deliverables = asList(body, "deliverables");
  const delivered = [
    deliverables.includes("source") && "Source code",
    deliverables.includes("deploy") && "Deployment",
    deliverables.includes("readme") && "README",
  ].filter(Boolean).join(", ") || "[Deliverables]";
  const out = safe(body.outOfScope);
  const privacy = body.portfolio === "confidential"
    ? "Confidential - no public case study"
    : "May show on elopre.dev / GitHub";

  cover(page1, 38, 618, 536, 54);
  const intro = `This Software Development Services Agreement ("Agreement") is entered into on ${date} by and between Jhon Elopre, doing business as elopre.dev ("Developer"; email: eloprepotchy@gmail.com) and ${client} ("Client"; address: ${address}; email: ${email}; representative, if applicable: ${rep}). The Developer and Client are collectively referred to as the "Parties."`;
  wrap(font, intro, 9, 532).forEach((line, i) => {
    write(page1, font, line, 40, 664 - i * 12, 9);
  });

  writeBox(page1, font, [project, `Start ${date}`, `Handover ${handover}`], 48, 568);
  writeBox(page1, font, [services, platforms], 315, 568);
  writeBox(page1, font, [features, delivered, out ? `Out of scope: ${out}` : ""].filter(Boolean), 48, 533);
  writeBox(page1, font, [
    `Total PHP ${amount}`,
    body.feeDeposit ? `Deposit PHP ${safe(body.feeDeposit)}` : "50% on signing",
    body.feeFinal ? `Final PHP ${safe(body.feeFinal)}` : "25% before handover",
  ], 315, 533);
  writeBox(page1, font, [`${revisions} included rounds`, `Extra work PHP ${hourly} / hour`], 48, 498);
  writeBox(page1, font, [privacy, `Venue: ${venue}, Philippines`], 315, 498);

  cover(page1, 158, 288, 72, 12);
  write(page1, bold, amount, 160, 292, 9);

  cover(page2, 296, 229, 92, 12);
  write(page2, font, venue, 298, 233, 9);

  cover(page2, 308, 146, 230, 12);
  write(page2, bold, client.slice(0, 42), 310, 150, 9);

  return Buffer.from(await doc.save());
}

module.exports = { fillAgreementPdf };
