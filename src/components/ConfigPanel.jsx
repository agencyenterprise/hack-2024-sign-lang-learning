import React, { useState } from "react";

const ConfigPanel = ({
  onDifficultyChange,
  onDetectionVisibilityChange,
  onHandTrackingVisibilityChange,
  onCustomWordChange,
  toggleDetection,
  webcamRunning,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [showDetection, setShowDetection] = useState(false);
  const [showHandTracking, setShowHandTracking] = useState(false);
  const [customWord, setCustomWord] = useState("");

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);
  };

  const handleDetectionToggle = () => {
    setShowDetection(!showDetection);
    onDetectionVisibilityChange(!showDetection);
  };

  const handleHandTrackingToggle = () => {
    setShowHandTracking(!showHandTracking);
    onHandTrackingVisibilityChange(!showHandTracking);
  };

  const handleCustomWordChange = (e) => {
    const word = e.target.value.toLowerCase();
    setCustomWord(word);
    onCustomWordChange(word);
  };

  return (
    <div style={styles.container} className="config-panel">
      <div style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Custom Word</h3>
          <input
            type="text"
            value={customWord}
            onChange={handleCustomWordChange}
            placeholder="Enter word to practice..."
            style={styles.input}
            pattern="[a-zA-Z]+"
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Difficulty Level</h3>
          <div style={styles.buttonGroup}>
            {["easy", "medium", "hard", "darkSouls"].map((difficulty) => (
              <button
                key={difficulty}
                className={`config-button ${
                  selectedDifficulty === difficulty ? "active" : ""
                }`}
                style={{
                  ...styles.button,
                  opacity: customWord ? 0.5 : 1,
                  cursor: customWord ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                  !customWord && handleDifficultyChange(difficulty)
                }
                disabled={!!customWord}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Realtime Feedback</h3>
          <button
            className={`config-button ${showDetection ? "active" : ""}`}
            style={styles.button}
            onClick={handleDetectionToggle}
          >
            {showDetection ? "Hide" : "Show"}
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Hand Tracking</h3>
          <button
            className={`config-button ${showHandTracking ? "active" : ""}`}
            style={styles.button}
            onClick={handleHandTrackingToggle}
          >
            {showHandTracking ? "Hide" : "Show"}
          </button>
        </div>

        {webcamRunning && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Detection Control</h3>
            <button
              style={{
                ...styles.button,
                background: "#f44336",
                color: "#fff",
                border: "none",
                boxShadow: "0 4px 15px rgba(244, 67, 54, 0.3)",
              }}
              onClick={toggleDetection}
            >
              Stop Detection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px 40px",
    backgroundColor: "#2a2a2a",
    marginTop: "70px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    overflowX: "auto",
  },
  content: {
    maxWidth: "1600px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "start",
    gap: "20px",
    flexWrap: "wrap",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      gap: "10px",
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: "12px",
  },
  sectionTitle: {
    margin: "0",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
  activeButton: {
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
  },
  input: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    width: "200px",
    outline: "none",
    transition: "all 0.3s ease",
    "&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },
};

export default ConfigPanel;
