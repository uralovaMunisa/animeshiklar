# 🌸 Animeshiklar Olami (Anime Hub)

Zamonaviy va to'liq interaktiv O'zbekcha Anime platformasi.

![Platform Preview](./public/images/logo.png)

## ✨ Asosiy Imkoniyatlar

- 🎬 **Shorts 2.0 & Reels:** Hover qilinganda avtomatik ijro, to'liq ekranli maxsus anime pleer, ovozli kliplar.
- 🍿 **Anime Filmlar & Seriallar (Prime Video uslubida):** Yuqori sifatli anime tizerlari, epizodlar va tavsiyalar.
- 🖼 **Pinterest Anime Galereyasi:** Yuzlab sifatli anime rasmlari va profil suratlari (PFP).
- 🛍 **Anime Merch & Shop:** Anime figurkalar, kiyimlar, kartalar va aksessuarlar katalogi.
- 👤 **Profil & Customization:** Foydalanuvchi profiliga anime avatarlar o'rnatish imkoniyati.
- ⚡ **Vite + React 18:** Tezkor va yengil yuklanish, to'liq moslashuvchan dizayn.

---

## 🚀 Texnologiyalar

- **Frontend:** React 18, Vite 6, Tailwind/Custom CSS, Lucide Icons
- **Backend / Mock API:** Node.js Express server
- **Deploy:** GitHub Pages (GitHub Actions orqali avtomatik)

---

## 🛠 O'rnatish va Ishga Tushirish

Loyihani o'zingizda ishga tushirish uchun:

```bash
# Reponi klonlash
git clone https://github.com/<username>/<repo-nomi>.git

# Papkaga kirish
cd demo

# Bog'liqliklarni o'rnatish
npm install

# Dasturchi rejimida ishga tushirish
npm run dev
```

Brauzerda `http://localhost:5173` manzilida ochiladi.

---

## 🌐 GitHub Pages orqali Deploy

Loyiha uchun avtomatlashtirilgan `.github/workflows/deploy.yml` CI/CD skripti mavjud.

1. Loyihani GitHub'ga yuklang:
   ```bash
   git push -u origin main
   ```
2. GitHub'da reponing **Settings** -> **Pages** bo'limiga o'ting.
3. **Build and deployment** bo'limidagi **Source** parametrini **GitHub Actions** ga o'zgartiring.
4. Har bir `push` qilinganda loyiha avtomatik build bo'lib, jonli efirga (deploy) chiqadi.

