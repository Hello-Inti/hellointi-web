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

// Network transformation animation in hero section
function initNetworkAnimation() {
  class NetworkTransformation {
    constructor() {
      this.nodes = [];
      this.connections = [];
      this.connectionsSvg = document.getElementById('connectionsSvg');
      this.isTransformed = false;

      if (!this.connectionsSvg) return;

      this.init();
      this.startAnimation();
    }

    init() {
      // Get all node elements
      this.nodes = Array.from(document.querySelectorAll('.network-node'));

      if (this.nodes.length === 0) return;

      // Position nodes randomly without overlap
      this.positionNodesRandomly();

      // Generate connection lines
      this.generateConnections();

      // Start individual pulsing animations immediately
      this.startIndividualPulsing();

      // Start the transformation after a delay (but connections appear 3 seconds after page load)
      setTimeout(() => {
        this.startTransformation();
      }, 5000); // Increased to 5 seconds total (3 seconds for connections + 2 seconds buffer)
    }

    positionNodesRandomly() {
      const container = document.querySelector('.network-animation');
      const containerRect = container.getBoundingClientRect();
      const nodeSize = 29; // Updated for 20% larger nodes
      const margin = nodeSize + 10;
      const positions = [];

      this.nodes.forEach((node, index) => {
        let x, y, attempts = 0;
        let validPosition = false;

        // Try to find a non-overlapping position
        while (!validPosition && attempts < 50) {
          x = margin + Math.random() * (containerRect.width - 2 * margin);
          y = margin + Math.random() * (containerRect.height - 2 * margin);

          // Check for overlaps with existing positions
          validPosition = positions.every(pos => {
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
            return distance >= nodeSize * 2;
          });

          attempts++;
        }

        // If we couldn't find a non-overlapping position, use a grid fallback
        if (!validPosition) {
          const cols = 4;
          const row = Math.floor(index / cols);
          const col = index % cols;
          x = (containerRect.width / cols) * col + (containerRect.width / cols) / 2;
          y = (containerRect.height / 3) * row + (containerRect.height / 6);
        }

        positions.push({ x, y });
        node.style.left = `${x - nodeSize/2}px`;
        node.style.top = `${y - nodeSize/2}px`;
      });

      this.nodePositions = positions;
    }

    generateConnections() {
      // Clear existing connections
      this.connectionsSvg.innerHTML = '';
      this.connections = [];

      // Create connection lines between all nodes
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.classList.add('connection-line');
          line.setAttribute('data-from', i);
          line.setAttribute('data-to', j);
          this.connectionsSvg.appendChild(line);
          this.connections.push(line);
        }
      }

      this.updateConnectionPositions();
    }

    updateConnectionPositions() {
      this.connections.forEach(line => {
        const fromIndex = parseInt(line.getAttribute('data-from'));
        const toIndex = parseInt(line.getAttribute('data-to'));

        const fromPos = this.nodePositions[fromIndex];
        const toPos = this.nodePositions[toIndex];

        line.setAttribute('x1', fromPos.x);
        line.setAttribute('y1', fromPos.y);
        line.setAttribute('x2', toPos.x);
        line.setAttribute('y2', toPos.y);
      });
    }

    startAnimation() {
      // Animation starts automatically on page load
      console.log('Network transformation animation started');
    }

    startIndividualPulsing() {
      // Create unique pulsing animations for each node with different timing and intensity
      this.nodes.forEach((node, index) => {
        // Random duration between 1.25 and 1.8 seconds (2x faster)
        const duration = 1.25 + Math.random() * 0.55;

        // Random scale between 1.05 and 1.15
        const scale = 1.05 + Math.random() * 0.1;

        // Random delay to start out of sync (0 to 1 second, also faster)
        const delay = Math.random() * 1;

        // Create the pulsing animation
        gsap.to(node, {
          scale: scale,
          duration: duration / 2,
          ease: "power2.inOut",
          delay: delay,
          yoyo: true,
          repeat: -1,
          transformOrigin: "center center"
        });
      });
    }

    startTransformation() {
      if (this.isTransformed) return;

      // Phase 1: Gradually activate connections (weeks 1-4) - starts 3 seconds after page load
      setTimeout(() => {
        this.activateConnectionsGradually();
      }, 3000);

      // Phase 2: Move to coordinated positions (weeks 5-6)
      setTimeout(() => {
        this.moveToCoordinatedPositions();
      }, 7000);

      // Phase 3: Synchronized super organism (week 7)
      setTimeout(() => {
        this.activateSuperOrganism();
      }, 11000);
    }

    activateConnectionsGradually() {
      const shuffledConnections = [...this.connections].sort(() => Math.random() - 0.5);

      shuffledConnections.forEach((connection, index) => {
        setTimeout(() => {
          connection.classList.add('active');
        }, index * 200); // Increased from 100ms to 200ms (50% slower)
      });
    }

    moveToCoordinatedPositions() {
      const container = document.querySelector('.network-animation');
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const radius = Math.min(containerRect.width, containerRect.height) * 0.35;

      // Create a timeline for coordinated movement with sticky connections
      const tl = gsap.timeline();

      this.nodes.forEach((node, index) => {
        const angle = (index / this.nodes.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius;

        // Animate to new position with continuous connection updates
        tl.to(node, {
          left: `${targetX - 14.5}px`, // Half of 29px
          top: `${targetY - 14.5}px`,  // Half of 29px
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            // Update this node's position in our tracking array
            const currentLeft = parseFloat(node.style.left) + 14.5;
            const currentTop = parseFloat(node.style.top) + 14.5;
            this.nodePositions[index] = { x: currentLeft, y: currentTop };

            // Update all connection positions to keep them sticky
            this.updateConnectionPositions();
          },
          onComplete: () => {
            // Ensure final position is exactly where we want it
            this.nodePositions[index] = { x: targetX, y: targetY };
            this.updateConnectionPositions();
          }
        }, index * 0.1);
      });

      return tl;
    }

    activateSuperOrganism() {
      this.isTransformed = true;

      // Upgrade all connections to super organism state
      this.connections.forEach(connection => {
        connection.classList.remove('active');
        connection.classList.add('super-organism');
      });

      // Kill individual pulsing animations and start synchronized pulsing
      this.nodes.forEach(node => {
        // Kill existing GSAP animations on this node
        gsap.killTweensOf(node);

        // Reset scale to 1
        gsap.set(node, { scale: 1 });

        // Start synchronized pulsing with GSAP (2x faster)
        gsap.to(node, {
          scale: 1.15,
          duration: 0.5, // 2x faster
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "center center"
        });
      });

      console.log('Super organism state activated');
    }
  }

  // Initialize the animation when page loads
  new NetworkTransformation();
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