/**
 * Professional Portfolio JavaScript
 * Clean, minimal functionality for professional portfolio
 */

class ProfessionalPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupFormHandling();
        this.setupAnimations();
        this.setupMobileMenu();
        
        console.log('Professional Portfolio initialized');
    }

    /**
     * Navigation functionality
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
            this.updateNavbarAppearance();
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    updateNavbarAppearance() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Mobile menu functionality
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            // Close mobile menu when clicking on nav link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        }
    }

    /**
     * Scroll effects and back to top button
     */
    setupScrollEffects() {
        const backToTop = document.getElementById('backToTop');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });

            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Form handling
     */
    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e, contactForm);
            });

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    handleFormSubmission(e, form) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        this.setButtonLoading(submitBtn, true);

        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
            this.setButtonLoading(submitBtn, false, originalText);
            this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            form.reset();
        }, 2000);
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
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
            field.style.borderColor = 'var(--danger-color)';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setButtonLoading(button, loading, originalText = '') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        } else {
            button.disabled = false;
            button.innerHTML = originalText || '<i class="fas fa-paper-plane"></i> Send Message';
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.querySelector('.messages-container') || this.createMessageContainer();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        messageContainer.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.className = 'messages-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Scroll animations
     */
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Add fade-in class to sections and cards
        document.querySelectorAll('section, .about-card, .project-card, .skill-category').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    /**
     * Utility functions
     */
    debounce(func, wait) {
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

    throttle(func, limit) {
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
}

/**
 * Additional interactive features
 */
class InteractiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectFiltering();
        this.setupSkillInteractions();
        this.setupKeyboardNavigation();
    }

    setupProjectFiltering() {
        const showAllBtn = document.getElementById('showAllProjects');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }
    }

    loadMoreProjects() {
        // This would typically load more projects via AJAX
        // For now, show a placeholder message
        console.log('Loading more projects...');
        
        // You can implement AJAX call to load more projects
        // Example implementation:
        /*
        fetch('/api/projects/')
            .then(response => response.json())
            .then(data => {
                this.renderAdditionalProjects(data.projects);
            })
            .catch(error => {
                console.error('Error loading projects:', error);
            });
        */
    }

    setupSkillInteractions() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.showSkillTooltip(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.hideSkillTooltip();
            });
        });
    }

    showSkillTooltip(skillItem) {
        const skillName = skillItem.querySelector('.skill-name').textContent;
        const skillExperience = skillItem.querySelector('.skill-experience').textContent;
        
        // Create tooltip (basic implementation)
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = `<strong>${skillName}</strong><br>${skillExperience}`;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-dark);
            color: white;
            padding: 0.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = skillItem.getBoundingClientRect();
        tooltip.style.left = (rect.right + 10) + 'px';
        tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
        
        this.currentTooltip = tooltip;
    }

    hideSkillTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu and tooltips
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
                
                this.hideSkillTooltip();
            }
        });
    }
}

/**
 * Performance and analytics
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.trackUserInteractions();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.metrics = {
                pageLoadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: 0,
                firstContentfulPaint: 0
            };

            // Log performance in development
            if (this.isDevelopment()) {
                console.group('📊 Performance Metrics');
                console.log(`Page Load: ${this.metrics.pageLoadTime.toFixed(2)}ms`);
                console.log(`DOM Ready: ${this.metrics.domContentLoaded.toFixed(2)}ms`);
                console.groupEnd();
            }
        });
    }

    trackUserInteractions() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contactForm') {
                this.trackEvent('form_submit', 'contact');
            }
        });

        // Track navigation clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.target.getAttribute('href').replace('#', '');
                this.trackEvent('navigation', section);
            });
        });

        // Track external link clicks
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const url = e.target.href;
                this.trackEvent('external_link', url);
            });
        });
    }

    trackEvent(category, action) {
        if (this.isDevelopment()) {
            console.log(`Event: ${category} - ${action}`);
        }
        
        // Here you would integrate with your analytics service
        // Example: Google Analytics, Plausible, etc.
        /*
        gtag('event', action, {
            event_category: category,
            event_label: action
        });
        */
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    getMetrics() {
        return { ...this.metrics };
    }
}

/**
 * Accessibility enhancements
 */
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupReducedMotion();
    }

    setupFocusManagement() {
        // Ensure focus visibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // Skip to main content link
        this.addSkipLink();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLabels() {
        // Add aria labels to interactive elements without text
        const backToTop = document.getElementById('backToTop');
        if (backToTop && !backToTop.getAttribute('aria-label')) {
            backToTop.setAttribute('aria-label', 'Back to top');
        }

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn && !mobileMenuBtn.getAttribute('aria-label')) {
            mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
        }
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main portfolio functionality
    new ProfessionalPortfolio();
    
    // Initialize additional features
    new InteractiveFeatures();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Initialize accessibility enhancements
    new AccessibilityEnhancements();
    
    // Add CSS for keyboard focus
    const style = document.createElement('style');
    style.textContent = `
        body:not(.using-keyboard) *:focus {
            outline: none;
        }
        
        body.using-keyboard *:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProfessionalPortfolio,
        InteractiveFeatures,
        PerformanceMonitor,
        AccessibilityEnhancements
    };
}