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
  
  // User registration state
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userGrade, setUserGrade] = useState('');
  const [showLogin, setShowLogin] = useState(null);
  const [loginName, setLoginName] = useState('');

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
    if (userId) fd.append('user_id', userId);
    try {
      const r = await axios.post('http://localhost:5000/api/analyze-image', fd);
      setResults(r.data);
    } catch (err) {
      setError('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userName || !userAge) return setError('Name and age required');
    try {
      const res = await axios.post('http://localhost:5000/api/users', {
        name: userName,
        age: parseInt(userAge),
        grade: userGrade
      });
      setUserId(res.data.user_id);
      setError('');
      alert(`Registered successfully! Your ID: ${res.data.user_id}`);
      setUserName('');
      setUserAge('');
      setUserGrade('');
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data?.error || err.message));
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginName) return setError('Name required for login');
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        name: loginName
      });
      setUserId(res.data.user_id);
      setUserName(res.data.name);
      setUserAge(res.data.age);
      setUserGrade(res.data.grade || '');
      setError('');
      setShowLogin(false);
      alert(`Welcome back, ${res.data.name}!`);
    } catch (err) {
      setError('Login failed: User not found');
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ overflow: 'hidden', padding: '10px 0', maxHeight: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/header.jpg" alt="DysLexiCheck" style={{ maxHeight: '100px', width: 'auto', display: 'block', objectFit: 'contain' }} />
      </header>
      
      {/* Registration/Login Modal */}
      {!userId && (showLogin !== null) && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white', 
            padding: 30, 
            borderRadius: 8, 
            maxWidth: 400, 
            width: '90%',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowLogin(null)}
              style={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                background: 'transparent', 
                border: 'none', 
                fontSize: 24, 
                cursor: 'pointer' 
              }}
            >
              ×
            </button>
            
            <h3>{showLogin ? 'Login' : 'Register'}</h3>
            
            {!showLogin ? (
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: 15 }}>
                  <label>Name: </label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ marginLeft: 10, padding: 8, width: '100%', maxWidth: 250 }}
                    required
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label>Age: </label>
                  <input 
                    type="number" 
                    value={userAge} 
                    onChange={(e) => setUserAge(e.target.value)}
                    style={{ marginLeft: 10, padding: 8, width: 100 }}
                    required
                  />
                </div>
                <div style={{ marginBottom: 15 }}>
                  <label>Grade: </label>
                  <input 
                    type="text" 
                    value={userGrade} 
                    onChange={(e) => setUserGrade(e.target.value)}
                    placeholder="e.g., 5th Grade"
                    style={{ marginLeft: 10, padding: 8, width: '100%', maxWidth: 200 }}
                  />
                </div>
                <button type="submit" className="streamlit-button">Register Now</button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 15 }}>
                  <label>Enter Your Name: </label>
                  <input 
                    type="text" 
                    value={loginName} 
                    onChange={(e) => setLoginName(e.target.value)}
                    style={{ marginLeft: 10, padding: 8, width: '100%', maxWidth: 250 }}
                    required
                  />
                </div>
                <button type="submit" className="streamlit-button">Login</button>
              </form>
            )}
          </div>
        </div>
      )}
      {error && <div className="error-banner">{error}</div>}
      <main>
        <Tabs selectedIndex={activeTab} onSelect={(i) => setActiveTab(i)}>
          <TabList style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              <Tab>Home</Tab>
              <Tab>Writing</Tab>
              <Tab>Pronunciation</Tab>
              <Tab>Dictation</Tab>
              <Tab>About</Tab>
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginRight: 20 }}>
              {!userId ? (
                <>
                  <button 
                    className="streamlit-button" 
                    onClick={() => setShowLogin(false)}
                    style={{ background: '#f0778a', padding: '8px 16px', fontSize: 13 }}
                  >
                    Register
                  </button>
                  <button 
                    className="streamlit-button"
                    onClick={() => setShowLogin(true)}
                    style={{ background: '#f0778a', padding: '8px 16px', fontSize: 13 }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <span style={{ color: '#2e7d32', fontWeight: 'bold', alignSelf: 'center' }}>Welcome, {userName}!</span>
                  <button 
                    className="streamlit-button" 
                    style={{ background: '#dc3545', padding: '8px 16px', fontSize: 13 }}
                    onClick={() => {
                      setUserId(null);
                      setUserName('');
                      setUserAge('');
                      setUserGrade('');
                      setLoginName('');
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </TabList>

          <TabPanel>
            <div className="streamlit-container">
              <h2>Welcome to DysLexiCheck</h2>
              
              {userId && (
                <div style={{ marginBottom: 20, padding: 15, background: '#e8f5e9', borderRadius: 8, border: '2px solid #4caf50' }}>
                  <p style={{ margin: 0, color: '#2e7d32' }}>
                    <strong>Logged in as:</strong> {userName} (ID: {userId}, Age: {userAge}) - Your test results will be saved automatically!
                  </p>
                </div>
              )}
              
              <p style={{ fontSize: 18, lineHeight: 1.8 }}>
                Dyslexia is a learning disorder that involves difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words. 
                It affects approximately 10-15% of the population worldwide.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.8 }}>
                This application uses advanced machine learning algorithms to detect potential dyslexia indicators through three comprehensive tests:
              </p>
              <ul style={{ fontSize: 16, lineHeight: 2 }}>
                <li><strong>Handwriting Analysis:</strong> Upload a writing sample for ML-based assessment of spelling, grammar, and phonetic patterns</li>
                <li><strong>Pronunciation Test:</strong> Voice recording with IPA (International Phonetic Alphabet) analysis to measure pronunciation accuracy</li>
                <li><strong>Dictation Exercise:</strong> Listen to words and type them to assess spelling and auditory processing skills</li>
              </ul>
              <p style={{ fontSize: 18, lineHeight: 1.8, marginTop: 30 }}>
                Early detection is crucial for effective intervention. With proper support, individuals with dyslexia can excel academically and professionally.
              </p>
              <div style={{ marginTop: 30, padding: 20, background: '#ffcdd636', borderRadius: 8, border: '2px solid #ff6b6bff' }}>
                <p style={{ margin: 0, color: '#853804ff' }}>
                  <strong>Note:</strong> This is a preliminary screening tool. For clinical diagnosis, please consult qualified healthcare professionals.
                </p>
              </div>
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
                  <h3>Analysis Results</h3>
                  
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
                        <h4 style={{ color: 'rgba(204, 51, 51, 0.64)' }}>High likelihood of dyslexia detected</h4>
                        <p>Confidence: {results.prediction?.confidence || '85'}%</p>
                        <p><strong>Recommendation:</strong> Consider consulting with a healthcare professional.</p>
                      </>
                    ) : (
                      <>
                        <h4 style={{ color: 'rgba(51, 204, 51, 0.52)' }}>Low likelihood of dyslexia</h4>
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

              {pronResults.length > 0 && pronIndex < pronWords.length && (() => {
                const lastResult = pronResults[pronResults.length - 1];
                return (
                  <div style={{ marginTop: 30 }}>
                    <h4>Last Word Result:</h4>
                    <div style={{ padding: 15, margin: '10px 0', background: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
                      <div style={{ marginBottom: 8 }}><strong>Word:</strong> <span style={{ fontSize: 18, color: '#f78f8fff' }}>{lastResult.word}</span></div>
                      <div style={{ marginBottom: 8 }}><strong>You said:</strong> {lastResult.spoken}</div>
                      <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ fontSize: 14, color: '#333', marginBottom: 5 }}><strong>Expected Phonetic:</strong> /{lastResult.original_ipa}/</div>
                        <div style={{ fontSize: 14, color: '#333' }}><strong>Your Phonetic:</strong> /{lastResult.pronounced_ipa}/</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {pronResults.length > 0 && pronIndex >= pronWords.length && (() => {
                // Save pronunciation results to database
                if (userId && pronResults.length > 0) {
                  axios.post('http://localhost:5000/api/predict-pronunciation-dyslexia', {
                    results: pronResults,
                    user_id: userId
                  }).catch(err => console.error('Failed to save pronunciation results'));
                }
                return null;
              })()}
              
              {pronResults.length > 0 && pronIndex >= pronWords.length && (
                <div className="results-container">
                  <h3>Test Complete!</h3>
                  <div className="metric-card" style={{ marginBottom: 20 }}>
                    <h4>Overall Pronunciation Accuracy</h4>
                    <div className="metric-value">
                      {((pronResults.reduce((acc, r) => acc + (1 - r.inaccuracy), 0) / pronResults.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: 20, 
                    borderRadius: 8, 
                    marginBottom: 20,
                    background: ((pronResults.reduce((acc, r) => acc + (1 - r.inaccuracy), 0) / pronResults.length) * 100) >= 80 ? '#efe' : '#fee',
                    border: `2px solid ${((pronResults.reduce((acc, r) => acc + (1 - r.inaccuracy), 0) / pronResults.length) * 100) >= 80 ? 'rgba(136, 255, 136, 0.67)' : 'rgba(255, 136, 136, 0.72)'}`
                  }}>
                    {((pronResults.reduce((acc, r) => acc + (1 - r.inaccuracy), 0) / pronResults.length) * 100) >= 80 ? (
                      <>
                        <h4 style={{ color: 'rgba(51, 204, 51, 0.66)', margin: '0 0 10px 0' }}>Low likelihood of dyslexia</h4>
                        <p style={{ margin: 0 }}>Your pronunciation accuracy is within normal range. No immediate concerns detected.</p>
                      </>
                    ) : (
                      <>
                        <h4 style={{ color: 'rgba(204, 51, 51, 0.62)', margin: '0 0 10px 0' }}>High likelihood of dyslexia detected</h4>
                        <p style={{ margin: 0 }}><strong>Recommendation:</strong> Pronunciation difficulties detected. Consider consulting with a healthcare professional for comprehensive assessment.</p>
                      </>
                    )}
                  </div>
                  <h4>Word-by-Word Results:</h4>
                  {pronResults.map((r, i) => (
                    <div key={i} style={{ padding: 15, margin: '10px 0', background: 'white', borderRadius: 6, border: '1px solid #ddd' }}>
                      <div style={{ marginBottom: 8 }}><strong>Word {i + 1}:</strong> <span style={{ fontSize: 18, color: '#f78f8fff' }}>{r.word}</span></div>
                      <div style={{ marginBottom: 8 }}><strong>You said:</strong> {r.spoken}</div>
                      <div style={{ marginBottom: 8 }}><strong>Phonetic Accuracy:</strong> <span style={{ color: (1 - r.inaccuracy) >= 0.8 ? 'rgba(18, 212, 18, 0.53)' : 'rgba(204, 0, 0, 0.59)', fontWeight: 'bold', fontSize: 18 }}>{((1 - r.inaccuracy) * 100).toFixed(1)}%</span></div>
                      <div style={{ marginBottom: 8 }}><strong>Feedback:</strong> {r.feedback}</div>
                      <div style={{ marginTop: 10, padding: 10, background: '#f5f5f5', borderRadius: 4 }}>
                        <div style={{ fontSize: 14, color: '#333', marginBottom: 5 }}><strong>Expected Phonetic:</strong> /{r.original_ipa}/</div>
                        <div style={{ fontSize: 14, color: '#333' }}><strong>Your Phonetic:</strong> /{r.pronounced_ipa}/</div>
                        <div style={{ fontSize: 13, color: '#666', marginTop: 5 }}>Phonetic Distance: {r.phonetic_distance}</div>
                      </div>
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
                            const payload = {
                              words: dictWords,
                              user_input: dictInputs
                            };
                            if (userId) payload.user_id = userId;
                            const res = await axios.post('http://localhost:5000/api/check-dictation', payload);
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
                      <h3>Dictation Results</h3>
                      <div className="metric-card" style={{ marginBottom: 20 }}>
                        <h4>Overall Accuracy</h4>
                        <div className="metric-value">{(dictResults.overall_accuracy * 100).toFixed(1)}%</div>
                      </div>
                      
                      {dictResults.prediction && (
                        <div style={{ 
                          padding: 20, 
                          borderRadius: 8, 
                          marginBottom: 20,
                          background: dictResults.prediction.has_dyslexia ? '#fee' : '#efe',
                          border: `2px solid ${dictResults.prediction.has_dyslexia ? 'rgba(255, 136, 136, 0.71)' : 'rgba(136, 255, 136, 0.66)'}`
                        }}>
                          {dictResults.prediction.has_dyslexia ? (
                            <>
                              <h4 style={{ color: 'rgba(204, 51, 51, 0.76)', margin: '0 0 10px 0' }}>High likelihood of dyslexia detected</h4>
                              <p style={{ margin: '0 0 10px 0' }}>Confidence: {dictResults.prediction.confidence}%</p>
                              <p style={{ margin: 0 }}><strong>Recommendation:</strong> Auditory processing difficulties detected. Consider consulting with a healthcare professional for comprehensive assessment.</p>
                            </>
                          ) : (
                            <>
                              <h4 style={{ color: 'rgba(51, 204, 51, 0.5)', margin: '0 0 10px 0' }}>Low likelihood of dyslexia</h4>
                              <p style={{ margin: '0 0 10px 0' }}>Confidence: {dictResults.prediction.confidence}%</p>
                              <p style={{ margin: 0 }}>Your dictation accuracy is within normal range. No immediate concerns detected.</p>
                            </>
                          )}
                        </div>
                      )}
                      
                      <div style={{ marginTop: 20 }}>
                        <h4>Word-by-Word Results:</h4>
                        {dictWords.map((word, i) => (
                          <div key={i} style={{ padding: 10, margin: '10px 0', background: 'white', borderRadius: 6 }}>
                            <strong>Word:</strong> {word} | <strong>You wrote:</strong> {dictInputs[i] || ''} | <strong>Accuracy:</strong> {((dictResults.accuracy[i] || 0) * 100).toFixed(1)}%
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="streamlit-container">
              <h2>About DysLexiCheck</h2>
              <p style={{ fontSize: 16, lineHeight: 1.8 }}>
                DysLexiCheck is a machine learning-based screening tool that analyzes handwriting, pronunciation, and dictation to detect potential dyslexia indicators.
              </p>
              
              <h3 style={{ marginTop: 30 }}>What Does It Predict?</h3>
              <p style={{ fontSize: 16, lineHeight: 1.8 }}>
                The application predicts whether a person has <strong>high likelihood</strong> or <strong>low likelihood</strong> of dyslexia based on their performance across three tests:
              </p>
              
              <div style={{ padding: 15, background: '#f8f9fa', borderRadius: 8, marginBottom: 20 }}>
                <h4>1. Handwriting Analysis (ML-Based)</h4>
                <p>Analyzes 4 key features from uploaded writing samples:</p>
                <ul style={{ lineHeight: 1.8 }}>
                  <li><strong>Spelling Accuracy:</strong> Dyslexia indicator if ≤96.4%</li>
                  <li><strong>Grammatical Accuracy:</strong> Dyslexia indicator if ≤99.1%</li>
                  <li><strong>Correction Percentage:</strong> Dyslexia indicator if &gt;10%</li>
                  <li><strong>Phonetic Accuracy:</strong> Dyslexia indicator if &lt;85%</li>
                </ul>
                <p style={{ marginTop: 10 }}>
                  A trained Decision Tree model evaluates these features and predicts: <strong>"High likelihood of dyslexia detected"</strong> or <strong>"Low likelihood of dyslexia"</strong> with confidence score (typically 85-95%).
                </p>
              </div>

              <div style={{ padding: 15, background: '#f8f9fa', borderRadius: 8, marginBottom: 20 }}>
                <h4>2. Pronunciation Test (ML-Based)</h4>
                <p>Measures phonetic accuracy using IPA (International Phonetic Alphabet) and ML algorithms:</p>
                <ul style={{ lineHeight: 1.8 }}>
                  <li>Records your pronunciation of 10 words</li>
                  <li>Converts speech to phonetic transcription</li>
                  <li>Compares with expected pronunciation using Levenshtein distance</li>
                  <li>ML model analyzes: overall accuracy, consistency score, error rate</li>
                </ul>
                <p style={{ marginTop: 10 }}>
                  ML prediction based on: Overall accuracy &lt;70% (90% confidence), accuracy &lt;80% + error rate &gt;40% (80% confidence), or low consistency (75% confidence).
                </p>
              </div>

              <div style={{ padding: 15, background: '#f8f9fa', borderRadius: 8, marginBottom: 20 }}>
                <h4>3. Dictation Test (ML-Based)</h4>
                <p>Assesses auditory processing and spelling using ML algorithms:</p>
                <ul style={{ lineHeight: 1.8 }}>
                  <li>Listen to 10 spoken words</li>
                  <li>Type what you hear</li>
                  <li>ML model analyzes: spelling error rate, edit distance, phonetic accuracy (Soundex)</li>
                </ul>
                <p style={{ marginTop: 10 }}>
                  ML prediction based on: Accuracy &lt;60% (90% confidence), accuracy &lt;75% + error rate &gt;40% (85% confidence), or accuracy &lt;80% + phonetic accuracy &lt;50% (75% confidence).
                </p>
              </div>

              <h3 style={{ marginTop: 30 }}>Understanding Results</h3>
              <p style={{ fontSize: 16, lineHeight: 1.8 }}>
                Results include specific metrics, confidence scores, and recommendations:
              </p>
              <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
                <li><strong>High likelihood:</strong> Multiple indicators suggest dyslexia patterns → Recommendation to consult healthcare professional</li>
                <li><strong>Low likelihood:</strong> Performance within typical range → No immediate concerns, but monitoring recommended</li>
                <li><strong>Confidence Score:</strong> Model's certainty in prediction (higher = more confident)</li>
              </ul>

              <div style={{ marginTop: 30, padding: 20, background: '#fff3cd', borderRadius: 8, border: '2px solid #ffc107' }}>
                <p style={{ margin: 0, color: '#856404' }}>
                  <strong>Important:</strong> This is a preliminary screening tool, NOT a clinical diagnosis. Professional evaluation by qualified specialists is required for accurate dyslexia diagnosis.
                </p>
              </div>
            </div>
          </TabPanel>

        </Tabs>
      </main>
      <footer className="app-footer">
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>DysLexiCheck — Preliminary assessment tool. Consult professionals for diagnosis.</span>
          <img src="/im.png" alt="Logo" style={{ maxWidth: '100px', height: 'auto' }} />
        </div>
      </footer>
    </div>
  );
}
