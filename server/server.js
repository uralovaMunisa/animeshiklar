// ANIMESHIKLAR OLAMI — BACKEND REST API SERVER
// Built-in Node.js HTTP Server (No external dependencies required!)

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { SHOPPING_PRODUCTS_DATA } from '../src/data/shoppingData.js';
import { ANIME_MOVIES_DATA } from '../src/data/moviesData.js';
import { YOUTUBE_VIDEOS_DATA } from '../src/data/youtubeVideosData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// 1. .env faylini avtomatik yuklash
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const PORT = parseInt(process.env.PORT || '5000', 10);

// CORS va JSON javob yordamchilari
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return true;
  }
  return false;
}

// Request body o'qish (JSON)
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', (err) => reject(err));
  });
}

// ========================================================
// SERVER ROUTER
// ========================================================
const server = http.createServer(async (req, res) => {
  if (handleCors(req, res)) return;

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5000'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const searchParams = parsedUrl.searchParams;

  try {
    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'Animeshiklar Olami Backend API',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        hasYouTubeKey: Boolean(process.env.YOUTUBE_API_KEY),
        hasTmdbKey: Boolean(process.env.TMDB_API_KEY),
        hasPexelsKey: Boolean(process.env.PEXELS_API_KEY)
      });
    }

    // 2. Foydalanuvchi Profili
    if (pathname === '/api/auth/profile') {
      if (method === 'GET') {
        const profile = db.getUserProfile();
        return sendJson(res, 200, { success: true, profile });
      }
      if (method === 'POST') {
        const body = await readJsonBody(req);
        const updated = db.updateUserProfile('usr_default_01', body);
        return sendJson(res, 200, { success: true, profile: updated });
      }
    }

    // 2.5. KOMMENTARIYALAR (COMMENTS API)
    if (pathname === '/api/comments') {
      if (method === 'GET') {
        const targetId = searchParams.get('targetId') || 'all';
        const comments = db.getComments(targetId);
        return sendJson(res, 200, { success: true, count: comments.length, comments });
      }
      if (method === 'POST') {
        const body = await readJsonBody(req);
        const newComment = db.addComment(body);
        return sendJson(res, 201, { success: true, comment: newComment });
      }
    }
    if (pathname.startsWith('/api/comments/') && method === 'DELETE') {
      const commentId = decodeURIComponent(pathname.replace('/api/comments/', ''));
      const deleted = db.deleteComment(commentId);
      return sendJson(res, 200, { success: deleted });
    }
    if (pathname === '/api/comments/like' && method === 'POST') {
      const body = await readJsonBody(req);
      const liked = db.likeComment(body.commentId);
      return sendJson(res, 200, { success: liked });
    }

    // 3. Saqlanganlar (Saved Items)
    if (pathname === '/api/saved') {
      if (method === 'GET') {
        const items = db.getSavedItems();
        return sendJson(res, 200, { success: true, count: items.length, items });
      }
    }
    if (pathname === '/api/saved/toggle' && method === 'POST') {
      const body = await readJsonBody(req);
      const result = db.toggleSaveItem(body.item);
      return sendJson(res, 200, { success: true, ...result });
    }
    if (pathname.startsWith('/api/saved/') && method === 'DELETE') {
      const id = decodeURIComponent(pathname.replace('/api/saved/', ''));
      const items = db.removeSavedItem(id);
      return sendJson(res, 200, { success: true, items });
    }

    // 4. Liked Items
    if (pathname === '/api/likes') {
      if (method === 'GET') {
        const likedIds = db.getLikedIds();
        return sendJson(res, 200, { success: true, likedIds });
      }
    }
    if (pathname === '/api/likes/toggle' && method === 'POST') {
      const body = await readJsonBody(req);
      const result = db.toggleLike(body.id);
      return sendJson(res, 200, { success: true, ...result });
    }

    // 5. Ko'rish Tarixi (Watch History)
    if (pathname === '/api/history') {
      if (method === 'GET') {
        const history = db.getWatchHistory();
        return sendJson(res, 200, { success: true, history });
      }
      if (method === 'POST') {
        const body = await readJsonBody(req);
        const history = db.addToHistory(body.entry);
        return sendJson(res, 200, { success: true, history });
      }
      if (method === 'DELETE') {
        const history = db.clearHistory();
        return sendJson(res, 200, { success: true, history });
      }
    }

    // 6. Shopping Savati (Cart)
    if (pathname === '/api/cart') {
      if (method === 'GET') {
        const cart = db.getCart();
        return sendJson(res, 200, { success: true, count: cart.length, cart });
      }
    }
    if (pathname === '/api/cart/add' && method === 'POST') {
      const body = await readJsonBody(req);
      const cart = db.addToCart(body.product, body.quantity || 1, body.selectedSize || 'L');
      return sendJson(res, 200, { success: true, cart });
    }
    if (pathname === '/api/cart/update' && method === 'POST') {
      const body = await readJsonBody(req);
      const cart = db.updateCartQuantity(body.id, body.selectedSize, body.quantity);
      return sendJson(res, 200, { success: true, cart });
    }
    if (pathname === '/api/cart/remove' && method === 'POST') {
      const body = await readJsonBody(req);
      const cart = db.removeFromCart(body.id, body.selectedSize);
      return sendJson(res, 200, { success: true, cart });
    }
    if (pathname === '/api/cart/clear' && method === 'POST') {
      const cart = db.clearCart();
      return sendJson(res, 200, { success: true, cart });
    }

    // 7. Buyurtmalar (Orders)
    if (pathname === '/api/orders') {
      if (method === 'GET') {
        const orders = db.getOrders();
        return sendJson(res, 200, { success: true, orders });
      }
      if (method === 'POST') {
        const body = await readJsonBody(req);
        const newOrder = db.createOrder(body);
        return sendJson(res, 201, { success: true, order: newOrder });
      }
    }

    // 8. Shopping Mahsulotlari (Products API)
    if (pathname === '/api/shopping/products' && method === 'GET') {
      const q = (searchParams.get('q') || '').trim().toLowerCase();
      const cat = searchParams.get('category') || 'Barchasi';
      const sortBy = searchParams.get('sortBy') || 'featured'; // 'price_asc' | 'price_desc' | 'rating'

      let filtered = [...SHOPPING_PRODUCTS_DATA];
      if (cat && cat !== 'Barchasi') {
        const cleanCat = cat.toLowerCase();
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

      return sendJson(res, 200, {
        success: true,
        count: filtered.length,
        products: filtered
      });
    }

    // 9. YouTube Data API v3 Xavfsiz Backend Proxy
    if (pathname === '/api/youtube/search' && method === 'GET') {
      const query = searchParams.get('q') || 'Anime 4K AMV';
      const category = searchParams.get('category') || 'All';
      const pageToken = searchParams.get('pageToken') || '';
      const apiKey = process.env.YOUTUBE_API_KEY || '';

      db.addSearchQuery(query);

      // Agar rasmiy backend API kaliti mavjud bo'lsa, YouTube'ga murojaat qilish
      if (apiKey) {
        try {
          const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&q=${encodeURIComponent(
            query + (category !== 'All' ? ' ' + category : '')
          )}&type=video&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;

          const ytRes = await fetch(ytUrl);
          const ytData = await ytRes.json();

          if (ytData.items && ytData.items.length > 0) {
            const formatted = ytData.items.map((item) => ({
              id: item.id.videoId,
              youtubeId: item.id.videoId,
              title: item.snippet.title,
              anime: query || 'Anime Special',
              category: category !== 'All' ? category : 'Anime',
              channel: item.snippet.channelTitle,
              views: (Math.floor(Math.random() * 800 + 100) * 1000).toLocaleString() + ' ko\'rishlar',
              duration: '3:45',
              publishedAt: item.snippet.publishedAt?.slice(0, 10) || '2024',
              thumbnail:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium?.url ||
                `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
              itemType: 'video',
              source: 'YouTube Data API v3'
            }));

            return sendJson(res, 200, {
              success: true,
              source: 'YouTube Official API',
              nextPageToken: ytData.nextPageToken || null,
              totalResults: ytData.pageInfo?.totalResults || formatted.length,
              videos: formatted
            });
          }
        } catch (err) {
          console.warn('[YouTube API Proxy] Xatolik:', err.message);
        }
      }

      // Kalit bo'lmaganda yoki limit tugaganda: Barqaror Dinamik Natijalar Generator
      const cleanQ = query.toLowerCase();
      const filtered = YOUTUBE_VIDEOS_DATA.filter((v) => {
        const matchesQ = !cleanQ || v.title.toLowerCase().includes(cleanQ) || v.anime.toLowerCase().includes(cleanQ);
        const matchesCat = category === 'All' || v.category === category;
        return matchesQ && matchesCat;
      });

      // Agar qidiruv bo'yicha kam natija chiqsa, so'rov asosida dinamik video kartochkalari yaratish
      const results = [...filtered];
      if (results.length < 12 && query) {
        const dynamicCount = 18;
        for (let i = 1; i <= dynamicCount; i++) {
          const sampleYt = YOUTUBE_VIDEOS_DATA[(i * 3) % YOUTUBE_VIDEOS_DATA.length];
          results.push({
            id: `yt-dyn-${cleanQ}-${i}-${Date.now().toString(36)}`,
            youtubeId: sampleYt.youtubeId,
            title: `${query.toUpperCase()} — Epik Jang va Rasmiy Ko'rinish #${i}`,
            anime: query,
            category: category !== 'All' ? category : 'Anime AMV',
            channel: `${query} Official Channel`,
            views: (Math.floor(Math.random() * 900 + 150) * 1000).toLocaleString() + ' ko\'rishlar',
            duration: `${Math.floor(Math.random() * 4 + 2)}:${Math.floor(Math.random() * 50 + 10)}`,
            thumbnail: sampleYt.thumbnail,
            itemType: 'video',
            source: 'Dynamic YouTube Engine'
          });
        }
      }

      return sendJson(res, 200, {
        success: true,
        source: 'Dynamic Video Generator',
        nextPageToken: 'token_' + Date.now().toString(36),
        totalResults: results.length,
        videos: results
      });
    }

    // 10. TMDB Anime Movies Backend Proxy
    if (pathname === '/api/movies/search' && method === 'GET') {
      const query = (searchParams.get('q') || '').trim();
      const genre = searchParams.get('genre') || 'All Genres';
      const apiKey = process.env.TMDB_API_KEY || '';

      if (apiKey) {
        try {
          const tmdbUrl = query
            ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`
            : `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=16&sort_by=popularity.desc`;

          const mRes = await fetch(tmdbUrl);
          const mData = await mRes.json();

          if (mData.results && mData.results.length > 0) {
            const movies = mData.results.map((m) => ({
              id: 'tmdb-' + m.id,
              title: m.title,
              japaneseTitle: m.original_title,
              year: m.release_date?.slice(0, 4) || '2023',
              rating: (m.vote_average || 8.0).toFixed(1),
              duration: '115 daqiqa',
              genre: genre !== 'All Genres' ? genre : 'Anime / Fantasy',
              director: 'TMDB Director',
              studio: 'Animation Studio',
              overview: m.overview || 'Ushbu to\'liq metrajli anime filmi yuqori sifatli animatsiya bilan yaratilgan.',
              poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ANIME_MOVIES_DATA[0].poster,
              backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : ANIME_MOVIES_DATA[0].backdrop,
              trailerId: 'dQw4w9WgXcQ',
              officialPlatforms: ['Crunchyroll', 'Netflix'],
              itemType: 'movie'
            }));

            return sendJson(res, 200, {
              success: true,
              source: 'TMDB Official API',
              movies
            });
          }
        } catch (err) {
          console.warn('[TMDB API Proxy] Xatolik:', err.message);
        }
      }

      // TMDB kalit bo'lmaganda katalogdan filtrlab berish
      let list = [...ANIME_MOVIES_DATA];
      if (genre && genre !== 'All Genres' && genre !== 'Barchasi') {
        const cleanG = genre.toLowerCase();
        list = list.filter(
          (m) =>
            m.genre.toLowerCase() === cleanG ||
            (m.genres && m.genres.some((g) => g.toLowerCase() === cleanG)) ||
            m.genre.toLowerCase().includes(cleanG)
        );
      }
      if (query) {
        const cleanQ = query.toLowerCase();
        list = list.filter(
          (m) =>
            m.title.toLowerCase().includes(cleanQ) ||
            (m.japaneseTitle && m.japaneseTitle.toLowerCase().includes(cleanQ)) ||
            (m.overview && m.overview.toLowerCase().includes(cleanQ)) ||
            (m.director && m.director.toLowerCase().includes(cleanQ)) ||
            (m.studio && m.studio.toLowerCase().includes(cleanQ))
        );
      }
      return sendJson(res, 200, { success: true, source: 'Animem.uz & TMDB Anime Catalog', count: list.length, movies: list });
    }

    // 11. Qidiruv Tarixi (Search History)
    if (pathname === '/api/search/history') {
      if (method === 'GET') {
        const history = db.getSearchHistory();
        return sendJson(res, 200, { success: true, history });
      }
      if (method === 'POST') {
        const body = await readJsonBody(req);
        const history = db.addSearchQuery(body.query);
        return sendJson(res, 200, { success: true, history });
      }
    }

    // 404 Not Found
    return sendJson(res, 404, { error: 'API endpoint topilmadi', pathname });
  } catch (error) {
    console.error('[SERVER ERROR]:', error);
    return sendJson(res, 500, { error: 'Server xatoligi', message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ ANIMESHIKLAR OLAMI — BACKEND SERVER ISHGA TUSHDI!`);
  console.log(`🌐 API Server: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 YouTube API Key: ${process.env.YOUTUBE_API_KEY ? 'ULANGAN ✅' : 'KIRITILMAGAN (Dinamik fallback faol) ⚡'}`);
  console.log(`🎬 TMDB API Key: ${process.env.TMDB_API_KEY ? 'ULANGAN ✅' : 'KIRITILMAGAN (Katalog faol) ⚡'}`);
  console.log(`======================================================\n`);
});

