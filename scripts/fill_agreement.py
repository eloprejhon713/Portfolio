"""Fill templates/Agreement.pdf. Reads JSON on stdin, writes PDF bytes to stdout."""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "templates" / "Agreement.pdf"
NAVY_CELL = (0.969, 0.976, 0.988)
INK = (0.06, 0.09, 0.16)

# White value rows only — do not cover the navy headers.
CELLS = {
    "project": pymupdf.Rect(39.8, 212.8, 305.9, 230.0),
    "services": pymupdf.Rect(306.1, 212.8, 572.3, 230.0),
    "scope": pymupdf.Rect(39.8, 247.8, 305.9, 265.0),
    "fees": pymupdf.Rect(306.1, 247.8, 572.3, 265.0),
    "revisions": pymupdf.Rect(39.8, 282.8, 305.9, 300.0),
    "privacy": pymupdf.Rect(306.1, 282.8, 572.3, 300.0),
}
INTRO = pymupdf.Rect(38.5, 115.0, 574.0, 169.5)


def as_list(body, key):
    value = body.get(key)
    if isinstance(value, list):
        return [str(item) for item in value if str(item).strip()]
    if value:
        return [str(value)]
    return []


def pretty_date(value, short=False):
    text = str(value or "").strip()
    try:
        parsed = date.fromisoformat(text)
        stamp = parsed.strftime("%d %b %Y" if short else "%d %B %Y")
        return stamp.lstrip("0")
    except ValueError:
        return text


def money(value):
    text = str(value or "").strip()
    if not text:
        return ""
    try:
        return f"{int(float(text)):,}"
    except ValueError:
        return text


def dash(value, fallback):
    text = str(value or "").strip()
    return text or fallback


def fill_cell(page, rect, text, size=7.2):
    page.draw_rect(rect, color=NAVY_CELL, fill=NAVY_CELL)
    box = pymupdf.Rect(rect.x0 + 5, rect.y0 + 1.4, rect.x1 - 4, rect.y1 - 1)
    value = " ".join(str(text or "").split())
    for font_size in (size, 6.6, 6.1, 5.6):
        leftover = page.insert_textbox(
            box,
            value,
            fontsize=font_size,
            fontname="helv",
            color=INK,
            align=pymupdf.TEXT_ALIGN_LEFT,
        )
        if leftover >= 0:
            return
        page.draw_rect(rect, color=NAVY_CELL, fill=NAVY_CELL)


def stamp_over(page, old, new, size=9):
    text = str(new or "").strip()
    if not text:
        return
    for rect in page.search_for(old):
        page.draw_rect(rect, color=(1, 1, 1), fill=(1, 1, 1))
        page.insert_text((rect.x0, rect.y1 - 2.2), text, fontsize=size, fontname="helv", color=INK)


def build_fields(body):
    services = ", ".join(as_list(body, "services")) or "[Services]"
    features = "; ".join(
        line.strip() for line in str(body.get("features") or "").splitlines() if line.strip()
    ) or "[Scope]"
    deliverables = as_list(body, "deliverables")
    delivered = ", ".join(
        name
        for flag, name in (
            ("source", "Source code"),
            ("deploy", "Deployment"),
            ("readme", "README"),
        )
        if flag in deliverables
    ) or "[Deliverables]"
    start = pretty_date(body.get("effectiveDate")) or "[Effective Date]"
    start_short = pretty_date(body.get("effectiveDate"), short=True) or "[Effective Date]"
    handover = pretty_date(body.get("handoverDate")) or "[date]"
    handover_short = pretty_date(body.get("handoverDate"), short=True) or "[date]"
    amount = money(body.get("feeTotal")) or "[Amount]"
    deposit = money(body.get("feeDeposit"))
    privacy = (
        "Confidential - no public case study"
        if body.get("portfolio") == "confidential"
        else "May show on elopre.dev"
    )
    venue = dash(body.get("venue"), "[Agreed City]")
    client = dash(body.get("clientName"), "[Client's Full Legal Name / Company]")
    address = dash(body.get("clientAddress"), "[Address]")
    email = dash(body.get("clientEmail"), "[Email]")
    rep = ", ".join(
        part for part in (str(body.get("clientRep") or "").strip(), str(body.get("clientTitle") or "").strip()) if part
    ) or "[Name and Title]"
    return {
        "client": client,
        "address": address,
        "email": email,
        "rep": rep,
        "start": start,
        "start_short": start_short,
        "handover": handover,
        "handover_short": handover_short,
        "project": dash(body.get("projectName"), "[Project name]"),
        "services": services,
        "platforms": dash(body.get("platforms"), "[Platforms]"),
        "features": features,
        "delivered": delivered,
        "out": str(body.get("outOfScope") or "").strip(),
        "amount": amount,
        "deposit": deposit,
        "revisions": dash(body.get("revisions"), "2"),
        "hourly": money(body.get("hourlyRate")) or "[rate]",
        "privacy": privacy,
        "venue": venue,
    }


def fill(body, template=TEMPLATE):
    fields = build_fields(body)
    doc = pymupdf.open(template)
    page1, page2 = doc[0], doc[1]

    page1.add_redact_annot(INTRO, fill=(1, 1, 1))
    page1.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE)
    intro = (
        f'This Software Development Services Agreement ("Agreement") is entered into on {fields["start"]} '
        f'by and between Jhon Elopre, doing business as elopre.dev ("Developer"; email: eloprepotchy@gmail.com) '
        f'and {fields["client"]} ("Client"; address: {fields["address"]}; email: {fields["email"]}; '
        f'representative, if applicable: {fields["rep"]}). The Developer and Client are collectively referred to as the "Parties."'
    )
    page1.insert_textbox(INTRO, intro, fontsize=9, fontname="helv", color=INK)

    fill_cell(page1, CELLS["project"], f'{fields["project"]}  |  {fields["start_short"]} - {fields["handover_short"]}')
    fill_cell(page1, CELLS["services"], f'{fields["services"]}  ·  {fields["platforms"]}')
    scope = fields["features"]
    if fields["delivered"]:
        scope = f'{scope}  ·  {fields["delivered"]}'
    if fields["out"]:
        scope = f'{scope}  ·  Out: {fields["out"]}'
    fill_cell(page1, CELLS["scope"], scope)
    fees = f'Total PHP {fields["amount"]}'
    if fields["deposit"]:
        fees += f'  ·  Deposit PHP {fields["deposit"]}'
    else:
        fees += "  ·  50% on signing"
    fill_cell(page1, CELLS["fees"], fees)
    fill_cell(
        page1,
        CELLS["revisions"],
        f'{fields["revisions"]} included rounds  ·  Extra PHP {fields["hourly"]} / hour',
    )
    fill_cell(page1, CELLS["privacy"], f'{fields["privacy"]}  ·  {fields["venue"]}, Philippines')

    stamp_over(page1, "[Amount]", fields["amount"], 9)
    stamp_over(page2, "[Agreed City]", fields["venue"], 9)
    stamp_over(page2, "[Client name / company]", fields["client"][:42], 9)

    return doc.tobytes()


def main():
    raw = sys.stdin.read()
    body = json.loads(raw or "{}")
    template = Path(sys.argv[1]) if len(sys.argv) > 1 else TEMPLATE
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    pdf = fill(body, template)
    if out:
        out.write_bytes(pdf)
    else:
        sys.stdout.buffer.write(pdf)


if __name__ == "__main__":
    main()
