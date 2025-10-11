import os
import urllib.request
import subprocess
import sys

print("Installing Tesseract OCR...")

# Download Tesseract installer
url = "https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.3.20231005.exe"
installer_path = "tesseract_installer.exe"

print("Downloading Tesseract installer...")
try:
    urllib.request.urlretrieve(url, installer_path)
    print("Download complete!")
except Exception as e:
    print(f"Download failed: {e}")
    print("Please download manually from: https://github.com/UB-Mannheim/tesseract/wiki")
    sys.exit(1)

print("\nRunning installer...")
print("Please follow the installation wizard:")
print("   1. Click 'Next'")
print("   2. Accept license")
print("   3. Install to default location: C:\\Program Files\\Tesseract-OCR")
print("   4. Click 'Install'")
print("   5. Click 'Finish'\n")

try:
    # Run installer
    subprocess.run([installer_path], check=True)
    print("\nInstallation complete!")
    
    # Clean up
    os.remove(installer_path)
    print("Cleaned up installer file")
    
    print("\nTesseract OCR installed successfully!")
    print("Location: C:\\Program Files\\Tesseract-OCR\\tesseract.exe")
    print("\nNext steps:")
    print("   1. Run: cd backend")
    print("   2. Run: python backend.py")
    
except Exception as e:
    print(f"Installation error: {e}")
    print("Please run the installer manually: tesseract_installer.exe")
