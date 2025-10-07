
// ============================================
// 1. INITIALISATION
// ============================================
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Portfolio initialised');
        
        // Core functionality
        this.setupLoadingScreen();
        this.setupNavigation();
        this.setupPageTransitions();
        this.setupScrollAnimations();
        this.setupMobileMenu();
        
        // Enhanced features
        this.setupSmoothScroll();
        this.setupBackToTop();
        this.setupKeyboardNavigation();
        
        console.log('✅ All systems ready');
    }

    // ============================================
    // 2. LOADING SCREEN
    // ============================================
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            const loading = document.getElementById('loadingScreen');
            if (!loading) return;

            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.remove();
                }, 400);
            }, 500);
        });
    }

    // ============================================
    // 3. NAVIGATION
    // ============================================
    setupNavigation() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        let lastScroll = 0;
        let ticking = false;

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            // Add scrolled class
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });

        // Highlight active nav link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================
    // 4. PAGE TRANSITIONS (Smooth fade effect)
    // ============================================
    setupPageTransitions() {
        const links = document.querySelectorAll('a[href^="/"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Don't intercept:
                // - External links
                // - Links with target="_blank"
                // - Current page
                // - Hash links
                if (
                    link.target === '_blank' ||
                    href === window.location.pathname ||
                    href.startsWith('#') ||
                    href.startsWith('mailto:') ||
                    link.closest('.no-transition')
                ) {
                    return;
                }

                e.preventDefault();

                // Fade out current page
                const pageContent = document.getElementById('pageContent');
                if (pageContent) {
                    pageContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    pageContent.style.opacity = '0';
                    pageContent.style.transform = 'translateY(-20px)';
                }

                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }

    // ============================================
    // 5. SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay
                    setTimeout(() => {
                        entry.target.classList.add('animate-on-scroll');
                    }, index * 50);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        const elements = document.querySelectorAll('.card, .section > *:not(script)');
        elements.forEach(el => {
            // Don't animate if already visible
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('animate-on-scroll');
            } else {
                observer.observe(el);
            }
        });
    }

    // ============================================
    // 6. MOBILE MENU
    // ============================================
    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        if (!mobileBtn || !navLinks) return;

        mobileBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            
            if (isOpen) {
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.classList.add('open');
                mobileBtn.classList.add('active');
                mobileBtn.setAttribute('aria-expanded', 'true');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // 7. SMOOTH SCROLL (for hash links)
    // ============================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navHeight = document.getElementById('mainNav')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // 8. BACK TO TOP BUTTON
    // ============================================
    setupBackToTop() {
        // Create button
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        `;

        document.body.appendChild(backToTop);

        // Show/hide on scroll
        let isVisible = false;
        let ticking = false;

        const toggleVisibility = () => {
            const shouldShow = window.scrollY > 500;

            if (shouldShow && !isVisible) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                isVisible = false;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(toggleVisibility);
                ticking = true;
            }
        }, { passive: true });

        // Click handler
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-4px)';
            backToTop.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        });
    }

    // ============================================
    // 9. KEYBOARD NAVIGATION
    // ============================================
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key - close mobile menu
            if (e.key === 'Escape') {
                const navLinks = document.getElementById('navLinks');
                const mobileBtn = document.getElementById('mobileMenuBtn');
                
                if (navLinks?.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    mobileBtn?.classList.remove('active');
                }
            }

            // Ctrl/Cmd + K - Focus search (if implemented later)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Future: Focus search input
                console.log('Search shortcut pressed');
            }
        });
    }

    // ============================================
    // 10. UTILITY FUNCTIONS
    // ============================================
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// ============================================
// 11. INITIALISE ON DOM READY
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioApp();
    });
} else {
    new PortfolioApp();
}

// ============================================
// 12. EXPORT FOR MODULE USAGE (Optional)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}