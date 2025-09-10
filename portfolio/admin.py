from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from .models import (
    PersonalInfo, Education, Experience, Project, 
    Skill, ContactMessage, SiteSettings
)

# Customize admin site headers
admin.site.site_header = "Portfolio Admin"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to Your Portfolio Management"


@admin.register(PersonalInfo)
class PersonalInfoAdmin(admin.ModelAdmin):
    """Admin for personal information - singleton model"""
    
    list_display = ['name', 'title', 'email', 'location', 'has_photo', 'has_cv']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'location'),
            'description': 'Your core contact details displayed across the site'
        }),
        ('Professional Summary', {
            'fields': ('bio', 'typing_texts'),
            'description': 'Bio and animated typing phrases for the homepage'
        }),
        ('Profile Photo', {
            'fields': ('profile_image',),
            'description': 'Upload any photo - Cloudinary will auto-detect and zoom to your face'
        }),
        ('Professional Links', {
            'fields': ('cv_file', 'github_url', 'linkedin_url'),
            'description': 'Resume file and social media links'
        }),
    )
    
    def has_photo(self, obj):
        """Check if profile photo exists"""
        return bool(obj.profile_image)
    has_photo.boolean = True
    has_photo.short_description = 'Photo'
    
    def has_cv(self, obj):
        """Check if CV file exists"""
        return bool(obj.cv_file)
    has_cv.boolean = True
    has_cv.short_description = 'CV'
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        messages.success(request, 'Personal information updated successfully!')
    
    def has_add_permission(self, request):
        """Only allow one PersonalInfo instance"""
        return not PersonalInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of personal info"""
        return False
    
    class Media:
        css = {
            'all': ('css/admin.css',)
        }
        js = ('js/main.js',)  # Includes auto-save


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    """Admin for educational qualifications"""
    
    list_display = ['institution', 'degree_type', 'subject', 'grade', 'date_range', 'is_current']
    list_filter = ['degree_type', 'is_current']
    search_fields = ['institution', 'subject']
    ordering = ['-start_date']
    
    fieldsets = (
        ('Institution & Degree', {
            'fields': ('institution', 'degree_type', 'subject', 'grade'),
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'is_current'),
            'description': 'Leave end date blank if currently studying'
        }),
        ('Details', {
            'fields': ('description', 'technologies_used'),
        }),
        ('Display Order', {
            'fields': ('order',),
            'classes': ('collapse',),
        }),
    )
    
    def date_range(self, obj):
        """Display date range"""
        end = obj.end_date.strftime('%Y') if obj.end_date else 'Present'
        return f"{obj.start_date.strftime('%Y')} - {end}"
    date_range.short_description = 'Period'
    
    class Media:
        css = {
            'all': ('css/admin-enhancements.css',)
        }


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    """Admin for work experience"""
    
    list_display = ['company', 'position', 'location', 'date_range', 'is_current', 'duration']
    list_filter = ['is_current', 'company']
    search_fields = ['company', 'position', 'description']
    ordering = ['-start_date']
    
    fieldsets = (
        ('Position Details', {
            'fields': ('company', 'position', 'location'),
        }),
        ('Employment Period', {
            'fields': ('start_date', 'end_date', 'is_current'),
            'description': 'Mark as current if you still work here'
        }),
        ('Job Description', {
            'fields': ('description', 'skills_gained'),
            'description': 'Use bullet points for better readability'
        }),
        ('Display Order', {
            'fields': ('order',),
            'classes': ('collapse',),
        }),
    )
    
    def date_range(self, obj):
        """Display date range"""
        end = obj.end_date.strftime('%b %Y') if obj.end_date else 'Present'
        return f"{obj.start_date.strftime('%b %Y')} - {end}"
    date_range.short_description = 'Period'
    
    def duration(self, obj):
        """Display duration in human-readable format"""
        months = obj.duration_months
        if months < 12:
            return f"{int(months)} months"
        years = months / 12
        if years == int(years):
            return f"{int(years)} years"
        return f"{years:.1f} years"
    duration.short_description = 'Duration'
    
    class Media:
        css = {
            'all': ('css/admin-enhancements.css',)
        }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin for portfolio projects"""
    
    list_display = ['title', 'category', 'status', 'featured', 'has_demo', 'has_github', 'created_date']
    list_filter = ['category', 'status', 'featured']
    list_editable = ['featured', 'status']
    search_fields = ['title', 'short_description', 'technologies']
    date_hierarchy = 'created_date'
    ordering = ['-featured', '-created_date']
    
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'short_description', 'category', 'status', 'featured'),
        }),
        ('Detailed Description', {
            'fields': ('detailed_description',),
        }),
        ('Technologies & Links', {
            'fields': ('technologies', 'github_url', 'live_demo_url'),
            'description': 'Comma-separated list of technologies'
        }),
        ('Media', {
            'fields': ('image',),
            'description': 'Project screenshot or logo'
        }),
        ('Metadata', {
            'fields': ('created_date', 'order'),
            'classes': ('collapse',),
        }),
    )
    
    def has_demo(self, obj):
        """Check if project has live demo"""
        return bool(obj.live_demo_url)
    has_demo.boolean = True
    has_demo.short_description = 'Demo'
    
    def has_github(self, obj):
        """Check if project has GitHub link"""
        return bool(obj.github_url)
    has_github.boolean = True
    has_github.short_description = 'GitHub'
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.featured:
            messages.info(request, f'"{obj.title}" is now featured on your homepage!')
    
    actions = ['make_featured', 'remove_featured']
    
    def make_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        messages.success(request, f'{updated} projects marked as featured')
    make_featured.short_description = "Mark selected as featured"
    
    def remove_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        messages.success(request, f'{updated} projects removed from featured')
    remove_featured.short_description = "Remove from featured"
    
    class Media:
        css = {
            'all': ('css/admin-enhancements.css',)
        }


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Admin for technical skills"""
    
    list_display = ['name', 'category', 'proficiency_display', 'years_experience', 'icon_preview']
    list_filter = ['category', 'proficiency']
    list_editable = ['years_experience']
    search_fields = ['name', 'description']
    ordering = ['category', '-proficiency']
    
    fieldsets = (
        ('Skill Information', {
            'fields': ('name', 'category', 'proficiency', 'years_experience'),
        }),
        ('Description', {
            'fields': ('description',),
        }),
        ('Visual Settings', {
            'fields': ('icon_class', 'color'),
            'description': 'Icon class (e.g., fab fa-python) and hex color for visualizations',
            'classes': ('collapse',),
        }),
        ('Display Order', {
            'fields': ('order',),
            'classes': ('collapse',),
        }),
    )
    
    def proficiency_display(self, obj):
        """Display proficiency as text with percentage"""
        return f"{obj.get_proficiency_display()} ({obj.proficiency_percentage}%)"
    proficiency_display.short_description = 'Proficiency'
    
    def icon_preview(self, obj):
        """Preview of the icon if set"""
        if obj.icon_class:
            return format_html('<i class="{}"></i>', obj.icon_class)
        return '-'
    icon_preview.short_description = 'Icon'
    
    class Media:
        css = {
            'all': (
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
                'css/admin-enhancements.css',
            )
        }


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Admin for contact form messages"""
    
    list_display = ['name', 'email', 'subject_preview', 'created_at', 'is_read', 'replied']
    list_filter = ['is_read', 'replied', 'created_at']
    list_editable = ['is_read', 'replied']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Sender Information', {
            'fields': ('name', 'email'),
        }),
        ('Message Content', {
            'fields': ('subject', 'message', 'created_at'),
        }),
        ('Status', {
            'fields': ('is_read', 'replied'),
            'description': 'Track message status'
        }),
    )
    
    def subject_preview(self, obj):
        """Show truncated subject"""
        return obj.subject[:50] + '...' if len(obj.subject) > 50 else obj.subject
    subject_preview.short_description = 'Subject'
    
    def has_add_permission(self, request):
        """Prevent manual message creation"""
        return False
    
    actions = ['mark_as_read', 'mark_as_unread', 'mark_as_replied']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        messages.success(request, f'{updated} messages marked as read')
    mark_as_read.short_description = "Mark as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        messages.success(request, f'{updated} messages marked as unread')
    mark_as_unread.short_description = "Mark as unread"
    
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(replied=True)
        messages.success(request, f'{updated} messages marked as replied')
    mark_as_replied.short_description = "Mark as replied"
    
    class Media:
        css = {
            'all': ('css/admin-enhancements.css',)
        }


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Admin for site-wide settings"""
    
    fieldsets = (
        ('Site Information', {
            'fields': ('site_title', 'site_description'),
        }),
        ('Appearance', {
            'fields': ('theme_color', 'enable_dark_mode'),
        }),
        ('Analytics', {
            'fields': ('google_analytics_id',),
            'description': 'Optional: Add Google Analytics tracking ID',
            'classes': ('collapse',),
        }),
    )
    
    def has_add_permission(self, request):
        """Only one site settings instance allowed"""
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion"""
        return False
    
    class Media:
        css = {
            'all': ('css/admin-enhancements.css',)
        }