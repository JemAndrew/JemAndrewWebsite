"""
Portfolio Website Settings

"""

import os
from pathlib import Path
from decouple import config

# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent


# Security stuff 


# Secret key for Django's cryptography stuff
# Generate new one: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

SECRET_KEY = config(
    'SECRET_KEY',
    default='django-insecure-dev-key-CHANGE-IN-PRODUCTION-abc123xyz789'
)

# Debug mode - detailed errors when True, generic pages when False

DEBUG = config('DEBUG', default=True, cast=bool)

# Which domains can access this site (security thing)
ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=lambda v: [s.strip() for s in v.split(',')]
)

# CSRF Trusted Origins - required for Railway deployment
CSRF_TRUSTED_ORIGINS = [
    'https://jemandrewwebsite-production.up.railway.app',
    'http://localhost:8001',
    'http://127.0.0.1:8001',
]
# Apps

# Keeping this minimal - only what's actually needed

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'portfolio',
]

# Add django_extensions only in development
if DEBUG:
    INSTALLED_APPS.append('django_extensions')


# Middleware - order matters here!


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Security headers
    'django.contrib.sessions.middleware.SessionMiddleware', 
    # Session management
    'whitenoise.middleware.WhiteNoiseMiddleware',     # Serve static files efficiently
    'django.middleware.common.CommonMiddleware',      # Common HTTP stuff
    'django.middleware.csrf.CsrfViewMiddleware',      # CSRF protection
    'django.contrib.messages.middleware.MessageMiddleware',  # Flash messages
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Anti-clickjacking
]


# URLs and Templates

ROOT_URLCONF = 'website_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.static',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'website_project.wsgi.application'


# Database

# Content is in data.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Locale settings

LANGUAGE_CODE = 'en-gb'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static Files (CSS, JS, images)

# Using WhiteNoise to serve these - works great even in production

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# WhiteNoise handles compression and cache headers automatically
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# Media Files (uploaded stuff like PDFs)


MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# Email Setup (for contact form)
# Resend API (for contact form)
RESEND_API_KEY = config('RESEND_API_KEY', default='')

# All credentials in .env file now - learned that lesson

EMAIL_BACKEND = config(
    'EMAIL_BACKEND',
    default='django.core.mail.backends.smtp.EmailBackend'
)

EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)

# These come from .env file

EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default=EMAIL_HOST_USER)


# GitHub API (optional feature)


GITHUB_TOKEN = config('GITHUB_TOKEN', default=None)
GITHUB_USERNAME = config('GITHUB_USERNAME', default='JemAndrew')


# Caching

# In-memory cache for things like GitHub API responses

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'portfolio-cache',
        'TIMEOUT': 3600,  # 1 hour
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}


# Logging

# Helpful for debugging issues

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'maxBytes': 1024 * 1024 * 5,  # 5MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'portfolio': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# Make sure logs directory exists

(BASE_DIR / 'logs').mkdir(exist_ok=True)


# Production Security Settings

# These kick in automatically when DEBUG=False

if not DEBUG:
    # Force HTTPS
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # HSTS - tells browsers to always use HTTPS
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Extra security headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    
    # For deployment platforms like Heroku, Railway, etc.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Misc Settings

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Cache templates in production for better performance

if not DEBUG:
    TEMPLATES[0]['OPTIONS']['loaders'] = [
        ('django.template.loaders.cached.Loader', [
            'django.template.loaders.filesystem.Loader',
            'django.template.loaders.app_directories.Loader',
        ]),
    ]

# Development convenience

if DEBUG:
    INTERNAL_IPS = ['127.0.0.1', 'localhost']
    if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['']:
        ALLOWED_HOSTS = ['*']

