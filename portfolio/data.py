"""
Portfolio Data
All the content for the portfolio site - projects, experience, skills, etc.
"""

from datetime import date
import json




class SimpleObject:
    """Base class that just holds attributes"""
    def __init__(self, data_dict):
        for key, value in data_dict.items():
            setattr(self, key, value)


# Personal Info

PERSONAL_INFO = {
    'name': 'Jem Andrew',
    'title': 'Software Engineer | MSc Computer Science',
    'email': 'andrewjem8@gmail.com',
    'location': '',
    'linkedin_url': 'https://www.linkedin.com/in/jem-andrew-439771333/',
    'github_url': 'https://github.com/JemAndrew',
    'bio': """I'm a software engineer passionate about crafting well-structured, logical backend code. 
          Currently working with Django at BuildChorus whilst consulting on AI-powered legal tech. 
          I'm fascinated by machine learning and large language models, particularly model training. 
          I'm well-versed in cybersecurity and working with databases of any scale, and I love putting 
          these skills to the test through my work and personal projects.""",
    'bio_extended': """I started learning to code during my free time before university, exploring free published 
                      lectures from leading institutions such as MIT and completing as many codeacademy courses as i could do.
                      Then came my BSc in Biology, which unexpectedly sparked my love for coding through R. 
                      I loved the creativeness of it, which led to this passion to pursue a Master's in Computer Science, where I fully 
                      immersed myself in a much broader skill set – from Java and SQL to cybersecurity and ethical hacking.""",
    'typing_phrases': [
        "Software Engineer",
        "Backend Developer", 
        "Machine Learning Enthusiast",
        "Problem Solver",
        "MSc Computer Science"
    ]
}


# Work Experience

EXPERIENCE = [
    {
        'position': 'Freelance AI Consultant',
        'company': 'Law Firm Client',
        'location': 'Remote',
        'start_date': date(2025, 10, 1),
        'end_date': None,
        'is_current': True,
        'is_primary_focus': True,
        'description': """Developing and maintaining an AI-powered legal document analysis system for ongoing commercial litigation. 
                         Providing continuous analysis and improvements as new case materials emerge.""",
        'responsibilities': [
            'Engineering production-grade legal AI system processing 18,000+ documents',
            'Implementing 4-pass iterative architecture with confidence tracking',
            'Delivering tribunal-ready work products for complex litigation',
            'Maintaining and improving system based on case requirements'
        ],
        'skills_gained': 'Python, Anthropic Claude API, RAG Architecture, ChromaDB, Legal Tech, Client Management',
        'achievements': [
            'Achieved 30% cost reduction vs traditional analysis methods',
            '40% speed improvement over previous approaches',
            '95% confidence certainty in extracted legal intelligence',
            'Processing 18,000+ documents in 30-48 hours'
        ]
    },
    {
        'position': 'Software Engineer',
        'company': 'BuildChorus.com',
        'location': '',
        'start_date': date(2025, 9, 1),
        'end_date': None,
        'is_current': True,
        'is_primary_focus': False,
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
    },
]


# Education

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


# Projects

PROJECTS = [
    {
        'title': 'Litigation Intelligence Platform',
        'short_description': 'AI-powered legal document analysis system processing 18,000+ documents in 48 hours.',
        'detailed_description': """Engineered a production-grade legal AI system that analyses large-scale commercial litigation 
                                documents using a 4-pass iterative architecture with Anthropic's Claude models. The system 
                                intelligently triages thousands of documents, extracts structured legal intelligence including 
                                breaches, contradictions and timeline events, conducts autonomous recursive investigations, and 
                                generates tribunal-ready work products.""",
        'technologies': 'Python, Anthropic Claude API, ChromaDB, SQLite, RAG Architecture, Extended Thinking, BM25 Retrieval',
        'category': 'professional',
        'status': 'completed',
        'featured': True,
        'github_url': None,
        'live_demo_url': None,
        'created_date': date(2025, 10, 1),
        'key_features': [
            '4-pass iterative architecture processing 18,000+ documents in 30-48 hours',
            'Autonomous recursive investigation engine',
            'Multi-tier memory system with vector database',
            'Cost optimised at £0.014-0.021 per document'
        ]
    },
    {
        'title': 'Cryptocurrency Exchange Platform',
        'short_description': 'Custom order matching engine with price-time priority algorithm.',
        'detailed_description': """Built a cryptocurrency exchange from scratch focused on stablecoin trading. 
                                  Implemented a custom order matching engine with price-time priority algorithm, designed 
                                  RESTful API for account and trading, and created secure user authentication with bcrypt 
                                  and JWT. The frontend uses React with real-time WebSocket updates for live order books.""",
        'technologies': 'Python, FastAPI, PostgreSQL, Redis, React, WebSocket',
        'category': 'personal',
        'status': 'completed',
        'featured': True,
        'github_url': 'https://github.com/JemAndrew/crypto-exchange',
        'live_demo_url': None,
        'created_date': date(2024, 7, 1),
        'key_features': [
            'Custom order matching engine',
            'Real-time WebSocket updates',
            'Secure authentication'
        ]
    },
    {
        'title': 'Holiday Cluedo PWA',
        'short_description': 'Progressive Web App version of Cluedo for offline holiday entertainment.',
        'detailed_description': """Built a Progressive Web App version of Cluedo optimised for holiday entertainment. 
                                  Written in vanilla JavaScript for maximum performance and supports 20+ concurrent users. 
                                  The Fisher-Yates shuffle algorithm ensures fair card distribution and collision detection 
                                  handles game piece movement. Service workers enable offline play.""",
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
            'Fisher-Yates shuffle algorithm'
        ]
    },
    {
        'title': 'Bike Route Planning Application',
        'short_description': 'Full-stack cycling route app built with Flask, React and MongoDB.',
        'detailed_description': """Collaborated in a 5-person team to build a cycling route application that scored 85%. 
                                I developed the REST API endpoints for user authentication and route management. 
                                We followed agile methodology with proper sprint planning and Git version control.""",
        'technologies': 'Python, Flask, React, MongoDB, HERE Maps API',
        'category': 'academic',
        'status': 'completed',
        'featured': False,
        'github_url': 'https://github.com/JemAndrew/cycle_plan',  
        'live_demo_url': None,
        'created_date': date(2024, 3, 1),
        'key_features': [
            'REST API for authentication',
            'HERE Maps integration',
            'Agile team collaboration'
        ]
    },
    {
        'title': 'Portfolio Website',
        'short_description': 'Professional Django portfolio with responsive design and modern UI.',
        'detailed_description': """This portfolio website showcases my work through clean design and efficient code. 
                                  Built with Django and modern web technologies, focused on performance with minimal 
                                  dependencies and fast load times.""",
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


# Skills

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


# Site Settings

SITE_SETTINGS = {
    'site_title': 'Jem Andrew - Software Engineer',
    'meta_description': 'Software Engineer passionate about backend development, machine learning, and building efficient code.',
    'keywords': 'Software Engineer, Django Developer, Python, Machine Learning, Backend Development, Newcastle',
    'analytics_id': None,
    'contact_email': 'andrewjem8@gmail.com'
}


# Helper Functions 

def get_personal_info():
    """Get personal info as an object"""
    info = SimpleObject(PERSONAL_INFO)
    info.typing_phrases = json.dumps(PERSONAL_INFO['typing_phrases'])
    return info


def get_all_projects():
    """Get all projects sorted by date (newest first)"""
    projects = []
    
    for i, project_data in enumerate(PROJECTS, 1):
        # Create project object
        proj = SimpleObject(project_data)
        proj.id = i
        proj.technology_list = project_data['technologies'].split(', ')
        projects.append(proj)
    
    # Sort by date - newest first
    projects.sort(key=lambda x: x.created_date, reverse=True)
    return projects


def get_featured_projects(limit=3):
    """Get featured projects only"""
    all_projects = get_all_projects()
    featured = [p for p in all_projects if p.featured]
    return featured[:limit]


def get_current_experience():
    """Get the primary current position"""
    for exp in EXPERIENCE:
        if exp.get('is_current') and exp.get('is_primary_focus'):
            return create_experience_object(exp)
    return None


def get_all_current_experience():
    """Get all current positions"""
    current = [exp for exp in EXPERIENCE if exp.get('is_current')]
    return [create_experience_object(exp) for exp in current]


def get_all_experience():
    """Get all experience"""
    return [create_experience_object(exp) for exp in EXPERIENCE]


def create_experience_object(exp_data):
    """Helper to create experience object with calculated fields"""
    exp = SimpleObject(exp_data)
    exp.skills_list = exp_data['skills_gained'].split(', ')
    
    # Calculate duration if we have dates
    if exp.start_date:
        if exp.is_current:
            days = (date.today() - exp.start_date).days
        elif exp.end_date:
            days = (exp.end_date - exp.start_date).days
        else:
            days = 0
        
        years = days // 365
        months = (days % 365) // 30
        
        if years > 0:
            exp.duration_display = f"{years} year{'s' if years != 1 else ''}, {months} month{'s' if months != 1 else ''}"
        else:
            exp.duration_display = f"{months} month{'s' if months != 1 else ''}"
    
    return exp


def get_all_education():
    """Get all education"""
    educations = []
    
    for edu_data in EDUCATION:
        edu = SimpleObject(edu_data)
        edu.technologies_list = edu_data['technologies'].split(', ')
        
        # Calculate duration in years
        if edu.start_date and edu.end_date:
            edu.duration_years = round((edu.end_date - edu.start_date).days / 365.25, 1)
        elif edu.is_current and edu.start_date:
            edu.duration_years = round((date.today() - edu.start_date).days / 365.25, 1)
        else:
            edu.duration_years = 0
        
        educations.append(edu)
    
    return educations


def get_skills_by_category():
    """Get skills organised by category"""
    skills_dict = {}
    
    for category, skills_list in SKILLS.items():
        skill_objects = []
        
        for skill_data in skills_list:
            skill = SimpleObject(skill_data)
            skill.proficiency_percentage = skill_data['proficiency'] * 20
            skill.category = category.lower().replace(' ', '_').replace('&', 'and')
            
            # Proficiency level names
            proficiency_levels = ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert']
            skill.proficiency_level = proficiency_levels[skill_data['proficiency']]
            
            skill_objects.append(skill)
        
        skills_dict[category] = skill_objects
    
    return skills_dict


def get_site_settings():
    """Get site settings"""
    return SimpleObject(SITE_SETTINGS)






