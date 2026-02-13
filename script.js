'use strict';

/**
 * Portfolio Website JavaScript
 * Author: Supriya Dwivedi
 * Enhanced with performance optimizations and error handling
 */

// ============================================================================
// PRELOADER
// ============================================================================
const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            preloader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
            
            // Remove from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500); // Small delay to ensure everything is loaded
    });
};

// ============================================================================
// TEXT ROTATION ANIMATION
// ============================================================================
const initWordRotation = () => {
    const words = document.querySelectorAll('.word');
    
    if (words.length === 0) {
        console.warn('No words found for rotation animation');
        return;
    }
    
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

const setupWordRotation = () => {
    const words = document.querySelectorAll('.word');
    
    if (words.length === 0) {
        console.warn('No words available for rotation setup');
        return;
    }
    
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
    setInterval(changeText, 3000);
};

// ============================================================================
// CIRCULAR SKILLS ANIMATION
// ============================================================================
const initCircleSkills = () => {
    const circles = document.querySelectorAll('.circle');
    
    if (circles.length === 0) {
        console.warn('No circle elements found for skills animation');
        return;
    }
    
    circles.forEach((elem) => {
        const dots = parseInt(elem.getAttribute('data-dots')) || 80;
        const markedPercent = parseInt(elem.getAttribute('data-percent')) || 0;
        const percent = Math.floor(dots * markedPercent / 100);
        const rotate = 360 / dots;
        
        let points = '';
        
        // Create all dot points
        for (let i = 0; i < dots; i++) {
            points += `<div class="points" style="--i:${i}; --rot:${rotate}deg"></div>`;
        }
        
        elem.innerHTML = points;
        
        // Set CSS variable for conic gradient
        elem.style.setProperty('--percent', markedPercent);
        
        // Mark the calculated percentage of points with delay for animation
        const pointsMarked = elem.querySelectorAll('.points');
        for (let i = 0; i < percent; i++) {
            setTimeout(() => {
                if (pointsMarked[i]) {
                    pointsMarked[i].classList.add('marked');
                }
            }, i * 20); // Staggered animation
        }
    });
};

// ============================================================================
// PORTFOLIO FILTERING (MixItUp)
// ============================================================================
const initPortfolioFilter = () => {
    const portfolioGallery = document.querySelector('.portfolio-gallery');
    
    if (!portfolioGallery) {
        console.warn('Portfolio gallery not found');
        return;
    }
    
    if (typeof mixitup !== 'function') {
        console.error('MixItUp library not loaded');
        return;
    }
    
    try {
        mixitup(portfolioGallery, {
            animation: {
                duration: 500,
                nudge: true,
                reverseOut: false,
                effects: 'fade translateZ(-100px)'
            },
            selectors: {
                target: '.port-box'
            },
            load: {
                filter: 'all'
            }
        });
    } catch (error) {
        console.error('Error initializing MixItUp:', error);
    }
};

// ============================================================================
// NAVIGATION & MENU
// ============================================================================
const updateActiveMenu = () => {
    const menuLinks = document.querySelectorAll('header ul li a');
    const sections = document.querySelectorAll('section');
    
    if (sections.length === 0) return;
    
    let len = sections.length;
    const scrollOffset = 150; // Increased offset for better section detection
    
    // Find current section
    while (--len && window.scrollY + scrollOffset < sections[len].offsetTop) {}
    
    // Update active class
    menuLinks.forEach((link) => link.classList.remove('active'));
    
    if (menuLinks[len]) {
        menuLinks[len].classList.add('active');
    }
};

const handleStickyHeader = () => {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    const scrollThreshold = 50;
    
    if (window.scrollY > scrollThreshold) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};

const setupMobileMenu = () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navlist = document.querySelector('.navlist');
    
    if (!menuIcon || !navlist) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu on icon click
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        menuIcon.classList.toggle('bx-x');
        navlist.classList.toggle('open');
        
        // Update ARIA attribute for accessibility
        const isExpanded = navlist.classList.contains('open');
        menuIcon.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // Close menu when clicking on nav links
    const navLinks = navlist.querySelectorAll('a');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navlist.classList.remove('open');
            menuIcon.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navlist.contains(e.target) && !menuIcon.contains(e.target)) {
            if (navlist.classList.contains('open')) {
                menuIcon.classList.remove('bx-x');
                navlist.classList.remove('open');
                menuIcon.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
};

const closeMobileMenuOnScroll = () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navlist = document.querySelector('.navlist');
    
    if (menuIcon && navlist && navlist.classList.contains('open')) {
        menuIcon.classList.remove('bx-x');
        navlist.classList.remove('open');
        menuIcon.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================
const setupScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-items');
                
                // Trigger circle animations when skills section is visible
                if (entry.target.classList.contains('skills') || 
                    entry.target.closest('.skills')) {
                    const circles = entry.target.querySelectorAll('.circle');
                    if (circles.length > 0 && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        setTimeout(() => initCircleSkills(), 200);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = [
        ...document.querySelectorAll('.scroll-scale'),
        ...document.querySelectorAll('.scroll-bottom'),
        ...document.querySelectorAll('.scroll-top'),
        ...document.querySelectorAll('.skills')
    ];
    
    animatedElements.forEach((element) => observer.observe(element));
};

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================
const setupSmoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '#home') {
                e.preventDefault();
                
                if (href === '#home') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

/**
 * Debounces function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// ============================================================================
// SCROLL EVENT HANDLERS
// ============================================================================
const setupScrollListeners = () => {
    const throttledScrollHandler = throttle(() => {
        updateActiveMenu();
        handleStickyHeader();
        closeMobileMenuOnScroll();
    }, 100);
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
};

// ============================================================================
// FORM HANDLING
// ============================================================================
const setupFormValidation = () => {
    const form = document.querySelector('.contact form');
    
    if (!form) {
        console.warn('Contact form not found');
        return;
    }
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach((input) => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4444';
            } else {
                input.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = '';
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach((input) => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff4444';
            }
        });
        
        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                isValid = false;
                emailInput.style.borderColor = '#ff4444';
                alert('Please enter a valid email address.');
                e.preventDefault();
                return;
            }
        }
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields correctly.');
        } else {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Re-enable after a delay (FormSpree handles the actual submission)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        }
    });
};

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================
const optimizeImages = () => {
    const images = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach((img) => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }
};

// ============================================================================
// ERROR HANDLING
// ============================================================================
const setupErrorHandling = () => {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
};

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================
const setupAccessibility = () => {
    // Keyboard navigation for mobile menu
    const menuIcon = document.querySelector('#menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuIcon.click();
            }
        });
    }
    
    // Focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navlist = document.querySelector('.navlist');
            const menuIcon = document.querySelector('#menu-icon');
            
            if (navlist && navlist.classList.contains('open')) {
                menuIcon.classList.remove('bx-x');
                navlist.classList.remove('open');
                menuIcon.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });
};

// ============================================================================
// SKILL BARS ANIMATION
// ============================================================================
const animateSkillBars = () => {
    const skillSection = document.querySelector('.skills');
    
    if (!skillSection) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                // Trigger skill bar animations
                const skillBars = entry.target.querySelectorAll('.skill-bar .bar span');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.animationPlayState = 'running';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    observer.observe(skillSection);
};

// ============================================================================
// INITIALIZATION
// ============================================================================
const init = () => {
    try {
        console.log('🚀 Initializing portfolio...');
        
        // Preloader (must be first)
        initPreloader();
        
        // Core functionality
        initWordRotation();
        setupWordRotation();
        
        // Skills animations
        animateSkillBars();
        // Note: Circle skills will be initialized when section becomes visible
        
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
        
        // Performance
        optimizeImages();
        
        // Accessibility
        setupAccessibility();
        
        // Error handling
        setupErrorHandling();
        
        console.log('✅ Portfolio initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
};

// ============================================================================
// DOM READY
// ============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================================
// EXPORTS (for module usage)
// ============================================================================
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
        setupSmoothScroll,
        setupFormValidation,
        throttle,
        debounce
    };
}