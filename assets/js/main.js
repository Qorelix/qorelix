/* ========================================
   QORELIX — Main JavaScript (Optimized)
   ======================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initScrollProgress();
  initSmoothScroll();
  initAccordions();
  initBlogSearch();
  initContactForm();
  initCounterAnimation();
  initMouseFollower();
  initHeroGlow();
});

/* --- Loader --- */
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.addEventListener('load', () => setTimeout(hide, 600), { once: true });
  setTimeout(hide, 3000);
}

/* --- Navigation --- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const linkItems = document.querySelectorAll('.nav-links a');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.pageYOffset > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  linkItems.forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      links?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const path = window.location.pathname.replace(/\/$/, '');
  linkItems.forEach(link => {
    const href = link.getAttribute('href')?.replace(/\/$/, '');
    if (path === href || (href && href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
}

/* --- Scroll Progress (RAF-throttled) --- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 + '%' : '0%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.nav')?.offsetHeight || 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - navH,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Accordion --- */
function initAccordions() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    const inner = item.querySelector('.accordion-body-inner');
    if (!header || !body || !inner) return;

    header.addEventListener('click', () => {
      const was = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0';
      });
      if (!was) {
        item.classList.add('active');
        body.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
}

/* --- Blog Search --- */
function initBlogSearch() {
  const input = document.querySelector('.blog-search input');
  const cards = document.querySelectorAll('.blog-card');
  if (!input || !cards.length) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = [
        card.querySelector('.blog-title'),
        card.querySelector('.blog-excerpt'),
        card.querySelector('.blog-category')
      ].map(el => el?.textContent?.toLowerCase() || '').join(' ');

      const match = !q || text.includes(q);
      card.style.display = match ? '' : 'none';
      card.style.opacity = match ? '1' : '0';
    });
  });
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.cssText += 'background:#22C55E;border-color:#22C55E';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target')) || 0;
      const duration = parseInt(el.getAttribute('data-duration')) || 2000;
      const start = performance.now();

      // If target is 0, just display it
      if (target === 0) {
        el.textContent = '0';
        observer.unobserve(el);
        return;
      }

      const update = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --- Mouse Follower --- */
function initMouseFollower() {
  const follower = document.querySelector('.mouse-follower');
  const dot = document.querySelector('.mouse-follower-dot');
  if (!follower || 'ontouchstart' in window) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  setTimeout(() => {
    follower.classList.add('visible');
    dot?.classList.add('visible');
  }, 1000);

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) dot.style.transform = `translate(${mx}px,${my}px)`;
  }, { passive: true });

  const animate = () => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx}px,${fy}px)`;
    requestAnimationFrame(animate);
  };
  animate();

  document.querySelectorAll('a,button,.card,.btn,.service-card,.industry-card,.portfolio-card,.blog-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

  document.addEventListener('mouseleave', () => {
    follower.classList.remove('visible');
    dot?.classList.remove('visible');
  });
  document.addEventListener('mouseenter', () => {
    follower.classList.add('visible');
    dot?.classList.add('visible');
  });
}

/* --- Hero Glow Effect --- */
function initHeroGlow() {
  const glow = document.querySelector('.hero-glow');
  const hero = document.querySelector('.hero');
  if (!glow || !hero) return;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
  }, { passive: true });
}
