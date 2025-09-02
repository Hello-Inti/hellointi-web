// V5 minimal interactions: mobile nav toggle + FAQ accordion
// Purpose: Enhance usability with accessible, lightweight JS (no dependencies)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('primary-menu');

  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove('nav--open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  };

  if (nav && navToggle && menu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('nav--open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when clicking a link (useful on mobile)
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeNav());
    });

    // Click-away to close
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('nav--open')) return;
      const target = e.target;
      if (target instanceof Element) {
        const clickedInsideNav = nav.contains(target);
        if (!clickedInsideNav) closeNav();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // FAQ Accordion (single-open)
  const toggles = document.querySelectorAll('.faq__toggle');

  const closeAllFaq = () => {
    toggles.forEach((btn) => {
      const id = btn.getAttribute('aria-controls');
      if (!id) return;
      const panel = document.getElementById(id);
      btn.setAttribute('aria-expanded', 'false');
      if (panel) panel.hidden = true;
    });
  };

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('aria-controls');
      if (!id) return;
      const panel = document.getElementById(id);
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';

      // Ensure only one open at a time
      closeAllFaq();

      btn.setAttribute('aria-expanded', String(willOpen));
      if (panel) panel.hidden = !willOpen;

      // Manage focus for accessibility when opening
      if (willOpen && panel) {
        // Move focus to the panel region without stealing scroll
        panel.setAttribute('tabindex', '-1');
        panel.focus({ preventScroll: true });
        // Clean up tabindex after focus
        panel.addEventListener('blur', () => panel.removeAttribute('tabindex'), { once: true });
      }
    });
  });
});