/**
 * Modern CV Website JavaScript - Complete Update
 * Features: Smooth animations, theme switching, typing effects, interactive charts
 */

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const CONFIG = {
    TYPING_SPEED: 100,
    TYPING_DELAY: 2000,
    SCROLL_THRESHOLD: 100,
    ANIMATION_DURATION: 800,
    CHART_ANIMATION_DURATION: 1000,
};

const SELECTORS = {
    navbar: '#mainNav',
    backToTopBtn: '#backToTopBtn',
    themeToggle: '#themeToggle',
    themeIcon: '#themeIcon',
    typedText: '#typed-text',
    loadingOverlay: '#loadingOverlay',
    skillProgressBars: '.skill-progress-bar',
    contactForm: '#contactForm',
    animateElements: '.animate-on-scroll'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutCubic(progress);
        element.textContent = Math.round(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.querySelector(SELECTORS.themeToggle);
        this.themeIcon = document.querySelector(SELECTORS.themeIcon);
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add visual feedback
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    getTheme() {
        return this.currentTheme;
    }
}

// ============================================================================
// TYPING ANIMATION
// ============================================================================

class TypingAnimation {
    constructor(element, phrases, options = {}) {
        this.element = element;
        this.phrases = phrases;
        this.options = {
            typeSpeed: options.typeSpeed || CONFIG.TYPING_SPEED,
            backSpeed: options.backSpeed || 60,
            backDelay: options.backDelay || CONFIG.TYPING_DELAY,
            loop: options.loop !== false,
            showCursor: options.showCursor !== false,
            ...options
        };
        
        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
        
        if (this.phrases.length > 0) {
            this.start();
        }
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];
        
        if (this.isWaiting) {
            setTimeout(() => {
                this.isWaiting = false;
                this.isDeleting = true;
                this.type();
            }, this.options.backDelay);
            return;
        }
        
        if (this.isDeleting) {
            this.currentCharIndex--;
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            }
            
            setTimeout(() => this.type(), this.options.backSpeed);
        } else {
            this.currentCharIndex++;
            this.element.textContent = currentPhrase.substring(0, this.currentCharIndex);
            
            if (this.currentCharIndex === currentPhrase.length) {
                if (this.options.loop) {
                    this.isWaiting = true;
                } else {
                    return;
                }
            }
            
            setTimeout(() => this.type(), this.options.typeSpeed);
        }
    }
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

class ScrollAnimations {
    constructor() {
        this.navbar = document.querySelector(SELECTORS.navbar);
        this.backToTopBtn = document.querySelector(SELECTORS.backToTopBtn);
        this.skillBars = document.querySelectorAll(SELECTORS.skillProgressBars);
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        this.bindScrollEvents();
        this.initIntersectionObserver();
    }
    
    bindScrollEvents() {
        const throttledScroll = throttle(() => {
            this.handleNavbarScroll();
            this.handleBackToTopButton();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
            });
        }
    }
    
    handleNavbarScroll() {
        if (!this.navbar) return;
        
        const scrolled = window.pageYOffset > CONFIG.SCROLL_THRESHOLD;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    handleBackToTopButton() {
        if (!this.backToTopBtn) return;
        
        const show = window.pageYOffset > CONFIG.SCROLL_THRESHOLD * 3;
        this.backToTopBtn.classList.toggle('show', show);
    }
    
    initIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
        
        // Observe skill progress bars
        this.skillBars.forEach(bar => observer.observe(bar));
        
        // Observe elements with animate-on-scroll class
        document.querySelectorAll(SELECTORS.animateElements).forEach(el => observer.observe(el));
        
        // Observe cards for stagger animation
        document.querySelectorAll('.card, .project-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }
    
    animateElement(element) {
        if (this.animatedElements.has(element)) return;
        this.animatedElements.add(element);
        
        if (element.classList.contains('skill-progress-bar')) {
            this.animateSkillBar(element);
        }
        
        if (element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-in');
        }
        
        // Add stagger animation to cards
        if (element.classList.contains('card') || element.classList.contains('project-card')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }
    
    animateSkillBar(bar) {
        const targetWidth = bar.dataset.progress || '0';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = `${targetWidth}%`;
        }, 200);
    }
}

// ============================================================================
// FORM HANDLING
// ============================================================================

class FormHandler {
    constructor() {
        this.contactForm = document.querySelector(SELECTORS.contactForm);
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.bindFormEvents();
            this.setupModernFormLabels();
        }
    }
    
    setupModernFormLabels() {
        // Convert regular forms to modern floating label forms
        const formGroups = this.contactForm.querySelectorAll('.form-group, .mb-3');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label && !input.classList.contains('form-control-modern')) {
                // Add modern classes
                input.classList.add('form-control-modern');
                label.classList.add('form-label-modern');
                group.classList.add('form-group-modern');
                
                // Add placeholder for floating effect
                input.setAttribute('placeholder', ' ');
            }
        });
    }
    
    bindFormEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Add real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = new FormData(this.contactForm);
        const submitBtn = this.contactForm.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            this.setSubmitButtonState(submitBtn, true);
            
            // Use Django's form submission for now
            this.contactForm.submit();
            
        } catch (error) {
            this.showNotification('An error occurred. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            setTimeout(() => {
                this.setSubmitButtonState(submitBtn, false, originalText);
            }, 1000);
        }
    }
    
    validateForm() {
        const inputs = this.contactForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Message length validation
        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }
        
        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('is-invalid');
            const errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            errorElement.textContent = message;
            field.parentNode.appendChild(errorElement);
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    setSubmitButtonState(button, loading, originalText = '') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.innerHTML = originalText || '<i class="fas fa-paper-plane me-2"></i>Send Message';
            button.classList.remove('loading');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// ============================================================================
// INTERACTIVE FEATURES
// ============================================================================

class InteractiveFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        this.initSmoothScrolling();
        this.initCardInteractions();
        this.initSkillBars();
        this.initParallaxEffects();
    }
    
    initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    initCardInteractions() {
        // Enhanced card hover effects
        document.querySelectorAll('.card, .project-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
    
    initSkillBars() {
        // Animate skill percentage numbers
        document.querySelectorAll('.skill-progress-bar').forEach(bar => {
            const percentage = parseInt(bar.dataset.progress || '0');
            const numberElement = bar.parentElement.querySelector('.skill-percentage');
            
            if (numberElement) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateNumber(numberElement, 0, percentage, 1500);
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(bar);
            }
        });
    }
    
    initParallaxEffects() {
        // Subtle parallax for hero elements
        const heroElements = document.querySelectorAll('.floating-element');
        
        window.addEventListener('scroll', throttle(() => {
            const scrollY = window.pageYOffset;
            
            heroElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }
}

// ============================================================================
// PROJECT FILTERING
// ============================================================================

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('[data-filter]');
        this.projectItems = document.querySelectorAll('[data-category]');
        this.searchInput = document.querySelector('#project-search');
        
        this.init();
    }
    
    init() {
        this.bindFilterEvents();
        this.bindSearchEvents();
    }
    
    bindFilterEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.dataset.filter;
                this.filterProjects(filter);
                this.updateActiveFilter(button);
            });
        });
    }
    
    bindSearchEvents() {
        if (this.searchInput) {
            const debouncedSearch = debounce((term) => {
                this.searchProjects(term);
            }, 300);
            
            this.searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }
    
    filterProjects(category) {
        this.projectItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const show = category === 'all' || itemCategory === category;
            
            if (show) {
                item.style.display = 'block';
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-in');
            }
        });
    }
    
    searchProjects(term) {
        const searchTerm = term.toLowerCase();
        
        this.projectItems.forEach(item => {
            const title = item.querySelector('.project-title, .card-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.project-description, .card-text')?.textContent.toLowerCase() || '';
            const technologies = item.querySelector('.project-technologies')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          technologies.includes(searchTerm);
            
            item.style.display = matches ? 'block' : 'none';
        });
    }
    
    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        
        this.init();
    }
    
    init() {
        this.measureLoadTimes();
        this.observePerformance();
    }
    
    measureLoadTimes() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            // Log performance metrics in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.group('🚀 Performance Metrics');
                console.log(`Page Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
                console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
                console.groupEnd();
            }
        });
    }
    
    observePerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-paint') {
                        this.metrics.firstPaint = entry.startTime;
                    } else if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

class ModernCVWebsite {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize core components
            this.components.themeManager = new ThemeManager();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.formHandler = new FormHandler();
            this.components.projectFilter = new ProjectFilter();
            this.components.interactiveFeatures = new InteractiveFeatures();
            this.components.performanceMonitor = new PerformanceMonitor();
            
            // Initialize typing animation if element exists
            const typedElement = document.querySelector(SELECTORS.typedText);
            if (typedElement && window.typingPhrases) {
                this.components.typingAnimation = new TypingAnimation(
                    typedElement, 
                    window.typingPhrases
                );
            }
            
            // Hide loading overlay with smooth transition
            this.hideLoadingOverlay();
            
            // Add CSS animations
            this.addCSSpAnimations();
            
            console.log('✅ Modern CV Website initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing CV Website:', error);
            this.hideLoadingOverlay();
        }
    }
    
    hideLoadingOverlay() {
        const overlay = document.querySelector(SELECTORS.loadingOverlay);
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
    
    addCSSpAnimations() {
        // Add keyframe animations dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================================================
// GLOBAL FUNCTIONS (for template usage)
// ============================================================================

/**
 * Filter skills by category (called from template)
 */
function filterSkills() {
    const category = document.getElementById('skill-category')?.value;
    const skillItems = document.querySelectorAll('[data-skill-category]');
    
    skillItems.forEach((item, index) => {
        const itemCategory = item.dataset.skillCategory;
        const show = !category || category === '' || itemCategory === category;
        
        if (show) {
            item.style.display = 'block';
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-in');
        } else {
            item.style.display = 'none';
            item.classList.remove('animate-in');
        }
    });
}

/**
 * Update proficiency label (called from template)
 */
function updateProficiencyLabel(value) {
    const labels = ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
    const label = document.getElementById('proficiency-label');
    if (label) {
        label.textContent = labels[value] || '';
    }
}

// Initialize the Modern CV Website when DOM is ready
const modernCVWebsite = new ModernCVWebsite();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModernCVWebsite,
        ThemeManager,
        TypingAnimation,
        ScrollAnimations,
        FormHandler,
        InteractiveFeatures,
        ProjectFilter,
        PerformanceMonitor
    };
}