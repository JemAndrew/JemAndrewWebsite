"""
Contact Form
Not actually using Django's form rendering - doing it manually in the template
This is just here for potential future use if I want Django to handle validation
"""

from django import forms


class ContactForm(forms.Form):
    """Contact form with basic validation"""
    
    name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': 'Your name',
            'id': 'contactName'
        })
    )
    
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-input',
            'placeholder': 'your.email@example.com',
            'id': 'contactEmail'
        })
    )
    
    subject = forms.CharField(
        max_length=200,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-input',
            'placeholder': "What's this about?",
            'id': 'contactSubject'
        })
    )
    
    message = forms.CharField(
        required=True,
        min_length=10,
        widget=forms.Textarea(attrs={
            'class': 'form-textarea',
            'rows': 5,
            'placeholder': 'Your message here...',
            'id': 'contactMessage'
        })
    )
    
    # Hidden field for spam prevention

    honeypot = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'style': 'display: none;',
            'tabindex': '-1',
            'autocomplete': 'off',
            'id': 'contactHoneypot'
        })
    )

    # Validation methods

    def clean_message(self):
        """Make sure message is long enough"""
        message = self.cleaned_data.get('message', '')
        if len(message) < 10:
            raise forms.ValidationError('Message needs to be at least 10 characters.')
        return message
    
    # Spam check

    def clean_honeypot(self):
        """Spam check - if honeypot has content, it's a bot"""
        honeypot = self.cleaned_data.get('honeypot', '')
        if honeypot:
            raise forms.ValidationError('Spam detected.')
        return honeypot