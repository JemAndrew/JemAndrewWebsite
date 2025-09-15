# portfolio/forms.py
"""
Simple contact form for static portfolio
Updated to work with modern HTML template structure
"""

from django import forms


class ContactForm(forms.Form):
    """Simple contact form without database storage"""
    
    name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control-modern',
            'placeholder': ' ',  # Space for floating label effect
            'id': 'id_name'
        })
    )
    
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control-modern',
            'placeholder': ' ',  # Space for floating label effect
            'id': 'id_email'
        })
    )
    
    subject = forms.CharField(
        max_length=200,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control-modern',
            'placeholder': ' ',  # Space for floating label effect
            'id': 'id_subject'
        })
    )
    
    message = forms.CharField(
        required=True,
        min_length=10,
        widget=forms.Textarea(attrs={
            'class': 'form-control-modern',
            'rows': 5,
            'placeholder': ' ',  # Space for floating label effect
            'id': 'id_message'
        })
    )
    
    # Honeypot field for spam protection
    honeypot = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'style': 'display: none;',
            'tabindex': '-1',
            'autocomplete': 'off',
            'id': 'contact-honeypot'
        })
    )
    
    def clean_message(self):
        """Validate message length"""
        message = self.cleaned_data.get('message', '')
        if len(message) < 10:
            raise forms.ValidationError('Message must be at least 10 characters long.')
        return message
    
    def clean_honeypot(self):
        """Check honeypot field for spam"""
        honeypot = self.cleaned_data.get('honeypot', '')
        if honeypot:
            raise forms.ValidationError('Spam detected.')
        return honeypot