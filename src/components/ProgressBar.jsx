export default function ProgressBar({ value }) {
  // value format: "1 / 5"
  const [done, total] = value.split("/").map(v => Number(v.trim()));
  const percent = Math.round((done / total) * 100);

  return (
    <div className="progress-wrapper">
      <div className="progress-header">
        <span>Tasks Completed</span>
        <span>{done} / {total}</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
