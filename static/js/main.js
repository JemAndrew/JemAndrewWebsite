// ============================================
// MODERN PORTFOLIO - COMPLETE WITH PROJECT FILTERING
// ============================================
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

class ModernPortfolio {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Portfolio initialising...');
        
        // STEP 1: Handle loading screen first
        await this.handleLoadingScreen();
        
        // STEP 2: Load avatars
        await this.loadAvatars();
        
        // STEP 3: Setup everything else
        this.setupThemeToggle();
        this.setupFullscreenMenu();
        this.setupSmoothScroll();
        this.setupAnimations();
        this.setupScrollReveal();
        
        // Page-specific features
        if (document.querySelector('.projects-split-container')) {
            this.setupProjectsPage();
        } else if (document.querySelector('.project-card')) {
            this.setupExpandableProjects();
        }
        
        if (document.querySelector('.toggle-modules')) {
            this.setupModulesToggle();
        }
        
        console.log('✅ All systems ready');
    }
    
    // ============================================
    // LOADING SCREEN HANDLER
    // ============================================
    async handleLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingAvatar = document.getElementById('loadingAvatar');
        
        if (!loadingScreen) {
            console.log('ℹ️ No loading screen found');
            return;
        }
        
        console.log('🎬 Loading screen active');
        
        // Load avatar into loading screen
        if (loadingAvatar) {
            try {
                const response = await fetch('/static/images/avatar.svg');
                if (response.ok) {
                    const svgText = await response.text();
                    loadingAvatar.innerHTML = svgText;
                    console.log('✅ Loading avatar displayed');
                }
            } catch (error) {
                console.log('⚠️ Avatar load failed, using fallback');
                loadingAvatar.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; 
                                justify-content: center; font-weight: 900; font-size: 4rem; 
                                color: var(--accent-primary);">
                        JA
                    </div>
                `;
            }
        }
        
        // Wait for minimum display time
        await this.wait(800);
        
        // Wait for page to fully load
        await this.waitForPageLoad();
        
        // Hide loading screen
        loadingScreen.classList.add('hidden');
        console.log('✅ Loading complete');
        
        // Remove from DOM after transition
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
    
    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
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
        
        // Observe all sections and cards
        document.querySelectorAll('.fade-in-section, .project-card, .degree-card, .skill-category-card').forEach(el => {
            el.classList.add('fade-in-section');
            observer.observe(el);
        });
        
        console.log('✅ Scroll reveal animations ready');
    }
    
    // ============================================
    // LOAD AVATARS
    // ============================================
    async loadAvatars() {
        try {
            console.log('📥 Loading avatar SVG...');
            
            const response = await fetch('/static/images/avatar.svg');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const svgText = await response.text();
            console.log('✅ Avatar SVG fetched');
            
            // Load into PILL avatar (nav bar)
            const pillContainer = document.getElementById('avatarPillContainer');
            if (pillContainer) {
                pillContainer.innerHTML = svgText;
                console.log('✅ Pill avatar loaded');
            }
            
            // Load into MENU avatar (fullscreen menu)
            const menuAvatarContainer = document.getElementById('menuAvatarContainer');
            if (menuAvatarContainer) {
                menuAvatarContainer.innerHTML = svgText;
                console.log('✅ Menu avatar loaded');
            }
            
            // Load into ABOUT page avatar
            const aboutLeftAvatar = document.getElementById('aboutLeftAvatar');
            if (aboutLeftAvatar) {
                aboutLeftAvatar.innerHTML = svgText;
                console.log('✅ About page avatar loaded');
                
                aboutLeftAvatar.style.transition = 'transform 0.3s ease';
                aboutLeftAvatar.addEventListener('mouseenter', () => {
                    aboutLeftAvatar.style.transform = 'scale(1.05)';
                });
                aboutLeftAvatar.addEventListener('mouseleave', () => {
                    aboutLeftAvatar.style.transform = 'scale(1)';
                });
            }

            // Load into PROJECTS page avatar
            const projectsLeftAvatar = document.getElementById('projectsLeftAvatar');
            if (projectsLeftAvatar) {
                projectsLeftAvatar.innerHTML = svgText;
                console.log('✅ Projects avatar loaded');
                
                projectsLeftAvatar.style.transition = 'transform 0.3s ease';
                projectsLeftAvatar.addEventListener('mouseenter', () => {
                    projectsLeftAvatar.style.transform = 'scale(1.05)';
                });
                projectsLeftAvatar.addEventListener('mouseleave', () => {
                    projectsLeftAvatar.style.transform = 'scale(1)';
                });
            }
            
            // Load into HERO avatar
            let heroContainer = document.getElementById('avatarContainer');
            if (!heroContainer) {
                heroContainer = document.getElementById('heroAvatarContainer');
            }
            
            if (heroContainer) {
                heroContainer.innerHTML = svgText;
                console.log('✅ Hero avatar loaded');
                
                // Setup eye tracking after short delay
                setTimeout(() => {
                    this.setupEyeTracking(heroContainer);
                }, 200);
            }
            
        } catch (error) {
            console.error('❌ Avatar loading failed:', error);
            
            // Fallback: Show initials
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
    
    // ============================================
    // EYE TRACKING
    // ============================================
    setupEyeTracking(container) {
        const svgElement = container.querySelector('svg');
        if (!svgElement) {
            console.log('⚠️ SVG not found for eye tracking');
            return;
        }
        
        const eyesGroup = svgElement.querySelector('#eyes');
        if (!eyesGroup) {
            console.log('⚠️ Eyes group not found in SVG');
            return;
        }
        
        console.log('👀 Setting up eye tracking...');
        
        eyesGroup.style.transformOrigin = 'center';
        eyesGroup.style.transition = 'transform 0.2s ease-out';
        
        let isTracking = true;
        
        container.addEventListener('mouseenter', () => {
            isTracking = true;
            eyesGroup.style.transition = 'transform 0.2s ease-out';
        });
        
        container.addEventListener('mouseleave', () => {
            isTracking = false;
            eyesGroup.style.transition = 'transform 0.5s ease-out';
            eyesGroup.style.transform = 'translate(0px, 0px)';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isTracking) return;
            
            const rect = svgElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = Math.min(rect.width, rect.height) / 2;
            
            const normalised = Math.min(distance / maxDistance, 1);
            const moveAmount = normalised * 4;
            
            const angle = Math.atan2(deltaY, deltaX);
            const offsetX = Math.cos(angle) * moveAmount;
            const offsetY = Math.sin(angle) * moveAmount;
                
            eyesGroup.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        
        console.log('✅ Eye tracking activated');
    }
    
    // ============================================
    // PROJECTS PAGE SETUP - THIS WAS MISSING!
    // ============================================
    setupProjectsPage() {
        console.log('✅ Setting up projects page');
        this.setupProjectFiltering();
        this.setupProjectNavigation();
        this.setupExpandableProjects();
    }
    
    // ============================================
    // PROJECT FILTERING - THE CRITICAL MISSING METHOD!
    // ============================================
    setupProjectFiltering() {
        // FIXED: Using correct selector for your HTML
        const filterButtons = document.querySelectorAll('.projects-nav-link');
        const projectCards = document.querySelectorAll('.project-card');
        const projectCount = document.getElementById('projectCount');
        
        if (!filterButtons.length) {
            console.warn('⚠️ No filter buttons found');
            return;
        }
        
        console.log(`✅ Project filtering initialised with ${filterButtons.length} filters`);
        console.log(`✅ Found ${projectCards.length} project cards`);
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                console.log(`🔍 Filtering by: ${filter}`);
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter projects
                let visibleCount = 0;
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                        // Collapse card when filter changes
                        this.collapseProjectCard(card);
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Update project count display if element exists
                if (projectCount) {
                    const label = filter === 'all' ? 'Projects' : 
                                filter.charAt(0).toUpperCase() + filter.slice(1) + ' Projects';
                    projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'Project' : label}`;
                }
                
                console.log(`✅ Filtered: ${filter} - ${visibleCount} projects visible`);
            });
        });
    }
    
    // ============================================
    // PROJECT NAVIGATION
    // ============================================
    setupProjectNavigation() {
        const navLinks = document.querySelectorAll('.nav-project-link');
        
        if (!navLinks.length) return;
        
        console.log('✅ Project navigation initialised');
        
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
    
    // ============================================
    // FULLSCREEN MENU
    // ============================================
    setupFullscreenMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuClose = document.getElementById('menuClose');
        const fullscreenMenu = document.getElementById('fullscreenMenu');
        
        if (!menuToggle || !fullscreenMenu) {
            console.warn('⚠️ Menu elements not found');
            return;
        }
        
        console.log('✅ Setting up fullscreen menu');
        
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
        
        const menuLinks = fullscreenMenu.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
                fullscreenMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        console.log('✅ Menu ready');
    }

    // ============================================
    // THEME TOGGLE
    // ============================================
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) {
            console.warn('⚠️ Theme toggle not found');
            return;
        }
        
        const icon = toggle.querySelector('i');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.updateThemeIcon(icon, currentTheme);
        
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
            
            toggle.style.transition = 'transform 0.3s ease';
            toggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                toggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
        
        console.log('✅ Theme toggle ready');
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
        
        document.querySelectorAll('.section, .card, .project-card, .degree-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupExpandableProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!projectCards.length) {
            console.log('ℹ️ No project cards found');
            return;
        }
        
        console.log(`✅ Projects initialised - found ${projectCards.length} cards`);
        
        projectCards.forEach((card, index) => {
            const expandBtn = card.querySelector('.expand-btn');
            
            if (!expandBtn) return;
            
            const newExpandBtn = expandBtn.cloneNode(true);
            expandBtn.parentNode.replaceChild(newExpandBtn, expandBtn);
            
            newExpandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    this.collapseProjectCard(card);
                } else {
                    projectCards.forEach((otherCard) => {
                        if (otherCard !== card && otherCard.classList.contains('expanded')) {
                            this.collapseProjectCard(otherCard);
                        }
                    });
                    this.expandProjectCard(card);
                }
            });
        });
        
        console.log('✅ All expand buttons configured');
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
        
        console.log('✅ Modules ready');
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}

// ============================================
// SKILL BARS ANIMATION (for about page)
// ============================================
function initAboutPageSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    console.log('✅ Initialising skill bars...');

    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.width;
                
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
    
    console.log(`✅ Watching ${skillBars.length} skill bars`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPageSkills);
} else {
    initAboutPageSkills();
}