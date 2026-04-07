/**
 * DevAI API Service
 * Centralized layer for all backend communication.
 * Falls back to mock data gracefully if backend is unreachable.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  repo_url?: string;
  created_at?: string;
  // Analytics fields (populated by fetchTeamAnalytics)
  progress?: number;
  commits?: number;
  additions?: number;
  deletions?: number;
  lastActive?: string;
  repoUrl?: string;
  tech?: string[];
  activityScore?: number;
  sprintVelocity?: number;
  coverage?: number;
  openPRs?: number;
  issues?: number;
}

export interface Contributor {
  name: string;
  commits: number;
  additions: number;
  deletions: number;
  activity_score: number;
}

export interface TimelinePoint {
  date: string;
  commits: number;
}

export interface Analytics {
  summary: {
    total_commits: number;
    total_contributors: number;
    total_additions: number;
    total_deletions: number;
    active_days: number;
  };
  contributors: Contributor[];
  timeline: TimelinePoint[];
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  team_id?: string;
  assignee?: string;
  created_at?: string;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  type?: string;
  team_id?: string;
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Mock data fallbacks ──────────────────────────────────────────────────────

const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Team Quantum',
    members: ['Alice Chen', 'Bob Smith', 'Charlie Brown'],
    leader: 'Alice Chen',
    repo_url: 'https://github.com/team/quantum',
    progress: 85, commits: 65, additions: 1240, deletions: 320,
    lastActive: '2h ago', repoUrl: 'https://github.com/team/quantum',
    tech: ['React', 'Node.js', 'MongoDB'],
    activityScore: 98, sprintVelocity: 42, coverage: 78, openPRs: 3, issues: 5,
  },
  {
    id: '2',
    name: 'Team Nebula',
    members: ['Diana Prince', 'Eve Torres', 'Frank Castle'],
    leader: 'Diana Prince',
    repo_url: 'https://github.com/team/nebula',
    progress: 72, commits: 42, additions: 890, deletions: 210,
    lastActive: '5h ago', repoUrl: 'https://github.com/team/nebula',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    activityScore: 76, sprintVelocity: 34, coverage: 82, openPRs: 5, issues: 2,
  },
  {
    id: '3',
    name: 'Team Phoenix',
    members: ['Grace Hopper', 'Henry Ford', 'Ivy Chen'],
    leader: 'Grace Hopper',
    repo_url: 'https://github.com/team/phoenix',
    progress: 45, commits: 25, additions: 450, deletions: 120,
    lastActive: '1d ago', repoUrl: 'https://github.com/team/phoenix',
    tech: ['Vue.js', 'Flask', 'SQLite'],
    activityScore: 52, sprintVelocity: 18, coverage: 45, openPRs: 7, issues: 8,
  },
];

function buildMockAnalytics(team: Team): Analytics {
  const members = team.members || ['Alice', 'Bob', 'Charlie'];
  return {
    summary: {
      total_commits: team.commits || 65,
      total_contributors: members.length,
      total_additions: team.additions || 1240,
      total_deletions: team.deletions || 320,
      active_days: 22,
    },
    contributors: members.map((name, i) => ({
      name,
      commits: [65, 42, 25][i] ?? 10,
      additions: [1240, 890, 450][i] ?? 100,
      deletions: [320, 210, 120][i] ?? 50,
      activity_score: [98, 76, 52][i] ?? 40,
    })),
    timeline: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      commits: Math.floor(Math.random() * 12) + 3,
    })),
  };
}

// ─── Teams API ────────────────────────────────────────────────────────────────

/**
 * Fetch all teams from backend. Falls back to mock data if backend is down.
 * Backend teams are merged with UI-only fields so the frontend shape is consistent.
 */
export async function fetchTeams(): Promise<Team[]> {
  try {
    const raw = await apiFetch<any[]>('/api/teams');
    // Merge backend data with UI-friendly defaults
    return raw.map((t, i) => ({
      ...MOCK_TEAMS[i % MOCK_TEAMS.length], // grab UI defaults for fields backend doesn't have
      ...t,
      // Normalise field names (backend uses snake_case)
      repoUrl: t.repo_url ?? t.repoUrl,
      lastActive: t.last_active ?? '—',
    }));
  } catch {
    console.warn('[DevAI] Backend unreachable — using mock teams');
    return MOCK_TEAMS;
  }
}

/** Create a new team on the backend, returns the created team with id. */
export async function createTeam(data: {
  name: string;
  members: string[];
  leader?: string;
  repoUrl?: string;
}): Promise<Team> {
  try {
    const payload = { name: data.name, members: data.members, leader: data.leader, repo_url: data.repoUrl };
    const result = await apiFetch<{ id: string; message: string }>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Return a full Team object merging what we sent with what we got back
    return {
      id: result.id,
      name: data.name,
      members: data.members,
      leader: data.leader,
      repoUrl: data.repoUrl,
      progress: 0, commits: 0, additions: 0, deletions: 0,
      lastActive: 'Just now', tech: [], activityScore: 0,
      sprintVelocity: 0, coverage: 0, openPRs: 0, issues: 0,
    };
  } catch (err) {
    // Offline mode: create with a local id
    console.warn('[DevAI] createTeam failed — using local id');
    return {
      id: `local_${Date.now()}`,
      name: data.name,
      members: data.members,
      leader: data.leader,
      repoUrl: data.repoUrl,
      progress: 0, commits: 0, additions: 0, deletions: 0,
      lastActive: 'Just now', tech: [], activityScore: 0,
      sprintVelocity: 0, coverage: 0, openPRs: 0, issues: 0,
    };
  }
}

/** Delete a team by id. */
export async function deleteTeam(teamId: string): Promise<void> {
  try {
    await apiFetch(`/api/teams/${teamId}`, { method: 'DELETE' });
  } catch {
    // Soft fail — the UI will remove it anyway from local state
    console.warn('[DevAI] deleteTeam failed silently');
  }
}

// ─── Analytics API ────────────────────────────────────────────────────────────

/**
 * Fetch analytics for a specific team.
 * Returns real GitHub data if available, mock data otherwise.
 */
export async function fetchTeamAnalytics(teamId: string, teams: Team[]): Promise<Analytics> {
  try {
    const data = await apiFetch<Analytics>(`/api/teams/${teamId}/analytics`);
    return data;
  } catch {
    console.warn(`[DevAI] Analytics for team ${teamId} — using mock data`);
    const team = teams.find(t => t.id === teamId) ?? MOCK_TEAMS[0];
    return buildMockAnalytics(team);
  }
}

// ─── Tasks API (Kanban) ───────────────────────────────────────────────────────

export async function fetchTasks(teamId?: string): Promise<Task[]> {
  try {
    const qs = teamId ? `?team_id=${teamId}` : '';
    return await apiFetch<Task[]>(`/api/tasks${qs}`);
  } catch {
    return [];
  }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  return apiFetch<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
}

export async function updateTask(taskId: string, update: Partial<Task>): Promise<Task> {
  return apiFetch<Task>(`/api/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(update) });
}

// ─── Calendar API ─────────────────────────────────────────────────────────────

export async function fetchEvents(teamId?: string): Promise<CalendarEvent[]> {
  try {
    const qs = teamId ? `?team_id=${teamId}` : '';
    return await apiFetch<CalendarEvent[]>(`/api/events${qs}`);
  } catch {
    return [];
  }
}

export async function createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>('/api/events', { method: 'POST', body: JSON.stringify(event) });
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  try {
    await apiFetch('/health');
    return true;
  } catch {
    return false;
  }
}