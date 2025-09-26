import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaMicrophone } from 'react-icons/fa';
import './App.css';

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pronunciation state
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState(null);
  const recognitionRef = useRef(null);

  // Dictation state
  const [dictationWords, setDictationWords] = useState([]);
  const [userInput, setUserInput] = useState(Array(10).fill(''));
  const [dictationResults, setDictationResults] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript.toLowerCase());
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load words functions
  const loadWords = async (selectedLevel) => {
    try {
      setError('');
      const response = await axios.get(`http://localhost:5000/api/get-words?level=${selectedLevel}`);
      if (response.data && response.data.words) {
        setWords(response.data.words);
        setCurrentWordIndex(0);
        setPronunciationResult(null);
      }
    } catch (err) {
      console.error('Error loading words:', err);
      setError('Failed to load words. Please check if the backend server is running.');
      const fallbackWords = ['apple', 'banana', 'cat', 'dog', 'elephant'];
      setWords(fallbackWords);
    }
  };

  const loadDictationWords = async () => {
    try {
      setError('');
      const response = await axios.get(`http://localhost:5000/api/get-words?level=${level}`);
      if (response.data && response.data.words) {
        setDictationWords(response.data.words);
        setUserInput(Array(response.data.words.length).fill(''));
        setDictationResults(null);
      }
    } catch (err) {
      console.error('Error loading dictation words:', err);
      setError('Failed to load dictation words.');
    }
  };

  // Writing tab functions
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResults(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      setResults(response.data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pronunciation functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setSpokenText('');
        setPronunciationResult(null);
        setError('');
        setIsListening(true);
        recognitionRef.current.start();
      } catch (error) {
        setIsListening(false);
        setError("Error starting speech recognition.");
      }
    }
  };

  const checkPronunciation = async () => {
    if (!spokenText || currentWordIndex >= words.length) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/check-pronunciation', {
        original: words[currentWordIndex],
        pronounced: spokenText
      });
      setPronunciationResult(response.data);
    } catch (err) {
      setError('Error checking pronunciation.');
    }
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setSpokenText('');
      setPronunciationResult(null);
    }
  };

  // Dictation functions
  const handleInputChange = (index, value) => {
    const newInputs = [...userInput];
    newInputs[index] = value;
    setUserInput(newInputs);
  };

  const checkDictation = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:5000/api/check-dictation', {
        words: dictationWords,
        user_input: userInput
      });
      setDictationResults(response.data);
    } catch (err) {
      setError('Error checking dictation.');
    }
  };

  // Load words when needed
  useEffect(() => {
    if (activeTab === 2 && words.length === 0) loadWords(level);
  }, [level, activeTab]);

  useEffect(() => {
    if (activeTab === 3 && dictationWords.length === 0) loadDictationWords();
  }, [level, activeTab]);

  useEffect(() => {
    if (spokenText && !isListening && words.length > 0) checkPronunciation();
  }, [spokenText, isListening, words]);

  return (
    <div className="App streamlit-style">
      {/* Header with Logo */}
      <header className="App-header">
        <img 
          src="/images/img1.png" 
          alt="Dyslexia Detection Logo" 
          className="app-logo"
          onError={(e) => e.target.style.display = 'none'}
        />
        <h1>DysLexiCheck</h1>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <main>
        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
          <TabList className="streamlit-tabs">
            <Tab>Home</Tab>
            <Tab>Writing</Tab>
            <Tab>Pronunciation</Tab>
            <Tab>Dictation</Tab>
          </TabList>

          {/* Home Tab */}
          <TabPanel>
            <div className="streamlit-container">
              <h2>DysLexiCheck</h2>
              <p>This application helps detect potential dyslexia indicators through handwriting analysis, pronunciation tests, and dictation exercises.</p>
              
              <div className="info-section">
                <h3>What is Dyslexia?</h3>
                <p>Dyslexia is a learning disorder characterized by difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words.</p>
                
                <h3>How This Tool Helps</h3>
                <ul>
                  <li><strong>Writing Analysis:</strong> Upload handwriting samples to analyze spelling, grammar, and phonetic accuracy</li>
                  <li><strong>Pronunciation Test:</strong> Test your pronunciation of words at different difficulty levels</li>
                  <li><strong>Dictation Exercise:</strong> Practice writing words that are read aloud</li>
                </ul>
              </div>
            </div>
          </TabPanel>

          {/* Writing Tab */}
          <TabPanel>
            <div className="streamlit-container">
              <h2>Handwriting Analysis</h2>
              <p>Upload a handwriting sample to analyze for potential dyslexia indicators</p>
              
              <div className="upload-section">
                <form onSubmit={handleSubmit}>
                  <div className="file-input">
                    <label htmlFor="image-upload" className="streamlit-button">
                      Choose Image File
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {preview && (
                    <div className="image-preview">
                      <h3>Preview</h3>
                      <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={!file || loading}
                    className="streamlit-button"
                    style={{ marginTop: '20px' }}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Handwriting'}
                  </button>
                </form>
              </div>

              {results && (
                <div className="results-container">
                  <h2>Analysis Results</h2>
                  
                  <div className="text-results">
                    <h3>Extracted Text</h3>
                    <p style={{ background: '#f0f2f6', padding: '15px', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {results.extracted_text}
                    </p>
                  </div>

                  <div className="metrics-results">
                    <h3>Accuracy Metrics</h3>
                    <div style={{ height: '400px', marginBottom: '20px' }}>
                      <Bar
                        data={{
                          labels: ['Spelling Accuracy (%)', 'Grammatical Accuracy (%)', 'Corrections Needed (%)', 'Phonetic Accuracy (%)'],
                          datasets: [{
                            label: 'Score',
                            data: [
                              results.spelling_accuracy || 0,
                              results.grammatical_accuracy || 0,
                              results.percentage_of_corrections || 0,
                              results.phonetic_accuracy || 0
                            ],
                            backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)', 'rgba(255, 206, 86, 0.8)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                            borderWidth: 1,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: { y: { beginAtZero: true, max: 100 } },
                          plugins: { title: { display: true, text: 'Handwriting Analysis Metrics' } }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="prediction-result" style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: results.result ? '#e8f5e8' : '#ffeaa7',
                    border: `2px solid ${results.result ? '#4caf50' : '#ff9800'}`
                  }}>
                    <h3>Prediction</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: results.result ? '#2e7d32' : '#f57c00', margin: 0 }}>
                      {results.result ? "✅ No strong dyslexia indicators detected" : "⚠️ Potential dyslexia indicators detected"}
                    </p>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                      This is a preliminary assessment. Please consult with educational professionals for a complete evaluation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Pronunciation Tab */}
          <TabPanel>
            <div className="streamlit-container">
              <h2>Pronunciation Test</h2>
              
              <div className="level-selector">
                <label>
                  Difficulty Level:
                  <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))} className="streamlit-select">
                    <option value={1}>Intermediate (5th-7th grade)</option>
                    <option value={2}>Elementary (2nd-4th grade)</option>
                  </select>
                </label>
                <button onClick={() => loadWords(level)} className="streamlit-button">Load New Words</button>
              </div>
              
              {words.length > 0 && (
                <div className="pronunciation-test">
                  <div className="word-display">
                    <h3>Word to Pronounce ({currentWordIndex + 1}/{words.length})</h3>
                    <p className="test-word">{words[currentWordIndex]}</p>
                  </div>
                  
                  <div className="pronunciation-controls">
                    <button onClick={startListening} disabled={isListening} className="streamlit-button">
                      <FaMicrophone /> {isListening ? 'Listening...' : 'Start Speaking'}
                    </button>
                    
                    {spokenText && (
                      <div className="spoken-text">
                        <h4>You said:</h4>
                        <p>{spokenText}</p>
                      </div>
                    )}
                    
                    {pronunciationResult && (
                      <div className="pronunciation-result">
                        <h4>Pronunciation Analysis:</h4>
                        <p><strong>Accuracy:</strong> {((1 - pronunciationResult.inaccuracy) * 100).toFixed(1)}%</p>
                        <p><strong>Original (IPA):</strong> {pronunciationResult.original_ipa}</p>
                        <p><strong>Your Pronunciation (IPA):</strong> {pronunciationResult.pronounced_ipa}</p>
                      </div>
                    )}
                    
                    <button onClick={nextWord} disabled={currentWordIndex >= words.length - 1} className="streamlit-button">
                      Next Word
                    </button>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Dictation Tab */}
          <TabPanel>
            <div className="streamlit-container">
              <h2>Dictation Test</h2>
              
              <div className="level-selector">
                <label>
                  Difficulty Level:
                  <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))} className="streamlit-select">
                    <option value={1}>Intermediate (5th-7th grade)</option>
                    <option value={2}>Elementary (2nd-4th grade)</option>
                  </select>
                </label>
                <button onClick={loadDictationWords} className="streamlit-button">Load New Words</button>
              </div>
              
              {dictationWords.length > 0 && (
                <div className="dictation-test">
                  <h3>Words to Spell</h3>
                  
                  <div className="dictation-words">
                    {dictationWords.map((word, index) => (
                      <div key={index} className="dictation-word-input">
                        <label>{index + 1}.</label>
                        <input
                          type="text"
                          value={userInput[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className="streamlit-input"
                          placeholder="Type word here"
                        />
                        <button
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(word);
                              utterance.rate = 0.8;
                              speechSynthesis.speak(utterance);
                            }
                          }}
                          className="streamlit-button"
                        >
                          🔊 Play
                        </button>
                        {dictationResults && dictationResults.accuracy && (
                          <span className="accuracy-indicator">
                            {(dictationResults.accuracy[index] * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={checkDictation} className="streamlit-button">Check Spelling</button>
                  
                  {dictationResults && (
                    <div className="dictation-results">
                      <h3>Results</h3>
                      <p>Overall Accuracy: {(dictationResults.overall_accuracy * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p><strong>Dyslexia Detection Tool</strong> - Advanced AI-powered learning assessment</p>
          <p>Developed with machine learning algorithms for educational support</p>
          <p>Features: Handwriting Analysis | Pronunciation Testing | Dictation Exercises</p>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This tool provides preliminary assessment only. 
            For professional diagnosis, please consult qualified educational specialists.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;