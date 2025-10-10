import React, { useState, useRef } from 'react';
import axios from 'axios';

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const channels = [];
  let offset = 0;
  let pos = 0;

  const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
  const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

  setUint32(0x46464952);
  setUint32(length - 8);
  setUint32(0x45564157);
  setUint32(0x20746d66);
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  setUint32(0x61746164);
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}

function PronunciationWord({ word, index, total, onResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current);
        
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const wavBlob = audioBufferToWav(audioBuffer);
          
          const formData = new FormData();
          formData.append('audio', wavBlob, 'recording.wav');

          const res = await axios.post('http://localhost:5000/api/listen', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          setTranscript(res.data.text);
        } catch (err) {
          console.error('Speech recognition error:', err);
          alert('Could not recognize speech. Try again.');
        } finally {
          setProcessing(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
    } catch (err) {
      alert('Microphone access denied');
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      const result = transcript.toLowerCase().trim();
      setTranscript('');
      setIsRecording(false);
      setProcessing(false);
      onResult(result);
    }
  };

  return (
    <div style={{ padding: 30, background: '#f9f9f9', borderRadius: 8, marginBottom: 20, border: '2px solid #667eea' }}>
      <h3 style={{ color: '#667eea' }}>Word {index + 1} of {total}</h3>
      <div style={{ fontSize: 56, fontWeight: 'bold', color: '#333', margin: '30px 0', textAlign: 'center' }}>
        {word}
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <button 
          className="streamlit-button" 
          onClick={handleRecord}
          disabled={processing}
          style={{ 
            fontSize: 18, 
            padding: '15px 40px', 
            background: isRecording ? '#dc3545' : '#667eea',
            marginBottom: 15
          }}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>
        
        {isRecording && (
          <div style={{ color: '#dc3545', fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
            🔴 Recording... Speak now!
          </div>
        )}
        
        {processing && (
          <div style={{ color: '#667eea', fontSize: 16, marginTop: 10 }}>
            Processing speech...
          </div>
        )}
      </div>

      {transcript && (
        <div style={{ marginBottom: 20, padding: 20, background: '#e7f3ff', borderRadius: 8 }}>
          <div style={{ fontSize: 16, color: '#666', marginBottom: 5 }}>You said:</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>{transcript}</div>
        </div>
      )}

      {transcript && !processing && (
        <div style={{ textAlign: 'center' }}>
          <button 
            className="streamlit-button" 
            onClick={handleSubmit}
            style={{ fontSize: 18, padding: '15px 40px', background: '#28a745' }}
          >
            ✔ Submit & Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PronunciationWord;
