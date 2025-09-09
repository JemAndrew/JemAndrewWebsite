# Replace your portfolio/admin.py with this:

from django.contrib import admin
from .models import (
    Education, Experience, Project, Skill, 
    PersonalInfo, ContactMessage, SiteSettings
)
from django.contrib import admin
from image_cropping import ImageCroppingMixin
from .models import PersonInfo

@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'email', 'location']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'location')
        }),
        ('Bio & Content', {
            'fields': ('bio', 'typing_texts')
        }),
        ('Files & Links', {
            'fields': ('profile_image', 'cv_file', 'github_url', 'linkedin_url')
        }),
    )

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['institution', 'degree_type', 'subject', 'start_date', 'end_date', 'is_current']
    list_filter = ['degree_type', 'is_current']
    ordering = ['-start_date']

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['company', 'position', 'start_date', 'end_date', 'is_current']
    list_filter = ['is_current']
    ordering = ['-start_date']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'featured', 'created_date']
    list_filter = ['category', 'status', 'featured']
    list_editable = ['featured', 'status']
    ordering = ['-created_date']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'years_experience']  # Include proficiency here
    list_filter = ['category', 'proficiency']
    list_editable = ['proficiency']  # Now proficiency is in list_display, so this works
    ordering = ['category', '-proficiency']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'theme_color', 'enable_dark_mode']

@admin.register(PersonalInfo)
class PersonalInfoAdmin(ImageCroppingMixin, admin.ModelAdmin):  # ADD ImageCroppingMixin
    list_display = ['name', 'title', 'email', 'location']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'location')
        }),
        ('Bio & Content', {
            'fields': ('bio', 'typing_texts')
        }),
        ('Profile Image', {
            'fields': ('profile_image', 'cropping'),  # Include the cropping field
            'description': 'Upload an image and use the cropping tool below to position it perfectly'
        }),
        ('Files & Links', {
            'fields': ('cv_file', 'github_url', 'linkedin_url')
        }),
    )
