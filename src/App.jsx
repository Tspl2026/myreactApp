import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: darkMode
      ? "linear-gradient(135deg, #0f172a, #1e293b)"
      : "linear-gradient(135deg, #dbeafe, #f8fafc)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    transition: "0.3s",
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "1000px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  };

  const cardStyle = {
    background: darkMode ? "#1e293b" : "#ffffff",
    color: darkMode ? "#f8fafc" : "#0f172a",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    transition: "0.3s",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
  };

  const buttonStyle = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
    background: darkMode ? "#38bdf8" : "#2563eb",
    color: "white",
  };

  const secondaryButton = {
    ...buttonStyle,
    background: darkMode ? "#475569" : "#e2e8f0",
    color: darkMode ? "#fff" : "#0f172a",
  };

  const avatarStyle = {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "16px",
    background: darkMode ? "#334155" : "#dbeafe",
    color: darkMode ? "#f8fafc" : "#1d4ed8",
  };

  const getInitial = () => {
    return name.trim() ? name.trim().charAt(0).toUpperCase() : "U";
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setName("");
    setRole("Frontend Developer");
    setBio("");
    setSubmitted(false);
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>Interactive User Demo</h2>

          <label>Enter Your Name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Type your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Select Role</label>
          <select
            style={inputStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>UI/UX Designer</option>
            <option>Student</option>
          </select>

          <label>Short Bio</label>
          <textarea
            style={{ ...inputStyle, minHeight: "100px", resize: "none" }}
            placeholder="Write something about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button style={buttonStyle} onClick={handleSubmit}>
            Save Profile
          </button>

          <button
            style={secondaryButton}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button style={secondaryButton} onClick={handleReset}>
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>Live Preview</h2>

          <div style={avatarStyle}>{getInitial()}</div>

          <h3 style={{ margin: "0 0 8px 0" }}>
            {name || "Your Name Here"}
          </h3>

          <p style={{ margin: "0 0 12px 0", opacity: 0.8 }}>
            {role}
          </p>

          <p style={{ lineHeight: "1.6" }}>
            {bio || "Your bio will appear here as you type..."}
          </p>

          {submitted && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px",
                borderRadius: "10px",
                background: darkMode ? "#0f766e" : "#dcfce7",
                color: darkMode ? "#ecfeff" : "#166534",
                fontWeight: "bold",
              }}
            >
              Profile saved successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;