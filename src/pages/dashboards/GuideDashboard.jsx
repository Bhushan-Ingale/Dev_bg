import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AIAssistant from "../../components/AIAssistant";
import StudentProgressCard from "../../components/StudentProgressCard";

export default function GuideDashboard() {
  const [active, setActive] = useState("overview");

  // ✅ FAKE DATA (later replace with API)
  const students = [
    {
      id: 1,
      name: "Tamanna Gupta",
      project: "DevGuide AI",
      tasksCompleted: 1,
      totalTasks: 5,
      startDate: "2026-01-01",
      deadline: "2026-02-15",
    },
    {
      id: 2,
      name: "Aarav Shah",
      project: "AI Resume Analyzer",
      tasksCompleted: 3,
      totalTasks: 6,
      startDate: "2026-01-10",
      deadline: "2026-02-05",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar active={active} setActive={setActive} />

      <div className="dashboard-content">

        {/* ================= OVERVIEW ================= */}
        {active === "overview" && (
          <>
            <h1 className="page-title">Guide Dashboard</h1>
            <p className="page-subtitle">
              Monitor group progress and student performance
            </p>

            {/* GROUP STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Students</p>
                <h2>18</h2>
              </div>

              <div className="stat-card">
                <p>Active Projects</p>
                <h2>6</h2>
              </div>

              <div className="stat-card">
                <p>At Risk</p>
                <h2>3</h2>
              </div>
            </div>

            {/* ✅ STUDENT PROGRESS SECTION (ADDED HERE) */}
            <h2 className="section-title">Student Progress</h2>

            <div className="students-grid">
              {students.map(student => (
                <StudentProgressCard
                  key={student.id}
                  student={student}
                />
              ))}
            </div>
          </>
        )}

        {/* ================= ASSIGNED STUDENTS ================= */}
        {active === "students" && (
          <>
            <h1 className="page-title">Assigned Students</h1>
            <p className="page-subtitle">
              Students currently under guidance
            </p>

            <div className="students-wrapper">
              <div className="student-row">
                <span className="student-name">Tamanna Gupta</span>
                <span className="badge on-track">On Track</span>
                <span>85% Complete</span>
              </div>

              <div className="student-row">
                <span className="student-name">Sahil Sharma</span>
                <span className="badge delayed">Delayed</span>
                <span>70% Complete</span>
              </div>
            </div>
          </>
        )}

        {/* ================= PROJECT REVIEWS ================= */}
        {active === "reviews" && (
          <>
            <h1 className="page-title">Project Reviews</h1>
            <p className="page-subtitle">Evaluation summary</p>

            <div className="students-wrapper">
              <div className="student-row">
                <span className="student-name">DevGuide AI</span>
                <span className="badge on-track">Approved</span>
                <span>Score: 8.5 / 10</span>
              </div>

              <div className="student-row">
                <span className="student-name">AI Resume Analyzer</span>
                <span className="badge delayed">Needs Changes</span>
                <span>Score: 6 / 10</span>
              </div>
            </div>
          </>
        )}

        {/* ================= REPORTS ================= */}
        {active === "reports" && (
          <>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Overall analytics</p>

            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Students</p>
                <h2>18</h2>
              </div>

              <div className="stat-card">
                <p>Projects Approved</p>
                <h2>12</h2>
              </div>

              <div className="stat-card">
                <p>At Risk</p>
                <h2>3</h2>
              </div>
            </div>
          </>
        )}

      </div>

      <AIAssistant />
    </div>
  );
}
