// Theme initialization - load saved theme before page renders to avoid flash
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

class ModernPortfolio {
    constructor() {
        this.init();
    }

    async init() {
        // Need to handle loading screen first before anything else renders
        await this.handleLoadingScreen();
        
        // Load all avatar instances across the site
        await this.loadAvatars();
        
        // Set up core functionality
        this.setupThemeToggle();
        this.setupFullscreenMenu();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupScrollReveal();
        
        // Check if we're on projects page and set up filtering
        if (document.querySelector('.projects-split-container')) {
            this.setupProjectsPage();
        } else if (document.querySelector('.project-card')) {
            this.setupExpandableProjects();
        }
        
        // Education page module toggle
        if (document.querySelector('.toggle-modules')) {
            this.setupModulesToggle();
        }
    }
    
    // Loading screen handler
    async handleLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingAvatar = document.getElementById('loadingAvatar');
        
        if (!loadingScreen) return;
        
        // Try to load avatar into loading screen
        if (loadingAvatar) {
            try {
                const response = await fetch('/static/images/avatar.svg');
                if (response.ok) {
                    const svgText = await response.text();
                    loadingAvatar.innerHTML = svgText;
                }
            } catch (error) {
                // Fallback to initials if avatar fails to load
                loadingAvatar.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; 
                                justify-content: center; font-weight: 900; font-size: 4rem; 
                                color: var(--accent-primary);">
                        JA
                    </div>
                `;
            }
        }
        
        // Keep loading screen visible for at least 800ms
        await this.wait(800);
        
        // Wait for page to finish loading
        await this.waitForPageLoad();
        
        // Hide and remove loading screen
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 800);
    }
    
    waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Scroll reveal animations for sections and cards
    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Watch all sections and cards for when they enter viewport
        document.querySelectorAll('.fade-in-section, .project-card, .degree-card, .skill-category-card').forEach(el => {
            el.classList.add('fade-in-section');
            observer.observe(el);
        });
    }
    
    // Load avatar SVG into all containers across the site
    async loadAvatars() {
        try {
            const response = await fetch('/static/images/avatar.svg');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const svgText = await response.text();
            
            // Nav pill avatar
            const pillContainer = document.getElementById('avatarPillContainer');
            if (pillContainer) {
                pillContainer.innerHTML = svgText;
            }
            
            // Fullscreen menu avatar
            const menuAvatarContainer = document.getElementById('menuAvatarContainer');
            if (menuAvatarContainer) {
                menuAvatarContainer.innerHTML = svgText;
            }
            
            // About page sidebar avatar with hover effect
            const aboutLeftAvatar = document.getElementById('aboutLeftAvatar');
            if (aboutLeftAvatar) {
                aboutLeftAvatar.innerHTML = svgText;
                
                aboutLeftAvatar.style.transition = 'transform 0.3s ease';
                aboutLeftAvatar.addEventListener('mouseenter', () => {
                    aboutLeftAvatar.style.transform = 'scale(1.05)';
                });
                aboutLeftAvatar.addEventListener('mouseleave', () => {
                    aboutLeftAvatar.style.transform = 'scale(1)';
                });
            }

            // Projects page sidebar avatar with hover effect
            const projectsLeftAvatar = document.getElementById('projectsLeftAvatar');
            if (projectsLeftAvatar) {
                projectsLeftAvatar.innerHTML = svgText;
                
                projectsLeftAvatar.style.transition = 'transform 0.3s ease';
                projectsLeftAvatar.addEventListener('mouseenter', () => {
                    projectsLeftAvatar.style.transform = 'scale(1.05)';
                });
                projectsLeftAvatar.addEventListener('mouseleave', () => {
                    projectsLeftAvatar.style.transform = 'scale(1)';
                });
            }
            
            // Home page hero avatar with eye tracking
            let heroContainer = document.getElementById('avatarContainer');
            if (!heroContainer) {
                heroContainer = document.getElementById('heroAvatarContainer');
            }
            
            if (heroContainer) {
                heroContainer.innerHTML = svgText;
                
                // Set up eye tracking after brief delay to let SVG render
                setTimeout(() => {
                    this.setupEyeTracking(heroContainer);
                }, 200);
            }
            
        } catch (error) {
            console.error('Avatar loading failed:', error);
            
            // Fallback to initials in nav pill
            const pillContainer = document.getElementById('avatarPillContainer');
            if (pillContainer) {
                pillContainer.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; 
                                justify-content: center; font-weight: 700; font-size: 1.2rem; 
                                color: var(--accent-primary);">
                        JA
                    </div>
                `;
            }
        }
    }
    
    // Eye tracking effect for hero avatar

    setupEyeTracking(container) {
        const svgElement = container.querySelector('svg');
        if (!svgElement) return;
        
        const eyesGroup = svgElement.querySelector('#notion-avatar-eyes');
        if (!eyesGroup) return;
        
        eyesGroup.style.transformOrigin = 'center';
        eyesGroup.style.transition = 'transform 0.15s ease-out';
        
        // Listen to mouse movement on the page
        document.addEventListener('mousemove', (e) => {
            const rect = svgElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = Math.max(window.innerWidth, window.innerHeight);
            
            const normalised = Math.min(distance / maxDistance, 1);
            const moveAmount = normalised * 25;  // BIG movement - adjust this number higher for more
            
            const angle = Math.atan2(deltaY, deltaX);
            const offsetX = Math.cos(angle) * moveAmount;
            const offsetY = Math.sin(angle) * moveAmount;
                
            eyesGroup.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    }
    
    // Projects page setup
    setupProjectsPage() {
        this.setupProjectFiltering();
        this.setupProjectNavigation();
        this.setupExpandableProjects();
    }
    
    // Project filtering by category
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.projects-nav-link');
        const projectCards = document.querySelectorAll('.project-card');
        const projectCount = document.getElementById('projectCount');
        
        if (!filterButtons.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show/hide projects based on filter
                let visibleCount = 0;
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                        // Collapse expanded cards when filter changes
                        this.collapseProjectCard(card);
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Update project count display
                if (projectCount) {
                    const label = filter === 'all' ? 'Projects' : 
                                filter.charAt(0).toUpperCase() + filter.slice(1) + ' Projects';
                    projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'Project' : label}`;
                }
            });
        });
    }
    
    // Smooth scroll to projects when clicking sidebar links
    setupProjectNavigation() {
        const navLinks = document.querySelectorAll('.nav-project-link');
        
        if (!navLinks.length) return;
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Fullscreen menu toggle
    setupFullscreenMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuClose = document.getElementById('menuClose');
        const fullscreenMenu = document.getElementById('fullscreenMenu');
        
        if (!menuToggle || !fullscreenMenu) return;
        
        menuToggle.addEventListener('click', () => {
            fullscreenMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu when clicking links
        const menuLinks = fullscreenMenu.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Theme toggle between light and dark mode
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        
        const icon = toggle.querySelector('i');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.updateThemeIcon(icon, currentTheme);
        
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
            
            // Spin animation on toggle
            toggle.style.transition = 'transform 0.3s ease';
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

    // Smooth scroll for anchor links
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

    // Fade in animations for sections
    setupAnimations() {
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
        
        // Set initial state and observe
        document.querySelectorAll('.section, .card, .project-card, .degree-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Expandable project cards
    setupExpandableProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!projectCards.length) return;
        
        projectCards.forEach((card, index) => {
            const expandBtn = card.querySelector('.expand-btn');
            
            if (!expandBtn) return;
            
            // Remove any existing listeners by cloning the button
            const newExpandBtn = expandBtn.cloneNode(true);
            expandBtn.parentNode.replaceChild(newExpandBtn, expandBtn);
            
            newExpandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    this.collapseProjectCard(card);
                } else {
                    // Collapse any other expanded cards first
                    projectCards.forEach((otherCard) => {
                        if (otherCard !== card && otherCard.classList.contains('expanded')) {
                            this.collapseProjectCard(otherCard);
                        }
                    });
                    this.expandProjectCard(card);
                }
            });
        });
    }

    expandProjectCard(card) {
        const body = card.querySelector('.project-body');
        const icon = card.querySelector('.expand-btn i');
        
        if (body && icon) {
            card.classList.add('expanded');
            body.style.maxHeight = body.scrollHeight + 'px';
            
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-times');
            
            card.style.borderColor = 'var(--accent-primary)';
        }
    }

    collapseProjectCard(card) {
        const body = card.querySelector('.project-body');
        const icon = card.querySelector('.expand-btn i');
        
        if (body && icon) {
            card.classList.remove('expanded');
            body.style.maxHeight = '0';
            
            icon.classList.remove('fa-times');
            icon.classList.add('fa-plus');
            
            card.style.borderColor = 'var(--border)';
        }
    }

    // Module list toggle on education page
    setupModulesToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-modules');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const degree = button.dataset.degree;
                const modulesContainer = document.querySelector(`[data-modules="${degree}"]`);
                const icon = button.querySelector('i');
                const text = button.querySelector('span');
                
                if (modulesContainer && icon && text) {
                    if (modulesContainer.classList.contains('modules-hidden')) {
                        modulesContainer.classList.remove('modules-hidden');
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                        text.textContent = 'View Less';
                    } else {
                        modulesContainer.classList.add('modules-hidden');
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                        text.textContent = 'View All';
                    }
                }
            });
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernPortfolio();
    });
} else {
    new ModernPortfolio();
}

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}

// Skill bars animation for about page
function initAboutPageSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    // Start all bars at 0% width
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });

    // Watch for when skill bars enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width;
                
                // Animate to target width after brief delay
                setTimeout(() => {
                    bar.style.width = `${targetWidth}%`;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skill bars when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPageSkills);
} else {
    initAboutPageSkills();
}