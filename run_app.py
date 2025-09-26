import subprocess
import sys
import os

def run_streamlit_app():
    """Run the Streamlit app with proper error handling"""
    try:
        print("Starting DysLexiCheck - Dyslexia Detection App...")
        print("=" * 50)
        print("🔍 Initializing application...")
        
        # Get current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(current_dir)
        
        print(f"📁 Working directory: {current_dir}")
        print("🚀 Launching Streamlit server...")
        print("📱 Open your browser and go to: http://localhost:8501")
        print("⏹️  Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Run streamlit
        result = subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py", 
            "--server.port=8501", 
            "--server.address=localhost",
            "--server.headless=false"
        ], capture_output=False)
        
        return result.returncode
        
    except KeyboardInterrupt:
        print("\n🛑 Application stopped by user")
        return 0
    except Exception as e:
        print(f"❌ Error running app: {e}")
        print("💡 Make sure you have installed all dependencies:")
        print("   pip install -r requirements.txt")
        return 1

def main():
    """Main entry point for console script"""
    return run_streamlit_app()

if __name__ == "__main__":
    main()