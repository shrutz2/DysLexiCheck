import React, { useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './App.css';
import PronunciationWord from './PronunciationWord';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Pronunciation state
  const [pronLevel, setPronLevel] = useState(1);
  const [pronWords, setPronWords] = useState([]);
  const [pronIndex, setPronIndex] = useState(0);
  const [pronResults, setPronResults] = useState([]);
  
  // Dictation state
  const [dictStart, setDictStart] = useState(false);
  const [dictLevel, setDictLevel] = useState(1);
  const [dictWords, setDictWords] = useState([]);
  const [dictInputs, setDictInputs] = useState(Array(10).fill(''));
  const [dictResults, setDictResults] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('No file selected');
    setLoading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await axios.post('http://localhost:5000/api/analyze-image', fd);
      setResults(r.data);
    } catch (err) {
      setError('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DysLexiCheck - Dyslexia Detection System</h1>
      </header>
      {error && <div className="error-banner">{error}</div>}
      <main>
        <Tabs selectedIndex={activeTab} onSelect={(i) => setActiveTab(i)}>
          <TabList>
            <Tab>Home</Tab>
            <Tab>Writing</Tab>
            <Tab>Pronunciation</Tab>
            <Tab>Dictation</Tab>
            <Tab>About</Tab>
          </TabList>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Welcome to DysLexiCheck</h2>
              <p>Dyslexia is a learning disorder that involves difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words.</p>
              <p>This application uses machine learning to detect potential dyslexia indicators through handwriting analysis.</p>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Handwriting Analysis</h2>
              <p>Upload a handwriting sample to analyze for dyslexia indicators.</p>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="image-upload" className="streamlit-button">
                    Choose Image File (JPG)
                  </label>
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept=".jpg,.jpeg" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                </div>

                {preview && (
                  <div className="image-preview">
                    <h3>Preview</h3>
                    <img src={preview} alt="Preview" style={{ maxWidth: 300 }} />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={!file || loading} 
                  className="streamlit-button"
                >
                  {loading ? 'Analyzing...' : 'Predict'}
                </button>
              </form>

              {results && (
                <div className="results-container">
                  <h3>📊 Analysis Results</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                    <div className="metric-card">
                      <h4>Spelling Accuracy</h4>
                      <div className="metric-value">
                        {(results.features?.spelling_accuracy || results.spelling_accuracy)?.toFixed(1)}%
                      </div>
                    </div>
                    <div className="metric-card">
                      <h4>Grammatical Accuracy</h4>
                      <div className="metric-value">
                        {(results.features?.grammatical_accuracy || results.grammatical_accuracy)?.toFixed(1)}%
                      </div>
                    </div>
                    <div className="metric-card">
                      <h4>Correction Percentage</h4>
                      <div className="metric-value">
                        {(results.features?.percentage_of_corrections || results.percentage_of_corrections)?.toFixed(1)}%
                      </div>
                    </div>
                    <div className="metric-card">
                      <h4>Phonetic Accuracy</h4>
                      <div className="metric-value">
                        {(results.features?.phonetic_accuracy || results.phonetic_accuracy)?.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    padding: 15, 
                    borderRadius: 8,
                    background: (results.prediction?.has_dyslexia || results.result) ? '#fee' : '#efe',
                    border: `2px solid ${(results.prediction?.has_dyslexia || results.result) ? '#f88' : '#8f8'}`
                  }}>
                    {(results.prediction?.has_dyslexia || results.result) ? (
                      <>
                        <h4 style={{ color: '#c33' }}>⚠️ High likelihood of dyslexia detected</h4>
                        <p>Confidence: {results.prediction?.confidence || '85'}%</p>
                        <p><strong>Recommendation:</strong> Consider consulting with a healthcare professional.</p>
                      </>
                    ) : (
                      <>
                        <h4 style={{ color: '#3c3' }}>✅ Low likelihood of dyslexia</h4>
                        <p>Confidence: {results.prediction?.confidence || '85'}%</p>
                        <p><strong>Note:</strong> This suggests typical writing patterns.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Pronunciation Test</h2>
              <p>Type how you pronounce each word to test pronunciation accuracy.</p>
              
              <div style={{ marginBottom: 20 }}>
                <label>Grade Level: </label>
                <select value={pronLevel} onChange={(e) => setPronLevel(Number(e.target.value))} style={{ marginLeft: 10, padding: 8 }}>
                  <option value={2}>2nd-4th Standard</option>
                  <option value={1}>5th-7th Standard</option>
                </select>
                <button 
                  className="streamlit-button" 
                  style={{ marginLeft: 10 }}
                  onClick={async () => {
                    try {
                      const res = await axios.get(`http://localhost:5000/api/get-words?level=${pronLevel}`);
                      setPronWords(res.data.words);
                      setPronIndex(0);
                      setPronResults([]);
                    } catch (err) {
                      setError('Failed to load words');
                    }
                  }}
                >
                  Start Test
                </button>
              </div>

              {pronWords.length > 0 && pronIndex < pronWords.length && (
                <PronunciationWord 
                  word={pronWords[pronIndex]} 
                  index={pronIndex} 
                  total={pronWords.length}
                  onResult={(spoken) => {
                    console.log('Submitting:', spoken);
                    console.log('Current index:', pronIndex);
                    axios.post('http://localhost:5000/api/check-pronunciation', {
                      original: pronWords[pronIndex],
                      pronounced: spoken
                    }).then(res => {
                      console.log('API Response:', res.data);
                      setPronResults([...pronResults, { word: pronWords[pronIndex], spoken, ...res.data }]);
                      setPronIndex(pronIndex + 1);
                      console.log('Moving to next word, new index:', pronIndex + 1);
                    }).catch(err => {
                      console.error('API Error:', err);
                      setError('Error checking pronunciation');
                    });
                  }}
                />
              )}

              {pronResults.length > 0 && pronIndex >= pronWords.length && (
                <div className="results-container">
                  <h3>📊 Test Complete!</h3>
                  <div className="metric-card" style={{ marginBottom: 20 }}>
                    <h4>Overall Pronunciation Accuracy</h4>
                    <div className="metric-value">
                      {((pronResults.reduce((acc, r) => acc + (1 - r.inaccuracy), 0) / pronResults.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <h4>Word-by-Word Results:</h4>
                  {pronResults.map((r, i) => (
                    <div key={i} style={{ padding: 15, margin: '10px 0', background: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
                      <div style={{ marginBottom: 8 }}><strong>Word {i + 1}:</strong> <span style={{ fontSize: 18, color: '#667eea' }}>{r.word}</span></div>
                      <div style={{ marginBottom: 8 }}><strong>You said:</strong> {r.spoken}</div>
                      <div style={{ marginBottom: 8 }}><strong>Phonetic Accuracy:</strong> <span style={{ color: (1 - r.inaccuracy) >= 0.8 ? '#0a0' : '#c00', fontWeight: 'bold', fontSize: 18 }}>{((1 - r.inaccuracy) * 100).toFixed(1)}%</span></div>
                      {r.original_ipa && (
                        <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 4 }}>
                          <div style={{ fontSize: 13, color: '#666' }}><strong>Expected IPA:</strong> {r.original_ipa}</div>
                          <div style={{ fontSize: 13, color: '#666' }}><strong>Your IPA:</strong> {r.pronounced_ipa}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Dictation Test</h2>
              <p>Listen to words and type what you hear.</p>
              
              <div style={{ marginBottom: 20 }}>
                <label>
                  <input type="checkbox" checked={dictStart} onChange={(e) => setDictStart(e.target.checked)} />
                  {' '}Start Dictation
                </label>
              </div>

              {dictStart && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label>Select Grade Level: </label>
                    <select value={dictLevel} onChange={(e) => setDictLevel(Number(e.target.value))} style={{ marginLeft: 10, padding: 8 }}>
                      <option value={1}>5th-7th Standard</option>
                      <option value={2}>2nd-4th Standard</option>
                    </select>
                  </div>

                  <button 
                    className="streamlit-button"
                    onClick={async () => {
                      try {
                        const res = await axios.get(`http://localhost:5000/api/get-words?level=${dictLevel}`);
                        setDictWords(res.data.words);
                        setDictInputs(Array(10).fill(''));
                        setDictResults(null);
                        
                        const synth = window.speechSynthesis;
                        res.data.words.forEach((word, i) => {
                          setTimeout(() => {
                            const utterance = new SpeechSynthesisUtterance(word);
                            synth.speak(utterance);
                          }, i * 8000);
                        });
                      } catch (err) {
                        setError('Failed to load words');
                      }
                    }}
                  >
                    Play Words
                  </button>

                  {dictWords.length > 0 && (
                    <div style={{ marginTop: 30 }}>
                      <h3>Type the words you hear:</h3>
                      {dictWords.map((_, i) => (
                        <div key={i} style={{ marginBottom: 10 }}>
                          <label>Word {i + 1}: </label>
                          <input 
                            type="text" 
                            value={dictInputs[i]} 
                            onChange={(e) => {
                              const newInputs = [...dictInputs];
                              newInputs[i] = e.target.value;
                              setDictInputs(newInputs);
                            }}
                            style={{ marginLeft: 10, padding: 8, width: 200 }}
                          />
                        </div>
                      ))}
                      
                      <button 
                        className="streamlit-button" 
                        style={{ marginTop: 20 }}
                        onClick={async () => {
                          try {
                            const res = await axios.post('http://localhost:5000/api/check-dictation', {
                              words: dictWords,
                              user_input: dictInputs
                            });
                            setDictResults(res.data);
                          } catch (err) {
                            setError('Failed to check dictation');
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {dictResults && dictResults.accuracy && (
                    <div className="results-container">
                      <h3>📊 Dictation Results</h3>
                      <div className="metric-card">
                        <h4>Overall Accuracy</h4>
                        <div className="metric-value">{(dictResults.overall_accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div style={{ marginTop: 20 }}>
                        {dictWords.map((word, i) => (
                          <div key={i} style={{ padding: 10, margin: '10px 0', background: 'white', borderRadius: 6 }}>
                            <strong>Word:</strong> {word} | <strong>You wrote:</strong> {dictInputs[i] || ''} | <strong>Accuracy:</strong> {((dictResults.accuracy[i] || 0) * 100).toFixed(1)}%
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 20, padding: 15, borderRadius: 8, background: dictResults.overall_accuracy >= 0.8 ? '#efe' : '#fee' }}>
                        <h4>{dictResults.overall_accuracy >= 0.8 ? '✅ Very low likelihood of dyslexia' : '⚠️ Consider further assessment'}</h4>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>About</h2>
              <p>Dyslexia, also known as reading disorder, is a disorder characterized by reading below the expected level for ones age.</p>
              <p>Based on spelling, grammatical, contextual and phonetic errors, the app predicts whether the person has dyslexia or not.</p>
              <h3>How it works</h3>
              <ul>
                <li>Upload handwriting sample</li>
                <li>ML model analyzes 4 key features</li>
                <li>Decision tree predicts dyslexia likelihood</li>
                <li>Results show confidence and recommendations</li>
              </ul>
            </div>
          </TabPanel>

        </Tabs>
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          DysLexiCheck — Preliminary assessment tool. Consult professionals for diagnosis.
        </div>
      </footer>
    </div>
  );
}
