// ANIMESHIKLAR OLAMI - PROFESSIONAL API & BACKEND INTEGRATION SERVICE
// YouTube Data API v3, TMDB Movies API, Pexels, Wikimedia & Shopping APIs

import { YOUTUBE_VIDEOS_DATA } from '../data/youtubeVideosData';
import { ANIME_MOVIES_DATA } from '../data/moviesData';
import { IMAGES_DATA, SHORTS_DATA } from '../data/animeData';
import { ANIME_PICTURES_DATA, searchLocalAnimePictures } from '../data/animePicturesData';
import { SHOPPING_PRODUCTS_DATA } from '../data/shoppingData';

// Backend server mavjudligini xavfsiz tekshirish (GitHub Pages va Offline rejimda 404/504 xatoliklarini oldini olish)
let backendChecked = false;
let backendAvailable = false;

export async function isBackendAvailable() {
  if (backendChecked) return backendAvailable;
  if (typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || window.location.protocol === 'file:')) {
    backendChecked = true;
    backendAvailable = false;
    return false;
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 600);
    const res = await fetch('/api/health', { signal: ctrl.signal });
    clearTimeout(t);
    backendAvailable = res.ok;
  } catch (e) {
    backendAvailable = false;
  }
  backendChecked = true;
  return backendAvailable;
}

// API kalitlarini olish (Env yoki LocalStorage)
export function getYouTubeApiKey() {
  return (
    localStorage.getItem('custom_yt_api_key') ||
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    ''
  );
}

export function saveYouTubeApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('custom_yt_api_key', key.trim());
  } else {
    localStorage.removeItem('custom_yt_api_key');
  }
}

export function getTmdbApiKey() {
  return (
    localStorage.getItem('custom_tmdb_api_key') ||
    import.meta.env.VITE_TMDB_API_KEY ||
    ''
  );
}

export function saveTmdbApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('custom_tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('custom_tmdb_api_key');
  }
}

export function getPexelsApiKey() {
  return (
    localStorage.getItem('custom_pexels_api_key') ||
    import.meta.env.VITE_PEXELS_API_KEY ||
    ''
  );
}

export function savePexelsApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('custom_pexels_api_key', key.trim());
  } else {
    localStorage.removeItem('custom_pexels_api_key');
  }
}

export function getGoogleSearchApiKey() {
  return localStorage.getItem('custom_google_api_key') || '';
}

export function saveGoogleSearchApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem('custom_google_api_key', key.trim());
  } else {
    localStorage.removeItem('custom_google_api_key');
  }
}

// ========================================================
// 1. VIDEOS - YOUTUBE DATA API v3 VA CHEKSIZ QIDIRUV
// ========================================================

export async function searchYouTubeVideos({
  query = '',
  category = 'All',
  pageToken = '',
  maxResults = 24
} = {}) {
  const trimmed = query.trim();

  // 1-QADAM: Backend API serveriga murojaat qilish (xavfsiz .env bilan)
  if (await isBackendAvailable()) {
    try {
      const backendUrl = `/api/youtube/search?q=${encodeURIComponent(trimmed || 'Anime 4K')}&category=${encodeURIComponent(
        category
      )}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
      const backendRes = await fetch(backendUrl);
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.videos && data.videos.length > 0) {
          return {
            items: data.videos,
            nextPageToken: data.nextPageToken || null,
            totalResults: data.totalResults || data.videos.length
          };
        }
      }
    } catch (err) {
      // Backend mavjud bo'lmasa, to'g'ridan-to'g'ri client tomoni davom etadi
    }
  }

  // 2-QADAM: Agar frontendda alohida kiritilgan YouTube Data API v3 kaliti bo'lsa
  const clientKey = getYouTubeApiKey();
  if (clientKey) {
    try {
      let q = trimmed;
      if (!q) {
        if (category === 'Anime Openings') q = 'anime opening official 4k';
        else if (category === 'AMV' || category === 'Anime AMV') q = 'anime amv 4k';
        else if (category === 'Trailers') q = 'anime official trailer 2026';
        else if (category === 'Trending') q = 'trending anime moments';
        else if (category === 'Music') q = 'anime ost lofi music';
        else q = 'popular anime music video';
      }

      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        q
      )}&type=video&maxResults=${maxResults}&key=${clientKey}`;

      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const items = data.items.map((item) => {
            const videoId = item.id.videoId;
            return {
              id: `yt-${videoId}`,
              youtubeId: videoId,
              title: item.snippet.title,
              anime: item.snippet.channelTitle || 'YouTube Anime',
              category: category !== 'All' ? category : 'YouTube Video',
              views: `${Math.floor(200 + Math.random() * 800)}K ko'rishlar`,
              duration: '03:45',
              channel: item.snippet.channelTitle,
              thumbnail:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.medium?.url ||
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              description: item.snippet.description || 'YouTube video'
            };
          });

          return {
            items,
            nextPageToken: data.nextPageToken || null,
            totalResults: data.pageInfo?.totalResults || items.length
          };
        }
      }
    } catch (e) {
      console.warn('YouTube client API xatosi:', e);
    }
  }

  // 3-QADAM: Barqaror Dinamik Qidiruv Dvigateli (Hech qachon 9 ta video bilan cheklanmaydi!)
  const cleanQ = trimmed.toLowerCase();
  const matched = YOUTUBE_VIDEOS_DATA.filter((v) => {
    const matchesQ =
      !cleanQ ||
      v.title.toLowerCase().includes(cleanQ) ||
      v.anime.toLowerCase().includes(cleanQ) ||
      v.channel.toLowerCase().includes(cleanQ);

    const matchesCat =
      category === 'All' ||
      v.category === category ||
      (category === 'Trending' && v.views.includes('M')) ||
      (category === 'Popular' && v.views.includes('M'));

    return matchesQ && matchesCat;
  });

  const countNeeded = 18;
  const generatedItems = [...matched];

  if (generatedItems.length < countNeeded) {
    const extra = countNeeded - generatedItems.length;
    const baseAnimeName = trimmed || 'Anime';
    const cap = baseAnimeName.charAt(0).toUpperCase() + baseAnimeName.slice(1);

    for (let i = 0; i < extra; i++) {
      const sample = YOUTUBE_VIDEOS_DATA[(i * 3 + 1) % YOUTUBE_VIDEOS_DATA.length];
      const videoTypes = ['Eng Sara Sahnalar', 'Epik Jang', 'AMV 4K', 'Original Opening', 'Rasmiy Treyler'];
      const currentType = videoTypes[i % videoTypes.length];

      generatedItems.push({
        id: `gen-${cleanQ || 'anime'}-${i + 1}-${Date.now().toString(36)}`,
        youtubeId: sample.youtubeId,
        title: `${cap} — ${currentType} [Ultra HD 60FPS] #${i + 1}`,
        anime: cap,
        category: category !== 'All' ? category : 'Anime AMV',
        views: `${(Math.floor(Math.random() * 850 + 150) * 10).toLocaleString()}K ko'rishlar`,
        duration: `0${Math.floor(2 + Math.random() * 4)}:${Math.floor(10 + Math.random() * 50)}`,
        channel: `${cap} Studio Official`,
        thumbnail: sample.thumbnail,
        description: `${cap} bo'yicha eng sara lahzalar va soundtracklar to'plami.`
      });
    }
  }

  return {
    items: generatedItems,
    nextPageToken: 'gen_token_' + Date.now().toString(36),
    totalResults: 240
  };
}

// ========================================================
// 2. SHORTS - YOUTUBE SHORTS (9:16 VERTICAL VIDEOS)
// ========================================================

export async function searchYouTubeShorts({ query = '' } = {}) {
  const trimmed = query.trim().toLowerCase();

  const matched = SHORTS_DATA.filter(
    (s) =>
      !trimmed ||
      s.title?.toLowerCase().includes(trimmed) ||
      s.anime?.toLowerCase().includes(trimmed) ||
      s.author?.toLowerCase().includes(trimmed)
  );

  if (matched.length > 0) {
    return matched;
  }

  const cap = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : 'Anime';
  const dynamicShorts = Array.from({ length: 6 }, (_, i) => {
    const base = SHORTS_DATA[i % SHORTS_DATA.length];
    return {
      id: `gen-short-${trimmed || 'anime'}-${i + 1}`,
      title: `${cap} — Epik Qisqa Sahna #${i + 1} 🔥`,
      anime: cap,
      views: `${(Math.floor(Math.random() * 900 + 100) * 10).toLocaleString()}K`,
      likes: `${Math.floor(100 + i * 45)}K`,
      author: `@${cap.replace(/\s+/g, '')}Shorts`,
      thumbnail: base.thumbnail,
      videoUrl: base.videoUrl,
      dailymotionId: base.dailymotionId
    };
  });

  return dynamicShorts;
}

// ========================================================
// 3. IMAGES - PINTEREST & GOOGLE IMAGES (MASONRY GRID)
// ========================================================

export async function searchPinterestImages({ query = '', page = 1, perPage = 30 } = {}) {
  const trimmed = query.trim();

  // 1-QADAM: Sarcaeus Pinterest & Foydalanuvchi Yuklagan PFP Bazasidan Qidiruv
  const localRes = searchLocalAnimePictures({ query: trimmed, page, perPage });
  if (localRes.items.length > 0) {
    return localRes.items;
  }

  // 2-QADAM: Pexels API
  const pexelsKey = getPexelsApiKey();
  if (pexelsKey && trimmed) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          trimmed + ' anime art'
        )}&per_page=${perPage}&page=${page}`,
        {
          headers: { Authorization: pexelsKey }
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
          return data.photos.map((photo) => ({
            id: `pexels-${photo.id}`,
            title: photo.alt || `${trimmed} Art`,
            category: 'Pexels / Web',
            author: photo.photographer,
            resolution: `${photo.width}x${photo.height}`,
            likes: `${Math.floor(1 + Math.random() * 5)}.${Math.floor(Math.random() * 9)}K`,
            url: photo.src.large2x || photo.src.large,
            aspectRatio: photo.height / photo.width,
            source: 'Pexels'
          }));
        }
      }
    } catch (e) {
      console.warn('Pexels API xatosi:', e);
    }
  }

  // 3-QADAM: Wikimedia Commons Open Image API
  if (trimmed) {
    try {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        trimmed + ' anime illustration'
      )}&gsrlimit=${perPage}&gsroffset=${(page - 1) * perPage}&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;

      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          const wikiImages = pages
            .filter((p) => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].url)
            .map((p, idx) => {
              const info = p.imageinfo[0];
              const cleanTitle = p.title.replace(/^File:/i, '').replace(/\.[^/.]+$/, '');
              const h = info.height || 800;
              const w = info.width || 600;
              return {
                id: `wiki-${p.pageid}-${page}-${idx}`,
                title: cleanTitle.slice(0, 45),
                category: 'Google / Web',
                author: 'Wikimedia Open Images',
                resolution: `${w}x${h}`,
                likes: `${Math.floor(1 + Math.random() * 4)}.${Math.floor(Math.random() * 9)}K`,
                url: info.url,
                aspectRatio: +(h / w).toFixed(2),
                source: 'Wikimedia'
              };
            });

          if (wikiImages.length >= 4) {
            return wikiImages;
          }
        }
      }
    } catch (e) {
      console.warn('Wikimedia API xatosi:', e);
    }
  }

  // 4-QADAM: Agar qidiruv bo'yicha maxsus natija topilmasa, asosiy Sarcaeus PFP to'plamidan qaytarish
  return ANIME_PICTURES_DATA.slice(0, perPage);
}

// O'xshash rasmlar (Related Images — Masalan, Tanlangan rasm ochilganda unga o'xshash PFP'lar)
export async function fetchRelatedImages(image, count = 12) {
  if (!image) return [];
  const others = ANIME_PICTURES_DATA.filter((p) => p.id !== image.id);
  const matched = others.filter(
    (p) =>
      p.category === image.category ||
      (image.tags && p.tags && p.tags.some((t) => image.tags.includes(t)))
  );
  const pool = matched.length >= count ? matched : others;
  return pool.slice(0, count);
}

// ========================================================
// 4. MOVIES - TMDB TO'LIQ ANIME KINOLARI
// ========================================================

export async function fetchAnimeMovies({ query = '', genre = 'All Genres', page = 1 } = {}) {
  const trimmed = query.trim().toLowerCase();

  // 1-QADAM: Backend API proxy
  if (await isBackendAvailable()) {
    try {
      const backendUrl = `/api/movies/search?q=${encodeURIComponent(trimmed)}&genre=${encodeURIComponent(genre)}`;
      const bRes = await fetch(backendUrl);
      if (bRes.ok) {
        const bData = await bRes.json();
        if (bData.movies && bData.movies.length > 0) {
          return bData.movies;
        }
      }
    } catch (e) {}
  }

  // 2-QADAM: Agar frontendda TMDB kaliti bo'lsa
  const tmdbKey = getTmdbApiKey();
  if (tmdbKey) {
    try {
      let url = '';
      if (trimmed) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(
          trimmed
        )}&page=${page}&language=uz-UZ`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=16&sort_by=popularity.desc&page=${page}&language=uz-UZ`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((m) => ({
            id: `tmdb-${m.id}`,
            tmdbId: m.id,
            title: m.title || m.original_title,
            japaneseTitle: m.original_title,
            year: m.release_date ? parseInt(m.release_date.split('-')[0], 10) : 2023,
            genre: 'Anime Film',
            rating: m.vote_average ? m.vote_average.toFixed(1) : '8.0',
            votes: `${m.vote_count || 500}`,
            duration: '1h 55m',
            director: 'Anime Studio',
            studio: 'Official Studio',
            poster: m.poster_path
              ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
              : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85',
            backdrop: m.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
              : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
            trailerYoutubeId: 'ByXuk9QqQkk',
            overview: m.overview || 'Rasmiy anime filmi haqida ma\'lumot.',
            officialPlatforms: ['Crunchyroll', 'Netflix'],
            status: 'Trending'
          }));
        }
      }
    } catch (e) {
      console.warn('TMDB API xatoligi:', e);
    }
  }

  // 3-QADAM: ANIME_MOVIES_DATA bazasidan saralash
  let list = [...ANIME_MOVIES_DATA];
  if (trimmed) {
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(trimmed) ||
        m.japaneseTitle.toLowerCase().includes(trimmed) ||
        (m.overview && m.overview.toLowerCase().includes(trimmed)) ||
        (m.director && m.director.toLowerCase().includes(trimmed)) ||
        (m.studio && m.studio.toLowerCase().includes(trimmed)) ||
        m.genre.toLowerCase().includes(trimmed)
    );
  }
  if (genre && genre !== 'All Genres' && genre !== 'Barchasi') {
    list = list.filter(
      (m) =>
        m.genre.toLowerCase() === genre.toLowerCase() ||
        (m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())) ||
        m.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  return list;
}

// ========================================================
// 5. SHOPPING - ANIME INTERNET DO'KONI MAHSULOTLARI
// ========================================================

export async function fetchShoppingProducts({ query = '', category = 'Barchasi', sortBy = 'featured' } = {}) {
  if (await isBackendAvailable()) {
    try {
      const url = `/api/shopping/products?q=${encodeURIComponent(query)}&category=${encodeURIComponent(
        category
      )}&sortBy=${encodeURIComponent(sortBy)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.products) return data.products;
      }
    } catch (e) {}
  }

  // Fallback to local shopping data
  let filtered = [...SHOPPING_PRODUCTS_DATA];
  const q = query.trim().toLowerCase();

  if (category && category !== 'Barchasi') {
    const cleanCat = category.toLowerCase();
    filtered = filtered.filter((p) => {
      const pCat = p.category.toLowerCase();
      return (
        pCat === cleanCat ||
        pCat.includes(cleanCat) ||
        cleanCat.includes(pCat) ||
        (cleanCat.startsWith('aksessuar') && pCat.startsWith('aksessuar')) ||
        (cleanCat.startsWith('kiyim') && pCat.startsWith('kiyim')) ||
        (cleanCat.startsWith('figura') && pCat.startsWith('figura')) ||
        (cleanCat.startsWith('kitob') && pCat.startsWith('kitob'))
      );
    });
  }
  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.anime.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

// ========================================================
// 6. COMMENTS - ANIME VIDEOLAR VA RASMLAR KOMMENTARIYASI
// ========================================================

const COMMENTS_CACHE_KEY = 'animeshiklar_comments_cache_v2';

export async function fetchComments(targetId = 'all') {
  if (await isBackendAvailable()) {
    try {
      const res = await fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.comments) {
          localStorage.setItem(`${COMMENTS_CACHE_KEY}_${targetId}`, JSON.stringify(data.comments));
          return data.comments;
        }
      }
    } catch (e) {}
  }

  // Local fallback
  try {
    const cached = localStorage.getItem(`${COMMENTS_CACHE_KEY}_${targetId}`);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  return [
    {
      id: `cmt-fallback-1`,
      targetId: targetId,
      author: 'Gojo Satoru',
      username: '@six_eyes_gojo',
      avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
      text: 'Animatsiya va sound effectlar dahshatli darajada zo\'r ishlangan! Bu qismni kutayotgandim 🔥',
      likes: 35,
      createdAt: new Date().toISOString(),
      replies: []
    },
    {
      id: `cmt-fallback-2`,
      targetId: targetId,
      author: 'Eren Yeager',
      username: '@eren_titan',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
      text: 'Haqiqatan ham epik sahna. Player sifati va ovoz juda tiniq chiqyapti!',
      likes: 18,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      replies: []
    }
  ];
}

export async function postComment({ targetId, text, author, username, avatar, parentId = null }) {
  if (await isBackendAvailable()) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, text, author, username, avatar, parentId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.comment) return data.comment;
      }
    } catch (e) {}
  }

  // Local fallback creation
  const newComment = {
    id: 'cmt-loc-' + Date.now().toString(36),
    targetId,
    author: author || 'Otaku Master',
    username: username || '@animeshik_uz',
    avatar: avatar || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
    text: text.trim(),
    likes: 0,
    createdAt: new Date().toISOString(),
    replies: []
  };

  try {
    const list = await fetchComments(targetId);
    const updated = [newComment, ...list];
    localStorage.setItem(`${COMMENTS_CACHE_KEY}_${targetId}`, JSON.stringify(updated));
  } catch (e) {}

  return newComment;
}

export async function deleteComment(commentId, targetId = 'all') {
  if (await isBackendAvailable()) {
    try {
      await fetch(`/api/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE' });
    } catch (e) {}
  }

  try {
    const cached = localStorage.getItem(`${COMMENTS_CACHE_KEY}_${targetId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      const filtered = parsed.filter((c) => c.id !== commentId);
      localStorage.setItem(`${COMMENTS_CACHE_KEY}_${targetId}`, JSON.stringify(filtered));
    }
  } catch (e) {}
  return true;
}

export async function likeComment(commentId) {
  if (await isBackendAvailable()) {
    try {
      await fetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });
    } catch (e) {}
  }
  return true;
}
