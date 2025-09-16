# portfolio/urls.py - Fixed syntax
from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    # Main pages
    path('', views.home_view, name='home'),
    path('education/', views.education_view, name='education'),
    path('projects/', views.projects_view, name='projects'),

    
    # Dissertation downloads
    path('download/msc-dissertation/', views.download_msc_dissertation, name='download_msc'),
    path('download/bsc-dissertation/', views.download_bsc_dissertation, name='download_bsc'),
]