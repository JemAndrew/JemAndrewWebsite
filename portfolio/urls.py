# portfolio/urls.py - Simplified for single page portfolio
from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    # Main single-page portfolio
    path('', views.home_view, name='home'),
    
    # AJAX endpoints (keep these for functionality)
    path('ajax/contact/', views.ajax_contact_view, name='ajax_contact'),
    
    # API endpoints (optional - for future use)
    path('api/skills/', views.api_skills_view, name='api_skills'),
    path('api/projects/', views.api_projects_view, name='api_projects'),
    
    # Optional: Keep these if you want individual project pages
    # path('project/<int:project_id>/', views.project_detail_view, name='project_detail'),
]