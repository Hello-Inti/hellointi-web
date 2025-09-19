import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    initNetworkAnimation();
    initPeerActivationAnimation();

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
      this.animationFrameId = null;
      this.updatePending = false;
      this.isAnimationPaused = false;
      this.isAnimationComplete = false;
      this.animationTimeouts = [];
      this.gsapAnimations = [];

      if (!this.connectionsSvg) return;

      this.init();
      this.setupViewportObserver();
      this.startAnimation();
    }

    setupViewportObserver() {
      // Create an intersection observer to detect when hero section is in viewport
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when at least 10% of the section is visible
      };

      this.viewportObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.isAnimationPaused) {
            // Resume animations when in viewport
            this.resumeAnimations();
          } else if (!entry.isIntersecting && !this.isAnimationPaused) {
            // Pause animations when out of viewport
            this.pauseAnimations();
          }
        });
      }, observerOptions);

      this.viewportObserver.observe(heroSection);
    }

    pauseAnimations() {
      this.isAnimationPaused = true;

      // Pause all GSAP animations on nodes
      this.nodes.forEach(node => {
        const tweens = gsap.getTweensOf(node);
        tweens.forEach(tween => tween.pause());
      });

      // Clear any pending animation frames
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Clear all timeouts
      this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.animationTimeouts = [];
    }

    resumeAnimations() {
      this.isAnimationPaused = false;

      // Resume all GSAP animations on nodes
      this.nodes.forEach(node => {
        const tweens = gsap.getTweensOf(node);
        tweens.forEach(tween => tween.resume());
      });

      // Resume any pending connection updates
      if (this.updatePending) {
        this.batchUpdateConnectionPositions();
      }
    }

    init() {
      // Get all node elements
      this.nodes = Array.from(document.querySelectorAll('.network-node'));

      if (this.nodes.length === 0) return;

      // Position nodes using efficient grid-based approach with randomization
      this.positionNodesEfficiently();

      // Generate selective connections (not all pairs)
      this.generateSelectiveConnections();

      // Start individual pulsing animations immediately
      this.startIndividualPulsing();

      // Start the transformation after a delay (but connections appear 3 seconds after page load)
      setTimeout(() => {
        this.startTransformation();
      }, 2000); // Reduced to 2 seconds total (3 seconds for connections - 1 second buffer)
    }

    positionNodesEfficiently() {
      const container = document.querySelector('.network-animation');
      const containerRect = container.getBoundingClientRect();
      const nodeSize = 29; // Updated for 20% larger nodes
      const margin = nodeSize + 15;
      const positions = [];

      // Calculate optimal grid dimensions
      const nodeCount = this.nodes.length;
      const cols = Math.ceil(Math.sqrt(nodeCount * 1.5)); // Slightly wider grid
      const rows = Math.ceil(nodeCount / cols);

      // Calculate cell dimensions
      const cellWidth = (containerRect.width - 2 * margin) / cols;
      const cellHeight = (containerRect.height - 2 * margin) / rows;

      this.nodes.forEach((node, index) => {
        // Calculate base grid position
        const row = Math.floor(index / cols);
        const col = index % cols;

        // Add randomization within cell boundaries to avoid rigid grid look
        const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.6;
        const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.6;

        const x = margin + (col + 0.5) * cellWidth + randomOffsetX;
        const y = margin + (row + 0.5) * cellHeight + randomOffsetY;

        // Ensure position stays within container bounds
        const finalX = Math.max(margin, Math.min(containerRect.width - margin, x));
        const finalY = Math.max(margin, Math.min(containerRect.height - margin, y));

        positions.push({ x: finalX, y: finalY });
        node.style.left = `${finalX - nodeSize/2}px`;
        node.style.top = `${finalY - nodeSize/2}px`;
      });

      this.nodePositions = positions;
    }

    generateSelectiveConnections() {
      // Clear existing connections
      this.connectionsSvg.innerHTML = '';
      this.connections = [];

      // Create ALL pairwise connections for full network effect (n*(n-1)/2)
      // This maintains the visual impact while using optimized update methods
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

      // Use batched updates for better performance even with all connections
      this.batchUpdateConnectionPositions();
    }

    batchUpdateConnectionPositions() {
      // Use requestAnimationFrame for smooth updates
      if (!this.updatePending && !this.isAnimationPaused && !this.isAnimationComplete) {
        this.updatePending = true;
        this.animationFrameId = requestAnimationFrame(() => {
          if (!this.isAnimationPaused && !this.isAnimationComplete) {
            this.updateConnectionPositions();
          }
          this.updatePending = false;
        });
      }
    }

    updateConnectionPositions() {
      // Update all connections in a single batch
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
      // Removed console.log for production
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
      const timeout1 = setTimeout(() => {
        if (!this.isAnimationPaused) {
          this.activateConnectionsGradually();
        }
      }, 3000);
      this.animationTimeouts.push(timeout1);

      // Phase 2: Move to coordinated positions (weeks 5-6)
      const timeout2 = setTimeout(() => {
        if (!this.isAnimationPaused) {
          this.moveToCoordinatedPositions();
        }
      }, 7000);
      this.animationTimeouts.push(timeout2);

      // Phase 3: Synchronized super organism (week 7)
      const timeout3 = setTimeout(() => {
        if (!this.isAnimationPaused) {
          this.activateSuperOrganism();
        }
      }, 11000);
      this.animationTimeouts.push(timeout3);
    }

    activateConnectionsGradually() {
      const shuffledConnections = [...this.connections].sort(() => Math.random() - 0.5);

      shuffledConnections.forEach((connection, index) => {
        const timeout = setTimeout(() => {
          if (!this.isAnimationPaused) {
            connection.classList.add('active');
          }
        }, index * 200); // Increased from 100ms to 200ms (50% slower)
        this.animationTimeouts.push(timeout);
      });
    }

    moveToCoordinatedPositions() {
      const container = document.querySelector('.network-animation');
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const radius = Math.min(containerRect.width, containerRect.height) * 0.35;

      // Create a timeline for coordinated movement with optimized updates
      const tl = gsap.timeline();

      // Track update frequency to avoid excessive updates
      let lastUpdateTime = 0;
      const updateThrottle = 50; // Update at most every 50ms (20fps for connections)

      this.nodes.forEach((node, index) => {
        const angle = (index / this.nodes.length) * Math.PI * 2;
        const targetX = centerX + Math.cos(angle) * radius;
        const targetY = centerY + Math.sin(angle) * radius;

        // Animate to new position with throttled connection updates
        tl.to(node, {
          left: `${targetX - 14.5}px`, // Half of 29px
          top: `${targetY - 14.5}px`,  // Half of 29px
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            const now = Date.now();

            // Update this node's position in our tracking array
            const currentLeft = parseFloat(node.style.left) + 14.5;
            const currentTop = parseFloat(node.style.top) + 14.5;
            this.nodePositions[index] = { x: currentLeft, y: currentTop };

            // Throttle connection updates to improve performance
            if (now - lastUpdateTime > updateThrottle) {
              this.batchUpdateConnectionPositions();
              lastUpdateTime = now;
            }
          },
          onComplete: () => {
            // Ensure final position is exactly where we want it
            this.nodePositions[index] = { x: targetX, y: targetY };
            // Final update to ensure connections are in correct position
            this.batchUpdateConnectionPositions();
          }
        }, index * 0.1);
      });

      return tl;
    }

    // Clean up animation frames and observers when needed
    destroy() {
      // Pause all animations first
      this.pauseAnimations();

      // Disconnect viewport observer
      if (this.viewportObserver) {
        this.viewportObserver.disconnect();
      }

      // Kill all GSAP animations on nodes
      this.nodes.forEach(node => {
        gsap.killTweensOf(node);
      });

      // Clear all timeouts
      this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.animationTimeouts = [];
    }

    activateSuperOrganism() {
      this.isTransformed = true;

      // Gradually upgrade connections to super organism state one by one
      const shuffledConnections = [...this.connections].sort(() => Math.random() - 0.5);

      shuffledConnections.forEach((connection, index) => {
        const timeout = setTimeout(() => {
          if (!this.isAnimationPaused) {
            connection.classList.remove('active');
            connection.classList.add('super-organism');
          }
        }, index * 150); // 150ms delay between each connection upgrade
        this.animationTimeouts.push(timeout);
      });

      // Start synchronized pulsing after all connections are upgraded
      const totalUpgradeTime = shuffledConnections.length * 150;
      const finalTimeout = setTimeout(() => {
        if (!this.isAnimationPaused) {
          // Kill individual pulsing animations and start synchronized pulsing
          this.nodes.forEach(node => {
            // Kill existing GSAP animations on this node
            gsap.killTweensOf(node);

            // Reset scale to 1
            gsap.set(node, { scale: 1 });

            // Start synchronized pulsing with GSAP - limited duration
            gsap.to(node, {
              scale: 1.15,
              duration: 0.5,
              ease: "power2.inOut",
              yoyo: true,
              repeat: 5, // Only pulse 3 times (5 repeats = 3 full cycles)
              transformOrigin: "center center",
              onComplete: () => {
                // Return to normal scale when pulsing completes
                gsap.to(node, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                  onComplete: () => {
                    // Kill all tweens on this node to prevent any lingering animations
                    gsap.killTweensOf(node);
                  }
                });
              }
            });
          });

          // Mark animation as fully complete after pulsing ends
          const pulsingDuration = (0.5 * 2) * 6; // 6 seconds total (3 full pulse cycles)
          const completionTimeout = setTimeout(() => {
            this.isAnimationComplete = true;

            // Kill ALL GSAP animations on all nodes to prevent any lingering updates
            this.nodes.forEach(node => {
              gsap.killTweensOf(node);
            });

            // Stop any remaining connection position updates
            if (this.animationFrameId) {
              cancelAnimationFrame(this.animationFrameId);
              this.animationFrameId = null;
            }

            // Clear the updatePending flag
            this.updatePending = false;
          }, pulsingDuration * 1000);
          this.animationTimeouts.push(completionTimeout);
        }
      }, totalUpgradeTime + 200); // Small buffer after all connections are upgraded
      this.animationTimeouts.push(finalTimeout);
    }
  }

  // Initialize the animation when page loads
  try {
    new NetworkTransformation();
  } catch (error) {
    console.error('Error initializing network animation:', error);
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

// Initialization complete

// Peer Activation Before/After GSAP animation
function initPeerActivationAnimation() {
  try {
    gsap.registerPlugin(ScrollTrigger);
    const container = document.getElementById('peerActivation');
    const svg = document.getElementById('peerActivationSvg');
    if (!container || !svg || typeof gsap === 'undefined') return;

    const nodesGroup = svg.querySelector('#nodes');
    const linksGroup = svg.querySelector('#links');
    const beforeLabel = container.querySelector('.label-before');
    const afterLabel = container.querySelector('.label-after');

    // Work in viewBox coordinates for crisp rendering
    const width = 600;
    const height = 320;
    const nodeCount = 12;
    const radius = 7;

    const brandColors = [
      getComputedStyle(document.documentElement).getPropertyValue('--color-poppy').trim() || '#E65C4F',
      getComputedStyle(document.documentElement).getPropertyValue('--color-sunbeam').trim() || '#F2B705',
      getComputedStyle(document.documentElement).getPropertyValue('--color-peach').trim() || '#F2A08D',
      getComputedStyle(document.documentElement).getPropertyValue('--color-avocado').trim() || '#A6A61B',
      getComputedStyle(document.documentElement).getPropertyValue('--color-lavender').trim() || '#D4C1EC'
    ];

    // Build node elements - start in greyscale
    const nodes = [];
    const greyColors = ['#666666', '#777777', '#888888', '#999999', '#aaaaaa']; // Greyscale colors

    for (let i = 0; i < nodeCount; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', radius);
      c.setAttribute('cx', 0);
      c.setAttribute('cy', 0);
      c.setAttribute('fill', greyColors[i % greyColors.length]); // Start greyscale
      c.setAttribute('opacity', '0');
      c.style.filter = 'drop-shadow(0 1px 2px rgba(64,63,62,0.25))';
      nodesGroup.appendChild(c);
      nodes.push(c);
    }

    // Connection pairs: ring + cross-links for a lively network
    const linkPairs = [];
    for (let i = 0; i < nodeCount; i++) {
      linkPairs.push([i, (i + 1) % nodeCount]); // ring
    }
    for (let i = 0; i < nodeCount / 2; i++) {
      linkPairs.push([i, (i + nodeCount / 2) % nodeCount]); // diameters
    }

    const links = linkPairs.map(([a, b]) => {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', '0');
      l.setAttribute('y1', '0');
      l.setAttribute('x2', '0');
      l.setAttribute('y2', '0');
      l.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--color-avocado').trim() || '#A6A61B');
      l.setAttribute('stroke-width', '2');
      l.setAttribute('opacity', '0');
      l.setAttribute('vector-effect', 'non-scaling-stroke');
      linksGroup.appendChild(l);
      return { el: l, a, b };
    });

    const pad = 28;

    function randomScatter() {
      // Scatter on the left side to reinforce "Before"
      const usableW = width * 0.44;
      return nodes.map(() => ({
        x: pad + Math.random() * Math.max(usableW - pad * 2, 40),
        y: pad + Math.random() * Math.max(height - pad * 2, 40)
      }));
    }

    function circlePositions() {
      // Circle on the right side to reinforce "After"
      const cx = width * 0.74;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.28;
      return nodes.map((_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2;
        return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
      });
    }

    function updateLinkPositions(posSet) {
      links.forEach(({ el, a, b }) => {
        el.setAttribute('x1', posSet[a].x);
        el.setAttribute('y1', posSet[a].y);
        el.setAttribute('x2', posSet[b].x);
        el.setAttribute('y2', posSet[b].y);
      });
    }

    let scatter = randomScatter();
    let cluster = circlePositions();

    // Initialize to scattered positions
    nodes.forEach((n, i) => {
      n.setAttribute('cx', scatter[i].x);
      n.setAttribute('cy', scatter[i].y);
    });
    updateLinkPositions(scatter);

    // Label states
    gsap.set(beforeLabel, { opacity: 1 });
    gsap.set(afterLabel, { opacity: 0.35 });

    // Timeline: Before -> Transition -> After (no reset)
    const tl = gsap.timeline({ paused: true });

    // Sequence #1: Before (fragmented) - reveal scattered nodes
    tl.to(nodes, {
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power2.out',
      onStart: () => {
        gsap.to(beforeLabel, { opacity: 1, duration: 0.4, ease: 'power1.out' });
        gsap.to(afterLabel, { opacity: 0.35, duration: 0.4, ease: 'power1.out' });
        links.forEach(({ el }) => {
          gsap.set(el, { opacity: 0, strokeDasharray: 0, strokeDashoffset: 0 });
        });
      }
    });

    // Brief hold
    tl.to({}, { duration: 0.5 });

    // Sequence #2: Transition nodes to a connected cluster (circle)
    tl.to(nodes, {
      duration: 1.5,
      ease: 'power2.inOut',
      stagger: { each: 0.035, from: 'random' },
      // animate circle center positions using attr plugin
      attr: (i) => ({ cx: cluster[i].x, cy: cluster[i].y }),
      onStart: () => {
        gsap.to(beforeLabel, { opacity: 0.35, duration: 0.6, ease: 'power1.out' });
        gsap.to(afterLabel, { opacity: 1, duration: 0.6, ease: 'power1.out' });
      },
      onUpdate: () => {
        const current = nodes.map(n => ({
          x: parseFloat(n.getAttribute('cx')),
          y: parseFloat(n.getAttribute('cy'))
        }));
        updateLinkPositions(current);
      }
    })
    // Add color transition during the movement
    .to(nodes, {
      duration: 1.5,
      ease: 'power2.inOut',
      stagger: { each: 0.035, from: 'random' },
      attr: (i) => ({ fill: brandColors[i % brandColors.length] }),
    }, '<'); // Start at the same time as the movement animation

    // Sequence #3: Draw links between nodes
    tl.add(() => {
      // Prepare dash for draw animation
      links.forEach(({ el }) => {
        const x1 = parseFloat(el.getAttribute('x1'));
        const y1 = parseFloat(el.getAttribute('y1'));
        const x2 = parseFloat(el.getAttribute('x2'));
        const y2 = parseFloat(el.getAttribute('y2'));
        const len = Math.hypot(x2 - x1, y2 - y1);
        el.setAttribute('stroke-dasharray', `${len}`);
        el.setAttribute('stroke-dashoffset', `${len}`);
      });
    });
    tl.to(links.map(l => l.el), {
      opacity: 1,
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power2.out',
      stagger: 0.015
    });

    // Respect reduced motion: render static "after" frame with links and final colors
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReduced.matches) {
      tl.kill();
      nodes.forEach((n, i) => {
        n.setAttribute('cx', cluster[i].x);
        n.setAttribute('cy', cluster[i].y);
        n.setAttribute('fill', brandColors[i % brandColors.length]); // Set final colors
        n.setAttribute('opacity', '1');
      });
      updateLinkPositions(cluster);
      links.forEach(({ el }) => {
        el.setAttribute('opacity', '1');
        el.removeAttribute('stroke-dasharray');
        el.removeAttribute('stroke-dashoffset');
      });
      gsap.set(beforeLabel, { opacity: 0.35 });
      gsap.set(afterLabel, { opacity: 1 });
    } else {
      // Set up ScrollTrigger to play animation when section is fully visible
      ScrollTrigger.create({
        trigger: container,
        start: "top center",
        onEnter: () => {
          setTimeout(() => {
            tl.play();
          }, 500);
        },
        once: true
      });
    }
  } catch (error) {
    console.error('Error initializing peer activation animation:', error);
  }
}