// ============================================
// MODERN PORTFOLIO APP - SIMPLIFIED
// ============================================

class ModernPortfolio {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Modern Portfolio initialised');
        
        // Core features
        this.setupThemeToggle();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupInteractiveElements();
        
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
    // THEME TOGGLE
    // ============================================
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');
        
        if (!toggle || !icon) return;
        
        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update icon based on theme
        this.updateThemeIcon(icon, currentTheme);
        
        // Toggle theme on click
        toggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
            
            // Add rotation animation
            toggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                toggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
    
    updateThemeIcon(icon, theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        document.querySelectorAll('.section, .card, .project-card-compact').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // INTERACTIVE ELEMENTS
    // ============================================
    setupInteractiveElements() {
        // Eye follows mouse (if eye graphic exists)
        const eyePupil = document.querySelector('.eye-pupil');
        const eyeGraphic = document.querySelector('.eye-graphic');
        
        if (eyePupil && eyeGraphic) {
            document.addEventListener('mousemove', (e) => {
                const rect = eyeGraphic.getBoundingClientRect();
                const eyeCentreX = rect.left + rect.width / 2;
                const eyeCentreY = rect.top + rect.height / 2;
                
                const angle = Math.atan2(
                    e.clientY - eyeCentreY,
                    e.clientX - eyeCentreX
                );
                
                const distance = Math.min(
                    Math.hypot(e.clientX - eyeCentreX, e.clientY - eyeCentreY) / 20,
                    15
                );
                
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                eyePupil.style.transform = `translate(${x}px, ${y}px)`;
            });
        }
        
        // Floating shapes parallax
        const shapes = document.querySelectorAll('.gradient-square');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 10;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
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
        
        expandBtn.style.background = 'rgba(94, 173, 173, 0.15)';
        card.style.borderColor = 'var(--accent-mint)';
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
        new ModernPortfolio();
    });
} else {
    new ModernPortfolio();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}