/* ==========================================================================
   SCRIPT.JS - MULTI-PAGE BIRTHDAY WEBSITE LOGIC FOR KEISHA ZULFA RAMADHANI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Multi-Page Navigation Switcher
     -------------------------------------------------------------------------- */
  const navTabs = document.querySelectorAll('.nav-tab');
  const pageViews = document.querySelectorAll('.page-view');
  const btnNextPages = document.querySelectorAll('.btn-next-page');

  function switchPage(targetPageId) {
    pageViews.forEach(page => {
      page.classList.remove('active-page');
    });

    navTabs.forEach(tab => {
      if (tab.getAttribute('data-target') === targetPageId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
      targetPage.classList.add('active-page');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      switchPage(target);
    });
  });

  btnNextPages.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-goto');
      
      // Jika berpindah ke surat, luncurkan efek confetti
      if (target === 'page-letter' || target === 'page-wishes') {
        createConfettiBurst(35);
      }
      
      // Auto-start musik jika belum menyala
      if (!isPlaying) {
        toggleMusic();
      }

      switchPage(target);
    });
  });

  /* --------------------------------------------------------------------------
     2. Canvas Partikel Kunang-kunang Background
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
      this.size = Math.random() * 2.2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -Math.random() * 0.4 - 0.2;
      this.alpha = Math.random();
      this.alphaSpeed = Math.random() * 0.012 + 0.004;
      this.color = Math.random() > 0.3 ? '#e8a5a5' : '#c69c58';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.alphaSpeed;

      if (this.alpha >= 1 || this.alpha <= 0.1) {
        this.alphaSpeed = -this.alphaSpeed;
      }

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
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const fireflies = Array.from({ length: 40 }, () => new Firefly());

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
     3. Pemutar Musik Vinyl Player Controller (Panasea.mp3)
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
        console.log('Autoplay audio browser blocked initial tap:', err);
      });
    }
  }

  vinylWidget.addEventListener('click', toggleMusic);

  /* --------------------------------------------------------------------------
     4. Custom Confetti Burst Engine
     -------------------------------------------------------------------------- */
  function createConfettiBurst(count = 40) {
    const symbols = ['🌸', '✨', '💖', '⭐', '🎈'];

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      
      confetti.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      confetti.style.position = 'fixed';
      confetti.style.top = '-20px';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.fontSize = (Math.random() * 14 + 12) + 'px';
      confetti.style.zIndex = '999';
      confetti.style.pointerEvents = 'none';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      const duration = Math.random() * 2.5 + 2;
      confetti.style.transition = `transform ${duration}s ease-out, top ${duration}s ease-out, opacity ${duration}s ease-out`;

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = (window.innerHeight + 40) + 'px';
        confetti.style.transform = `translate3d(${(Math.random() - 0.5) * 180}px, 0, 0) rotate(${Math.random() * 540}deg)`;
        confetti.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        confetti.remove();
      }, duration * 1000 + 200);
    }
  }

  /* --------------------------------------------------------------------------
     5. Galeri Polaroid & Lightbox Viewer
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
     6. Interaksi Tiup Lilin & Harapan
     -------------------------------------------------------------------------- */
  const btnBlowCandle = document.getElementById('btn-blow-candle');
  const wishMessage = document.getElementById('wish-message');

  if (btnBlowCandle) {
    btnBlowCandle.addEventListener('click', () => {
      createConfettiBurst(50);
      wishMessage.classList.remove('hidden');
      btnBlowCandle.textContent = 'Doa Terkirim 💖';
      btnBlowCandle.style.background = 'var(--accent-rose)';
    });
  }

});
