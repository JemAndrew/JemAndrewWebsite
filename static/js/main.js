
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
       // this.setupPageTransitions(); 
       //  this.setupScrollAnimations();
        this.setupMobileMenu();
        
        // Enhanced features
        this.setupScrollDown();
        this.setupSmoothScroll();
        this.setupBackToTop();
        this.setupKeyboardNavigation();
        this.setupExpandableProjects();
        
        console.log('✅ All systems ready');
    }

    // ============================================
    // 2. LOADING SCREEN
    // ============================================
    setupLoadingScreen() {
        // Loading screen is hidden by default in CSS
        // Only show it if you specifically want a loading state
        // For now, we'll just ensure it's hidden
        const loading = document.getElementById('loadingScreen');
        if (loading) {
            loading.remove(); // Remove it immediately
        }
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

                // Don't intercept
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

                // Simple opacity fade only (no transform)
                document.body.style.transition = 'opacity 0.2s ease';
                document.body.style.opacity = '0';

                // Navigate after quick fade
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            });
        });
    }

    // ============================================
    // 5. SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add class immediately (no stagger delay)
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    // Trigger animation on next frame
                    requestAnimationFrame(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Only observe elements that are NOT currently visible
        const elements = document.querySelectorAll('.card, .section > *:not(script)');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            
            // Only animate elements that are below the fold
            if (rect.top > window.innerHeight) {
                observer.observe(el);
            }
            // Elements already visible stay as-is (no animation)
        });
    }

        // ============================================
    // 9. SCROLL DOWN BUTTON (Home page only)
    // ============================================
    setupScrollDown() {
        const scrollDownBtn = document.getElementById('scrollDownBtn');
        if (!scrollDownBtn) return;

        // Set initial styles (matching back-to-top)
        scrollDownBtn.style.transition = 'all 0.3s ease';
        scrollDownBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';

        // Hover effects - matching back-to-top button with glow
        scrollDownBtn.addEventListener('mouseenter', () => {
            scrollDownBtn.style.transform = 'translateY(-4px)';
            scrollDownBtn.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
        });

        scrollDownBtn.addEventListener('mouseleave', () => {
            scrollDownBtn.style.transform = 'translateY(0)';
            scrollDownBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        });

        // Hide on scroll down, matching back-to-top behaviour
        let ticking = false;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                scrollDownBtn.style.opacity = '0';
                scrollDownBtn.style.visibility = 'hidden';
            } else {
                scrollDownBtn.style.opacity = '1';
                scrollDownBtn.style.visibility = 'visible';
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
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

    // ============================================
    // 13. EXPANDABLE PROJECT CARDS
    // ============================================
    setupExpandableProjects() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card-compact');
        const emptyState = document.getElementById('emptyState');
        
        if (!projectCards.length) return; // Exit if not on projects page
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter and collapse cards
                let visibleCount = 0;
                
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    // Collapse any expanded cards
                    this.collapseProjectCard(card);
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show/hide empty state
                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
        
        // Expand/collapse functionality
        projectCards.forEach(card => {
            const header = card.querySelector('.card-compact-header');
            
            header.addEventListener('click', (e) => {
                // Don't expand if clicking buttons/links
                if (e.target.closest('.btn') || e.target.closest('a')) {
                    return;
                }
                
                const isExpanded = card.dataset.expanded === 'true';
                
                if (isExpanded) {
                    this.collapseProjectCard(card);
                } else {
                    // Collapse all other cards first
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            this.collapseProjectCard(otherCard);
                        }
                    });
                    
                    // Expand this card
                    this.expandProjectCard(card);
                }
            });
        });

        
 }
 // ============================================
// 13. EXPANDABLE PROJECT CARDS
// ============================================
    setupExpandableProjects() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card-compact');
        const emptyState = document.getElementById('emptyState');
        
        if (!projectCards.length) return; // Exit if not on projects page
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Filter and collapse cards
                let visibleCount = 0;
                
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    // Collapse any expanded cards
                    this.collapseProjectCard(card);
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show/hide empty state
                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
        
        // Expand/collapse functionality
        projectCards.forEach(card => {
            const header = card.querySelector('.card-compact-header');
            
            header.addEventListener('click', (e) => {
                // Don't expand if clicking buttons/links
                if (e.target.closest('.btn') || e.target.closest('a')) {
                    return;
                }
                
                const isExpanded = card.dataset.expanded === 'true';
                
                if (isExpanded) {
                    this.collapseProjectCard(card);
                } else {
                    // Collapse all other cards first
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            this.collapseProjectCard(otherCard);
                        }
                    });
                    
                    // Expand this card
                    this.expandProjectCard(card);
                }
            });
        });
 }

    expandProjectCard(card) {
        const body = card.querySelector('.card-compact-body');
        const icon = card.querySelector('.expand-icon i');
        const expandBtn = card.querySelector('.expand-icon');
        
        card.dataset.expanded = 'true';
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.padding = '0 1.5rem';
        
        // Change icon
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-times');
        icon.style.transform = 'rotate(90deg)';
        
        // Style changes
        expandBtn.style.background = 'rgba(59, 130, 246, 0.2)';
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.15)';
    }

    collapseProjectCard(card) {
        const body = card.querySelector('.card-compact-body');
        const icon = card.querySelector('.expand-icon i');
        const expandBtn = card.querySelector('.expand-icon');
        
        card.dataset.expanded = 'false';
        body.style.maxHeight = '0';
        body.style.padding = '0 1.5rem';
        
        // Reset icon
        icon.classList.remove('fa-times');
        icon.classList.add('fa-plus');
        icon.style.transform = 'rotate(0deg)';
        
        // Reset styles
        expandBtn.style.background = 'rgba(59, 130, 246, 0.1)';
        card.style.borderColor = 'var(--border)';
        card.style.boxShadow = '0 4px 6px var(--shadow)';
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

