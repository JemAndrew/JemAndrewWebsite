# portfolio/github_service.py
"""
GitHub API Integration Service
Fetches real-time data from GitHub API
"""

import requests
import logging
from datetime import datetime, timedelta
from django.core.cache import cache
from django.conf import settings
import json

logger = logging.getLogger(__name__)

class GitHubService:
    """Service class for GitHub API interactions"""
    
    def __init__(self, username="JemAndrew"):
        self.username = username
        self.base_url = "https://api.github.com"
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': f'Portfolio-{username}'
        }
        
        # Add GitHub token if available (for higher rate limits)
        if hasattr(settings, 'GITHUB_TOKEN') and settings.GITHUB_TOKEN:
            self.headers['Authorization'] = f'token {settings.GITHUB_TOKEN}'
    
    def get_user_info(self):
        """Get GitHub user information"""
        cache_key = f'github_user_{self.username}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            response = requests.get(
                f"{self.base_url}/users/{self.username}",
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            
            user_data = response.json()
            
            # Cache for 1 hour
            cache.set(cache_key, user_data, 3600)
            return user_data
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch GitHub user info: {e}")
            return self._get_fallback_user_data()
    
    def get_repositories(self, limit=6):
        """Get user's repositories, sorted by activity"""
        cache_key = f'github_repos_{self.username}_{limit}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            response = requests.get(
                f"{self.base_url}/users/{self.username}/repos",
                headers=self.headers,
                params={
                    'sort': 'updated',
                    'direction': 'desc',
                    'per_page': limit,
                    'type': 'owner'
                },
                timeout=10
            )
            response.raise_for_status()
            
            repos = response.json()
            
            # Enhance with additional data
            enhanced_repos = []
            for repo in repos:
                enhanced_repo = {
                    'name': repo['name'],
                    'description': repo['description'] or 'No description available',
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'stars': repo['stargazers_count'],
                    'forks': repo['forks_count'],
                    'updated_at': repo['updated_at'],
                    'created_at': repo['created_at'],
                    'is_fork': repo['fork'],
                    'topics': repo.get('topics', []),
                    'size': repo['size'],
                    'open_issues': repo['open_issues_count']
                }
                
                # Get language statistics
                enhanced_repo['languages'] = self.get_repository_languages(repo['name'])
                enhanced_repos.append(enhanced_repo)
            
            # Cache for 30 minutes
            cache.set(cache_key, enhanced_repos, 1800)
            return enhanced_repos
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch GitHub repositories: {e}")
            return self._get_fallback_repos()
    
    def get_repository_languages(self, repo_name):
        """Get languages used in a specific repository"""
        cache_key = f'github_langs_{self.username}_{repo_name}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            response = requests.get(
                f"{self.base_url}/repos/{self.username}/{repo_name}/languages",
                headers=self.headers,
                timeout=5
            )
            response.raise_for_status()
            
            languages = response.json()
            
            # Calculate percentages
            total_bytes = sum(languages.values())
            if total_bytes > 0:
                language_percentages = {
                    lang: round((bytes_count / total_bytes) * 100, 1)
                    for lang, bytes_count in languages.items()
                }
            else:
                language_percentages = {}
            
            # Cache for 6 hours
            cache.set(cache_key, language_percentages, 21600)
            return language_percentages
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch repository languages for {repo_name}: {e}")
            return {}
    
    def get_commit_activity(self, days=30):
        """Get recent commit activity across all repositories"""
        cache_key = f'github_commits_{self.username}_{days}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            # Get recent events (includes pushes)
            response = requests.get(
                f"{self.base_url}/users/{self.username}/events",
                headers=self.headers,
                params={'per_page': 100},
                timeout=10
            )
            response.raise_for_status()
            
            events = response.json()
            
            # Filter push events and group by date
            commit_activity = {}
            cutoff_date = datetime.now() - timedelta(days=days)
            
            for event in events:
                if event['type'] == 'PushEvent':
                    event_date = datetime.strptime(
                        event['created_at'], '%Y-%m-%dT%H:%M:%SZ'
                    )
                    
                    if event_date >= cutoff_date:
                        date_str = event_date.strftime('%Y-%m-%d')
                        commit_count = len(event['payload'].get('commits', []))
                        
                        if date_str in commit_activity:
                            commit_activity[date_str] += commit_count
                        else:
                            commit_activity[date_str] = commit_count
            
            # Cache for 15 minutes
            cache.set(cache_key, commit_activity, 900)
            return commit_activity
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch commit activity: {e}")
            return {}
    
    def get_language_stats(self):
        """Get overall language statistics across all repositories"""
        cache_key = f'github_lang_stats_{self.username}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        repos = self.get_repositories(limit=20)  # Check more repos for language stats
        language_totals = {}
        
        for repo in repos:
            for language, percentage in repo.get('languages', {}).items():
                if language in language_totals:
                    language_totals[language] += percentage
                else:
                    language_totals[language] = percentage
        
        # Normalize to percentages
        total = sum(language_totals.values())
        if total > 0:
            language_stats = {
                lang: round((count / total) * 100, 1)
                for lang, count in language_totals.items()
            }
        else:
            language_stats = {}
        
        # Sort by usage
        sorted_languages = dict(
            sorted(language_stats.items(), key=lambda x: x[1], reverse=True)
        )
        
        # Cache for 2 hours
        cache.set(cache_key, sorted_languages, 7200)
        return sorted_languages
    
    def get_contribution_calendar(self):
        """Get contribution calendar data (simplified version)"""
        # Note: Full contribution calendar requires GraphQL API and authentication
        # This is a simplified version using commit activity
        
        commit_activity = self.get_commit_activity(days=365)
        calendar_data = []
        
        # Generate past year of dates
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            commits = commit_activity.get(date_str, 0)
            
            calendar_data.append({
                'date': date_str,
                'count': commits,
                'level': min(commits, 4)  # GitHub-style levels 0-4
            })
            
            current_date += timedelta(days=1)
        
        return calendar_data
    
    def _get_fallback_user_data(self):
        """Fallback data when API is unavailable"""
        return {
            'name': 'James Andrew',
            'login': self.username,
            'bio': 'Software Engineer specializing in Django and full-stack development',
            'public_repos': 5,
            'followers': 10,
            'following': 15,
            'location': 'Newcastle, UK',
            'blog': '',
            'company': 'BuildChorus'
        }
    
    def _get_fallback_repos(self):
        """Fallback repository data"""
        return [
            {
                'name': 'crypto-exchange',
                'description': 'Cryptocurrency exchange platform with order matching engine',
                'html_url': f'https://github.com/{self.username}/crypto-exchange',
                'language': 'Python',
                'stars': 8,
                'forks': 2,
                'updated_at': '2024-01-15T10:00:00Z',
                'created_at': '2023-12-01T10:00:00Z',
                'is_fork': False,
                'topics': ['django', 'cryptocurrency', 'websockets'],
                'languages': {'Python': 85.5, 'JavaScript': 10.2, 'HTML': 4.3}
            },
            {
                'name': 'portfolio',
                'description': 'Professional portfolio website built with Django',
                'html_url': f'https://github.com/{self.username}/portfolio',
                'language': 'Python',
                'stars': 5,
                'forks': 1,
                'updated_at': '2024-01-20T15:30:00Z',
                'created_at': '2024-01-10T09:00:00Z',
                'is_fork': False,
                'topics': ['django', 'portfolio', 'web-development'],
                'languages': {'Python': 60.0, 'JavaScript': 25.0, 'CSS': 15.0}
            }
        ]


# portfolio/views.py (add to your existing views.py)
def get_github_data():
    """Helper function to get GitHub data for templates"""
    github_service = GitHubService()
    
    return {
        'github_user': github_service.get_user_info(),
        'github_repos': github_service.get_repositories(),
        'github_languages': github_service.get_language_stats(),
        'github_commits': github_service.get_commit_activity(),
        'github_calendar': github_service.get_contribution_calendar()
    }

# Update your home_view function
def home_view(request):
    """Updated home view with GitHub integration"""
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
    
    # Get static data
    featured_projects = data.get_featured_projects(3)
    current_position = data.get_current_experience()
    education_list = data.get_all_education()
    skills_by_category = data.get_skills_by_category()
    all_projects = data.get_all_projects()
    
    # Get GitHub data
    github_data = get_github_data()
    
    context.update({
        'featured_projects': featured_projects,
        'current_position': current_position,
        'education_list': education_list,
        'skills_by_category': skills_by_category,
        'projects': all_projects,
        'form': form,
        'page_title': 'Home',
        'meta_description': 'James Andrew - Software Engineer at BuildChorus specializing in Django, enterprise SaaS platforms, and full-stack development.',
        **github_data  # Add GitHub data to context
    })
    
    return render(request, 'portfolio/home.html', context)