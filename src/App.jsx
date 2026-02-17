import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/login/StudentLogin";
import GuideLogin from "./pages/login/GuideLogin";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import GuideDashboard from "./pages/dashboards/GuideDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/guide" element={<GuideLogin />} />

      <Route
      path="/guide"
      element={
        <ProtectedRoute role="guide">
          <GuideDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/student"
      element={
        <ProtectedRoute role="student">
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    </Routes>
  );
}

export default App;
