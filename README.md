# Mekan Efes — Tanıtım Sitesi + QR Menü

Selçuk / İzmir'deki **Mekan Efes Restaurant** için hazırlanmış tanıtım sitesi,
QR menü sistemi ve logo tasarımı. Saf HTML + CSS + JavaScript; framework,
build adımı veya bağımlılık yok. GitHub'a atıp Vercel'e bağladığınız anda
yayına girer.

> ### ⚠️ Bu bir konsept çalışmadır
> Site, restorana **sunulmak üzere** hazırlanmış bir tasarım önerisidir ve
> işletmenin resmî sitesi değildir. Bu yüzden:
> - Arama motorlarına **tamamen kapalıdır** (`robots.txt`, `noindex` meta
>   etiketi ve `X-Robots-Tag` başlığı) — işletmenin kendi Google Haritalar
>   ve Instagram varlıklarıyla arama sonuçlarında yarışmaz.
> - Sağ alt köşede **"Konsept çalışma — resmî site değildir"** rozeti vardır.
> - Yasal sayfaların başında aynı uyarı tekrarlanır.
>
> Anlaşma sağlandığında bunları kaldırmak için aşağıdaki
> [Yayına alma](#yayına-alma-anlaşma-sağlandığında) bölümüne bakın.

---

## Hızlı başlangıç

```bash
python -m http.server 4322
```

Ardından `http://localhost:4322` adresini açın.

---

## Ne teslim ediliyor

| Parça | Dosya |
| --- | --- |
| Ana sayfa | `index.html` |
| QR menü sayfası | `menu.html` |
| Logo — ana amblem | `assets/logo/amblem.svg` |
| Logo — küçük boyut / favicon | `assets/logo/amblem-kucuk.svg` |
| Logo — yatay kilit (kartvizit, tabela) | `assets/logo/logo-yatay.svg` |
| QR kod (vektörel + PNG) | `assets/qr/menu-qr.svg`, `menu-qr.png` |
| Baskıya hazır masa kartı (85×120 mm) | `assets/qr/masa-karti.svg` |
| QR yeniden üretme betiği | `qr-uret.py` |
| Yasal sayfalar (4 adet) | `kvkk-*.html`, `gizlilik-*.html`, `cerez-*.html`, `kullanim-*.html` |

---

## Logo

Amblem, **Efes'in antik kemer siluetinin içine yerleştirilmiş "ME"
monogramıdır**. Harfler yazı tipiyle değil çizilmiş yollarla (path)
oluşturulmuştur; font yüklenmese de her ortamda birebir aynı görünür.

- **Renk:** `currentColor` kullanır — tek dosya hem açık hem koyu zeminde çalışır.
- **32 px altında** `amblem-kucuk.svg` kullanın; "ME" harfleri o boyutta
  okunmadığı için sadeleştirilmiş (yalnızca kemer + kaide) versiyondur.
- **Baskı öncesi:** `logo-yatay.svg` içindeki yazılar Cormorant Garamond ve
  Jost fontlarıyla kurulmuştur. Matbaaya göndermeden önce tasarım programında
  yazıyı "outline / eğriye çevir" yapın.

---

## QR menü nasıl çalışır

1. Misafir masadaki karta telefon kamerasını tutar.
2. `menu.html` açılır — telefonda hızlı yüklenen, kategorili menü.
3. Üstteki yapışkan çubuk kaydırdıkça aktif kategoriyi işaretler.
4. Alttaki sabit çubuktan tek dokunuşla siteye veya WhatsApp rezervasyona geçilir.

**Fiyat değiştiğinde** yalnızca `menu.html` güncellenir — masadaki kartlar
aynı kalır, yeniden basmaya gerek yoktur. Basılı menünün asıl maliyeti budur.

### QR kodu yeniden üretmek

Alan adı kesinleştiğinde **mutlaka** yeniden üretin, aksi hâlde karttaki kod
eski adrese gider:

```bash
pip install segno
python qr-uret.py https://gercek-alan-adi.com/menu.html
```

Betik üç dosya üretir: sade SVG, PNG ve baskıya hazır masa kartı.
QR hata düzeltme seviyesi `%30` seçilmiştir — kart lekelendiğinde veya
çizildiğinde bile okunur.

---

## Vercel'e yayınlama

1. Depoyu GitHub'a gönderin:

```bash
git init && git add . && git commit -m "Mekan Efes sitesi" && git branch -M main
```

2. [vercel.com/new](https://vercel.com/new) adresinden depoyu içe aktarın.
   - **Framework Preset:** Other
   - **Build Command:** boş bırakın
   - **Output Directory:** boş bırakın (kök dizin)

Derleme adımı yoktur. `vercel.json` güvenlik başlıklarını, önbellek
kurallarını ve `/menu` → `/menu.html` yönlendirmesini otomatik uygular.

---

## SEO altyapısı

Hazır ama şu an **bilerek kapalı** (konsept çalışma olduğu için):

| Ne | Nerede | Durum |
| --- | --- | --- |
| Başlık, açıklama, anahtar kelimeler | `index.html`, `menu.html` | ✅ hazır |
| Canonical URL | Her sayfada | ✅ hazır |
| Open Graph + Twitter Card | `og:image` 1200×630 | ✅ hazır |
| Yapısal veri (schema.org `Restaurant`) | `index.html` — adres, saatler, koordinat, Instagram | ✅ hazır |
| `sitemap.xml` | Kök dizin | ✅ hazır, devre dışı |
| Web app manifest | `site.webmanifest` — "Ana ekrana ekle" | ✅ hazır |
| Favicon / apple-touch-icon | SVG + PNG | ✅ hazır |
| Anlamlı `alt` metinleri | Tüm görsellerde | ✅ hazır |
| `robots.txt` | Kök dizin | 🔒 `Disallow: /` |
| `noindex` meta + `X-Robots-Tag` | Her sayfa + `vercel.json` | 🔒 kapalı |

---

## Yayına alma (anlaşma sağlandığında)

Sırayla:

1. **`robots.txt`** — üstteki `Disallow: /` bloğunu silin, alttaki yorumlu
   bloğu açın ve alan adını yazın.
2. **`index.html` ve `menu.html`** — `<meta name="robots" content="noindex, nofollow" />`
   satırını `content="index, follow, max-image-preview:large"` yapın.
3. **`vercel.json`** — `X-Robots-Tag` başlığını silin.
4. **`index.html`** — sayfa sonundaki `<a class="konsept" ...>` rozetini silin.
5. **Yasal sayfalar** — baştaki "Bu bir konsept çalışmadır" kutusunu silin.
6. **Alan adı** — `mekanefes.vercel.app` geçen her yeri gerçek adresle
   değiştirin: `index.html` (canonical, og, JSON-LD), `menu.html`,
   `sitemap.xml`, `robots.txt`.
7. **QR kodu yeniden üretin** (yukarıdaki komut).
8. [Google Search Console](https://search.google.com/search-console)'a alan
   adını ekleyip `sitemap.xml` gönderin.

---

## ⚠️ Yayına almadan önce doldurulacaklar

### Doğrulanmış bilgiler (kamuya açık kaynaklardan)
Bunlar Google İşletme Profili, Instagram ve Tripadvisor'dan alındı —
yine de işletmeyle teyit edin:

- Adres: Atatürk Mah. 1055. Sk. No:4, 35920 Selçuk / İzmir
- Telefon: 0505 896 25 82 · 0232 892 20 01
- Instagram: [@mekanefes](https://www.instagram.com/mekanefes/)
- Google puanı: 4,4 / 5 — 522 değerlendirme
- Çalışma saatleri: her gün 08:30 – 00:00

### Yer tutucular — mutlaka değiştirin

- [ ] **Menü ve fiyatların tamamı yer tutucudur.** Kişi başı ₺400–1.200
      aralığına göre makul değerler seçildi, ama gerçek fiyat listesiyle
      değiştirilmelidir. Yanlış fiyat göstermek tüketici mevzuatı açısından
      risklidir. Mevcut menünüz `nicemenu.com.tr/mekan` adresinde.
- [ ] **Ürün açıklamaları ve alerjen bilgileri** mutfakla teyit edilmelidir.
- [ ] **Ticaret unvanı, vergi dairesi/numarası, MERSİS numarası** —
      `index.html` künye bloğu ve dört yasal sayfa. 6563 sayılı E-Ticaret
      Kanunu md. 3 ve 5651 sayılı Kanun gereği zorunludur.
- [ ] **E-posta adresi** (`info@mekanefes.com.tr` yer tutucudur).
- [ ] **Yetkili mahkeme** (`kullanim-kosullari.html`, madde 9).
- [ ] **JSON-LD `geo` koordinatları** — şu an Selçuk merkezi için yaklaşık
      değer. Google Haritalar'da işletmeye sağ tıklayıp gerçek enlem/boylamı
      kopyalayın (`index.html` ve `js/main.js` içindeki `HARITA_SORGUSU`).
- [ ] **Görseller** — Unsplash'ten (bkz. `LISANSLAR.md`). Instagram
      hesabınızdaki kendi fotoğraflarınızla değiştirilmesi hem daha
      inandırıcı olur hem de telif tartışmasını bitirir.
- [ ] Yasal metinler genel şablondur — kamera kaydı, rezervasyon defteri,
      personel verisi gibi fiili durumlara göre bir hukukçuya gözden geçirtin.

---

## Yasal tarafta neler hazır

| Konu | Durum |
| --- | --- |
| KVKK aydınlatma metni | Veri kategorileri, hukuki sebepler, yurt dışı aktarım tablosu, m.11 hakları, 30 günlük başvuru süresi |
| Gizlilik / Çerez / Kullanım koşulları | Üç ayrı sayfa |
| İşletme künyesi | Alt bilgide, her sayfadan erişilebilir |
| Çerez kullanımı | **Sıfır çerez.** Analiz veya reklam aracı yok — bu yüzden onay çubuğu da gerekmiyor |
| Google Haritalar | **Onaya bağlı yüklenir.** Ziyaretçi düğmeye basmadan Google'a hiçbir istek gitmez |
| Google Fonts | **Kullanılmıyor.** Yazı tipleri `assets/fonts/` içinde kendi sunucumuzda |
| Google yorumları | **Kopyalanmadı.** Yalnızca toplu puan gösterilir, kaynağa link verilir — yorum metinleri yazarlarının telifindedir |
| Görsellerde kişi | **Tanınabilir yüz içeren fotoğraf kullanılmadı** (kişilik hakları) |
| Görsellerde marka | Görünür üçüncü taraf logosu içeren kareler elendi |
| Alerjen bilgisi | Menü sayfasında ayrı bölüm |
| Fiyat şeffaflığı | "Fiyatlara KDV dâhildir" ibaresi |
| Alkol servisi uyarısı | Kokteyl bölümünde 18 yaş sınırı |
| Güvenlik başlıkları | `vercel.json` — CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy |

**Sitenin dışarıya yaptığı tek istek:** ziyaretçi "Haritayı yükle"
düğmesine bastığında Google Maps. Onun dışında her şey kendi alan
adınızdan servis edilir.

---

## Dosya yapısı

```
mekan-efes/
├── index.html                  Ana sayfa
├── menu.html                   QR menü sayfası
├── 404.html
├── kvkk-aydinlatma-metni.html  ┐
├── gizlilik-politikasi.html    │ Yasal sayfalar
├── cerez-politikasi.html       │
├── kullanim-kosullari.html     ┘
├── css/
│   ├── fonts.css               @font-face tanımları (üretilmiş)
│   └── style.css               Tüm tasarım — 17 bölüm hâlinde yorumlanmış
├── js/
│   └── main.js                 Arayüz davranışları — 9 bölüm
├── assets/
│   ├── fonts/                  Cormorant Garamond + Jost (4 dosya, 112 KB)
│   ├── img/                    Görseller (WebP) + simgeler + _kaynaklar.json
│   ├── logo/                   Logo varyantları (SVG)
│   └── qr/                     QR kod + baskıya hazır masa kartı
├── qr-uret.py                  QR yeniden üretme betiği
├── vercel.json                 Güvenlik başlıkları, önbellek, yönlendirmeler
├── robots.txt · sitemap.xml · site.webmanifest
├── LISANSLAR.md                Görsel/font/logo kaynakları ve lisans kayıtları
└── README.md
```

---

## Teknik notlar

**Yaklaşım:** Mobile-first. Kırılma noktaları 520 / 620 / 700 / 780 / 860 /
940 / 1040 px. Masaüstü navigasyonu 940 px'te devreye girer.

**Tasarım dili:** Koyu petrol (`#0A2027`) + pirinç (`#C9A24B`) + krem
(`#FBF8F2`). Instagram'daki mavi tonlu kimlikle uyumlu, ₺400–1.200 segmentine
uygun. Başlıklarda Cormorant Garamond, metinde Jost.

**Öne çıkan davranışlar** (`js/main.js`):
- Üst bar kaydırınca krem zeminli hâle geçer
- Tam ekran mobil menü — ESC ile kapanır, açıkken sayfa kilitlenir
- Gerçek saate göre "Şu an açığız / kapalıyız" rozeti + bugünün satırı
- Menü sayfasında yapışkan kategori çubuğu, aktif kategoriyi takip eder ve
  çubuğu o kategoriye kaydırır
- WhatsApp düğmesi hero'nun %40'ı geçilince belirir
- Harita onaya bağlı, onay `localStorage`'da hatırlanır

**Kaydırma işleyicisi neden `requestAnimationFrame` kullanmıyor:**
QR menü çoğunlukla Instagram/WhatsApp gibi uygulama içi tarayıcılarda
açılıyor; oralarda ve arka plan sekmelerinde rAF askıya alınabildiği için
yapışkan kategori çubuğu sessizce çalışmaz hâle geliyordu. Bunun yerine
`setTimeout` tabanlı, sondaki çağrıyı da garanti eden 100 ms'lik bir
kısıtlama (throttle) kullanılıyor.

**Erişilebilirlik:** İçeriğe atlama bağlantısı, `aria-expanded`/`aria-controls`
ile hamburger, açıklayıcı `alt` metinleri, görünür klavye odağı,
`prefers-reduced-motion` desteği. `.reveal` animasyonları CSS'te varsayılan
olarak görünürdür — JavaScript yüklenmezse içerik kaybolmaz.

**Performans:** WebP görseller, hero için `srcset`, hero dışında
`loading="lazy"`, tüm `<img>` etiketlerinde `width`/`height` (CLS önlemi),
fontlarda `preload` + `font-display: swap`.

**Tarayıcı desteği:** Chrome, Edge, Firefox, Safari güncel sürümleri.
WebP, `aspect-ratio`, `clamp()`, `svh` ve CSS özel değişkenleri kullanılır.
Internet Explorer desteklenmez.

---

## Sık yapılacak değişiklikler

**Renkler:** `css/style.css` en üstteki `:root` bloğu.

**Menüye ürün eklemek:** `menu.html` içinde bir `<li>` bloğunu kopyalayın.
Yeni kategori eklerken `<section class="menu-kat" id="...">` açın ve üstteki
`.menu-nav__liste` içine aynı `id`'ye giden bir bağlantı ekleyin —
JavaScript tarafında değişiklik gerekmez.

**Çalışma saatleri:** Üç yerde birlikte güncellenmeli —
`index.html` tablosu, `js/main.js` içindeki `CALISMA_SAATLERI` ve
`index.html` JSON-LD bloğu.

**Telefon numarası:** `grep -rn "905058962582" .` ile tüm geçtiği yerleri
bulabilirsiniz.
