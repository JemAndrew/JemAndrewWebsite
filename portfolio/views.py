from django.shortcuts import render, get_object_or_404, redirect  # Add redirect import
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import render
import json
import logging

from .models import (
    Education, Experience, Project, Skill, 
    PersonalInfo, ContactMessage, SiteSettings
)
from .forms import ContactForm

logger = logging.getLogger(__name__)


def get_site_context():
    """Helper function to get common site context"""
    try:
        personal_info = PersonalInfo.objects.first()
        site_settings = SiteSettings.objects.first()
    except (PersonalInfo.DoesNotExist, SiteSettings.DoesNotExist):
        personal_info = None
        site_settings = None
    
    return {
        'personal_info': personal_info,
        'site_settings': site_settings,
    }


def home_view(request):
    """
    Home page view with personal introduction and overview
    """
    context = get_site_context()
    
    # Get featured projects
    featured_projects = Project.objects.filter(featured=True)[:3]
    
    # Get recent education
    recent_education = Education.objects.filter(is_current=True).first()
    
    # Get skill categories for overview
    skill_categories = Skill.CATEGORY_CHOICES
    skills_by_category = {}
    for category_code, category_name in skill_categories:
        skills = Skill.objects.filter(category=category_code)[:4]  # Top 4 per category
        if skills:
            skills_by_category[category_name] = skills
    
    context.update({
        'featured_projects': featured_projects,
        'recent_education': recent_education,
        'skills_by_category': skills_by_category,
        'page_title': 'Home',
        'meta_description': 'James Andrew - Computer Science Graduate. Experienced in Python, Java, Django, React and full-stack development.',
    })
    
    return render(request, 'portfolio/home.html', context)

def about_view(request):
    """About page view"""
    context = get_site_context()
    context.update({
        'page_title': 'About',
        'meta_description': 'Learn more about James Andrew - Software Engineer, MSc Computer Science graduate, and full-stack developer.',
    })
    return render(request, 'portfolio/about.html', context)

def education_view(request):
    """
    Education and qualifications page
    """
    context = get_site_context()
    
    # Get all education ordered by date
    education_list = Education.objects.all()
    
    # Group by degree type for better organization
    education_by_type = {}
    for education in education_list:
        degree_type = education.get_degree_type_display()
        if degree_type not in education_by_type:
            education_by_type[degree_type] = []
        education_by_type[degree_type].append(education)
    
    # Calculate total years of education
    total_years = sum([edu.duration_years for edu in education_list])
    
    context.update({
        'education_list': education_list,
        'education_by_type': education_by_type,
        'total_years': round(total_years, 1),
        'page_title': 'Education',
        'meta_description': 'Educational background including MSc Computer Science from Newcastle University.',
    })
    
    return render(request, 'portfolio/education.html', context)

def experience_view(request):
    """
    Professional experience page
    """
    context = get_site_context()
    
    # Get all experience ordered by date
    experience_list = Experience.objects.all()
    
    # Calculate total months of experience (with safety check)
    total_months = 0
    for exp in experience_list:
        if hasattr(exp, 'duration_months'):
            total_months += exp.duration_months
    
    total_years = total_months / 12 if total_months > 0 else 0
    
    # Get current position
    current_position = Experience.objects.filter(is_current=True).first()
    
    context.update({
        'experience_list': experience_list,
        'total_years': round(total_years, 1),
        'current_position': current_position,
        'page_title': 'Experience',
        'meta_description': 'Professional work experience and career progression.',
    })
    
    return render(request, 'portfolio/experience.html', context)

def cv_view(request):
    """
    CV/Resume page with professional experience
    """
    context = get_site_context()
    
    # Get all experience
    experience_list = Experience.objects.all()
    
    # Get all education for CV timeline
    education_list = Education.objects.all()
    
    # Combine and sort by date for timeline
    timeline_items = []
    
    for exp in experience_list:
        timeline_items.append({
            'type': 'experience',
            'title': exp.position,
            'subtitle': exp.company,
            'start_date': exp.start_date,
            'end_date': exp.end_date,
            'description': exp.description,
            'is_current': exp.is_current,
            'location': exp.location,
        })
    
    for edu in education_list:
        timeline_items.append({
            'type': 'education',
            'title': f"{edu.get_degree_type_display()} {edu.subject}",
            'subtitle': edu.institution,
            'start_date': edu.start_date,
            'end_date': edu.end_date,
            'description': edu.description,
            'is_current': edu.is_current,
            'grade': edu.grade,
        })
    
    # Sort by start date (most recent first)
    timeline_items.sort(key=lambda x: x['start_date'], reverse=True)
    
    context.update({
        'experience_list': experience_list,
        'education_list': education_list,
        'timeline_items': timeline_items,
        'page_title': 'CV & Experience',
        'meta_description': 'Professional experience and qualifications of James Andrew.',
    })
    
    return render(request, 'portfolio/cv.html', context)


def projects_view(request):
    """
    Projects portfolio page with filtering and search
    """
    context = get_site_context()
    
    # Get filter parameters
    category = request.GET.get('category', '')
    search = request.GET.get('search', '')
    status = request.GET.get('status', '')
    
    # Start with all projects
    projects = Project.objects.all()
    
    # Apply filters
    if category:
        projects = projects.filter(category=category)
    
    if status:
        projects = projects.filter(status=status)
    
    if search:
        projects = projects.filter(
            Q(title__icontains=search) |
            Q(short_description__icontains=search) |
            Q(technologies__icontains=search)
        )
    
    # Get unique categories and statuses for filter dropdowns
    categories = Project.CATEGORY_CHOICES
    statuses = Project.STATUS_CHOICES
    
    # Group projects by category for display
    projects_by_category = {}
    for project in projects:
        cat_display = project.get_category_display()
        if cat_display not in projects_by_category:
            projects_by_category[cat_display] = []
        projects_by_category[cat_display].append(project)
    
    context.update({
        'projects': projects,
        'projects_by_category': projects_by_category,
        'categories': categories,
        'statuses': statuses,
        'current_category': category,
        'current_search': search,
        'current_status': status,
        'page_title': 'Projects',
        'meta_description': 'Portfolio of software development projects including web applications, games, and academic work.',
    })
    
    return render(request, 'portfolio/projects.html', context)


def project_detail_view(request, project_id):
    """
    Individual project detail page
    """
    context = get_site_context()
    
    project = get_object_or_404(Project, pk=project_id)
    
    # Get related projects (same category)
    related_projects = Project.objects.filter(
        category=project.category
    ).exclude(pk=project.pk)[:3]
    
    context.update({
        'project': project,
        'related_projects': related_projects,
        'page_title': project.title,
        'meta_description': project.short_description,
    })
    
    return render(request, 'portfolio/project_detail.html', context)


def skills_view(request):
    """
    Skills and technologies page with interactive charts
    """
    context = get_site_context()
    
    # Get skills grouped by category
    skills_by_category = {}
    for category_code, category_name in Skill.CATEGORY_CHOICES:
        skills = Skill.objects.filter(category=category_code)
        if skills:
            skills_by_category[category_name] = skills
    
    # Get data for charts (JSON format for JavaScript)
    chart_data = {}
    for category_name, skills in skills_by_category.items():
        chart_data[category_name] = [
            {
                'name': skill.name,
                'proficiency': skill.proficiency_percentage,
                'experience': skill.years_experience,
                'color': skill.color,
            }
            for skill in skills
        ]
    
    # Calculate overall statistics
    all_skills = Skill.objects.all()
    total_skills = all_skills.count()
    avg_proficiency = sum([skill.proficiency for skill in all_skills]) / total_skills if total_skills > 0 else 0
    total_experience = sum([skill.years_experience for skill in all_skills])
    
    context.update({
        'skills_by_category': skills_by_category,
        'chart_data': json.dumps(chart_data),
        'total_skills': total_skills,
        'avg_proficiency': round(avg_proficiency, 1),
        'total_experience': round(total_experience, 1),
        'page_title': 'Skills & Technologies',
        'meta_description': 'Technical skills including programming languages, frameworks, and tools.',
    })
    
    return render(request, 'portfolio/skills.html', context)


@require_http_methods(["GET", "POST"])
def contact_view(request):
    """
    Contact page with form handling
    """
    context = get_site_context()
    
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Save message to database
            contact_message = ContactMessage.objects.create(
                name=form.cleaned_data['name'],
                email=form.cleaned_data['email'],
                subject=form.cleaned_data['subject'],
                message=form.cleaned_data['message'],
            )
            
            # Send email notification (optional)
            try:
                send_mail(
                    subject=f"CV Website Contact: {form.cleaned_data['subject']}",
                    message=f"From: {form.cleaned_data['name']} ({form.cleaned_data['email']})\n\n{form.cleaned_data['message']}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=False,
                )
                logger.info(f"Contact email sent for message {contact_message.id}")
            except Exception as e:
                logger.error(f"Failed to send contact email: {e}")
            
            messages.success(request, "Thank you for your message! I'll get back to you soon.")
            form = ContactForm()  # Reset form
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ContactForm()
    
    context.update({
        'form': form,
        'page_title': 'Contact',
        'meta_description': 'Get in touch with James Andrew for opportunities and collaborations.',
    })
    
    return render(request, 'portfolio/contact.html', context)


@csrf_exempt
@require_http_methods(["POST"])
def ajax_contact_view(request):
    """
    AJAX endpoint for contact form submission
    """
    try:
        data = json.loads(request.body)
        form = ContactForm(data)
        
        if form.is_valid():
            contact_message = ContactMessage.objects.create(
                name=form.cleaned_data['name'],
                email=form.cleaned_data['email'],
                subject=form.cleaned_data['subject'],
                message=form.cleaned_data['message'],
            )
            
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


def download_cv_view(request):
    """
    Download CV file
    """
    personal_info = PersonalInfo.objects.first()
    
    if personal_info and personal_info.cv_file:
        response = HttpResponse(
            personal_info.cv_file.read(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="James_Andrew_CV.pdf"'
        return response
    
    messages.error(request, "CV file not available.")
    return redirect('portfolio:home')


def api_skills_view(request):
    """
    API endpoint for skills data (for charts/visualization)
    """
    skills = Skill.objects.all()
    data = [
        {
            'name': skill.name,
            'category': skill.get_category_display(),
            'proficiency': skill.proficiency_percentage,
            'experience': skill.years_experience,
            'color': skill.color,
        }
        for skill in skills
    ]
    
    return JsonResponse({'skills': data})


def api_projects_view(request):
    """
    API endpoint for projects data
    """
    projects = Project.objects.all()
    data = [
        {
            'id': project.id,
            'title': project.title,
            'description': project.short_description,
            'category': project.get_category_display(),
            'status': project.get_status_display(),
            'technologies': project.technology_list,
            'github_url': project.github_url,
            'demo_url': project.live_demo_url,
            'featured': project.featured,
        }
        for project in projects
    ]
    
    return JsonResponse({'projects': data})