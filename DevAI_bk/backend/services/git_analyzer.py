"""
services/git_analyzer.py — Real GitHub repository analysis using GitPython.

Clones the repo to a temp directory, extracts commit history, contributor
stats, and file-level changes. Cleans up after itself.

Key design decisions:
- shallow clone (depth=100) for speed — full history unnecessary
- deterministic fallback analytics when repo is private/unavailable
- contributor names normalised to handle email vs display name mismatches
"""

import os
import git
import shutil
import logging
import tempfile
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


class GitAnalyzer:
    """
    Analyze a GitHub repository and return structured data
    suitable for the DevAI dashboard.
    """

    def __init__(self, repo_url: str):
        self.repo_url  = repo_url.strip()
        self.repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "")
        self.temp_dir: Optional[str] = None
        self.repo: Optional[git.Repo] = None

    # ── Public API ────────────────────────────────────────────────────────────

    def get_team_stats(self, days: int = 30) -> Dict[str, Any]:
        """
        Main entry point. Returns analytics dict compatible with frontend.
        Always succeeds — falls back to empty-but-valid structure on error.
        """
        try:
            if not self._clone():
                return self._empty_stats()

            commits  = self._get_commits(days)
            if not commits:
                return self._empty_stats()

            contributors = self._aggregate_contributors(commits)
            timeline     = self._build_timeline(commits, days)

            total_add = sum(c["additions"] for c in commits)
            total_del = sum(c["deletions"] for c in commits)
            active    = len({c["date"][:10] for c in commits})

            return {
                "summary": {
                    "total_commits":      len(commits),
                    "total_contributors": len(contributors),
                    "total_additions":    total_add,
                    "total_deletions":    total_del,
                    "active_days":        active,
                },
                "contributors": contributors[:5],  # top 5 for dashboard
                "timeline":     timeline,
                "raw_commits":  commits[:20],      # latest 20 for PR feed
            }
        except Exception as e:
            logger.error(f"GitAnalyzer.get_team_stats failed: {e}")
            return self._empty_stats()
        finally:
            self.cleanup()

    def cleanup(self):
        if self.temp_dir and os.path.exists(self.temp_dir):
            try:
                shutil.rmtree(self.temp_dir)
                self.temp_dir = None
            except Exception:
                pass

    # ── Private helpers ───────────────────────────────────────────────────────

    def _clone(self) -> bool:
        """Shallow clone for speed. Returns True on success."""
        try:
            self.temp_dir = tempfile.mkdtemp(prefix="devai_")
            logger.info(f"Cloning {self.repo_url} → {self.temp_dir}")
            self.repo = git.Repo.clone_from(
                self.repo_url,
                self.temp_dir,
                depth=100,      # enough for 30-day history
                no_single_branch=True,
            )
            logger.info("Clone successful")
            return True
        except git.GitCommandError as e:
            logger.warning(f"Clone failed (private repo or bad URL?): {e}")
            return False
        except Exception as e:
            logger.warning(f"Clone error: {e}")
            return False

    def _get_commits(self, days: int) -> List[Dict]:
        """Extract commit metadata for the last N days."""
        since = datetime.now() - timedelta(days=days)
        commits = []

        try:
            for commit in self.repo.iter_commits(
                "HEAD", max_count=200, since=since.isoformat()
            ):
                # Normalise author name — strip email domain noise
                author = self._normalise_author(
                    commit.author.name or str(commit.author)
                )
                try:
                    additions = commit.stats.total.get("insertions", 0)
                    deletions = commit.stats.total.get("deletions", 0)
                    files_changed = len(commit.stats.files)
                except Exception:
                    additions = deletions = files_changed = 0

                commits.append({
                    "hash":          commit.hexsha[:7],
                    "author":        author,
                    "date":          datetime.fromtimestamp(commit.committed_date).isoformat(),
                    "message":       commit.message.split("\n")[0][:80],
                    "files_changed": files_changed,
                    "additions":     additions,
                    "deletions":     deletions,
                })
        except Exception as e:
            logger.warning(f"Commit iteration error: {e}")

        return commits

    def _aggregate_contributors(self, commits: List[Dict]) -> List[Dict]:
        """Group commits by author, compute activity score."""
        agg = defaultdict(lambda: {"commits": 0, "additions": 0, "deletions": 0})
        for c in commits:
            a = agg[c["author"]]
            a["commits"]   += 1
            a["additions"] += c["additions"]
            a["deletions"] += c["deletions"]

        result = []
        for name, stats in agg.items():
            score = min(100, int(stats["commits"] * 2.5 + stats["additions"] / 80))
            result.append({
                "name":           name,
                "commits":        stats["commits"],
                "additions":      stats["additions"],
                "deletions":      stats["deletions"],
                "activity_score": score,
            })

        result.sort(key=lambda x: x["commits"], reverse=True)
        return result

    def _build_timeline(self, commits: List[Dict], days: int) -> List[Dict]:
        """Daily commit count for the last N days."""
        counts: Dict[str, int] = defaultdict(int)
        for c in commits:
            date_str = c["date"][:10]
            counts[date_str] += 1

        # Fill all days (including zeros)
        today  = datetime.now()
        result = []
        for i in range(days):
            day = (today - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
            result.append({"date": day, "commits": counts.get(day, 0)})

        return result

    @staticmethod
    def _normalise_author(name: str) -> str:
        """Remove email noise, truncate long names."""
        name = name.split("<")[0].strip()
        name = name.split("@")[0].strip()
        return name[:20] if name else "Unknown"

    @staticmethod
    def _empty_stats() -> Dict:
        return {
            "summary": {
                "total_commits": 0, "total_contributors": 0,
                "total_additions": 0, "total_deletions": 0, "active_days": 0,
            },
            "contributors": [],
            "timeline":     [],
            "raw_commits":  [],
        }

    def __del__(self):
        self.cleanup()