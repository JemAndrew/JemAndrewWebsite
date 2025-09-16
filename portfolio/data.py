from datetime import date
import json

# Personal Information
PERSONAL_INFO = {
    'name': 'Jem Andrew',
    'title': 'Software Engineer | MSc Computer Science',
    'email': 'andrewjem8@gmail.com',
    'location': 'Newcastle, UK',
    'linkedin_url': 'https://www.linkedin.com/in/james-andrew-439771333/',
    'github_url': 'https://github.com/JemAndrew',
    'bio': """Software engineer with expertise in Django, PostgreSQL, and optimization algorithms. 
              Currently developing enterprise SaaS construction management platforms at BuildChorus. 
              MSc Computer Science graduate with research experience in medical AI and CNN architectures. 
              Passionate about solving complex technical challenges and building scalable systems.""",
    'typing_phrases': [
        "Software Engineer",
        "Full-Stack Developer", 
        "Django Specialist",
        "Problem Solver",
        "MSc Computer Science"
    ]
}

# Rest of your existing data stays the same...
# Professional Experience
EXPERIENCE = [
    {
        'position': 'Software Engineer',
        'company': 'BuildChorus',
        'location': 'Newcastle, UK',
        'start_date': date(2025, 9, 1),
        'end_date': None,
        'is_current': True,
        'description': """Engineering enterprise-grade SaaS construction management platform serving the £10+ billion 
                         construction software market. Developing user configurability features, multi-tenant architecture, 
                         and optimization algorithms using Django 5.0.6, PostgreSQL 17, and Google OR-Tools. 
                         Collaborating with cross-functional teams using GitLab and Jira while implementing Auth0 
                         authentication for enterprise client deployments.""",
        'skills_gained': 'Django 5.0.6, PostgreSQL 17, Google OR-Tools, Auth0, GitLab, Jira, Multi-tenant Architecture, Enterprise SaaS',
        'achievements': [
            'Implemented user configurability features for enterprise clients',
            'Designed multi-tenant database architecture',
            'Integrated Google OR-Tools for complex scheduling optimization',
            'Deployed solutions for enterprise construction management'
        ]
    }
]

# Education
EDUCATION = [
    {
        'degree_type': 'MSc',
        'subject': 'Computer Science',
        'institution': 'Newcastle University',
        'start_date': date(2022, 9, 1),
        'end_date': date(2023, 9, 1),
        'is_current': False,
        'grade': 'Merit',
        'description': """Advanced study in machine learning, algorithms, and software engineering. 
                         Dissertation focused on CNN architectures for automated skin cancer detection, 
                         achieving 15% diagnostic improvements over baseline models. Gained expertise 
                         in PyTorch, medical AI applications, and FDA-compliant evaluation frameworks.""",
        'technologies': 'PyTorch, Python, Machine Learning, CNN, Medical AI, Research Methods, Statistics'
    },
    {
        'degree_type': 'BSc',
        'subject': 'Biology',
        'institution': 'University Name',  # Replace with your university
        'start_date': date(2019, 9, 1),
        'end_date': date(2022, 6, 1),
        'is_current': False,
        'grade': 'Upper Second-Class Honours',
        'description': """Biological sciences foundation providing strong analytical and research skills. 
                         Developed expertise in statistical analysis, data interpretation, and scientific 
                         methodology that translates directly to software engineering and data science applications.""",
        'technologies': 'Statistical Analysis, Research Methods, Data Analysis, Scientific Writing'
    }
]

# Projects
PROJECTS = [
    {
        'title': 'Cryptocurrency Exchange Platform',
        'short_description': 'Custom order matching engine handling 1,000+ orders/second with Django and PostgreSQL, focused on stablecoin trading.',
        'detailed_description': """Built a complete cryptocurrency exchange platform from scratch with a focus on stablecoin trading. 
                                  Implemented a custom order matching engine using price-time priority algorithms capable of processing 
                                  over 1,000 orders per second. The system features real-time WebSocket connections for live price updates, 
                                  comprehensive user authentication, and robust financial transaction handling. Database architecture 
                                  optimized for high-frequency trading scenarios with proper indexing and transaction isolation.""",
        'technologies': 'Django, PostgreSQL, WebSockets, REST API, Financial Algorithms, Redis, Celery',
        'category': 'personal',
        'status': 'completed',
        'featured': True,
        'github_url': 'https://github.com/JemAndrew/crypto-exchange',
        'live_demo_url': None,
        'created_date': date(2024, 1, 1),
        'key_features': [
            'Order matching engine with price-time priority',
            'Real-time WebSocket price feeds',
            'Secure user authentication and KYC',
            'High-frequency transaction processing',
            'Comprehensive trading API'
        ]
    },
    {
        'title': 'Medical AI Diagnostic System',
        'short_description': 'CNN architectures for automated skin cancer detection achieving 15% diagnostic improvements over baseline models.',
        'detailed_description': """MSc dissertation project developing convolutional neural networks for automated skin cancer detection. 
                                  Implemented and compared multiple CNN architectures including ResNet, DenseNet, and custom designs. 
                                  Achieved 15% improvement in diagnostic accuracy over baseline models through advanced data augmentation, 
                                  transfer learning, and ensemble methods. Created FDA-compliant evaluation framework with clinical 
                                  validation protocols. Research contributes to improving early detection rates in dermatological diagnosis.""",
        'technologies': 'PyTorch, Python, CNN, Medical AI, Data Augmentation, Transfer Learning, Clinical Research',
        'category': 'academic',
        'status': 'completed',
        'featured': True,
        'github_url': None,
        'live_demo_url': None,
        'created_date': date(2023, 6, 1),
        'key_features': [
            '15% improvement in diagnostic accuracy',
            'Multiple CNN architecture comparison',
            'FDA-compliant evaluation framework',
            'Clinical validation protocols',
            'Advanced data augmentation techniques'
        ]
    },
    {
        'title': 'Holiday Cluedo PWA',
        'short_description': 'High-performance browser game supporting 20+ concurrent users with offline capability and Fisher-Yates shuffle algorithm.',
        'detailed_description': """Progressive Web Application implementing the classic Cluedo board game optimized for holiday entertainment. 
                                  Built with vanilla JavaScript for maximum performance, supporting 20+ concurrent users with real-time 
                                  game state synchronization. Implements Fisher-Yates shuffle algorithm for fair card distribution and 
                                  sophisticated collision detection for game piece movement. Features offline capability through service 
                                  workers, responsive design for mobile and desktop, and clean game state management.""",
        'technologies': 'JavaScript, PWA, Service Workers, WebSockets, Local Storage, Responsive Design',
        'category': 'personal',
        'status': 'completed',
        'featured': True,
        'github_url': 'https://github.com/JemAndrew/holiday-cluedo',
        'live_demo_url': 'https://familycluedo.netlify.app',
        'created_date': date(2023, 12, 1),
        'key_features': [
            '20+ concurrent user support',
            'Offline gameplay capability',
            'Fisher-Yates shuffle algorithm',
            'Real-time game synchronization',
            'Cross-platform responsive design'
        ]
    },
    {
        'title': 'Portfolio Website',
        'short_description': 'Professional Django portfolio website with modern design, optimized performance, and responsive layout.',
        'detailed_description': """This portfolio website built with Django and modern web technologies. Features clean, professional 
                                  design with Bootstrap 5, custom CSS animations, and responsive layout. Optimized for performance 
                                  with minimal dependencies and static content delivery. Implements modern web practices including 
                                  progressive enhancement, semantic HTML, and accessibility considerations.""",
        'technologies': 'Django, Bootstrap 5, CSS3, JavaScript, HTML5, WhiteNoise',
        'category': 'personal',
        'status': 'active',
        'featured': False,
        'github_url': 'https://github.com/JemAndrew/portfolio',
        'live_demo_url': None,
        'created_date': date(2024, 1, 15),
        'key_features': [
            'Responsive modern design',
            'Optimized performance',
            'Professional presentation',
            'Clean code architecture',
            'Fast deployment ready'
        ]
    }
]

# Skills organized by category
SKILLS = {
    'Programming Languages': [
        {'name': 'Python', 'proficiency': 5, 'years_experience': 3, 'description': 'Advanced Django development, data science, automation'},
        {'name': 'JavaScript', 'proficiency': 4, 'years_experience': 2, 'description': 'Frontend development, PWAs, async programming'},
        {'name': 'SQL', 'proficiency': 4, 'years_experience': 2, 'description': 'PostgreSQL, query optimization, database design'},
        {'name': 'HTML/CSS', 'proficiency': 5, 'years_experience': 3, 'description': 'Semantic markup, responsive design, modern CSS'},
    ],
    'Frameworks & Libraries': [
        {'name': 'Django', 'proficiency': 5, 'years_experience': 2, 'description': 'Full-stack web development, REST APIs, enterprise applications'},
        {'name': 'React', 'proficiency': 3, 'years_experience': 1, 'description': 'Component-based UI development, hooks, state management'},
        {'name': 'Bootstrap', 'proficiency': 4, 'years_experience': 2, 'description': 'Responsive design, component libraries, custom themes'},
        {'name': 'PyTorch', 'proficiency': 3, 'years_experience': 1, 'description': 'Deep learning, CNN architectures, medical AI research'},
    ],
    'Databases & Tools': [
        {'name': 'PostgreSQL', 'proficiency': 4, 'years_experience': 2, 'description': 'Advanced queries, optimization, multi-tenant architecture'},
        {'name': 'Git', 'proficiency': 4, 'years_experience': 3, 'description': 'Version control, branching strategies, collaboration'},
        {'name': 'Docker', 'proficiency': 3, 'years_experience': 1, 'description': 'Containerization, development environments, deployment'},
        {'name': 'Google OR-Tools', 'proficiency': 3, 'years_experience': 1, 'description': 'Optimization algorithms, scheduling, constraint programming'},
    ],
    'Soft Skills': [
        {'name': 'Problem Solving', 'proficiency': 5, 'years_experience': 3, 'description': 'Analytical thinking, debugging, system design'},
        {'name': 'Team Collaboration', 'proficiency': 4, 'years_experience': 2, 'description': 'Agile workflows, code reviews, cross-functional teams'},
        {'name': 'Technical Communication', 'proficiency': 4, 'years_experience': 2, 'description': 'Documentation, presentations, stakeholder communication'},
        {'name': 'Continuous Learning', 'proficiency': 5, 'years_experience': 3, 'description': 'Staying current with technology, self-directed learning'},
    ]
}

# Site settings and metadata
SITE_SETTINGS = {
    'site_title': 'Jem Andrew - Software Engineer',
    'meta_description': 'Software Engineer at BuildChorus specializing in Django, enterprise SaaS platforms, and optimization algorithms. MSc Computer Science graduate.',
    'keywords': 'Software Engineer, Django Developer, Python, PostgreSQL, Full Stack Developer, Newcastle',
    'analytics_id': None,
    'contact_email': 'andrewjem8@gmail.com'
}

# Contact form subjects for dropdown
CONTACT_SUBJECTS = [
    'General Inquiry',
    'Job Opportunity', 
    'Project Collaboration',
    'Technical Discussion',
    'Other'
]

def get_personal_info():
    """Get personal information - replaces PersonalInfo.objects.first()"""
    info = type('PersonalInfo', (), PERSONAL_INFO)()
    info.typing_phrases = json.dumps(PERSONAL_INFO['typing_phrases'])
    return info

def get_all_projects():
    """Get all projects - replaces Project.objects.all()"""
    projects = []
    for i, project_data in enumerate(PROJECTS, 1):
        class ProjectObj:
            def __init__(self, data, project_id):
                for key, value in data.items():
                    setattr(self, key, value)
                self.id = project_id
                self.technology_list = data['technologies'].split(', ')
            
            def get_category_display(self):
                return self.category.title()
            
            def get_status_display(self):
                return self.status.title()
        
        proj_obj = ProjectObj(project_data, i)
        projects.append(proj_obj)
    return projects

def get_featured_projects(limit=3):
    """Get featured projects - replaces Project.objects.filter(featured=True)"""
    all_projects = get_all_projects()
    featured = [p for p in all_projects if getattr(p, 'featured', False)]
    return featured[:limit]

def get_current_experience():
    """Get current position - replaces Experience.objects.filter(is_current=True).first()"""
    current = next((exp for exp in EXPERIENCE if exp.get('is_current', False)), None)
    if current:
        exp_obj = type('Experience', (), current)()
        exp_obj.skills_list = current['skills_gained'].split(', ')
        if exp_obj.start_date:
            if exp_obj.is_current:
                duration_days = (date.today() - exp_obj.start_date).days
            elif exp_obj.end_date:
                duration_days = (exp_obj.end_date - exp_obj.start_date).days
            else:
                duration_days = 0
            
            years = duration_days // 365
            months = (duration_days % 365) // 30
            if years > 0:
                exp_obj.duration_display = f"{years} year{'s' if years != 1 else ''}, {months} month{'s' if months != 1 else ''}"
            else:
                exp_obj.duration_display = f"{months} month{'s' if months != 1 else ''}"
        return exp_obj
    return None

def get_all_experience():
    """Get all experience - replaces Experience.objects.all()"""
    experiences = []
    for exp in EXPERIENCE:
        exp_obj = type('Experience', (), exp)()
        exp_obj.skills_list = exp['skills_gained'].split(', ')
        if exp_obj.start_date:
            if exp_obj.is_current:
                duration_days = (date.today() - exp_obj.start_date).days
            elif exp_obj.end_date:
                duration_days = (exp_obj.end_date - exp_obj.start_date).days
            else:
                duration_days = 0
            
            years = duration_days // 365
            months = (duration_days % 365) // 30
            if years > 0:
                exp_obj.duration_display = f"{years} year{'s' if years != 1 else ''}, {months} month{'s' if months != 1 else ''}"
            else:
                exp_obj.duration_display = f"{months} month{'s' if months != 1 else ''}"
        experiences.append(exp_obj)
    return experiences

def get_all_education():
    """Get all education - replaces Education.objects.all()"""
    educations = []
    for edu in EDUCATION:
        edu_obj = type('Education', (), edu)()
        edu_obj.technologies_list = edu['technologies'].split(', ')
        edu_obj.get_degree_type_display = lambda e=edu: e['degree_type']
        if edu_obj.start_date and edu_obj.end_date:
            edu_obj.duration_years = round((edu_obj.end_date - edu_obj.start_date).days / 365.25, 1)
        elif edu_obj.is_current and edu_obj.start_date:
            edu_obj.duration_years = round((date.today() - edu_obj.start_date).days / 365.25, 1)
        else:
            edu_obj.duration_years = 0
        educations.append(edu_obj)
    return educations

def get_skills_by_category():
    """Get skills organized by category"""
    skills_dict = {}
    for category, skills in SKILLS.items():
        skill_objects = []
        for skill in skills:
            skill_obj = type('Skill', (), skill)()
            skill_obj.proficiency_percentage = skill['proficiency'] * 20
            skill_obj.get_proficiency_display = lambda s=skill: ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'][s['proficiency']]
            skill_obj.category = category.lower().replace(' ', '_').replace('&', 'and')
            skill_obj.color = '#007bff'
            skill_obj.icon_class = f"fas fa-code"
            skill_objects.append(skill_obj)
        skills_dict[category] = skill_objects
    return skills_dict

def get_site_settings():
    """Get site settings - replaces SiteSettings.objects.first()"""
    return type('SiteSettings', (), SITE_SETTINGS)()