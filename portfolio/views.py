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
import resend
from . import data

logger = logging.getLogger(__name__)


# gets the basic site info that appears on every page
def get_site_context():
    return {
        'personal_info': data.get_personal_info(),
        'site_settings': data.get_site_settings(),
    }


# Page Views

def home_view(request):
    """home page with hero section"""
    context = get_site_context()
    context.update({
        'current_positions': data.get_all_current_experience(),
        'page_title': 'Home - Jem Andrew',
        'page_class': 'home-page',
        'meta_description': 'Jem Andrew - Machine Learning Engineer specialising in software development, ML, and data analysis.',
    })
    return render(request, 'portfolio/home.html', context)


def about_view(request):
    """about page showing career path and skills"""
    context = get_site_context()
    context.update({
        # changed to show all experience not just current ones
        'current_positions': data.get_all_experience(),
        'core_skills': data.get_skills_by_category(),
        'page_title': 'About Me - Jem Andrew',
        'meta_description': 'Learn more about Jem Andrew - software engineer passionate about backend development, AI, and clean code.',
    })
    return render(request, 'portfolio/about.html', context)


def projects_view(request):
    """projects page showing all work"""
    context = get_site_context()
    context.update({
        'projects': data.get_all_projects(),
        'page_title': 'Projects - Jem Andrew',
        'meta_description': 'Portfolio of projects by Jem Andrew - software development, machine learning, and data analysis.',
    })
    return render(request, 'portfolio/projects.html', context)


def education_view(request):
    """education page with degrees and dissertations"""
    context = get_site_context()
    context.update({
        'education_list': data.get_all_education(),
        'page_title': 'Education - Jem Andrew',
        'meta_description': 'Educational background of Jem Andrew - Computer Science, AI, and Software Engineering.',
    })
    return render(request, 'portfolio/education.html', context)


# File Downloads

def serve_dissertation_file(request, degree_type):
    """handles downloading dissertation DOCX files for both MSc and BSc"""
    # map degree type to actual filename in static/documents
    file_mapping = {
        'msc': 'MSc_Jem_Andrew_Dissertation.docx',
        'bsc': 'BSc_Jem_Andrew_Dissertation.docx',
    }
    
    if degree_type not in file_mapping:
        raise Http404("Invalid dissertation type")
    
    filename = file_mapping[degree_type]
    # dissertations are in static/documents not media
    file_path = Path(settings.BASE_DIR) / 'static' / 'documents' / filename
    
    # check if file actually exists
    if not file_path.exists():
        logger.warning(f"{degree_type.upper()} dissertation not found: {file_path}")
        raise Http404("Dissertation file not available")
    
    try:
        return FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=filename,
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except IOError as e:
        logger.error(f"Error reading {degree_type.upper()} dissertation: {e}")
        return HttpResponse("Sorry, the file is temporarily unavailable.", status=500)


def download_msc_dissertation(request):
    """wrapper for downloading MSc dissertation"""
    return serve_dissertation_file(request, 'msc')


def download_bsc_dissertation(request):
    """wrapper for downloading BSc dissertation"""
    return serve_dissertation_file(request, 'bsc')


def download_cv(request):
    """serves the CV PDF file"""
    cv_path = Path(settings.MEDIA_ROOT) / 'cv' / 'Jem_Andrew_CV.pdf'
    
    if not cv_path.exists():
        logger.warning(f"CV not found: {cv_path}")
        raise Http404("CV not available")
    
    try:
        return FileResponse(
            open(cv_path, 'rb'),
            as_attachment=True,
            filename='Jem_Andrew_CV.pdf',
            content_type='application/pdf'
        )
    except IOError as e:
        logger.error(f"Error reading CV: {e}")
        return HttpResponse("Sorry, the file is temporarily unavailable.", status=500)


# Contact Form

@require_http_methods(["POST"])
def ajax_contact_view(request):
    """handles contact form submissions"""
    try:
        data_received = json.loads(request.body)
        
        name = data_received.get('name', '').strip()
        email = data_received.get('email', '').strip()
        subject = data_received.get('subject', '').strip()
        message = data_received.get('message', '').strip()
        honeypot = data_received.get('honeypot', '').strip()
        
        if honeypot:
            return JsonResponse({'success': False, 'message': 'Spam detected.'}, status=400)
        
        errors = validate_contact_form(name, email, subject, message)
        if errors:
            return JsonResponse({'success': False, 'errors': errors}, status=400)
        
        logger.info(f"Contact form - Name: {name}, Email: {email}, Subject: {subject}")
        
        # Send email via Resend
        if settings.RESEND_API_KEY:
            try:
                resend.api_key = settings.RESEND_API_KEY
                
                resend.Emails.send({
                    "from": "Portfolio Contact <onboarding@resend.dev>",
                    "to": "andrewjem8@gmail.com",
                    "subject": f"Portfolio Contact: {subject}",
                    "text": f"From: {name}\nEmail: {email}\n\n{message}"
                })
                logger.info("Email sent via Resend")
            except Exception as e:
                logger.error(f"Resend failed: {e}")
        
        return JsonResponse({
            'success': True,
            'message': "Thanks for reaching out! I'll get back to you soon."
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid request format.'}, status=400)
    except Exception as e:
        logger.exception(f"Error: {e}")
        return JsonResponse({'success': False, 'message': 'Something went wrong.'}, status=500)


def validate_contact_form(name, email, subject, message):
    """validates contact form fields and returns dict of errors"""
    errors = {}
    
    # name validation
    if not name:
        errors['name'] = ['Name is required.']
    elif len(name) < 2:
        errors['name'] = ['Name must be at least 2 characters.']
    elif len(name) > 100:
        errors['name'] = ['Name is too long (max 100 characters).']
    
    # email validation
    if not email:
        errors['email'] = ['Email is required.']
    elif '@' not in email or '.' not in email.split('@')[-1]:
        errors['email'] = ['Please enter a valid email address.']
    elif len(email) > 254:
        errors['email'] = ['Email is too long.']
    
    # subject validation
    if not subject:
        errors['subject'] = ['Subject is required.']
    elif len(subject) < 3:
        errors['subject'] = ['Subject must be at least 3 characters.']
    elif len(subject) > 200:
        errors['subject'] = ['Subject is too long (max 200 characters).']
    
    # message validation
    if not message:
        errors['message'] = ['Message is required.']
    elif len(message) < 10:
        errors['message'] = ['Message must be at least 10 characters.']
    elif len(message) > 2000:
        errors['message'] = ['Message is too long (max 2000 characters).']
    
    return errors


# API endpoint for skills data if i need it later for charts
def api_skills_view(request):
    """returns skills data as JSON"""
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