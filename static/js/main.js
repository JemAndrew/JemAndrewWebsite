// ============================================
// PORTFOLIO APP - FIXED HAMBURGER MENU
// ============================================

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Portfolio initialised');
        
        this.setupHamburgerMenu();
        this.setupFloatingCTA();
        this.setupBackToTop();
        this.setupKeyboardNavigation();
        
        // Only setup projects if on projects page
        if (document.querySelector('.project-card-compact')) {
            this.setupExpandableProjects();
        }
        
        // Only setup modules toggle if on education page
        if (document.querySelector('.toggle-modules-btn')) {
            this.setupModulesToggle();
        }
        
        console.log('✅ All systems ready');
    }

    // ============================================
    // HAMBURGER MENU - FIXED
    // ============================================
    setupHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!hamburgerBtn || !mobileMenu) {
            console.warn('⚠️ Hamburger menu elements not found');
            return;
        }

        // Toggle menu on hamburger click
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active')) {
                if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    openMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburgerBtn.classList.add('active');
        mobileMenu.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll on mobile only
        if (window.innerWidth < 968) {
            document.body.style.overflow = 'hidden';
        }
        
        console.log('✅ Menu opened');
    }

    closeMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        console.log('✅ Menu closed');
    }

    // ============================================
    // FLOATING CV BUTTON
    // ============================================
    setupFloatingCTA() {
        const floatingCTA = document.querySelector('.floating-cta');
        if (!floatingCTA) return;

        let ticking = false;

        const handleScroll = () => {
            // Show after scrolling 400px
            if (window.scrollY > 400) {
                floatingCTA.classList.add('visible');
            } else {
                floatingCTA.classList.remove('visible');
            }
            ticking = false;
        };

        // Initial check
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
            bottom: 2rem;
            left: 2rem;
            width: 45px;
            height: 45px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 50%;
            color: var(--primary);
            font-size: 1rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: center;
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
            backToTop.style.boxShadow = '0 4px 12px rgba(94, 173, 173, 0.2)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.borderColor = 'var(--border)';
            backToTop.style.boxShadow = 'none';
        });
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
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
        
        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                let visibleCount = 0;
                
                // Filter cards
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
                
                // Show empty state if needed
                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
        
        // Expand/collapse functionality
        projectCards.forEach(card => {
            const header = card.querySelector('.card-compact-header');
            
            header.addEventListener('click', (e) => {
                // Don't expand if clicking on a button or link
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
        
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-times');
        icon.style.transform = 'rotate(90deg)';
        
        expandBtn.style.background = 'rgba(94, 173, 173, 0.15)';
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = '0 8px 20px rgba(94, 173, 173, 0.15)';
    }

    collapseProjectCard(card) {
        const body = card.querySelector('.card-compact-body');
        const icon = card.querySelector('.expand-icon i');
        const expandBtn = card.querySelector('.expand-icon');
        
        card.dataset.expanded = 'false';
        body.style.maxHeight = '0';
        
        icon.classList.remove('fa-times');
        icon.classList.add('fa-plus');
        icon.style.transform = 'rotate(0deg)';
        
        expandBtn.style.background = 'rgba(94, 173, 173, 0.08)';
        card.style.borderColor = 'var(--border)';
        card.style.boxShadow = '0 2px 8px var(--shadow)';
    }

    // ============================================
    // MODULES TOGGLE (Education Page)
    // ============================================
    setupModulesToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-modules-btn');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const educationType = button.dataset.education;
                const modulesRest = document.querySelector(`.modules-grid-rest[data-education="${educationType}"]`);
                const icon = button.querySelector('i');
                const text = button.querySelector('span');
                
                if (modulesRest.style.display === 'grid') {
                    // Hide modules
                    modulesRest.style.display = 'none';
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                    text.textContent = 'View All';
                } else {
                    // Show modules
                    modulesRest.style.display = 'grid';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                    text.textContent = 'View Less';
                }
            });
        });
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

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}