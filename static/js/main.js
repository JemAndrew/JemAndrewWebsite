/**
 * Modern CV Website JavaScript
 * Features: Smooth animations, theme switching, typing effects, interactive charts
 */

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const CONFIG = {
    TYPING_SPEED: 80,
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
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to limit the rate of function execution
 */
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

/**
 * Throttle function to limit function execution frequency
 */
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Format number with animation
 */
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

/**
 * Easing function for smooth animations
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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
            backSpeed: options.backSpeed || 50,
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
                    return; // Stop if not looping
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
            threshold: 0.2,
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
        
        // Observe elements with data-aos attributes
        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }
    
    animateElement(element) {
        if (this.animatedElements.has(element)) return;
        this.animatedElements.add(element);
        
        if (element.classList.contains('skill-progress-bar')) {
            this.animateSkillBar(element);
        }
        
        // Trigger AOS animation
        element.classList.add('aos-animate');
    }
    
    animateSkillBar(bar) {
        const targetWidth = bar.dataset.progress || '0';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = `${targetWidth}%`;
        }, 100);
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
        }
    }
    
    bindFormEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Add real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = new FormData(this.contactForm);
        const submitBtn = this.contactForm.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            this.setSubmitButtonState(submitBtn, true);
            
            const response = await fetch('/ajax/contact/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showNotification('Message sent successfully!', 'success');
                this.contactForm.reset();
            } else {
                this.showFormErrors(data.errors);
            }
        } catch (error) {
            this.showNotification('An error occurred. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmitButtonState(submitBtn, false, originalText);
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
    
    showFormErrors(errors) {
        Object.entries(errors).forEach(([fieldName, messages]) => {
            const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
            if (field && messages.length > 0) {
                this.showFieldError(field, messages[0]);
            }
        });
    }
    
    setSubmitButtonState(button, loading, originalText = 'Send Message') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        } else {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-paper-plane me-2"></i>${originalText}`;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// ============================================================================
// CHARTS AND VISUALIZATIONS
// ============================================================================

class SkillsChart {
    constructor(canvasId, skillsData) {
        this.canvas = document.getElementById(canvasId);
        this.skillsData = skillsData;
        this.chart = null;
        
        if (this.canvas && this.skillsData) {
            this.init();
        }
    }
    
    init() {
        const ctx = this.canvas.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.skillsData.map(skill => skill.name),
                datasets: [{
                    label: 'Proficiency Level',
                    data: this.skillsData.map(skill => skill.proficiency),
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 123, 255, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: CONFIG.CHART_ANIMATION_DURATION,
                    easing: 'easeInOutCubic'
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    updateData(newData) {
        if (this.chart) {
            this.chart.data.labels = newData.map(skill => skill.name);
            this.chart.data.datasets[0].data = newData.map(skill => skill.proficiency);
            this.chart.update();
        }
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
        this.projectItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const show = category === 'all' || itemCategory === category;
            
            if (show) {
                item.style.display = 'block';
                item.classList.add('animate-fadeInUp');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-fadeInUp');
            }
        });
    }
    
    searchProjects(term) {
        const searchTerm = term.toLowerCase();
        
        this.projectItems.forEach(item => {
            const title = item.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.project-description')?.textContent.toLowerCase() || '';
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

class CVWebsite {
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
            this.components.performanceMonitor = new PerformanceMonitor();
            
            // Initialize typing animation if element exists
            const typedElement = document.querySelector(SELECTORS.typedText);
            if (typedElement && window.typingPhrases) {
                this.components.typingAnimation = new TypingAnimation(
                    typedElement, 
                    window.typingPhrases
                );
            }
            
            // Initialize skills chart if data exists
            if (window.skillsChartData) {
                this.components.skillsChart = new SkillsChart('skillsChart', window.skillsChartData);
            }
            
            // Hide loading overlay
            this.hideLoadingOverlay();
            
            console.log('✅ CV Website initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing CV Website:', error);
            this.hideLoadingOverlay();
        }
    }
    
    hideLoadingOverlay() {
        const overlay = document.querySelector(SELECTORS.loadingOverlay);
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
}

// ============================================================================
// GLOBAL FUNCTIONS (for template usage)
// ============================================================================

/**
 * Initialize theme (called from template)
 */
function initTheme() {
    // This will be handled by ThemeManager
}

/**
 * Filter skills by category (called from template)
 */
function filterSkills() {
    const category = document.getElementById('skill-category')?.value;
    const skillItems = document.querySelectorAll('[data-skill-category]');
    
    skillItems.forEach(item => {
        const itemCategory = item.dataset.skillCategory;
        const show = !category || category === '' || itemCategory === category;
        
        if (show) {
            item.style.display = 'block';
            item.classList.add('animate-fadeInUp');
        } else {
            item.style.display = 'none';
            item.classList.remove('animate-fadeInUp');
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

/**
 * Initialize page-specific functionality
 */
function initPageFeatures() {
    // Initialize any page-specific features
    const currentPage = document.body.dataset.page;
    
    switch(currentPage) {
        case 'skills':
            initSkillsPage();
            break;
        case 'projects':
            initProjectsPage();
            break;
        case 'contact':
            initContactPage();
            break;
    }
}

/**
 * Initialize skills page features
 */
function initSkillsPage() {
    // Add any skills-specific functionality
    const categoryFilter = document.getElementById('skill-category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSkills);
    }
}

/**
 * Initialize projects page features
 */
function initProjectsPage() {
    // Add any projects-specific functionality
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            // Project search functionality
            const term = e.target.value.toLowerCase();
            const projects = document.querySelectorAll('.project-card');
            
            projects.forEach(project => {
                const title = project.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const description = project.querySelector('.card-text')?.textContent.toLowerCase() || '';
                const technologies = project.querySelector('.project-technologies')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(term) || 
                              description.includes(term) || 
                              technologies.includes(term);
                
                project.closest('.col-lg-4').style.display = matches ? 'block' : 'none';
            });
        }, 300));
    }
}

/**
 * Initialize contact page features
 */
function initContactPage() {
    // Add any contact-specific functionality
    const form = document.getElementById('contactForm');
    if (form) {
        // Form is already handled by FormHandler class
        console.log('Contact form initialized');
    }
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================

// Initialize the CV Website when DOM is ready
const cvWebsite = new CVWebsite();

// Initialize page-specific features
document.addEventListener('DOMContentLoaded', initPageFeatures);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CVWebsite,
        ThemeManager,
        TypingAnimation,
        ScrollAnimations,
        FormHandler,
        SkillsChart,
        ProjectFilter,
        PerformanceMonitor
    };
}