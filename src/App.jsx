import React, { useState, useEffect } from 'react';
import './App.css';
import IntroScreen from './components/IntroScreen';
import MainScreen from './components/MainScreen';
import VideosScreen from './components/VideosScreen';
import MoviesScreen from './components/MoviesScreen';
import ShoppingScreen from './components/ShoppingScreen';
import ProfileScreen from './components/ProfileScreen';
import AnimeDetailScreen from './components/AnimeDetailScreen';

export default function App() {
  // Hashdan dastlabki holatni va anime ID sini aniqlash
  const parseHashState = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (!rawHash) return { screen: 'intro', animeId: 'spy-family' };

    // Agar anime tafsilotlari bo'lsa: #anime?id=spy-family yoki #anime/spy-family
    if (rawHash.startsWith('anime')) {
      let id = 'spy-family';
      if (rawHash.includes('?id=')) {
        id = rawHash.split('?id=')[1].split('&')[0];
      } else if (rawHash.includes('/')) {
        id = rawHash.split('/')[1].split('?')[0];
      }
      return { screen: 'anime-detail', animeId: id || 'spy-family' };
    }

    const valid = ['intro', 'main', 'videos', 'movies', 'shopping', 'profile'];
    if (valid.includes(rawHash)) {
      return { screen: rawHash, animeId: null };
    }

    return { screen: 'intro', animeId: null };
  };

  const initialParsed = parseHashState();
  const [currentScreen, setCurrentScreen] = useState(initialParsed.screen);
  const [selectedAnimeId, setSelectedAnimeId] = useState(initialParsed.animeId || 'spy-family');
  const [previousScreen, setPreviousScreen] = useState('videos');

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAnime = (animeId) => {
    if (currentScreen !== 'anime-detail') {
      setPreviousScreen(currentScreen);
    }
    setSelectedAnimeId(animeId);
    setCurrentScreen('anime-detail');
    window.location.hash = `anime?id=${encodeURIComponent(animeId)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    navigateTo(previousScreen || 'videos');
  };

  // Brauzer orqaga/oldinga tugmalari va hash o'zgarishi
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashState();
      setCurrentScreen(parsed.screen);
      if (parsed.animeId) {
        setSelectedAnimeId(parsed.animeId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="anime-app-root">
      {/* 1. INTRO SCREEN */}
      {currentScreen === 'intro' && (
        <IntroScreen onStart={() => navigateTo('main')} />
      )}

      {/* 2. MAIN SCREEN (ASOSIY SAHIFA) */}
      {currentScreen === 'main' && (
        <MainScreen
          onBackToIntro={() => navigateTo('intro')}
          onOpenVideos={() => navigateTo('videos')}
          onOpenMovies={() => navigateTo('movies')}
          onOpenShopping={() => navigateTo('shopping')}
          onOpenProfile={() => navigateTo('profile')}
          onSelectAnime={navigateToAnime}
        />
      )}

      {/* 3. VIDEOS SCREEN (ANIMEM.UZ USLUBIDAGI ANIME KATALOGI) */}
      {currentScreen === 'videos' && (
        <VideosScreen
          onBackToHome={() => navigateTo('main')}
          onBackToIntro={() => navigateTo('intro')}
          onOpenMovies={() => navigateTo('movies')}
          onOpenShopping={() => navigateTo('shopping')}
          onOpenProfile={() => navigateTo('profile')}
          onSelectAnime={navigateToAnime}
        />
      )}

      {/* 4. MOVIES SCREEN (KINOLAR BO'LIMI) */}
      {currentScreen === 'movies' && (
        <MoviesScreen
          onBackToHome={() => navigateTo('main')}
          onBackToIntro={() => navigateTo('intro')}
          onOpenVideos={() => navigateTo('videos')}
          onOpenShopping={() => navigateTo('shopping')}
          onOpenProfile={() => navigateTo('profile')}
          onSelectAnime={navigateToAnime}
        />
      )}

      {/* 5. ANIME DETAIL SCREEN (HAR BIR ANIME UCHUN ALOHIDA SAHIFA, QISMLAR VA PLAYER) */}
      {currentScreen === 'anime-detail' && (
        <AnimeDetailScreen
          animeId={selectedAnimeId}
          onBack={handleBackFromDetail}
          onSelectAnime={navigateToAnime}
          onOpenShopping={() => navigateTo('shopping')}
          onOpenProfile={() => navigateTo('profile')}
        />
      )}

      {/* 6. SHOPPING SCREEN (ANIME DO'KONI VA MERCH) */}
      {currentScreen === 'shopping' && (
        <ShoppingScreen
          onBackToHome={() => navigateTo('main')}
          onBackToIntro={() => navigateTo('intro')}
          onOpenVideos={() => navigateTo('videos')}
          onOpenMovies={() => navigateTo('movies')}
          onOpenProfile={() => navigateTo('profile')}
        />
      )}

      {/* 7. PROFILE SCREEN (PROFIL, SAQLANGANLAR VA TARIX) */}
      {currentScreen === 'profile' && (
        <ProfileScreen
          onBackToHome={() => navigateTo('main')}
          onBackToIntro={() => navigateTo('intro')}
          onOpenVideos={() => navigateTo('videos')}
          onOpenMovies={() => navigateTo('movies')}
          onOpenShopping={() => navigateTo('shopping')}
          onSelectAnime={navigateToAnime}
        />
      )}
    </div>
  );
}
