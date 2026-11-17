import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  Bookmark,
  BookmarkCheck,
  Home,
  PlaySquare,
  Film,
  Image as ImageIcon,
  Compass,
  Bell,
  User,
  X,
  Play,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Share2,
  Download,
  Flame,
  Sparkles,
  ArrowLeft,
  Eye,
  Trash2,
  Key,
  Layers,
  Filter,
  RefreshCw,
  Clapperboard,
  SlidersHorizontal,
  ExternalLink,
  ShoppingBag,
  ShoppingCart,
  Star
} from 'lucide-react';
import { CATEGORY_TAGS, VIDEOS_DATA, SHORTS_DATA } from '../data/animeData';
import { ANIME_PICTURES_DATA } from '../data/animePicturesData';
import { SHOPPING_PRODUCTS_DATA } from '../data/shoppingData';
import { ANIME_MOVIES_DATA } from '../data/moviesData';
import {
  getSavedItems,
  toggleSaveItem,
  removeSavedItem,
  getLikedItemIds,
  toggleLikeItem,
  getUserProfile,
  addToWatchHistory,
  addToCart
} from '../services/storageService';
import {
  searchYouTubeShorts,
  searchPinterestImages,
  fetchRelatedImages
} from '../services/apiService';
import ApiSettingsModal from './ApiSettingsModal';
import VideoComments from './VideoComments';

// Shorts 2.0 Card Item - 1-kartochka haqiqiy video bo'lib ishlaydi
function ShortCardItem({
  short,
  idx,
  isLiked,
  isSaved,
  onOpenModal,
  onToggleLike,
  onToggleSave
}) {
  const isFirstCard = short.id === 's-user-uploaded' || short.title?.includes('Anime Yangi Maxsus Qism');
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [duration, setDuration] = useState(short.duration || '00:39');

  const handleMouseEnter = () => {
    if (isFirstCard && videoRef.current && !videoError) {
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const handleMouseLeave = () => {
    if (isFirstCard && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`short-vertical-card ${isFirstCard ? 'first-user-short-card' : ''} ${isPlaying ? 'is-playing' : ''}`}
      onClick={() => onOpenModal(idx)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="short-thumb-wrap">
        {isFirstCard && !videoError ? (
          <video
            ref={videoRef}
            src={short.videoUrl}
            className="short-card-video"
            muted
            playsInline
            loop
            preload="auto"
            onLoadedMetadata={(e) => {
              try {
                if (e.currentTarget.duration) {
                  const totalSec = Math.floor(e.currentTarget.duration);
                  const mins = Math.floor(totalSec / 60);
                  const secs = totalSec % 60;
                  setDuration(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
                }
                if (e.currentTarget.currentTime === 0) {
                  e.currentTarget.currentTime = 0.05;
                }
              } catch (_) {}
            }}
            onCanPlay={(e) => {
              try {
                if (e.currentTarget.currentTime === 0) {
                  e.currentTarget.currentTime = 0.05;
                }
              } catch (_) {}
            }}
            onError={() => {
              console.warn("Shorts video fayli yuklanmadi, fallback rasmga o'tilmoqda");
              setVideoError(true);
            }}
          />
        ) : (
          <img
            src={short.thumbnail}
            alt={short.title}
            className="short-thumb-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=85';
            }}
          />
        )}

        <div className="short-gradient-overlay" />

        <div className="short-card-actions">
          <button
            className={`short-bubble-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => onToggleLike(short.id, e)}
            title={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          >
            <Heart size={15} fill={isLiked ? '#ff3366' : 'none'} color={isLiked ? '#ff3366' : '#ffffff'} />
          </button>
          <button
            className={`short-bubble-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => onToggleSave(short, 'short', e)}
            title={isSaved ? "Saqlanganlardan o'chirish" : "Saqlash"}
          >
            {isSaved ? <BookmarkCheck size={15} color="#ff3366" /> : <Bookmark size={15} color="#ffffff" />}
          </button>
        </div>

        <div className={`short-play-indicator ${isPlaying ? 'hidden-indicator' : ''}`}>
          <Play size={18} fill="#ffffff" color="#ffffff" />
        </div>

        <div className="short-card-info">
          <h4 className="short-title">{short.title}</h4>
          <div className="short-view-count">
            <span>{short.views} ko'rish</span>
            <span className="short-duration-tag">
              {isFirstCard ? duration : (short.duration || '00:15')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainScreen({
  onBackToIntro,
  onOpenVideos,
  onOpenMovies,
  onOpenShopping,
  onOpenProfile,
  onSelectAnime
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTag, setSelectedTag] = useState('Barchasi');

  // Mustaqil Bo'lim Qidiruvlari
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [shortsSearchQuery, setShortsSearchQuery] = useState('');
  const [imagesSearchQuery, setImagesSearchQuery] = useState('');

  // Universal LocalStorage Saved & Liked States
  const [savedItems, setSavedItems] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [savedFilterType, setSavedFilterType] = useState('all'); // 'all' | 'video' | 'short' | 'image' | 'movie'
  const [userProfile, setUserProfile] = useState(getUserProfile());

  // Dynamic Content States
  const [shortsList, setShortsList] = useState(SHORTS_DATA);
  const [imagesList, setImagesList] = useState(ANIME_PICTURES_DATA);
  const [activePicCategory, setActivePicCategory] = useState('Barchasi');
  const [imagesPage, setImagesPage] = useState(1);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Playback & Modal States
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeShortModalIndex, setActiveShortModalIndex] = useState(null);
  const [isShortMuted, setIsShortMuted] = useState(false);
  const [activeImageLightbox, setActiveImageLightbox] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Rasm ochilganda o'xshash rasmlarni (Related Images) yuklash
  useEffect(() => {
    if (activeImageLightbox) {
      setIsLoadingRelated(true);
      fetchRelatedImages(activeImageLightbox, 8)
        .then((res) => setRelatedImages(res))
        .catch(() => setRelatedImages([]))
        .finally(() => setIsLoadingRelated(false));
    } else {
      setRelatedImages([]);
    }
  }, [activeImageLightbox]);

  // API Settings Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  // Dastlabki yuklanishda ma'lumotlarni olish
  useEffect(() => {
    setSavedItems(getSavedItems());
    setLikedIds(getLikedItemIds());
    setUserProfile(getUserProfile());
    loadInitialPinterestImages();
  }, []);

  const loadInitialPinterestImages = async () => {
    setIsLoadingImages(true);
    try {
      const res = await searchPinterestImages({ query: '', page: 1, perPage: 60 });
      setImagesList(res);
      setActivePicCategory('Barchasi');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleFilterPictures = async (cat) => {
    setActivePicCategory(cat);
    if (cat === 'Barchasi') {
      setImagesList(ANIME_PICTURES_DATA);
    } else if (cat === 'Yuklangan PFP (12)') {
      setImagesList(ANIME_PICTURES_DATA.filter((p) => p.isUserUploaded));
    } else if (cat === 'Rani Roy Clips (25)') {
      setImagesList(ANIME_PICTURES_DATA.filter((p) => p.isPinterestClips));
    } else if (cat === 'Sarcaeus Pinterest (45)') {
      setImagesList(ANIME_PICTURES_DATA.filter((p) => p.isPinterestBoard && !p.isPinterestClips));
    } else if (cat === 'Dark / Shadow') {
      const res = await searchPinterestImages({ query: 'dark', page: 1, perPage: 50 });
      setImagesList(res);
    } else if (cat === 'Monochrome') {
      const res = await searchPinterestImages({ query: 'monochrome', page: 1, perPage: 50 });
      setImagesList(res);
    }
  };

  // Like & Save
  const handleToggleLike = (id, e) => {
    e?.stopPropagation();
    const { likedSet, isLiked } = toggleLikeItem(id);
    setLikedIds(new Set(likedSet));
    showToast(isLiked ? '❤️ Sevimlilarga qo‘shildi!' : 'Sevimlilardan olib tashlandi');
  };

  const handleToggleSave = (item, type, e) => {
    e?.stopPropagation();
    const normalized = {
      ...item,
      itemType: type
    };
    const { updated, isSaved } = toggleSaveItem(normalized);
    setSavedItems(updated);
    showToast(isSaved ? '🔖 Saqlanganlarga qo‘shildi!' : 'Saqlanganlardan olib tashlandi');
  };

  const handleRemoveSaved = (id, e) => {
    e?.stopPropagation();
    const updated = removeSavedItem(id);
    setSavedItems(updated);
    showToast('Element saqlanganlardan o‘chirildi 🗑️');
  };

  // Shorts Qidiruvi
  const handleSearchShorts = async (e) => {
    e?.preventDefault();
    const results = await searchYouTubeShorts({ query: shortsSearchQuery });
    setShortsList(results);
    showToast(`Shorts: "${shortsSearchQuery}" (${results.length} ta natija)`);
  };

  // Pinterest & Google Images Haqiqiy Qidiruvi (Kamida 30 ta natija)
  const handleSearchImages = async (e) => {
    e?.preventDefault();
    setIsLoadingImages(true);
    setImagesPage(1);
    const results = await searchPinterestImages({ query: imagesSearchQuery, page: 1, perPage: 60 });
    setImagesList(results);
    setActivePicCategory('Barchasi');
    setIsLoadingImages(false);
    showToast(`Pinterest PFP: "${imagesSearchQuery}" (${results.length} ta rasm)`);
  };

  // Infinite Scroll / Load More Images
  const handleLoadMoreImages = async () => {
    setIsLoadingImages(true);
    const nextPage = imagesPage + 1;
    const more = await searchPinterestImages({ query: imagesSearchQuery, page: nextPage, perPage: 24 });
    setImagesList((prev) => [...prev, ...more]);
    setImagesPage(nextPage);
    setIsLoadingImages(false);
    showToast(`Yana ${more.length} ta rasm yuklandi ✨`);
  };

  // Filtered Videos (Home tab)
  const filteredVideos = useMemo(() => {
    return VIDEOS_DATA.filter((v) => {
      const matchesTag = selectedTag === 'Barchasi' || v.category === selectedTag;
      const q = globalSearchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        v.title.toLowerCase().includes(q) ||
        v.author.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);

      return matchesTag && matchesSearch;
    });
  }, [selectedTag, globalSearchQuery]);

  // Filtered Saved Items
  const filteredSavedItems = useMemo(() => {
    if (savedFilterType === 'all') return savedItems;
    return savedItems.filter((item) => item.itemType === savedFilterType);
  }, [savedItems, savedFilterType]);

  // Shorts Navigation
  const handleNextShort = (e) => {
    e?.stopPropagation();
    if (activeShortModalIndex !== null && activeShortModalIndex < shortsList.length - 1) {
      setActiveShortModalIndex(activeShortModalIndex + 1);
    } else {
      setActiveShortModalIndex(0);
    }
  };

  const handlePrevShort = (e) => {
    e?.stopPropagation();
    if (activeShortModalIndex !== null && activeShortModalIndex > 0) {
      setActiveShortModalIndex(activeShortModalIndex - 1);
    } else {
      setActiveShortModalIndex(shortsList.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeShortModalIndex !== null) {
        if (e.key === 'ArrowDown') handleNextShort();
        if (e.key === 'ArrowUp') handlePrevShort();
        if (e.key === 'Escape') setActiveShortModalIndex(null);
      } else if (activeVideoModal && e.key === 'Escape') {
        setActiveVideoModal(null);
      } else if (activeImageLightbox && e.key === 'Escape') {
        setActiveImageLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeShortModalIndex, activeVideoModal, activeImageLightbox, shortsList]);

  const isSavedCheck = (id) => savedItems.some((i) => i.id === id);

  return (
    <div className="main-screen-container">
      {/* Toast Notification */}
      {toast && (
        <div className="main-toast">
          <Sparkles size={18} className="toast-sparkle" />
          <span>{toast}</span>
        </div>
      )}

      {/* API Sozlamalar Modali */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSaveSuccess={(msg) => showToast(msg)}
      />

      {/* 1. TOPBAR */}
      <header className="main-topbar">
        <div className="topbar-left">
          <button className="intro-return-btn" onClick={onBackToIntro} title="Intro sahifasiga qaytish">
            <ArrowLeft size={18} />
            <span className="return-text">Intro</span>
          </button>

          <div
            className="platform-logo"
            onClick={() => {
              setActiveTab('home');
              setSelectedTag('Barchasi');
              setGlobalSearchQuery('');
            }}
          >
            <div className="logo-neon-box">
              <Film size={20} className="logo-neon-icon" />
            </div>
            <div className="logo-text-block">
              <span className="logo-main-name">ANIMESHIKLAR</span>
              <span className="logo-sub-tag">OLAMI 2.0</span>
            </div>
          </div>
        </div>

        {/* Global Qidiruv */}
        <div className="topbar-search-form">
          <div className="search-box-wrapper">
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Bosh sahifa bo‘yicha qidiring..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
            />
            {globalSearchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setGlobalSearchQuery('')}
                title="Tozalash"
              >
                <X size={16} />
              </button>
            )}
            <button
              className="search-submit-btn"
              title="Qidirish"
              onClick={() => showToast(`Qidiruv: "${globalSearchQuery}"`)}
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Topbar Right Actions */}
        <div className="topbar-right">
          {/* Saved Pill */}
          <button
            className={`topbar-action-pill ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('saved');
              showToast(`Saqlanganlar: ${savedItems.length} ta kontent`);
            }}
            title="Saqlangan kontentlar"
          >
            <Bookmark size={18} color={savedItems.length > 0 ? '#ff3366' : '#94a3b8'} />
            <span className="pill-count">{savedItems.length}</span>
          </button>

          {/* Likes Pill */}
          <button
            className="topbar-action-pill"
            onClick={() => showToast(`Yoqtirilganlar: ${likedIds.size} ta`)}
            title="Yoqtirilganlar"
          >
            <Heart size={18} color="#ec4899" fill="#ec4899" />
            <span className="pill-count">{likedIds.size}</span>
          </button>

          {/* API Keys Configuration */}
          <button
            className="topbar-icon-btn"
            onClick={() => setIsApiModalOpen(true)}
            title="API Kalitlari Sozlamasi"
          >
            <Key size={18} />
          </button>

          {/* Store / Shopping Pill */}
          <button
            className="topbar-action-pill store-topbar-pill"
            onClick={() => onOpenShopping && onOpenShopping()}
            title="Anime Internet Do'koni"
          >
            <ShoppingBag size={18} color="#10b981" />
            <span>Do'kon</span>
          </button>

          {/* User Profile Avatar (Profil sahifasiga o'tadi) */}
          <div
            className="topbar-user-profile"
            onClick={() => (onOpenProfile ? onOpenProfile() : setActiveTab('profile'))}
            title="Mening Profilim"
          >
            <img src={userProfile.avatar} alt="User Avatar" className="user-topbar-avatar" />
          </div>
        </div>
      </header>

      {/* ASOSIY O'RTA QISM: SIDEBAR + CONTENT AREA */}
      <div className="main-content-layout">
        {/* CHAP SIDEBAR */}
        <aside className="main-sidebar">
          <nav className="sidebar-nav-list">
            <button
              className={`sidebar-nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('home');
                setSelectedTag('Barchasi');
              }}
            >
              <Home size={20} className="nav-icon" />
              <span>Home</span>
            </button>

            {/* Videos Hub (Animem.uz) */}
            <button
              className="sidebar-nav-item"
              onClick={() => (onOpenVideos ? onOpenVideos() : setActiveTab('videos'))}
            >
              <PlaySquare size={20} className="nav-icon" />
              <span>Videos Hub</span>
              <span className="nav-counter highlight">Animem.uz</span>
            </button>

            {/* Movies (Anime Kinolar bo'limi) */}
            <button
              className="sidebar-nav-item"
              onClick={() => (onOpenMovies ? onOpenMovies() : setActiveTab('movies'))}
            >
              <Clapperboard size={20} className="nav-icon" color="#ec4899" />
              <span>Movies & Kinolar</span>
              <span className="nav-counter highlight">TMDB</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'shorts' ? 'active' : ''}`}
              onClick={() => setActiveTab('shorts')}
            >
              <Flame size={20} className="nav-icon flame-icon" />
              <span>Shorts 2.0</span>
              <span className="nav-counter">{shortsList.length}</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              <ImageIcon size={20} className="nav-icon" />
              <span>Pictures (Pinterest)</span>
              <span className="nav-counter">{imagesList.length}</span>
            </button>

            {/* Anime Shopping Store */}
            <button
              className="sidebar-nav-item"
              onClick={() => (onOpenShopping ? onOpenShopping() : setActiveTab('shopping'))}
            >
              <ShoppingBag size={20} className="nav-icon" color="#10b981" />
              <span>Anime Do'koni</span>
              <span className="nav-counter highlight green">Store</span>
            </button>

            <button
              className={`sidebar-nav-item ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark size={20} className="nav-icon" />
              <span>Saved</span>
              {savedItems.length > 0 && (
                <span className="nav-counter highlight">{savedItems.length}</span>
              )}
            </button>

            {/* Profile Nav */}
            <button
              className="sidebar-nav-item"
              onClick={() => (onOpenProfile ? onOpenProfile() : setActiveTab('profile'))}
            >
              <User size={20} className="nav-icon" />
              <span>Mening Profilim</span>
            </button>
          </nav>

          <div className="sidebar-anime-badge">
            <div className="badge-flair">ANIMEM.UZ & TMDB</div>
            <h4>Haqiqiy Platforma</h4>
            <p>Haqiqiy anime qismlari, filmlar va HD rasmlar.</p>
          </div>
        </aside>

        {/* O'NG KONTENT MAYDONI */}
        <main className="main-scroll-area">
          {/* TAG CHIPS */}
          {activeTab !== 'saved' && (
            <div className="tags-carousel-container">
              <div className="tags-carousel">
                {CATEGORY_TAGS.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              BO'LIM 1: SAVED (SAQLANGANLAR - UNIVERSAL TIZIM)
             ======================================================== */}
          {activeTab === 'saved' && (
            <section className="content-section-box">
              <div className="section-title-row">
                <div className="section-heading-group">
                  <Bookmark size={24} className="section-icon-accent" />
                  <h2>Saqlangan Materiallar ({savedItems.length})</h2>
                </div>
              </div>

              {/* Saved Filtrlari */}
              <div className="saved-filter-tabs">
                <button
                  className={`saved-pill ${savedFilterType === 'all' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('all')}
                >
                  Hammasi ({savedItems.length})
                </button>
                <button
                  className={`saved-pill ${savedFilterType === 'video' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('video')}
                >
                  🎬 Videolar ({savedItems.filter((i) => i.itemType === 'video').length})
                </button>
                <button
                  className={`saved-pill ${savedFilterType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('movie')}
                >
                  🍿 Kinolar ({savedItems.filter((i) => i.itemType === 'movie').length})
                </button>
                <button
                  className={`saved-pill ${savedFilterType === 'short' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('short')}
                >
                  ⚡ Shorts ({savedItems.filter((i) => i.itemType === 'short').length})
                </button>
                <button
                  className={`saved-pill ${savedFilterType === 'image' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('image')}
                >
                  🖼️ Rasmlar ({savedItems.filter((i) => i.itemType === 'image').length})
                </button>
                <button
                  className={`saved-pill ${savedFilterType === 'shopping' ? 'active' : ''}`}
                  onClick={() => setSavedFilterType('shopping')}
                >
                  🛍️ Do'kon ({savedItems.filter((i) => i.itemType === 'shopping').length})
                </button>
              </div>

              {filteredSavedItems.length === 0 ? (
                <div className="empty-content-card">
                  <Bookmark size={50} className="empty-icon" />
                  <h3>Saqlangan kontent mavjud emas</h3>
                  <p>Istalgan video, kino, shorts yoki rasmdagi Bookmark (Saqlash) tugmasini bosing.</p>
                </div>
              ) : (
                <div className="saved-items-grid">
                  {filteredSavedItems.map((item) => (
                    <div
                      key={item.id}
                      className="saved-item-card"
                      onClick={() => {
                        if (item.itemType === 'video') setActiveVideoModal(item);
                        else if (item.itemType === 'movie' || item.itemType === 'anime' || item.itemType === 'series') {
                          if (onSelectAnime) onSelectAnime(item.id);
                          else if (onOpenMovies) onOpenMovies();
                        } else if (item.itemType === 'short') {
                          const idx = shortsList.findIndex((s) => s.id === item.id);
                          setActiveShortModalIndex(idx >= 0 ? idx : 0);
                        } else if (item.itemType === 'image') setActiveImageLightbox(item);
                        else if (item.itemType === 'shopping') {
                          if (onOpenShopping) onOpenShopping();
                        }
                      }}
                    >
                      <div className="saved-thumb-wrap">
                        <img
                          src={item.thumbnail || item.url || item.poster || item.image}
                          alt={item.title}
                          className="saved-thumb-img"
                        />
                        <span className="saved-type-badge">
                          {item.itemType === 'video'
                            ? 'Video'
                            : item.itemType === 'movie'
                            ? 'Kino'
                            : item.itemType === 'short'
                            ? 'Shorts'
                            : item.itemType === 'shopping'
                            ? 'Do‘kon'
                            : 'Rasm'}
                        </span>
                        <button
                          className="saved-remove-btn"
                          onClick={(e) => handleRemoveSaved(item.id, e)}
                          title="O‘chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="saved-card-details">
                        <h4 className="saved-card-title">{item.title}</h4>
                        <span className="saved-card-sub">
                          {item.author?.name || item.author || item.genre || 'Saved'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ========================================================
              BO'LIM 2: HOME TAB (TRENDING VIDEOLAR)
             ======================================================== */}
          {activeTab === 'home' && (
            <>
              {/* Ommabop Videolar */}
              <section className="content-section-box">
                <div className="section-title-row">
                  <div className="section-heading-group">
                    <PlaySquare size={22} className="section-icon-accent" />
                    <h2>Ommabop Videolar ({filteredVideos.length})</h2>
                  </div>
                  <button
                    className="view-all-link"
                    onClick={() => (onOpenVideos ? onOpenVideos() : setActiveTab('videos'))}
                  >
                    Animem.uz Videolar Hubiga O‘tish →
                  </button>
                </div>

                <div className="videos-grid-layout">
                  {filteredVideos.slice(0, 8).map((video) => {
                    const isLiked = likedIds.has(video.id);
                    const isSaved = isSavedCheck(video.id);

                    return (
                      <div
                        key={video.id}
                        className="anime-video-card"
                        onClick={() => {
                          if (onSelectAnime) {
                            onSelectAnime(video.id);
                          } else {
                            setActiveVideoModal(video);
                          }
                          addToWatchHistory({
                            id: video.id,
                            title: video.title,
                            thumbnail: video.thumbnail,
                            itemType: 'video'
                          });
                        }}
                      >
                        <div className="video-thumb-wrap">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="video-thumb-img"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85';
                            }}
                          />
                          <span className="video-duration-tag">{video.duration}</span>

                          <div
                            className="thumb-play-overlay"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVideoModal(video);
                            }}
                            title="Tezkor ijro etish"
                          >
                            <div className="play-button-glow">
                              <Play size={22} fill="#ffffff" color="#ffffff" />
                            </div>
                          </div>

                          <div className="video-thumb-actions">
                            <button
                              className={`action-bubble ${isLiked ? 'active' : ''}`}
                              onClick={(e) => handleToggleLike(video.id, e)}
                              title="Like"
                            >
                              <Heart
                                size={16}
                                fill={isLiked ? '#ff3366' : 'none'}
                                color={isLiked ? '#ff3366' : '#ffffff'}
                              />
                            </button>
                            <button
                              className={`action-bubble ${isSaved ? 'active' : ''}`}
                              onClick={(e) => handleToggleSave(video, 'video', e)}
                              title="Saqlash"
                            >
                              {isSaved ? <BookmarkCheck size={16} color="#ff3366" /> : <Bookmark size={16} color="#ffffff" />}
                            </button>
                          </div>
                        </div>

                        <div className="video-meta-row">
                          <img
                            src={video.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                            alt={video.author?.name || 'Kanal'}
                            className="channel-avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                            }}
                          />
                          <div className="video-text-meta">
                            <h3 className="video-card-title">{video.title}</h3>
                            <div className="channel-name-verified">{video.author?.name || 'Animem Studio'}</div>
                            <div className="video-stats-subline">
                              <span>{video.views} ko'rish</span>
                              <span className="dot-sep">•</span>
                              <span>{video.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ========================================================
              BO'LIM 3: SHORTS 2.0 (YOUTUBE SHORTS MUSTAQIL QIDIRUVI)
             ======================================================== */}
          {(activeTab === 'home' || activeTab === 'shorts') && (
            <section className="content-section-box shorts-section-spacing">
              <div className="section-title-row">
                <div className="section-heading-group">
                  <Flame size={24} className="flame-icon" />
                  <h2>Anime Shorts 2.0</h2>
                </div>
              </div>

              {/* Mustaqil Shorts Qidiruvi */}
              <form className="section-dedicated-search" onSubmit={handleSearchShorts}>
                <div className="dedicated-search-wrap">
                  <Flame size={18} className="dedicated-icon" />
                  <input
                    type="text"
                    className="dedicated-search-input"
                    placeholder="Shorts videolarni qidiring (masalan: Gojo, Eren, Naruto, funny)..."
                    value={shortsSearchQuery}
                    onChange={(e) => setShortsSearchQuery(e.target.value)}
                  />
                  {shortsSearchQuery && (
                    <button
                      type="button"
                      className="dedicated-clear-btn"
                      onClick={() => {
                        setShortsSearchQuery('');
                        setShortsList(SHORTS_DATA);
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" className="dedicated-submit-btn">
                    Shorts Qidirish
                  </button>
                </div>
              </form>

              <div className="shorts-grid-layout">
                {shortsList.map((short, idx) => {
                  const isLiked = likedIds.has(short.id);
                  const isSaved = isSavedCheck(short.id);

                  return (
                    <ShortCardItem
                      key={short.id}
                      short={short}
                      idx={idx}
                      isLiked={isLiked}
                      isSaved={isSaved}
                      onOpenModal={setActiveShortModalIndex}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* ========================================================
              BO'LIM 4: PICTURES 2.0 (PINTEREST MASONRY GRID & REAL IMAGES)
             ======================================================== */}
          {(activeTab === 'home' || activeTab === 'images') && (
            <section className="content-section-box">
              <div className="section-title-row">
                <div className="section-heading-group">
                  <ImageIcon size={22} className="section-icon-accent" />
                  <h2>Pictures 2.0 (Pinterest & Foydalanuvchi Anime PFP)</h2>
                </div>
                <span className="results-badge">{imagesList.length} ta rasm</span>
              </div>

              {/* Mustaqil Rasm Qidiruvi */}
              <form className="section-dedicated-search" onSubmit={handleSearchImages}>
                <div className="dedicated-search-wrap">
                  <Search size={18} className="dedicated-icon" />
                  <input
                    type="text"
                    className="dedicated-search-input"
                    placeholder="Anime PFP qidiring (masalan: kaneki, dark, vampire, angel, cat hoodie, aesthetic, kitsu)..."
                    value={imagesSearchQuery}
                    onChange={(e) => setImagesSearchQuery(e.target.value)}
                  />
                  {imagesSearchQuery && (
                    <button
                      type="button"
                      className="dedicated-clear-btn"
                      onClick={() => {
                        setImagesSearchQuery('');
                        loadInitialPinterestImages();
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" className="dedicated-submit-btn images-btn">
                    PFP Qidirish
                  </button>
                </div>
              </form>

              {/* Kategoriya & Manba filtrlari */}
              <div className="pictures-filter-bar">
                {[
                  'Barchasi',
                  'Yuklangan PFP (12)',
                  'Rani Roy Clips (25)',
                  'Sarcaeus Pinterest (45)',
                  'Dark / Shadow',
                  'Monochrome'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`picture-cat-chip ${activePicCategory === cat ? 'active' : ''}`}
                    onClick={() => handleFilterPictures(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* PINTEREST MASONRY GRID (Har xil balandlikdagi kartochkalar) */}
              <div className="pinterest-masonry-container">
                {imagesList.map((img) => {
                  const isLiked = likedIds.has(img.id);
                  const isSaved = isSavedCheck(img.id);

                  return (
                    <div
                      key={img.id}
                      className="pinterest-pin-card"
                      onClick={() => setActiveImageLightbox(img)}
                    >
                      <div className="pin-image-wrapper">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="pin-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=85';
                          }}
                        />
                        <div className="pin-hover-overlay" />

                        {img.isUserUploaded && (
                          <span className="pin-user-tag">🔥 Foydalanuvchi PFP</span>
                        )}

                        {/* Top Save & Like Buttons */}
                        <div className="pin-action-buttons">
                          <button
                            className={`pin-action-btn ${isLiked ? 'liked' : ''}`}
                            onClick={(e) => handleToggleLike(img.id, e)}
                            title="Like"
                          >
                            <Heart size={16} fill={isLiked ? '#ff3366' : 'none'} color={isLiked ? '#ff3366' : '#ffffff'} />
                          </button>
                          <button
                            className={`pin-action-btn ${isSaved ? 'saved' : ''}`}
                            onClick={(e) => handleToggleSave(img, 'image', e)}
                            title="Saqlash"
                          >
                            {isSaved ? <BookmarkCheck size={16} color="#ff3366" /> : <Bookmark size={16} color="#ffffff" />}
                          </button>
                        </div>

                        <span className="pin-res-tag">{img.resolution || 'HD PFP'}</span>
                      </div>

                      <div className="pin-info-row">
                        <h4 className="pin-title">{img.title}</h4>
                        <div className="pin-author-meta">
                          <span>{img.author}</span>
                          <span className="pin-likes">❤️ {img.likes}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Infinite Scroll / Load More Images */}
              <div className="load-more-container">
                <button
                  className="btn-load-more-images"
                  onClick={handleLoadMoreImages}
                  disabled={isLoadingImages}
                >
                  {isLoadingImages ? (
                    <>
                      <RefreshCw size={18} className="spinner-spin" />
                      <span>Pinterest rasmlari yuklanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Ko'proq Rasm Yuklash (Pinterest 2.0)</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ========================================================
          VIDEO PLAYER MODAL
         ======================================================== */}
      {activeVideoModal && (
        <div className="modal-backdrop-blur" onClick={() => setActiveVideoModal(null)}>
          <div className="video-player-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="player-close-btn" onClick={() => setActiveVideoModal(null)} title="Yopish (ESC)">
              <X size={22} />
            </button>

            <div className="video-element-container">
              <video
                src={activeVideoModal.videoUrl}
                poster={activeVideoModal.thumbnail}
                controls
                autoPlay
                playsInline
                className="active-html5-video"
              />
            </div>

            <div className="modal-video-details">
              <h2 className="modal-video-title">{activeVideoModal.title}</h2>
              <div className="modal-channel-action-row">
                <div className="channel-profile-left">
                  <img
                    src={activeVideoModal.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt="Channel"
                    className="channel-large-avatar"
                  />
                  <div>
                    <h4 className="channel-large-name">{activeVideoModal.author?.name || 'Kanal'}</h4>
                    <span className="channel-sub-count">{activeVideoModal.author?.subscribers || 'Obunachi'}</span>
                  </div>
                </div>

                <div className="video-buttons-right">
                  <button
                    className={`video-interact-btn ${likedIds.has(activeVideoModal.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleLike(activeVideoModal.id, e)}
                  >
                    <Heart size={18} fill={likedIds.has(activeVideoModal.id) ? '#ff3366' : 'none'} color={likedIds.has(activeVideoModal.id) ? '#ff3366' : '#ffffff'} />
                    <span>{likedIds.has(activeVideoModal.id) ? 'Yoqdi' : 'Like'}</span>
                  </button>

                  <button
                    className={`video-interact-btn ${isSavedCheck(activeVideoModal.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleSave(activeVideoModal, 'video', e)}
                  >
                    {isSavedCheck(activeVideoModal.id) ? <BookmarkCheck size={18} color="#ff3366" /> : <Bookmark size={18} />}
                    <span>{isSavedCheck(activeVideoModal.id) ? 'Saqlandi' : 'Saqlash'}</span>
                  </button>

                  <button className="video-interact-btn" onClick={() => showToast('Havola nusxalandi! 📋')}>
                    <Share2 size={18} />
                    <span>Ulashish</span>
                  </button>
                </div>
              </div>

              {/* VIDEO FOYDALANUVCHILAR KOMMENTARIYASI */}
              <div style={{ padding: '0 20px 20px' }}>
                <VideoComments targetId={activeVideoModal.id} targetTitle={activeVideoModal.title} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SHORTS 2.0 FULLSCREEN PLAYER
         ======================================================== */}
      {activeShortModalIndex !== null && (
        <div className="shorts-modal-overlay" onClick={() => setActiveShortModalIndex(null)}>
          <button className="shorts-close-btn" onClick={() => setActiveShortModalIndex(null)} title="Yopish">
            <X size={26} />
          </button>

          <div className="shorts-nav-controls">
            <button className="shorts-arrow-btn" onClick={handlePrevShort} title="Oldingi video (Up)">
              <ChevronUp size={28} />
            </button>
            <button className="shorts-arrow-btn" onClick={handleNextShort} title="Keyingi video (Down)">
              <ChevronDown size={28} />
            </button>
          </div>

          <div className="shorts-phone-frame" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const currentShort = shortsList[activeShortModalIndex];
              if (!currentShort) return null;
              const isLiked = likedIds.has(currentShort.id);
              const isSaved = isSavedCheck(currentShort.id);

              return (
                <div className="shorts-inner-screen">
                  <video
                    key={currentShort.id}
                    src={currentShort.videoUrl}
                    poster={currentShort.id === 's-user-uploaded' || currentShort.title?.includes('Anime Yangi Maxsus Qism') ? undefined : currentShort.thumbnail}
                    controls
                    autoPlay
                    loop
                    muted={isShortMuted}
                    playsInline
                    className="shorts-vertical-video"
                  />

                  <button
                    className="shorts-sound-btn"
                    onClick={() => setIsShortMuted(!isShortMuted)}
                    title={isShortMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
                  >
                    {isShortMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <div className="shorts-overlay-info">
                    <div className="shorts-channel-row">
                      <span className="shorts-author-name">{currentShort.author}</span>
                      <button className="shorts-sub-pill" onClick={() => showToast('Obuna bo‘lindi!')}>
                        Obuna
                      </button>
                    </div>
                    <p className="shorts-headline">{currentShort.title}</p>
                  </div>

                  <div className="shorts-action-sidebar">
                    <button
                      className={`shorts-side-btn ${isLiked ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(currentShort.id, e)}
                    >
                      <div className="side-icon-circle">
                        <Heart size={22} fill={isLiked ? '#ff3366' : 'none'} color={isLiked ? '#ff3366' : '#ffffff'} />
                      </div>
                      <span>{currentShort.likes || 'Like'}</span>
                    </button>

                    <button
                      className={`shorts-side-btn ${isSaved ? 'saved' : ''}`}
                      onClick={(e) => handleToggleSave(currentShort, 'short', e)}
                    >
                      <div className="side-icon-circle">
                        {isSaved ? <BookmarkCheck size={22} color="#ff3366" /> : <Bookmark size={22} color="#ffffff" />}
                      </div>
                      <span>Saqlash</span>
                    </button>

                    <button className="shorts-side-btn" onClick={() => showToast('Havola nusxalandi! 📋')}>
                      <div className="side-icon-circle">
                        <Share2 size={20} />
                      </div>
                      <span>Ulashish</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================
          IMAGE LIGHTBOX MODAL
         ======================================================== */}
      {activeImageLightbox && (
        <div className="lightbox-backdrop" onClick={() => setActiveImageLightbox(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setActiveImageLightbox(null)} title="Yopish (ESC)">
              <X size={22} />
            </button>

            <div className="lightbox-content-grid">
              <div className="lightbox-image-view">
                <img src={activeImageLightbox.url} alt={activeImageLightbox.title} className="lightbox-full-img" />
              </div>

              <div className="lightbox-details-panel">
                <div className="lightbox-badge-row">
                  <span className="res-badge">{activeImageLightbox.resolution}</span>
                  <span className="cat-badge">{activeImageLightbox.source || 'Pinterest'}</span>
                </div>

                <h2 className="lightbox-title">{activeImageLightbox.title}</h2>

                <div className="lightbox-creator-box">
                  <User size={18} className="creator-icon" />
                  <div>
                    <span className="creator-label">Muallif</span>
                    <h4 className="creator-name">{activeImageLightbox.author}</h4>
                  </div>
                </div>

                <div className="lightbox-actions-group">
                  <button
                    className={`lb-action-btn ${likedIds.has(activeImageLightbox.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleLike(activeImageLightbox.id, e)}
                  >
                    <Heart size={18} fill={likedIds.has(activeImageLightbox.id) ? '#ff3366' : 'none'} />
                    <span>{likedIds.has(activeImageLightbox.id) ? 'Yoqdi' : 'Like'}</span>
                  </button>

                  <button
                    className={`lb-action-btn ${isSavedCheck(activeImageLightbox.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleSave(activeImageLightbox, 'image', e)}
                  >
                    {isSavedCheck(activeImageLightbox.id) ? <BookmarkCheck size={18} color="#ff3366" /> : <Bookmark size={18} />}
                    <span>{isSavedCheck(activeImageLightbox.id) ? 'Saqlandi' : 'Saqlash'}</span>
                  </button>

                  <a
                    href={activeImageLightbox.url}
                    download="anime_art.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="lb-action-btn download"
                    onClick={() => showToast('Rasm yuklab olish boshlandi...')}
                  >
                    <Download size={18} />
                    <span>Yuklab Olish</span>
                  </a>

                  <button
                    className="lb-action-btn share"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(activeImageLightbox.url);
                      }
                      showToast('Rasm havolasi nusxalandi! 📋');
                    }}
                    title="Havolani nusxalash"
                  >
                    <Share2 size={18} />
                    <span>Ulashish</span>
                  </button>
                </div>

                {/* RELATED IMAGES (O'XSHASH RASMLAR — PINTEREST USLUBIDA) */}
                <div className="lightbox-related-section">
                  <div className="related-header-line">
                    <Sparkles size={16} color="#ff3366" />
                    <h4>O'xshash Rasmlar (More like this)</h4>
                  </div>
                  {isLoadingRelated ? (
                    <div className="related-loading-box">
                      <RefreshCw size={18} className="spinner-spin" />
                      <span>O'xshash rasmlar topilmoqda...</span>
                    </div>
                  ) : (
                    <div className="related-thumbs-grid">
                      {relatedImages.map((relImg) => (
                        <div
                          key={relImg.id}
                          className="related-thumb-card"
                          onClick={() => {
                            setActiveImageLightbox(relImg);
                            showToast(`"${relImg.title.slice(0, 20)}..." ochildi ✨`);
                          }}
                          title={relImg.title}
                        >
                          <img src={relImg.url} alt={relImg.title} className="rel-thumb-img" />
                          <div className="rel-thumb-hover">
                            <span>Ko'rish</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RASM KOMMENTARIYALARI */}
                <VideoComments targetId={activeImageLightbox.id} targetTitle={activeImageLightbox.title} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
