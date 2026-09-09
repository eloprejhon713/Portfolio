"""Build short 15s MP4 demos for ACTS portals from title + login screenshots."""
from pathlib import Path
import numpy as np
import imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent
W, H = 1920, 1080
FPS = 30

SCREENSHOTS = Path(r"c:\Users\Thinkpad\AppData\Local\Temp\cursor\screenshots")
ASSETS = Path(r"C:\Users\Thinkpad\.cursor\projects\c-laragon-www-Portfolio\assets")

DEMOS = [
    {
        "out": OUT / "acts-student.mp4",
        "title": ASSETS / "acts-student-title.png",
        "login": SCREENSHOTS / "acts-student-login.png",
        "feature": "Academic records · Enrollment · Student services",
        "url": "student.actscolleges.edu.ph",
    },
    {
        "out": OUT / "acts-parent.mp4",
        "title": ASSETS / "acts-parent-title.png",
        "login": SCREENSHOTS / "acts-parent-login.png",
        "feature": "Child records · Gate scans · Enrollment updates",
        "url": "parent.actscolleges.edu.ph",
    },
    {
        "out": OUT / "acts-employee.mp4",
        "title": ASSETS / "acts-employee-title.png",
        "login": SCREENSHOTS / "acts-employee-login.png",
        "feature": "Operations · Faculty tools · DTR workflows",
        "url": "employee.actscolleges.edu.ph",
    },
]

END = ASSETS / "acts-end-card.png"


def fit_cover(img: Image.Image, size=(W, H)) -> Image.Image:
    tw, th = size
    src = img.convert("RGB")
    scale = max(tw / src.width, th / src.height)
    nw, nh = int(src.width * scale), int(src.height * scale)
    src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return src.crop((left, top, left + tw, top + th))


def fit_contain_on_navy(img: Image.Image, size=(W, H), pad=48) -> Image.Image:
    canvas = Image.new("RGB", size, (11, 27, 62))
    tw, th = size[0] - pad * 2, size[1] - pad * 2
    src = img.convert("RGB")
    scale = min(tw / src.width, th / src.height)
    nw, nh = max(1, int(src.width * scale)), max(1, int(src.height * scale))
    src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    # soft card shadow
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    x0 = (size[0] - nw) // 2
    y0 = (size[1] - nh) // 2
    sd.rounded_rectangle([x0 - 8, y0 - 6, x0 + nw + 8, y0 + nh + 14], radius=28, fill=(0, 0, 0, 70))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")
    canvas.paste(src, (x0, y0))
    return canvas


def feature_card(text: str, url: str) -> Image.Image:
    canvas = Image.new("RGB", (W, H), (11, 27, 62))
    draw = ImageDraw.Draw(canvas)
    # decorative circles
    draw.ellipse([-200, -200, 500, 500], fill=(30, 58, 138))
    draw.ellipse([1400, 600, 2100, 1300], fill=(37, 99, 235))
    try:
        font_lg = ImageFont.truetype("segoeui.ttf", 64)
        font_sm = ImageFont.truetype("segoeui.ttf", 36)
    except OSError:
        font_lg = ImageFont.load_default()
        font_sm = font_lg
    # center text
    bbox = draw.textbbox((0, 0), text, font=font_lg)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, H / 2 - 60), text, fill=(255, 255, 255), font=font_lg)
    bbox2 = draw.textbbox((0, 0), url, font=font_sm)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((W - tw2) / 2, H / 2 + 40), url, fill=(147, 197, 253), font=font_sm)
    return canvas


def frames_for(seconds: float, img: Image.Image):
    n = int(seconds * FPS)
    rgb = fit_cover(img) if img.size != (W, H) else img.convert("RGB")
    # ensure exact size
    if rgb.size != (W, H):
        rgb = rgb.resize((W, H), Image.Resampling.LANCZOS)
    arr = np.asarray(rgb)
    for _ in range(n):
        yield arr


def build_demo(spec: dict):
    title = Image.open(spec["title"])
    login = Image.open(spec["login"])
    end = Image.open(END) if END.exists() else feature_card("Faster · Clear · Live", "ACTS Colleges")

    seq = []
    # 0-3s title
    seq.append((fit_cover(title), 3.0))
    # 3-9s live login UI
    seq.append((fit_contain_on_navy(login), 6.0))
    # 9-12s feature line
    seq.append((feature_card(spec["feature"], spec["url"]), 3.0))
    # 12-15s end
    seq.append((fit_cover(end), 3.0))

    writer = imageio.get_writer(
        spec["out"],
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        macro_block_size=1,
    )
    try:
        for img, secs in seq:
            if img.size != (W, H):
                img = img.resize((W, H), Image.Resampling.LANCZOS)
            frame = np.asarray(img.convert("RGB"))
            for _ in range(int(secs * FPS)):
                writer.append_data(frame)
    finally:
        writer.close()
    print(f"Wrote {spec['out']} ({spec['out'].stat().st_size // 1024} KB)")


def main():
    for demo in DEMOS:
        for key in ("title", "login"):
            p = demo[key]
            if not p.exists():
                raise FileNotFoundError(p)
        build_demo(demo)
    print("Done.")


if __name__ == "__main__":
    main()
