export default function GuideDashboardHome({ openKanban }) {
  return (
    <>
      <h1 className="page-title">Guide Dashboard</h1>

      <div className="card-grid">
        <div className="card" onClick={openKanban}>
          <h3>Kanban Board</h3>
          <p>View project progress</p>
        </div>

        <div className="card">
          <h3>Students</h3>
          <p>Assigned students</p>
        </div>
      </div>
    </>
  );
}
