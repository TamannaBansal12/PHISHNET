from PIL import Image
import pytesseract


# =========================================================
# PHISHNET OCR / VLM ARCHITECTURE
# =========================================================

OCR_IMAGE_MODEL_LEVELS = {

    "lightweight": {
        "name": "Tesseract OCR + Rule Engine",
        "purpose": "Fast OCR extraction and basic phishing heuristics",
        "green_it": "Lowest compute usage",
        "status": "ACTIVE"
    },

    "balanced": {
        "name": "EasyOCR + Layout Analyzer",
        "purpose": "Structured document and visual layout analysis",
        "green_it": "Balanced accuracy-energy routing",
        "status": "PLANNED"
    },

    "heavy": {
        "name": "Qwen2-VL / LLaVA / GPT-4o Vision",
        "purpose": "Advanced visual reasoning, watermark analysis, and multimodal fraud detection",
        "green_it": "High compute justified for suspicious visual evidence",
        "status": "PLANNED"
    }
}


# =========================================================
# OCR EXTRACTION PIPELINE
# =========================================================

def extract_text_from_email_image(image_path):

    print("=================================================")
    print("PHISHNET OCR / VLM INTELLIGENCE ENGINE")
    print("Green-Aware Multi-Model Architecture")
    print("=================================================")

    print("\n🖼️ Available OCR / Vision Models:")

    for level, info in OCR_IMAGE_MODEL_LEVELS.items():

        print(f"\n[{level.upper()}]")

        print(f"Model: {info['name']}")

        print(f"Purpose: {info['purpose']}")

        print(f"Green IT: {info['green_it']}")

        print(f"Status: {info['status']}")

    print("\nRunning lightweight OCR extraction route...")

    image = Image.open(image_path)

    text = pytesseract.image_to_string(image)

    extracted_text = text.strip()

    print("\n=================================================")
    print("✅ OCR EXTRACTION COMPLETE")
    print("=================================================")

    print(f"Characters Extracted: {len(extracted_text)}")

    print("OCR Route: Tesseract OCR + Rule Engine")

    print("Green IT Status: Lightweight route selected")

    print("=================================================")

    return extracted_text