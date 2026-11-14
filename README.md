# RODA — Rental Mobil, Cara Baru

Landing page rental mobil premium berbahasa Indonesia, dibuat sebagai website statis ringan tanpa framework atau dependensi runtime.

## Jalankan secara lokal

Buka `index.html` di browser, atau jalankan server statis sederhana:

```bash
python3 -m http.server 8000
```

Lalu buka http://localhost:8000.

## Fitur

- Desain responsif, tema merah, animasi scroll, hover, dan animasi hero.
- Armada interaktif dengan filter kategori, tombol favorit, dan alur pilih mobil.
- Form pencarian dengan pilihan lokasi dan tanggal yang tervalidasi.
- Asisten RODA AI yang menjawab berdasarkan katalog serta informasi yang ada di halaman.
- Preferensi `prefers-reduced-motion`, lazy loading gambar armada, dan pemuatan JavaScript tertunda.

## Catatan integrasi

Asisten saat ini merupakan prototipe kontekstual di sisi browser, bukan layanan LLM eksternal. Jawabannya disusun dari data armada di `app.js`; tidak memerlukan API key atau mengirim data pengguna ke server. Untuk menghubungkan model AI sungguhan dan sistem reservasi, tambahkan backend/API sendiri dan simpan kredensial di server—jangan pernah menaruh API key rahasia di JavaScript browser.

Gambar armada dan font dimuat dari Unsplash dan Google Fonts.
