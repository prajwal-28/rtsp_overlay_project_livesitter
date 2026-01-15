import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayLayer from './components/OverlayLayer';
import { getOverlays, createOverlay, updateOverlay, deleteOverlay } from './services/api';

// Config
const STREAM_URL = 'http://localhost:8000/stream.m3u8';

function App() {
  const [overlays, setOverlays] = useState([]);
  const [newType, setNewType] = useState('text');
  const [newContent, setNewContent] = useState('New Overlay');

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      const res = await getOverlays();
      setOverlays(res.data);
    } catch (err) {
      console.error("Failed to fetch overlays", err);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        type: newType,
        content: newContent,
        x: 50,
        y: 50,
        width: 200,
        height: 100
      };
      await createOverlay(payload);
      fetchOverlays();
    } catch (err) {
      console.error("Failed to create overlay", err);
    }
  };

  const handleUpdate = async (id, data) => {
    // Optimistic update
    setOverlays(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    try {
      await updateOverlay(id, data);
    } catch (err) {
      console.error("Failed to update overlay", err);
      fetchOverlays();
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOverlay(id);
      fetchOverlays();
    } catch (err) {
      console.error("Failed to delete overlay", err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="hero-title">RTSP Studio</h1>
        <p className="hero-subtitle">Interactive live stream management with dynamic overlays.</p>
      </header>

      <div className="main-layout">

        {/* Sidebar Controls */}
        <div className="sidebar">
          <div className="card">
            <h2 className="card-title">Add Overlay</h2>

            <div className="form-group">
              <label>Overlay Type</label>
              <select
                className="form-control"
                value={newType}
                onChange={(e) => {
                  setNewType(e.target.value);
                  if (e.target.value === 'text') setNewContent('Live Update');
                  else if (e.target.value === 'image') setNewContent('https://via.placeholder.com/150');
                }}
              >
                <option value="text">Text Label</option>
                <option value="image">Image / Logo</option>
              </select>
            </div>

            <div className="form-group">
              <label>{newType === 'image' ? 'Image URL' : 'Content Text'}</label>
              <input
                className="form-control"
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={newType === 'image' ? "https://example.com/logo.png" : "Enter text..."}
              />
            </div>

            <button className="btn btn-primary" onClick={handleAdd}>
              Create Overlay
            </button>
          </div>

          <div className="card">
            <h2 className="card-title">Stream Info</h2>
            <div style={{ fontSize: '0.9rem', color: '#8b949e', lineHeight: '1.6' }}>
              <div><strong>Status:</strong> <span style={{ color: '#238636' }}>● Active</span></div>
              <div><strong>Source:</strong> RTSP</div>
              <div><strong>Latency:</strong> Low (HLS)</div>
            </div>
          </div>
        </div>

        {/* Main Content (Video) */}
        <div>
          <div className="video-container">
            <VideoPlayer src={STREAM_URL} />
            <OverlayLayer
              overlays={overlays}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>

          <div className="status-bar">
            Development Mode: Ensure local HLS server is running at <code>streaming/hls</code> on port 8000.
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
