/* ============================================================================
   MEKAN EFES — Arayüz davranışları
   Saf JavaScript, hiçbir kütüphane kullanılmaz.
   Hem index.html hem menu.html bu dosyayı yükler; ilgisiz bölümler
   sayfada karşılığı yoksa sessizce atlanır.

   1. Üst barın kaydırma durumu
   2. Mobil menü (hamburger)
   3. Kaydırınca beliren öğeler
   4. Aktif bağlantı takibi (ana sayfa navigasyonu)
   5. Açık / kapalı rozeti + bugünün çalışma saati
   6. Sabit WhatsApp düğmesi
   7. Google Haritalar — onaya bağlı yükleme
   8. Menü sayfası: yapışkan kategori çubuğu
   9. Alt bilgideki yıl
   ========================================================================== */

(function () {
  "use strict";

  /* JavaScript'in çalıştığını CSS'e bildir. .reveal öğeleri yalnızca bu
     sınıf varken gizlenir; script yüklenmezse içerik görünür kalır. */
  document.documentElement.classList.add("js");

  var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ==========================================================
     1. ÜST BARIN KAYDIRMA DURUMU
     ========================================================== */
  var header = document.getElementById("header");

  function ustBarGuncelle() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  function kaydirmayaBagliGuncelle() {
    ustBarGuncelle();
    waGuncelle();
    aktifBaglantiGuncelle();
    menuKategoriGuncelle();
  }

  /* Kaydırma işleyicisi zamanlayıcıyla kısıtlanır (throttle).
     Bilerek requestAnimationFrame kullanılmıyor: QR menü çoğunlukla
     Instagram/WhatsApp gibi uygulama içi tarayıcılarda açılıyor ve
     oralarda rAF askıya alınabildiği için yapışkan kategori çubuğu
     sessizce güncellenmez hâle geliyor. setTimeout her ortamda çalışır. */
  var ARALIK = 100;   /* saniyede en çok 10 güncelleme */
  var sonCalisma = 0;
  var zamanlayici = null;

  function kaydirmaIsle() {
    var simdi = Date.now();
    if (simdi - sonCalisma >= ARALIK) {
      sonCalisma = simdi;
      kaydirmayaBagliGuncelle();
    } else {
      /* Kaydırma dururken son konumun da işlenmesini garanti eder */
      window.clearTimeout(zamanlayici);
      zamanlayici = window.setTimeout(function () {
        sonCalisma = Date.now();
        kaydirmayaBagliGuncelle();
      }, ARALIK);
    }
  }
  window.addEventListener("scroll", kaydirmaIsle, { passive: true });
  window.addEventListener("resize", kaydirmaIsle, { passive: true });


  /* ==========================================================
     2. MOBİL MENÜ
     ========================================================== */
  var burger = document.getElementById("burger");
  var mobilMenu = document.getElementById("mobile-nav");

  function menuAc() {
    mobilMenu.hidden = false;
    /* Yeniden yerleşime zorlar; geçişin başlangıç durumundan animasyonla
       ilerlemesi için gerekir. requestAnimationFrame yerine bu yöntem
       kullanılıyor: arka plandaki sekmelerde rAF askıya alınabiliyor. */
    void mobilMenu.offsetWidth;
    mobilMenu.classList.add("is-open");
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Menüyü kapat");
    document.body.classList.add("is-locked");
  }

  function menuKapat() {
    mobilMenu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Menüyü aç");
    document.body.classList.remove("is-locked");

    window.setTimeout(function () {
      if (!mobilMenu.classList.contains("is-open")) mobilMenu.hidden = true;
    }, azHareket ? 0 : 440);
  }

  if (burger && mobilMenu) {
    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") menuKapat();
      else menuAc();
    });

    mobilMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", menuKapat);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        menuKapat();
        burger.focus();
      }
    });

    window.matchMedia("(min-width: 940px)").addEventListener("change", function (e) {
      if (e.matches) menuKapat();
    });
  }


  /* ==========================================================
     3. KAYDIRINCA BELİREN ÖĞELER
     ========================================================== */
  var belirenler = document.querySelectorAll(".reveal");

  if (azHareket || !("IntersectionObserver" in window)) {
    belirenler.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var gozlemci = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (girdi) {
        if (!girdi.isIntersecting) return;
        girdi.target.classList.add("is-visible");
        gozlemci.unobserve(girdi.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    belirenler.forEach(function (el) { gozlemci.observe(el); });

    /* Emniyet ağı: gözlemci herhangi bir nedenle tetiklenmezse içerik
       kalıcı olarak görünmez kalmasın. */
    window.setTimeout(function () {
      belirenler.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }


  /* ==========================================================
     4. AKTİF BAĞLANTI TAKİBİ (ana sayfa üst menüsü)
     ========================================================== */
  var navBaglantilari = document.querySelectorAll(".nav__link");
  var bolumler = [];

  navBaglantilari.forEach(function (a) {
    var href = a.getAttribute("href");
    if (href.charAt(0) !== "#") return;      /* menu.html gibi dış bağlantıları atla */
    var hedef = document.querySelector(href);
    if (hedef) bolumler.push({ link: a, el: hedef });
  });

  function aktifBaglantiGuncelle() {
    if (!bolumler.length) return;
    var esik = window.scrollY + window.innerHeight * 0.35;
    var aktif = null;
    bolumler.forEach(function (b) {
      if (b.el.offsetTop <= esik) aktif = b;
    });
    bolumler.forEach(function (b) {
      b.link.classList.toggle("is-active", b === aktif);
    });
  }


  /* ==========================================================
     5. AÇIK / KAPALI ROZETİ
     Tek kaynak: aşağıdaki tablo. Saatler değişirse hem burayı, hem
     index.html'deki tabloyu, hem de JSON-LD bloğunu güncelleyin.
     Gün numaraları JavaScript standardına göre: 0 = Pazar.
     Gece yarısı kapanış "24:00" olarak yazılır.
     ========================================================== */
  var CALISMA_SAATLERI = {
    0: { ac: "08:30", kapa: "24:00" },
    1: { ac: "08:30", kapa: "24:00" },
    2: { ac: "08:30", kapa: "24:00" },
    3: { ac: "08:30", kapa: "24:00" },
    4: { ac: "08:30", kapa: "24:00" },
    5: { ac: "08:30", kapa: "24:00" },
    6: { ac: "08:30", kapa: "24:00" }
  };

  function dakikayaCevir(saat) {
    var p = saat.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function durumGuncelle() {
    var nokta = document.getElementById("durum-nokta");
    var metin = document.getElementById("durum-metin");

    var simdi = new Date();
    var gun = simdi.getDay();
    var suAn = simdi.getHours() * 60 + simdi.getMinutes();
    var bugun = CALISMA_SAATLERI[gun];

    /* İletişim tablosunda bugünün satırını işaretle (menü sayfasında yok) */
    var satir = document.querySelector('#saatler tr[data-gun="' + gun + '"]');
    if (satir) satir.classList.add("is-bugun");

    if (!nokta || !metin) return;

    if (bugun && suAn >= dakikayaCevir(bugun.ac) && suAn < dakikayaCevir(bugun.kapa)) {
      nokta.className = "nokta is-acik";
      metin.textContent = "Şu an açığız · gece 00:00'a kadar";
    } else {
      nokta.className = "nokta is-kapali";
      if (bugun && suAn < dakikayaCevir(bugun.ac)) {
        metin.textContent = "Şu an kapalıyız · Bugün " + bugun.ac + "'da açılıyoruz";
      } else {
        metin.textContent = "Şu an kapalıyız · Yarın " + CALISMA_SAATLERI[(gun + 1) % 7].ac + "'da açılıyoruz";
      }
    }
  }


  /* ==========================================================
     6. SABİT WHATSAPP DÜĞMESİ
     ========================================================== */
  var waDugme = document.getElementById("wa");

  function waGuncelle() {
    if (!waDugme) return;
    waDugme.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.4);
  }


  /* ==========================================================
     7. GOOGLE HARİTALAR — ONAYA BAĞLI YÜKLEME
     Harita gömülüsü Google'a IP adresi gönderir ve çerez
     yerleştirebilir. Bu yüzden iframe, ziyaretçi açıkça onay verene
     kadar sayfaya eklenmez (KVKK m.5 / açık rıza).
     Verilen onay yalnızca tarayıcıda saklanır; sunucuya gönderilmez.
     ========================================================== */
  var ONAY_ANAHTARI = "mekanefes_harita_onay";

  /* DEĞİŞTİR: gerekirse "enlem,boylam" biçiminde tam koordinat yazın */
  var HARITA_SORGUSU = "Mekan Efes Restaurant, Atatürk Mah. 1055. Sk. No:4, Selçuk, İzmir";

  function haritayiYukle() {
    var kutu = document.getElementById("harita-onay");
    if (!kutu || !kutu.parentNode) return;

    var iframe = document.createElement("iframe");
    iframe.src = "https://maps.google.com/maps?q=" +
                 encodeURIComponent(HARITA_SORGUSU) + "&z=17&output=embed";
    iframe.title = "Mekan Efes konumu — Selçuk, İzmir";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.setAttribute("allowfullscreen", "");

    kutu.parentNode.replaceChild(iframe, kutu);
  }

  var haritaDugmesi = document.getElementById("harita-yukle");
  if (haritaDugmesi) {
    haritaDugmesi.addEventListener("click", function () {
      try { window.localStorage.setItem(ONAY_ANAHTARI, "1"); } catch (e) { /* gizli mod */ }
      haritayiYukle();
    });
    try {
      if (window.localStorage.getItem(ONAY_ANAHTARI) === "1") haritayiYukle();
    } catch (e) { /* localStorage kapalıysa sessizce geç */ }
  }


  /* ==========================================================
     8. MENÜ SAYFASI — YAPIŞKAN KATEGORİ ÇUBUĞU
     Ekranda hangi kategori görünüyorsa üstteki çip işaretlenir ve
     çubuk o çipi görünür alana kaydırır.
     ========================================================== */
  var menuNav = document.getElementById("menu-nav");
  var menuBaglantilari = menuNav ? menuNav.querySelectorAll("a") : [];
  var menuBolumleri = [];

  menuBaglantilari.forEach(function (a) {
    var hedef = document.querySelector(a.getAttribute("href"));
    if (hedef) menuBolumleri.push({ link: a, el: hedef });
  });

  var sonAktifMenu = null;

  function menuKategoriGuncelle() {
    if (!menuBolumleri.length) return;

    /* Yapışkan çubuğun altında kalan ilk bölümü aktif say */
    var esik = window.scrollY + (menuNav.offsetHeight || 56) + 24;
    var aktif = menuBolumleri[0];

    menuBolumleri.forEach(function (b) {
      if (b.el.offsetTop <= esik) aktif = b;
    });

    if (aktif === sonAktifMenu) return;
    sonAktifMenu = aktif;

    menuBolumleri.forEach(function (b) {
      b.link.classList.toggle("is-active", b === aktif);
    });

    /* Aktif çipi yatay çubukta görünür kıl */
    var c = aktif.link;
    var sol = c.offsetLeft - (menuNav.clientWidth - c.offsetWidth) / 2;
    menuNav.scrollTo({ left: Math.max(0, sol), behavior: azHareket ? "auto" : "smooth" });
  }


  /* ==========================================================
     9. ALT BİLGİDEKİ YIL
     ========================================================== */
  var yilAlani = document.getElementById("yil");
  if (yilAlani) yilAlani.textContent = new Date().getFullYear();


  /* ==========================================================
     İLK ÇALIŞTIRMA
     ========================================================== */
  ustBarGuncelle();
  waGuncelle();
  aktifBaglantiGuncelle();
  menuKategoriGuncelle();
  durumGuncelle();

  /* Rozet dakikada bir tazelensin (sayfa uzun süre açık kalırsa) */
  window.setInterval(durumGuncelle, 60000);
})();
