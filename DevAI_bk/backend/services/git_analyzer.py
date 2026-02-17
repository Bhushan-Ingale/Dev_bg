import git
import os
import tempfile
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Any
import shutil
import json

class GitAnalyzer:
    def __init__(self, repo_url: str):
        self.repo_url = repo_url
        self.repo_name = repo_url.split('/')[-1].replace('.git', '')
        self.temp_dir = None
        self.repo = None
        
    def clone_repo(self):
        """Clone repository to temp directory"""
        try:
            self.temp_dir = tempfile.mkdtemp()
            self.repo = git.Repo.clone_from(self.repo_url, self.temp_dir, depth=1)  # depth=1 for speed!
            return True
        except Exception as e:
            print(f"Clone failed: {e}")
            return False
    
    def get_commit_history(self, days: int = 30):
        """Get commit history - FAST version"""
        if not self.repo and not self.clone_repo():
            return []
        
        commits = []
        since_date = datetime.now() - timedelta(days=days)
        
        for commit in self.repo.iter_commits(since=since_date, max_count=100):  # Limit to 100 commits
            commits.append({
                'hash': commit.hexsha[:7],
                'author': str(commit.author).split('@')[0],
                'date': datetime.fromtimestamp(commit.committed_date).isoformat(),
                'message': commit.message.split('\n')[0][:50],
                'files_changed': len(commit.stats.files),
                'additions': commit.stats.total['insertions'],
                'deletions': commit.stats.total['deletions']
            })
        
        return commits
    
    def get_team_stats(self):
        """Get ONLY the stats we need for dashboard"""
        commits = self.get_commit_history(days=30)
        
        if not commits:
            return {
                'total_commits': 0,
                'total_contributors': 0,
                'total_additions': 0,
                'total_deletions': 0,
                'contributors': []
            }
        
        # Group by author
        contributors = defaultdict(lambda: {'commits': 0, 'additions': 0, 'deletions': 0})
        for commit in commits:
            author = commit['author']
            contributors[author]['commits'] += 1
            contributors[author]['additions'] += commit['additions']
            contributors[author]['deletions'] += commit['deletions']
        
        # Format for dashboard
        contributor_list = []
        for author, stats in contributors.items():
            contributor_list.append({
                'name': author[:15],
                'commits': stats['commits'],
                'additions': stats['additions'],
                'deletions': stats['deletions'],
                'activity_score': min(100, stats['commits'] * 2 + stats['additions'] // 100)
            })
        
        # Sort by commits
        contributor_list.sort(key=lambda x: x['commits'], reverse=True)
        
        # Daily commit count for timeline
        dates = {}
        for commit in commits:
            date = commit['date'][:10]
            dates[date] = dates.get(date, 0) + 1
        
        timeline = [{'date': d, 'commits': c} for d, c in sorted(dates.items())[-14:]]
        
        return {
            'summary': {
                'total_commits': len(commits),
                'total_contributors': len(contributors),
                'total_additions': sum(c['additions'] for c in commits),
                'total_deletions': sum(c['deletions'] for c in commits),
                'active_days': len(dates)
            },
            'contributors': contributor_list[:5],  # Top 5 only
            'timeline': timeline
        }
    
    def cleanup(self):
        """Remove temp directory"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
    
    def __del__(self):
        self.cleanup()