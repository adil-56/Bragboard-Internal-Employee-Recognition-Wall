import sys
import fitz

def extract_text(pdf_path, out_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
    except Exception as e:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"Error: {e}")

if __name__ == "__main__":
    extract_text(sys.argv[1], sys.argv[2])
