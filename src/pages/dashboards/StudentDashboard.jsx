import { useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import KanbanView from "../KanbanView";
import AIAssistant from "../../components/AIAssistant";
import ProfileCard from "../../components/ProfileCard";
import DeadlineTimer from "../../components/DeadlineTimer";
import ProgressBar from "../../components/ProgressBar";

export default function StudentDashboard() {
  const [active, setActive] = useState("dashboard");

  const projects = [
    {
      id: "devguide",
      name: "DevGuide AI",
      guide: "Prof. Shlok Chandankar",
      commits: 25,
      tasks: "1 / 5",
      repo: "https://github.com/example/devguide-ai",
    },
    {
      id: "resume",
      name: "AI Resume Analyzer",
      guide: "Prof. A. Mehta",
      commits: 14,
      tasks: "3 / 6",
      repo: "https://github.com/example/resume-ai",
    },
  ];

  const [currentProject, setCurrentProject] = useState(projects[0]);

  return (
    <div className="dashboard-layout">
      <StudentSidebar active={active} setActive={setActive} />

      <div className="dashboard-content">

        {/* PROJECT SWITCH */}
        <div className="project-switcher">
          <span className="material-symbols-outlined">folder</span>

          <select
            className="project-select"
            value={currentProject.id}
            onChange={(e) =>
              setCurrentProject(
                projects.find(p => p.id === e.target.value)
              )
            }
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= DASHBOARD ================= */}
        {active === "dashboard" && (
          <>
            <h1 className="page-title">
              Group: {currentProject.name}
            </h1>

            <p className="page-subtitle">
              Guide: {currentProject.guide}
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="material-symbols-outlined stat-icon">
                  commit
                </span>
                <div>
                  <p>Total Commits</p>
                  <h2>{currentProject.commits}</h2>
                </div>
              </div>

              <div className="stat-card">
                <span className="material-symbols-outlined stat-icon">
                  task_alt
                </span>

                <ProgressBar value={currentProject.tasks} />
              </div>

              <div className="stat-card">
                <span className="material-symbols-outlined stat-icon">
                  groups
                </span>
                <div>
                  <p>Team Members</p>
                  <h2>2</h2>
                </div>
              </div>
            </div>

            {/* DEADLINE TIMER — DASHBOARD ONLY */}
            <DeadlineTimer deadline="2026-03-15" />
          </>
        )}

        {/* ================= KANBAN ================= */}
        {active === "kanban" && (
          <>
            <h1 className="page-title">Kanban Board</h1>
            <KanbanView />
          </>
        )}

        {/* ================= COMMITS ================= */}
          {active === "commits" && (
            <>
<div className="page-title-row">
  <h1 className="page-title">Commits</h1>

  <span className="commit-count-badge">
    {currentProject.commits} commits
  </span>
</div>

              <div className="commit-list">

                <div className="commit-card">
                  <span className="material-symbols-outlined commit-icon">
                    commit
                  </span>

                  <div className="commit-info">
                    <p className="commit-message">Fixed UI bugs</p>
                    <span className="commit-time">2 days ago</span>
                  </div>
                </div>

                <div className="commit-card">
                  <span className="material-symbols-outlined commit-icon">
                    commit
                  </span>

                  <div className="commit-info">
                    <p className="commit-message">Added Kanban logic</p>
                    <span className="commit-time">5 days ago</span>
                  </div>
                </div>

              </div>

              {/* GitHub Repo — SAME STYLE, ATTACHED */}
              <div className="repo-card compact">
                <p className="repo-title">GitHub Repository</p>

                <a
                  href={currentProject.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="repo-link"
                >
                  {currentProject.repo.replace("https://", "")}
                </a>

                <span className="repo-status connected">● Connected</span>
              </div>
            </>
          )}


        {/* ================= PROFILE ================= */}
        {active === "profile" && <ProfileCard />}

      </div>

      <AIAssistant />
    </div>
  );
}
