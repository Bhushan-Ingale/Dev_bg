import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import GuideOverview from "./GuideOverview";
import AssignedStudents from "../student/AssignedStudents";
import "../../styles/dashboard.css";

export default function GuideLayout() {
  const [active, setActive] = useState("overview");

  return (
    <div className="main-layout">

      <Sidebar active={active} setActive={setActive} />

      <div className="content-area">

        <div className="dashboard-main">
          {active === "overview" && <GuideOverview />}
          {active === "students" && <AssignedStudents />}
          {active === "reviews" && <h2>Project Reviews Coming Soon</h2>}
          {active === "reports" && <h2>Reports Coming Soon</h2>}
        </div>

        {/* AI ASSISTANT PANEL */}
        <div className="ai-panel">
          <div className="ai-header">
            <span className="material-symbols-outlined">auto_awesome</span>
            AI Assistant
          </div>

          <div className="ai-body">
            Hello! I am DevAI, your project assistant. Ask me anything about your project.
          </div>

          <div className="ai-input">
            <input placeholder="Ask DevAI..." />
            <button>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
