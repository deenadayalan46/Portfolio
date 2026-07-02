/* ===================================================================
   DEENADAYALAN K — UI/UX PORTFOLIO — SCRIPT
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- LOADER ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  setTimeout(() => loader.classList.add('hidden'), 2200);

  /* ---------------- THEME TOGGLE ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('dk-theme', theme); } catch (e) {}
  }

  let savedTheme;
  try { savedTheme = localStorage.getItem('dk-theme'); } catch (e) { savedTheme = null; }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  themeToggle.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- NAVBAR SCROLL STATE ---------------- */
  const navbar = document.getElementById('navbar');
  function updateNavbarState() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });

  /* ---------------- MOBILE MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Single backdrop element
  const menuBackdrop = document.createElement('div');
  menuBackdrop.id = 'menuBackdrop';
  menuBackdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(menuBackdrop);

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    menuBackdrop.classList.remove('active');
    root.classList.remove('menu-open');
  }

  // Always start closed on page load
  closeMobileMenu();

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menuBackdrop.classList.add('active');
    root.classList.add('menu-open');
  }

  // Hamburger: toggle open/close
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  // Backdrop tap/click closes menu
  menuBackdrop.addEventListener('click', closeMobileMenu);

  // Each nav link closes menu on tap
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu if window resizes to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
      closeMobileMenu();
    }
  }, { passive: true });

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
        const fill = entry.target.querySelector('.skill-fill');
        const pct = entry.target.getAttribute('data-percent') || '0';
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        skillObserver.unobserve(entry.target);
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
          const circumference = 100.5;
          const offset = circumference - circumference * 1.0; // 100%
          requestAnimationFrame(() => { ringFill.style.strokeDashoffset = offset; });
          ringObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    ringObserver.observe(eduCard);
  }

  /* ---------------- CURSOR GLOW ---------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* ---------------- BACK TO TOP ---------------- */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- CONTACT FORM VALIDATION ---------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const isNonEmpty = (val) => val.length > 0;
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  function validateField(input, validatorFn) {
    const isValid = validatorFn(input.value.trim());
    input.closest('.form-group').classList.toggle('invalid', !isValid);
    return isValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.remove('show');

    const nameInput    = document.getElementById('cf-name');
    const emailInput   = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-message');

    const valid =
      validateField(nameInput, isNonEmpty) &
      validateField(emailInput, isValidEmail) &
      validateField(messageInput, isNonEmpty);

    if (valid) {
      successMsg.classList.add('show');
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
    } else {
      const first = form.querySelector('.form-group.invalid input, .form-group.invalid textarea');
      if (first) first.focus();
    }
  });

  ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(id).closest('.form-group').classList.remove('invalid');
      successMsg.classList.remove('show');
    });
  });

});
