// ANIMESHIKLAR OLAMI - PERSISTENT DATABASE ENGINE
// Node.js fs-based JSON database engine with auto-persistence

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_DB = {
  users: [
    {
      id: 'usr_default_01',
      username: '@animeshik_uz',
      name: 'Otaku Master',
      bio: 'Anime va manga shaydosi | Gojo Satoru & Solo Leveling muxlisi | Animeshiklar Olami rasmiy a\'zosi',
      favoriteAnime: 'Attack on Titan, Jujutsu Kaisen, Your Name',
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
      role: 'VIP Otaku',
      createdAt: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: 'cmt-init-01',
      targetId: 'all',
      author: 'Eren Yeager',
      username: '@eren_titan',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
      text: 'Animatsiya sifati va sound effectlar dahshatli darajada zo\'r ishlangan! Bu platformada ko\'rish juda qulay 🔥',
      likes: 24,
      createdAt: '2026-11-14T10:00:00.000Z',
      replies: [
        {
          id: 'cmt-init-01-rep-1',
          author: 'Mikasa Ackerman',
          username: '@mikasa_a',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          text: 'Rostdan ham, 60 FPS va ovoz effekti to\'liq tiniq chiqyapti!',
          likes: 9,
          createdAt: '2026-11-14T10:15:00.000Z'
        }
      ]
    },
    {
      id: 'cmt-init-02',
      targetId: 'all',
      author: 'Gojo Satoru',
      username: '@six_eyes_gojo',
      avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
      text: 'Cheksiz Bo\'shliq (Infinite Void) effekti haqiqiy san\'at darajasida chiqqan. Har kuni yangi qismlarni shu yerdan ko\'raman!',
      likes: 58,
      createdAt: '2026-11-14T11:30:00.000Z',
      replies: []
    }
  ],
  savedItems: [],
  likedIds: ['v1', 'yt-1', 'm1', 'prod-fig-01'],
  watchHistory: [],
  cartItems: [],
  orders: [],
  searchHistory: ['Naruto', 'Jujutsu Kaisen', 'Attack on Titan', 'Solo Leveling', 'One Piece']
};

class Database {
  constructor() {
    this.data = { ...INITIAL_DB };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...INITIAL_DB,
          ...parsed,
          comments: parsed.comments && parsed.comments.length ? parsed.comments : INITIAL_DB.comments
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('[DB] Faylni o\'qishda xatolik, yangi baza ochildi:', err.message);
      this.data = { ...INITIAL_DB };
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Saqlashda xatolik:', err.message);
    }
  }

  // --- Foydalanuvchi Profili ---
  getUserProfile(userId = 'usr_default_01') {
    return this.data.users.find((u) => u.id === userId) || this.data.users[0];
  }

  updateUserProfile(userId = 'usr_default_01', updates = {}) {
    const idx = this.data.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.data.users[idx] = {
        ...this.data.users[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // --- KOMMENTARIYALAR (COMMENTS SYSTEM) ---
  getComments(targetId) {
    if (!targetId || targetId === 'all') {
      return this.data.comments || [];
    }
    return (this.data.comments || []).filter(
      (c) => c.targetId === targetId || c.targetId === 'all'
    );
  }

  addComment({ targetId, text, author, username, avatar, parentId = null }) {
    if (!text || !text.trim()) return null;
    const cleanText = text.trim();
    const commentId = 'cmt-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 900 + 100);

    const newComment = {
      id: commentId,
      targetId: targetId || 'all',
      author: author || 'Otaku Master',
      username: username || '@animeshik_uz',
      avatar:
        avatar ||
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
      text: cleanText,
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: []
    };

    if (parentId) {
      // Agar javob (reply) bo'lsa, asosiy comment ichiga qo'shish
      const parent = this.data.comments.find((c) => c.id === parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
        this.save();
        return newComment;
      }
    }

    // Yangi asosiy comment
    this.data.comments.unshift(newComment);
    this.save();
    return newComment;
  }

  deleteComment(commentId) {
    if (!commentId) return false;
    const initialLen = this.data.comments.length;
    this.data.comments = this.data.comments.filter((c) => c.id !== commentId);

    // Replylar orasidan ham o'chirish
    this.data.comments.forEach((c) => {
      if (c.replies) {
        c.replies = c.replies.filter((r) => r.id !== commentId);
      }
    });

    this.save();
    return this.data.comments.length !== initialLen;
  }

  likeComment(commentId) {
    let found = false;
    for (const c of this.data.comments) {
      if (c.id === commentId) {
        c.likes = (c.likes || 0) + 1;
        found = true;
        break;
      }
      if (c.replies) {
        for (const r of c.replies) {
          if (r.id === commentId) {
            r.likes = (r.likes || 0) + 1;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }
    if (found) this.save();
    return found;
  }

  getUserComments(username = '@animeshik_uz') {
    return (this.data.comments || []).filter((c) => c.username === username);
  }

  // --- Saqlanganlar (Saved Items) ---
  getSavedItems() {
    return this.data.savedItems || [];
  }

  toggleSaveItem(item) {
    if (!item || !item.id) return { items: this.data.savedItems, isSaved: false };
    const exists = this.data.savedItems.some((i) => i.id === item.id);
    if (exists) {
      this.data.savedItems = this.data.savedItems.filter((i) => i.id !== item.id);
      this.save();
      return { items: this.data.savedItems, isSaved: false };
    } else {
      const newItem = {
        ...item,
        savedAt: new Date().toISOString()
      };
      this.data.savedItems.unshift(newItem);
      this.save();
      return { items: this.data.savedItems, isSaved: true };
    }
  }

  removeSavedItem(id) {
    this.data.savedItems = this.data.savedItems.filter((i) => i.id !== id);
    this.save();
    return this.data.savedItems;
  }

  // --- Liked Items ---
  getLikedIds() {
    return this.data.likedIds || [];
  }

  toggleLike(id) {
    if (!id) return { likedIds: this.data.likedIds, isLiked: false };
    const idx = this.data.likedIds.indexOf(id);
    let isLiked = false;
    if (idx !== -1) {
      this.data.likedIds.splice(idx, 1);
      isLiked = false;
    } else {
      this.data.likedIds.push(id);
      isLiked = true;
    }
    this.save();
    return { likedIds: this.data.likedIds, isLiked };
  }

  // --- Ko'rish Tarixi (Watch History) ---
  getWatchHistory() {
    return this.data.watchHistory || [];
  }

  addToHistory(entry) {
    if (!entry || !entry.id) return this.data.watchHistory;
    this.data.watchHistory = this.data.watchHistory.filter((h) => h.id !== entry.id);
    this.data.watchHistory.unshift({
      ...entry,
      viewedAt: new Date().toISOString()
    });
    if (this.data.watchHistory.length > 50) {
      this.data.watchHistory = this.data.watchHistory.slice(0, 50);
    }
    this.save();
    return this.data.watchHistory;
  }

  clearHistory() {
    this.data.watchHistory = [];
    this.save();
    return [];
  }

  // --- Shopping Savati (Cart) ---
  getCart() {
    return this.data.cartItems || [];
  }

  addToCart(product, quantity = 1, selectedSize = 'L') {
    if (!product || !product.id) return this.data.cartItems;
    const existingIndex = this.data.cartItems.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingIndex !== -1) {
      this.data.cartItems[existingIndex].quantity += quantity;
    } else {
      this.data.cartItems.push({
        id: product.id,
        name: product.name,
        anime: product.anime,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        selectedSize: selectedSize || 'Standart',
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    this.save();
    return this.data.cartItems;
  }

  updateCartQuantity(id, selectedSize, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeFromCart(id, selectedSize);
    }
    const item = this.data.cartItems.find(
      (i) => i.id === id && (!selectedSize || i.selectedSize === selectedSize)
    );
    if (item) {
      item.quantity = newQuantity;
      this.save();
    }
    return this.data.cartItems;
  }

  removeFromCart(id, selectedSize) {
    this.data.cartItems = this.data.cartItems.filter(
      (i) => !(i.id === id && (!selectedSize || i.selectedSize === selectedSize))
    );
    this.save();
    return this.data.cartItems;
  }

  clearCart() {
    this.data.cartItems = [];
    this.save();
    return [];
  }

  // --- Buyurtmalar (Orders) ---
  getOrders() {
    return this.data.orders || [];
  }

  createOrder(orderData) {
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
    const newOrder = {
      orderId,
      items: orderData.items || [...this.data.cartItems],
      totalAmount: orderData.totalAmount || 0,
      customerName: orderData.customerName || 'Anime Muxlisi',
      phone: orderData.phone || '+998 90 000 00 00',
      address: orderData.address || 'Toshkent shahar',
      paymentMethod: orderData.paymentMethod || 'Click',
      status: 'Qabul qilindi ✅ Yetkazilmoqda',
      createdAt: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.data.cartItems = [];
    this.save();
    return newOrder;
  }

  // --- Qidiruv Tarixi ---
  getSearchHistory() {
    return this.data.searchHistory || [];
  }

  addSearchQuery(query) {
    if (!query || !query.trim()) return this.data.searchHistory;
    const clean = query.trim();
    this.data.searchHistory = this.data.searchHistory.filter((q) => q.toLowerCase() !== clean.toLowerCase());
    this.data.searchHistory.unshift(clean);
    if (this.data.searchHistory.length > 15) {
      this.data.searchHistory = this.data.searchHistory.slice(0, 15);
    }
    this.save();
    return this.data.searchHistory;
  }
}

export const db = new Database();
