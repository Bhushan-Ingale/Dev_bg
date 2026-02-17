export default function DeadlineTimer({ deadline }) {
  const today = new Date();
  const dueDate = new Date(deadline);

  const diffTime = dueDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = "On Track";
  let statusClass = "on-track";

  if (daysLeft <= 3 && daysLeft >= 0) {
    status = "Near Deadline";
    statusClass = "warning";
  }

  if (daysLeft < 0) {
    status = "Overdue";
    statusClass = "delayed";
  }

  return (
    <div className="deadline-card">
      <h3>Project Deadline</h3>

      <p className="deadline-date">
        Due Date: <strong>{deadline}</strong>
      </p>

      <p className="deadline-left">
        {daysLeft >= 0
          ? `${daysLeft} days remaining`
          : `${Math.abs(daysLeft)} days overdue`}
      </p>

      <span className={`badge ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}
