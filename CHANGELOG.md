# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of DysLexiCheck
- Handwriting analysis using Azure Computer Vision API
- Machine learning model for dyslexia detection using Decision Tree
- Pronunciation testing with real-time speech recognition
- Dictation exercises with accuracy measurement
- Multi-level testing support (2nd-4th and 5th-7th standards)
- Streamlit web application interface
- React.js frontend with modern UI
- Flask backend API
- Comprehensive feature extraction:
  - Spelling accuracy calculation
  - Grammatical accuracy assessment
  - Percentage of corrections analysis
  - Phonetic accuracy using multiple algorithms (Soundex, Metaphone, Caverphone, NYSIIS)
- Support for multiple phonetic encoding algorithms
- Text-to-speech functionality for dictation
- Real-time audio processing and analysis
- Educational content about dyslexia and phonetics
- Data visualization with charts and graphs
- Batch processing capabilities for training data
- Error handling and fallback mechanisms
- Cross-platform compatibility (Windows, macOS, Linux)

### Features
- **Handwriting Analysis Module**
  - Image upload and processing
  - OCR text extraction
  - Feature vector generation
  - ML-based prediction

- **Pronunciation Testing Module**
  - Real-time speech capture
  - Phonetic conversion (IPA)
  - Accuracy measurement
  - Grade-level appropriate vocabulary

- **Dictation Assessment Module**
  - Audio word playback
  - User input collection
  - Levenshtein distance scoring
  - Progress tracking

- **Educational Resources**
  - Dyslexia information and statistics
  - Phonetics learning materials
  - Research-based content
  - Visual aids and charts

### Technical Implementation
- **Backend**: Python with Streamlit and Flask
- **Frontend**: React.js with modern components
- **ML Model**: Decision Tree Classifier with scikit-learn
- **APIs**: Azure Cognitive Services, Bing Spell Check
- **Audio Processing**: SpeechRecognition, pyttsx3
- **NLP**: TextBlob, language-tool-python
- **Phonetics**: Abydos library, eng-to-ipa

### Data and Training
- 100 handwriting samples (50 dyslexic, 50 non-dyslexic)
- Vocabulary datasets for different grade levels
- Trained decision tree model with optimized parameters
- Feature engineering based on linguistic research

### Documentation
- Comprehensive README with setup instructions
- API documentation for backend endpoints
- Contributing guidelines
- Code style guidelines
- Installation and deployment guides

### Security and Privacy
- API key management
- Error handling for external services
- Input validation and sanitization
- Privacy-conscious data handling

## [Unreleased]

### Planned Features
- [ ] Mobile application (React Native)
- [ ] Advanced ML models (CNN, LSTM)
- [ ] Multi-language support
- [ ] Progress tracking and reports
- [ ] Teacher/parent dashboard
- [ ] Integration with educational platforms
- [ ] Offline mode capabilities
- [ ] Advanced analytics and insights
- [ ] Gamification elements
- [ ] Accessibility improvements

### Known Issues
- Azure API dependency for OCR functionality
- Microphone permissions required for speech features
- Internet connection required for full functionality
- Limited to English language currently

---

## Version History

- **v1.0.0**: Initial release with core functionality
- **v0.9.0**: Beta release with testing and feedback
- **v0.8.0**: Alpha release with basic features
- **v0.7.0**: Prototype with ML model integration
- **v0.6.0**: Early development with UI components
- **v0.5.0**: Initial concept and research phase