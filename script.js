/* ===================================================================
   DEENADAYALAN K — UI/UX PORTFOLIO — SCRIPT
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- LOADER ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => loader.classList.add('hidden'), 2200);

  /* ---------------- THEME TOGGLE ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('dk-theme', theme); } catch (e) { /* storage unavailable */ }
  }

  let savedTheme;
  try { savedTheme = localStorage.getItem('dk-theme'); } catch (e) { savedTheme = null; }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- NAVBAR SCROLL STATE ---------------- */
  const navbar = document.getElementById('navbar');
  function updateNavbarState() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* ---------------- MOBILE MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Backdrop overlay — created once, reused
  const menuBackdrop = document.createElement('div');
  menuBackdrop.id = 'menuBackdrop';
  menuBackdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(menuBackdrop);

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    menuBackdrop.classList.remove('active');
    document.documentElement.classList.remove('menu-open');
  }

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menuBackdrop.classList.add('active');
    document.documentElement.classList.add('menu-open');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  // Tap backdrop to close
  menuBackdrop.addEventListener('click', closeMobileMenu);

  // Tap a nav link to close
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close when tapping the backdrop
  menuBackdrop.addEventListener('click', closeMobileMenu);
  menuBackdrop.addEventListener('touchend', (e) => {
    e.preventDefault();
    closeMobileMenu();
  });

  // Close when a nav link is tapped
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ---------------- ACTIVE NAV LINK ON SCROLL ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function setActiveLink(id) {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
    mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  }

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------------- SCROLL-REVEAL ANIMATIONS ---------------- */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => revealObserver.observe(el));

  /* ---------------- SKILL BAR FILL ANIMATION ---------------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const pct = bar.getAttribute('data-percent') || '0';
        const fill = bar.querySelector('.skill-fill');
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------------- EDUCATION RING PROGRESS ---------------- */
  const eduCard = document.querySelector('.edu-card');
  if (eduCard) {
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ringFill = entry.target.querySelector('.edu-ring-fill');
          // Full circle — 100% complete
          const circumference = 100.5;
          const percentComplete = 1.0;
          const offset = circumference - circumference * percentComplete;
          requestAnimationFrame(() => { ringFill.style.strokeDashoffset = offset; });
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ringObserver.observe(eduCard);
  }

  /* ---------------- CURSOR GLOW ---------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* ---------------- BACK TO TOP ---------------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.location.hash = '#home';
  });

  /* ---------------- CONTACT FORM VALIDATION ---------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  function validateField(input, errId, validatorFn) {
    const group = input.closest('.form-group');
    const isValid = validatorFn(input.value.trim());
    group.classList.toggle('invalid', !isValid);
    return isValid;
  }

  const isNonEmpty = (val) => val.length > 0;
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');

    const nameInput = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-message');

    const nameValid = validateField(nameInput, 'err-name', isNonEmpty);
    const emailValid = validateField(emailInput, 'err-email', isValidEmail);
    const messageValid = validateField(messageInput, 'err-message', isNonEmpty);

    if (nameValid && emailValid && messageValid) {
      successMsg.classList.add('show');
      form.reset();
      [nameInput, emailInput, messageInput].forEach(inp => inp.closest('.form-group').classList.remove('invalid'));
    } else {
      const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // Clear invalid state as the user types
  ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      el.closest('.form-group').classList.remove('invalid');
      successMsg.classList.remove('show');
    });
  });

});
