export default function StudentKanban() {
  const tasks = [
    { title: "Problem Statement Finalized", status: "Done" },
    { title: "UI Wireframe", status: "In Progress" },
    { title: "Backend API Setup", status: "Pending" },
    { title: "GitHub Integration", status: "Pending" },
  ];

  return (
    <div className="kanban-wrapper">
      {tasks.map((task, index) => (
        <div key={index} className="kanban-card">
          <div className="kanban-card-header">
            <h4>{task.title}</h4>
            <span
              className={`status-pill ${
                task.status === "Done"
                  ? "done"
                  : task.status === "In Progress"
                  ? "progress"
                  : "pending"
              }`}
            >
              {task.status}
            </span>
          </div>

          <div className="kanban-meta">
            <span className="dot" />
            <span>Student Task</span>
          </div>
        </div>
      ))}
    </div>
  );
}
