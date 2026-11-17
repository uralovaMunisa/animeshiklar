// ANIMESHIKLAR OLAMI — ANIME INTERNET DO'KONI (SHOPPING SCREEN)
// To'liq anime shopping tizimi: Kiyimlar, Figuralar, Aksessuarlar, Savat, Buyurtmalar

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  Bookmark,
  BookmarkCheck,
  Star,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  Tag,
  CreditCard,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { SHOPPING_CATEGORIES } from '../data/shoppingData';
import { fetchShoppingProducts } from '../services/apiService';
import {
  getCartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  calculateCartTotals,
  placeOrder,
  getOrders,
  getLikedItemIds,
  toggleLikeItem,
  getSavedItems,
  toggleSaveItem
} from '../services/storageService';

export default function ShoppingScreen({
  onBackToHome,
  onBackToIntro,
  onOpenVideos,
  onOpenMovies,
  onOpenProfile
}) {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'rating'
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal oynalar holati
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Savat va buyurtmalar holati
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [savedItems, setSavedItems] = useState([]);

  // Checkout formasi holati
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Click');

  // Toast xabarnomasi
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // Dastlabki yuklanish
  useEffect(() => {
    loadProducts();
    setCart(getCartItems());
    setOrders(getOrders());
    setLikedIds(getLikedItemIds());
    setSavedItems(getSavedItems());
  }, []);

  const loadProducts = async (cat = selectedCategory, q = searchQuery, sort = sortBy) => {
    setIsLoading(true);
    try {
      const data = await fetchShoppingProducts({ query: q, category: cat, sortBy: sort });
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    loadProducts(cat, searchQuery, sortBy);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadProducts(selectedCategory, searchQuery, sortBy);
    showToast(`Qidiruv: "${searchQuery}" (${products.length} ta natija)`);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    loadProducts(selectedCategory, searchQuery, val);
  };

  // Savat amallari
  const handleAddToCart = (product, size = 'Standart', qty = 1, e) => {
    e?.stopPropagation();
    const updated = addToCart(product, qty, size);
    setCart(updated);
    showToast(`🛒 "${product.name.slice(0, 24)}..." savatga qo'shildi!`);
  };

  const handleUpdateQty = (id, size, newQty) => {
    const updated = updateCartQuantity(id, size, newQty);
    setCart(updated);
  };

  const handleRemoveFromCart = (id, size) => {
    const updated = removeFromCart(id, size);
    setCart(updated);
    showToast('Mahsulot savatdan olib tashlandi');
  };

  // Like & Save
  const handleToggleLike = (id, e) => {
    e?.stopPropagation();
    const { likedSet, isLiked } = toggleLikeItem(id);
    setLikedIds(new Set(likedSet));
    showToast(isLiked ? '❤️ Mahsulot yoqtirildi!' : 'Yoqtirilganlardan olib tashlandi');
  };

  const handleToggleSave = (product, e) => {
    e?.stopPropagation();
    const normalized = {
      ...product,
      itemType: 'shopping',
      title: product.name,
      thumbnail: product.image
    };
    const { updated, isSaved } = toggleSaveItem(normalized);
    setSavedItems(updated);
    showToast(isSaved ? '🔖 Mahsulot saqlanganlarga qo‘shildi!' : 'Saqlanganlardan olib tashlandi');
  };

  // Buyurtma berish (Checkout)
  const handlePlaceOrder = (e) => {
    e?.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showToast('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }
    const totals = calculateCartTotals(cart);
    const result = placeOrder({
      customerName,
      phone,
      address,
      paymentMethod,
      items: cart,
      totalAmount: totals.total
    });

    if (result.success) {
      setCart([]);
      setOrders(result.orders);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      showToast('🎉 Buyurtmangiz muvaffaqiyatli qabul qilindi!');
    }
  };

  const cartTotals = useMemo(() => calculateCartTotals(cart), [cart]);
  const isSavedCheck = (id) => savedItems.some((i) => i.id === id);

  return (
    <div className="shopping-page-container">
      {/* Toast Notification */}
      {toast && (
        <div className="videos-toast">
          <Sparkles size={18} className="toast-sparkle-icon" />
          <span>{toast}</span>
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
            <div className="brand-icon-box shopping-gradient">
              <ShoppingBag size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-main">ANIMESHIKLAR</span>
              <span className="brand-sub">ANIME STORE</span>
            </div>
          </div>
        </div>

        {/* Qidiruv Paneli */}
        <form className="videos-search-container" onSubmit={handleSearchSubmit}>
          <div className="videos-search-box">
            <Search size={18} className="search-lead-icon" />
            <input
              type="text"
              className="videos-search-input"
              placeholder="Anime mahsulotlarini qidiring (Gojo figura, Akatsuki hoodie, Berserk manga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-reset-button"
                onClick={() => {
                  setSearchQuery('');
                  loadProducts(selectedCategory, '', sortBy);
                }}
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-action-btn shopping-btn">
              Do'konda Qidirish
            </button>
          </div>
        </form>

        {/* Topbar O'ng Tomon Tugmalari */}
        <div className="videos-topbar-right">
          {/* Buyurtmalar Tarixi */}
          <button
            className="video-stats-pill click-pill"
            onClick={() => setIsOrdersOpen(true)}
            title="Buyurtmalar tarixi"
          >
            <Truck size={16} color="#10b981" />
            <span>Buyurtmalar ({orders.length})</span>
          </button>

          {/* Savat Tugmasi */}
          <button
            className="shopping-cart-badge-btn"
            onClick={() => setIsCartOpen(true)}
            title="Savatni ochish"
          >
            <ShoppingCart size={18} />
            <span>Savat</span>
            {cartTotals.count > 0 && <span className="cart-counter-bubble">{cartTotals.count}</span>}
          </button>
        </div>
      </header>

      {/* 2. PROMO HERO BANNER */}
      <section className="store-hero-banner">
        <div className="store-hero-content">
          <div className="hero-badge-tag">
            <Flame size={15} /> 100% Rasmiy Anime Mahsulotlari
          </div>
          <h1 className="store-hero-title">
            ANIME SHOP UZBEKISTAN & <span className="accent-text">RASMIY MERCH</span>
          </h1>
          <p className="store-hero-desc">
            Anime Shop Uzbekistan (animeshop.uz) rasmiy katalogi: Gojo Satoru soatlari, kolleksion kartalar, Attack on Titan ramkalari, original kiyimlar, figuralar va aksessuarlar. O'zbekiston bo'ylab tezkor yetkazib berish.
          </p>
          <div className="store-hero-perks">
            <div className="perk-pill">
              <Truck size={14} color="#10b981" /> 300,000 so'mdan bepul yetkazish
            </div>
            <div className="perk-pill">
              <ShieldCheck size={14} color="#3b82f6" /> 100% Sifat Kafolati
            </div>
            <div className="perk-pill">
              <Tag size={14} color="#ff3366" /> 30% gacha Chegirmalar
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATEGORIYALAR VA FILTERLAR BAR */}
      <section className="videos-categories-bar">
        <div className="categories-scroll-wrapper">
          {SHOPPING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleSelectCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Saralash (Sort By) */}
        <div className="store-sort-box">
          <SlidersHorizontal size={15} color="#94a3b8" />
          <select className="store-sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="featured">Tavsiya etilgan</option>
            <option value="price_asc">Narx: Arzondan Qimmatga</option>
            <option value="price_desc">Narx: Qimmatdan Arzonga</option>
            <option value="rating">Eng Yuqori Reyting</option>
          </select>
        </div>
      </section>

      {/* 4. MAHSULOTLAR GRIDI */}
      <main className="videos-main-content">
        <div className="videos-info-header">
          <div className="info-left-group">
            <h2 className="current-category-title">
              {selectedCategory === 'Barchasi' ? 'Barcha Anime Mahsulotlari' : selectedCategory}
            </h2>
            <span className="results-badge">{products.length} ta mahsulot</span>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state-box">
            <div className="spinner-large" />
            <p>Anime do'koni mahsulotlari yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-content-card">
            <ShoppingBag size={48} className="empty-icon" />
            <h3>Mahsulotlar topilmadi</h3>
            <p>Qidiruv so'zini o'zgartiring yoki boshqa toifani tanlang.</p>
          </div>
        ) : (
          <div className="shopping-products-grid">
            {products.map((item) => {
              const isLiked = likedIds.has(item.id);
              const isSaved = isSavedCheck(item.id);

              return (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => {
                    setActiveProductModal(item);
                    setSelectedSize('L');
                  }}
                >
                  <div className="product-image-box">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    {item.badge && <span className="product-badge">{item.badge}</span>}
                    {item.discount > 0 && (
                      <span className="product-discount-tag">-{item.discount}%</span>
                    )}

                    {/* Floating Actions */}
                    <div className="product-float-actions">
                      <button
                        className={`action-btn-circle ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => handleToggleLike(item.id, e)}
                        title="Yoqtirish"
                      >
                        <Heart size={15} fill={isLiked ? '#ff3366' : 'none'} color={isLiked ? '#ff3366' : '#fff'} />
                      </button>
                      <button
                        className={`action-btn-circle ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => handleToggleSave(item, e)}
                        title="Saqlash"
                      >
                        {isSaved ? <BookmarkCheck size={15} color="#ff3366" /> : <Bookmark size={15} color="#fff" />}
                      </button>
                    </div>
                  </div>

                  <div className="product-card-details">
                    <span className="product-category-label">{item.category || 'Aksessuar'}</span>
                    <h3 className="product-name" title={item.name}>
                      {item.name}
                    </h3>

                    <div className="product-price-stack">
                      <span className="current-price">{item.price.toLocaleString()} so'm</span>
                      {item.originalPrice > item.price && (
                        <span className="old-price">{item.originalPrice.toLocaleString()} so'm</span>
                      )}
                    </div>

                    <div className="product-card-actions-row">
                      <button
                        className="btn-card-savatga"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item, 'Standart', 1, e);
                        }}
                        title="Savatga qo'shish"
                      >
                        Savatga
                      </button>
                      <button
                        className="btn-card-batafsil"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductModal(item);
                          setSelectedSize('L');
                        }}
                        title="Batafsil ma'lumot"
                      >
                        Batafsil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: MAHSULOT BATAFFSIL KO'RISH (PRODUCT DETAIL)
          ======================================================== */}
      {activeProductModal && (
        <div className="modal-backdrop-blur" onClick={() => setActiveProductModal(null)}>
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="player-close-btn" onClick={() => setActiveProductModal(null)}>
              <X size={20} />
            </button>

            <div className="product-modal-grid">
              {/* Rasm qismi */}
              <div className="product-modal-gallery">
                <div className="main-display-image">
                  <img src={activeProductModal.image} alt={activeProductModal.name} />
                  {activeProductModal.badge && (
                    <span className="product-badge modal-badge">{activeProductModal.badge}</span>
                  )}
                </div>
                {activeProductModal.additionalImages && activeProductModal.additionalImages.length > 0 && (
                  <div className="thumbnail-strip">
                    <img src={activeProductModal.image} alt="main thumb" className="thumb-mini active" />
                    {activeProductModal.additionalImages.map((imgUrl, i) => (
                      <img key={i} src={imgUrl} alt="angle thumb" className="thumb-mini" />
                    ))}
                  </div>
                )}
              </div>

              {/* Ma'lumot qismi */}
              <div className="product-modal-info">
                <span className="modal-anime-tag">{activeProductModal.anime}</span>
                <h2 className="modal-product-title">{activeProductModal.name}</h2>

                <div className="modal-rating-strip">
                  <div className="rating-badge-gold">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{activeProductModal.rating}</span>
                  </div>
                  <span className="modal-reviews-text">{activeProductModal.reviewsCount} ta ijobiy xaridor sharhi</span>
                  <span className="in-stock-tag">
                    <Check size={13} /> Omborda mavjud
                  </span>
                </div>

                <div className="modal-price-box">
                  <span className="modal-price-main">{activeProductModal.price.toLocaleString()} so'm</span>
                  {activeProductModal.originalPrice > activeProductModal.price && (
                    <span className="modal-price-old">
                      {activeProductModal.originalPrice.toLocaleString()} so'm
                    </span>
                  )}
                  {activeProductModal.discount > 0 && (
                    <span className="modal-discount-tag">-{activeProductModal.discount}% TEJAB QOLING</span>
                  )}
                </div>

                <p className="modal-description">{activeProductModal.description}</p>

                {/* O'lcham tanlash (Kiyimlar va Hoodie uchun) */}
                {(activeProductModal.category === 'Kiyimlar' ||
                  activeProductModal.category === 'Futbolkalar' ||
                  activeProductModal.category === 'Hoodie') && (
                  <div className="size-selector-box">
                    <label className="size-label">O'lchamni tanlang:</label>
                    <div className="size-options-row">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                          onClick={() => setSelectedSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Qo'shish va Saqlash Tugmalari */}
                <div className="modal-actions-row">
                  <button
                    className="btn-add-cart-large"
                    onClick={() => {
                      handleAddToCart(activeProductModal, selectedSize, 1);
                      setActiveProductModal(null);
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>Savatga Qo'shish</span>
                  </button>

                  <button
                    className="btn-modal-icon"
                    onClick={(e) => handleToggleLike(activeProductModal.id, e)}
                    title="Yoqtirish"
                  >
                    <Heart
                      size={20}
                      fill={likedIds.has(activeProductModal.id) ? '#ff3366' : 'none'}
                      color={likedIds.has(activeProductModal.id) ? '#ff3366' : '#fff'}
                    />
                  </button>

                  <button
                    className="btn-modal-icon"
                    onClick={(e) => handleToggleSave(activeProductModal, e)}
                    title="Saqlash"
                  >
                    {isSavedCheck(activeProductModal.id) ? (
                      <BookmarkCheck size={20} color="#ff3366" />
                    ) : (
                      <Bookmark size={20} color="#fff" />
                    )}
                  </button>
                </div>

                <div className="modal-delivery-notice">
                  <Truck size={16} color="#10b981" />
                  <span>Toshkent bo'ylab 24 soat ichida, viloyatlarga 2-3 kunda yetkazib beriladi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: SHOPPING SAVATI (SHOPPING CART DRAWER)
          ======================================================== */}
      {isCartOpen && (
        <div className="modal-backdrop-blur" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div className="cart-header-title">
                <ShoppingCart size={22} color="#ff3366" />
                <h3>Sizning Savatingiz ({cartTotals.count})</h3>
              </div>
              <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={56} className="empty-cart-icon" />
                <h4>Savat bo'sh</h4>
                <p>O'zingizga yoqqan anime kiyimlari yoki figuralarini qo'shing!</p>
                <button className="btn-explore-shop" onClick={() => setIsCartOpen(false)}>
                  Mahsulotlarni ko'rish
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-scroll">
                  {cart.map((cItem) => (
                    <div key={`${cItem.id}-${cItem.selectedSize}`} className="cart-item-row">
                      <img src={cItem.image} alt={cItem.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <span className="cart-item-anime">{cItem.anime}</span>
                        <h4 className="cart-item-name">{cItem.name}</h4>
                        <span className="cart-item-size">O'lcham: {cItem.selectedSize}</span>
                        <span className="cart-item-price">
                          {(cItem.price * cItem.quantity).toLocaleString()} so'm
                        </span>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-counter">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQty(cItem.id, cItem.selectedSize, cItem.quantity - 1)
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-val">{cItem.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQty(cItem.id, cItem.selectedSize, cItem.quantity + 1)
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          className="btn-remove-item"
                          onClick={() => handleRemoveFromCart(cItem.id, cItem.selectedSize)}
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-footer">
                  <div className="summary-line">
                    <span>Mahsulotlar narxi:</span>
                    <span>{cartTotals.subtotal.toLocaleString()} so'm</span>
                  </div>
                  {cartTotals.discount > 0 && (
                    <div className="summary-line discount-line">
                      <span>Chegirma:</span>
                      <span>-{cartTotals.discount.toLocaleString()} so'm</span>
                    </div>
                  )}
                  <div className="summary-line">
                    <span>Yetkazib berish:</span>
                    <span>{cartTotals.delivery === 0 ? 'BEPUL 🚚' : `${cartTotals.delivery.toLocaleString()} so'm`}</span>
                  </div>
                  <div className="summary-line total-line">
                    <span>Jami To'lov:</span>
                    <span className="total-amount">{cartTotals.total.toLocaleString()} so'm</span>
                  </div>

                  <div className="cart-footer-buttons">
                    <button
                      className="btn-checkout-proceed"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                    >
                      Buyurtma Rasmiylashtirish <ArrowRight size={18} />
                    </button>
                    <button className="btn-clear-cart" onClick={() => setCart(clearCart())}>
                      Savatni tozalash
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: BUYURTMA RASMIYLASHTIRISH (CHECKOUT MODAL)
          ======================================================== */}
      {isCheckoutOpen && (
        <div className="modal-backdrop-blur" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal-window" onClick={(e) => e.stopPropagation()}>
            <button className="player-close-btn" onClick={() => setIsCheckoutOpen(false)}>
              <X size={20} />
            </button>

            <div className="checkout-header">
              <ShoppingBag size={24} color="#ff3366" />
              <div>
                <h3>Buyurtmani Rasmiylashtirish</h3>
                <p>Yetkazib berish va to'lov ma'lumotlarini kiriting</p>
              </div>
            </div>

            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="checkout-fields-grid">
                <div className="form-item">
                  <label className="field-label">
                    <User size={14} /> To'liq Ismingiz:
                  </label>
                  <input
                    type="text"
                    required
                    className="api-text-input"
                    placeholder="Masalan: Sardor Aliyev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-item">
                  <label className="field-label">
                    <Phone size={14} /> Telefon Raqamingiz:
                  </label>
                  <input
                    type="tel"
                    required
                    className="api-text-input"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-item full">
                  <label className="field-label">
                    <MapPin size={14} /> Yetkazib berish manzili:
                  </label>
                  <input
                    type="text"
                    required
                    className="api-text-input"
                    placeholder="Shahar, tuman, ko'cha, uy va xonadon raqami..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="form-item full">
                  <label className="field-label">
                    <CreditCard size={14} /> To'lov usulini tanlang:
                  </label>
                  <div className="payment-methods-grid">
                    {['Click', 'Payme', 'Naqd pul (Yetkazilganda)', 'Uzcard / Humo'].map((method) => (
                      <div
                        key={method}
                        className={`payment-method-card ${paymentMethod === method ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        <div className="method-radio-circle">
                          {paymentMethod === method && <div className="inner-radio-dot" />}
                        </div>
                        <span className="method-name">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buyurtma yakuniy summasi */}
              <div className="checkout-order-summary">
                <div className="summary-row">
                  <span>Jami mahsulotlar ({cartTotals.count} ta):</span>
                  <span>{cartTotals.total.toLocaleString()} so'm</span>
                </div>
                <div className="summary-row">
                  <span>Yetkazib berish:</span>
                  <span className="free-tag">BEPUL</span>
                </div>
              </div>

              <div className="checkout-footer-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsCheckoutOpen(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-confirm-order">
                  <Check size={18} /> Buyurtmani Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: BUYURTMALAR TARIXI (ORDERS HISTORY)
          ======================================================== */}
      {isOrdersOpen && (
        <div className="modal-backdrop-blur" onClick={() => setIsOrdersOpen(false)}>
          <div className="orders-history-modal" onClick={(e) => e.stopPropagation()}>
            <button className="player-close-btn" onClick={() => setIsOrdersOpen(false)}>
              <X size={20} />
            </button>

            <div className="orders-modal-header">
              <Truck size={24} color="#10b981" />
              <div>
                <h3>Mening Buyurtmalarim ({orders.length})</h3>
                <p>Siz bergan barcha anime mahsulotlari buyurtmalari</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders-box">
                <ShoppingBag size={48} className="empty-icon" />
                <h4>Hozircha buyurtmalar yo'q</h4>
                <p>Do'kondan o'zingizga yoqqan mahsulotlarga buyurtma bering!</p>
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
        </div>
      )}
    </div>
  );
}

