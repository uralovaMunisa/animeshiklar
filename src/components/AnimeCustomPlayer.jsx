// ANIMESHIKLAR OLAMI — RASMIY ANIME VIDEO PLAYER (YOUTUBESIZ, NATIVE HTML5 & DIRECT STREAMS)
// Animem.uz uslubidagi zamonaviy neon dizayn, Skip Intro (+85s), Server almashtirish va to'liq boshqaruv

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Maximize2,
  Minimize2,
  Settings,
  FastForward,
  Check,
  Tv,
  Sparkles,
  Radio,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  Layers,
  Info
} from 'lucide-react';

export default function AnimeCustomPlayer({
  episode,
  animeTitle,
  isTheaterMode,
  onToggleTheater,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode,
  hasPrevEpisode
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  // Settings dropdowns
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);

  // Custom Stream URL Modal
  const [isCustomUrlModalOpen, setIsCustomUrlModalOpen] = useState(false);
  const [customStreamUrl, setCustomStreamUrl] = useState('');
  const [activeOverrideUrl, setActiveOverrideUrl] = useState(null);

  // Default server list for episode
  const defaultServers = [
    {
      id: 'srv-animem',
      name: 'Animem Direct HD (1080p)',
      badge: 'Tavsiya etiladi',
      url: episode?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      type: 'direct'
    },
    {
      id: 'srv-fast',
      name: 'Fast Cloud Stream (720p)',
      badge: 'Tezkor',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      type: 'direct'
    },
    {
      id: 'srv-tasix',
      name: 'TAS-IX / Mover Stream',
      badge: 'TAS-IX',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'direct'
    }
  ];

  const currentServers = (episode?.servers && episode.servers.length > 0)
    ? episode.servers
    : defaultServers;

  const currentStreamSource = activeOverrideUrl || currentServers[selectedServerIdx]?.url || episode?.videoUrl;
  const isEmbedSource = currentStreamSource && (
    currentStreamSource.includes('/embed/') ||
    currentStreamSource.includes('iframe')
  );

  // Format time (mm:ss or hh:mm:ss)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Autohide controls logic
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setIsSettingsOpen(false);
        setIsServerDropdownOpen(false);
      }, 3500);
    }
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Skip Intro (+85s) — Animem.uz uslubi
  const handleSkipIntro = () => {
    if (!videoRef.current) return;
    const newTime = Math.min(videoRef.current.currentTime + 85, duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Forward / Rewind 10s
  const handleSeekOffset = (seconds) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seekbar click / scrub
  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seekbar hover preview
  const handleProgressBarHover = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(hoverX / rect.width, 1));
    setHoverPosition(hoverX);
    setHoverTime(percentage * duration);
  };

  // Volume Change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Mute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Speed Change
  const handleSpeedSelect = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSettingsOpen(false);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          handleSeekOffset(5);
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSeekOffset(-5);
          break;
        case 'arrowup':
          e.preventDefault();
          if (videoRef.current) {
            const nv = Math.min(1, volume + 0.1);
            setVolume(nv);
            videoRef.current.volume = nv;
            setIsMuted(false);
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (videoRef.current) {
            const nv = Math.max(0, volume - 0.1);
            setVolume(nv);
            videoRef.current.volume = nv;
            setIsMuted(nv === 0);
          }
          break;
        case 's':
          e.preventDefault();
          handleSkipIntro();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, volume]);

  // Reset and play when episode or stream source changes
  useEffect(() => {
    setCurrentTime(0);
    setIsBuffering(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay restrictions on unmuted video without user interaction
            setIsPlaying(false);
          });
      }
    }
  }, [episode?.id, currentStreamSource]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`anime-custom-player-root ${isFullscreen ? 'fullscreen-mode' : ''} ${isTheaterMode ? 'theater-mode' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setHoverTime(null);
      }}
    >
      {/* 1. EMBED IFRAME (Agar Mover.uz yoki ruxsat etilgan embed bo'lsa) */}
      {isEmbedSource ? (
        <div className="player-iframe-wrap">
          <iframe
            src={currentStreamSource}
            title={episode?.title || 'Anime Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="player-embed-iframe"
          />
        </div>
      ) : (
        /* 2. NATIVE HTML5 VIDEO STREAM (YOUTUBE EMAS, TO'G'RIDAN-TO'G'RI HD OQIM) */
        <div className="player-video-viewport" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={currentStreamSource}
            poster={episode?.thumbnail}
            playsInline
            autoPlay
            preload="auto"
            className="player-native-video"
            onError={() => {
              if (selectedServerIdx < currentServers.length - 1) {
                setSelectedServerIdx((prev) => prev + 1);
              }
            }}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                const p = videoRef.current.play();
                if (p !== undefined) {
                  p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                }
              }
            }}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => {
              setIsBuffering(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              if (hasNextEpisode && onNextEpisode) {
                onNextEpisode();
              }
            }}
          />

          {/* Buffering Spinner */}
          {isBuffering && (
            <div className="player-buffering-overlay">
              <div className="player-neon-spinner" />
              <span>Video yuklanmoqda...</span>
            </div>
          )}

          {/* Center Big Play Button (Paused bo'lganda) */}
          {!isPlaying && !isBuffering && (
            <div
              className="player-center-play-badge"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title="Videoni boshlash"
            >
              <div className="center-play-button">
                <Play size={36} fill="#ffffff" color="#ffffff" />
              </div>
              <span className="center-play-hint">Videoni ko‘rish (Play)</span>
            </div>
          )}
        </div>
      )}

      {/* 3. ZAMONAVIY NEON BOSHQARUV PANELI (CUSTOM CONTROLS) */}
      <div className={`player-controls-overlay ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
        {/* Yuqori Panel: Anime & Qism nomi va Server almashtirish */}
        <div className="controls-top-row">
          <div className="player-title-badge">
            <span className="badge-live-pulse" />
            <span className="anime-ep-label">
              {animeTitle || 'Anime'} • {episode?.number || 1}-Qism
            </span>
            <span className="source-label-pill">
              <ShieldCheck size={12} color="#10b981" /> HD Native Stream
            </span>
          </div>

          <div className="controls-top-actions">
            {/* Server Tanlash Dropdown */}
            <div className="server-selector-container">
              <button
                className="btn-select-server"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServerDropdownOpen(!isServerDropdownOpen);
                  setIsSettingsOpen(false);
                }}
                title="Video serverini tanlang"
              >
                <Radio size={14} color="#ff2a6d" />
                <span>{currentServers[selectedServerIdx]?.name || 'Server 1: Animem Direct HD'}</span>
                <ChevronDown size={14} />
              </button>

              {isServerDropdownOpen && (
                <div className="server-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-title">Mavjud Video Serverlari:</div>
                  {currentServers.map((srv, idx) => (
                    <button
                      key={srv.id || idx}
                      className={`server-option-btn ${selectedServerIdx === idx && !activeOverrideUrl ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedServerIdx(idx);
                        setActiveOverrideUrl(null);
                        setIsServerDropdownOpen(false);
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                        }
                      }}
                    >
                      <div className="server-option-info">
                        <span className="srv-name">{srv.name}</span>
                        <span className="srv-badge">{srv.badge || 'HD'}</span>
                      </div>
                      {selectedServerIdx === idx && !activeOverrideUrl && (
                        <Check size={14} color="#ff2a6d" />
                      )}
                    </button>
                  ))}

                  <div className="server-dropdown-footer">
                    <button
                      className="btn-add-custom-stream"
                      onClick={() => {
                        setIsServerDropdownOpen(false);
                        setIsCustomUrlModalOpen(true);
                      }}
                    >
                      <Sparkles size={13} color="#a855f7" /> Maxsus Manba Kiritish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Teatr Rejimi Tugmasi */}
            {onToggleTheater && (
              <button
                className="btn-control-icon-circle"
                onClick={onToggleTheater}
                title={isTheaterMode ? 'Standart rejim' : 'Katta oyna (Teatr)'}
              >
                {isTheaterMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* O'rta: Skip Intro (+85s) Tezkor Tugmasi */}
        <div className="controls-middle-row">
          <button
            className="btn-skip-intro-action"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipIntro();
            }}
            title="Intro / Openingni o'tkazib yuborish (S klavishi)"
          >
            <FastForward size={14} />
            <span>Intro o‘tkazish (+85s)</span>
          </button>
        </div>

        {/* Pastki Asosiy Boshqaruv Paneli */}
        <div className="controls-bottom-bar" onClick={(e) => e.stopPropagation()}>
          {/* Progress Bar (Seekbar) */}
          <div
            ref={progressBarRef}
            className="player-progress-bar-wrap"
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarHover}
            onMouseLeave={() => setHoverTime(null)}
          >
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="progress-thumb-pin"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* Hover Vaqt Tooltip */}
            {hoverTime !== null && (
              <div
                className="progress-hover-tooltip"
                style={{ left: `${hoverPosition}px` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Pastki Tugmalar Qatori */}
          <div className="controls-actions-row">
            {/* Chap tomon: Play/Pause, -10s, +10s, Volume, Vaqt */}
            <div className="actions-left-group">
              <button
                className="btn-action-primary"
                onClick={togglePlay}
                title={isPlaying ? 'Pauza (Space)' : 'Ijro etish (Space)'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#ffffff" />}
              </button>

              <button
                className="btn-action-secondary"
                onClick={() => handleSeekOffset(-10)}
                title="10 soniya orqaga"
              >
                <RotateCcw size={16} />
                <span className="seek-badge">-10</span>
              </button>

              <button
                className="btn-action-secondary"
                onClick={() => handleSeekOffset(10)}
                title="10 soniya oldinga"
              >
                <RotateCw size={16} />
                <span className="seek-badge">+10</span>
              </button>

              {/* Ovoz Boshqaruvi */}
              <div className="volume-control-box">
                <button
                  className="btn-action-secondary"
                  onClick={toggleMute}
                  title={isMuted ? "Ovozni yoqish (M)" : "Ovozni o'chirish (M)"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={18} color="#ef4444" />
                  ) : volume < 0.5 ? (
                    <Volume1 size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="player-volume-slider"
                  title="Ovoz balandligi"
                />
              </div>

              {/* Vaqt Ko'rsatkichi */}
              <div className="player-time-display">
                <span className="time-current">{formatTime(currentTime)}</span>
                <span className="time-sep">/</span>
                <span className="time-duration">{formatTime(duration)}</span>
              </div>
            </div>

            {/* O'ng tomon: Tezlik, Sozlamalar, Fullscreen */}
            <div className="actions-right-group">
              {/* Tezlik tanlash */}
              <div className="speed-selector-wrap">
                <button
                  className="btn-speed-badge"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  title="Ijro tezligi"
                >
                  <span>{playbackSpeed}x</span>
                </button>

                {isSettingsOpen && (
                  <div className="speed-dropdown-menu">
                    <div className="dropdown-title">Ijro Tezligi:</div>
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                      <button
                        key={spd}
                        className={`speed-option ${playbackSpeed === spd ? 'active' : ''}`}
                        onClick={() => handleSpeedSelect(spd)}
                      >
                        <span>{spd === 1.0 ? '1.0x (Normal)' : `${spd}x`}</span>
                        {playbackSpeed === spd && <Check size={12} color="#ff2a6d" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Tugmasi */}
              <button
                className="btn-action-secondary"
                onClick={toggleFullscreen}
                title={isFullscreen ? "To'liq ekrandan chiqish (F)" : "To'liq ekran (F)"}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAXSUS MANBA / URL KIRITISH MODALI */}
      {isCustomUrlModalOpen && (
        <div className="player-custom-url-modal-backdrop" onClick={() => setIsCustomUrlModalOpen(false)}>
          <div className="player-custom-url-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <Tv size={20} color="#ff2a6d" />
                <h3>Maxsus Video Manbasi (MP4 / HLS / Mover)</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setIsCustomUrlModalOpen(false)}>
                ✕
              </button>
            </div>

            <p className="modal-description">
              Ushbu qism uchun to‘g‘ridan-to‘g‘ri MP4 video havolasini yoki ruxsat etilgan TAS-IX (masalan, Mover.uz embed) manzilini kiritishingiz mumkin. YouTube ishlatilmaydi.
            </p>

            <div className="modal-input-wrap">
              <input
                type="text"
                placeholder="https://... (masalan: .mp4 video oqimi yoki mover.uz embed)"
                value={customStreamUrl}
                onChange={(e) => setCustomStreamUrl(e.target.value)}
                className="modal-stream-input"
              />
            </div>

            <div className="modal-quick-suggestions">
              <span className="sug-label">Tezkor sinov manbalari:</span>
              <button
                className="sug-pill"
                onClick={() => setCustomStreamUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4')}
              >
                Sintel HD (1080p)
              </button>
              <button
                className="sug-pill"
                onClick={() => setCustomStreamUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4')}
              >
                Tears of Steel (HD)
              </button>
            </div>

            <div className="modal-actions-footer">
              <button
                className="btn-cancel"
                onClick={() => setIsCustomUrlModalOpen(false)}
              >
                Bekor qilish
              </button>
              <button
                className="btn-confirm-stream"
                onClick={() => {
                  if (customStreamUrl.trim()) {
                    setActiveOverrideUrl(customStreamUrl.trim());
                    setIsCustomUrlModalOpen(false);
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }
                }}
              >
                Oqimni Yoqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

