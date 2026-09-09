#!/usr/bin/env python3
"""
QR KOD ÜRETİCİ — Mekan Efes

Menü sayfasına yönlendiren QR kodunu ve masaya konacak baskıya hazır
kartı üretir.

KULLANIM
    pip install segno
    python qr-uret.py                          # varsayılan adresle üretir
    python qr-uret.py https://alanadi.com/menu.html

ÇIKTILAR (assets/qr/ içine)
    menu-qr.svg        Sade QR — vektörel, istediğiniz boyuta büyür
    menu-qr.png        Sade QR — 1200 px, dijital kullanım için
    masa-karti.svg     Baskıya hazır masa kartı (85 x 120 mm)

NOT: Alan adınız kesinleştiğinde bu betiği yeni adresle tekrar
çalıştırın; eski QR kodları geçersiz kalır.
"""

import sys
import os

try:
    import segno
except ImportError:
    sys.exit("Önce 'pip install segno' komutunu çalıştırın.")

# ---------------------------------------------------------------- ayarlar
VARSAYILAN_ADRES = "https://mekanefes.vercel.app/menu.html"

GECE = "#0A2027"     # koyu petrol — QR modülleri
PIRINC = "#C9A24B"   # pirinç — vurgu
KREM = "#FBF8F2"     # krem — kart zemini

CIKTI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "qr")


def qr_uret(adres):
    os.makedirs(CIKTI, exist_ok=True)

    # error='h' : %30 hata düzeltme. Kirlenen/çizilen kartlar da okunur.
    qr = segno.make(adres, error="h")

    svg_yol = os.path.join(CIKTI, "menu-qr.svg")
    qr.save(svg_yol, scale=10, border=2, dark=GECE, light=None)

    png_yol = os.path.join(CIKTI, "menu-qr.png")
    qr.save(png_yol, scale=20, border=2, dark=GECE, light="#FFFFFF")

    kart_yol = os.path.join(CIKTI, "masa-karti.svg")
    open(kart_yol, "w", encoding="utf-8").write(masa_karti(qr, adres))

    print(f"Adres      : {adres}")
    print(f"QR sürümü  : {qr.version} (hata düzeltme: %30)")
    for y in (svg_yol, png_yol, kart_yol):
        print(f"  {os.path.relpath(y):34} {os.path.getsize(y):>7,} bayt")


def masa_karti(qr, adres):
    """85 x 120 mm baskıya hazır masa kartı üretir."""
    # QR'ı kartın içine gömmek için ham matrisi kullanıyoruz
    matris = [list(satir) for satir in qr.matrix]
    n = len(matris)
    kutu = 100.0 / n          # QR alanı 100 birim genişliğinde

    kareler = []
    for y, satir in enumerate(matris):
        for x, deger in enumerate(satir):
            if deger:
                kareler.append(
                    f'<rect x="{x*kutu:.3f}" y="{y*kutu:.3f}" '
                    f'width="{kutu:.3f}" height="{kutu:.3f}"/>'
                )
    qr_kareler = "\n      ".join(kareler)

    return f'''<svg xmlns="http://www.w3.org/2000/svg"
     width="85mm" height="120mm" viewBox="0 0 85 120">
  <title>Mekan Efes — QR menü masa kartı</title>
  <!-- Baskı ölçüsü: 85 x 120 mm. Kesim payı için kenarlarda 5 mm boşluk var. -->

  <rect width="85" height="120" fill="{KREM}"/>
  <rect x="3" y="3" width="79" height="114" fill="none"
        stroke="{PIRINC}" stroke-width="0.4" opacity="0.5"/>

  <!-- Amblem -->
  <g transform="translate(34.5, 11) scale(0.16)"
     fill="none" stroke="{PIRINC}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 86 V50 A34 34 0 0 1 84 50 V86" stroke-width="3.2" opacity="0.55"/>
    <path d="M11 86 H89" stroke-width="3.2" opacity="0.55"/>
    <path d="M26 70 V44 L38 61 L50 44 V70" stroke-width="4.2"/>
    <path d="M60 44 V70 M60 44 H75 M60 57 H71 M60 70 H75" stroke-width="4.2"/>
  </g>

  <text x="42.5" y="34" text-anchor="middle" fill="{GECE}"
        font-family="'Cormorant Garamond', Georgia, serif"
        font-size="8" font-weight="600" letter-spacing="1.1">MEKAN EFES</text>
  <text x="42.5" y="40" text-anchor="middle" fill="{GECE}" opacity="0.6"
        font-family="Jost, system-ui, sans-serif"
        font-size="2.8" letter-spacing="1.2">BİSTRO &amp; CAFE · SELÇUK</text>

  <line x1="30" y1="45" x2="55" y2="45" stroke="{PIRINC}" stroke-width="0.4"/>

  <!-- QR alanı: 55 x 55 mm, ortalanmış -->
  <g transform="translate(15, 50) scale(0.55)" fill="{GECE}">
      {qr_kareler}
  </g>

  <text x="42.5" y="112" text-anchor="middle" fill="{GECE}"
        font-family="Jost, system-ui, sans-serif"
        font-size="3.6" font-weight="500" letter-spacing="0.4">Menü için kameranızı QR koda tutun</text>
  <text x="42.5" y="116.5" text-anchor="middle" fill="{GECE}" opacity="0.45"
        font-family="Jost, system-ui, sans-serif" font-size="2.4">{adres.replace("https://", "")}</text>
</svg>
'''


if __name__ == "__main__":
    qr_uret(sys.argv[1] if len(sys.argv) > 1 else VARSAYILAN_ADRES)
