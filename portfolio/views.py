"""
Portfolio Views
All the view functions for rendering pages and handling requests
"""

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, FileResponse, Http404
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from pathlib import Path
import json
import logging

from . import data

logger = logging.getLogger(__name__)


# Helper to get common context for all pages
def get_site_context():
    """Gets the basic site info that appears on every page"""
    return {
        'personal_info': data.get_personal_info(),
        'site_settings': data.get_site_settings(),
    }


# Page Views

def home_view(request):
    """Home page - main hero section"""
    context = get_site_context()
    context.update({
        'current_positions': data.get_all_current_experience(),
        'page_title': 'Home - Jem Andrew',
        'page_class': 'home-page',
        'meta_description': 'Jem Andrew - Machine Learning Engineer specialising in software development, ML, and data analysis.',
    })
    return render(request, 'portfolio/home.html', context)


def about_view(request):
    """About page - background and skills breakdown"""
    context = get_site_context()
    context.update({
        'current_positions': data.get_all_current_experience(),
        'core_skills': data.get_skills_by_category(),
        'page_title': 'About Me - Jem Andrew',
        'meta_description': 'Learn more about Jem Andrew - software engineer passionate about backend development, AI, and clean code.',
    })
    return render(request, 'portfolio/about.html', context)


def projects_view(request):
    """Projects page - all my work"""
    context = get_site_context()
    context.update({
        'projects': data.get_all_projects(),
        'page_title': 'Projects - Jem Andrew',
        'meta_description': 'Portfolio of projects by Jem Andrew - software development, machine learning, and data analysis.',
    })
    return render(request, 'portfolio/projects.html', context)


def education_view(request):
    """Education page - academic stuff"""
    context = get_site_context()
    context.update({
        'education_list': data.get_all_education(),
        'page_title': 'Education - Jem Andrew',
        'meta_description': 'Educational background of Jem Andrew - Computer Science, AI, and Software Engineering.',
    })
    return render(request, 'portfolio/education.html', context)


# File Downloads - refactored to avoid duplication

def serve_dissertation_file(request, degree_type):
    """
    Handles downloading dissertation PDFs
    Refactored to handle both MSc and BSc with one function
    """
    # Map degree type to actual filename
    file_mapping = {
        'msc': ('msc_dissertation.pdf', 'Jem_Andrew_MSc_Dissertation.pdf'),
        'bsc': ('bsc_dissertation.pdf', 'Jem_Andrew_BSc_Dissertation.pdf'),
    }
    
    if degree_type not in file_mapping:
        raise Http404("Invalid dissertation type")
    
    storage_filename, download_filename = file_mapping[degree_type]
    file_path = Path(settings.MEDIA_ROOT) / 'cv' / storage_filename
    
    # Check if file actually exists
    if not file_path.exists():
        logger.warning(f"{degree_type.upper()} dissertation not found: {file_path}")
        raise Http404("Dissertation file not available")
    
    try:
        # Use context manager to properly handle file closing
        # This was causing a file handle leak before
        return FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=download_filename,
            content_type='application/pdf'
        )
    except IOError as e:
        logger.error(f"Error reading {degree_type.upper()} dissertation: {e}")
        return HttpResponse("Sorry, the file is temporarily unavailable.", status=500)


def download_msc_dissertation(request):
    """Download MSc dissertation - uses the shared function now"""
    return serve_dissertation_file(request, 'msc')


def download_bsc_dissertation(request):
    """Download BSc dissertation - uses the shared function now"""
    return serve_dissertation_file(request, 'bsc')


# Contact Form Handler

@require_http_methods(["POST"])
def ajax_contact_view(request):
    """
    Handles contact form submissions via AJAX
    Now properly uses CSRF protection instead of @csrf_exempt
    """
    try:
        # Parse the JSON from the request
        form_data = json.loads(request.body)
        
        # Pull out the fields
        name = form_data.get('name', '').strip()
        email = form_data.get('email', '').strip()
        subject = form_data.get('subject', '').strip()
        message = form_data.get('message', '').strip()
        honeypot = form_data.get('honeypot', '').strip()
        
        # Check honeypot first - if filled, it's spam
        if honeypot:
            logger.warning(f"Spam attempt from: {email}")
            return JsonResponse({
                'success': False,
                'message': 'Spam detected.'
            }, status=400)
        
        # Validate all the fields
        errors = validate_contact_form(name, email, subject, message)
        
        if errors:
            return JsonResponse({
                'success': False,
                'errors': errors
            }, status=400)
        
        # Log the submission
        logger.info(f"Contact form - Name: {name}, Email: {email}, Subject: {subject}")
        
        # Try to send the email
        try:
            send_mail(
                subject=f"Portfolio Contact: {subject}",
                message=f"From: {name} ({email})\n\n{message}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            logger.info("Contact email sent successfully")
            
        except BadHeaderError:
            logger.error("Bad header in email - possible injection attempt")
            return JsonResponse({
                'success': False,
                'message': 'Invalid email format.'
            }, status=400)
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            # Don't tell the user about email issues - still show success
            # The message is logged, I can check it later
        
        return JsonResponse({
            'success': True,
            'message': "Thanks for reaching out! I'll get back to you soon."
        })
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in contact form")
        return JsonResponse({
            'success': False,
            'message': 'Invalid request format.'
        }, status=400)
        
    except Exception as e:
        logger.exception("Unexpected error in contact form")
        return JsonResponse({
            'success': False,
            'message': 'Something went wrong. Please try again later.'
        }, status=500)


def validate_contact_form(name, email, subject, message):
    """
    Validates contact form fields
    Returns dict of errors, or empty dict if all good
    """
    errors = {}
    
    # Name validation
    if not name:
        errors['name'] = ['Name is required.']
    elif len(name) < 2:
        errors['name'] = ['Name must be at least 2 characters.']
    elif len(name) > 100:
        errors['name'] = ['Name is too long (max 100 characters).']
    
    # Email validation - basic checks
    if not email:
        errors['email'] = ['Email is required.']
    elif '@' not in email or '.' not in email.split('@')[-1]:
        errors['email'] = ['Please enter a valid email address.']
    elif len(email) > 254:
        errors['email'] = ['Email is too long.']
    
    # Subject validation
    if not subject:
        errors['subject'] = ['Subject is required.']
    elif len(subject) < 3:
        errors['subject'] = ['Subject must be at least 3 characters.']
    elif len(subject) > 200:
        errors['subject'] = ['Subject is too long (max 200 characters).']
    
    # Message validation
    if not message:
        errors['message'] = ['Message is required.']
    elif len(message) < 10:
        errors['message'] = ['Message must be at least 10 characters.']
    elif len(message) > 2000:
        errors['message'] = ['Message is too long (max 2000 characters).']
    
    return errors


# Optional API endpoint for skills data
# Could be used for charts or visualisations later

def api_skills_view(request):
    """Returns skills data as JSON - might use this for charts later"""
    skills_by_category = data.get_skills_by_category()
    
    skills_data = []
    for category_name, skills in skills_by_category.items():
        for skill in skills:
            skills_data.append({
                'name': skill.name,
                'category': category_name,
                'proficiency': skill.proficiency_percentage,
                'experience': skill.years_experience,
            })
    
    return JsonResponse({'skills': skills_data})