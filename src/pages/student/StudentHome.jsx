import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Student Dashboard</h1>

      <div className="card-grid">
        <div className="card" onClick={() => navigate("/student/projects")}>
          <h3>Projects</h3>
        </div>

        <div className="card" onClick={() => navigate("/student/commits")}>
          <h3>Commits</h3>
        </div>

        <div className="card" onClick={() => navigate("/student/tasks")}>
          <h3>Tasks</h3>
        </div>

        <div className="card" onClick={() => navigate("/student/reviews")}>
          <h3>Reviews</h3>
        </div>
      </div>
    </>
  );
};

export default StudentHome;
