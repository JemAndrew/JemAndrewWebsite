# portfolio/admin.py

from django.contrib import admin
from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
from adminsortable2.admin import SortableAdminMixin
from rangefilter.filters import DateRangeFilter
from .models import *

# Use Unfold's ModelAdmin instead of admin.ModelAdmin
@admin.register(PersonalInfo)
class PersonalInfoAdmin(ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': (('name', 'title'), ('email', 'phone'), 'location')
        }),
        ('Professional Summary', {
            'fields': ('bio', 'typing_texts'),
        }),
        ('Links & Media', {
            'fields': (('github_url', 'linkedin_url'), ('profile_image', 'cv_file'))
        }),
    )
    
    def has_add_permission(self, request):
        return not PersonalInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Education)
class EducationAdmin(ModelAdmin):
    list_display = ['institution', 'degree_type', 'subject', 'grade', 'date_range', 'is_current']
    list_filter = ['degree_type', 'is_current']
    search_fields = ['institution', 'subject']
    ordering = ['-start_date']
    
    def date_range(self, obj):
        end = "Present" if obj.is_current else str(obj.end_date.year) if obj.end_date else "N/A"
        return f"{obj.start_date.year} - {end}"
    date_range.short_description = "Period"

@admin.register(Experience)
class ExperienceAdmin(ModelAdmin):
    list_display = ['company', 'position', 'location', 'date_range', 'is_current']
    list_filter = ['is_current']
    search_fields = ['company', 'position']
    ordering = ['-start_date']
    
    def date_range(self, obj):
        end = "Present" if obj.is_current else obj.end_date.strftime('%b %Y') if obj.end_date else "N/A"
        return f"{obj.start_date.strftime('%b %Y')} - {end}"
    date_range.short_description = "Period"

@admin.register(Project)
class ProjectAdmin(SortableAdminMixin, ModelAdmin):
    list_display = ['order', 'title', 'category', 'status', 'featured', 'created_date']
    list_display_links = ['title']
    list_filter = ['category', 'status', 'featured']
    search_fields = ['title', 'technologies']
    ordering = ['order']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'short_description', ('category', 'status'), 'featured')
        }),
        ('Details', {
            'fields': ('detailed_description', 'technologies')
        }),
        ('Links & Media', {
            'fields': (('github_url', 'live_demo_url'), 'image', 'created_date')
        }),
    )

@admin.register(Skill)
class SkillAdmin(ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'years_experience']
    list_filter = ['category', 'proficiency']
    list_editable = ['proficiency', 'years_experience']
    search_fields = ['name']
    ordering = ['category', '-proficiency']

@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ['created_at', 'name', 'email', 'subject', 'is_read', 'replied']
    list_filter = ['is_read', 'replied']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    ordering = ['-created_at']
    
    actions = ['mark_as_read', 'mark_as_replied']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} messages marked as read.')
    
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(replied=True, is_read=True)
        self.message_user(request, f'{updated} messages marked as replied.')
    
    def has_add_permission(self, request):
        return False

@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    fieldsets = (
        ('Site Information', {
            'fields': ('site_title', 'site_description'),
        }),
        ('Appearance', {
            'fields': ('theme_color', 'enable_dark_mode'),
        }),
    )
    
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False