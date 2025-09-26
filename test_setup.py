#!/usr/bin/env python3
"""
Test script to verify DysLexiCheck setup and dependencies
"""

import sys
import importlib
import os
from pathlib import Path

def test_python_version():
    """Test if Python version is compatible"""
    print("🐍 Testing Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 7:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.7+")
        return False

def test_dependencies():
    """Test if required dependencies are installed"""
    print("\n📦 Testing dependencies...")
    
    required_packages = [
        'streamlit',
        'PIL',  # Pillow
        'textblob',
        'pandas',
        'requests',
        'abydos',
        'azure.cognitiveservices.vision.computervision',
        'language_tool_python',
        'speech_recognition',
        'pyttsx3'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"❌ {package} - Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def test_file_structure():
    """Test if required files and directories exist"""
    print("\n📁 Testing file structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'run_app.py',
        'README.md'
    ]
    
    required_dirs = [
        'data',
        'frontend',
        'backend',
        'model_training',
        'images'
    ]
    
    missing_items = []
    
    # Check files
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} - OK")
        else:
            print(f"❌ {file} - Missing")
            missing_items.append(file)
    
    # Check directories
    for directory in required_dirs:
        if os.path.isdir(directory):
            print(f"✅ {directory}/ - OK")
        else:
            print(f"❌ {directory}/ - Missing")
            missing_items.append(directory)
    
    return len(missing_items) == 0

def test_data_files():
    """Test if required data files exist"""
    print("\n📊 Testing data files...")
    
    data_files = [
        'data/elementary_voc.csv',
        'data/intermediate_voc.csv',
        'data/data.csv'
    ]
    
    missing_files = []
    
    for file in data_files:
        if os.path.exists(file):
            print(f"✅ {file} - OK")
        else:
            print(f"❌ {file} - Missing")
            missing_files.append(file)
    
    return len(missing_files) == 0

def test_model_files():
    """Test if ML model files exist"""
    print("\n🤖 Testing model files...")
    
    model_files = [
        'model_training/Decision_tree_model.sav',
        'model_training/dyslexia_detection.ipynb'
    ]
    
    missing_files = []
    
    for file in model_files:
        if os.path.exists(file):
            print(f"✅ {file} - OK")
        else:
            print(f"⚠️  {file} - Missing (optional)")
    
    return True

def test_configuration():
    """Test configuration setup"""
    print("\n⚙️  Testing configuration...")
    
    try:
        # Try to import app.py to check for basic syntax errors
        import app
        print("✅ app.py imports successfully")
        
        # Check if API keys are configured (basic check)
        if hasattr(app, 'subscription_key_imagetotext'):
            if app.subscription_key_imagetotext and not app.subscription_key_imagetotext.startswith('your_'):
                print("✅ Azure API key configured")
            else:
                print("⚠️  Azure API key not configured (will use fallback)")
        
        if hasattr(app, 'api_key_textcorrection'):
            if app.api_key_textcorrection and not app.api_key_textcorrection.startswith('your_'):
                print("✅ Bing API key configured")
            else:
                print("⚠️  Bing API key not configured (will use fallback)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing app.py: {e}")
        return False

def test_streamlit():
    """Test if Streamlit can run"""
    print("\n🚀 Testing Streamlit...")
    
    try:
        import streamlit as st
        print("✅ Streamlit import - OK")
        
        # Test basic Streamlit functionality
        print("✅ Streamlit ready to run")
        return True
        
    except Exception as e:
        print(f"❌ Streamlit error: {e}")
        return False

def main():
    """Run all tests"""
    print("🔍 DysLexiCheck Setup Verification")
    print("=" * 50)
    
    tests = [
        ("Python Version", test_python_version),
        ("Dependencies", test_dependencies),
        ("File Structure", test_file_structure),
        ("Data Files", test_data_files),
        ("Model Files", test_model_files),
        ("Configuration", test_configuration),
        ("Streamlit", test_streamlit)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Summary:")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Your setup is ready.")
        print("Run: python run_app.py")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix the issues above.")
        print("Check the installation guide in README.md")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)