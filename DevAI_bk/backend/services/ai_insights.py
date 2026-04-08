"""
services/ai_insights.py — AI-powered team insights.

Tries Google Gemini 1.5 Flash (free tier) first.
Falls back to a deterministic rule-based engine — still produces
meaningful, data-driven insights for demo without any API key.
"""

import os
import json
import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


def generate_insights(analytics: Dict) -> List[dict]:
    """
    Main entry point. Returns list of insight dicts:
    {"type": "warning|success|tip|trend", "message": str, "actionable": bool}
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if api_key:
        try:
            return _gemini_insights(analytics, api_key)
        except Exception as e:
            logger.warning(f"Gemini insights failed ({e}), falling back to rule engine")

    return _rule_based_insights(analytics)


# ─── Gemini integration ───────────────────────────────────────────────────────

def _gemini_insights(analytics: Dict, api_key: str) -> List[dict]:
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    contributors = analytics.get("contributors", [])
    summary      = analytics.get("summary", {})

    member_lines = "\n".join(
        f"  • {c['name']}: {c['commits']} commits, "
        f"+{c.get('additions',0)} lines added, "
        f"score {c.get('activity_score', 0)}/100"
        for c in contributors
    )

    prompt = f"""You are DevAI, an academic project analytics assistant for university students and professors in India.

Team statistics for the last 30 days:
- Total commits: {summary.get('total_commits', 0)}
- Active contributors: {len(contributors)}
- Active days: {summary.get('active_days', 0)}/30
- Lines added: {summary.get('total_additions', 0):,}
- Lines removed: {summary.get('total_deletions', 0):,}

Per-member breakdown:
{member_lines}

Generate exactly 3 actionable insights as a JSON array. Each insight must include:
- "type": one of "warning", "success", "tip", "trend"
- "message": a specific, data-driven sentence (max 130 chars) mentioning actual names/numbers
- "actionable": true if the guide/student should do something, false if informational

Focus on:
1. Contribution balance (is one person doing all the work?)
2. Activity pattern (daily commits vs weekend cramming)
3. Code quality or velocity trend

Output ONLY valid JSON array, no markdown fences, no explanation.
"""

    response = model.generate_content(prompt)
    text = response.text.strip()
    # Strip markdown code fences if model adds them
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    insights = json.loads(text)
    # Ensure correct format
    return [
        {
            "type":       str(i.get("type", "tip")),
            "message":    str(i.get("message", ""))[:140],
            "actionable": bool(i.get("actionable", False)),
        }
        for i in insights[:3]
    ]


# ─── Rule-based engine ────────────────────────────────────────────────────────

def _rule_based_insights(analytics: Dict) -> List[dict]:
    """
    Deterministic rule engine. Produces 3 insights from analytics data.
    No API key required — suitable for demo when Gemini is unavailable.
    """
    contributors = analytics.get("contributors", [])
    summary      = analytics.get("summary", {})
    insights     = []

    if not contributors:
        return [
            {
                "type": "tip",
                "message": "Add a GitHub repository URL to this team to start seeing real insights.",
                "actionable": True,
            }
        ]

    # Sort helpers
    by_commits = sorted(contributors, key=lambda x: x.get("commits", 0), reverse=True)
    top        = by_commits[0]
    bottom     = by_commits[-1] if len(by_commits) > 1 else None

    # ── Insight 1: Contribution balance ──────────────────────────────────────
    if bottom and top.get("commits", 0) > 0:
        ratio = top["commits"] / max(bottom["commits"], 1)
        if ratio >= 3:
            insights.append({
                "type": "warning",
                "message": (
                    f"{top['name']} has {top['commits']} commits vs "
                    f"{bottom['name']}'s {bottom['commits']} — large gap. "
                    "Consider pairing them this sprint."
                ),
                "actionable": True,
            })
        elif ratio <= 1.5:
            insights.append({
                "type": "success",
                "message": (
                    f"Excellent team balance! Commits range from "
                    f"{bottom['commits']} to {top['commits']} — everyone is contributing."
                ),
                "actionable": False,
            })
        else:
            insights.append({
                "type": "trend",
                "message": (
                    f"{top['name']} leads with {top['commits']} commits. "
                    "Moderate gap — encourage the rest to pick up pace."
                ),
                "actionable": True,
            })

    # ── Insight 2: Activity consistency ──────────────────────────────────────
    active_days = summary.get("active_days", 0)
    total_commits = summary.get("total_commits", 0)

    if active_days >= 22:
        insights.append({
            "type": "success",
            "message": (
                f"Team committed on {active_days}/30 days — outstanding consistency. "
                "This predicts strong project completion."
            ),
            "actionable": False,
        })
    elif active_days >= 14:
        insights.append({
            "type": "tip",
            "message": (
                f"Active on {active_days}/30 days. Aim for daily commits — "
                "small frequent pushes reduce merge conflicts."
            ),
            "actionable": True,
        })
    else:
        insights.append({
            "type": "warning",
            "message": (
                f"Only {active_days} active days this month. "
                "Encourage the team to commit daily, even small progress."
            ),
            "actionable": True,
        })

    # ── Insight 3: Code quality signal (additions vs deletions) ──────────────
    total_add = summary.get("total_additions", 0)
    total_del = summary.get("total_deletions", 0)

    if total_add == 0:
        insights.append({
            "type": "tip",
            "message": "No code additions recorded yet. Connect a real GitHub repo for code quality metrics.",
            "actionable": True,
        })
    elif total_del > 0 and (total_del / total_add) > 0.45:
        insights.append({
            "type": "trend",
            "message": (
                f"High refactoring ratio ({total_del:,} deletions vs {total_add:,} additions). "
                "Code quality is actively improving — great sign."
            ),
            "actionable": False,
        })
    elif total_commits > 0:
        avg_size = total_add // max(total_commits, 1)
        if avg_size > 200:
            insights.append({
                "type": "tip",
                "message": (
                    f"Average {avg_size} lines per commit is large. "
                    "Smaller, focused commits make code review easier."
                ),
                "actionable": True,
            })
        else:
            insights.append({
                "type": "success",
                "message": (
                    f"Good commit size (~{avg_size} lines avg). "
                    f"Team has added {total_add:,} lines across {total_commits} commits."
                ),
                "actionable": False,
            })

    return insights[:3]