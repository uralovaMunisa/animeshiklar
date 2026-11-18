// ANIMESHIKLAR OLAMI — FOYDALANUVCHI PROFILI
// Profil ma'lumotlari, Avatar va Muqova yuklash, Yoqtirilganlar, Saqlanganlar, Ko'rish tarixi va Shopping buyurtmalari

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Edit3,
  Camera,
  Heart,
  Bookmark,
  Clock,
  Settings,
  ArrowLeft,
  Film,
  Sparkles,
  Play,
  Trash2,
  Check,
  X,
  ExternalLink,
  Shield,
  Key,
  Truck,
  ShoppingBag,
  Star,
  Tv,
  MessageSquare,
  Upload,
  Image,
  Award,
  Zap,
  CheckCircle2,
  Palette
} from 'lucide-react';
import { fetchComments, deleteComment } from '../services/apiService';
import {
  getUserProfile,
  saveUserProfile,
  getSavedItems,
  getLikedItemIds,
  getWatchHistory,
  clearWatchHistory,
  removeSavedItem,
  getOrders
} from '../services/storageService';
import ApiSettingsModal from './ApiSettingsModal';

// TAYYOR SARALANGAN ANIME AVATARLARI (12 TA)
export const PRESET_ANIME_AVATARS = [
  { id: 'av-kaneki', name: 'Kaneki Ken', anime: 'Tokyo Ghoul', url: './images/anime-pfp/kaneki-tokyo-ghoul-pfp.jpg' },
  { id: 'av-split', name: 'Dark Split Power', anime: 'Jujutsu / Shadow', url: './images/anime-pfp/dark-split-purple-eyes-pfp.jpg' },
  { id: 'av-cat', name: 'Cat Hoodie Boy', anime: 'Otaku Style', url: './images/anime-pfp/cat-hoodie-quiet-smile-pfp.jpg' },
  { id: 'av-crown', name: 'White Hair King', anime: 'Fantasy King', url: './images/anime-pfp/white-hair-crown-fang-king-pfp.jpg' },
  { id: 'av-shadow', name: 'Shadow Tattoo Boy', anime: 'Dark Anime', url: './images/anime-pfp/dark-shadow-tattoo-boy-pfp.jpg' },
  { id: 'av-kitsu', name: 'Kitsu Fox Boy', anime: 'Yokai Fox', url: './images/anime-pfp/kitsu-fox-boy-sheet-pfp.jpg' },
  { id: 'av-cross', name: 'Cross Hoodie Boy', anime: 'Monochrome', url: './images/anime-pfp/black-white-hoodie-cross-boy-pfp.jpg' },
  { id: 'av-neon', name: 'Neon Blue Chains', anime: 'Cyberpunk', url: './images/anime-pfp/neon-blue-chains-anime-boy-pfp.jpg' },
  { id: 'av-vampire', name: 'Vampire Fang', anime: 'Vampire Lord', url: './images/anime-pfp/vampire-fang-black-eyes-boy-pfp.jpg' },
  { id: 'av-angel', name: 'Red Eyes Angel', anime: 'Fallen Angel', url: './images/anime-pfp/white-hair-red-eyes-angel-pfp.jpg' },
  { id: 'av-halo', name: 'Electric Halo Angel', anime: 'Aesthetic', url: './images/anime-pfp/fallen-angel-electric-pole-halo-pfp.jpg' },
  { id: 'av-kai', name: 'Kai Red Hair Sheet', anime: 'Original Character', url: './images/anime-pfp/kai-red-hair-character-sheet-pfp.jpg' }
];

// TAYYOR MUQOVA RASMLARI
export const PRESET_ANIME_COVERS = [
  { id: 'cov-cyber', name: 'Neo-Tokyo Cyberpunk 4K', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=85' },
  { id: 'cov-samurai', name: 'Sakura Samuray Tun', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85' },
  { id: 'cov-galaxy', name: 'Yulduzli Galaktika & Anime', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=85' },
  { id: 'cov-shadow', name: 'Neon & Qorong‘u Soyalar', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85' },
  { id: 'cov-blade', name: 'Kiber Plazma Jangchisi', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=85' }
];

export default function ProfileScreen({
  onBackToHome,
  onBackToIntro,
  onOpenVideos,
  onOpenMovies,
  onOpenShopping,
  onSelectAnime
}) {
  const [profile, setProfile] = useState(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'likes' | 'history' | 'orders' | 'comments' | 'settings'

  // Avatar / Cover tanlash modali
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTab, setMediaModalTab] = useState('avatar'); // 'avatar' | 'cover'

  // Fayl yuklash referenslari
  const avatarFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);

  // Form states for editing
  const [nameInput, setNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [favoriteAnimeInput, setFavoriteAnimeInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');
  const [coverInput, setCoverInput] = useState('');

  // Storage states
  const [savedItems, setSavedItems] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [watchHistory, setWatchHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [myComments, setMyComments] = useState([]);

  // API Modal
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    const prof = getUserProfile();
    setProfile(prof);
    setNameInput(prof.name);
    setUsernameInput(prof.username);
    setBioInput(prof.bio);
    setFavoriteAnimeInput(prof.favoriteAnime || 'Attack on Titan, Jujutsu Kaisen, Your Name');
    setAvatarInput(prof.avatar);
    setCoverInput(prof.coverImage);

    setSavedItems(getSavedItems());
    setLikedIds(getLikedItemIds());
    setWatchHistory(getWatchHistory());
    setOrders(getOrders());

    fetchComments('all').then((cmts) => {
      setMyComments(cmts);
    });
  }, []);

  // 1. Avatar Faylini Qurilmadan Yuklash (Kompyuter / Telefon)
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Faqat rasm fayllarini yuklash mumkin! ⚠️');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Rasm hajmi 8MB dan oshmasligi kerak! ⚠️');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatarInput(dataUrl);
      const updated = { ...profile, avatar: dataUrl };
      saveUserProfile(updated);
      setProfile(updated);
      setIsMediaModalOpen(false);
      showToast('Profil rasmi muvaffaqiyatli yuklandi! 📸✨');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 2. Cover (Muqova) Faylini Qurilmadan Yuklash
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Faqat rasm fayllarini yuklash mumkin! ⚠️');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Muqova hajmi 10MB dan oshmasligi kerak! ⚠️');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setCoverInput(dataUrl);
      const updated = { ...profile, coverImage: dataUrl };
      saveUserProfile(updated);
      setProfile(updated);
      setIsMediaModalOpen(false);
      showToast('Muqova rasmi muvaffaqiyatli yangilandi! 🖼️✨');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 3. Tayyor Anime Avatarlaridan Tanlash
  const handleSelectPresetAvatar = (url) => {
    setAvatarInput(url);
    const updated = { ...profile, avatar: url };
    saveUserProfile(updated);
    setProfile(updated);
    setIsMediaModalOpen(false);
    showToast('Anime avatari o‘rnatildi! 🎌✨');
  };

  // 4. Tayyor Anime Muqovalaridan Tanlash
  const handleSelectPresetCover = (url) => {
    setCoverInput(url);
    const updated = { ...profile, coverImage: url };
    saveUserProfile(updated);
    setProfile(updated);
    setIsMediaModalOpen(false);
    showToast('Muqova rasmi tanlandi! 🌌✨');
  };

  // 5. Profil Formasini Saqlash
  const handleSaveProfile = (e) => {
    e?.preventDefault();
    const updated = {
      ...profile,
      name: nameInput.trim() || profile.name,
      username: usernameInput.trim() || profile.username,
      bio: bioInput.trim() || profile.bio,
      favoriteAnime: favoriteAnimeInput.trim() || profile.favoriteAnime,
      avatar: avatarInput.trim() || profile.avatar,
      coverImage: coverInput.trim() || profile.coverImage
    };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditing(false);
    showToast('Profil ma‘lumotlari saqlandi! ✅');
  };

  const handleRemoveSaved = (id) => {
    const res = removeSavedItem(id);
    setSavedItems(res);
    showToast('Element saqlanganlardan o‘chirildi 🗑️');
  };

  const handleClearHistory = () => {
    clearWatchHistory();
    setWatchHistory([]);
    showToast('Ko‘rish tarixi tozalandi 🧹');
  };

  return (
    <div className="profile-page-container">
      {/* Yashirin Fayl Yuklash Inputlari */}
      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarFileUpload}
      />
      <input
        ref={coverFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleCoverFileUpload}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="videos-toast">
          <Sparkles size={18} className="toast-sparkle-icon" />
          <span>{toast}</span>
        </div>
      )}

      {/* API Sozlamalar Modali */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSaveSuccess={(msg) => showToast(msg)}
      />

      {/* ========================================================
          MODAL: AVATAR VA MUQOVA ALMASHTIRISH GALEREYASI
          ======================================================== */}
      {isMediaModalOpen && (
        <div className="modal-backdrop-blur" onClick={() => setIsMediaModalOpen(false)}>
          <div className="media-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="media-modal-header">
              <div className="media-modal-tabs">
                <button
                  className={`media-tab-btn ${mediaModalTab === 'avatar' ? 'active' : ''}`}
                  onClick={() => setMediaModalTab('avatar')}
                >
                  <User size={16} />
                  <span>Anime Avatarlar ({PRESET_ANIME_AVATARS.length})</span>
                </button>
                <button
                  className={`media-tab-btn ${mediaModalTab === 'cover' ? 'active' : ''}`}
                  onClick={() => setMediaModalTab('cover')}
                >
                  <Palette size={16} />
                  <span>Muqova Fonlari ({PRESET_ANIME_COVERS.length})</span>
                </button>
              </div>

              <button className="player-close-btn" onClick={() => setIsMediaModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="media-modal-body">
              {/* O'z qurilmasidan yuklash bloki */}
              <div className="device-upload-card">
                <div className="upload-left-icon">
                  <Upload size={24} color="#ff3366" />
                </div>
                <div className="upload-meta">
                  <h4>O'z kompyuter yoki telefoningizdan rasm yuklang</h4>
                  <p>JPG, PNG, WebP formatlari qo'llab-quvvatlanadi (Maks: 10MB)</p>
                </div>
                <button
                  className="btn-upload-file-action"
                  onClick={() => {
                    if (mediaModalTab === 'avatar') {
                      avatarFileInputRef.current?.click();
                    } else {
                      coverFileInputRef.current?.click();
                    }
                  }}
                >
                  <Upload size={16} />
                  <span>{mediaModalTab === 'avatar' ? "Avatar Yuklash" : "Muqova Yuklash"}</span>
                </button>
              </div>

              {/* AVATARLAR GALEREYASI */}
              {mediaModalTab === 'avatar' && (
                <div className="preset-gallery-section">
                  <h4 className="preset-section-title">Eng Sara Anime Avatarlari (Bir bosishda tanlang):</h4>
                  <div className="preset-avatars-grid">
                    {PRESET_ANIME_AVATARS.map((av) => {
                      const isSelected = profile.avatar === av.url;
                      return (
                        <div
                          key={av.id}
                          className={`preset-avatar-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectPresetAvatar(av.url)}
                        >
                          <div className="preset-avatar-wrap">
                            <img src={av.url} alt={av.name} />
                            {isSelected && (
                              <div className="avatar-check-badge">
                                <Check size={14} color="#ffffff" />
                              </div>
                            )}
                          </div>
                          <span className="preset-avatar-name">{av.name}</span>
                          <span className="preset-avatar-sub">{av.anime}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MUQOVALAR GALEREYASI */}
              {mediaModalTab === 'cover' && (
                <div className="preset-gallery-section">
                  <h4 className="preset-section-title">Kinematik Anime Muqovalari:</h4>
                  <div className="preset-covers-grid">
                    {PRESET_ANIME_COVERS.map((cov) => {
                      const isSelected = profile.coverImage === cov.url;
                      return (
                        <div
                          key={cov.id}
                          className={`preset-cover-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectPresetCover(cov.url)}
                        >
                          <div className="preset-cover-wrap">
                            <img src={cov.url} alt={cov.name} />
                            {isSelected && (
                              <div className="cover-check-badge">
                                <Check size={14} color="#ffffff" />
                              </div>
                            )}
                          </div>
                          <span className="preset-cover-name">{cov.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. TOPBAR */}
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
            <div className="brand-icon-box profile-gradient">
              <User size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-main">ANIMESHIKLAR</span>
              <span className="brand-sub">PROFILE & ACCOUNT</span>
            </div>
          </div>
        </div>

        {/* Topbar Right Actions */}
        <div className="videos-topbar-right">
          <button
            className="video-stats-pill click-pill"
            onClick={() => onOpenShopping && onOpenShopping()}
            title="Anime do'koni"
          >
            <ShoppingBag size={16} color="#10b981" />
            <span>Do'kon</span>
          </button>

          <button
            className="video-stats-pill click-pill"
            onClick={() => setIsApiModalOpen(true)}
            title="API Kalitlari Sozlamasi"
          >
            <Key size={16} color="#ff3366" />
            <span>API Sozlama</span>
          </button>

          <div className="video-stats-pill">
            <Heart size={16} color="#ec4899" fill="#ec4899" />
            <span>{likedIds.size}</span>
          </div>
        </div>
      </header>

      {/* 2. PROFILE HERO & COVER BANNER */}
      <div className="profile-hero-section">
        <div className="profile-cover-wrap">
          <img src={profile.coverImage} alt="Cover" className="profile-cover-img" />
          <div className="profile-cover-overlay" />
          
          {/* Muqova boshqaruv tugmalari */}
          <div className="cover-actions-group">
            <button
              className="btn-change-cover"
              onClick={() => coverFileInputRef.current?.click()}
              title="Kompyuterdan yangi muqova yuklash"
            >
              <Upload size={15} />
              <span>Muqova yuklash</span>
            </button>
            <button
              className="btn-change-cover secondary"
              onClick={() => {
                setMediaModalTab('cover');
                setIsMediaModalOpen(true);
              }}
              title="Tayyor anime muqovalari"
            >
              <Palette size={15} />
              <span>Fonlar</span>
            </button>
          </div>
        </div>

        {/* Profile Card Info Box */}
        <div className="profile-info-strip">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-box">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="profile-main-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/anime-pfp/kaneki-tokyo-ghoul-pfp.jpg';
                }}
              />
              <div className="avatar-online-badge" title="Faol Muxlis" />
              
              {/* Hover Qatlam — Rasm almashtirish */}
              <div
                className="avatar-hover-layer"
                onClick={() => {
                  setMediaModalTab('avatar');
                  setIsMediaModalOpen(true);
                }}
              >
                <Camera size={24} color="#ffffff" />
                <span>O'zgartirish</span>
              </div>
            </div>

            <button
              className="avatar-quick-upload-pill"
              onClick={() => avatarFileInputRef.current?.click()}
              title="Kompyuter yoki telefondan rasm yuklash"
            >
              <Upload size={13} /> Rasm yuklash
            </button>
          </div>

          <div className="profile-text-meta">
            <div className="profile-name-row">
              <h1 className="profile-display-name">{profile.name}</h1>
              <span className="profile-badge-tier">
                <Sparkles size={13} /> S-Rank Otaku
              </span>
              <span className="profile-verified-badge" title="Tasdiqlangan Profil">
                <CheckCircle2 size={16} color="#3b82f6" />
              </span>
            </div>

            <div className="profile-handle">
              <span className="handle-tag">{profile.username}</span>
              <span className="dot-sep">•</span>
              <span>A'zolik: <strong>{profile.joinedDate || '2026-yil'}</strong></span>
              <span className="dot-sep">•</span>
              <span>Sevimli anime: <span className="fav-anime-highlight">{profile.favoriteAnime || 'Barchasi'}</span></span>
            </div>

            <p className="profile-bio-text">{profile.bio}</p>

            {/* Otaku Level & XP Bar */}
            <div className="otaku-level-bar-box">
              <div className="level-bar-header">
                <span className="level-badge">
                  <Award size={14} color="#fbbf24" /> Lv. 48 • Afsonaviy Otaku
                </span>
                <span className="xp-text">2,450 / 3,000 XP (Keyingi darajagacha 550 XP)</span>
              </div>
              <div className="xp-progress-track">
                <div className="xp-progress-fill" style={{ width: '82%' }} />
              </div>
            </div>
          </div>

          <div className="profile-actions-col">
            <button
              className="btn-select-avatar-gallery"
              onClick={() => {
                setMediaModalTab('avatar');
                setIsMediaModalOpen(true);
              }}
            >
              <Palette size={16} />
              <span>Avatarlar</span>
            </button>

            <button
              className={`btn-edit-profile ${isEditing ? 'active' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={16} />
              <span>{isEditing ? 'Yopish' : 'Tahrirlash'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 STATISTIKA KARTALARI (QUICK STATS GRID) */}
      <div className="profile-stats-container">
        <div
          className={`stat-card-item ${activeTab === 'saved' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(255, 51, 102, 0.15)', color: '#ff3366' }}>
            <Bookmark size={20} />
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-num">{savedItems.length}</span>
            <span className="stat-card-label">Saqlanganlar</span>
          </div>
        </div>

        <div
          className={`stat-card-item ${activeTab === 'likes' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Heart size={20} />
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-num">{likedIds.size}</span>
            <span className="stat-card-label">Yoqtirilganlar</span>
          </div>
        </div>

        <div
          className={`stat-card-item ${activeTab === 'history' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Clock size={20} />
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-num">{watchHistory.length}</span>
            <span className="stat-card-label">Ko'rish Tarixi</span>
          </div>
        </div>

        <div
          className={`stat-card-item ${activeTab === 'orders' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Truck size={20} />
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-num">{orders.length}</span>
            <span className="stat-card-label">Buyurtmalar</span>
          </div>
        </div>

        <div
          className={`stat-card-item ${activeTab === 'comments' ? 'active-stat' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <MessageSquare size={20} />
          </div>
          <div className="stat-card-meta">
            <span className="stat-card-num">{myComments.length}</span>
            <span className="stat-card-label">Sharhlarim</span>
          </div>
        </div>
      </div>

      {/* 3. PROFILE EDIT FORM (TAHRIRLASH) */}
      {isEditing && (
        <div className="profile-edit-box">
          <div className="edit-box-header">
            <h3 className="edit-box-title">Profil Ma'lumotlarini Tahrirlash</h3>
            <span className="edit-box-sub">Ismingiz, username, bio va sevimli animelaringizni sozlang</span>
          </div>

          <form className="edit-profile-form" onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <div className="form-item">
                <label>Ism va Familiya</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ismingiz..."
                />
              </div>

              <div className="form-item">
                <label>Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="@username..."
                />
              </div>

              <div className="form-item full">
                <label>Sevimli Animelaringiz</label>
                <input
                  type="text"
                  value={favoriteAnimeInput}
                  onChange={(e) => setFavoriteAnimeInput(e.target.value)}
                  placeholder="Attack on Titan, Jujutsu Kaisen, Solo Leveling..."
                />
              </div>

              <div className="form-item full">
                <label>Bio (O'zingiz haqingizda qisqacha)</label>
                <textarea
                  rows="2"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Sevimli animeingiz, xarakteringiz..."
                />
              </div>

              {/* Rasm tanlash / o'rnatish tezkor tugmalari */}
              <div className="form-item">
                <label>Profil Rasmi (Avatar)</label>
                <div className="input-with-upload-actions">
                  <input
                    type="text"
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="Rasm URL manzili yoki fayl yuklang..."
                  />
                  <button
                    type="button"
                    className="btn-input-file-trigger"
                    onClick={() => avatarFileInputRef.current?.click()}
                    title="Fayl yuklash"
                  >
                    <Upload size={14} /> Fayl
                  </button>
                  <button
                    type="button"
                    className="btn-input-file-trigger secondary"
                    onClick={() => {
                      setMediaModalTab('avatar');
                      setIsMediaModalOpen(true);
                    }}
                    title="Anime avatarlaridan tanlash"
                  >
                    <Palette size={14} /> Anime
                  </button>
                </div>
              </div>

              <div className="form-item">
                <label>Cover (Muqova Foni)</label>
                <div className="input-with-upload-actions">
                  <input
                    type="text"
                    value={coverInput}
                    onChange={(e) => setCoverInput(e.target.value)}
                    placeholder="Muqova URL manzili yoki fayl yuklang..."
                  />
                  <button
                    type="button"
                    className="btn-input-file-trigger"
                    onClick={() => coverFileInputRef.current?.click()}
                    title="Fayl yuklash"
                  >
                    <Upload size={14} /> Fayl
                  </button>
                  <button
                    type="button"
                    className="btn-input-file-trigger secondary"
                    onClick={() => {
                      setMediaModalTab('cover');
                      setIsMediaModalOpen(true);
                    }}
                    title="Anime muqovalaridan tanlash"
                  >
                    <Palette size={14} /> Fonlar
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Bekor qilish
              </button>
              <button type="submit" className="btn-save-api">
                <Check size={16} /> O'zgarishlarni Saqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. PROFILE NAVIGATION TABS */}
      <div className="profile-tabs-strip">
        <button
          className={`profile-tab-item ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={18} />
          <span>Saqlanganlar ({savedItems.length})</span>
        </button>

        <button
          className={`profile-tab-item ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          <Heart size={18} />
          <span>Yoqtirilganlar ({likedIds.size})</span>
        </button>

        <button
          className={`profile-tab-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} />
          <span>Ko'rish Tarixi ({watchHistory.length})</span>
        </button>

        <button
          className={`profile-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Truck size={18} />
          <span>Buyurtmalar ({orders.length})</span>
        </button>

        <button
          className={`profile-tab-item ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare size={18} />
          <span>Sharhlarim ({myComments.length})</span>
        </button>

        <button
          className={`profile-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          <span>Sozlamalar</span>
        </button>
      </div>

      {/* 5. TAB CONTENT AREAS */}
      <main className="profile-tab-content">
        {/* TAB 1: SAVED */}
        {activeTab === 'saved' && (
          <div>
            <div className="tab-title-line">
              <h2>Saqlangan Materiallar ({savedItems.length})</h2>
            </div>

            {savedItems.length === 0 ? (
              <div className="empty-content-card">
                <Bookmark size={48} className="empty-icon" />
                <p>Hozircha saqlangan materiallar mavjud emas.</p>
              </div>
            ) : (
              <div className="saved-items-grid">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="saved-item-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectAnime && onSelectAnime(item.id)}
                  >
                    <div className="saved-thumb-wrap">
                      <img
                        src={item.thumbnail || item.url || item.poster || item.image}
                        alt={item.title || item.name}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSaved(item.id);
                        }}
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="saved-card-details">
                      <h4 className="saved-card-title">{item.title || item.name}</h4>
                      <span className="saved-card-sub">
                        {item.anime || item.category || 'Anime Kontenti'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LIKES */}
        {activeTab === 'likes' && (
          <div>
            <div className="tab-title-line">
              <h2>Yoqtirilgan Kontentlar ({likedIds.size})</h2>
            </div>

            <div className="likes-summary-box">
              <Heart size={44} color="#ff3366" fill="#ff3366" />
              <h3>Siz {likedIds.size} ta anime kontentini yoqtirdingiz</h3>
              <p>
                Videolar, shorts, rasmlar va do'kondagi buyumlar orasidan eng sara tanlovlaringiz.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: WATCH HISTORY */}
        {activeTab === 'history' && (
          <div>
            <div className="tab-title-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Ko'rish Tarixi ({watchHistory.length})</h2>
              {watchHistory.length > 0 && (
                <button className="btn-clear-history" onClick={handleClearHistory}>
                  <Trash2 size={15} /> Tarixni Tozalash
                </button>
              )}
            </div>

            {watchHistory.length === 0 ? (
              <div className="empty-content-card">
                <Clock size={48} className="empty-icon" />
                <p>Ko'rish tarixi hozircha bo'sh.</p>
              </div>
            ) : (
              <div className="history-list">
                {watchHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="history-item-row"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectAnime && onSelectAnime(item.id)}
                    title="Qayta tomosha qilish"
                  >
                    <img
                      src={item.thumbnail || item.poster}
                      alt={item.title}
                      className="history-thumb"
                    />
                    <div className="history-meta">
                      <h4>{item.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Ko'rildi: {item.watchedAt ? new Date(item.watchedAt).toLocaleDateString() : 'Yaqinda'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ORDERS (BUYURTMALAR) */}
        {activeTab === 'orders' && (
          <div>
            <div className="tab-title-line">
              <h2>Shopping Buyurtmalari ({orders.length})</h2>
            </div>

            {orders.length === 0 ? (
              <div className="empty-content-card">
                <Truck size={48} className="empty-icon" />
                <p>Hozircha buyurtmalar berilmagan.</p>
                <button
                  className="btn-save-api"
                  style={{ marginTop: '12px' }}
                  onClick={() => onOpenShopping && onOpenShopping()}
                >
                  <ShoppingBag size={16} /> Anime Do'koniga O'tish
                </button>
              </div>
            ) : (
              <div className="orders-list-scroll">
                {orders.map((ord) => (
                  <div key={ord.orderId} className="order-history-card">
                    <div className="order-top-line">
                      <div className="order-id-badge">
                        <span>{ord.orderId}</span>
                      </div>
                      <span className="order-status-badge">{ord.status}</span>
                    </div>

                    <div className="order-items-preview">
                      {ord.items &&
                        ord.items.map((it, idx) => (
                          <div key={idx} className="order-mini-item">
                            <img src={it.image} alt={it.name} className="mini-thumb" />
                            <div className="mini-meta">
                              <span className="mini-name">{it.name}</span>
                              <span className="mini-details">
                                {it.quantity} x {it.price.toLocaleString()} so'm ({it.selectedSize})
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="order-bottom-bar">
                      <div className="order-meta-info">
                        <span>Qabul qiluvchi: {ord.customerName}</span>
                        <span>Manzil: {ord.address}</span>
                      </div>
                      <div className="order-total-price">
                        <span>Jami:</span>
                        <h4>{ord.totalAmount.toLocaleString()} so'm</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4.5: COMMENTS (FOYDALANUVCHINING FIKRLARI) */}
        {activeTab === 'comments' && (
          <div>
            <div className="tab-title-line">
              <h2>Mening Yozgan Fikrlarim ({myComments.length})</h2>
            </div>

            {myComments.length === 0 ? (
              <div className="empty-content-card">
                <MessageSquare size={48} className="empty-icon" />
                <p>Hozircha birorta ham comment yozmagansiz. Videolar ostida o'z fikringizni qoldiring!</p>
              </div>
            ) : (
              <div className="history-list">
                {myComments.map((cmt) => (
                  <div key={cmt.id} className="history-item-row" style={{ alignItems: 'flex-start' }}>
                    <img src={cmt.avatar} alt={cmt.author} className="history-thumb" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                    <div className="history-meta" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: '#fff', fontSize: '0.9rem' }}>{cmt.author} <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 500 }}>{cmt.username}</span></h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {cmt.createdAt ? new Date(cmt.createdAt).toLocaleDateString() : 'Yaqinda'}
                        </span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.86rem', marginTop: '4px', lineHeight: 1.4 }}>{cmt.text}</p>
                      <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.76rem', color: '#ff3366' }}>
                        <span>❤️ {cmt.likes || 0} ta like</span>
                        <span>💬 {cmt.replies ? cmt.replies.length : 0} ta javob</span>
                      </div>
                    </div>
                    <button
                      className="saved-remove-btn"
                      style={{ position: 'static' }}
                      onClick={async () => {
                        await deleteComment(cmt.id);
                        setMyComments((prev) => prev.filter((c) => c.id !== cmt.id));
                        showToast('Comment o\'chirildi 🗑️');
                      }}
                      title="O'chirish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="settings-panel-box">
            <div className="tab-title-line">
              <h2>Hisob Sozlamalari & Xavfsizlik</h2>
            </div>

            <div className="settings-cards-col">
              <div className="setting-action-card">
                <div>
                  <h4>API Kalitlari & Tashqi Manbalar</h4>
                  <p>YouTube Data API v3, TMDB va Pexels kalitlarini sozlash</p>
                </div>
                <button className="btn-save-api" onClick={() => setIsApiModalOpen(true)}>
                  <Key size={16} /> Sozlash
                </button>
              </div>

              <div className="setting-action-card">
                <div>
                  <h4>Profil Rasmi & Muqova</h4>
                  <p>O'z kompyuteringizdan rasm yuklang yoki tayyor anime avatarlarini tanlang</p>
                </div>
                <button
                  className="btn-save-api"
                  onClick={() => {
                    setMediaModalTab('avatar');
                    setIsMediaModalOpen(true);
                  }}
                >
                  <Camera size={16} /> Rasmlar
                </button>
              </div>

              <div className="setting-action-card">
                <div>
                  <h4>Ma'lumotlar Maxfiyligi</h4>
                  <p>Barcha saqlanganlar, ko'rish tarixi va profil ma'lumotlari xavfsiz saqlanmoqda</p>
                </div>
                <span className="status-secure">
                  <Shield size={16} color="#10b981" /> Himoyalangan
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
