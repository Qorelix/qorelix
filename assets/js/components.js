/* ========================================
   QORELIX — Component Logic
   ======================================== */

'use strict';

/* --- Testimonials Carousel --- */
function initTestimonialsCarousel() {
  const container = document.querySelector('.testimonials-carousel');
  if (!container || typeof Swiper === 'undefined') return;

  new Swiper(container, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: container.querySelector('.swiper-pagination'),
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}

/* --- Clients Marquee --- */
function initClientsMarquee() {
  const marquee = document.querySelector('.marquee-content');
  if (!marquee) return;

  // Clone content for seamless loop
  const clone = marquee.cloneNode(true);
  marquee.parentElement.appendChild(clone);
}

/* --- Careful about relying on Lenis since it might not load --- */
function initSmoothScrollLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Connect GSAP ScrollTrigger with Lenis
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* --- AOS Fallback (if AOS not loaded, use our own) --- */
function initScrollRevealFallback() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
    return;
  }

  // Fallback: Intersection Observer for reveal elements
  const revealElements = document.querySelectorAll('[data-aos]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

/* --- Navbar Hide/Show on Scroll --- */
function initNavBehavior() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
        ticking = false;
      });

      ticking = true;
    }
  }, { passive: true });

  // Always show nav when at top
  window.addEventListener('scroll', () => {
    if (window.pageYOffset < 50) {
      nav.style.transform = 'translateY(0)';
    }
  }, { passive: true });
}

// Note: Nav hide/show on scroll is disabled by default for stability.
// Uncomment initNavBehavior() in the DOMContentLoaded below to enable.

/* --- Initialize Components --- */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components that may depend on external libraries
  setTimeout(() => {
    initTestimonialsCarousel();
    initClientsMarquee();
    initSmoothScrollLenis();
    initScrollRevealFallback();
  }, 1000);
});
