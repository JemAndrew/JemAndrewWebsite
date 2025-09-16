# portfolio/views.py - Simplified for single page portfolio
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404, FileResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import json
import logging
import os
from datetime import date
from django.conf import settings

from . import data
from .forms import ContactForm
from .services.github_service import GitHubService

logger = logging.getLogger(__name__)

def get_site_context():
    """Helper function to get common site context"""
    return {
        'personal_info': data.get_personal_info(),
        'site_settings': data.get_site_settings(),
    }

def get_github_data():
    """Helper function to get GitHub data"""
    github_service = GitHubService()
    return {
        'github_user': github_service.get_user_info(),
        'github_repos': github_service.get_repositories(),
        'github_languages': github_service.get_language_stats(),
        'github_commits': github_service.get_commit_activity(),
    }

# PAGE 1: Professional Overview
def home_view(request):
    """
    Main professional overview page
    Focus: Contact, BuildChorus experience, core skills
    """
    context = get_site_context()
    
    # Handle contact form submission
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']
            
            logger.info(f"Contact form submission: {name} ({email}) - {subject}")
            messages.success(request, "Thank you for your message! I'll get back to you soon.")
            form = ContactForm()
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ContactForm()
    
    # Get data for home page
    current_position = data.get_current_experience()
    core_skills = data.get_skills_by_category()
    github_data = get_github_data()
    
    # Get just the highlights for home page
    featured_skills = {}
    for category, skills in core_skills.items():
        featured_skills[category] = skills[:3]  # Top 3 skills per category
    
    context.update({
        'current_position': current_position,
        'featured_skills': featured_skills,
        'form': form,
        'page_title': 'Home - Professional Overview',
        'meta_description': 'James Andrew - Software Engineer at BuildChorus specializing in Django, enterprise SaaS platforms, and full-stack development.',
        **github_data
    })
    
    return render(request, 'portfolio/home.html', context)

# PAGE 2: Education
def education_view(request):
    """
    Education page with dissertations
    Focus: Academic background, research, dissertations
    """
    context = get_site_context()
    
    # Get education data
    education_list = data.get_all_education()
    
    # Academic skills - focus on research and academic tools
    all_skills = data.get_skills_by_category()
    academic_skills = {}
    
    # Filter for academic/research relevant skills
    for category, skills in all_skills.items():
        if category in ['Programming Languages', 'Frameworks & Libraries']:
            # Focus on research/academic tools
            academic_tools = [s for s in skills if s.name in [
                'Python', 'PyTorch', 'Machine Learning', 'Data Analysis', 
                'Statistical Analysis', 'Research Methods'
            ]]
            if academic_tools:
                academic_skills[category] = academic_tools
    
    context.update({
        'education_list': education_list,
        'academic_skills': academic_skills,
        'page_title': 'Education - Academic Background',
        'meta_description': 'James Andrew - MSc Computer Science graduate with research in medical AI and CNN architectures.',
        'show_dissertation_downloads': True,
    })
    
    return render(request, 'portfolio/education.html', context)

def download_msc_dissertation(request):
    file_path = os.path.join(settings.BASE_DIR, 'static', 'documents', 'MSc_Dissertation_James_Andrew.pdf')
    if os.path.exists(file_path):
        return FileResponse(
            open(file_path, 'rb'),
            content_type='application/pdf',
            filename='MSc_Dissertation_James_Andrew.pdf'
        )
    raise Http404("Dissertation not found")

def download_bsc_dissertation(request):
    file_path = os.path.join(settings.BASE_DIR, 'static', 'documents', 'BSc_Dissertation_James_Andrew.pdf')
    if os.path.exists(file_path):
        return FileResponse(
            open(file_path, 'rb'),
            content_type='application/pdf',
            filename='BSc_Dissertation_James_Andrew.pdf'
        )
    raise Http404("Dissertation not found")


# PAGE 3: Personal Projects  
def projects_view(request):
    """
    Personal projects showcase
    Focus: GitHub integration, project details, technical demos
    """
    context = get_site_context()
    
    # Get all projects and GitHub data
    all_projects = data.get_all_projects()
    github_data = get_github_data()
    
    # Categorize projects
    personal_projects = [p for p in all_projects if p.get_category_display() == 'Personal']
    academic_projects = [p for p in all_projects if p.get_category_display() == 'Academic']
    
    # Get project-relevant skills
    all_skills = data.get_skills_by_category()
    project_skills = {}
    
    # Focus on development tools and frameworks
    for category, skills in all_skills.items():
        if category in ['Programming Languages', 'Frameworks & Libraries', 'Databases & Tools']:
            project_skills[category] = skills
    
    context.update({
        'all_projects': all_projects,
        'personal_projects': personal_projects,
        'academic_projects': academic_projects,
        'project_skills': project_skills,
        'page_title': 'Projects - Portfolio Showcase',
        'meta_description': 'James Andrew - Personal and academic projects showcasing full-stack development and research skills.',
        **github_data
    })
    
    return render(request, 'portfolio/projects.html', context)

# Dissertation download handlers
def download_msc_dissertation(request):
    """Download MSc dissertation PDF"""
    try:
        # Path to your MSc dissertation file
        file_path = os.path.join('static', 'documents', 'MSc_Dissertation_James_Andrew.pdf')
        
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/pdf")
                response['Content-Disposition'] = 'attachment; filename="MSc_Dissertation_James_Andrew.pdf"'
                return response
        else:
            raise Http404("Dissertation not found")
            
    except Exception as e:
        logger.error(f"Error downloading MSc dissertation: {e}")
        messages.error(request, "Sorry, the dissertation is currently unavailable.")
        return redirect('portfolio:education')

def download_bsc_dissertation(request):
    """Download BSc dissertation PDF"""
    try:
        # Path to your BSc dissertation file  
        file_path = os.path.join('static', 'documents', 'BSc_Dissertation_James_Andrew.pdf')
        
        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/pdf")
                response['Content-Disposition'] = 'attachment; filename="BSc_Dissertation_James_Andrew.pdf"'
                return response
        else:
            raise Http404("Dissertation not found")
            
    except Exception as e:
        logger.error(f"Error downloading BSc dissertation: {e}")
        messages.error(request, "Sorry, the dissertation is currently unavailable.")
        return redirect('portfolio:education')

# GitHub API endpoint
def github_api_view(request):
    """API endpoint for GitHub data"""
    github_data = get_github_data()
    return JsonResponse(github_data)

# Existing AJAX and API views remain the same
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
    """API endpoint for skills data"""
    skills_by_category = data.get_skills_by_category()
    
    skills_data = []
    for category_name, skills in skills_by_category.items():
        for skill in skills:
            skills_data.append({
                'name': skill.name,
                'category': category_name,
                'proficiency': skill.proficiency_percentage,
                'experience': skill.years_experience,
                'color': '#dc2626',
            })
    
    return JsonResponse({'skills': skills_data})


