# portfolio/views.py - Cleaned up version without GitHub integration

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import os
from django.conf import settings
from django.core.mail import send_mail
from . import data
from .forms import ContactForm

logger = logging.getLogger(__name__)


def get_site_context():
    """Helper function to get common site context"""
    return {
        'personal_info': data.get_personal_info(),
        'site_settings': data.get_site_settings(),
    }


# ============================================
# PAGE VIEWS
# ============================================

def home_view(request):
    """
    Home/Hero page - clean single screen view
    """
    context = get_site_context()
    
    # Get data for home page
    current_positions = data.get_all_current_experience()
    
    context.update({
        'current_positions': current_positions,
        'page_title': 'Home - Jem Andrew',
        'page_class': 'home-page',
        'meta_description': 'Jem Andrew - Machine Learning Engineer specialising in software development, ML, and data analysis.',
    })
    
    return render(request, 'portfolio/home.html', context)


def about_view(request):
    """
    About Me page - detailed background and skills
    """
    context = get_site_context()
    
    # Get data for about page
    current_positions = data.get_all_current_experience()
    core_skills = data.get_skills_by_category()
    
    context.update({
        'current_positions': current_positions,
        'core_skills': core_skills,
        'page_title': 'About Me - Jem Andrew',
        'meta_description': 'Learn more about Jem Andrew - software engineer passionate about backend development, AI, and clean code.',
    })
    
    return render(request, 'portfolio/about.html', context)


def projects_view(request):
    """
    Projects page - showcase all projects
    """
    context = get_site_context()
    
    # Get all projects
    all_projects = data.get_all_projects()
    
    context.update({
        'projects': all_projects,
        'page_title': 'Projects - Jem Andrew',
        'meta_description': 'Portfolio of projects by Jem Andrew - software development, machine learning, and data analysis.',
    })
    
    return render(request, 'portfolio/projects.html', context)


def education_view(request):
    """
    Education page - academic background
    """
    context = get_site_context()
    
    # Get education data
    education_list = data.get_all_education()
    
    context.update({
        'education_list': education_list,
        'page_title': 'Education - Jem Andrew',
        'meta_description': 'Educational background of Jem Andrew - Computer Science, AI, and Software Engineering.',
    })
    
    return render(request, 'portfolio/education.html', context)


# ============================================
# FILE DOWNLOADS
# ============================================

def download_msc_dissertation(request):
    """Download MSc dissertation PDF"""
    try:
        file_path = os.path.join(settings.MEDIA_ROOT, 'cv', 'msc_dissertation.pdf')
        
        if os.path.exists(file_path):
            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = 'attachment; filename="Jem_Andrew_MSc_Dissertation.pdf"'
            return response
        else:
            logger.warning(f"MSc dissertation file not found: {file_path}")
            return HttpResponse(
                "<h1>File Not Found</h1><p>The dissertation file is not available.</p>", 
                status=404
            )
            
    except Exception as e:
        logger.error(f"Error downloading MSc dissertation: {e}")
        return HttpResponse(
            "<h1>Error</h1><p>Sorry, the dissertation is currently unavailable.</p>", 
            status=500
        )


def download_bsc_dissertation(request):
    """Download BSc dissertation PDF"""
    try:
        file_path = os.path.join(settings.MEDIA_ROOT, 'cv', 'bsc_dissertation.pdf')
        
        if os.path.exists(file_path):
            response = FileResponse(
                open(file_path, 'rb'),
                content_type='application/pdf'
            )
            response['Content-Disposition'] = 'attachment; filename="Jem_Andrew_BSc_Dissertation.pdf"'
            return response
        else:
            logger.warning(f"BSc dissertation file not found: {file_path}")
            return HttpResponse(
                "<h1>File Not Found</h1><p>The dissertation file is not available.</p>", 
                status=404
            )
            
    except Exception as e:
        logger.error(f"Error downloading BSc dissertation: {e}")
        return HttpResponse(
            "<h1>Error</h1><p>Sorry, the dissertation is currently unavailable.</p>", 
            status=500
        )


# ============================================
# AJAX ENDPOINTS
# ============================================

@csrf_exempt
@require_http_methods(["POST"])
def ajax_contact_view(request):
    """
    AJAX endpoint for contact form submission.
    Validates and logs contact form data.
    """
    try:
        # Parse JSON data from request body
        data_received = json.loads(request.body)
        
        # Extract form fields
        name = data_received.get('name', '').strip()
        email = data_received.get('email', '').strip()
        subject = data_received.get('subject', '').strip()
        message = data_received.get('message', '').strip()
        honeypot = data_received.get('honeypot', '').strip()
        
        # Validation errors dictionary
        errors = {}
        
        # Honeypot check (spam protection)
        if honeypot:
            logger.warning(f"Spam attempt detected from: {email}")
            return JsonResponse({
                'success': False,
                'message': 'Spam detected.'
            })
        
        # Validate name
        if not name:
            errors['name'] = ['Name is required.']
        elif len(name) < 2:
            errors['name'] = ['Name must be at least 2 characters.']
        elif len(name) > 100:
            errors['name'] = ['Name must not exceed 100 characters.']
        
        # Validate email
        if not email:
            errors['email'] = ['Email is required.']
        elif '@' not in email or '.' not in email:
            errors['email'] = ['Please enter a valid email address.']
        elif len(email) > 254:
            errors['email'] = ['Email must not exceed 254 characters.']
        
        # Validate subject
        if not subject:
            errors['subject'] = ['Subject is required.']
        elif len(subject) < 3:
            errors['subject'] = ['Subject must be at least 3 characters.']
        elif len(subject) > 200:
            errors['subject'] = ['Subject must not exceed 200 characters.']
        
        # Validate message
        if not message:
            errors['message'] = ['Message is required.']
        elif len(message) < 10:
            errors['message'] = ['Message must be at least 10 characters.']
        elif len(message) > 2000:
            errors['message'] = ['Message must not exceed 2000 characters.']
        
        # If there are validation errors, return them
        if errors:
            return JsonResponse({
                'success': False,
                'errors': errors
            })
        
        # Log the contact form submission
        # Log the contact form submission
        logger.info(
            f"Contact form submission - "
            f"Name: {name}, "
            f"Email: {email}, "
            f"Subject: {subject}, "
            f"Message: {message[:50]}..."
        )

        # Send email notification
        try:
            send_mail(
                subject=f"Portfolio Contact: {subject}",
                message=f"From: {name} ({email})\n\n{message}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['andrewjem8@gmail.com'],
                fail_silently=False,
            )
            logger.info("Email sent successfully to andrewjem8@gmail.com")
        except Exception as email_error:
            logger.error(f"Failed to send email: {email_error}")
            # Still return success to user - they don't need to know about email issues
                
        # Return success response
        return JsonResponse({
            'success': True,
            'message': "Thank you for your message! I'll get back to you soon."
        })
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in contact form submission")
        return JsonResponse({
            'success': False,
            'message': 'Invalid request format.'
        }, status=400)
    
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': 'An error occurred. Please try again later.'
        }, status=500)


# ============================================
# API ENDPOINTS (Optional - for future use)
# ============================================

def api_skills_view(request):
    """API endpoint for skills data (for charts/visualisations)"""
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