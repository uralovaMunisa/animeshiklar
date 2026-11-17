// ANIMESHIKLAR OLAMI — ASOSIY ANIME KATALOGI VA BAZASI
// Animem.uz uslubidagi to'liq ma'lumotlar, qismlar, mavsumlar va video o'yinchilar bazasi

export const ANIME_CATEGORIES = [
  'Barchasi',
  'Komediya',
  'Jangari',
  'Sarguzasht',
  'Fantastika',
  'Romantika',
  'Drama',
  'Dahshat',
  'Isekai'
];

export const ANIME_CATALOG_DATA = [
  // ========================================================
  // 0. O'LMAS QIROLNING KUNDALIK HAYOTI (ANIMEM.UZ SKRINSHOIDAGI ASOSIY ANIME)
  // ========================================================
  {
    id: 'olmas-qirolning-kundalik-hayoti-1-fasl',
    title: "O'LMAS QIROLNING KUNDALIK HAYOTI 1-FASL",
    uzbekTitle: "O'lmas Qirolning Kundalik Hayoti",
    japaneseTitle: '仙王的日常生活 (The Daily Life of the Immortal King)',
    originalName: 'Original nomi • TV Serial',
    year: 2025,
    status: 'EFIRDA',
    rating: 10.0,
    votes: '1 baho • 393 ta ko‘rish',
    viewsCount: '393 ta ko\'rish',
    type: 'series',
    episodesCount: '15 qism',
    duration: '20 daq / qism',
    quality: 'Full HD 1080p',
    dubbing: "O'zbekcha Professional Dublyaj (Animem.uz)",
    director: 'Li Haoling',
    studio: 'Haoliners Animation League',
    poster: 'https://upload.wikimedia.org/wikipedia/en/0/07/The_Daily_Life_of_the_Immortal_King_Poster.jpg',
    backdrop: 'https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=cover%2Cformat=auto%2Cquality=85%2Cwidth=1920/display/keyart/T00194347-ultra_wide-ZXX',
    genre: 'Jangari',
    genres: ['Jangari', 'Sarguzasht', 'Komediya', 'Romantika', 'Dahshatli', 'Fantastika', 'Kundalik hayot'],
    overview: "Kultivatsiya daho qahramoni Wang Ling go'dakligidanoq o'zining aql bovar qilmas qudratini yashirib keladi. Oddiy Songhai o'rta maktabida oddiy talaba kabi tinch va osoyishta hayot kechirishni, sevimli qarsildoq lag'monlarini yeyishni xohlaydi. Biroq maktabdagi qobiliyatlarni sinash kuni va go'zal Sun Rong bilan uchrashuv uning hayotini ostin-ustun qilib yuboradi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Fasl',
        episodes: [
          {
            id: 'ok-s1-ep1',
            number: 1,
            title: "1-Qism: O'lmas qobiliyat va qarsildoq lag'mon",
            duration: '19:45',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'ok-s1-ep2',
            number: 2,
            title: "2-Qism: Sun Rong va sehrli qilichlar musobaqasi",
            duration: '20:10',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'ok-s1-ep3',
            number: 3,
            title: "3-Qism: Qotillar ligasi va Wang Lingning g'azabi",
            duration: '19:55',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'ok-s1-ep4',
            number: 4,
            title: "4-Qism: O'lmas it Jingke va yangi qobiliyat",
            duration: '20:30',
            thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'ok-s1-ep5',
            number: 5,
            title: "5-Qism: 59-maktab bilan to'qnashuv",
            duration: '21:00',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ok-s1-ep6',
            number: 6,
            title: "6-Qism: Sehrli olamning parchalanishi va muhr buzilishi",
            duration: '22:15',
            thumbnail: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: '2-Fasl',
        episodes: [
          {
            id: 'ok-s2-ep1',
            number: 1,
            title: "1-Qism: Yangi sinovlar va qadimgi iblislar",
            duration: '20:00',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'ok-s2-ep2',
            number: 2,
            title: "2-Qism: Wang Lingning kutilmagan sarguzashti",
            duration: '20:15',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // FARMATSEFT MONOLOGI 2 (ANIMEM.UZ SKRINSHOIDAGI O'XSHASH ANIME)
  // ========================================================
  {
    id: 'farmatseft-monologi-2',
    title: 'Farmatseft monologi 2 (Kusuriya no Hitorigoto 2)',
    uzbekTitle: 'Farmatseft Monologi: 2-Fasl',
    japaneseTitle: '薬屋のひとりごと 第2期',
    originalName: 'Original nomi • TV Serial',
    year: 2025,
    status: 'EFIRDA',
    rating: 9.8,
    votes: '142 baho • 12K ko‘rish',
    viewsCount: '12K ko\'rish',
    type: 'series',
    episodesCount: '24 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem.uz)",
    director: 'Norihiro Naganuma',
    studio: 'TOHO animation STUDIO / OLM',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    genre: 'Drama',
    genres: ['Drama', 'Mistik', 'Tarixiy', 'Komediya', 'Kundalik hayot'],
    overview: "Qadimgi imperator saroyida zaharlanishlar va yashirin qotilliklar sirini ochuvchi aqlli tabib qiz Maomao saroy amaldori Jinshi bilan birga yangi, yanada xavfli fitnalar va saroy sirlarini fosh qilishda davom etadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '2-Fasl',
        episodes: [
          {
            id: 'fm-s2-ep1',
            number: 1,
            title: "1-Qism: Qishki saroydagi sirli zahar",
            duration: '24:00',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          },
          {
            id: 'fm-s2-ep2',
            number: 2,
            title: "2-Qism: Maomaoning yangi dori kashfiyoti",
            duration: '23:50',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 1. SPY X FAMILY (Komediya / Jangari)
  // ========================================================
  {
    id: 'spy-family',
    title: 'Spy x Family Code: White',
    uzbekTitle: "Ayg'oqchi Oila: Oq Kod",
    japaneseTitle: '劇場版 SPY×FAMILY CODE: White',
    year: 2023,
    genre: 'Komediya',
    genres: ['Komediya', 'Jangari', 'Maktab'],
    rating: 8.4,
    votes: '38.2K',
    type: 'series',
    episodesCount: '25 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Takashi Katagiri',
    studio: 'Wit Studio / CloverWorks',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    overview: "G'arbiyaniya eng daho ayg'oqchisi Twilight (Loid Forger) Ostaniya bilan tinchlikni saqlash maqsadida 'Strix' operatsiyasini boshlaydi. Buning uchun u soxta oila qurishi shart: qotil Yor Briar uning rafiqasiga, boshqalarning fikrini o'qiy oladigan g'aroyib yetim qiz Anya esa uning qiziga aylanadi. Ular bir-birlarining sirlarini bilmagan holda eng quvnoq va xavfli missiyalarga kirishadilar.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'spy-s1-ep1',
            number: 1,
            title: '1-Qism: Operatsiya Strix boshlandi',
            duration: '24:12',
            thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'spy-s1-ep2',
            number: 2,
            title: '2-Qism: Rafiqa qidiruvi: Yor Briar bilan uchrashuv',
            duration: '23:45',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'spy-s1-ep3',
            number: 3,
            title: '3-Qism: Eden Akademiyasi suhbatiga tayyorgarlik',
            duration: '24:02',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'spy-s1-ep4',
            number: 4,
            title: '4-Qism: Nufuzli maktab qabuli va kutilmagan fitna',
            duration: '24:20',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'spy-s1-ep5',
            number: 5,
            title: "5-Qism: G'alaba bayrami: Qasrda Loidman shousi",
            duration: '24:35',
            thumbnail: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'spy-s1-ep6',
            number: 6,
            title: "6-Qism: Do'stlik rejasi: Anya va Damian Desmond",
            duration: '23:58',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: '2-Mavsum',
        episodes: [
          {
            id: 'spy-s2-ep1',
            number: 1,
            title: "1-Qism: Loid va Yorning xavfli romantik kechasi",
            duration: '24:10',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'spy-s2-ep2',
            number: 2,
            title: "2-Qism: Bond — kelajakni ko'ruvchi oq itning xalosi",
            duration: '24:25',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'spy-s2-ep3',
            number: 3,
            title: "3-Qism: Kruiz kemasidagi maxfiy soqchilik missiyasi",
            duration: '24:40',
            thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 2. JUJUTSU KAISEN (Jangari / Fantastika)
  // ========================================================
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen 0 & Sehrli Jang',
    uzbekTitle: "Sehrli Jang: Satoru Gojo va La'natlangan Sevgi",
    japaneseTitle: '呪術廻戦 劇場版 0',
    year: 2021,
    genre: 'Jangari',
    genres: ['Jangari', 'Fantastika', 'Dahshat'],
    rating: 8.8,
    votes: '52.6K',
    type: 'series',
    episodesCount: '24 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Sunghoo Park',
    studio: 'MAPPA',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    overview: "Yuji Itadori o'z do'stlarini qutqarish uchun la'natlar qiroli Ryomen Sukunaning barmog'ini yutib yuboradi. Shundan so'ng u Tokio Sehrgarlar Akademiyasiga qabul qilinadi. Tarixdagi eng qudratli sehrgar Satoru Gojo boshchiligida insoniyatni qirib tashlamoqchi bo'lgan maxluqlarga qarshi shiddatli jang boshlanadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum (Sukunaning Uyg‘onishi)',
        episodes: [
          {
            id: 'jjk-s1-ep1',
            number: 1,
            title: "1-Qism: Ryomen Sukuna: Birinchi barmoq",
            duration: '24:15',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
          },
          {
            id: 'jjk-s1-ep2',
            number: 2,
            title: "2-Qism: Satoru Gojoning cheksiz bo'shliq maydoni",
            duration: '23:50',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'jjk-s1-ep3',
            number: 3,
            title: "3-Qism: Nobara Kugisaki va Tokioning qorong'u tomoni",
            duration: '24:05',
            thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'jjk-s1-ep4',
            number: 4,
            title: "4-Qism: La'natlangan qamoqxona: Maxsus daraja",
            duration: '24:30',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: '2-Mavsum (Shibuya Hodisasi)',
        episodes: [
          {
            id: 'jjk-s2-ep1',
            number: 1,
            title: "1-Qism: Gojo va Getoning o'tmishi",
            duration: '24:20',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'jjk-s2-ep2',
            number: 2,
            title: "2-Qism: Shibuya qafasi: Satoru Gojo muhrlandi",
            duration: '24:45',
            thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 3. SOLO LEVELING (Jangari / Fantastika)
  // ========================================================
  {
    id: 'solo-leveling',
    title: 'Solo Leveling: ReAwakening',
    uzbekTitle: "Yakka Darajani Oshirish: Soyalar Hukmdori",
    japaneseTitle: '俺だけレベルアップな件',
    year: 2024,
    genre: 'Jangari',
    genres: ['Jangari', 'Fantastika', 'Sarguzasht'],
    rating: 8.9,
    votes: '44.8K',
    type: 'series',
    episodesCount: '12 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Shunsuke Nakashige',
    studio: 'A-1 Pictures',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85',
    overview: "Insoniyatning eng zaif E-darajali ovchisi Sung Jinwoo dahshatli ikki qavatli xudolar zindonida o'lim yoqasida yagona Tizim o'yinchisiga aylanadi. Endi faqat uning oldida ko'rinuvchi topshiriqlar va cheksiz daraja oshirish imkoniyati paydo bo'ladi. U barcha dushmanlarini yengib, qora soyalar armiyasini boshqaruvchi monarxga aylanadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'sl-s1-ep1',
            number: 1,
            title: "1-Qism: Men odatlanib qolganman (Zaif ovchi)",
            duration: '24:12',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'sl-s1-ep2',
            number: 2,
            title: "2-Qism: Qo'shaloq zindon va dahshatli haykallar qoidasi",
            duration: '24:30',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'sl-s1-ep3',
            number: 3,
            title: "3-Qism: Tizim topshirig'i: 100 ta push-up va birinchi daraja",
            duration: '24:05',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'sl-s1-ep4',
            number: 4,
            title: "4-Qism: Kasada zindonidagi qonli qasos",
            duration: '24:20',
            thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          },
          {
            id: 'sl-s1-ep5',
            number: 5,
            title: "5-Qism: Qonxo'r Igris va 'Tur!' buyrug'i",
            duration: '24:50',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 4. DEMON SLAYER (Jangari / Fantastika)
  // ========================================================
  {
    id: 'demon-slayer-mugen',
    title: 'Demon Slayer: Cheksiz Poyezd (Mugen Train)',
    uzbekTitle: "Iblislar Qotili: Cheksiz Poyezd va Olov Qalbi",
    japaneseTitle: '劇場版「鬼滅の刃」無限列車編',
    year: 2020,
    genre: 'Jangari',
    genres: ['Jangari', 'Fantastika', 'Sarguzasht'],
    rating: 8.7,
    votes: '49.1K',
    type: 'movie',
    episodesCount: 'To‘liq Film',
    duration: '1h 57m',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Haruo Sotozaki',
    studio: 'ufotable',
    status: 'Tugallangan',
    poster: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    overview: "Tanjiro, Nezuko, Zenitsu va Inosuke Olov Hashirasi Kyojuro Rengoku bilan birga Mugen poyezdiga chiqishadi. Bu poyezdda 40 dan ortiq odam sirli g'oyib bo'lgan. Quyi darajali iblis Enmu odamlarni tushlar orqali o'ldirishga urinadi, biroq ularning ortidan eng xavfli Yuqori Darajali Uch Enmu — Akaza keladi.",
    seasons: [
      {
        seasonNumber: 1,
        title: "Film Qismlari va Epik Sahnalar",
        episodes: [
          {
            id: 'ds-ep1',
            number: 1,
            title: "1-Qism: Cheksiz Poyezdga chiqish va Rengoku bilan uchrashuv",
            duration: '35:10',
            thumbnail: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'ds-ep2',
            number: 2,
            title: "2-Qism: Enmuning uyqu tuzog'i va Tanjironing qat'iyati",
            duration: '42:15',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'ds-ep3',
            number: 3,
            title: "3-Qism: Rengoku Akazaga qarshi: 'Yuragingni olovdek yoq!'",
            duration: '40:00',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 5. KONOSUBA (Komediya / Isekai)
  // ========================================================
  {
    id: 'konosuba',
    title: 'KonoSuba: Legend of Crimson',
    uzbekTitle: "KonoSuba: Bu Ajoyib Dunyoda Qizil Afsona!",
    japaneseTitle: 'この素晴らしい世界に祝福を！紅伝説',
    year: 2019,
    genre: 'Komediya',
    genres: ['Komediya', 'Fantastika', 'Isekai', 'Sarguzasht'],
    rating: 8.5,
    votes: '26.8K',
    type: 'series',
    episodesCount: '20 qism',
    duration: '24 daq / qism',
    quality: 'Full HD 1080p',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Takaomi Kanasaki',
    studio: 'J.C.Staff',
    status: 'Tugallangan',
    poster: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
    overview: "Kazuma Sato kulgili tarzda vafot etib, ma'buda Aqua bilan boshqa sehrli dunyoda qayta tiriladi. U yerda o'ziga faqat bitta 'Portlash' sehrini biladigan Megumin va zarbalarni qabul qilishdan rohatlanadigan Darkness ismli salibchi qizni sherik qiladi. Bu aqldan ozgan guruh dunyodagi eng kulgili sarguzashtlarni boshdan kechiradi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'kono-s1-ep1',
            number: 1,
            title: "1-Qism: Bu qoloq dunyoda ma'buda bilan birga!",
            duration: '23:45',
            thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'kono-s1-ep2',
            number: 2,
            title: "2-Qism: Chu-ni-byo sehrgari: Megumin portlashi",
            duration: '24:00',
            thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'kono-s1-ep3',
            number: 3,
            title: "3-Qism: Qizil sehrgarlar qishlog'idagi g'alati bayram",
            duration: '24:15',
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 6. ATTACK ON TITAN (Jangari / Drama)
  // ========================================================
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan: The Final Season',
    uzbekTitle: "Titanlar Hujumi: Oxirgi Hujum va Ozodlik",
    japaneseTitle: '進撃の巨人 THE FINAL SEASON',
    year: 2024,
    genre: 'Jangari',
    genres: ['Jangari', 'Drama', 'Fantastika'],
    rating: 9.1,
    votes: '64.2K',
    type: 'series',
    episodesCount: '28 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Yuichiro Hayashi',
    studio: 'MAPPA / Wit Studio',
    status: 'Tugallangan',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85',
    overview: "Eren Yeager insoniyatni qul qilgan devorlar va uning ortidagi dushmanlarni yo'q qilishga qasamyod qiladi. Yillar o'tib, u o'zining do'stlari Mikasa va Arminga qarshi chiqib, yer yuzini qirib tashlovchi 'Gumburlash'ni boshlaydi. Insoniyatning ozodligi uchun eng dahshatli va falsafiy urush sodir bo'ladi.",
    seasons: [
      {
        seasonNumber: 1,
        title: "Yakuniy Qismlar (The Final Attack)",
        episodes: [
          {
            id: 'aot-ep1',
            number: 1,
            title: "1-Qism: Dengiz ortidagi haqiqat: Marley jangi",
            duration: '24:10',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          },
          {
            id: 'aot-ep2',
            number: 2,
            title: "2-Qism: Gumburlash: Millionlab devor titanlari uyg'ondi",
            duration: '25:00',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'aot-ep3',
            number: 3,
            title: "3-Qism: Eren Yeagerning so'nggi xabari va vidolashuv",
            duration: '35:20',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 7. YOUR NAME (Romantika / Drama)
  // ========================================================
  {
    id: 'your-name',
    title: 'Your Name (Kimi no Na wa)',
    uzbekTitle: "Sening Isming: Yulduzlar Ostidagi Taqdir",
    japaneseTitle: '君の名は。',
    year: 2016,
    genre: 'Romantika',
    genres: ['Romantika', 'Drama', 'Fantastika'],
    rating: 8.8,
    votes: '58.7K',
    type: 'movie',
    episodesCount: 'To‘liq Film',
    duration: '1h 46m',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Klassik Dublyaj (Animem Studio)",
    director: 'Makoto Shinkai',
    studio: 'CoMix Wave Films',
    status: 'Tugallangan',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    overview: "Tokioda yashovchi o'quvchi Taki va tog'li qishloqda yashovchi ibodatxona xizmatchisi Mitsuha tushlarida bir-birlarining tanalariga o'tib qolishadi. Ular bir-birlariga xabarlar qoldirib sevib qolishadi, biroq 3 yil oldingi kometa tushishi ularning hayotini butunlay o'zgartirib yuborgani ayon bo'ladi.",
    seasons: [
      {
        seasonNumber: 1,
        title: "To'liq Metrajli Film",
        episodes: [
          {
            id: 'yn-ep1',
            number: 1,
            title: "1-Qism: Tanalar almashinuvi va Tokio tongi",
            duration: '35:00',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
          },
          {
            id: 'yn-ep2',
            number: 2,
            title: "2-Qism: Itomori fojiasi va vaqt chegarasidagi uchrashuv",
            duration: '45:00',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'yn-ep3',
            number: 3,
            title: "3-Qism: Zinalardagi uchrashuv: 'Sening isming nima?'",
            duration: '26:00',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 8. FRIEREN (Sarguzasht / Fantastika)
  // ========================================================
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey’s End',
    uzbekTitle: "Frieren: Safar Intihosi va Do'stlik Qadri",
    japaneseTitle: '葬送のフリーレン',
    year: 2023,
    genre: 'Sarguzasht',
    genres: ['Sarguzasht', 'Fantastika', 'Drama'],
    rating: 9.2,
    votes: '41.5K',
    type: 'series',
    episodesCount: '28 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Keiichiro Saito',
    studio: 'Madhouse',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=85',
    overview: "Qahramon Himmel va uning do'stlari 10 yillik safarda Iblis Qirolini mag'lub etadilar. Ammo oradan 50 yil o'tib, Himmel keksayib vafot etadi. Ming yillar yashovchi elflar sehrgari Frieren insonlarning qisqa umrini va insoniy his-tuyg'ularni chuqur anglash uchun yangi shogirdi Fern bilan dunyo bo'ylab safarga chiqadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'fr-s1-ep1',
            number: 1,
            title: "1-Qism: Qahramonlar davrining yakuni",
            duration: '24:15',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'fr-s1-ep2',
            number: 2,
            title: "2-Qism: Shogird Fern va sehrli gullar izhori",
            duration: '24:00',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          },
          {
            id: 'fr-s1-ep3',
            number: 3,
            title: "3-Qism: Birinchi toifali sehrgarlar imtihoni",
            duration: '24:45',
            thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 9. OVERLORD (Isekai / Fantastika)
  // ========================================================
  {
    id: 'overlord',
    title: 'Overlord: The Sacred Kingdom',
    uzbekTitle: "Oliy Hukmdor: Muqaddas Qirollik",
    japaneseTitle: '劇場版「オーバーロード」聖王国編',
    year: 2024,
    genre: 'Isekai',
    genres: ['Isekai', 'Fantastika', 'Jangari'],
    rating: 8.6,
    votes: '31.4K',
    type: 'series',
    episodesCount: '13 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Naoyuki Ito',
    studio: 'Madhouse',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    overview: "Yggdrasil onlayn o'yini serverlari o'chirilayotganda, o'yinchi Momonga o'zining skelet qahramoni Ainz Ooal Gown tanasida butunlay boshqa real dunyoga ko'chib o'tadi. Nazarik buyuk qabri qo'riqchilari bilan birga u bu yangi dunyoni mutlaq o'ziga bo'ysundirishga kirishadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'ov-s1-ep1',
            number: 1,
            title: "1-Qism: Boshlanish va yakun: Nazarik qabri",
            duration: '24:10',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          },
          {
            id: 'ov-s1-ep2',
            number: 2,
            title: "2-Qism: Albedo va qo'riqchilarning qasamyodi",
            duration: '23:55',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 10. DEATH NOTE (Drama / Dahshat / Psixologik)
  // ========================================================
  {
    id: 'death-note',
    title: 'Death Note: Relight',
    uzbekTitle: "O‘lim Daftarchasi: Xudo Ko‘rinishi",
    japaneseTitle: 'デスノート リライト',
    year: 2007,
    genre: 'Drama',
    genres: ['Drama', 'Dahshat', 'Psixologik'],
    rating: 8.9,
    votes: '68.5K',
    type: 'series',
    episodesCount: '37 qism',
    duration: '23 daq / qism',
    quality: 'Full HD 1080p',
    dubbing: "O'zbekcha Oltin Dublyaj (Animem Studio)",
    director: 'Tetsuro Araki',
    studio: 'Madhouse',
    status: 'Tugallangan',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    overview: "Daho talaba Light Yagami yerga tushgan Shinigami Ryukning O'lim Daftarchasini topib oladi. Ismi yozilgan har qanday odam yurak xurujidan o'lishini bilgan Light barcha jinoyatchilarni qirib tashlab, 'Yangi dunyo xudosi' — Kira bo'lishga ahd qiladi. Dunyoning eng buyuk tergovchisi L uni to'xtatish uchun intellektual jangga kirishadi.",
    seasons: [
      {
        seasonNumber: 1,
        title: "1-Mavsum: Kira L ga qarshi",
        episodes: [
          {
            id: 'dn-s1-ep1',
            number: 1,
            title: "1-Qism: Qayta tug'ilish: Birinchi ism",
            duration: '23:30',
            thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
          },
          {
            id: 'dn-s1-ep2',
            number: 2,
            title: "2-Qism: Duel: L birinchi marta ovoz berdi",
            duration: '23:45',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
          },
          {
            id: 'dn-s1-ep3',
            number: 3,
            title: "3-Qism: Poyloqchilar va metro tuzog'i",
            duration: '23:40',
            thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 11. BLUE LOCK (Sport / Jangari)
  // ========================================================
  {
    id: 'blue-lock',
    title: 'Blue Lock: Episode Nagi',
    uzbekTitle: "Moviy Qulf: Yagona Hujumchi",
    japaneseTitle: '劇場版ブルーロック -EPISODE 凪-',
    year: 2024,
    genre: 'Jangari',
    genres: ['Jangari', 'Sport', 'Maktab'],
    rating: 8.5,
    votes: '29.3K',
    type: 'series',
    episodesCount: '24 qism',
    duration: '24 daq / qism',
    quality: '4K Ultra HD',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Shunsuke Ishikawa',
    studio: '8bit',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    overview: "Yaponiya jahon chempionatida mag'lub bo'lgach, Jinpachi Ego 300 nafar eng iqtidorli yosh hujumchini 'Blue Lock' deb nomlangan qamoqxona-akademiyaga qamaydi. Bu yerda faqat bitta egoist hujumchi tirik qolishi kerak. Yoichi Isagi va daho Nagi Seishiro o'zlarining shafqatsiz 'ego'larini kashf etadilar.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'bl-s1-ep1',
            number: 1,
            title: "1-Qism: Orzu: 300 ta hujumchining tanlovi",
            duration: '24:15',
            thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          },
          {
            id: 'bl-s1-ep2',
            number: 2,
            title: "2-Qism: Z-jamoasi va birinchi saralash o'yini",
            duration: '24:10',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 12. CLASSROOM OF THE ELITE (Maktab / Drama)
  // ========================================================
  {
    id: 'classroom-of-the-elite',
    title: 'Classroom of the Elite',
    uzbekTitle: "Elita Sinfxonasi: Yashirin Daho",
    japaneseTitle: 'ようこそ実力至上主義の教室へ',
    year: 2023,
    genre: 'Drama',
    genres: ['Drama', 'Maktab', 'Psixologik'],
    rating: 8.4,
    votes: '33.8K',
    type: 'series',
    episodesCount: '25 qism',
    duration: '24 daq / qism',
    quality: 'Full HD 1080p',
    dubbing: "O'zbekcha Professional Dublyaj (Animem Studio)",
    director: 'Seiji Kishi',
    studio: 'Lerche',
    status: 'Davom etmoqda',
    poster: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=85',
    backdrop: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85',
    overview: "Tokio ilg'or ta'lim maktabida o'quvchilar sinflarga bo'linadi va ularning har bir harakati ballar bilan o'lchanadi. Eng yomon D-sinfga tushgan Kiyotaka Ayanokoji o'zining mutlaq daho ekanligini yashirgan holda sinfdoshlarini parda ortidan boshqaradi va A-sinfga ko'tarilish uchun aql o'yinlarini olib boradi.",
    seasons: [
      {
        seasonNumber: 1,
        title: '1-Mavsum',
        episodes: [
          {
            id: 'cote-s1-ep1',
            number: 1,
            title: "1-Qism: Insoniyat teng emas: D-sinfning boshlanishi",
            duration: '24:00',
            thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'cote-s1-ep2',
            number: 2,
            title: "2-Qism: Kimsasiz oroldagi omon qolish imtihoni",
            duration: '24:20',
            thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          }
        ]
      }
    ]
  }
];

import { ANIME_MOVIES_DATA } from './moviesData.js';
// Native anime streams

// Yordamchi funksiya: ID bo'yicha animeni topish (katalog, filmlar va videolardan)
export function getAnimeById(id) {
  if (!id) return null;
  const cleanId = String(id).toLowerCase().trim();

  // 0. To'g'ridan-to'g'ri ID xaritasi (v1..v12 va asosiy taxalluslar)
  const legacyMap = {
    'v1': 'jujutsu-kaisen',
    'v2': 'm-cyberpunk-edgerunners',
    'v3': 'attack-on-titan',
    'v4': 'demon-slayer',
    'v5': 'solo-leveling',
    'v6': 'bleach-thousand-year',
    'v7': 'm-suzume',
    'v8': 'naruto-shippuden',
    'v9': 'konosuba',
    'v10': 'chainsaw-man',
    'v11': 'farmatseft-monologi-2',
    'v12': 'olmas-qirolning-kundalik-hayoti-1-fasl'
  };

  const targetId = legacyMap[cleanId] || cleanId;

  // 1. Aniq moslik bo'yicha katalogdan qidirish
  const exactCatalog = ANIME_CATALOG_DATA.find(
    (a) => a.id.toLowerCase() === targetId || a.id.toLowerCase() === cleanId
  );
  if (exactCatalog) return exactCatalog;

  // 2. Filmlar ro'yxatidan qidirish va qismlar bilan normalizatsiya qilish
  const inMovies = ANIME_MOVIES_DATA.find(
    (m) => m.id.toLowerCase() === targetId || m.id.toLowerCase() === cleanId || String(m.tmdbId) === cleanId
  );
  if (inMovies) {
    const defaultTrailer = inMovies.trailerYoutubeId || 'ByXuk9QqQkk';
    return {
      ...inMovies,
      uzbekTitle: inMovies.title,
      type: 'movie',
      status: 'Tugallangan',
      viewsCount: '1.2K ko\'rish',
      originalName: 'Original nomi • To\'liq Metrajli Film',
      episodesCount: inMovies.episodes || "To'liq Metrajli Film",
      seasons: [
        {
          seasonNumber: 1,
          title: "To'liq Film va Qismlar",
          episodes: [
            {
              id: `${inMovies.id}-ep1`,
              number: 1,
              title: `${inMovies.title} — 1-Qism`,
              duration: '45:00',
              thumbnail: inMovies.poster,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            },
            {
              id: `${inMovies.id}-full`,
              number: 2,
              title: `${inMovies.title} — To'liq Film (Full HD)`,
              duration: inMovies.duration || '1h 50m',
              thumbnail: inMovies.backdrop || inMovies.poster,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
            }
          ]
        }
      ]
    };
  }

  // 3. Kalit so'zlar bo'yicha aqlli aniqlash (Har bir anime faqat o'z sahifasiga tushishi shart!)
  if (cleanId.includes('solo') || cleanId.includes('jinwoo')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'solo-leveling');
    if (found) return found;
  }
  if (cleanId.includes('jujutsu') || cleanId.includes('gojo') || cleanId.includes('sukuna')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'jujutsu-kaisen');
    if (found) return found;
  }
  if (cleanId.includes('titan') || cleanId.includes('eren') || cleanId.includes('shingeki')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'attack-on-titan');
    if (found) return found;
  }
  if (cleanId.includes('demon') || cleanId.includes('slayer') || cleanId.includes('tanjiro') || cleanId.includes('kimetsu')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'demon-slayer');
    if (found) return found;
  }
  if (cleanId.includes('farmatseft') || cleanId.includes('maomao') || cleanId.includes('kusuriya')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'farmatseft-monologi-2');
    if (found) return found;
  }
  if (cleanId.includes('olmas') || cleanId.includes('qirol') || cleanId.includes('wang')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'olmas-qirolning-kundalik-hayoti-1-fasl');
    if (found) return found;
  }
  if (cleanId.includes('spy') || cleanId.includes('anya') || cleanId.includes('forger')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'spy-family');
    if (found) return found;
  }
  if (cleanId.includes('bleach') || cleanId.includes('ichigo')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'bleach-thousand-year');
    if (found) return found;
  }
  if (cleanId.includes('piece') || cleanId.includes('luffy')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'one-piece-egghead');
    if (found) return found;
  }
  if (cleanId.includes('naruto') || cleanId.includes('sasuke') || cleanId.includes('itachi')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'naruto-shippuden');
    if (found) return found;
  }
  if (cleanId.includes('chainsaw') || cleanId.includes('denji') || cleanId.includes('pochita')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'chainsaw-man');
    if (found) return found;
  }
  if (cleanId.includes('kono') || cleanId.includes('megumin') || cleanId.includes('kazuma')) {
    const found = ANIME_CATALOG_DATA.find((a) => a.id === 'konosuba');
    if (found) return found;
  }
  if (cleanId.includes('cyberpunk') || cleanId.includes('edgerunners')) {
    const found = ANIME_MOVIES_DATA.find((m) => m.id.includes('cyberpunk')) || ANIME_CATALOG_DATA.find((a) => a.id === 'chainsaw-man');
    if (found) return found;
  }

  // 4. Agar ID qisman mos kelsa (fallback)
  const partial = ANIME_CATALOG_DATA.find(
    (a) =>
      a.id.toLowerCase().includes(cleanId) ||
      a.title.toLowerCase().includes(cleanId) ||
      (a.uzbekTitle && a.uzbekTitle.toLowerCase().includes(cleanId))
  );
  if (partial) return partial;

  return ANIME_CATALOG_DATA[0]; // Har doim O'lmas Qirol yoki birinchi animeni xavfsiz qaytarish
}

// Barcha birlashtirilgan anime va filmlar ro'yxati
export function getAllUnifiedAnimes() {
  const existingIds = new Set(ANIME_CATALOG_DATA.map((a) => a.id.toLowerCase()));
  const normalizedMovies = ANIME_MOVIES_DATA.filter(
    (m) => !existingIds.has(m.id.toLowerCase())
  ).map((m) => {
    const defaultTrailer = m.trailerYoutubeId || 'ByXuk9QqQkk';
    return {
      ...m,
      uzbekTitle: m.title,
      type: 'movie',
      episodesCount: m.episodes || "To'liq Metrajli Film",
      seasons: [
        {
          seasonNumber: 1,
          title: "To'liq Film va Qismlar",
          episodes: [
            {
              id: `${m.id}-ep1`,
              number: 1,
              title: "1-Qism: Boshlanish",
              duration: '45:00',
              thumbnail: m.poster,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
            },
            {
              id: `${m.id}-ep2`,
              number: 2,
              title: "2-Qism: Epik Jang va Yakun",
              duration: '50:00',
              thumbnail: m.backdrop || m.poster,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
            },
            {
              id: `${m.id}-full`,
              number: 3,
              title: `${m.title} — To'liq Film (HD)`,
              duration: m.duration || '1h 50m',
              thumbnail: m.backdrop || m.poster,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
            }
          ]
        }
      ]
    };
  });

  return [...ANIME_CATALOG_DATA, ...normalizedMovies];
}

