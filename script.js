/**
 * Portfolio Website JavaScript
 * Author: Supriya Dwivedi
 * Description: Main JavaScript file for portfolio website functionality
 */

'use strict';

/* ==========================================================================
   WORD ROTATION ANIMATION
   ========================================================================== */

/**
 * Splits text content into individual letter spans for animation
 */
const initWordRotation = () => {
    const words = document.querySelectorAll('.word');
    
    words.forEach((word) => {
        const letters = word.textContent.split('');
        word.textContent = '';
        
        letters.forEach((letter) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.className = 'letter';
            word.appendChild(span);
        });
    });
};

/**
 * Handles the rotation animation between words
 */
const setupWordRotation = () => {
    const words = document.querySelectorAll('.word');
    
    if (words.length === 0) return;
    
    let currentWordIndex = 0;
    const maxWordIndex = words.length - 1;
    
    // Show first word
    words[currentWordIndex].style.opacity = '1';
    
    const changeText = () => {
        const currentWord = words[currentWordIndex];
        const nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
        
        // Animate out current word
        Array.from(currentWord.children).forEach((letter, i) => {
            setTimeout(() => {
                letter.className = 'letter out';
            }, i * 80);
        });
        
        // Animate in next word
        nextWord.style.opacity = '1';
        Array.from(nextWord.children).forEach((letter, i) => {
            letter.className = 'letter behind';
            setTimeout(() => {
                letter.className = 'letter in';
            }, 340 + i * 80);
        });
        
        // Update index
        currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
    };
    
    // Start animation
    changeText();
    setInterval(changeText, 3000); // Changed from 1000ms to 3000ms for better readability
};

/* ==========================================================================
   CIRCULAR SKILL INDICATORS
   ========================================================================== */

/**
 * Creates circular skill progress indicators
 */
const initCircleSkills = () => {
    const circles = document.querySelectorAll('.circle');
    
    circles.forEach((elem) => {
        const dots = parseInt(elem.getAttribute('data-dots')) || 80;
        const markedPercent = parseInt(elem.getAttribute('data-percent')) || 0;
        const percent = Math.floor(dots * markedPercent / 100);
        const rotate = 360 / dots;
        
        let points = '';
        
        for (let i = 0; i < dots; i++) {
            points += `<div class="points" style="--i:${i}; --rot:${rotate}deg"></div>`;
        }
        
        elem.innerHTML = points;
        
        // Mark the calculated percentage of points
        const pointsMarked = elem.querySelectorAll('.points');
        for (let i = 0; i < percent; i++) {
            pointsMarked[i].classList.add('marked');
        }
    });
};

/* ==========================================================================
   PORTFOLIO FILTERING (MIXITUP)
   ========================================================================== */

/**
 * Initializes MixItUp portfolio filtering
 */
const initPortfolioFilter = () => {
    const portfolioGallery = document.querySelector('.portfolio-gallery');
    
    if (portfolioGallery && typeof mixitup === 'function') {
        mixitup(portfolioGallery, {
            animation: {
                duration: 500,
                nudge: true,
                reverseOut: false,
                effects: 'fade translateZ(-100px)'
            }
        });
    }
};

/* ==========================================================================
   ACTIVE MENU HIGHLIGHTING
   ========================================================================== */

/**
 * Updates active menu item based on scroll position
 */
const updateActiveMenu = () => {
    const menuLinks = document.querySelectorAll('header ul li a');
    const sections = document.querySelectorAll('section');
    
    if (sections.length === 0) return;
    
    let len = sections.length;
    const scrollOffset = 97; // Offset for fixed header
    
    // Find current section
    while (--len && window.scrollY + scrollOffset < sections[len].offsetTop) {}
    
    // Update active class
    menuLinks.forEach((link) => link.classList.remove('active'));
    
    if (menuLinks[len]) {
        menuLinks[len].classList.add('active');
    }
};

/* ==========================================================================
   STICKY HEADER
   ========================================================================== */

/**
 * Toggles sticky class on header based on scroll position
 */
const handleStickyHeader = () => {
    const header = document.querySelector('header');
    
    if (header) {
        const scrollThreshold = 50;
        header.classList.toggle('sticky', window.scrollY > scrollThreshold);
    }
};

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */

/**
 * Handles mobile menu open/close functionality
 */
const setupMobileMenu = () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navlist = document.querySelector('.navlist');
    
    if (!menuIcon || !navlist) return;
    
    // Toggle menu on icon click
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('bx-x');
        navlist.classList.toggle('open');
        
        // Update ARIA attribute
        const isExpanded = navlist.classList.contains('open');
        menuIcon.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking on nav links
    const navLinks = navlist.querySelectorAll('a');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navlist.classList.remove('open');
            menuIcon.setAttribute('aria-expanded', 'false');
        });
    });
};

/**
 * Closes mobile menu on scroll
 */
const closeMobileMenuOnScroll = () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navlist = document.querySelector('.navlist');
    
    if (menuIcon && navlist) {
        menuIcon.classList.remove('bx-x');
        navlist.classList.remove('open');
        menuIcon.setAttribute('aria-expanded', 'false');
    }
};

/* ==========================================================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */

/**
 * Creates and configures Intersection Observer for scroll animations
 */
const setupScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-items');
            } else {
                entry.target.classList.remove('show-items');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = [
        ...document.querySelectorAll('.scroll-scale'),
        ...document.querySelectorAll('.scroll-bottom'),
        ...document.querySelectorAll('.scroll-top')
    ];
    
    animatedElements.forEach((element) => observer.observe(element));
};

/* ==========================================================================
   SMOOTH SCROLL FOR NAVIGATION LINKS
   ========================================================================== */

/**
 * Adds smooth scrolling behavior to navigation links
 */
const setupSmoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

/* ==========================================================================
   PERFORMANCE OPTIMIZATION - THROTTLE FUNCTION
   ========================================================================== */

/**
 * Throttles function execution for better performance
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
const throttle = (func, delay = 100) => {
    let lastCall = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
};

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

/**
 * Sets up all scroll event listeners with throttling
 */
const setupScrollListeners = () => {
    const throttledScrollHandler = throttle(() => {
        updateActiveMenu();
        handleStickyHeader();
        closeMobileMenuOnScroll();
    }, 100);
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
};

/* ==========================================================================
   FORM VALIDATION
   ========================================================================== */

/**
 * Adds form validation to contact form
 */
const setupFormValidation = () => {
    const form = document.querySelector('.contact form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach((input) => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
    
    // Reset border color on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });
};

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

/**
 * Main initialization function
 * Runs when DOM is fully loaded
 */
const init = () => {
    // Text animations
    initWordRotation();
    setupWordRotation();
    
    // Skills
    initCircleSkills();
    
    // Portfolio filtering
    initPortfolioFilter();
    
    // Navigation
    setupMobileMenu();
    setupSmoothScroll();
    updateActiveMenu();
    
    // Scroll effects
    handleStickyHeader();
    setupScrollAnimations();
    setupScrollListeners();
    
    // Form
    setupFormValidation();
    
    console.log('Portfolio initialized successfully! 🚀');
};

/* ==========================================================================
   LOAD EVENT
   ========================================================================== */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ==========================================================================
   EXPORTS (for potential module usage)
   ========================================================================== */

// Export functions for potential reuse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWordRotation,
        setupWordRotation,
        initCircleSkills,
        initPortfolioFilter,
        updateActiveMenu,
        handleStickyHeader,
        setupMobileMenu,
        setupScrollAnimations,
        throttle
    };
}