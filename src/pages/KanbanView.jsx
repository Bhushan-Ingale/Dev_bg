export default function KanbanView() {
  return (
    <div className="kanban">

      {/* TO DO */}
      <div className="kanban-col">
        <h4 className="kanban-title todo">To Do</h4>

        <div className="task-card">
          <p>Setup Repository</p>
          <div className="progress-bar">
            <span style={{ width: "10%" }} />
          </div>
        </div>

        <div className="task-card">
          <p>Finalize Requirements</p>
          <div className="progress-bar">
            <span style={{ width: "20%" }} />
          </div>
        </div>
      </div>

      {/* IN PROGRESS */}
      <div className="kanban-col">
        <h4 className="kanban-title progress">In Progress</h4>

        <div className="task-card">
          <p>Design Database</p>
          <div className="progress-bar">
            <span style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* REVIEW */}
      <div className="kanban-col">
        <h4 className="kanban-title review">Review</h4>

        <div className="task-card">
          <p>RAG Pipeline</p>
          <div className="progress-bar">
            <span style={{ width: "85%" }} />
          </div>
        </div>
      </div>

      {/* DONE */}
      <div className="kanban-col">
        <h4 className="kanban-title done">Done</h4>

        <div className="task-card">
          <p>Project Scope</p>
          <div className="progress-bar done">
            <span style={{ width: "100%" }} />
          </div>
        </div>
      </div>

    </div>
  );
}
