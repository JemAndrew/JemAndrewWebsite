from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('projects/', views.projects_view, name='projects'),
    path('education/', views.education_view, name='education'),
    path('download/msc-dissertation/', views.download_msc_dissertation, name='download_msc'),
    path('download/bsc-dissertation/', views.download_bsc_dissertation, name='download_bsc'),
]