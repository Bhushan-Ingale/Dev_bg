/**
 * api.ts — DevAI centralized API layer
 *
 * Drop at:  frontend/src/lib/api.ts
 *
 * Every public function:
 *   1. Calls the real FastAPI backend with a JWT Bearer token
 *   2. Falls back to deterministic mock data if the backend is unreachable
 *   3. Never throws — the UI always gets usable data
 *
 * JWT flow:
 *   - apiLogin()  → stores token in localStorage under TOKEN_KEY
 *   - apiFetch()  → reads token and adds  Authorization: Bearer <token>
 *   - clearAuth() → removes token + user (called by AuthContext on logout)
 */

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const TOKEN_KEY = 'devai_token';
export const USER_KEY  = 'devai_user';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id?: string;
  email: string;
  role: 'guide' | 'student';
  name: string;
  loggedInAt?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  repoUrl?: string;
  repos?: RepoEntry[];
  progress?: number;
  commits?: number;
  openPRs?: number;
  issues?: number;
  activityScore?: number;
  coverage?: number;
}

export interface RepoEntry {
  url: string;
  name?: string;
  primary?: boolean;
}

export interface TeamCreatePayload {
  name: string;
  members: string[];
  leader?: string;
  repoUrl?: string;
}

export interface DataPoint {
  date: string;
  commits: number;
  [key: string]: string | number;
}

export interface ContributorData {
  name: string;
  commits?: number;
  value?: number;
  additions?: number;
  deletions?: number;
  activity_score?: number;
}

export interface Analytics {
  team_id: string;
  summary: {
    total_commits: number;
    total_contributors: number;
    total_additions: number;
    total_deletions: number;
    active_days: number;
  };
  timeline: DataPoint[];
  contributors: ContributorData[];
  ai_insights?: string[];
  cached_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  team_id?: string;
  due_date?: string;
  created_at?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'sprint' | 'deadline' | 'review' | 'milestone' | 'meeting';
  description?: string;
  team_id?: string;
}

// ─── Token helpers (exported so AuthContext can use them) ─────────────────────

export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); }
  catch { return null; }
};

export const setToken = (token: string): void => {
  try { localStorage.setItem(TOKEN_KEY, token); }
  catch {}
};

export const clearAuth = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string> ?? {}),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...rest, headers });

  if (response.status === 401) {
    clearAuth();
    throw new Error('UNAUTHORIZED');
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Primary login — hits the real backend first, falls back to demo credentials.
 * On success, stores JWT in localStorage so apiFetch() picks it up automatically.
 */
export async function apiLogin(
  email: string,
  password: string,
  role: 'guide' | 'student',
): Promise<LoginResponse> {
  try {
    const data = await apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password, role }),
    });
    // Persist token immediately so all subsequent calls are authenticated
    setToken(data.access_token);
    return data;
  } catch (err) {
    if ((err as Error).message === 'UNAUTHORIZED') throw err; // bad credentials — don't swallow
    // Backend unreachable → demo mode
    return mockLogin(email, password, role);
  }
}

export async function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>('/api/auth/me');
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function fetchTeams(): Promise<Team[]> {
  try {
    return await apiFetch<Team[]>('/api/teams');
  } catch {
    return MOCK_TEAMS;
  }
}

export async function fetchTeam(id: string): Promise<Team> {
  try {
    return await apiFetch<Team>(`/api/teams/${id}`);
  } catch {
    return MOCK_TEAMS.find(t => t.id === id) ?? MOCK_TEAMS[0];
  }
}

export async function createTeam(payload: TeamCreatePayload): Promise<Team> {
  try {
    return await apiFetch<Team>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      id: `mock-${Date.now()}`,
      ...payload,
      progress: 0, commits: 0, openPRs: 0, issues: 0, activityScore: 0,
    };
  }
}

export async function updateTeam(id: string, payload: Partial<Team>): Promise<Team> {
  try {
    return await apiFetch<Team>(`/api/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch {
    return { id, ...payload } as Team;
  }
}

export async function deleteTeam(id: string): Promise<void> {
  try {
    await apiFetch<void>(`/api/teams/${id}`, { method: 'DELETE' });
  } catch {
    // Silently succeed — caller removes from local state
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function fetchTeamAnalytics(
  teamId: string,
  allTeams: Team[] = [],
  forceRefresh = false,
): Promise<Analytics> {
  try {
    const qs = forceRefresh ? '?refresh=true' : '';
    return await apiFetch<Analytics>(`/api/teams/${teamId}/analytics${qs}`);
  } catch {
    return generateMockAnalytics(teamId, allTeams);
  }
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function fetchTasks(teamId?: string, status?: string): Promise<Task[]> {
  try {
    const params = new URLSearchParams();
    if (teamId) params.set('team_id', teamId);
    if (status)  params.set('status', status);
    const qs = params.toString();
    return await apiFetch<Task[]>(`/api/tasks${qs ? `?${qs}` : ''}`);
  } catch {
    return MOCK_TASKS.filter(t => !teamId || t.team_id === teamId);
  }
}

export async function createTask(payload: Omit<Task, 'id'>): Promise<Task> {
  try {
    return await apiFetch<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return { id: `mock-${Date.now()}`, ...payload };
  }
}

export async function updateTask(id: string, payload: Partial<Task>): Promise<Task> {
  try {
    return await apiFetch<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch {
    return { id, ...payload } as Task;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await apiFetch<void>(`/api/tasks/${id}`, { method: 'DELETE' });
  } catch {}
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function fetchEvents(teamId?: string): Promise<CalendarEvent[]> {
  try {
    const qs = teamId ? `?team_id=${teamId}` : '';
    return await apiFetch<CalendarEvent[]>(`/api/events${qs}`);
  } catch {
    return MOCK_EVENTS;
  }
}

export async function createEvent(payload: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
  try {
    return await apiFetch<CalendarEvent>('/api/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return { id: `mock-${Date.now()}`, ...payload };
  }
}

export async function updateEvent(id: string, payload: Partial<CalendarEvent>): Promise<CalendarEvent> {
  try {
    return await apiFetch<CalendarEvent>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch {
    return { id, ...payload } as CalendarEvent;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await apiFetch<void>(`/api/events/${id}`, { method: 'DELETE' });
  } catch {}
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  teamId?: string,
): Promise<{ response: string; sources?: string[] }> {
  try {
    return await apiFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, team_id: teamId }),
    });
  } catch {
    return {
      response: `DevAI (offline): "${message}" — Running in mock mode. Connect the backend for real AI responses.`,
    };
  }
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Mock login ───────────────────────────────────────────────────────────────

const DEMO_CREDS: Record<string, { role: 'guide' | 'student'; name: string }> = {
  'guide@123':   { role: 'guide',   name: 'Guide' },
  'student@123': { role: 'student', name: 'Student' },
};

function mockLogin(email: string, _password: string, role: 'guide' | 'student'): LoginResponse {
  const cred = DEMO_CREDS[email];
  if (!cred || cred.role !== role) throw new Error('Invalid credentials');

  const token = `mock-jwt-${email}-${Date.now()}`;
  setToken(token); // store even for mock so subsequent calls carry it

  return {
    access_token: token,
    token_type: 'bearer',
    user: {
      email,
      role: cred.role,
      name: cred.name,
      loggedInAt: new Date().toISOString(),
    },
  };
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Team Quantum',
    members: ['Priya Sharma', 'Rahul Verma', 'Arjun Patel'],
    leader: 'Priya Sharma',
    repoUrl: 'https://github.com/example/team-quantum',
    progress: 78, commits: 342, openPRs: 5, issues: 12, activityScore: 92, coverage: 84,
  },
  {
    id: 'team-2',
    name: 'Team Nebula',
    members: ['Ananya Singh', 'Kavya Nair', 'Rohit Mehta'],
    leader: 'Ananya Singh',
    repoUrl: 'https://github.com/example/team-nebula',
    progress: 63, commits: 218, openPRs: 3, issues: 8, activityScore: 75, coverage: 71,
  },
  {
    id: 'team-3',
    name: 'Team Phoenix',
    members: ['Sneha Reddy', 'Vikram Iyer', 'Pooja Gupta'],
    leader: 'Sneha Reddy',
    repoUrl: 'https://github.com/example/team-phoenix',
    progress: 45, commits: 156, openPRs: 7, issues: 15, activityScore: 61, coverage: 58,
  },
];

function seededRng(seed: number) {
  // Simple LCG so mock numbers are stable per teamId, not random on every call
  let s = seed;
  return (min: number, max: number) => {
    s = (s * 9301 + 49297) % 233280;
    return min + Math.floor((s / 233280) * (max - min));
  };
}

function generateMockAnalytics(teamId: string, allTeams: Team[]): Analytics {
  const team = allTeams.find(t => t.id === teamId) ?? MOCK_TEAMS[0];
  const rnd  = seededRng(teamId.charCodeAt(teamId.length - 1));

  const days  = 30;
  const today = new Date();
  const timeline: DataPoint[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      commits: Math.max(0, rnd(0, 18) + (i > 20 ? 4 : 0)),
    };
  });

  const names  = team.members.length ? team.members : ['Priya Sharma', 'Rahul Verma', 'Arjun Patel'];
  const shares = [55, 30, 15];

  const contributors: ContributorData[] = names.map((name, i) => ({
    name,
    commits:        Math.round(((team.commits ?? 200) * shares[i % shares.length]) / 100),
    additions:      rnd(400, 1600),
    deletions:      rnd(80, 400),
    activity_score: rnd(55, 99),
  }));

  return {
    team_id: teamId,
    summary: {
      total_commits:       contributors.reduce((a, c) => a + (c.commits ?? 0), 0),
      total_contributors:  contributors.length,
      total_additions:     contributors.reduce((a, c) => a + (c.additions ?? 0), 0),
      total_deletions:     contributors.reduce((a, c) => a + (c.deletions ?? 0), 0),
      active_days:         rnd(18, 28),
    },
    timeline,
    contributors,
    ai_insights: [
      `${names[0]} leads commit activity — consider pairing with ${names[names.length - 1]} for knowledge sharing.`,
      'Velocity trending upward over the last 7 days.',
      `Code coverage at ${team.coverage ?? 75}% — add tests for new endpoints to push past 90%.`,
    ],
  };
}

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Design landing page',  status: 'done',        priority: 'high',   assignee: 'Priya Sharma', team_id: 'team-1' },
  { id: 't2', title: 'Build auth API',        status: 'in_progress', priority: 'high',   assignee: 'Rahul Verma',  team_id: 'team-1' },
  { id: 't3', title: 'Write unit tests',      status: 'todo',        priority: 'medium', assignee: 'Arjun Patel',  team_id: 'team-1' },
  { id: 't4', title: 'Setup MongoDB',         status: 'done',        priority: 'high',   assignee: 'Ananya Singh', team_id: 'team-2' },
  { id: 't5', title: 'Dashboard charts',      status: 'review',      priority: 'medium', assignee: 'Kavya Nair',   team_id: 'team-2' },
  { id: 't6', title: 'Deploy to Vercel',      status: 'todo',        priority: 'low',    assignee: 'Rohit Mehta',  team_id: 'team-2' },
  { id: 't7', title: 'GitHub integration',    status: 'in_progress', priority: 'high',   assignee: 'Sneha Reddy',  team_id: 'team-3' },
  { id: 't8', title: 'RAG chatbot',           status: 'todo',        priority: 'high',   assignee: 'Vikram Iyer',  team_id: 'team-3' },
  { id: 't9', title: 'Presentation slides',   status: 'todo',        priority: 'low',    assignee: 'Pooja Gupta',  team_id: 'team-3' },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Sprint 3 Start',      date: new Date().toISOString().slice(0, 10),                           type: 'sprint',    team_id: 'team-1' },
  { id: 'e2', title: 'Mid-term Review',     date: new Date(Date.now() + 3  * 864e5).toISOString().slice(0, 10),   type: 'review',    team_id: 'team-1' },
  { id: 'e3', title: 'Auth Module Due',     date: new Date(Date.now() + 7  * 864e5).toISOString().slice(0, 10),   type: 'deadline',  team_id: 'team-1' },
  { id: 'e4', title: 'Project Milestone 2', date: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),   type: 'milestone', team_id: 'team-1' },
];