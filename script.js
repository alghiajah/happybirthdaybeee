/* ==========================================================================
   SCRIPT.JS - WEBSITE UCAPAN ULANG TAHUN KE-18 KEISHA ZULFA RAMADHANI
   Sistem Interaktif: Canvas Kunang-kunang, Vinyl Music Player,
   Efek Confetti, Lightbox Modal, dan Scroll Reveal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Canvas Kunang-kunang (Fireflies / Floating Light Particles System)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('fireflies-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Firefly {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -Math.random() * 0.5 - 0.2; // Melayang perlahan ke atas
      this.alpha = Math.random();
      this.alphaSpeed = Math.random() * 0.015 + 0.005;
      this.color = Math.random() > 0.3 ? '#e8a5a5' : '#c69c58'; // Rose or Warm Gold
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Alpha pulsing effect (berkedip lembut)
      this.alpha += this.alphaSpeed;
      if (this.alpha >= 1 || this.alpha <= 0.1) {
        this.alphaSpeed = -this.alphaSpeed;
      }

      // Reset posisi jika keluar dari layar atas/samping
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.abs(this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const fireflies = Array.from({ length: 45 }, () => new Firefly());

  function animateFireflies() {
    ctx.clearRect(0, 0, width, height);
    fireflies.forEach(firefly => {
      firefly.update();
      firefly.draw();
    });
    requestAnimationFrame(animateFireflies);
  }

  animateFireflies();

  /* --------------------------------------------------------------------------
     2. Vinyl Music Player Controller (Panasea.mp3)
     -------------------------------------------------------------------------- */
  const bgMusic = document.getElementById('bg-music');
  const vinylWidget = document.getElementById('vinyl-widget');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicStatusText = document.getElementById('music-status-text');
  let isPlaying = false;

  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      vinylDisc.classList.remove('playing');
      vinylWidget.classList.remove('active');
      musicStatusText.textContent = 'Putar Panasea 🎵';
      isPlaying = false;
    } else {
      bgMusic.play().then(() => {
        vinylDisc.classList.add('playing');
        vinylWidget.classList.add('active');
        musicStatusText.textContent = 'Memutar Panasea 🎵';
        isPlaying = true;
      }).catch(err => {
        console.log('Autoplay prevented by browser:', err);
      });
    }
  }

  vinylWidget.addEventListener('click', toggleMusic);

  /* --------------------------------------------------------------------------
     3. Tombol "Buka Suratnya 💌" - Smooth Scroll & Audio Auto-Start & Confetti
     -------------------------------------------------------------------------- */
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const letterSection = document.getElementById('letter');

  btnOpenLetter.addEventListener('click', () => {
    // Putar musik secara otomatis saat tombol diklik jika belum berputar
    if (!isPlaying) {
      toggleMusic();
    }

    // Pemicu animasi confetti berjatuhan
    createConfettiBurst(50);

    // Smooth Scroll ke Bagian Surat
    letterSection.scrollIntoView({ behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     4. Custom Confetti Engine
     -------------------------------------------------------------------------- */
  function createConfettiBurst(count = 40) {
    const colors = ['#d98282', '#e8a5a5', '#c69c58', '#ffffff', '#f4eee1'];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      
      const isHeart = Math.random() > 0.6;
      confetti.textContent = isHeart ? '🌸' : (Math.random() > 0.5 ? '✨' : '💖');
      
      confetti.style.position = 'fixed';
      confetti.style.top = '-20px';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.fontSize = (Math.random() * 16 + 12) + 'px';
      confetti.style.zIndex = '999';
      confetti.style.pointerEvents = 'none';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      const duration = Math.random() * 3 + 2.5;
      confetti.style.transition = `transform ${duration}s ease-out, top ${duration}s ease-out, opacity ${duration}s ease-out`;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = (window.innerHeight + 50) + 'px';
        confetti.style.transform = `translate3d(${(Math.random() - 0.5) * 200}px, 0, 0) rotate(${Math.random() * 720}deg)`;
        confetti.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        confetti.remove();
      }, duration * 1000 + 200);
    }
  }

  /* --------------------------------------------------------------------------
     5. Galeri Polaroid & Lightbox Modal Handler
     -------------------------------------------------------------------------- */
  const polaroidItems = document.querySelectorAll('.polaroid-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  polaroidItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      const captionText = item.getAttribute('data-caption');

      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = captionText;
      lightboxModal.classList.add('active');
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* --------------------------------------------------------------------------
     6. Tombol Interaktif "Tiup Lilin & Kirim Doa"
     -------------------------------------------------------------------------- */
  const btnBlowCandle = document.getElementById('btn-blow-candle');
  const wishMessage = document.getElementById('wish-message');

  btnBlowCandle.addEventListener('click', () => {
    createConfettiBurst(60);
    wishMessage.classList.remove('hidden');
    btnBlowCandle.innerHTML = 'Doa Terkirim dengan Cinta! 💖';
    btnBlowCandle.style.background = 'var(--accent-rose)';
    btnBlowCandle.style.color = '#ffffff';
  });

});
