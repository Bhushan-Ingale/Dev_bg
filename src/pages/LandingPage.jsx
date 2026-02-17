import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand">DevGuide AI</h1>
        <p className="subtitle">
          Your personalized academic guidance platform
        </p>

        <div className="btn-row">
          <button
            className="btn-guide"
            onClick={() => navigate("/login/guide")}
          >
            Login as Guide
          </button>

          <button
            className="btn-student outline"
            onClick={() => navigate("/login/student")}
          >
            Login as Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
