// ============================================
// MODERN PORTFOLIO - FIXED VERSION
// No duplicate event listeners!
// ============================================

class ModernPortfolio {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Portfolio initialising...');
        
        // Load avatars FIRST
        await this.loadAvatars();
        
        // Then setup everything else
        this.setupThemeToggle();
        this.setupFullscreenMenu();
        this.setupSmoothScroll();
        this.setupAnimations();
        
        // Page-specific features
        // FIXED: Only call setupExpandableProjects once per page!
        if (document.querySelector('.projects-split-container')) {
            // Projects page - setup all project features
            this.setupProjectsPage();
        } else if (document.querySelector('.project-card')) {
            // Other pages that have project cards
            this.setupExpandableProjects();
        }
        
        if (document.querySelector('.toggle-modules')) {
            this.setupModulesToggle();
        }
        
        console.log('✅ All systems ready');
    }
    
    setupProjectsPage() {
        console.log('✅ Setting up projects page');
        
        // Category filtering
        this.setupProjectFiltering();
        
        // Quick navigation
        this.setupProjectNavigation();
        
        // Expandable cards - ONLY called here for projects page
        this.setupExpandableProjects();
    }
    
    // ============================================
    // LOAD AVATARS - FLEXIBLE
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
            
            const aboutLeftAvatar = document.getElementById('aboutLeftAvatar');
            if (aboutLeftAvatar) {
                aboutLeftAvatar.innerHTML = svgText;
                console.log('✅ About page left avatar loaded');
                
                aboutLeftAvatar.style.transition = 'transform 0.3s ease';
                aboutLeftAvatar.addEventListener('mouseenter', () => {
                    aboutLeftAvatar.style.transform = 'scale(1.05)';
                });
                aboutLeftAvatar.addEventListener('mouseleave', () => {
                    aboutLeftAvatar.style.transform = 'scale(1)';
                });
            }

            // Load into PROJECTS PAGE header avatar
            const projectsLeftAvatar = document.getElementById('projectsLeftAvatar');
            if (projectsLeftAvatar) {
                projectsLeftAvatar.innerHTML = svgText;
                console.log('✅ Projects left avatar loaded');
                
                projectsLeftAvatar.style.transition = 'transform 0.3s ease';
                projectsLeftAvatar.addEventListener('mouseenter', () => {
                    projectsLeftAvatar.style.transform = 'scale(1.05)';
                });
                projectsLeftAvatar.addEventListener('mouseleave', () => {
                    projectsLeftAvatar.style.transform = 'scale(1)';
                });
            }
            
            // Load into HERO avatar - try BOTH possible IDs
            let heroContainer = document.getElementById('avatarContainer');
            if (!heroContainer) {
                heroContainer = document.getElementById('heroAvatarContainer');
            }
            
            if (heroContainer) {
                heroContainer.innerHTML = svgText;
                console.log('✅ Hero avatar loaded into:', heroContainer.id);
                
                // Setup eye tracking after short delay
                setTimeout(() => {
                    this.setupEyeTracking(heroContainer);
                }, 200);
            } else {
                console.log('ℹ️ No hero avatar container found (not on home page)');
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
            
            const menuAvatarContainer = document.getElementById('menuAvatarContainer');
            if (menuAvatarContainer) {
                menuAvatarContainer.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; 
                                justify-content: center; font-weight: 700; font-size: 1.5rem; 
                                color: var(--accent-primary);">
                        JA
                    </div>
                `;
            }
        }
    }
    
    // ============================================
    // EYE TRACKING - WORKS WITH ANY CONTAINER
    // ============================================
    setupEyeTracking(container) {
        const svg = container.querySelector('svg');
        if (!svg) {
            console.warn('⚠️ No SVG found for eye tracking');
            return;
        }
        
        console.log('👁️ Setting up eye tracking for container:', container.id);
        
        // Find eyes - try multiple selectors
        let eyesGroup = svg.querySelector('[id*="notion-avatar-eyes"]');
        
        if (!eyesGroup) {
            eyesGroup = svg.querySelector('[id*="eyes"], [id*="Eyes"]');
        }
        
        if (!eyesGroup) {
            eyesGroup = svg.querySelector('[id*="eye"], [id*="Eye"]');
        }
        
        if (eyesGroup) {
            console.log('✅ Found eyes:', eyesGroup.id || 'unnamed');
            
            eyesGroup.style.transition = 'transform 0.1s ease-out';
            
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    const rect = container.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    const angle = Math.atan2(
                        e.clientY - centerY,
                        e.clientX - centerX
                    );
                    
                    const maxDistance = 8;
                    const mouseDistance = Math.hypot(
                        e.clientX - centerX,
                        e.clientY - centerY
                    );
                    const distance = Math.min(mouseDistance / 40, maxDistance);
                    
                    const offsetX = Math.cos(angle) * distance;
                    const offsetY = Math.sin(angle) * distance;
                    
                    eyesGroup.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
            });
            
            console.log('✅ Eye tracking activated!');
        } else {
            console.warn('⚠️ No eyes found in SVG');
        }
    }
    
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.sidebar-filter');
        const projectCards = document.querySelectorAll('.project-card');
        const projectCount = document.getElementById('projectCount');
        
        if (!filterButtons.length) return;
        
        console.log('✅ Project filtering initialised');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active state
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    const bullet = btn.querySelector('.filter-bullet');
                    if (bullet) bullet.textContent = '○';
                });
                
                button.classList.add('active');
                const activeBullet = button.querySelector('.filter-bullet');
                if (activeBullet) activeBullet.textContent = '●';
                
                // Filter projects
                let visibleCount = 0;
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                        
                        // Collapse expanded cards when filtering
                        this.collapseProjectCard(card);
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Update count
                if (projectCount) {
                    const label = filter === 'all' ? 'Projects' : 
                                filter.charAt(0).toUpperCase() + filter.slice(1) + ' Projects';
                    projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'Project' : label}`;
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
            console.log('📱 Opening menu');
            fullscreenMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                console.log('📱 Closing menu');
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

    setupProjectNavigation() {
        const navLinks = document.querySelectorAll('.nav-project-link');
        
        if (!navLinks.length) return;
        
        console.log('✅ Project navigation initialised');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetCard = document.getElementById(targetId);
                
                if (targetCard) {
                    // Smooth scroll to project (but DON'T auto-expand)
                    targetCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ============================================
    // THEME TOGGLE
    // ============================================
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');
        
        if (!toggle || !icon) return;
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(icon, currentTheme);
        
        toggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
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

    // ============================================
    // EXPANDABLE PROJECT CARDS - FIXED
    // Only the + button expands/collapses
    // Called ONCE per page load
    // ============================================
    setupExpandableProjects() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!projectCards.length) {
            console.log('ℹ️ No project cards found');
            return;
        }
        
        console.log(`✅ Projects initialised - found ${projectCards.length} cards`);
        
        // Legacy filter buttons (if any)
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    this.collapseProjectCard(card);
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // CRITICAL FIX: Only attach ONE click event to expand button
        projectCards.forEach((card, index) => {
            const expandBtn = card.querySelector('.expand-btn');
            
            if (!expandBtn) {
                console.warn(`⚠️ No expand button found for card ${index}`);
                return;
            }
            
            // Remove any existing listeners by cloning the button
            const newExpandBtn = expandBtn.cloneNode(true);
            expandBtn.parentNode.replaceChild(newExpandBtn, expandBtn);
            
            // Now attach the single event listener
            newExpandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                console.log(`🔘 Expand button clicked for card ${index}`);
                
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    console.log(`➖ Collapsing card ${index}`);
                    this.collapseProjectCard(card);
                } else {
                    console.log(`➕ Expanding card ${index}`);
                    // Collapse all other cards first
                    projectCards.forEach((otherCard, otherIndex) => {
                        if (otherCard !== card && otherCard.classList.contains('expanded')) {
                            console.log(`  └─ Collapsing card ${otherIndex}`);
                            this.collapseProjectCard(otherCard);
                        }
                    });
                    this.expandProjectCard(card);
                }
            });
            
            console.log(`  ✓ Expand button attached to card ${index}`);
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

    // ============================================
    // MODULES TOGGLE
    // ============================================
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
// SKILL BARS ANIMATION
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
                
                console.log(`✨ Animated skill bar to ${targetWidth}%`);
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