// ANIMESHIKLAR OLAMI - UNIVERSAL STORAGE & BACKEND SYNC SERVICE
// LocalStorage va Backend REST API bilan avtomatik integratsiya

const SAVED_STORAGE_KEY = 'animeshiklar_saved_items_v2';
const LIKED_STORAGE_KEY = 'animeshiklar_liked_items_v2';
const HISTORY_STORAGE_KEY = 'animeshiklar_watch_history_v2';
const PROFILE_STORAGE_KEY = 'animeshiklar_user_profile_v2';
const CART_STORAGE_KEY = 'animeshiklar_cart_items_v2';
const ORDERS_STORAGE_KEY = 'animeshiklar_orders_v2';

// Xavfsiz orqa fon sinxronizatsiyasi (GitHub Pages va Offline rejimda 404 xatolarini oldini oladi)
function safeBackendSync(url, options = {}) {
  try {
    if (typeof window !== 'undefined' && (window.location.hostname.includes('github.io') || window.location.protocol === 'file:')) {
      return;
    }
    fetch(url, options).catch(() => {});
  } catch (_) {}
}

// 1. SAVED TIZIMI
export function getSavedItems() {
  try {
    const data = localStorage.getItem(SAVED_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function toggleSaveItem(item) {
  try {
    const current = getSavedItems();
    const index = current.findIndex((i) => i.id === item.id);
    let updated;
    let isSaved = false;

    if (index >= 0) {
      updated = current.filter((i) => i.id !== item.id);
      isSaved = false;
    } else {
      const itemToSave = {
        ...item,
        savedAt: new Date().toISOString()
      };
      updated = [itemToSave, ...current];
      isSaved = true;
    }

    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));

    // Backend bilan orqa fonda sinxronlash
    safeBackendSync('/api/saved/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item })
    });

    return { updated, isSaved };
  } catch (e) {
    return { updated: [], isSaved: false };
  }
}

export function removeSavedItem(id) {
  try {
    const current = getSavedItems();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));

    safeBackendSync(`/api/saved/${encodeURIComponent(id)}`, { method: 'DELETE' });

    return updated;
  } catch (e) {
    return [];
  }
}

export function isItemSaved(id) {
  const current = getSavedItems();
  return current.some((i) => i.id === id);
}

// 2. LIKED TIZIMI
export function getLikedItemIds() {
  try {
    const data = localStorage.getItem(LIKED_STORAGE_KEY);
    return data ? new Set(JSON.parse(data)) : new Set(['v1', 'yt-1', 'm1', 's1', 'img1', 'prod-fig-01']);
  } catch (e) {
    return new Set(['v1', 'yt-1', 'm1', 's1', 'img1', 'prod-fig-01']);
  }
}

export function toggleLikeItem(id) {
  try {
    const current = getLikedItemIds();
    const next = new Set(current);
    let isLiked = false;

    if (next.has(id)) {
      next.delete(id);
      isLiked = false;
    } else {
      next.add(id);
      isLiked = true;
    }

    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(next)));

    safeBackendSync('/api/likes/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    return { likedSet: next, isLiked };
  } catch (e) {
    return { likedSet: new Set(), isLiked: false };
  }
}

// 3. KO'RISH TARIXI (WATCH HISTORY)
export function getWatchHistory() {
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToWatchHistory(item) {
  try {
    const current = getWatchHistory();
    const filtered = current.filter((i) => i.id !== item.id);
    const updated = [{ ...item, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 40);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

    safeBackendSync('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry: item })
    });

    return updated;
  } catch (e) {
    return [];
  }
}

export function clearWatchHistory() {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  safeBackendSync('/api/history', { method: 'DELETE' });
  return [];
}

// 4. FOYDALANUVCHI PROFILI
export function getUserProfile() {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}

  return {
    name: 'Animeshik Master',
    username: '@animelover_uz',
    bio: 'Anime, kiberpank va kinematik dunyolar ishqibozi. Otaku darajasi: S-Rank ✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    joinedDate: '2026-yil',
    favoriteAnime: 'Attack on Titan, Jujutsu Kaisen, Your Name'
  };
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    safeBackendSync('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return profile;
  } catch (e) {
    return profile;
  }
}

// 5. SHOPPING SAVATI (CART)
export function getCartItems() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToCart(product, quantity = 1, selectedSize = 'L') {
  try {
    const cart = getCartItems();
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    let updatedCart;
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
      updatedCart = [...cart];
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        anime: product.anime,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        selectedSize: selectedSize || 'Standart',
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
      updatedCart = [newItem, ...cart];
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));

    safeBackendSync('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, quantity, selectedSize })
    });

    return updatedCart;
  } catch (e) {
    return [];
  }
}

export function updateCartQuantity(id, selectedSize, quantity) {
  try {
    if (quantity <= 0) {
      return removeFromCart(id, selectedSize);
    }
    const cart = getCartItems();
    const updated = cart.map((item) => {
      if (item.id === id && (!selectedSize || item.selectedSize === selectedSize)) {
        return { ...item, quantity };
      }
      return item;
    });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));

    safeBackendSync('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selectedSize, quantity })
    });

    return updated;
  } catch (e) {
    return [];
  }
}

export function removeFromCart(id, selectedSize) {
  try {
    const cart = getCartItems();
    const updated = cart.filter(
      (item) => !(item.id === id && (!selectedSize || item.selectedSize === selectedSize))
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));

    safeBackendSync('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selectedSize })
    });

    return updated;
  } catch (e) {
    return [];
  }
}

export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  safeBackendSync('/api/cart/clear', { method: 'POST' });
  return [];
}

export function calculateCartTotals(cartItems = []) {
  const count = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * (item.quantity || 1),
    0
  );
  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = Math.max(0, subtotal - total);
  const delivery = total > 300000 || total === 0 ? 0 : 25000;
  const finalTotal = total + delivery;

  return {
    count,
    subtotal,
    discount,
    delivery,
    total: finalTotal
  };
}

// 6. BUYURTMALAR (ORDERS)
export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function placeOrder(orderData) {
  try {
    const orders = getOrders();
    const orderId =
      'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);

    const newOrder = {
      orderId,
      items: orderData.items || getCartItems(),
      totalAmount: orderData.totalAmount || 0,
      customerName: orderData.customerName || 'Anime Muxlisi',
      phone: orderData.phone || '+998 90 000 00 00',
      address: orderData.address || 'Toshkent shahar',
      paymentMethod: orderData.paymentMethod || 'Click',
      status: 'Qabul qilindi ✅',
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

    // Savatni tozalash
    clearCart();

    safeBackendSync('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });

    return { success: true, order: newOrder, orders: updatedOrders };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
