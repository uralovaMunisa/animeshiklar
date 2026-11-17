// ANIMESHIKLAR OLAMI — VIDEOLAR VA ANIME KATALOGI (ANIMEM.UZ USLUBIDA)
// Anime kartochkalari, posterlar, reytinglar, janrlar, qidiruv va kategoriyalar

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Play,
  X,
  ArrowLeft,
  Tv,
  Film,
  Sparkles,
  Share2,
  Heart,
  Bookmark,
  BookmarkCheck,
  Star,
  Clock,
  Layers,
  Flame,
  Smile,
  Compass,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ANIME_CATEGORIES,
  getAllUnifiedAnimes
} from '../data/animeCatalogData';
import {
  getSavedItems,
  toggleSaveItem,
  getLikedItemIds,
  toggleLikeItem
} from '../services/storageService';

export default function VideosScreen({
  onBackToHome,
  onBackToIntro,
  onOpenMovies,
  onOpenShopping,
  onOpenProfile,
  onSelectAnime
}) {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'top' | 'series' | 'movies'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'newest'

  // Saqlanganlar va Yoqtirilganlar
  const [likedIds, setLikedIds] = useState(new Set());
  const [savedItems, setSavedItems] = useState([]);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const allAnimes = useMemo(() => getAllUnifiedAnimes(), []);

  useEffect(() => {
    setSavedItems(getSavedItems());
    setLikedIds(getLikedItemIds());
  }, []);

  // Kategoriya bo'yicha hisoblagichlar
  const categoryCounts = useMemo(() => {
    const counts = { Barchasi: allAnimes.length };
    ANIME_CATEGORIES.forEach((cat) => {
      if (cat === 'Barchasi') return;
      counts[cat] = allAnimes.filter(
        (a) =>
          a.genre.toLowerCase() === cat.toLowerCase() ||
          (a.genres && a.genres.some((g) => g.toLowerCase() === cat.toLowerCase()))
      ).length;
    });
    return counts;
  }, [allAnimes]);

  // Filtrlash va Saralash
  const filteredAnimes = useMemo(() => {
    let list = [...allAnimes];

    // 1. Kategoriya bo'yicha filtr
    if (selectedCategory && selectedCategory !== 'Barchasi') {
      const cleanCat = selectedCategory.toLowerCase();
      list = list.filter(
        (a) =>
          a.genre.toLowerCase() === cleanCat ||
          (a.genres && a.genres.some((g) => g.toLowerCase() === cleanCat))
      );
    }

    // 2. Qidiruv bo'yicha filtr
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.uzbekTitle && a.uzbekTitle.toLowerCase().includes(q)) ||
          (a.japaneseTitle && a.japaneseTitle.toLowerCase().includes(q)) ||
          (a.studio && a.studio.toLowerCase().includes(q)) ||
          a.genre.toLowerCase().includes(q)
      );
    }

    // 3. Tezkor tur bo'yicha filtr
    if (quickFilter === 'top') {
      list = list.filter((a) => a.rating >= 8.5);
    } else if (quickFilter === 'series') {
      list = list.filter((a) => a.type === 'series');
    } else if (quickFilter === 'movies') {
      list = list.filter((a) => a.type === 'movie');
    }

    // 4. Tartiblash (Sorting)
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.year - a.year);
    } else {
      // popular
      list.sort((a, b) => (parseFloat(b.votes) || 0) - (parseFloat(a.votes) || 0));
    }

    return list;
  }, [allAnimes, selectedCategory, searchQuery, quickFilter, sortBy]);

  const handleToggleLike = (id, e) => {
    e?.stopPropagation();
    const { likedSet, isLiked } = toggleLikeItem(id);
    setLikedIds(new Set(likedSet));
    showToast(isLiked ? '❤️ Anime sevimlilarga qo‘shildi!' : 'Sevimlilardan olib tashlandi');
  };

  const handleToggleSave = (anime, e) => {
    e?.stopPropagation();
    const normalized = {
      ...anime,
      itemType: anime.type || 'series'
    };
    const { updated, isSaved } = toggleSaveItem(normalized);
    setSavedItems(updated);
    showToast(isSaved ? '🍿 Anime saqlanganlarga qo‘shildi!' : 'Saqlanganlardan olib tashlandi');
  };

  const isSavedCheck = (id) => savedItems.some((i) => i.id === id);

  return (
    <div className="videos-page-container">
      {/* Toast */}
      {toast && (
        <div className="videos-toast">
          <Sparkles size={18} className="toast-sparkle-icon" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. YUQORI TOPBAR */}
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
            <div className="brand-icon-box">
              <Tv size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-main">ANIMESHIKLAR</span>
              <span className="brand-sub">VIDEOLAR & KATALOG</span>
            </div>
          </div>
        </div>

        {/* Qidiruv Paneli */}
        <div className="videos-search-container">
          <div className="videos-search-box">
            <Search size={18} className="search-lead-icon" />
            <input
              type="text"
              className="videos-search-input"
              placeholder="Anime, qahramon yoki janr qidiring (Spy x Family, Solo Leveling, Gojo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-reset-button"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Topbar O'ng Havolalari */}
        <div className="videos-topbar-right">
          <button
            className="video-stats-pill click-pill"
            onClick={onOpenMovies}
            title="Kinolar bo'limi"
          >
            <Film size={16} color="#3b82f6" />
            <span>Kinolar</span>
          </button>

          <button
            className="video-stats-pill click-pill"
            onClick={onOpenShopping}
            title="Anime Do'koni"
          >
            <ShoppingBag size={16} color="#10b981" />
            <span>Do'kon</span>
          </button>

          <div
            className="video-stats-pill click-pill"
            onClick={() => showToast(`Yoqtirilgan animelar: ${likedIds.size} ta`)}
            title="Yoqtirilganlar"
          >
            <Heart size={16} color="#ec4899" fill={likedIds.size > 0 ? '#ec4899' : 'none'} />
            <span>{likedIds.size}</span>
          </div>
        </div>
      </header>

      {/* 2. JANRLAR CHIPS SATRI (ANIMEM.UZ KABI) */}
      <section className="videos-categories-bar">
        <div className="categories-scroll-wrapper">
          {ANIME_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                className={`category-pill-btn genre-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  showToast(`Kategoriya: ${cat} (${count} ta anime)`);
                }}
              >
                <span>{cat}</span>
                <span className="genre-chip-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TEZKOR FILTRLAR VA TARTIBLASH */}
      <div className="movie-subfilters-bar">
        <div className="subfilter-chips-wrap">
          <button
            className={`subfilter-pill ${quickFilter === 'all' ? 'active' : ''}`}
            onClick={() => setQuickFilter('all')}
          >
            Barchasi
          </button>
          <button
            className={`subfilter-pill ${quickFilter === 'top' ? 'active' : ''}`}
            onClick={() => setQuickFilter('top')}
          >
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span>Top Reyting (8.5+)</span>
          </button>
          <button
            className={`subfilter-pill ${quickFilter === 'series' ? 'active' : ''}`}
            onClick={() => setQuickFilter('series')}
          >
            <Tv size={13} color="#3b82f6" />
            <span>Seriallar</span>
          </button>
          <button
            className={`subfilter-pill ${quickFilter === 'movies' ? 'active' : ''}`}
            onClick={() => setQuickFilter('movies')}
          >
            <Film size={13} color="#a855f7" />
            <span>Filmlar</span>
          </button>
        </div>

        {/* Saralash tanlovi */}
        <div className="catalog-sort-wrap">
          <SlidersHorizontal size={14} color="#94a3b8" />
          <span className="sort-label">Tartib:</span>
          <select
            className="sort-select-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Ommabopligi bo‘yicha</option>
            <option value="rating">Reytingi bo‘yicha (Yuqori)</option>
            <option value="newest">Yili bo‘yicha (Yangi)</option>
          </select>
        </div>
      </div>

      {/* 4. ASOSIY ANIME VIDEOLAR VA KATALOG GRIDI */}
      <main className="videos-main-content">
        <div className="videos-info-header">
          <div className="info-left-group">
            <h1 className="current-category-title">
              📺 {selectedCategory === 'Barchasi' ? 'Barcha Animelar' : `${selectedCategory} Animelari`} ({filteredAnimes.length})
            </h1>
            <span className="results-badge">Animem.uz Standartidagi Katalog</span>
          </div>

          <div className="movie-grid-meta-note">
            <span>Istalgan anime kartochkasini bosib, uning barcha qismlarini sayt ichida HD video playerda tomosha qilishingiz mumkin.</span>
          </div>
        </div>

        {filteredAnimes.length === 0 ? (
          <div className="no-movies-box">
            <Tv size={48} color="#64748b" />
            <h3>Ushbu so'rov bo'yicha animelar topilmadi</h3>
            <p>Qidiruv so'zini o'zgartirib yoki boshqa janrni tanlab ko'ring.</p>
            <button
              className="btn-watch-trailer"
              onClick={() => {
                setSelectedCategory('Barchasi');
                setQuickFilter('all');
                setSearchQuery('');
              }}
            >
              Barcha Animelarni Ko'rsatish
            </button>
          </div>
        ) : (
          <div className="movies-grid-layout">
            {filteredAnimes.map((anime) => {
              const isLiked = likedIds.has(anime.id);
              const isSaved = isSavedCheck(anime.id);

              return (
                <div
                  key={anime.id}
                  className="movie-poster-card anime-catalog-card"
                  onClick={() => onSelectAnime && onSelectAnime(anime.id)}
                >
                  <div className="movie-poster-box">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="movie-poster-img"
                      loading="lazy"
                    />
                    <div className="movie-poster-gradient" />

                    {/* Reyting */}
                    <div className="movie-rating-badge">
                      <Star size={13} fill="#fbbf24" color="#fbbf24" />
                      <span>{anime.rating}</span>
                    </div>

                    {/* Yili */}
                    <span className="movie-year-badge">{anime.year}</span>

                    {/* Video Sifati */}
                    <span className="movie-quality-badge">{anime.quality || '4K'}</span>

                    {/* Hover Play Glow */}
                    <div className="movie-play-glow">
                      <Play size={24} fill="#ffffff" color="#ffffff" />
                    </div>

                    {/* Like & Save */}
                    <div className="movie-card-actions">
                      <button
                        className={`action-btn-bubble ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => handleToggleLike(anime.id, e)}
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
                        onClick={(e) => handleToggleSave(anime, e)}
                        title="Saqlash"
                      >
                        {isSaved ? <BookmarkCheck size={16} color="#ff3366" /> : <Bookmark size={16} color="#ffffff" />}
                      </button>
                    </div>
                  </div>

                  <div className="movie-card-info">
                    <h3 className="movie-title" title={anime.title}>
                      {anime.title}
                    </h3>

                    {anime.uzbekTitle && (
                      <div className="anime-card-uzb-sub" title={anime.uzbekTitle}>
                        {anime.uzbekTitle}
                      </div>
                    )}

                    <div className="movie-sub-info">
                      <span className="movie-genre">{anime.genre}</span>
                      <span className="dot-sep">•</span>
                      <span className="movie-duration">
                        <Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                        {anime.episodesCount || anime.duration}
                      </span>
                    </div>

                    {/* Janr Mini Teglari */}
                    {anime.genres && (
                      <div className="movie-card-tags">
                        {anime.genres.slice(0, 3).map((tg) => (
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
    </div>
  );
}
