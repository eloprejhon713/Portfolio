const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const PAGE_H = 792;
const CELL_BG = rgb(0.969, 0.976, 0.988);
const INK = rgb(0.06, 0.09, 0.16);
const CELLS = {
  project: { x: 41.8, top: 212.8, w: 262, h: 16.6 },
  services: { x: 308.1, top: 212.8, w: 262, h: 16.6 },
  scope: { x: 41.8, top: 247.8, w: 262, h: 16.6 },
  fees: { x: 308.1, top: 247.8, w: 262, h: 16.6 },
  revisions: { x: 41.8, top: 282.8, w: 262, h: 16.6 },
  privacy: { x: 308.1, top: 282.8, w: 262, h: 16.6 },
};

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

function prettyDate(value) {
  const text = safe(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return text;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${Number(match[3])} ${months[Number(match[2]) - 1]} ${match[1]}`;
}

function money(value) {
  const text = safe(value);
  if (!text) return "";
  const number = Number(text);
  return Number.isFinite(number) ? Math.round(number).toLocaleString("en-US") : text;
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

function cover(page, x, y, width, height, color = rgb(1, 1, 1)) {
  page.drawRectangle({ x, y, width, height, color });
}

function write(page, font, text, x, y, size = 8) {
  if (!text) return;
  page.drawText(text, { x, y, size, font, color: INK });
}

function fitLine(font, text, maxWidth, size = 7.2) {
  let value = String(text || "").replace(/\s+/g, " ").trim();
  let used = size;
  while (used > 5.4 && font.widthOfTextAtSize(value, used) > maxWidth) used -= 0.4;
  while (value.length > 8 && font.widthOfTextAtSize(`${value}…`, used) > maxWidth) {
    value = value.slice(0, -1);
  }
  return { text: font.widthOfTextAtSize(value, used) > maxWidth ? `${value}…` : value, size: used };
}

function writeCell(page, font, key, text) {
  const cell = CELLS[key];
  const y = PAGE_H - cell.top - cell.h;
  cover(page, cell.x, y + 0.4, cell.w, cell.h - 0.8, CELL_BG);
  const fitted = fitLine(font, text, cell.w - 10);
  write(page, font, fitted.text, cell.x + 5, y + 5.2, fitted.size);
}

function pythonCandidates() {
  return process.platform === "win32" ? ["python", "py", "python3"] : ["python3", "python"];
}

function spawnPython(cmd, args, body) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    const chunks = [];
    const err = [];
    child.stdout.on("data", (part) => chunks.push(part));
    child.stderr.on("data", (part) => err.push(part));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 && chunks.length) return resolve(Buffer.concat(chunks));
      reject(new Error((Buffer.concat(err).toString("utf8") || `python exit ${code}`).trim()));
    });
    child.stdin.write(JSON.stringify(body));
    child.stdin.end();
  });
}

async function fillWithPython(body, template) {
  const script = path.join(__dirname, "..", "scripts", "fill_agreement.py");
  let lastError;
  for (const cmd of pythonCandidates()) {
    try {
      return await spawnPython(cmd, [script, template], body);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Python fill failed");
}

async function fillWithPdfLib(body, file) {
  const doc = await PDFDocument.load(fs.readFileSync(file));
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [page1, page2] = doc.getPages();

  const client = safe(body.clientName) || "[Client's Full Legal Name / Company]";
  const address = safe(body.clientAddress) || "[Address]";
  const email = safe(body.clientEmail) || "[Email]";
  const rep = safe([body.clientRep, body.clientTitle].filter(Boolean).join(", ")) || "[Name and Title]";
  const start = prettyDate(body.effectiveDate) || "[Effective Date]";
  const handover = prettyDate(body.handoverDate) || "[date]";
  const project = safe(body.projectName) || "[Project name]";
  const platforms = safe(body.platforms) || "[Platforms]";
  const amount = money(body.feeTotal) || "[Amount]";
  const revisions = safe(body.revisions) || "2";
  const hourly = money(body.hourlyRate) || "[rate]";
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
    : "May show on elopre.dev";

  cover(page1, 38, 622, 536, 55);
  const intro = `This Software Development Services Agreement ("Agreement") is entered into on ${start} by and between Jhon Elopre, doing business as elopre.dev ("Developer"; email: eloprepotchy@gmail.com) and ${client} ("Client"; address: ${address}; email: ${email}; representative, if applicable: ${rep}). The Developer and Client are collectively referred to as the "Parties."`;
  wrap(font, intro, 9, 532).forEach((line, i) => {
    write(page1, font, line, 40, 668 - i * 12, 9);
  });

  writeCell(page1, font, "project", `${project}  |  ${start} - ${handover}`);
  writeCell(page1, font, "services", `${services}  ·  ${platforms}`);
  writeCell(page1, font, "scope", [features, delivered, out ? `Out: ${out}` : ""].filter(Boolean).join("  ·  "));
  writeCell(page1, font, "fees", `Total PHP ${amount}${body.feeDeposit ? `  ·  Deposit PHP ${money(body.feeDeposit)}` : "  ·  50% on signing"}`);
  writeCell(page1, font, "revisions", `${revisions} included rounds  ·  Extra PHP ${hourly} / hour`);
  writeCell(page1, font, "privacy", `${privacy}  ·  ${venue}, Philippines`);

  cover(page1, 158, 288, 72, 12);
  write(page1, bold, amount, 160, 292, 9);

  cover(page2, 296, 229, 92, 12);
  write(page2, font, venue, 298, 233, 9);

  cover(page2, 308, 146, 230, 12);
  write(page2, bold, client.slice(0, 42), 310, 150, 9);

  return Buffer.from(await doc.save());
}

async function fillAgreementPdf(body) {
  const file = templatePath();
  if (!file) throw new Error("Agreement.pdf template is missing");
  try {
    return await fillWithPython(body, file);
  } catch (error) {
    console.error("Python agreement fill failed, using pdf-lib:", error.message);
    return fillWithPdfLib(body, file);
  }
}

module.exports = { fillAgreementPdf };
