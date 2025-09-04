// Enhanced helloInti Landing Page JavaScript
// Adds smooth interactions, animations, and accessibility features

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  initNavigation();
  initAnimations();
  initFAQ();
  initScrollEffects();
  initNetworkAnimation();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
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
        }
      });
      
      // Toggle current item
      item.classList.toggle('active', !isActive);
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

// Network animation in hero section
function initNetworkAnimation() {
  const networkNodes = document.querySelectorAll('.network-node');
  
  if (networkNodes.length === 0) return;
  
  // Add interactive hover effects
  networkNodes.forEach((node, index) => {
    // Stagger the initial animation
    node.style.animationDelay = `${index * 0.3}s`;
    
    // Add click interaction
    node.addEventListener('click', () => {
      // Create ripple effect
      createRippleEffect(node);
      
      // Highlight connected nodes
      highlightConnectedNodes(index);
    });
  });
  
  function createRippleEffect(node) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(166, 166, 27, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    node.style.position = 'relative';
    node.appendChild(ripple);
    
    // Add ripple animation
    if (!document.getElementById('ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  function highlightConnectedNodes(activeIndex) {
    // Reset all nodes
    networkNodes.forEach(node => {
      node.style.background = '';
    });
    
    // Highlight active node and simulate connections
    const activeNode = networkNodes[activeIndex];
    activeNode.style.background = 'linear-gradient(135deg, #F2B705, #E65C4F)';
    
    // Highlight connected nodes based on simple logic
    const connections = [
      [0, 1, 2], // Node 0 connects to 1, 2
      [1, 0, 3], // Node 1 connects to 0, 3
      [2, 0, 4], // Node 2 connects to 0, 4
      [3, 1, 5], // Node 3 connects to 1, 5
      [4, 2, 5], // Node 4 connects to 2, 5
      [5, 3, 4]  // Node 5 connects to 3, 4
    ];
    
    if (connections[activeIndex]) {
      connections[activeIndex].forEach(nodeIndex => {
        if (networkNodes[nodeIndex]) {
          setTimeout(() => {
            networkNodes[nodeIndex].style.background = 'linear-gradient(135deg, #A6A61B, #F2A08D)';
          }, 200);
        }
      });
    }
    
    // Reset after animation
    setTimeout(() => {
      networkNodes.forEach(node => {
        node.style.background = '';
      });
    }, 2000);
  }
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
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      imageObserver.unobserve(img);
    }
  });
});

lazyElements.forEach(img => {
  if (img.complete) {
    img.style.opacity = '1';
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

console.log('helloInti landing page initialized successfully! 🌟');