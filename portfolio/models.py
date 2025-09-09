from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from PIL import Image
from django.db import models
from image_cropping import ImageRatioField
import os


class Education(models.Model):
    """Model for educational qualifications"""
    
    DEGREE_CHOICES = [
        ('msc', 'Master of Science'),
        ('bsc', 'Bachelor of Science'),
        ('a_level', 'A Levels'),
        ('gcse', 'GCSEs'),
        ('certification', 'Certification'),
        ('course', 'Online Course'),
    ]
    
    institution = models.CharField(max_length=200)
    degree_type = models.CharField(max_length=20, choices=DEGREE_CHOICES)
    subject = models.CharField(max_length=200)
    grade = models.CharField(max_length=50, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    technologies_used = models.TextField(blank=True, help_text="Comma-separated list")
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-start_date', 'order']
        verbose_name_plural = "Education"
    
    def __str__(self):
        return f"{self.degree_type.upper()} {self.subject} - {self.institution}"
    
    @property
    def duration_years(self):
        """Calculate duration in years"""
        end = self.end_date or timezone.now().date()
        return round((end - self.start_date).days / 365.25, 1)
    
    @property
    def technologies_list(self):
        """Return technologies as a list"""
        if self.technologies_used:
            return [tech.strip() for tech in self.technologies_used.split(',')]
        return []


class Experience(models.Model):
    """Model for work experience"""
    
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    skills_gained = models.TextField(blank=True, help_text="Comma-separated list")
    is_current = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-start_date', 'order']
    
    def __str__(self):
        return f"{self.position} at {self.company}"
    
    @property
    def duration_months(self):
        """Calculate duration in months"""
        end = self.end_date or timezone.now().date()
        return round((end - self.start_date).days / 30.44, 1)


class Project(models.Model):
    """Model for portfolio projects"""
    
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('personal', 'Personal'),
        ('professional', 'Professional'),
        ('open_source', 'Open Source'),
    ]
    
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('planned', 'Planned'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    detailed_description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    technologies = models.TextField(help_text="Comma-separated list of technologies")
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True)
    created_date = models.DateField()
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-featured', '-created_date', 'order']
    
    def __str__(self):
        return self.title
    
    @property
    def technology_list(self):
        """Return technologies as a list"""
        return [tech.strip() for tech in self.technologies.split(',')]
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Resize image if it exists
        if self.image:
            img = Image.open(self.image.path)
            if img.height > 400 or img.width > 600:
                output_size = (600, 400)
                img.thumbnail(output_size)
                img.save(self.image.path)


class Skill(models.Model):
    """Model for technical skills"""
    
    CATEGORY_CHOICES = [
        ('programming', 'Programming Languages'),
        ('framework', 'Frameworks & Libraries'),
        ('database', 'Databases'),
        ('tool', 'Tools & Technologies'),
        ('soft_skill', 'Soft Skills'),
        ('methodology', 'Methodologies'),
    ]
    
    PROFICIENCY_CHOICES = [
        (1, 'Beginner'),
        (2, 'Novice'),
        (3, 'Intermediate'),
        (4, 'Advanced'),
        (5, 'Expert'),
    ]
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(
        choices=PROFICIENCY_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    years_experience = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Years of experience with this skill"
    )
    description = models.TextField(blank=True)
    icon_class = models.CharField(
        max_length=100, 
        blank=True,
        help_text="CSS class for icon (e.g., 'fab fa-python')"
    )
    color = models.CharField(
        max_length=7,
        default='#007bff',
        help_text="Hex color code for skill visualization"
    )
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['category', '-proficiency', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.get_proficiency_display()})"
    
    @property
    def proficiency_percentage(self):
        """Convert proficiency level to percentage"""
        return (self.proficiency / 5) * 100


class PersonalInfo(models.Model):
    """Model for personal information"""
    
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='profile/', blank=True)
    # DELETE image_position field - not needed with Cloudinary
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    cv_file = models.FileField(upload_to='documents/', blank=True)
    typing_texts = models.TextField(
        blank=True,
        help_text="Comma-separated phrases for typing animation"
    )
    
    class Meta:
        verbose_name = "Personal Information"
        verbose_name_plural = "Personal Information"
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Keep this singleton logic - it's useful
        if not self.pk and PersonalInfo.objects.exists():
            existing = PersonalInfo.objects.first()
            for field in self._meta.fields:
                if field.name != 'id':
                    setattr(existing, field.name, getattr(self, field.name))
            existing.save()
            return existing
        super().save(*args, **kwargs)
    
    @property
    def typing_phrases(self):
        """Return typing texts as a list"""
        if self.typing_texts:
            return [phrase.strip() for phrase in self.typing_texts.split(',')]
        return []


class ContactMessage(models.Model):
    """Model for contact form submissions"""
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class SiteSettings(models.Model):
    """Singleton model for site-wide settings"""
    
    site_title = models.CharField(max_length=200, default="James Andrew - CV")
    site_description = models.TextField(default="Computer Science Graduate Portfolio")
    theme_color = models.CharField(max_length=7, default="#007bff")
    enable_dark_mode = models.BooleanField(default=True)
    google_analytics_id = models.CharField(max_length=50, blank=True)
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"
    
    def __str__(self):
        return "Site Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteSettings.objects.exists():
            raise ValueError("Only one SiteSettings instance is allowed")
        super().save(*args, **kwargs)
# Create your models here.
