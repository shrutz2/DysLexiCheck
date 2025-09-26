import sys
import os

print("Testing Dyslexia App Dependencies...")
print("=" * 50)

# Test basic imports
try:
    import streamlit as st
    print("[OK] Streamlit imported successfully")
except ImportError as e:
    print(f"[ERROR] Streamlit import failed: {e}")

try:
    from PIL import Image
    print("[OK] PIL imported successfully")
except ImportError as e:
    print(f"[ERROR] PIL import failed: {e}")

try:
    import pandas as pd
    print("[OK] Pandas imported successfully")
except ImportError as e:
    print(f"[ERROR] Pandas import failed: {e}")

try:
    from textblob import TextBlob
    print("[OK] TextBlob imported successfully")
except ImportError as e:
    print(f"[ERROR] TextBlob import failed: {e}")

try:
    import language_tool_python
    print("[OK] LanguageTool imported successfully")
except ImportError as e:
    print(f"[ERROR] LanguageTool import failed: {e}")

try:
    import speech_recognition as sr
    print("[OK] SpeechRecognition imported successfully")
except ImportError as e:
    print(f"[ERROR] SpeechRecognition import failed: {e}")

try:
    import pyttsx3
    print("[OK] pyttsx3 imported successfully")
except ImportError as e:
    print(f"[ERROR] pyttsx3 import failed: {e}")

try:
    import eng_to_ipa as ipa
    print("[OK] eng_to_ipa imported successfully")
except ImportError as e:
    print(f"[ERROR] eng_to_ipa import failed: {e}")

try:
    from azure.cognitiveservices.vision.computervision import ComputerVisionClient
    print("[OK] Azure Computer Vision imported successfully")
except ImportError as e:
    print(f"[ERROR] Azure Computer Vision import failed: {e}")

try:
    from abydos.phonetic import Soundex, Metaphone, Caverphone, NYSIIS
    print("[OK] Abydos phonetic imported successfully")
except ImportError as e:
    print(f"[ERROR] Abydos phonetic import failed: {e}")

print("\n" + "=" * 50)
print("Testing File Paths...")

# Test file paths
files_to_check = [
    "images/img1.jpg",
    "data/intermediate_voc.csv", 
    "data/elementary_voc.csv",
    "images/percentage_of_corrections.jpg",
    "images/spelling_accuracy.jpg",
    "images/percentage_of_phonetic_accuraccy.jpg"
]

for file_path in files_to_check:
    if os.path.exists(file_path):
        print(f"[OK] {file_path} exists")
    else:
        print(f"[ERROR] {file_path} not found")

print("\n" + "=" * 50)
print("Test completed!")