import { motion as _motion } from "framer-motion";

export default function GuideOverview({ openKanban }) {
  return (
    <div className="guide-layout">

      {/* LEFT CONTENT */}
      <div className="guide-main">
        <h1 className="page-title">Guide Dashboard</h1>
        <p className="page-subtitle">
          Overview of all supervised project groups
        </p>

        {/* OVERVIEW CARDS */}
        <div className="card-grid">

          <_motion.div className="dashboard-card" whileHover={{ scale: 1.05 }}>
            <span className="material-icons card-icon">trending_up</span>
            <h4>Overall Progress</h4>
            <h2>85%</h2>
          </_motion.div>

          <_motion.div className="dashboard-card" whileHover={{ scale: 1.05 }}>
            <span className="material-icons card-icon">commit</span>
            <h4>Total Commits</h4>
            <h2>32</h2>
          </_motion.div>

          <_motion.div className="dashboard-card" whileHover={{ scale: 1.05 }}>
            <span className="material-icons card-icon">task_alt</span>
            <h4>Tasks Completed</h4>
            <h2>1 / 5</h2>
          </_motion.div>

        </div>

        {/* KANBAN */}
        <button className="kanban-btn" onClick={openKanban}>
          <span className="material-icons">view_kanban</span>
          Open Kanban Board
        </button>

        {/* GROUP */}
        <div className="group-card">
        <h3>Group A-08: DevGuide AI</h3>

        <div className="member">
          <div>
            <strong>Shlok Chandankar</strong>
            <span>Tasks: 0 / 3</span>
          </div>
          <span className="commit-count">25 commits</span>
        </div>

        <div className="member">
          <div>
            <strong>Tamanna Gupta</strong>
            <span>Tasks: 1 / 2</span>
          </div>
          <span className="commit-count">7 commits</span>
        </div>
      </div>

      </div>
    </div>
  );
}
