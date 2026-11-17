import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Background Anime Wallpaper
  const bgImage = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2560&q=90";

  // Sakura petals particle generator
  const petals = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${7 + Math.random() * 8}s`,
    size: `${12 + Math.random() * 14}px`,
    opacity: 0.4 + Math.random() * 0.5
  }));

  const handleStartClick = () => {
    setClicked(true);
    setTimeout(() => {
      onStart();
    }, 450);
  };

  return (
    <div className="anime-hero-container">
      {/* Background Wallpaper Image */}
      <div className="anime-bg-wrapper">
        <img
          src={bgImage}
          alt="Anime Wallpaper"
          className="anime-bg-img"
        />
        {/* Cinematic Vignette and Color Grading Overlays */}
        <div className="anime-overlay-gradient" />
        <div className="anime-overlay-radial" />
        <div className="anime-overlay-scanline" />
      </div>

      {/* Floating Sakura Petals */}
      <div className="sakura-container" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className="sakura-petal"
            style={{
              left: petal.left,
              animationDelay: petal.animationDelay,
              animationDuration: petal.animationDuration,
              width: petal.size,
              height: petal.size,
              opacity: petal.opacity
            }}
          />
        ))}
      </div>

      {/* Ambient Sound Toggle Button */}
      <button
        className="sound-toggle-btn"
        onClick={() => setMusicPlaying(!musicPlaying)}
        title={musicPlaying ? "Ovozni o'chirish" : "Anime muhiti ovozi"}
      >
        {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <span className="sound-text">{musicPlaying ? "AUDIO: ON" : "AUDIO: OFF"}</span>
      </button>

      {/* Central Hero Content */}
      <div className="anime-center-content">
        <div className="japanese-badge">
          <span className="jp-text">アニメの世界</span>
          <span className="badge-divider">•</span>
          <span className="badge-en">THE WORLD OF ANIME</span>
        </div>

        <h1 className="anime-main-title">
          <span className="title-letter-glow">ANIMESHIKLAR</span>
          <span className="title-letter-gradient"> OLAMI</span>
        </h1>

        <p className="anime-subtitle">
          Cheksiz sarguzashtlar, unutilmas his-tuyg‘ular va afsonaviy qahramonlar makoni
        </p>

        <div className="decorative-neon-line">
          <span className="line-dot left" />
          <span className="line-center" />
          <Sparkles size={16} className="line-icon" />
          <span className="line-center" />
          <span className="line-dot right" />
        </div>

        {/* START BUTTON (BOSHLASH TUGMASI) */}
        <div className="btn-wrapper">
          <button
            className={`anime-start-btn ${isHovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleStartClick}
            aria-label="Animeshiklar olamini boshlash"
          >
            <span className="btn-bg-glow" />
            <span className="btn-border-glow" />
            
            <div className="btn-content">
              <span className="btn-play-icon">
                <Play size={18} fill="currentColor" />
              </span>
              <span className="btn-text">BOSHLASH</span>
              <ArrowRight size={20} className="btn-arrow-icon" />
            </div>

            <span className="btn-shine-effect" />
          </button>
        </div>

        <div className="portal-hint">
          <span>Olamga kirish uchun bosing</span>
        </div>
      </div>
    </div>
  );
}

