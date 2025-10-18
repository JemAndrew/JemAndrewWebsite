// ============================================
// PORTFOLIO APP
// ============================================

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Portfolio initialised');
        
        this.setupNavigation();
        this.setupHamburgerMenu();
        this.setupFloatingCTA();
        this.setupBackToTop();
        this.setupKeyboardNavigation();
        
        if (document.querySelector('.project-card-compact')) {
            this.setupExpandableProjects();
        }
        
        console.log('✅ All systems ready');
    }

    // ============================================
    // NAVIGATION
    // ============================================
    setupNavigation() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        let ticking = false;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });

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
    // HAMBURGER MENU
    // ============================================
    setupHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!hamburgerBtn || !mobileMenu) return;

        hamburgerBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburgerBtn.classList.add('active');
        mobileMenu.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // ============================================
    // FLOATING CV BUTTON
    // ============================================
    setupFloatingCTA() {
        const floatingCTA = document.querySelector('.floating-cta');
        if (!floatingCTA) return;

        let ticking = false;

        const handleScroll = () => {
            if (window.scrollY > 400) {
                floatingCTA.classList.add('visible');
            } else {
                floatingCTA.classList.remove('visible');
            }
            ticking = false;
        };

        handleScroll();

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    setupBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 2.5rem;
            left: 2.5rem;
            width: 50px;
            height: 50px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 50%;
            color: var(--primary);
            font-size: 1.1rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
        `;

        document.body.appendChild(backToTop);

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

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-3px)';
            backToTop.style.borderColor = 'var(--primary)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.borderColor = 'var(--border)';
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu?.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    // ============================================
    // EXPANDABLE PROJECT CARDS
    // ============================================
    setupExpandableProjects() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card-compact');
        const emptyState = document.getElementById('emptyState');
        
        if (!projectCards.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                let visibleCount = 0;
                
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    this.collapseProjectCard(card);
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
        
        projectCards.forEach(card => {
            const header = card.querySelector('.card-compact-header');
            
            header.addEventListener('click', (e) => {
                if (e.target.closest('.btn') || e.target.closest('a')) {
                    return;
                }
                
                const isExpanded = card.dataset.expanded === 'true';
                
                if (isExpanded) {
                    this.collapseProjectCard(card);
                } else {
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            this.collapseProjectCard(otherCard);
                        }
                    });
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
        
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-times');
        icon.style.transform = 'rotate(90deg)';
        
        expandBtn.style.background = 'rgba(96, 165, 250, 0.15)';
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    }

    collapseProjectCard(card) {
        const body = card.querySelector('.card-compact-body');
        const icon = card.querySelector('.expand-icon i');
        const expandBtn = card.querySelector('.expand-icon');
        
        card.dataset.expanded = 'false';
        body.style.maxHeight = '0';
        body.style.padding = '0 1.5rem';
        
        icon.classList.remove('fa-times');
        icon.classList.add('fa-plus');
        icon.style.transform = 'rotate(0deg)';
        
        expandBtn.style.background = 'rgba(96, 165, 250, 0.08)';
        card.style.borderColor = 'var(--border)';
        card.style.boxShadow = 'none';
    }
}

// ============================================
// INITIALISE
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioApp();
    });
} else {
    new PortfolioApp();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}