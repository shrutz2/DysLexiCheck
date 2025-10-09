import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaMicrophone } from 'react-icons/fa';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  // Writing/analysis state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

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
  const [userInput, setUserInput] = useState([]);
  const [dictationResults, setDictationResults] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setSpokenText(t.toLowerCase());
        setIsListening(false);
      };

      recognitionRef.current.onerror = (e) => {
        setError(`Speech recognition error: ${e.error}`);
        setIsListening(false);
      };
    }
  }, []);

  // File handlers for handwriting analysis
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('No file selected');
    setLoading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await axios.post('http://localhost:5000/api/analyze-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(r.data);
    } catch (err) {
      setError('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  // Words loading
  const loadWords = async (lvl) => {
    try {
      setError('');
      const r = await axios.get(`http://localhost:5000/api/get-words?level=${lvl}`);
      setWords(r.data.words || []);
      setCurrentWordIndex(0);
      setPronunciationResult(null);
      setSpokenText('');
    } catch (err) {
      setError('Failed to load words');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return setError('SpeechRecognition not available in this browser');
    setSpokenText('');
    setPronunciationResult(null);
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      setError('SpeechRecognition start failed');
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (spokenText && !isListening && words.length) {
      (async () => {
        try {
          const r = await axios.post('http://localhost:5000/api/check-pronunciation', { original: words[currentWordIndex], pronounced: spokenText });
          setPronunciationResult(r.data);
        } catch (e) {
          setError('Pronunciation check failed');
        }
      })();
    }
  }, [spokenText, isListening]);

  const nextWord = () => setCurrentWordIndex((i) => Math.min(words.length - 1, i + 1));

  // Dictation
  const loadDictationWords = async () => {
    try {
      setError('');
      const r = await axios.get(`http://localhost:5000/api/get-words?level=${level}`);
      setDictationWords(r.data.words || []);
      setUserInput(Array((r.data.words || []).length).fill(''));
      setDictationResults(null);
    } catch (e) {
      setError('Failed to load dictation words');
    }
  };

  const handleInputChange = (i, v) => { const c = [...userInput]; c[i] = v; setUserInput(c); };

  const checkDictation = async () => {
    try {
      const r = await axios.post('http://localhost:5000/api/check-dictation', { words: dictationWords, user_input: userInput });
      setDictationResults(r.data);
    } catch (e) {
      setError('Dictation check failed');
    }
  };

  useEffect(() => { if (activeTab === 2 && !words.length) loadWords(level); }, [activeTab, level]);
  useEffect(() => { if (activeTab === 3 && !dictationWords.length) loadDictationWords(); }, [activeTab, level]);

  return (
    <div className="App streamlit-style">
      <header className="App-header"><h1>DysLexiCheck</h1></header>
      {error && <div className="error-banner">{error}</div>}
      <main>
        <Tabs selectedIndex={activeTab} onSelect={(i) => setActiveTab(i)}>
          <TabList><Tab>Home</Tab><Tab>Writing</Tab><Tab>Pronunciation</Tab><Tab>Dictation</Tab></TabList>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Welcome</h2>
              <p>Handwriting analysis, pronunciation and dictation tests.</p>
              <div style={{ marginTop: 12 }}>
                <p>This demo uses a combination of rule-based heuristics and an optional Decision Tree model (if present in model_training/Decision_tree_model.sav) to provide a quick assessment.</p>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Writing — Handwriting Analysis</h2>
              <div className="upload-section">
                <form onSubmit={handleSubmit}>
                  <div className="file-input">
                    <label htmlFor="image-upload" className="streamlit-button">Choose Image File</label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </div>

                  {preview && (
                    <div className="image-preview">
                      <h3>Preview</h3>
                      <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                    </div>
                  )}

                  <button type="submit" disabled={!file || loading} className="streamlit-button" style={{ marginTop: 12 }}>{loading ? 'Analyzing...' : 'Analyze Handwriting'}</button>
                </form>

                {results && (
                  <div className="results-container">
                    <h3>Results</h3>
                    <p><strong>Extracted Text:</strong></p>
                    <pre style={{ background: '#f7f7f7', padding: 12 }}>{results.extracted_text}</pre>
                    <p><strong>Spelling Accuracy:</strong> {results.spelling_accuracy?.toFixed(1)}%</p>
                    <p><strong>Grammatical Accuracy:</strong> {results.grammatical_accuracy?.toFixed(1)}%</p>
                    <p><strong>Corrections Needed:</strong> {results.percentage_of_corrections?.toFixed(1)}%</p>
                    <p><strong>Phonetic Accuracy:</strong> {results.phonetic_accuracy?.toFixed(1)}%</p>
                    <div style={{ marginTop: 8, padding: 12, borderRadius: 6, background: results.result ? '#e8f5e8' : '#fff3cd' }}>
                      <strong>{results.result ? '✅ No strong dyslexia indicators detected' : '⚠️ Potential dyslexia indicators detected'}</strong>
                      <p style={{ marginTop: 6 }}>This is a preliminary assessment. Consult professionals for a full evaluation.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Pronunciation Test</h2>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginRight: 8 }}>Level:</label>
                <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))}>
                  <option value={1}>Intermediate</option>
                  <option value={2}>Elementary</option>
                </select>
                <button className="streamlit-button" onClick={() => loadWords(level)} style={{ marginLeft: 8 }}>Load Words</button>
              </div>

              {words.length > 0 && (
                <div>
                  <h3>{words[currentWordIndex]}</h3>
                  <button className="streamlit-button" onClick={startListening} disabled={isListening}><FaMicrophone /> {isListening ? 'Listening...' : 'Start Speaking'}</button>
                  {spokenText && <div><strong>You said:</strong> {spokenText}</div>}
                  {pronunciationResult && (
                    <div style={{ marginTop: 8 }}>
                      <p><strong>Feedback:</strong> {pronunciationResult.feedback}</p>
                      <p><strong>Original (IPA):</strong> {pronunciationResult.original_ipa}</p>
                      <p><strong>Your IPA:</strong> {pronunciationResult.pronounced_ipa}</p>
                      <p><strong>Inaccuracy:</strong> {(pronunciationResult.inaccuracy * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <button className="streamlit-button" onClick={() => setCurrentWordIndex((i) => Math.min(words.length - 1, i + 1))}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Dictation Test</h2>
              <div style={{ marginBottom: 8 }}>
                <label style={{ marginRight: 8 }}>Level:</label>
                <select value={level} onChange={(e) => setLevel(parseInt(e.target.value))}>
                  <option value={1}>Intermediate</option>
                  <option value={2}>Elementary</option>
                </select>
                <button className="streamlit-button" onClick={loadDictationWords} style={{ marginLeft: 8 }}>Load Words</button>
              </div>

              {dictationWords.length > 0 && (
                <div>
                  {dictationWords.map((word, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <label style={{ marginRight: 8 }}>{i + 1}.</label>
                      <input value={userInput[i] || ''} onChange={(e) => handleInputChange(i, e.target.value)} />
                      <button className="streamlit-button" onClick={() => { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(word); u.rate = 0.9; window.speechSynthesis.speak(u); } }} style={{ marginLeft: 8 }}>Play</button>
                      {dictationResults && dictationResults.accuracy && <span style={{ marginLeft: 8 }}>{(dictationResults.accuracy[i] * 100).toFixed(0)}%</span>}
                    </div>
                  ))}

                  <div style={{ marginTop: 8 }}>
                    <button className="streamlit-button" onClick={checkDictation}>Check Spelling</button>
                    {dictationResults && <div style={{ marginTop: 8 }}>Overall Accuracy: {(dictationResults.overall_accuracy * 100).toFixed(1)}%</div>}
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

        </Tabs>
      </main>
      <footer className="app-footer"><div className="footer-content">Dyslexia Detection Tool — preliminary assessment only.</div></footer>
    </div>
  );
}