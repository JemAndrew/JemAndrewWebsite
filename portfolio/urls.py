# portfolio/urls.py
from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = 'portfolio'

urlpatterns = [
    # Main pages
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('experience/', views.experience_view, name='experience'),
    path('education/', views.education_view, name='education'),
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
]