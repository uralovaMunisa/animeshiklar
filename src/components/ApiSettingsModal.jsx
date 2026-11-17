import React, { useState } from 'react';
import { X, Key, Check, Info, ExternalLink, Film, Tv, Image as ImageIcon } from 'lucide-react';
import {
  getYouTubeApiKey,
  saveYouTubeApiKey,
  getTmdbApiKey,
  saveTmdbApiKey,
  getPexelsApiKey,
  savePexelsApiKey
} from '../services/apiService';

export default function ApiSettingsModal({ isOpen, onClose, onSaveSuccess }) {
  const [ytKey, setYtKey] = useState(getYouTubeApiKey());
  const [tmdbKey, setTmdbKey] = useState(getTmdbApiKey());
  const [pexelsKey, setPexelsKey] = useState(getPexelsApiKey());

  if (!isOpen) return null;

  const handleSave = () => {
    saveYouTubeApiKey(ytKey);
    saveTmdbApiKey(tmdbKey);
    savePexelsApiKey(pexelsKey);
    if (onSaveSuccess) onSaveSuccess('Barcha API sozlamalari muvaffaqiyatli saqlandi! ✅');
    onClose();
  };

  return (
    <div className="modal-backdrop-blur" onClick={onClose}>
      <div className="api-settings-box" onClick={(e) => e.stopPropagation()}>
        <button className="player-close-btn" onClick={onClose} title="Yopish">
          <X size={20} />
        </button>

        <div className="api-settings-header">
          <div className="api-header-icon">
            <Key size={22} color="#ff3366" />
          </div>
          <div>
            <h3>Professional API Kalitlari Sozlamasi</h3>
            <p>YouTube Data API v3, TMDB Movies va Pexels Images ulash</p>
          </div>
        </div>

        <div className="api-settings-body">
          <div className="api-info-alert">
            <Info size={18} className="info-icon" />
            <span>
              Standart rejimda loyiha bepul ochiq internet qidiruvi va katalogidan foydalanadi. Rasmiy API kalitlaringizni kiritsangiz, platforma to'g'ridan-to'g'ri rasmiy serverlarga ulanadi.
            </span>
          </div>

          {/* 1. YouTube API */}
          <div className="api-input-group">
            <label className="api-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tv size={15} color="#ef4444" /> YouTube Data API v3 Kaliti:
              </span>
              <a
                href="https://developers.google.com/youtube/v3"
                target="_blank"
                rel="noreferrer"
                className="api-help-link"
              >
                Hujjatlar <ExternalLink size={12} />
              </a>
            </label>
            <input
              type="password"
              className="api-text-input"
              placeholder="AIzaSy... (Ixtiyoriy)"
              value={ytKey}
              onChange={(e) => setYtKey(e.target.value)}
            />
          </div>

          {/* 2. TMDB API */}
          <div className="api-input-group">
            <label className="api-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Film size={15} color="#3b82f6" /> TheMovieDB (TMDB) API Kaliti:
              </span>
              <a
                href="https://developer.themoviedb.org/docs"
                target="_blank"
                rel="noreferrer"
                className="api-help-link"
              >
                TMDB Docs <ExternalLink size={12} />
              </a>
            </label>
            <input
              type="password"
              className="api-text-input"
              placeholder="TMDB Read Access Token yoki API Key (Ixtiyoriy)"
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
            />
          </div>

          {/* 3. Pexels API */}
          <div className="api-input-group">
            <label className="api-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={15} color="#10b981" /> Pexels Images API Kaliti:
              </span>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noreferrer"
                className="api-help-link"
              >
                Pexels API <ExternalLink size={12} />
              </a>
            </label>
            <input
              type="password"
              className="api-text-input"
              placeholder="Pexels API Key (Ixtiyoriy)"
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
            />
          </div>
        </div>

        <div className="api-settings-footer">
          <button className="btn-cancel" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn-save-api" onClick={handleSave}>
            <Check size={16} /> Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
