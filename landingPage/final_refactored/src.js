import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Enhanced helloInti Landing Page JavaScript
// Adds smooth interactions, animations, and accessibility features
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initLivingEcosystemAnimation();
    initScrollIndicator();
    initFAQ();
    initScrollEffects();
    initScrollSpy();

    // Smooth scroll for anchor links using GSAP ScrollToPlugin
    // Function to handle smooth scrolling
    const smoothScrollTo = (target) => {
      // Immediately jump to the top before starting the scroll animation
      window.scrollTo(0, 0);
      gsap.to(window, {
        duration: 0.8,
        scrollTo: {
          y: target,
          offsetY: 100 // Account for fixed navigation
        },
        ease: "power2.inOut",
        // Add a small delay to ensure the jump happens first
        delay: 0.05
      });
    };

    // Handle same-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          smoothScrollTo(target);
        }
      });
    });

    // Handle cross-page anchor links
    if (window.location.hash) {
      if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      const target = document.querySelector(window.location.hash);
      if (target) {
        // Use a small timeout to ensure the page is fully rendered
        setTimeout(() => {
          smoothScrollTo(target);
        }, 100);
      }
    }
  } catch (error) {
    console.error('Error initializing landing page:', error);
  }
});

// Navigation functionality
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.menu');

  if (!nav || !navToggle || !menu) return;

  // Toggle mobile menu
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));

    // Update menu display for mobile
    if (window.innerWidth < 768) {
      menu.style.display = isOpen ? 'block' : 'none';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeNav();
    }
  });

  // Close menu when clicking nav links
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      menu.style.display = '';
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  function closeNav() {
    nav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (window.innerWidth < 768) {
      menu.style.display = 'none';
    }
  }

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      nav.style.backdropFilter = 'blur(5px)';
    }
  });
}

// FAQ accordion functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.setAttribute('hidden', '');
          }
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);

      // Toggle hidden attribute on answer
      if (!isActive) {
        answer.removeAttribute('hidden');
      } else {
        answer.setAttribute('hidden', '');
      }
    });
  });
}

// Scroll-triggered animations
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(`
    .problem-card,
    .solution-benefit,
    .team-card,
    .program-feature,
    .testimonial-card
  `);

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}


// Add entrance animations to elements
function initAnimations() {
  // Counter animation for statistics
  const counters = document.querySelectorAll('[class*="text-3xl"]');

  const countUp = (element, target) => {
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (target.toString().includes('+')) {
        element.textContent = Math.floor(current) + '+';
      } else if (target.toString().includes('x')) {
        element.textContent = Math.floor(current) + 'x';
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Observe statistics section
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statElements = entry.target.querySelectorAll('[class*="text-3xl"]');
        statElements.forEach(el => {
          const text = el.textContent;
          let target = parseInt(text);

          if (text.includes('761')) target = 761;
          else if (text.includes('144')) target = 144;
          else if (text.includes('18')) target = 18;

          if (target) {
            countUp(el, target);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('#program-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// Living Ecosystem Animation
function initLivingEcosystemAnimation() {
  const livingEcosystem = document.getElementById('livingEcosystem');
  if (!livingEcosystem) return;

  let pulseAnimation;

  function playLivingEcosystemAnimation() {
    // Set initial state
    gsap.set(livingEcosystem, {
      opacity: 0,
      scale: 0.9,
      filter: 'drop-shadow(0 0 0px rgba(166, 166, 27, 0))'
    });

    // Create timeline for the entrance animation
    const tl = gsap.timeline();

    // Sequence #2: Delayed entrance with bounce
    tl.to(livingEcosystem, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 1.5
    });

    // Sequence #3: Start pulsing animation after entrance
    tl.call(() => {
      startPulsingAnimation();
    });
  }

  function startPulsingAnimation() {
    // Stop any existing pulse animation
    if (pulseAnimation) {
      pulseAnimation.kill();
    }

    // Create infinite pulsing animation (1.5x more pronounced)
    pulseAnimation = gsap.to(livingEcosystem, {
      scale: 1.075,
      filter: 'drop-shadow(0 0 12px rgba(166, 166, 27, 0.6))',
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  // Auto-play animation on page load
  setTimeout(playLivingEcosystemAnimation, 500);
}

// Scroll Indicator Animation
function initScrollIndicator() {
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (!scrollIndicator) return;

  let bounceAnimation;
  let isVisible = false; // Initialize as false, as it's initially hidden

  function showScrollIndicator() {
    // Sequence #1: Fade in and scale up after page load
    gsap.set(scrollIndicator, {
      opacity: 0,
      scale: 0.8,
      y: 20
    });

    gsap.to(scrollIndicator, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 4.5,
      onComplete: () => {
        isVisible = true;
        startBounceAnimation();
      }
    });
  }

  function startBounceAnimation() {
    const arrow = scrollIndicator.querySelector('.scroll-arrow');

    // Sequence #2: Continuous gentle bounce with glow effect
    bounceAnimation = gsap.timeline({ repeat: -1 });

    bounceAnimation
      .to(arrow, {
        y: -8,
        duration: 1.2,
        ease: "power2.inOut"
      })
      .to(arrow, {
        y: 0,
        duration: 1.2,
        ease: "power2.inOut"
      });

    // Sequence #3: Subtle glow pulse animation
    gsap.to(arrow, {
      boxShadow: "0 4px 25px rgba(166, 166, 27, 0.4)",
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  function hideScrollIndicator() {
    if (!isVisible) return;

    // Sequence #4: Fade out when scrolling
    gsap.to(scrollIndicator, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        isVisible = false;
        if (bounceAnimation) {
          bounceAnimation.kill();
        }
      }
    });
  }

  // Click handler to scroll to next section
  scrollIndicator.addEventListener('click', () => {
    const testimonialsSection = document.getElementById('testimonials-section');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });

  // Hide indicator when user scrolls down
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100 && isVisible) {
      hideScrollIndicator();
    } else if (currentScrollY <= 50 && !isVisible) {
      // Show again if user scrolls back to top
      isVisible = true;
      gsap.set(scrollIndicator, { opacity: 1, y: 0 });
      startBounceAnimation();
    }

    lastScrollY = currentScrollY;
  });

  // Start the animation sequence
  showScrollIndicator();
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Scrollspy functionality for navigation highlighting
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  // Configuration for scrollspy
  const offset = 100; // Offset from top of viewport to trigger section

  function setActiveLink() {
    const scrollPosition = window.scrollY + offset;

    // Find the current section
    let currentSection = null;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section;
      }
    });

    // Update active link
    navLinks.forEach(link => {
      link.classList.remove('active');

      if (currentSection) {
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref === `#${currentSection.id}`) {
          link.classList.add('active');
        }
      }
    });
  }

  // Set initial active link on page load
  setActiveLink();

  // Update active link on scroll
  window.addEventListener('scroll', setActiveLink);

  // Update active link on resize (in case section positions change)
  window.addEventListener('resize', setActiveLink);
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    const nav = document.querySelector('.nav');
    if (nav && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      document.querySelector('.nav__toggle').setAttribute('aria-expanded', 'false');
    }
  }
});

// Preload critical images for better performance
function preloadImages() {
  const criticalImages = [
    'assets/mitra_martin.png',
    'assets/san_naidoo.jpeg'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize image preloading
preloadImages();

// Performance optimization: Lazy load non-critical elements
const lazyElements = document.querySelectorAll('img[src*="assets/"]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.hasAttribute('data-loaded')) {
      const img = entry.target;
      img.setAttribute('data-loaded', 'true');
      img.style.transition = 'opacity 0.3s ease-in-out';

      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
      }

      imageObserver.unobserve(img);
    }
  });
});

lazyElements.forEach(img => {
  if (img.complete) {
    img.style.opacity = '1';
    img.setAttribute('data-loaded', 'true');
  } else {
    imageObserver.observe(img);
  }
});

// Error handling for missing assets
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.warn('Image failed to load:', e.target.src);
    // You could replace with a placeholder image here
    e.target.style.display = 'none';
  }
}, true);

// Initialization complete
