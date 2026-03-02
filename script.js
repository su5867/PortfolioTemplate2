'use strict';

/**
 * Portfolio Website JavaScript
 * Author: Supriya Dwivedi
 * Enhanced with optimized animations and performance improvements
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const throttle = (func, limit = 50) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

const debounce = (func, delay = 150) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

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
            setTimeout(() => preloader.remove(), 300);
        }, 300);
    });
};

// ============================================================================
// TEXT ROTATION ANIMATION (Optimized)
// ============================================================================

const initWordRotation = () => {
    const words = document.querySelectorAll('.word');
    if (words.length === 0) return;
    
    let currentIndex = 0;
    
    // Initialize first word
    words[0].classList.add('active');
    
    const rotateWords = () => {
        // Remove active class from current word
        words[currentIndex].classList.remove('active');
        
        // Move to next word
        currentIndex = (currentIndex + 1) % words.length;
        
        // Add active class to new word
        words[currentIndex].classList.add('active');
    };
    
    // Rotate every 2.5 seconds
    setInterval(rotateWords, 2500);
};

// ============================================================================
// CIRCLE SKILLS ANIMATION (Optimized)
// ============================================================================

const initCircleSkills = () => {
    const circles = document.querySelectorAll('.circle');
    if (circles.length === 0) return;
    
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
        elem.style.setProperty('--percent', markedPercent);
        
        // Mark points with a small delay for visual effect
        const pointsMarked = elem.querySelectorAll('.points');
        requestAnimationFrame(() => {
            for (let i = 0; i < percent; i++) {
                setTimeout(() => {
                    if (pointsMarked[i]) {
                        pointsMarked[i].classList.add('marked');
                    }
                }, i * 10); // Faster staggered animation
            }
        });
    });
};

// ============================================================================
// PROJECTS FILTERING (MixItUp)
// ============================================================================

const initProjectsFilter = () => {
    const projectsGallery = document.querySelector('.projects-gallery');
    if (!projectsGallery || typeof mixitup !== 'function') return;
    
    try {
        mixitup(projectsGallery, {
            animation: {
                duration: 300,
                effects: 'fade translateZ(-100px)',
                nudge: false
            },
            selectors: { target: '.project-box' },
            load: { filter: 'all' }
        });
    } catch (error) {
        console.error('Error initializing MixItUp:', error);
    }
};

// ============================================================================
// NAVIGATION & MENU
// ============================================================================

let currentSection = 'home';

const updateActiveMenu = throttle(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header ul li a');
    if (sections.length === 0) return;
    
    let scrollPosition = window.scrollY + 100;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (currentSection !== section.id) {
                currentSection = section.id;
                
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`header ul li a[href="#${section.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        }
    });
}, 50);

const handleStickyHeader = throttle(() => {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
}, 50);

const setupMobileMenu = () => {
    const menuIcon = document.querySelector('#menu-icon');
    const navlist = document.querySelector('.navlist');
    if (!menuIcon || !navlist) return;
    
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navlist.classList.toggle('open');
        menuIcon.classList.toggle('bx-x', isOpen);
        menuIcon.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    // Close menu on link click
    navlist.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navlist.classList.remove('open');
            menuIcon.classList.remove('bx-x');
            menuIcon.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!navlist.contains(e.target) && !menuIcon.contains(e.target) && navlist.classList.contains('open')) {
            navlist.classList.remove('open');
            menuIcon.classList.remove('bx-x');
            menuIcon.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
};

// ============================================================================
// SCROLL ANIMATIONS (Optimized with Intersection Observer)
// ============================================================================

const setupScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-items');
                
                // Trigger circle skills animation when skills section becomes visible
                if (entry.target.classList.contains('skills')) {
                    initCircleSkills();
                    
                    // Trigger skill bar animations
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.scroll-scale, .scroll-bottom, .scroll-top, .skills').forEach(el => {
        observer.observe(el);
    });
};

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================

const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetElement = document.getElementById(href.substring(1));
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ============================================================================
// FORM HANDLING
// ============================================================================

const setupFormValidation = () => {
    const form = document.querySelector('.contact form');
    if (!form) return;
    
    // Real-time validation
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.classList.add('error');
                input.classList.remove('valid');
            } else {
                input.classList.remove('error');
                input.classList.add('valid');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('error');
                input.classList.add('valid');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            }
        });
        
        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                isValid = false;
                emailInput.classList.add('error');
                alert('Please enter a valid email address.');
                e.preventDefault();
                return;
            }
        }
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all required fields correctly.');
        } else {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            }
        }
    });
};

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

const optimizeImages = () => {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
    }
};

const setupScrollListeners = () => {
    const scrollHandler = throttle(() => {
        updateActiveMenu();
        handleStickyHeader();
    }, 50);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

const init = () => {
    console.log('Initializing portfolio...');
    
    initPreloader();
    initWordRotation();
    initProjectsFilter();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
    setupFormValidation();
    optimizeImages();
    setupScrollListeners();
    
    // Initial updates
    updateActiveMenu();
    handleStickyHeader();
    
    console.log('Portfolio initialized successfully!');
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}