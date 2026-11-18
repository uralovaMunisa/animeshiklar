// ANIMESHIKLAR OLAMI — MOVIES & CINEMA SCREEN (ANIMEM.UZ USLUBIDA JANRLAR)
// Komediya, Jangari, Sarguzasht, Fantastika, Romantika va boshqa janrlar bo'yicha to'liq bo'lingan anime filmlar platformasi

import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Search,
  Star,
  Play,
  ArrowLeft,
  X,
  Heart,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ExternalLink,
  Clock,
  Layers,
  Flame,
  Smile,
  Compass,
  Trophy,
  GraduationCap,
  Globe,
  Ghost,
  Key,
  ShoppingBag,
  Tv,
  Check,
  Share2,
  Tv2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { MOVIE_GENRES, ANIME_MOVIES_DATA } from '../data/moviesData';
import { fetchAnimeMovies } from '../services/apiService';
import {
  getSavedItems,
  toggleSaveItem,
  getLikedItemIds,
  toggleLikeItem,
  addToWatchHistory
} from '../services/storageService';
import ApiSettingsModal from './ApiSettingsModal';
import VideoComments from './VideoComments';

export default function MoviesScreen({
  onBackToHome,
  onBackToIntro,
  onOpenVideos,
  onOpenShopping,
  onOpenProfile,
  onSelectAnime
}) {
  const [selectedGenre, setSelectedGenre] = useState('Barchasi');
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'top' | 'premiere'
  const [searchQuery, setSearchQuery] = useState('');
  const [moviesList, setMoviesList] = useState(ANIME_MOVIES_DATA);
  const [activeMovieDetail, setActiveMovieDetail] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  // Universal Saqlanganlar va Yoqtirilganlar
  const [savedItems, setSavedItems] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());

  // TMDB API Sozlamalari Modali
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Toast xabarlari
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    setSavedItems(getSavedItems());
    setLikedIds(getLikedItemIds());
  }, []);

  // Janr bo'yicha hisoblagich (animem.uz uslubidagi aniq miqdorlar)
  const genreCounts = useMemo(() => {
    const counts = { Barchasi: ANIME_MOVIES_DATA.length };
    MOVIE_GENRES.forEach((g) => {
      if (g === 'Barchasi') return;
      counts[g] = ANIME_MOVIES_DATA.filter(
        (m) =>
          m.genre.toLowerCase() === g.toLowerCase() ||
          (m.genres && m.genres.some((subG) => subG.toLowerCase() === g.toLowerCase()))
      ).length;
    });
    return counts;
  }, []);

  // Qidiruv va Filtr
  const executeFilter = async (queryText = searchQuery, genreName = selectedGenre, quick = quickFilter) => {
    const res = await fetchAnimeMovies({ query: queryText, genre: genreName });
    let filtered = [...res];

    if (quick === 'top') {
      filtered = filtered.filter((m) => m.rating >= 8.5);
    } else if (quick === 'premiere') {
      filtered = filtered.filter((m) => m.year >= 2023);
    }

    setMoviesList(filtered);
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    await executeFilter(searchQuery, selectedGenre, quickFilter);
    showToast(`Qidiruv: "${searchQuery || 'Barcha kinolar'}"`);
  };

  const handleSelectGenre = async (genre) => {
    setSelectedGenre(genre);
    await executeFilter(searchQuery, genre, quickFilter);
    showToast(`Janr: ${genre} (${genreCounts[genre] || 0} ta anime)`);
  };

  const handleSelectQuickFilter = async (filterKey) => {
    setQuickFilter(filterKey);
    await executeFilter(searchQuery, selectedGenre, filterKey);
  };

  const handleToggleLike = (id, e) => {
    e?.stopPropagation();
    const { likedSet, isLiked } = toggleLikeItem(id);
    setLikedIds(new Set(likedSet));
    showToast(isLiked ? '❤️ Film sevimlilarga qo‘shildi!' : 'Sevimlilardan olib tashlandi');
  };

  const handleToggleSave = (movie, e) => {
    e?.stopPropagation();
    const normalized = {
      ...movie,
      itemType: 'movie'
    };
    const { updated, isSaved } = toggleSaveItem(normalized);
    setSavedItems(updated);
    showToast(isSaved ? '🍿 Film saqlanganlarga qo‘shildi!' : 'Saqlanganlardan olib tashlandi');
  };

  const handleOpenMovie = (movie) => {
    setActiveMovieDetail(movie);
    setIsTrailerOpen(false);
    const initialEp = Array.isArray(movie.episodes) && movie.episodes.length > 0 ? movie.episodes[0] : null;
    setSelectedEpisode(initialEp);
    addToWatchHistory({
      id: movie.id,
      title: movie.title,
      thumbnail: movie.poster,
      itemType: 'movie'
    });
  };

  const handleShareMovie = (movie, e) => {
    e?.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#movies?id=${movie.id}`);
      showToast('🔗 Havola xotiraga nusxalandi!');
    }
  };

  const isSavedCheck = (id) => savedItems.some((i) => i.id === id);

  // Janr ikonkasini tanlash
  const getGenreIcon = (genre) => {
    switch (genre) {
      case 'Barchasi':
        return <Layers size={15} />;
      case 'Komediya':
        return <Smile size={15} color="#fbbf24" />;
      case 'Jangari':
        return <Flame size={15} color="#ef4444" />;
      case 'Sarguzasht':
        return <Compass size={15} color="#3b82f6" />;
      case 'Fantastika':
        return <Sparkles size={15} color="#a855f7" />;
      case 'Romantika':
        return <Heart size={15} color="#ec4899" />;
      case 'Drama':
        return <Film size={15} color="#06b6d4" />;
      case 'Dahshat & Triller':
        return <Ghost size={15} color="#94a3b8" />;
      case 'Isekai':
        return <Globe size={15} color="#10b981" />;
      case 'Sport':
        return <Trophy size={15} color="#f59e0b" />;
      case 'Maktab':
        return <GraduationCap size={15} color="#8b5cf6" />;
      default:
        return <Film size={15} />;
    }
  };

  return (
    <div className="movies-page-container">
      {/* Toast Notification */}
      {toast && (
        <div className="videos-toast">
          <Sparkles size={18} className="toast-sparkle-icon" />
          <span>{toast}</span>
        </div>
      )}

      {/* TMDB API Sozlamalar Modali */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSaveSuccess={(msg) => showToast(msg)}
      />

      {/* ========================================================
          1. TOPBAR — ASOSIY NAVIGATSIYA VA QIDIRUV
         ======================================================== */}
      <header className="videos-topbar">
        <div className="videos-topbar-left">
          <button className="nav-back-button" onClick={onBackToHome} title="Bosh sahifaga qaytish">
            <ArrowLeft size={18} />
            <span>Bosh Sahifa</span>
          </button>

          <button className="nav-intro-pill" onClick={onBackToIntro} title="Intro sahifasiga qaytish">
            Intro
          </button>

          <div className="videos-brand-badge" onClick={onBackToHome}>
            <div className="brand-icon-box movie-gradient">
              <Film size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-main">ANIMESHIKLAR</span>
              <span className="brand-sub">KINOLAR • ANIMEM.UZ</span>
            </div>
          </div>
        </div>

        {/* Film Qidiruv Paneli */}
        <form className="videos-search-container" onSubmit={handleSearch}>
          <div className="videos-search-box">
            <Search size={18} className="search-lead-icon" />
            <input
              type="text"
              className="videos-search-input"
              placeholder="Anime filmlarini qidiring (masalan: KonoSuba, Spy x Family, Jujutsu Kaisen, Mugen Train)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-reset-button"
                onClick={() => {
                  setSearchQuery('');
                  executeFilter('', selectedGenre, quickFilter);
                }}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-action-btn movie-btn">
              Kino Qidirish
            </button>
          </div>
        </form>

        {/* Topbar O'ng Tomondagi Havolalar */}
        <div className="videos-topbar-right">
          <button
            className="video-stats-pill click-pill"
            onClick={() => onOpenVideos && onOpenVideos()}
            title="Animem.uz Videolar Hubi"
          >
            <Tv size={16} color="#ef4444" />
            <span>Videolar</span>
          </button>

          <button
            className="video-stats-pill click-pill"
            onClick={() => onOpenShopping && onOpenShopping()}
            title="Anime Internet Do'koni"
          >
            <ShoppingBag size={16} color="#10b981" />
            <span>Do'kon</span>
          </button>

          <button
            className="video-stats-pill click-pill"
            onClick={() => setIsApiModalOpen(true)}
            title="TMDB API Sozlamasi"
          >
            <Key size={16} color="#ff3366" />
            <span>TMDB API</span>
          </button>

          <div
            className="video-stats-pill click-pill"
            onClick={() => showToast(`Yoqtirilgan kinolar soni: ${likedIds.size}`)}
            title="Yoqtirilganlar"
          >
            <Heart size={16} color="#ec4899" fill={likedIds.size > 0 ? '#ec4899' : 'none'} />
            <span>{likedIds.size}</span>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. JANRLAR CHIPS BAR (animem.uz uslubida bo'lingan)
         ======================================================== */}
      <section className="videos-categories-bar movie-genres-bar">
        <div className="categories-scroll-wrapper">
          {MOVIE_GENRES.map((g) => {
            const count = genreCounts[g] || 0;
            const isActive = selectedGenre === g;

            return (
              <button
                key={g}
                className={`category-pill-btn genre-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectGenre(g)}
              >
                <span className="genre-chip-icon">{getGenreIcon(g)}</span>
                <span className="genre-chip-name">{g}</span>
                <span className="genre-chip-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. TEZKOR SARALASH FILTERLARI (Quick filters)
         ======================================================== */}
      <div className="movie-subfilters-bar">
        <div className="subfilter-chips-wrap">
          <button
            className={`subfilter-pill ${quickFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleSelectQuickFilter('all')}
          >
            Barchasi
          </button>
          <button
            className={`subfilter-pill ${quickFilter === 'top' ? 'active' : ''}`}
            onClick={() => handleSelectQuickFilter('top')}
          >
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>Top Reyting (8.5+)</span>
          </button>
          <button
            className={`subfilter-pill ${quickFilter === 'premiere' ? 'active' : ''}`}
            onClick={() => handleSelectQuickFilter('premiere')}
          >
            <Sparkles size={13} color="#ff3366" />
            <span>Premyeralar (2023-2024)</span>
          </button>
        </div>

        <div className="animem-source-indicator">
          <Tv2 size={15} color="#3b82f6" />
          <span>Animem.uz & TMDB Anime Katalogi</span>
        </div>
      </div>

      {/* ========================================================
          4. ASOSIY KINOLAR GRIDI
         ======================================================== */}
      <main className="videos-main-content">
        <div className="videos-info-header">
          <div className="info-left-group">
            <h1 className="current-category-title">
              🍿 {selectedGenre === 'Barchasi' ? 'Barcha Anime Kinolari' : `${selectedGenre} Janridagi Kinolar`} ({moviesList.length})
            </h1>
            <span className="results-badge">
              {selectedGenre === 'Komediya'
                ? 'Animem.uz Comedy to‘plami'
                : selectedGenre === 'Jangari'
                ? 'Jangari & Epik janglar'
                : 'Yuqori sifatli Full HD / 4K'}
            </span>
          </div>

          <div className="movie-grid-meta-note">
            <span>Har bir kartochkani bosib, rasmiy treylerini ko'rishingiz va Animem.uz platformasida tomosha qilishingiz mumkin.</span>
          </div>
        </div>

        {/* Agar kinolar topilmasa */}
        {moviesList.length === 0 ? (
          <div className="no-movies-box">
            <Film size={48} color="#64748b" />
            <h3>Ushbu so'rov bo'yicha anime filmlari topilmadi</h3>
            <p>Boshqa nom yoki boshqa janrni tanlab ko'ring.</p>
            <button
              className="btn-watch-trailer"
              onClick={() => {
                setSelectedGenre('Barchasi');
                setQuickFilter('all');
                setSearchQuery('');
                setMoviesList(ANIME_MOVIES_DATA);
              }}
            >
              Barcha Kinolarni Ko'rsatish
            </button>
          </div>
        ) : (
          <div className="movies-grid-layout">
            {moviesList.map((movie) => {
              const isLiked = likedIds.has(movie.id);
              const isSaved = isSavedCheck(movie.id);

              return (
                <div
                  key={movie.id}
                  className="movie-poster-card"
                  onClick={() => (onSelectAnime ? onSelectAnime(movie.id) : handleOpenMovie(movie))}
                >
                  <div className="movie-poster-box">
                    <img src={movie.poster} alt={movie.title} className="movie-poster-img" loading="lazy" />
                    <div className="movie-poster-gradient" />

                    {/* Reyting belgisi */}
                    <div className="movie-rating-badge">
                      <Star size={13} fill="#fbbf24" color="#fbbf24" />
                      <span>{movie.rating}</span>
                    </div>

                    {/* Yili belgisi */}
                    <span className="movie-year-badge">{movie.year}</span>

                    {/* Sifat belgisi */}
                    <span className="movie-quality-badge">{movie.quality || 'Full HD'}</span>

                    {/* Hover paytidagi Play nishoni */}
                    <div className="movie-play-glow">
                      <Play size={24} fill="#ffffff" color="#ffffff" />
                    </div>

                    {/* Like & Save tugmalari */}
                    <div className="movie-card-actions">
                      <button
                        className={`action-btn-bubble ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => handleToggleLike(movie.id, e)}
                        title="Like"
                      >
                        <Heart
                          size={16}
                          fill={isLiked ? '#ff3366' : 'none'}
                          color={isLiked ? '#ff3366' : '#ffffff'}
                        />
                      </button>
                      <button
                        className={`action-btn-bubble ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => handleToggleSave(movie, e)}
                        title="Saqlash"
                      >
                        {isSaved ? <BookmarkCheck size={16} color="#ff3366" /> : <Bookmark size={16} color="#ffffff" />}
                      </button>
                      <button
                        className="action-btn-bubble"
                        onClick={(e) => handleShareMovie(movie, e)}
                        title="Ulashish"
                      >
                        <Share2 size={16} color="#ffffff" />
                      </button>
                    </div>
                  </div>

                  <div className="movie-card-info">
                    <h3 className="movie-title" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="movie-sub-info">
                      <span className="movie-genre">{movie.genre}</span>
                      <span className="dot-sep">•</span>
                      <span className="movie-duration">
                        <Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                        {movie.duration}
                      </span>
                    </div>

                    {/* Janr teglari */}
                    {movie.genres && movie.genres.length > 0 && (
                      <div className="movie-card-tags">
                        {movie.genres.slice(0, 3).map((tg) => (
                          <span key={tg} className="movie-mini-tag">
                            {tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================
          5. ANIME KINO TAFSILOTLARI VA TREYLER / PLAYER MODALI
         ======================================================== */}
      {activeMovieDetail && (
        <div className="yt-player-modal-backdrop" onClick={() => setActiveMovieDetail(null)}>
          <div className="movie-detail-modal-window" onClick={(e) => e.stopPropagation()}>
            <button
              className="yt-player-close"
              onClick={() => setActiveMovieDetail(null)}
              title="Yopish (ESC)"
            >
              <X size={22} />
            </button>

            {/* Backdrop / Treyler & Episode Player Header */}
            <div className="movie-modal-banner">
              {isTrailerOpen ? (
                <div className="yt-iframe-wrapper">
                  <div className="player-now-playing-tag">
                    <span className="live-dot" />
                    <span>
                      {selectedEpisode
                        ? `${selectedEpisode.episodeNumber}-qism: ${selectedEpisode.title}`
                        : activeMovieDetail.title}
                    </span>
                    <span className="player-audio-badge">Ovozli HD Pleyer • {activeMovieDetail.officialPlatform || 'Amazon Prime Video'}</span>
                  </div>
                  <video
                    key={selectedEpisode?.videoUrl || activeMovieDetail.id}
                    src={selectedEpisode?.videoUrl || activeMovieDetail.videoUrl || './videos/anime-clips/clip_1.mp4'}
                    controls
                    autoPlay
                    playsInline
                    className="yt-iframe-element"
                    poster={activeMovieDetail.backdrop || activeMovieDetail.poster}
                  />
                </div>
              ) : (
                <div className="movie-backdrop-wrap">
                  <img
                    src={activeMovieDetail.backdrop || activeMovieDetail.poster}
                    alt={activeMovieDetail.title}
                    className="movie-backdrop-img"
                  />
                  <div className="movie-backdrop-overlay" />
                  <button
                    className="btn-watch-trailer"
                    onClick={() => {
                      setIsTrailerOpen(true);
                      showToast(`▶ ${selectedEpisode ? selectedEpisode.episodeNumber + '-qism' : 'Anime'} ijro etilmoqda (Ovozi bilan)`);
                    }}
                  >
                    <Play size={20} fill="#ffffff" />
                    <span>
                      {selectedEpisode
                        ? `${selectedEpisode.episodeNumber}-qismni Tomosha Qilish (HD Ovozli)`
                        : "Tomosha Qilish (HD Ovozli)"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Film Tafsilotlari */}
            <div className="movie-modal-body">
              <div className="movie-meta-chips">
                <span className="badge-rating">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {activeMovieDetail.rating} / 10 ({activeMovieDetail.votes} baho)
                </span>
                <span className="badge-year">{activeMovieDetail.year}</span>
                <span className="badge-genre">{activeMovieDetail.genre}</span>
                <span className="badge-time">
                  <Clock size={13} /> {activeMovieDetail.duration}
                </span>
                <span className="badge-quality">{activeMovieDetail.quality || 'Full HD 1080p'}</span>
              </div>

              <h2 className="movie-modal-title">{activeMovieDetail.title}</h2>
              <div className="movie-jp-title">{activeMovieDetail.japaneseTitle}</div>

              {/* Dublyaj va Format haqida ma'lumot */}
              <div className="movie-dubbing-alert">
                <Tv size={16} color="#3b82f6" />
                <span>
                  <strong>Dublyaj:</strong> {activeMovieDetail.dubbing || "O'zbekcha Professional Dublyaj (Animem.uz)"}
                </span>
              </div>

              <p className="movie-modal-overview">{activeMovieDetail.overview}</p>

              {/* Janrlar ro'yxati */}
              {activeMovieDetail.genres && activeMovieDetail.genres.length > 0 && (
                <div className="movie-detail-genres-row">
                  <span className="staff-label">Janrlar:</span>
                  <div className="detail-genre-tags">
                    {activeMovieDetail.genres.map((g) => (
                      <span key={g} className="detail-genre-pill">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="movie-staff-row">
                <div>
                  <span className="staff-label">Rejissyor:</span>
                  <strong className="staff-val">{activeMovieDetail.director}</strong>
                </div>
                <div>
                  <span className="staff-label">Studiya:</span>
                  <strong className="staff-val">{activeMovieDetail.studio}</strong>
                </div>
                <div>
                  <span className="staff-label">Rasmiy Platforma:</span>
                  <strong className="staff-val">{activeMovieDetail.officialPlatform}</strong>
                </div>
              </div>

              {/* Anime Qismlari va Epizodlar Tizimi (Prime Video & Animem.uz) */}
              {Array.isArray(activeMovieDetail.episodes) && activeMovieDetail.episodes.length > 0 && (
                <div className="movie-episodes-section">
                  <div className="movie-episodes-section-title">
                    <div className="ep-title-left">
                      <Tv size={20} color="#ff3366" />
                      <h3>Mavjud Qismlar ({activeMovieDetail.episodes.length} ta epizod)</h3>
                    </div>
                    <span className="movie-episodes-format-badge">To'liq Ovozli • 1080p HD</span>
                  </div>

                  <div className="movie-episodes-grid">
                    {activeMovieDetail.episodes.map((ep) => {
                      const isCurrent = selectedEpisode?.episodeNumber === ep.episodeNumber;
                      return (
                        <div
                          key={ep.episodeNumber}
                          className={`movie-episode-card ${isCurrent ? 'active-episode' : ''}`}
                          onClick={() => {
                            setSelectedEpisode(ep);
                            setIsTrailerOpen(true);
                            showToast(`▶ ${ep.episodeNumber}-qism tanlandi va ijro etilmoqda!`);
                          }}
                        >
                          <div className="episode-card-left">
                            <div className={`episode-play-icon ${isCurrent ? 'playing' : ''}`}>
                              {isCurrent ? <Volume2 size={16} color="#10b981" /> : <Play size={14} fill="#ffffff" />}
                            </div>
                            <div className="episode-text-wrap">
                              <h4 className="episode-title">{ep.title}</h4>
                              <div className="episode-meta-line">
                                <span className="episode-dur-pill">
                                  <Clock size={12} /> {ep.duration}
                                </span>
                                <span className="episode-lang-pill">O'zbekcha / Original Ovoz</span>
                              </div>
                            </div>
                          </div>
                          <span className={`episode-action-label ${isCurrent ? 'current' : ''}`}>
                            {isCurrent ? "Ko'rilmoqda" : "Ijro etish"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Amal tugmalari */}
              <div className="movie-modal-actions-bar">
                {/* To'liq anime sahifasiga o'tish tugmasi (tashqi saytga chiqib ketmaydi) */}
                <button
                  className="btn-animem-watch"
                  onClick={() => {
                    if (onSelectAnime) {
                      onSelectAnime(activeMovieDetail.id);
                    }
                  }}
                  title="Anime haqidagi to'liq sahifaga o'tish"
                >
                  <Play size={18} fill="#ffffff" />
                  <span>To'liq Sahifada Tomosha Qilish</span>
                </button>

                <button
                  className={`yt-action-pill ${likedIds.has(activeMovieDetail.id) ? 'active' : ''}`}
                  onClick={(e) => handleToggleLike(activeMovieDetail.id, e)}
                >
                  <Heart
                    size={18}
                    fill={likedIds.has(activeMovieDetail.id) ? '#ff3366' : 'none'}
                    color={likedIds.has(activeMovieDetail.id) ? '#ff3366' : '#ffffff'}
                  />
                  <span>{likedIds.has(activeMovieDetail.id) ? 'Yoqdi' : 'Like'}</span>
                </button>

                <button
                  className={`yt-action-pill ${isSavedCheck(activeMovieDetail.id) ? 'active' : ''}`}
                  onClick={(e) => handleToggleSave(activeMovieDetail, e)}
                >
                  {isSavedCheck(activeMovieDetail.id) ? (
                    <BookmarkCheck size={18} color="#ff3366" />
                  ) : (
                    <Bookmark size={18} />
                  )}
                  <span>{isSavedCheck(activeMovieDetail.id) ? 'Saqlandi' : 'Saqlash'}</span>
                </button>

                <a
                  href={`https://www.themoviedb.org/search?query=${encodeURIComponent(activeMovieDetail.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="yt-action-pill link-btn"
                >
                  <ExternalLink size={18} />
                  <span>TMDB Ma'lumoti</span>
                </a>
              </div>

              {/* Fikrlar / Izohlar (Comments) Bo'limi */}
              <div className="movie-comments-section-wrap">
                <VideoComments
                  targetId={activeMovieDetail.id}
                  targetTitle={activeMovieDetail.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
