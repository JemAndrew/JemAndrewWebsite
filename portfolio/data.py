from datetime import date
import json

# Personal Information - Updated with your authentic voice
PERSONAL_INFO = {
    'name': 'Jem Andrew',
    'title': 'Software Engineer | MSc Computer Science',
    'email': 'andrewjem8@gmail.com',
    'location': 'Newcastle, UK',
    'linkedin_url': 'https://www.linkedin.com/in/james-andrew-439771333/',
    'github_url': 'https://github.com/JemAndrew',
    'bio': """I'm a software engineer passionate about crafting well-structured, logical backend code. 
              I'm fascinated by machine learning and large language models, particularly model training. 
              I'm well-versed in cybersecurity and working with databases of any scale, and I love putting 
              these skills to the test through my work and personal projects.""",
    'bio_extended': """My journey began with self-teaching – diving into Codecademy courses and watching free 
                      online lectures from top universities. Then came my BSc in Biology, which unexpectedly 
                      sparked my love for coding through R. I was captivated by its creative power to produce 
                      the scientific figures you see in journals and research papers. This passion led me to 
                      pursue a Master's in Computer Science, where I fully immersed myself in a much broader 
                      skill set – from Java and SQL to cybersecurity and ethical hacking with tools like 
                      Wireshark and nmap.""",
    'typing_phrases': [
        "Software Engineer",
        "Backend Developer", 
        "Machine Learning Enthusiast",
        "Problem Solver",
        "MSc Computer Science"
    ]
}

# Professional Experience - Updated with cleaner format
EXPERIENCE = [
    {
        'position': 'Software Engineer',
        'company': 'BuildChorus',
        'location': 'Newcastle, UK',
        'start_date': date(2025, 9, 1),
        'end_date': None,
        'is_current': True,
        'description': """Working at BuildChorus where I develop full-stack features for our construction management SaaS platform.""",
        'responsibilities': [
            'Building user configurability features for material procurement strategies',
            'Deploying containerised applications on Google Cloud Platform using Docker',
            'Optimising PostgreSQL databases for complex construction data',
            'Collaborating through GitLab workflows and Jira sprint planning'
        ],
        'skills_gained': 'Django 5.0.6, PostgreSQL 17, Google OR-Tools, Auth0, GitLab, Jira, Multi-tenant Architecture, Enterprise SaaS',
        'achievements': [
            'Implemented user configurability features for enterprise clients',
            'Designed multi-tenant database architecture',
            'Integrated Google OR-Tools for complex scheduling optimisation',
            'Deployed solutions for enterprise construction management'
        ]
    }
]

# Education - Updated with correct dates and actual grades
EDUCATION = [
    {
        'degree_type': 'MSc',
        'subject': 'Computer Science',
        'institution': 'Newcastle University',
        'start_date': date(2024, 9, 1),
        'end_date': date(2025, 8, 1),
        'is_current': False,
        'grade': 'Merit',
        'modules': [
            {'name': 'Advanced Programming', 'grade': 84},
            {'name': 'Software Engineering and Team Project', 'grade': 84},
            {'name': 'Database Systems', 'grade': 83},
            {'name': 'Computer Networks', 'grade': 82},
            {'name': 'Cybersecurity', 'grade': 77},
            {'name': 'Programming and Data Structures', 'grade': 76},
            {'name': 'Professional Skills and Portfolio', 'grade': 73},
            {'name': 'Software Development Advanced Techniques', 'grade': 64},
            {'name': 'Human Computer Interaction', 'grade': 55},
            {'name': 'Web Technologies', 'grade': 52}
        ],
        'description': """Comparison of Novel vs Standard CNN Architectures for Automated Skin Cancer Detection. 
                         Developed an FDA-compliant evaluation framework comparing state-of-the-art deep learning 
                         architectures for automated dermatological diagnosis.""",
        'technologies': 'PyTorch, Python, Machine Learning, CNN, Medical AI, TensorFlow, Statistical Validation'
    },
    {
        'degree_type': 'BSc (Hons)',
        'subject': 'Biology',
        'institution': 'Newcastle University',
        'start_date': date(2021, 9, 1),
        'end_date': date(2024, 5, 1),
        'is_current': False,
        'grade': 'Upper Second-Class Honours (2:1)',
        'description': """A Systematic Review of CRISPR Gene Editing in Enhancing Fusarium Head Blight Resistance 
                         in Wheat and Barley (83%). Focused on comparative analysis of CRISPR techniques and 
                         systematic literature review methodology.""",
        'technologies': 'R, Statistical Analysis, Bioinformatics, AlphaFold, BLAST, Research Methods'
    }
]

# Projects - Updated with more authentic descriptions
PROJECTS = [
    {
        'title': 'Cryptocurrency Exchange Platform',
        'short_description': 'Built a custom order matching engine with price-time priority algorithm handling 1000+ orders per second.',
        'detailed_description': """Built a cryptocurrency exchange from scratch focused on stablecoin trading. 
                                  The core is a custom order matching engine using price-time priority that handles 
                                  over 1000 orders per second. Real-time WebSocket connections keep prices live and 
                                  the database schema carefully manages relationships between orders trades and wallets. 
                                  Edge cases like partial fills and identical price orders are all handled properly.""",
        'technologies': 'Django, PostgreSQL, WebSockets, REST API, Financial Algorithms',
        'category': 'personal',
        'status': 'completed',
        'featured': True,
        'github_url': 'https://github.com/JemAndrew/crypto-exchange',
        'live_demo_url': None,
        'created_date': date(2024, 1, 1),
        'key_features': [
            'Order matching engine with price-time priority',
            'Real-time WebSocket price feeds',
            'High-frequency transaction processing'
        ]
    },
    {
        'title': 'Medical AI Diagnostic System',
        'short_description': 'MSc dissertation using CNN architectures for skin cancer detection achieving 15% improvement over baselines.',
        'detailed_description': """My MSc dissertation project where I developed CNNs for automated skin cancer detection. 
                                  I compared multiple architectures including ResNet DenseNet and custom designs. 
                                  Through advanced data augmentation and ensemble methods I achieved 15% better accuracy 
                                  than baseline models. The evaluation framework follows FDA compliance guidelines which 
                                  was crucial for potential clinical application.""",
        'technologies': 'PyTorch, Python, CNN, Medical AI, Transfer Learning',
        'category': 'academic',
        'status': 'completed',
        'featured': True,
        'github_url': None,
        'live_demo_url': None,
        'created_date': date(2025, 8, 1),
        'key_features': [
            '15% improvement in diagnostic accuracy',
            'Multiple CNN architecture comparison',
            'FDA-compliant evaluation framework'
        ]
    },
    {
        'title': 'Holiday Cluedo PWA',
        'short_description': 'Browser-based multiplayer game supporting 20+ concurrent users with offline capability.',
        'detailed_description': """Built a Progressive Web App version of Cluedo optimised for holiday entertainment. 
                                  Written in vanilla JavaScript for maximum performance and supports 20+ concurrent users. 
                                  The Fisher-Yates shuffle algorithm ensures fair card distribution and collision detection 
                                  handles game piece movement. Service workers enable offline play so the game works without 
                                  internet connection.""",
        'technologies': 'JavaScript, PWA, Service Workers, WebSockets, Local Storage',
        'category': 'personal',
        'status': 'completed',
        'featured': True,
        'github_url': 'https://github.com/JemAndrew/holiday-cluedo',
        'live_demo_url': None,
        'created_date': date(2023, 12, 1),
        'key_features': [
            '20+ concurrent user support',
            'Offline gameplay capability',
            'Fisher-Yates shuffle algorithm for fair play'
        ]
    },
    {
        'title': 'Bike Route Planning Application',
        'short_description': 'Full-stack cycling route app built with Flask React and MongoDB in a 5-person team.',
        'detailed_description': """Collaborated in a 5-person team to build a cycling route application that scored 85%. 
                                  I developed the REST API endpoints for user authentication and route management. 
                                  We had to migrate from Google Places to HERE Maps API when Google deprecated theirs. 
                                  The stack uses React frontend with Flask backend and MongoDB for data storage. 
                                  We followed agile methodology with proper sprint planning and Git version control.""",
        'technologies': 'Python, Flask, React, MongoDB, HERE Maps API',
        'category': 'academic',
        'status': 'completed',
        'featured': False,
        'github_url': 'https://github.com/JemAndrew/bike-route-planning',
        'live_demo_url': None,
        'created_date': date(2025, 3, 1),
        'key_features': [
            'REST API for authentication and routes',
            'Integration with HERE Maps API',
            'Agile team collaboration'
        ]
    },
    {
        'title': 'Portfolio Website',
        'short_description': 'Professional Django portfolio with responsive design and modern UI.',
        'detailed_description': """This portfolio website showcases my work through clean design and efficient code. 
                                  Built with Django and modern web technologies it features responsive layouts that 
                                  work across all devices. The focus is on performance with minimal dependencies and 
                                  fast load times. Every element is crafted to present my projects and skills clearly.""",
        'technologies': 'Django, CSS3, JavaScript, HTML5, WhiteNoise',
        'category': 'personal',
        'status': 'active',
        'featured': False,
        'github_url': 'https://github.com/JemAndrew/portfolio',
        'live_demo_url': None,
        'created_date': date(2024, 1, 15),
        'key_features': [
            'Responsive modern design',
            'Optimised performance',
            'Clean code architecture'
        ]
    }
]

# Projects intro text
PROJECTS_INTRO = """Projects ranging from academic to personal where I implement my own ideas or explore 
                    concepts from others. Each one is a chance to test myself and write reproducible clean 
                    code that's efficient and logical."""

# Skills remain the same but we could update descriptions if needed
SKILLS = {
    'Programming Languages': [
        {'name': 'Python', 'proficiency': 5, 'years_experience': 3, 'description': 'Backend development, data science, automation'},
        {'name': 'JavaScript', 'proficiency': 4, 'years_experience': 2, 'description': 'Frontend development, PWAs, async programming'},
        {'name': 'Java', 'proficiency': 4, 'years_experience': 1, 'description': 'Object-oriented programming, algorithms'},
        {'name': 'SQL', 'proficiency': 4, 'years_experience': 2, 'description': 'PostgreSQL, query optimisation, database design'},
        {'name': 'R', 'proficiency': 3, 'years_experience': 3, 'description': 'Statistical analysis, data visualisation'},
        {'name': 'HTML/CSS', 'proficiency': 5, 'years_experience': 3, 'description': 'Semantic markup, responsive design, modern CSS'},
    ],
    'Frameworks & Libraries': [
        {'name': 'Django', 'proficiency': 5, 'years_experience': 2, 'description': 'Full-stack web development, REST APIs'},
        {'name': 'Flask', 'proficiency': 3, 'years_experience': 1, 'description': 'Lightweight web applications, APIs'},
        {'name': 'React', 'proficiency': 3, 'years_experience': 1, 'description': 'Component-based UI development'},
        {'name': 'PyTorch', 'proficiency': 3, 'years_experience': 1, 'description': 'Deep learning, CNN architectures'},
        {'name': 'Bootstrap', 'proficiency': 4, 'years_experience': 2, 'description': 'Responsive design, component libraries'},
    ],
    'Databases & Tools': [
        {'name': 'PostgreSQL', 'proficiency': 4, 'years_experience': 2, 'description': 'Advanced queries, optimisation'},
        {'name': 'MongoDB', 'proficiency': 3, 'years_experience': 1, 'description': 'NoSQL, document storage'},
        {'name': 'Git', 'proficiency': 4, 'years_experience': 3, 'description': 'Version control, collaboration'},
        {'name': 'Docker', 'proficiency': 3, 'years_experience': 1, 'description': 'Containerisation, deployment'},
        {'name': 'Google OR-Tools', 'proficiency': 3, 'years_experience': 1, 'description': 'Optimisation algorithms'},
    ],
    'Cybersecurity': [
        {'name': 'Wireshark', 'proficiency': 3, 'years_experience': 1, 'description': 'Network analysis, packet inspection'},
        {'name': 'nmap', 'proficiency': 3, 'years_experience': 1, 'description': 'Network scanning, security auditing'},
        {'name': 'PCAP Analysis', 'proficiency': 3, 'years_experience': 1, 'description': 'Traffic analysis, threat detection'},
    ]
}

# Site settings and metadata
SITE_SETTINGS = {
    'site_title': 'Jem Andrew - Software Engineer',
    'meta_description': 'Software Engineer passionate about backend development, machine learning, and building efficient code.',
    'keywords': 'Software Engineer, Django Developer, Python, Machine Learning, Backend Development, Newcastle',
    'analytics_id': None,
    'contact_email': 'andrewjem8@gmail.com'
}

# Helper functions remain the same
def get_personal_info():
    """Get personal information"""
    info = type('PersonalInfo', (), PERSONAL_INFO)()
    info.typing_phrases = json.dumps(PERSONAL_INFO['typing_phrases'])
    return info

def get_all_projects():
    """Get all projects"""
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
    """Get featured projects"""
    all_projects = get_all_projects()
    featured = [p for p in all_projects if getattr(p, 'featured', False)]
    return featured[:limit]

def get_current_experience():
    """Get current position"""
    current = next((exp for exp in EXPERIENCE if exp.get('is_current', False)), None)
    if current:
        exp_obj = type('Experience', (), current)()
        exp_obj.skills_list = current['skills_gained'].split(', ')
        if 'responsibilities' in current:
            exp_obj.responsibilities = current['responsibilities']
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
    """Get all experience"""
    experiences = []
    for exp in EXPERIENCE:
        exp_obj = type('Experience', (), exp)()
        exp_obj.skills_list = exp['skills_gained'].split(', ')
        if 'responsibilities' in exp:
            exp_obj.responsibilities = exp['responsibilities']
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
    """Get all education"""
    educations = []
    for edu in EDUCATION:
        edu_obj = type('Education', (), edu)()
        edu_obj.technologies_list = edu['technologies'].split(', ')
        edu_obj.get_degree_type_display = lambda e=edu: e['degree_type']
        if 'modules' in edu:
            edu_obj.modules = edu['modules']
        if edu_obj.start_date and edu_obj.end_date:
            edu_obj.duration_years = round((edu_obj.end_date - edu_obj.start_date).days / 365.25, 1)
        elif edu_obj.is_current and edu_obj.start_date:
            edu_obj.duration_years = round((date.today() - edu_obj.start_date).days / 365.25, 1)
        else:
            edu_obj.duration_years = 0
        educations.append(edu_obj)
    return educations

def get_skills_by_category():
    """Get skills organised by category"""
    skills_dict = {}
    for category, skills in SKILLS.items():
        skill_objects = []
        for skill in skills:
            skill_obj = type('Skill', (), skill)()
            skill_obj.proficiency_percentage = skill['proficiency'] * 20
            skill_obj.get_proficiency_display = lambda s=skill: ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'][s['proficiency']]
            skill_obj.category = category.lower().replace(' ', '_').replace('&', 'and')
            skill_obj.color = '#dc2626'
            skill_obj.icon_class = f"fas fa-code"
            skill_objects.append(skill_obj)
        skills_dict[category] = skill_objects
    return skills_dict

def get_site_settings():
    """Get site settings"""
    return type('SiteSettings', (), SITE_SETTINGS)()