from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    PersonalInfo, Education, Experience, Project, 
    Skill, ContactMessage, SiteSettings
)

# Customize the admin site
admin.site.site_header = "James Andrew - CV Management"
admin.site.site_title = "CV Admin"
admin.site.index_title = "Manage Your Portfolio"

@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'location', 'profile_image_preview')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'location')
        }),
        ('Profile Content', {
            'fields': ('bio', 'profile_image', 'typing_texts')
        }),
        ('Social Links', {
            'fields': ('github_url', 'linkedin_url')
        }),
        ('Documents', {
            'fields': ('cv_file',)
        }),
    )
    
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">',
                obj.profile_image.url
            )
        return "No image"
    profile_image_preview.short_description = "Profile Picture"

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'degree_type', 'subject', 'start_date', 'is_current', 'duration_display')
    list_filter = ('degree_type', 'is_current', 'start_date')
    search_fields = ('institution', 'subject', 'description')
    ordering = ('-start_date',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('institution', 'degree_type', 'subject', 'grade')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Details', {
            'fields': ('description', 'technologies_used')
        }),
        ('Display Options', {
            'fields': ('order',)
        }),
    )
    
    def duration_display(self, obj):
        return f"{obj.duration_years} years"
    duration_display.short_description = "Duration"

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'start_date', 'is_current', 'duration_display', 'location')
    list_filter = ('is_current', 'start_date', 'company')
    search_fields = ('company', 'position', 'description')
    ordering = ('-start_date',)
    
    fieldsets = (
        ('Position Details', {
            'fields': ('company', 'position', 'location')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Description', {
            'fields': ('description', 'skills_gained')
        }),
        ('Display Options', {
            'fields': ('order',)
        }),
    )
    
    def duration_display(self, obj):
        return f"{obj.duration_months} months"
    duration_display.short_description = "Duration"

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'featured', 'created_date', 'image_preview')
    list_filter = ('category', 'status', 'featured', 'created_date')
    search_fields = ('title', 'short_description', 'technologies')
    list_editable = ('featured', 'status')
    ordering = ('-featured', '-created_date')
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'short_description', 'detailed_description')
        }),
        ('Classification', {
            'fields': ('category', 'status', 'featured')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'created_date')
        }),
        ('Links & Media', {
            'fields': ('github_url', 'live_demo_url', 'image')
        }),
        ('Display Options', {
            'fields': ('order',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;">',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Preview"

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency_display', 'years_experience', 'color_preview')
    list_filter = ('category', 'proficiency')
    search_fields = ('name', 'description')
    list_editable = ('proficiency',)
    ordering = ('category', '-proficiency')
    
    fieldsets = (
        ('Skill Information', {
            'fields': ('name', 'category', 'description')
        }),
        ('Experience Level', {
            'fields': ('proficiency', 'years_experience')
        }),
        ('Display Options', {
            'fields': ('icon_class', 'color', 'order')
        }),
    )
    
    def proficiency_display(self, obj):
        return f"{obj.get_proficiency_display()} ({obj.proficiency_percentage}%)"
    proficiency_display.short_description = "Proficiency"
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border-radius: 50%; border: 1px solid #ddd;"></div>',
            obj.color
        )
    color_preview.short_description = "Color"

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'email', 'created_at', 'is_read', 'replied')
    list_filter = ('is_read', 'replied', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
    list_editable = ('is_read', 'replied')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'created_at')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'replied')
        }),
    )

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_title', 'theme_color', 'enable_dark_mode')
    
    fieldsets = (
        ('Site Information', {
            'fields': ('site_title', 'site_description')
        }),
        ('Appearance', {
            'fields': ('theme_color', 'enable_dark_mode')
        }),
        ('Analytics', {
            'fields': ('google_analytics_id',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one SiteSettings instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of SiteSettings
        return False