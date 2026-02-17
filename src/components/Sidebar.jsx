import LogoutButton from "./LogoutButton";

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2 className="logo">DevGuide AI</h2>

        <nav className="menu">
          <div
            className={`menu-item ${active === "overview" ? "active" : ""}`}
            onClick={() => setActive("overview")}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Overview</span>
          </div>

          <div
            className={`menu-item ${active === "students" ? "active" : ""}`}
            onClick={() => setActive("students")}
          >
            <span className="material-symbols-outlined">groups</span>
            <span>Assigned Students</span>
          </div>

          <div
            className={`menu-item ${active === "reviews" ? "active" : ""}`}
            onClick={() => setActive("reviews")}
          >
            <span className="material-symbols-outlined">rate_review</span>
            <span>Project Reviews</span>
          </div>

          <div
            className={`menu-item ${active === "reports" ? "active" : ""}`}
            onClick={() => setActive("reports")}
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span>Reports</span>
          </div>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <LogoutButton />
      </div>
    </aside>
  );
}
