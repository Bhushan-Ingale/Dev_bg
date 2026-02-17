import LogoutButton from "./LogoutButton";

export default function StudentSidebar({ active, setActive }) {
  return (
    <aside className="sidebar">

      {/* TOP */}
      <div className="sidebar-top">
        <h2 className="logo">DevGuide AI</h2>

        <nav className="menu">

          <div
            className={`menu-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </div>

          <div
            className={`menu-item ${active === "kanban" ? "active" : ""}`}
            onClick={() => setActive("kanban")}
          >
            <span className="material-symbols-outlined">view_kanban</span>
            <span>Kanban Board</span>
          </div>

          <div
            className={`menu-item ${active === "commits" ? "active" : ""}`}
            onClick={() => setActive("commits")}
          >
            <span className="material-symbols-outlined">commit</span>
            <span>Commits</span>
          </div>

          <div
            className={`menu-item ${active === "profile" ? "active" : ""}`}
            onClick={() => setActive("profile")}
          >
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </div>

        </nav>
      </div>

      {/* BOTTOM — SAME AS GUIDE */}
      <div className="sidebar-bottom">
        <LogoutButton />
      </div>

    </aside>
  );
}
