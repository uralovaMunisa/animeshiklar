// ANIMESHIKLAR OLAMI — ANIME TAFSILOTLARI VA PLAYER SAHIFASI
// https://www.animem.uz/anime/olmas-qirolning-kundalik-hayoti-1-fasl NAMUNASI ASOSIDA 100% MOSLASHTIRILGAN

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Heart,
  Bookmark,
  BookmarkCheck,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Share2,
  Tv,
  Film,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  ChevronDown,
  Moon,
  Sun,
  Eye,
  Info,
  Check,
  Search,
  Bell,
  Radio
} from 'lucide-react';
import { getAnimeById, getAllUnifiedAnimes } from '../data/animeCatalogData.js';
import {
  getSavedItems,
  toggleSaveItem,
  getLikedItemIds,
  toggleLikeItem,
  addToWatchHistory
} from '../services/storageService.js';
import VideoComments from './VideoComments.jsx';
import AnimeCustomPlayer from './AnimeCustomPlayer.jsx';

export default function AnimeDetailScreen({
  animeId,
  onBack,
  onSelectAnime,
  onOpenShopping,
  onOpenProfile
}) {
  const anime = getAnimeById(animeId);

  // Tanlangan fasl va qism
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDub, setSelectedDub] = useState('uzbek'); // 'uzbek' | 'sub'

  // Saqlanganlar va Yoqtirilganlar
  const [savedItems, setSavedItems] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const playerRef = useRef(null);

  useEffect(() => {
    setSelectedSeasonIdx(0);
    setSelectedEpisodeIdx(0);
    setIsTheaterMode(false);
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setSavedItems(getSavedItems());
    setLikedIds(getLikedItemIds());

    if (anime) {
      addToWatchHistory({
        id: anime.id,
        title: anime.title,
        thumbnail: anime.poster,
        itemType: anime.type || 'series'
      });
    }
  }, [animeId]);

  if (!anime) {
    return (
      <div className="anime-not-found-screen">
        <div className="not-found-box">
          <Film size={54} color="#ff3366" />
          <h2>Anime topilmadi</h2>
          <p>Kechirasiz, tanlangan anime ma'lumotlari bazadan topilmadi.</p>
          <button className="btn-return-home" onClick={onBack}>
            <ArrowLeft size={18} /> Katalogga Qaytish
          </button>
        </div>
      </div>
    );
  }

  const currentSeason = anime.seasons && anime.seasons[selectedSeasonIdx]
    ? anime.seasons[selectedSeasonIdx]
    : { title: '1-Fasl', episodes: [] };

  const currentEpisode = currentSeason.episodes && currentSeason.episodes[selectedEpisodeIdx]
    ? currentSeason.episodes[selectedEpisodeIdx]
    : null;

  const totalEpisodesInSeason = currentSeason.episodes?.length || 0;

  // Like & Save
  const isLiked = likedIds.has(anime.id);
  const isSaved = savedItems.some((i) => i.id === anime.id);

  const handleToggleLike = () => {
    const { likedSet, isLiked: nextLiked } = toggleLikeItem(anime.id);
    setLikedIds(new Set(likedSet));
    showToast(nextLiked ? '❤️ Sevimlilar ro‘yxatiga qo‘shildi!' : 'Sevimlilardan olib tashlandi');
  };

  const handleToggleSave = () => {
    const normalized = {
      ...anime,
      itemType: anime.type || 'series'
    };
    const { updated, isSaved: nextSaved } = toggleSaveItem(normalized);
    setSavedItems(updated);
    showToast(nextSaved ? '🍿 Ro‘yxatga saqlandi!' : 'Ro‘yxatdan olib tashlandi');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Havola nusxalandi!');
    }
  };

  // Qismni tanlash va to'g'ridan-to'g'ri ijro etish
  const handleSelectEpisode = (epIdx) => {
    setSelectedEpisodeIdx(epIdx);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Oldingi qism
  const handlePrevEpisode = () => {
    if (selectedEpisodeIdx > 0) {
      handleSelectEpisode(selectedEpisodeIdx - 1);
    }
  };

  // Keyingi qism
  const handleNextEpisode = () => {
    if (selectedEpisodeIdx < totalEpisodesInSeason - 1) {
      handleSelectEpisode(selectedEpisodeIdx + 1);
    }
  };

  // O'xshash tavsiya etiladigan animelar (skrinshotdagi kabi)
  const allAnimes = getAllUnifiedAnimes();
  const relatedAnimes = allAnimes
    .filter((a) => a.id !== anime.id)
    .slice(0, 6);

  return (
    <div className={`animem-detail-page ${isTheaterMode ? 'theater-active' : ''}`}>
      {/* Toast Notification */}
      {toast && (
        <div className="videos-toast">
          <Sparkles size={18} className="toast-sparkle-icon" />
          <span>{toast}</span>
        </div>
      )}

      {/* ========================================================
          1. ANIMEM.UZ RASMIY NAVBAR (SKRINSHOTDAGI KABI)
         ======================================================== */}
      <header className="animem-official-header">
        <div className="animem-header-left">
          {/* Logo */}
          <div className="animem-brand-logo" onClick={onBack} title="Bosh sahifaga qaytish">
            <div className="brand-logo-icon">
              <Film size={20} color="#ffffff" />
            </div>
            <span className="brand-title">ANIMEM<span className="brand-dot">.UZ</span></span>
          </div>

          {/* Menyu Bo'limlari */}
          <nav className="animem-nav-menu">
            <button className="animem-menu-item active" onClick={onBack}>
              Bosh sahifa
            </button>
            <button className="animem-menu-item" onClick={onBack}>
              Animelar
            </button>
            <button className="animem-menu-item" onClick={onBack}>
              Jadval
            </button>
            <button className="animem-menu-item" onClick={onBack}>
              Yangi chiqishlar
            </button>
            <button className="animem-menu-item" onClick={onBack}>
              Top 100
            </button>
            <button className="animem-menu-item highlight-reels" onClick={onBack}>
              Reels <span className="hot-tag">HOT</span>
            </button>
            <button className="animem-menu-item" onClick={onBack}>
              Musiqa
            </button>
          </nav>
        </div>

        {/* Qidiruv va Profil */}
        <div className="animem-header-right">
          <div className="animem-search-box">
            <input
              type="text"
              placeholder="Anime yoki manga qidirish..."
              className="animem-search-field"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onBack();
                }
              }}
            />
            <Search size={16} className="animem-search-icon" />
          </div>

          <div className="animem-lang-badge">UZ</div>

          <div className="animem-notif-bell" title="Bildirishnomalar">
            <Bell size={18} />
            <span className="notif-counter">4</span>
          </div>

          <button className="animem-login-btn" onClick={onOpenProfile}>
            KIRISH
          </button>

          <button className="animem-register-btn" onClick={onOpenProfile}>
            RO'YXATDAN O'TISH
          </button>
        </div>
      </header>

      {/* ========================================================
          2. ASOSIY HERO BANNER (SKRINSHOTDAGI KABI NEON-PINK RAMKA VA BADGELAR)
         ======================================================== */}
      <section className="animem-hero-banner">
        <div className="animem-hero-backdrop">
          <img
            src={anime.backdrop || anime.poster}
            alt={anime.title}
            className="animem-backdrop-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85';
            }}
          />
          <div className="animem-backdrop-overlay" />
        </div>

        <div className="animem-hero-inner">
          {/* Neon Pink Glowing Poster Card */}
          <div className="animem-poster-wrap">
            <div className="animem-neon-poster-box">
              <img
                src={anime.poster}
                alt={anime.title}
                className="animem-poster-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85';
                }}
              />
            </div>
          </div>

          {/* O'ng tomon: Meta nishonlar, Sarlavha, Janrlar, Tugmalar */}
          <div className="animem-hero-details">
            {/* Badgelar satri */}
            <div className="animem-meta-badges-row">
              <span className="badge-efirda">
                <Radio size={12} className="live-dot" /> {anime.status || 'EFIRDA'}
              </span>
              <span className="badge-rating-gold">
                <Star size={13} fill="#fbbf24" color="#fbbf24" /> {anime.rating || '10.0'}
              </span>
              <span className="badge-meta-pill">
                <Calendar size={13} /> {anime.year || 2025}
              </span>
              <span className="badge-meta-pill">
                {anime.type === 'movie' ? 'Film' : 'TV Serial'}
              </span>
              <span className="badge-meta-pill">
                <Eye size={13} /> {anime.viewsCount || '393 ta ko‘rish'}
              </span>
            </div>

            {/* Katta Oq Sarlavha */}
            <h1 className="animem-main-title">
              {anime.title}
            </h1>

            {/* Subtitle */}
            <div className="animem-original-sub">
              {anime.originalName || anime.japaneseTitle || 'Original nomi • TV Serial'}
            </div>

            {/* Janrlar satri (kulrang yumaloq pills) */}
            <div className="animem-genres-pill-row">
              {(anime.genres || [anime.genre, 'Jangari', 'Komediya', 'Fantastika']).map((g) => (
                <span key={g} className="animem-genre-tag-pill">
                  {g}
                </span>
              ))}
            </div>

            {/* Yulduzchalar va Baholar */}
            <div className="animem-stars-rating-row">
              <div className="stars-group">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
              </div>
              <span className="stars-count-text">({anime.votes || '1 baho'})</span>
            </div>

            {/* 4 TA ASOSIY TUGMA (SKRINSHOTDAGI KABI) */}
            <div className="animem-action-buttons-row">
              {/* 1. Tomosha qilish (Pink-Purple Gradient) */}
              <button
                className="btn-animem-watch-now"
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <Play size={18} fill="#ffffff" />
                <span>TOMOSHA QILISH</span>
              </button>

              {/* 2. Ro'yxatga qo'shish */}
              <div className="dropdown-action-wrap">
                <button
                  className="btn-animem-dropdown"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Bookmark size={16} />
                  <span>RO'YXATGA QO'SHISH</span>
                  <ChevronDown size={14} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu-list">
                    <button onClick={() => { handleToggleSave(); setIsDropdownOpen(false); }}>
                      <Check size={14} /> Tomosha qilyapman
                    </button>
                    <button onClick={() => { handleToggleSave(); setIsDropdownOpen(false); }}>
                      <Bookmark size={14} /> Ko'rmoqchiman
                    </button>
                    <button onClick={() => { handleToggleLike(); setIsDropdownOpen(false); }}>
                      <Heart size={14} /> Sevimlilar
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Sevimlilar */}
              <button
                className={`btn-animem-favorite ${isLiked ? 'liked' : ''}`}
                onClick={handleToggleLike}
              >
                <Heart size={16} fill={isLiked ? '#ff3366' : 'none'} color={isLiked ? '#ff3366' : '#ffffff'} />
                <span>SEVIMLILAR</span>
              </button>

              {/* 4. Birga ko'rish */}
              <button className="btn-animem-watch-together" onClick={handleShare}>
                <Users size={16} />
                <span>BIRGA KO'RISH</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. IKKI USTUNLI PLAYER VA O'XSHASH ANIMELAR BO'LIMI
         ======================================================== */}
      <section className="animem-player-section" ref={playerRef}>
        <div className="animem-content-grid-container">
          {/* CHAP USTUN: VIDEO PLAYER, QISMLAR VA TAVSIF (75%) */}
          <div className="animem-player-column">
            {/* Player Yuqori Paneli */}
            <div className="animem-player-topbar">
              <div className="player-left-label">
                <div className="red-circle-dot" />
                <span className="player-title-text">PLAYER</span>
                <span className="player-now-watching-tag">
                  EP {currentEpisode ? currentEpisode.number : 1} TOMOSHA QILINMOQDA
                </span>
              </div>

              <div className="player-right-tools">
                <button className="tool-btn" onClick={handleShare} title="Ulashish">
                  <Share2 size={14} />
                  <span>Ulashish</span>
                </button>
                <button
                  className="tool-btn"
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  title="Katta oyna"
                >
                  <Maximize2 size={14} />
                  <span>Katta oyna (Teatr)</span>
                </button>
                <button
                  className="tool-btn"
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  title="Chiroqni o'chirish"
                >
                  {isTheaterMode ? <Sun size={14} /> : <Moon size={14} />}
                  <span>{isTheaterMode ? 'Chiroqni yoqish' : "Chiroqni o'chirish"}</span>
                </button>
              </div>
            </div>

            {/* Asosiy Video Player Ekrani (YouTube ishlatilmaydi, Native Anime Player) */}
            <div className="animem-video-screen-wrapper">
              <AnimeCustomPlayer
                episode={currentEpisode}
                animeTitle={anime.title}
                isTheaterMode={isTheaterMode}
                onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                onNextEpisode={handleNextEpisode}
                onPrevEpisode={handlePrevEpisode}
                hasNextEpisode={selectedEpisodeIdx < totalEpisodesInSeason - 1}
                hasPrevEpisode={selectedEpisodeIdx > 0}
              />
            </div>

            {/* Player Ostidagi Qismlar va Ovoz Boshqaruvi */}
            <div className="animem-episodes-control-box">
              {/* Fasl tanlash (Mavsumlar) */}
              <div className="animem-seasons-row">
                <span className="control-label">Fasl:</span>
                <div className="seasons-pill-group">
                  {(anime.seasons || [{ seasonNumber: 1, title: '1-Fasl' }]).map((season, idx) => (
                    <button
                      key={idx}
                      className={`season-choice-btn ${selectedSeasonIdx === idx ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSeasonIdx(idx);
                        setSelectedEpisodeIdx(0);
                      }}
                    >
                      {season.title || `${idx + 1}-Fasl`}
                    </button>
                  ))}
                </div>

                {/* Dublyaj / Til tanlovi */}
                <div className="dub-toggle-group">
                  <button
                    className={`dub-btn ${selectedDub === 'uzbek' ? 'active' : ''}`}
                    onClick={() => setSelectedDub('uzbek')}
                  >
                    O'zbekcha Dublyaj
                  </button>
                  <button
                    className={`dub-btn ${selectedDub === 'sub' ? 'active' : ''}`}
                    onClick={() => setSelectedDub('sub')}
                  >
                    Subtitr
                  </button>
                </div>
              </div>

              {/* Qismlar Ro'yxati (1-qism, 2-qism, 3-qism...) */}
              <div className="animem-episodes-pills-wrap">
                <span className="control-label">Qismlar:</span>
                <div className="episodes-scroll-track">
                  {currentSeason.episodes?.map((ep, idx) => {
                    const isActive = selectedEpisodeIdx === idx;
                    return (
                      <button
                        key={ep.id || idx}
                        className={`ep-pill-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleSelectEpisode(idx)}
                      >
                        <span>{ep.number || idx + 1}-qism</span>
                        {isActive && <div className="active-dot" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Oldingi va Keyingi Qism navigatsiyasi */}
              <div className="animem-episode-nav-footer">
                <button
                  className="btn-nav-ep"
                  onClick={handlePrevEpisode}
                  disabled={selectedEpisodeIdx === 0}
                >
                  <ChevronLeft size={16} /> Oldingi qism
                </button>

                <div className="now-ep-indicator">
                  Hozir: <strong>{currentEpisode ? currentEpisode.title : '1-Qism'}</strong>
                </div>

                <button
                  className="btn-nav-ep"
                  onClick={handleNextEpisode}
                  disabled={selectedEpisodeIdx >= totalEpisodesInSeason - 1}
                >
                  Keyingi qism <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Anime Tavsifi */}
            <div className="animem-synopsis-box">
              <h3 className="synopsis-heading">
                <Info size={18} color="#ff3366" />
                <span>Anime Haqida Ma'lumot</span>
              </h3>
              <p className="synopsis-text">{anime.overview}</p>

              <div className="anime-staff-inline">
                <div>
                  <span className="staff-title">Studiya:</span>
                  <strong className="staff-name">{anime.studio || 'Animation Studio'}</strong>
                </div>
                <div>
                  <span className="staff-title">Rejissyor:</span>
                  <strong className="staff-name">{anime.director || 'Director'}</strong>
                </div>
                <div>
                  <span className="staff-title">Ovoz berish:</span>
                  <strong className="staff-name">{anime.dubbing || "O'zbekcha"}</strong>
                </div>
              </div>
            </div>

            {/* Fikrlar / Izohlar (Comments) */}
            <div className="animem-comments-container">
              <VideoComments targetId={anime.id} targetTitle={anime.title} />
            </div>
          </div>

          {/* O'NG USTUN: O'XSHASH ANIMELAR (25% - SKRINSHOTDAGI KABI) */}
          <div className="animem-sidebar-column">
            <div className="similar-animes-header">
              <Star size={18} fill="#ff3366" color="#ff3366" />
              <span>O'XSHASH ANIMELAR</span>
            </div>

            <div className="similar-animes-list">
              {relatedAnimes.map((rel) => (
                <div
                  key={rel.id}
                  className="similar-anime-card-item"
                  onClick={() => onSelectAnime && onSelectAnime(rel.id)}
                  title={rel.title}
                >
                  <div className="similar-poster-box">
                    <img
                      src={rel.poster}
                      alt={rel.title}
                      className="similar-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <span className="similar-rating">
                      <Star size={11} fill="#fbbf24" color="#fbbf24" /> {rel.rating || '9.0'}
                    </span>
                  </div>

                  <div className="similar-info-box">
                    <h4 className="similar-title">{rel.title}</h4>
                    <span className="similar-sub">{rel.uzbekTitle || rel.genre}</span>
                    <span className="similar-year">{rel.year || '2025'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
