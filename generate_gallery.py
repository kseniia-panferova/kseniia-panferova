from pathlib import Path
import json

ROOT = Path(__file__).parent

DRAWINGS_DIR = ROOT / "assets" / "drawings"
PHOTOGRAPHY_DIR = ROOT / "assets" / "photography"

DRAWINGS_JS = ROOT / "drawings.js"
PHOTOGRAPHY_JS = ROOT / "photography.js"


def build_items(folder: Path):
    files = sorted(
        [p.name for p in folder.iterdir() if p.is_file() and p.suffix.lower() in [".webp", ".jpg", ".jpeg", ".png"]]
    )
    return [{"file": name} for name in files]


def write_js(variable_name: str, items: list, output_file: Path):
    content = f"const {variable_name} = " + json.dumps(items, ensure_ascii=False, indent=2) + ";\n"
    output_file.write_text(content, encoding="utf-8")


def main():
    drawings = build_items(DRAWINGS_DIR)
    photography = build_items(PHOTOGRAPHY_DIR)

    write_js("drawings", drawings, DRAWINGS_JS)
    write_js("photography", photography, PHOTOGRAPHY_JS)

    print("Updated drawings.js and photography.js")


if __name__ == "__main__":
    main()