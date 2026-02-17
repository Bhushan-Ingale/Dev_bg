import { useState } from "react";

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Tamanna Gupta",
    roll: "IT-A-08",
    email: "tamanna@apsit.edu.in",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-card">

      <h2 className="page-title">My Profile</h2>

      {!isEditing ? (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Roll No:</strong> {profile.roll}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <button
            className="primary-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Roll No
            <input
              type="text"
              name="roll"
              value={profile.roll}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </label>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              className="primary-btn"
              onClick={() => setIsEditing(false)}
            >
              Save
            </button>

            <button
              className="secondary-btn"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}

    </div>
  );
}
