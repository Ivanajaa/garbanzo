const cars = [
  { name: 'Honda Brio', category: 'city', price: 350000, seats: 4, fuel: 'Bensin', description: 'lincah untuk keliling kota dan gampang parkir' },
  { name: 'Toyota Innova Zenix', category: 'suv', price: 750000, seats: 7, fuel: 'Hybrid', description: 'lega dan nyaman untuk keluarga atau perjalanan jauh' },
  { name: 'Hyundai IONIQ 5', category: 'electric', price: 1100000, seats: 5, fuel: 'Listrik', description: 'mobil listrik premium dengan jangkauan hingga 480 km' },
  { name: 'Toyota Agya', category: 'city', price: 320000, seats: 4, fuel: 'Bensin', description: 'pilihan paling hemat untuk perjalanan harian di kota' }
];
const rupiah = value => new Intl.NumberFormat('id-ID').format(value);
const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Set sensible date defaults and prevent past-date selections.
const today = new Date();
const dateString = date => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(today.getDate() + 2);
const pickup = document.querySelector('#pickup-date');
const returnDate = document.querySelector('#return-date');
pickup.min = dateString(today);
pickup.value = dateString(tomorrow);
returnDate.min = dateString(tomorrow);
returnDate.value = dateString(dayAfter);
pickup.addEventListener('change', () => {
  const next = new Date(`${pickup.value}T12:00:00`);
  next.setDate(next.getDate() + 1);
  returnDate.min = dateString(next);
  if (returnDate.value < returnDate.min) returnDate.value = returnDate.min;
});

document.querySelector('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#armada').scrollIntoView({ behavior: 'smooth' });
  showToast(`Siap! Mobil di ${document.querySelector('#location').value} untuk tanggal pilihanmu.`);
});

document.querySelectorAll('.filter-chip').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-chip.active')?.classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    let visible = 0;
    document.querySelectorAll('.car-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    document.querySelector('#result-count').textContent = String(visible);
  });
});

document.querySelectorAll('.heart-button').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
    showToast(button.classList.contains('liked') ? 'Mobil disimpan ke favoritmu ♥' : 'Mobil dihapus dari favorit.');
  });
});

document.querySelectorAll('.book-car').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.car;
    const form = document.querySelector('#booking-form');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`${name} dipilih! Atur tanggal perjalananmu di sini.`);
  });
});

document.querySelector('.announcement-close').addEventListener('click', () => {
  document.querySelector('.announcement').remove();
});
const nav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Reveal on scroll, while showing everything immediately when motion is reduced.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
} else revealItems.forEach(element => element.classList.add('visible'));

// Context-aware assistant: answers using the actual fleet and features rendered on this page.
const panel = document.querySelector('#chat-panel');
const chatInput = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
function setChatOpen(open) {
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => chatInput.focus(), 150);
}
document.querySelector('#chat-fab').addEventListener('click', () => setChatOpen(!panel.classList.contains('open')));
document.querySelector('#chat-close').addEventListener('click', () => setChatOpen(false));
document.querySelector('#open-chat-top').addEventListener('click', () => setChatOpen(true));
function addMessage(text, kind) {
  const item = document.createElement('div');
  item.className = `message ${kind === 'user' ? 'user-message' : 'assistant-message'}`;
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
function replyFor(question) {
  const q = question.toLowerCase();
  if (/halo|hai|hi|pagi|siang|sore|malam/.test(q)) return 'Hai! Aku RODA AI, teman perjalananmu. Tanya apa saja soal mobil, harga, atau cara booking ya. ✨';
  if (/murah|hemat|termurah|harga|biaya|tarif|rp|budget/.test(q)) {
    const cheapest = [...cars].sort((a, b) => a.price - b.price)[0];
    return `Pilihan paling hemat adalah ${cheapest.name}, mulai Rp${rupiah(cheapest.price)} per hari. ${cars.find(car => car.category === 'city' && car.name !== cheapest.name)?.name} juga tersedia Rp${rupiah(350000)} per hari. Harga di website ini ditampilkan transparan per hari.`;
  }
  if (/keluarga|rombongan|anak|kursi|banyak orang|bareng/.test(q)) {
    const family = cars.find(car => car.seats === 7);
    return `Untuk keluarga, aku rekomendasikan ${family.name}: ${family.seats} kursi, nyaman untuk perjalanan jauh, mulai Rp${rupiah(family.price)} per hari. Kalau mau opsi listrik premium, Hyundai IONIQ 5 punya 5 kursi.`;
  }
  if (/listrik|electric|ev|hybrid|ramah lingkungan/.test(q)) return 'Ada Hyundai IONIQ 5 (Electric, 5 kursi, jangkauan hingga 480 km) mulai Rp1.100.000/hari, dan Toyota Innova Zenix Hybrid (7 kursi) mulai Rp750.000/hari. Pilih filter Electric di bagian armada untuk melihat mobil listrik.';
  if (/suv|city car|kota|jenis|tipe|mobil apa|armada|pilihan mobil/.test(q)) return 'Armada yang tampil: Honda Brio Rp350.000/hari (4 kursi), Toyota Innova Zenix Hybrid Rp750.000/hari (7 kursi), Hyundai IONIQ 5 Electric Rp1.100.000/hari (5 kursi), dan Toyota Agya Rp320.000/hari (4 kursi). Kamu bisa filter armada berdasarkan kategori.';
  if (/booking|pesan|sewa|reservasi|cara|batal|pembatalan|jemput|lokasi/.test(q)) return 'Booking gampang: pilih lokasi jemput serta tanggal ambil dan kembali di form, lalu pilih mobil yang kamu suka. Gratis pembatalan hingga 24 jam sebelum perjalanan. Website ini menampilkan demo alur pemesanan; konfirmasi reservasi belum terhubung ke sistem pembayaran.';
  if (/diskon|promo|kode|potongan/.test(q)) return 'Ada promo perjalanan pertama! Gunakan kode JALAN15 untuk diskon 15%. Cek syarat promo saat melakukan konfirmasi booking.';
  if (/bensin|bahan bakar|automatic|transmisi|spesifikasi/.test(q)) return 'Honda Brio dan Toyota Agya menggunakan bensin, transmisi automatic, 4 kursi. Toyota Innova Zenix berteknologi hybrid dengan 7 kursi. Hyundai IONIQ 5 menggunakan listrik dan punya jangkauan hingga 480 km.';
  if (/rekomendasi|sarankan|saran|terbaik|cocok/.test(q)) return 'Boleh! Untuk kota & hemat: Toyota Agya Rp320.000/hari. Untuk keluarga: Innova Zenix 7 kursi Rp750.000/hari. Untuk pengalaman premium: Hyundai IONIQ 5 Electric Rp1.100.000/hari. Kamu mau pergi sendiri, bareng keluarga, atau cari mobil listrik?';
  return 'Aku bisa bantu berdasarkan informasi di website ini—tanya harga dan pilihan mobil, rekomendasi untuk keluarga, mobil listrik, promo, atau cara booking. Mau tahu yang mana?';
}
function sendQuestion(question) {
  const value = question.trim();
  if (!value) return;
  document.querySelector('.quick-prompts')?.remove();
  addMessage(value, 'user');
  chatInput.value = '';
  const typing = document.createElement('div');
  typing.className = 'message assistant-message typing';
  typing.textContent = 'RODA AI sedang mengetik…';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
  window.setTimeout(() => {
    typing.remove();
    addMessage(replyFor(value), 'assistant');
  }, 420);
}
document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  sendQuestion(chatInput.value);
});
document.querySelectorAll('.quick-prompts button').forEach(button => {
  button.addEventListener('click', () => sendQuestion(button.textContent));
});
