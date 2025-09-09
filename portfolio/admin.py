# portfolio/admin.py - Clean, professional version

from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import (
    Education, Experience, Project, Skill, 
    PersonalInfo, ContactMessage, SiteSettings
)

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
        ('Profile Image', {
            'fields': ('profile_image',),  # Just profile_image, no image_position
            'description': 'Upload any photo - Cloudinary will auto-detect face and crop perfectly.'
        }),
        ('Files & Links', {
            'fields': ('cv_file', 'github_url', 'linkedin_url')
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
    list_display = ['name', 'category', 'proficiency', 'years_experience']
    list_filter = ['category', 'proficiency']
    list_editable = ['proficiency']
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