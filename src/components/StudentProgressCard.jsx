export default function StudentProgressCard({ student }) {
  const { name, project, tasksCompleted, totalTasks, deadline } = student;

  // Progress %
  const progress = Math.round((tasksCompleted / totalTasks) * 100);

  // Time calculations
  const now = new Date();
  const end = new Date(deadline);
  const totalTime = end - new Date(student.startDate);
  const remainingTime = end - now;

  const timePercent = Math.max(
    0,
    Math.round((remainingTime / totalTime) * 100)
  );

  // Color logic
  const progressColor =
    progress >= 70 ? "green" : progress >= 40 ? "orange" : "red";

  const timerColor =
    timePercent >= 50 ? "green" : timePercent >= 25 ? "orange" : "red";

  return (
    <div className="student-card">
      <h3>{name}</h3>
      <p className="project-name">{project}</p>

      {/* TASK PROGRESS */}
      <div className="bar-wrapper">
        <span>Task Progress ({progress}%)</span>
        <div className="bar-bg">
          <div
            className={`bar-fill ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* DEADLINE TIMER */}
      <div className="bar-wrapper">
        <span>Time Remaining ({timePercent}%)</span>
        <div className="bar-bg">
          <div
            className={`bar-fill ${timerColor}`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      </div>

      <p className="deadline">
        Deadline: {new Date(deadline).toLocaleDateString()}
      </p>
    </div>
  );
}
