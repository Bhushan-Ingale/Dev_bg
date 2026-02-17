export default function AssignedStudents() {
  return (
    <>
      <h1 className="page-title">Assigned Students</h1>
      <p className="page-subtitle">Students currently supervised by you</p>

      <div className="students-wrapper">
        <div className="student-row">
          <div className="student-name">Riya Sharma</div>
          <div>Group A-08</div>
          <span className="badge on-track">On Track</span>
        </div>

        <div className="student-row">
          <div className="student-name">Aman Patel</div>
          <div>Group A-08</div>
          <span className="badge delayed">Delayed</span>
        </div>

        <div className="student-row">
          <div className="student-name">Neha Verma</div>
          <div>Group B-02</div>
          <span className="badge on-track">On Track</span>
        </div>
      </div>
    </>
  );
}
