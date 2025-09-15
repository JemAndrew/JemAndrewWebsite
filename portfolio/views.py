# portfolio/views.py - Simplified for single page portfolio
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json
import logging
from datetime import date

# Import our static data and forms
from . import data
from .forms import ContactForm

logger = logging.getLogger(__name__)


def get_site_context():
    """Helper function to get common site context from static data"""
    return {
        'personal_info': data.get_personal_info(),
        'site_settings': data.get_site_settings(),
    }


def home_view(request):
    """
    Single page portfolio view - contains everything
    """
    context = get_site_context()
    
    # Handle contact form submission
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Extract validated data
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            
            # Log the contact attempt
            logger.info(f"Contact form submission: {name} ({email}) - {subject}")
            
            # Show success message
            messages.success(request, "Thank you for your message! I'll get back to you soon.")
            form = ContactForm()  # Reset form after successful submission
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ContactForm()
    
    # Get all data for single page
    featured_projects = data.get_featured_projects(3)
    current_position = data.get_current_experience()
    education_list = data.get_all_education()
    skills_by_category = data.get_skills_by_category()
    all_projects = data.get_all_projects()
    
    context.update({
        'featured_projects': featured_projects,
        'current_position': current_position,
        'education_list': education_list,
        'skills_by_category': skills_by_category,
        'projects': all_projects,
        'form': form,
        'page_title': 'Home',
        'meta_description': 'James Andrew - Software Engineer at BuildChorus specializing in Django, enterprise SaaS platforms, and full-stack development.',
    })
    
    return render(request, 'portfolio/home.html', context)


@csrf_exempt
@require_http_methods(["POST"])
def ajax_contact_view(request):
    """AJAX endpoint for contact form submission"""
    try:
        data_received = json.loads(request.body)
        form = ContactForm(data_received)
        
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            
            # Log the contact attempt
            logger.info(f"AJAX Contact form submission: {name} ({email}) - {subject}")
            
            return JsonResponse({
                'success': True,
                'message': "Thank you for your message! I'll get back to you soon."
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': form.errors
            })
    
    except Exception as e:
        logger.error(f"AJAX contact form error: {e}")
        return JsonResponse({
            'success': False,
            'message': 'An error occurred. Please try again.'
        })


def api_skills_view(request):
    """API endpoint for skills data (for charts/visualization)"""
    skills_by_category = data.get_skills_by_category()
    
    skills_data = []
    for category_name, skills in skills_by_category.items():
        for skill in skills:
            skills_data.append({
                'name': skill.name,
                'category': category_name,
                'proficiency': skill.proficiency_percentage,
                'experience': skill.years_experience,
                'color': '#007bff',
            })
    
    return JsonResponse({'skills': skills_data})


def api_projects_view(request):
    """API endpoint for projects data"""
    projects = data.get_all_projects()
    
    projects_data = []
    for project in projects:
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.short_description,
            'category': project.get_category_display(),
            'status': project.get_status_display(),
            'technologies': project.technology_list,
            'github_url': getattr(project, 'github_url', None),
            'demo_url': getattr(project, 'live_demo_url', None),
            'featured': getattr(project, 'featured', False),
        })
    
    return JsonResponse({'projects': projects_data})


