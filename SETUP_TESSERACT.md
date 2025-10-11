# Tesseract OCR Setup (FREE Alternative to Azure)

## Windows Installation

### Step 1: Download Tesseract
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Download latest installer: `tesseract-ocr-w64-setup-5.3.x.exe`
3. Run installer and install to default location: `C:\Program Files\Tesseract-OCR`

### Step 2: Add to PATH
1. Open System Environment Variables
2. Edit "Path" variable
3. Add: `C:\Program Files\Tesseract-OCR`
4. Click OK

### Step 3: Install Python Package
```bash
pip install pytesseract
```

### Step 4: Verify Installation
```bash
tesseract --version
```

## Usage
- Upload handwriting image (JPG)
- Tesseract will extract text automatically
- No API keys needed!
- Completely FREE and offline

## Note
- Works best with clear, printed text
- Handwriting recognition accuracy: 70-85%
- For better accuracy with handwriting, use Azure (paid)
