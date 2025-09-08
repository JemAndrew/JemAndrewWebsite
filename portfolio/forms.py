from django import forms
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
import re


class ContactForm(forms.Form):
    """
    Contact form with validation and styling
    """
    
    name = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your full name',
            'required': True,
            'id': 'contact-name',
        }),
        help_text="Please enter your full name"
    )
    
    email = forms.EmailField(
        validators=[EmailValidator()],
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'your.email@example.com',
            'required': True,
            'id': 'contact-email',
        }),
        help_text="We'll never share your email with anyone else"
    )
    
    subject = forms.CharField(
        max_length=300,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Brief subject line',
            'required': True,
            'id': 'contact-subject',
        }),
        help_text="Brief description of your inquiry"
    )
    
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Your message...',
            'rows': 6,
            'required': True,
            'id': 'contact-message',
        }),
        help_text="Please provide details about your inquiry"
    )
    
    # Honeypot field to prevent spam
    honeypot = forms.CharField(
        required=False,
        widget=forms.HiddenInput(),
        label='',
    )
    
    def clean_name(self):
        """Validate name field"""
        name = self.cleaned_data.get('name', '').strip()
        
        if len(name) < 2:
            raise ValidationError("Name must be at least 2 characters long.")
        
        # Check for suspicious patterns
        if re.search(r'[<>{}]', name):
            raise ValidationError("Name contains invalid characters.")
        
        return name.title()  # Capitalize properly
    
    def clean_email(self):
        """Validate email field"""
        email = self.cleaned_data.get('email', '').lower().strip()
        
        # Additional email validation beyond Django's default
        if '+' in email.split('@')[0]:  # Allow + in email (Gmail aliases)
            pass
        
        # Check for suspicious domains (basic spam prevention)
        suspicious_domains = [
            'tempmail', 'throwaway', 'guerrillamail', '10minutemail'
        ]
        
        domain = email.split('@')[1] if '@' in email else ''
        for suspicious in suspicious_domains:
            if suspicious in domain.lower():
                raise ValidationError("Please use a permanent email address.")
        
        return email
    
    def clean_subject(self):
        """Validate subject field"""
        subject = self.cleaned_data.get('subject', '').strip()
        
        if len(subject) < 5:
            raise ValidationError("Subject must be at least 5 characters long.")
        
        # Check for spam-like content
        spam_keywords = ['viagra', 'casino', 'loan', 'free money', 'click here']
        subject_lower = subject.lower()
        
        for keyword in spam_keywords:
            if keyword in subject_lower:
                raise ValidationError("Subject contains prohibited content.")
        
        return subject
    
    def clean_message(self):
        """Validate message field"""
        message = self.cleaned_data.get('message', '').strip()
        
        if len(message) < 10:
            raise ValidationError("Message must be at least 10 characters long.")
        
        if len(message) > 5000:
            raise ValidationError("Message is too long. Please limit to 5000 characters.")
        
        # Check for excessive URLs
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        urls = re.findall(url_pattern, message)
        
        if len(urls) > 3:
            raise ValidationError("Message contains too many URLs.")
        
        return message
    
    def clean(self):
        """Global form validation"""
        cleaned_data = super().clean()
        
        # Check honeypot field
        honeypot = cleaned_data.get('honeypot')
        if honeypot:
            raise ValidationError("Form submission appears to be spam.")
        
        # Additional spam checks
        name = cleaned_data.get('name', '')
        email = cleaned_data.get('email', '')
        message = cleaned_data.get('message', '')
        
        # Check if name and email domain match suspiciously
        if name and email:
            domain = email.split('@')[1] if '@' in email else ''
            if name.lower() in domain.lower() and len(name) > 10:
                # Likely spam if name is suspiciously similar to domain
                pass  # Could add validation here
        
        # Check for duplicate content
        combined_text = f"{name} {message}".lower()
        if len(set(combined_text.split())) < len(combined_text.split()) * 0.3:
            # Too much repetitive content
            raise ValidationError("Message appears to contain repetitive content.")
        
        return cleaned_data


class ProjectFilterForm(forms.Form):
    """
    Form for filtering projects on the projects page
    """
    
    CATEGORY_CHOICES = [('', 'All Categories')] + [
        ('academic', 'Academic'),
        ('personal', 'Personal'),
        ('professional', 'Professional'),
        ('open_source', 'Open Source'),
    ]
    
    STATUS_CHOICES = [('', 'All Statuses')] + [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('planned', 'Planned'),
        ('archived', 'Archived'),
    ]
    
    search = forms.CharField(
        required=False,
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search projects...',
            'id': 'project-search',
        })
    )
    
    category = forms.ChoiceField(
        choices=CATEGORY_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'project-category',
        })
    )
    
    status = forms.ChoiceField(
        choices=STATUS_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'project-status',
        })
    )


class SkillFilterForm(forms.Form):
    """
    Form for filtering skills by category
    """
    
    CATEGORY_CHOICES = [('', 'All Categories')] + [
        ('programming', 'Programming Languages'),
        ('framework', 'Frameworks & Libraries'),
        ('database', 'Databases'),
        ('tool', 'Tools & Technologies'),
        ('soft_skill', 'Soft Skills'),
        ('methodology', 'Methodologies'),
    ]
    
    category = forms.ChoiceField(
        choices=CATEGORY_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'skill-category',
            'onchange': 'filterSkills()',
        })
    )
    
    min_proficiency = forms.IntegerField(
        required=False,
        min_value=1,
        max_value=5,
        widget=forms.NumberInput(attrs={
            'class': 'form-range',
            'min': '1',
            'max': '5',
            'step': '1',
            'id': 'skill-proficiency',
            'oninput': 'updateProficiencyLabel(this.value)',
        })
    )