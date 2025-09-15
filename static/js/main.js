/**
 * Professional Portfolio JavaScript with Advanced Animations
 * Enhanced with GitHub integration and smooth animations
 */

class AdvancedPortfolio {
    constructor() {
        this.animationQueue = [];
        this.observers = new Map();
        this.githubData = null;
        this.init();
    }

    init() {
        this.setupPageLoader();
        this.setupAdvancedNavigation();
        this.setupScrollEffects();
        this.setupAdvancedAnimations();
        this.setupGitHubIntegration();
        this.setupFormHandling();
        this.setupPerformanceMonitoring();
        this.setupInteractiveElements();
        
        console.log('Advanced Portfolio initialized with GitHub integration');
    }

    /**
     * Page Loader with Advanced Animation
     */
    setupPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Portfolio...</div>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Hide loader after content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 1000);
        });
    }

    /**
     * Advanced Navigation with Hide/Show
     */
    setupAdvancedNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        let lastScrollY = window.scrollY;
        let ticking = false;

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active link with animation
                this.updateActiveLink(link, navLinks);
                
                // Smooth scroll to section
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    this.smoothScrollTo(offsetTop, 800);
                }
            });
        });

        // Advanced scroll handler
        const updateNavbar = () => {
            const scrollY = window.scrollY;
            
            // Hide/show navbar based on scroll direction
            if (scrollY > 100) {
                if (scrollY > lastScrollY) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }
            }
            
            // Add scrolled class
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active navigation
            this.updateActiveNavigation();
            
            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateActiveLink(activeLink, allLinks) {
        allLinks.forEach(link => {
            link.classList.remove('active');
            // Reset any active animations
            link.style.transform = '';
        });
        
        activeLink.classList.add('active');
        
        // Add activation animation
        activeLink.style.transform = 'scale(1.05)';
        setTimeout(() => {
            activeLink.style.transform = '';
        }, 200);
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

    smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentY = startY + (difference * easeInOutCubic);
            window.scrollTo(0, currentY);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /**
     * Advanced Scroll Effects and Animations
     */
    setupScrollEffects() {
        // Back to top button
        const backToTop = this.createBackToTopButton();
        
        // Parallax effect for hero elements
        this.setupParallaxEffects();
        
        // Progress indicator
        this.setupScrollProgress();
        
        // Enhanced scroll animations
        this.setupScrollAnimations();
    }

    createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.title = 'Back to top';
        
        document.body.appendChild(backToTop);
        
        let isVisible = false;
        
        const toggleVisibility = () => {
            const shouldShow = window.scrollY > 300;
            
            if (shouldShow && !isVisible) {
                backToTop.classList.add('show');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                backToTop.classList.remove('show');
                isVisible = false;
            }
        };

        window.addEventListener('scroll', this.throttle(toggleVisibility, 100), { passive: true });

        backToTop.addEventListener('click', () => {
            this.smoothScrollTo(0, 800);
            
            // Add click animation
            backToTop.style.transform = 'scale(0.9)';
            setTimeout(() => {
                backToTop.style.transform = '';
            }, 150);
        });

        return backToTop;
    }

    setupParallaxEffects() {
        const heroElements = document.querySelectorAll('.hero::before, .hero::after');
        
        if (heroElements.length === 0) return;
        
        const handleParallax = () => {
            const scrollY = window.scrollY;
            const rate = scrollY * -0.5;
            
            heroElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        };

        window.addEventListener('scroll', this.throttle(handleParallax, 16), { passive: true });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #dc2626, #b91c1c);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        const updateProgress = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 16), { passive: true });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        document.querySelectorAll('.animate-on-scroll, section, .card, .github-repo').forEach(el => {
            el.classList.add('animate-on-scroll');
            animationObserver.observe(el);
        });

        this.observers.set('animation', animationObserver);
    }

    animateElement(element) {
        if (element.classList.contains('animate-in')) return;
        
        element.classList.add('animate-in');
        
        // Add stagger effect for multiple elements
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        
        if (index > 0) {
            element.style.transitionDelay = `${index * 0.1}s`;
        }
        
        // Special animations for specific elements
        if (element.classList.contains('github-repo')) {
            this.animateGitHubRepo(element);
        }
        
        if (element.classList.contains('card')) {
            this.animateCard(element);
        }
    }

    animateGitHubRepo(element) {
        // Animate GitHub repository cards
        setTimeout(() => {
            element.style.transform = 'translateY(0) scale(1)';
            element.style.opacity = '1';
        }, 100);
        
        // Animate child elements
        const repoName = element.querySelector('.repo-name');
        const repoStats = element.querySelector('.repo-stats');
        const repoLanguages = element.querySelector('.repo-languages');
        
        [repoName, repoStats, repoLanguages].forEach((el, index) => {
            if (el) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200 + (index * 100));
            }
        });
    }

    animateCard(element) {
        // Enhanced card animations
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0) scale(1)';
        });
    }

    /**
     * Advanced Animations Setup
     */
    setupAdvancedAnimations() {
        this.setupTypewriterEffect();
        this.setupCounterAnimations();
        this.setupMorphingShapes();
        this.setupInteractiveHovers();
    }

    setupTypewriterEffect() {
        const typeElements = document.querySelectorAll('[data-typewriter]');
        
        typeElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid #dc2626';
            
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' 
                            ? '2px solid #dc2626' 
                            : 'none';
                    }, 500);
                }
            };
            
            // Start typewriter when element comes into view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.disconnect();
                }
            });
            
            observer.observe(element);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const suffix = counter.dataset.suffix || '';
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    this.animateCounter(counter, 0, target, duration, suffix);
                    observer.disconnect();
                }
            });
            
            observer.observe(counter);
        });
    }

    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const range = end - start;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * easedProgress));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    setupMorphingShapes() {
        // Add subtle morphing shapes in the background
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const shapes = [];
        for (let i = 0; i < 3; i++) {
            const shape = document.createElement('div');
            shape.style.cssText = `
                position: absolute;
                width: ${100 + i * 50}px;
                height: ${100 + i * 50}px;
                background: linear-gradient(45deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02));
                border-radius: 50%;
                top: ${20 + i * 20}%;
                left: ${10 + i * 30}%;
                animation: morphFloat ${6 + i * 2}s ease-in-out infinite;
                animation-delay: ${i * 2}s;
                z-index: 1;
            `;
            
            hero.appendChild(shape);
            shapes.push(shape);
        }
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes morphFloat {
                0%, 100% { 
                    transform: translateY(0px) scale(1) rotate(0deg);
                    border-radius: 50%;
                }
                25% { 
                    transform: translateY(-20px) scale(1.1) rotate(5deg);
                    border-radius: 60% 40% 40% 60%;
                }
                50% { 
                    transform: translateY(-30px) scale(0.9) rotate(10deg);
                    border-radius: 40% 60% 60% 40%;
                }
                75% { 
                    transform: translateY(-10px) scale(1.05) rotate(-5deg);
                    border-radius: 55% 45% 45% 55%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupInteractiveHovers() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .card, .nav-link, .github-repo');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        // Add ripple styles
        circle.style.cssText += `
            position: absolute;
            border-radius: 50%;
            background: rgba(220, 38, 38, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rippleAnimation = circle.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        // Ensure button has position relative
        const buttonStyle = getComputedStyle(button);
        if (buttonStyle.position === 'static') {
            button.style.position = 'relative';
        }
        
        button.appendChild(circle);
        
        rippleAnimation.onfinish = () => {
            circle.remove();
        };
    }

    /**
     * GitHub Integration
     */
    setupGitHubIntegration() {
        this.loadGitHubData();
        this.setupGitHubAnimations();
    }

    async loadGitHubData() {
        try {
            // Check if GitHub data is already loaded via Django context
            if (window.githubData) {
                this.githubData = window.githubData;
                this.renderGitHubData();
                return;
            }

            // Fallback: Load GitHub data via AJAX if not in context
            const response = await fetch('/api/github-data/');
            if (response.ok) {
                this.githubData = await response.json();
                this.renderGitHubData();
            } else {
                console.log('GitHub data not available, using fallback');
                this.renderFallbackGitHubData();
            }
        } catch (error) {
            console.error('Failed to load GitHub data:', error);
            this.renderFallbackGitHubData();
        }
    }

    renderGitHubData() {
        if (!this.githubData) return;

        // Render GitHub stats
        this.renderGitHubStats();
        
        // Render repositories
        this.renderGitHubRepos();
        
        // Render language statistics
        this.renderLanguageStats();
        
        // Render contribution calendar
        this.renderContributionCalendar();
    }

    renderGitHubStats() {
        const statsContainer = document.getElementById('github-stats');
        if (!statsContainer || !this.githubData.github_user) return;

        const user = this.githubData.github_user;
        const stats = [
            { label: 'Repositories', value: user.public_repos || 0, icon: 'fas fa-code-branch' },
            { label: 'Followers', value: user.followers || 0, icon: 'fas fa-users' },
            { label: 'Following', value: user.following || 0, icon: 'fas fa-user-plus' },
            { label: 'Total Stars', value: this.calculateTotalStars(), icon: 'fas fa-star' }
        ];

        statsContainer.innerHTML = stats.map((stat, index) => `
            <div class="github-stat animate-on-scroll" style="animation-delay: ${index * 0.1}s">
                <i class="${stat.icon}" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                <span class="github-stat-value" data-counter="${stat.value}">${stat.value}</span>
                <span class="github-stat-label">${stat.label}</span>
            </div>
        `).join('');

        // Animate counters
        this.setupCounterAnimations();
    }

    renderGitHubRepos() {
        const reposContainer = document.getElementById('github-repos');
        if (!reposContainer || !this.githubData.github_repos) return;

        const repos = this.githubData.github_repos.slice(0, 6); // Show top 6 repos

        reposContainer.innerHTML = repos.map((repo, index) => `
            <div class="github-repo animate-on-scroll" style="animation-delay: ${index * 0.1}s">
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">
                        <i class="fas fa-code-branch me-2"></i>${repo.name}
                    </a>
                    ${repo.language ? `<span class="language-tag">${repo.language}</span>` : ''}
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    ${repo.stars ? `<span class="repo-stat"><i class="fas fa-star"></i> ${repo.stars}</span>` : ''}
                    ${repo.forks ? `<span class="repo-stat"><i class="fas fa-code-branch"></i> ${repo.forks}</span>` : ''}
                    <span class="repo-stat"><i class="fas fa-clock"></i> ${this.timeAgo(repo.updated_at)}</span>
                </div>
                ${this.renderRepoLanguages(repo.languages)}
            </div>
        `).join('');
    }

    renderRepoLanguages(languages) {
        if (!languages || Object.keys(languages).length === 0) return '';
        
        const topLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        return `
            <div class="repo-languages">
                ${topLanguages.map(([lang, percent]) => 
                    `<span class="language-tag" style="background: ${this.getLanguageColor(lang)}">${lang}</span>`
                ).join('')}
            </div>
        `;
    }

    renderLanguageStats() {
        const languageContainer = document.getElementById('language-stats');
        if (!languageContainer || !this.githubData.github_languages) return;

        const languages = Object.entries(this.githubData.github_languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        languageContainer.innerHTML = `
            <h4>Most Used Languages</h4>
            <div class="language-chart">
                ${languages.map(([lang, percent], index) => `
                    <div class="language-item" style="animation-delay: ${index * 0.1}s">
                        <div class="language-info">
                            <span class="language-name">${lang}</span>
                            <span class="language-percentage">${percent}%</span>
                        </div>
                        <div class="language-bar">
                            <div class="language-fill" 
                                 style="width: 0%; background: ${this.getLanguageColor(lang)}; transition: width 1s ease ${index * 0.1}s"
                                 data-width="${percent}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Animate language bars
        setTimeout(() => {
            document.querySelectorAll('.language-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 500);
    }

    renderContributionCalendar() {
        const calendarContainer = document.getElementById('contribution-calendar');
        if (!calendarContainer || !this.githubData.github_calendar) return;

        // Simplified contribution calendar
        const calendar = this.githubData.github_calendar;
        const weeks = this.groupCalendarByWeeks(calendar);

        calendarContainer.innerHTML = `
            <h4>Contribution Activity</h4>
            <div class="contribution-grid">
                ${weeks.map(week => `
                    <div class="contribution-week">
                        ${week.map(day => `
                            <div class="contribution-day level-${day.level}" 
                                 title="${day.count} contributions on ${day.date}"></div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderFallbackGitHubData() {
        // Render static data when GitHub API is unavailable
        const statsContainer = document.getElementById('github-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="github-stat">
                    <i class="fas fa-code-branch" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                    <span class="github-stat-value">5+</span>
                    <span class="github-stat-label">Repositories</span>
                </div>
                <div class="github-stat">
                    <i class="fas fa-star" style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                    <span class="github-stat-value">20+</span>
                    <span class="github-stat-label">Total Stars</span>
                </div>
            `;
        }
    }

    setupGitHubAnimations() {
        // Add hover effects to GitHub repositories
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.github-repo')) {
                const repo = e.target.closest('.github-repo');
                repo.style.transform = 'translateY(-4px) scale(1.01)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.github-repo')) {
                const repo = e.target.closest('.github-repo');
                repo.style.transform = 'translateY(0) scale(1)';
            }
        });
    }

    // Utility functions
    calculateTotalStars() {
        if (!this.githubData?.github_repos) return 0;
        return this.githubData.github_repos.reduce((total, repo) => total + (repo.stars || 0), 0);
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    }

    getLanguageColor(language) {
        const colors = {
            'Python': 'rgba(220, 38, 38, 0.8)',
            'JavaScript': 'rgba(241, 224, 90, 0.8)',
            'TypeScript': 'rgba(49, 120, 198, 0.8)',
            'HTML': 'rgba(227, 76, 38, 0.8)',
            'CSS': 'rgba(21, 114, 182, 0.8)',
            'Java': 'rgba(176, 114, 25, 0.8)',
            'C++': 'rgba(243, 75, 125, 0.8)',
            'Go': 'rgba(0, 173, 181, 0.8)',
            'Rust': 'rgba(222, 165, 132, 0.8)',
            'PHP': 'rgba(79, 93, 149, 0.8)'
        };
        return colors[language] || 'rgba(100, 116, 139, 0.8)';
    }

    groupCalendarByWeeks(calendar) {
        const weeks = [];
        let currentWeek = [];
        
        calendar.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || index === calendar.length - 1) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });
        
        return weeks;
    }

    /**
     * Form Handling with Enhanced Validation
     */
    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea');
        
        // Enhanced form validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            input.addEventListener('focus', () => this.addFocusEffect(input));
        });

        contactForm.addEventListener('submit', (e) => {
            this.handleFormSubmission(e, contactForm);
        });
    }

    addFocusEffect(input) {
        const parent = input.closest('.form-group');
        if (parent) {
            parent.classList.add('focused');
            
            // Add subtle glow effect
            input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            input.style.borderColor = 'var(--primary-color)';
        }
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';

        // Remove focus effects
        const parent = input.closest('.form-group');
        if (parent) {
            parent.classList.remove('focused');
            input.style.boxShadow = '';
            input.style.borderColor = '';
        }

        // Validation logic
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        } else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }

        this.showFieldError(input, isValid ? '' : errorMessage);
        return isValid;
    }

    handleFormSubmission(e, form) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.shakeForm(form);
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        this.setButtonLoading(submitBtn, true);

        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            this.setButtonLoading(submitBtn, false, originalText);
            this.showSuccessMessage();
            form.reset();
            this.addSuccessAnimation(form);
        }, 2000);
    }

    shakeForm(form) {
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);

        // Add shake keyframe if not exists
        if (!document.querySelector('#shake-keyframe')) {
            const style = document.createElement('style');
            style.id = 'shake-keyframe';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addSuccessAnimation(form) {
        const successIcon = document.createElement('div');
        successIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        successIcon.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 3rem;
            color: var(--success-color);
            animation: successPop 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        form.style.position = 'relative';
        form.appendChild(successIcon);

        // Add success animation keyframe
        if (!document.querySelector('#success-keyframe')) {
            const style = document.createElement('style');
            style.id = 'success-keyframe';
            style.textContent = `
                @keyframes successPop {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            successIcon.remove();
        }, 600);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.style.borderColor = 'var(--danger-color)';
            field.style.backgroundColor = 'rgba(220, 38, 38, 0.02)';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: var(--danger-color);
                font-size: 0.875rem;
                margin-top: 0.25rem;
                animation: slideInDown 0.3s ease;
            `;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setButtonLoading(button, loading, originalText = '') {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            button.style.pointerEvents = 'none';
        } else {
            button.disabled = false;
            button.innerHTML = originalText || '<i class="fas fa-paper-plane"></i> Send Message';
            button.style.pointerEvents = '';
        }
    }

    showSuccessMessage() {
        const message = this.createNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    createNotification(text, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${text}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });

        return notification;
    }

    /**
     * Performance Monitoring
     */
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'paint') {
                        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
                    }
                });
            });

            observer.observe({ entryTypes: ['paint', 'navigation'] });
        }

        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in: ${loadTime.toFixed(2)}ms`);
        });
    }

    /**
     * Interactive Elements
     */
    setupInteractiveElements() {
        this.setupMobileMenu();
        this.setupKeyboardNavigation();
        this.addCustomCursor();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuBtn || !navMenu) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            } else {
                navMenu.classList.add('active');
                mobileMenuBtn.classList.add('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key functionality
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
                
                // Close any open notifications
                document.querySelectorAll('.notification').forEach(n => n.remove());
            }
        });
    }

    addCustomCursor() {
        // Only add custom cursor on non-touch devices
        if ('ontouchstart' in window) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(220, 38, 38, 0.3);
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            opacity: 0;
        `;

        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Scale cursor on hover over interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, .btn, .card, .github-repo, input, textarea')) {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button, .btn, .card, .github-repo, input, textarea')) {
                cursor.style.transform = 'scale(1)';
                cursor.style.backgroundColor = 'rgba(220, 38, 38, 0.3)';
            }
        });
    }

    // Utility methods
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPortfolio();
    
    // Add additional animation keyframes
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideInDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary-gradient);
            color: white;
            border: none;
            border-radius: var(--radius-lg);
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 1.25rem;
            box-shadow: var(--shadow-lg);
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: var(--shadow-glow);
        }
    `;
    document.head.appendChild(additionalStyles);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedPortfolio };
}