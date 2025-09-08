from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = 'portfolio'

urlpatterns = [
    # Main pages
    path('', views.home_view, name='home'),
    path('education/', views.education_view, name='education'),
    path('cv/', views.cv_view, name='cv'),
    path('projects/', views.projects_view, name='projects'),
    path('projects/<int:project_id>/', views.project_detail_view, name='project_detail'),
    path('skills/', views.skills_view, name='skills'),
    path('contact/', views.contact_view, name='contact'),
    
    # AJAX endpoints
    path('ajax/contact/', views.ajax_contact_view, name='ajax_contact'),
    
    # API endpoints
    path('api/skills/', views.api_skills_view, name='api_skills'),
    path('api/projects/', views.api_projects_view, name='api_projects'),
    
    # File downloads
    path('download/cv/', views.download_cv_view, name='download_cv'),
    
    # Additional utility pages
    path('sitemap/', TemplateView.as_view(
        template_name='portfolio/sitemap.html',
        extra_context={'page_title': 'Sitemap'}
    ), name='sitemap'),
    
    path('privacy/', TemplateView.as_view(
        template_name='portfolio/privacy.html',
        extra_context={'page_title': 'Privacy Policy'}
    ), name='privacy'),
]


# Main project URLs (cv_website/urls.py)
main_urls_content = """
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.contrib.sitemaps.views import sitemap
from portfolio.sitemaps import StaticViewSitemap, ProjectSitemap

# Sitemaps
sitemaps = {
    'static': StaticViewSitemap,
    'projects': ProjectSitemap,
}

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Main portfolio app
    path('', include('portfolio.urls')),
    
    # SEO URLs
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('robots.txt', TemplateView.as_view(template_name='robots.txt', content_type='text/plain')),
    
    # Favicon redirect
    path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'images/favicon.ico')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error pages
handler404 = 'portfolio.views.custom_404_view'
handler500 = 'portfolio.views.custom_500_view'
"""

print("Main URLs configuration:")
print(main_urls_content)