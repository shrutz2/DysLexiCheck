# DysLexiCheck - Dyslexia Detection System

A comprehensive web application for detecting dyslexia through handwriting analysis, pronunciation tests, and dictation exercises using machine learning and natural language processing.

## 🌟 Features

- **Handwriting Analysis**: Upload handwriting samples for dyslexia detection using ML algorithms
- **Pronunciation Testing**: Real-time speech recognition and phonetic analysis
- **Dictation Exercises**: Audio-based word dictation with accuracy measurement
- **Multi-level Testing**: Supports different grade levels (2nd-4th and 5th-7th standards)
- **Comprehensive Analysis**: Spelling accuracy, grammatical accuracy, phonetic analysis, and correction percentage

## 🏗️ Project Structure

```
dysle/
├── frontend/                 # React.js frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Flask backend API
│   ├── app.py
│   ├── backend.py
│   └── requirements.txt
├── model_training/           # ML model training notebooks and data
│   ├── dyslexia_detection.ipynb
│   ├── Decision_tree_model.sav
│   └── *.csv files
├── data/                     # Training and test datasets
│   ├── dyslexic/            # Handwriting samples from dyslexic individuals
│   ├── non_dyslexic/        # Handwriting samples from non-dyslexic individuals
│   └── vocabulary files
├── images/                   # Result charts and documentation images
├── app.py                    # Main Streamlit application
└── requirements.txt          # Python dependencies
```

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm or yarn
- Microphone access for speech features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrutz2/DysLexiCheck.git
   cd DysLexiCheck
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Streamlit App (Recommended)
```bash
python run_app.py
```
or
```bash
streamlit run app.py
```

#### Option 2: Full Stack (Frontend + Backend)
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

#### Option 3: Windows Batch File
```bash
start_app.bat
```

## 🔧 Configuration

### Azure Cognitive Services Setup
1. Create an Azure Cognitive Services account
2. Get your subscription key and endpoint
3. Update the credentials in `app.py`:
   ```python
   subscription_key_imagetotext = "YOUR_SUBSCRIPTION_KEY"
   endpoint_imagetotext = "YOUR_ENDPOINT"
   ```

### Bing Spell Check API
1. Get Bing Spell Check API key
2. Update in `app.py`:
   ```python
   api_key_textcorrection = "YOUR_API_KEY"
   ```

## 📊 How It Works

### 1. Handwriting Analysis
- **Image to Text**: Uses Azure Computer Vision API to extract text from handwriting samples
- **Feature Extraction**: Calculates 4 key metrics:
  - Spelling accuracy
  - Grammatical accuracy  
  - Percentage of corrections needed
  - Phonetic accuracy using multiple algorithms (Soundex, Metaphone, Caverphone, NYSIIS)

## 🐳 Docker

This project includes simple Docker support. The backend image will build the React frontend and serve the static files via the Flask app.

Build and run with docker-compose (recommended):

```powershell
# From the project root
docker-compose build
docker-compose up
```

Direct build (backend context builds frontend automatically):

```powershell
docker build -t dyslexic-backend ./backend
docker run -p 5000:5000 dyslexic-backend
```

Notes:
- The container exposes port 5000. Point your browser to http://localhost:5000
- Secrets (Azure keys, Bing API key) are still stored in code for development. For production, set them with environment variables or Docker secrets and update the code to read from env vars.


### 2. Machine Learning Model
- **Algorithm**: Decision Tree Classifier
- **Training Data**: 100 handwriting samples (50 dyslexic, 50 non-dyslexic)
- **Features**: 4-dimensional feature vector from handwriting analysis
- **Accuracy**: Optimized for early dyslexia detection

### 3. Pronunciation Testing
- **Speech Recognition**: Real-time audio capture and processing
- **Phonetic Analysis**: Converts speech to IPA (International Phonetic Alphabet)
- **Comparison**: Measures pronunciation accuracy using Levenshtein distance

### 4. Dictation Assessment
- **Audio Playback**: Text-to-speech for word dictation
- **User Input**: Text input for heard words
- **Scoring**: Accuracy measurement based on correct word recognition

## 🎯 Usage Guide

### Handwriting Test
1. Navigate to the "Writing" tab
2. Upload a JPG image of handwriting sample
3. Click "Predict" to get dyslexia probability assessment

### Pronunciation Test
1. Go to "Pronunciation" tab
2. Select appropriate grade level
3. Click "Start pronunciation test"
4. Repeat the displayed words within 10 seconds
5. View phonetic accuracy results

### Dictation Test
1. Open "Dictation" tab
2. Check "start dictation" 
3. Select grade level
4. Listen to 10 words and type them in the form
5. Submit to see accuracy score

## 📈 Results and Analytics

The application provides detailed analytics including:
- **Spelling Accuracy Percentage**: Measures correct spelling vs errors
- **Grammatical Accuracy**: Grammar and syntax correctness
- **Correction Percentage**: Amount of corrections needed
- **Phonetic Accuracy**: Pronunciation correctness using multiple phonetic algorithms

## 🔬 Research Background

Based on research showing that dyslexic individuals typically demonstrate:
- Lower spelling accuracy (≤96.4% vs >96.4% for non-dyslexic)
- Higher correction requirements
- Phonetic processing difficulties
- Consistent patterns in handwriting characteristics

## 🛠️ Technologies Used

### Backend
- **Python**: Core programming language
- **Streamlit**: Web application framework
- **Flask**: REST API backend
- **scikit-learn**: Machine learning algorithms
- **Azure Cognitive Services**: OCR and text analysis
- **TextBlob**: Natural language processing
- **SpeechRecognition**: Audio processing
- **pyttsx3**: Text-to-speech conversion

### Frontend
- **React.js**: User interface framework
- **Chart.js**: Data visualization
- **Axios**: HTTP client for API calls
- **React Speech Recognition**: Voice input handling

### Machine Learning
- **Decision Tree Classifier**: Primary ML algorithm
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computations
- **Abydos**: Phonetic algorithm implementations

## 📝 API Endpoints

### Backend API (Flask)
- `POST /analyze`: Handwriting analysis
- `POST /pronunciation`: Pronunciation test scoring
- `POST /dictation`: Dictation test evaluation
- `GET /vocabulary`: Get vocabulary lists by level

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Azure Cognitive Services for OCR capabilities
- Bing Spell Check API for text correction
- Research papers on dyslexia detection methodologies
- Open source phonetic algorithm implementations

## 📞 Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Mobile application development
- [ ] Advanced ML models (CNN, RNN)
- [ ] Multi-language support
- [ ] Real-time collaborative features
- [ ] Integration with educational platforms
- [ ] Detailed progress tracking and reports

---

**Note**: This application is for educational and research purposes. For clinical diagnosis, please consult qualified healthcare professionals.