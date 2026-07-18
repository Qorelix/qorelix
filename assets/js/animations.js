/* ========================================
   QORELIX — GSAP Animations (Optimized)
   ======================================== */

'use strict';

function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initGSAPAnimations, 500);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Default config: faster, smoother
  gsap.config({ nullTargetWarn: false });

  // Easing presets
  const ease = { out: 'power4.out', inOut: 'power2.inOut' };

  /* --- Hero Entrance --- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const words = heroTitle.textContent.split(' ');
    heroTitle.innerHTML = words.map(word =>
      `<span class="line" style="display:inline-block;overflow:hidden;vertical-align:middle;">
        <span style="display:inline-block;white-space:nowrap;">${word}&nbsp;</span>
      </span>`
    ).join('');
  }

  const heroTL = gsap.timeline({ delay: 0.3 });
  heroTL
    .from('.hero-tag', { opacity: 0, y: 20, duration: 0.6, ease: ease.out })
    .from('.hero-title .line', {
      opacity: 0, y: 60, rotationX: -30, duration: 0.9, stagger: 0.12, ease: ease.out
    }, '-=0.3')
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: ease.out }, '-=0.5')
    .from('.hero-actions .btn', {
      opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'back.out(2)'
    }, '-=0.3')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.6, ease: ease.out }, '-=0.2');

  /* --- CSS Reveal Classes (using IntersectionObserver for performance) --- */
  const revealTypes = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.slide-up', '.fade-in', '.scale-in', '.stagger-children', '.line-draw'
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(revealTypes.join(',')).forEach(el => {
    revealObserver.observe(el);
  });

  /* --- Section Header Titles (GSAP for smoother animation) --- */
  document.querySelectorAll('.section-header').forEach(header => {
    const label = header.querySelector('.section-label');
    const title = header.querySelector('.section-title');
    const subtitle = header.querySelector('.section-subtitle');
    const elements = [label, title, subtitle].filter(Boolean);
    if (!elements.length) return;

    gsap.from(elements, {
      scrollTrigger: {
        trigger: header, start: 'top 85%', once: true,
        invalidateOnRefresh: true
      },
      opacity: 0, y: 25, duration: 0.6, stagger: 0.12, ease: ease.out
    });
  });

  /* --- Card Stagger --- */
  const cardGrids = [
    '.services-grid', '.why-grid', '.values-grid', '.benefits-grid',
    '.industries-grid', '.team-grid', '.grid-2', '.grid-3', '.grid-4', '.grid-auto'
  ].join(',');

  document.querySelectorAll(cardGrids).forEach(grid => {
    const cards = grid.children;
    if (!cards.length) return;

    gsap.from(cards, {
      scrollTrigger: { trigger: grid, start: 'top 87%', once: true },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.07, ease: ease.out
    });
  });

  /* --- Timeline --- */
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      opacity: 0, x: -20, duration: 0.5, delay: i * 0.12, ease: ease.out
    });
  });

  gsap.from('.timeline::before', {
    scrollTrigger: { trigger: '.timeline', start: 'top 85%', once: true },
    scaleY: 0, transformOrigin: 'top center', duration: 1.2, ease: ease.inOut
  });

  /* --- CTA Section --- */
  document.querySelectorAll('.cta-section').forEach(cta => {
    const children = cta.querySelector('.cta-content')?.children;
    if (!children) return;

    gsap.from(children, {
      scrollTrigger: { trigger: cta, start: 'top 88%', once: true },
      opacity: 0, y: 25, duration: 0.5, stagger: 0.1, ease: ease.out
    });
  });

  /* --- Hero Particles (reduced count for performance) --- */
  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    const count = Math.min(15, Math.floor(window.innerWidth / 80));
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = 2 + Math.random() * 3;
      Object.assign(p.style, {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        width: size + 'px',
        height: size + 'px',
        opacity: 0.06 + Math.random() * 0.1,
        animation: `floatP${i % 3} ${12 + Math.random() * 10}s ease-in-out infinite`,
        animationDelay: Math.random() * 4 + 's'
      });
      heroParticles.appendChild(p);
    }

    if (!document.getElementById('particle-styles')) {
      const s = document.createElement('style');
      s.id = 'particle-styles';
      s.textContent = `
        @keyframes floatP0 { 0%,100%{transform:translateY(0)translateX(0)} 33%{transform:translateY(-20px)translateX(10px)} 66%{transform:translateY(-8px)translateX(-8px)} }
        @keyframes floatP1 { 0%,100%{transform:translateY(0)translateX(0)} 33%{transform:translateY(-15px)translateX(-12px)} 66%{transform:translateY(-25px)translateX(8px)} }
        @keyframes floatP2 { 0%,100%{transform:translateY(0)translateX(0)} 33%{transform:translateY(-10px)translateX(15px)} 66%{transform:translateY(-18px)translateX(-5px)} }
      `;
      document.head.appendChild(s);
    }
  }

  /* --- Floating Elements --- */
  document.querySelectorAll('.floating').forEach(el => {
    gsap.to(el, {
      y: -12, duration: 2.5 + Math.random() * 1.5,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: Math.random() * 1.5
    });
  });

  /* --- Parallax (optimized with scrub) --- */
  document.querySelectorAll('.parallax-section').forEach(section => {
    const bg = section.querySelector('.parallax-bg');
    if (!bg) return;

    gsap.to(bg, {
      y: () => section.offsetHeight * 0.25,
      ease: 'none',
      scrollTrigger: {
        trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.5
      }
    });
  });
}

/* --- Initialize --- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    initGSAPAnimations();
  } else {
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        clearInterval(check);
        initGSAPAnimations();
      }
    }, 100);
    setTimeout(() => clearInterval(check), 8000);
  }
});
