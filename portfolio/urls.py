from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    # Home is the hero page
    path('', views.home_view, name='home'),
    # About Me is a separate detailed page
    path('about/', views.about_view, name='about'),
    path('projects/', views.projects_view, name='projects'),
    path('education/', views.education_view, name='education'),
    path('download/msc-dissertation/', views.download_msc_dissertation, name='download_msc'),
    path('download/bsc-dissertation/', views.download_bsc_dissertation, name='download_bsc'),
]