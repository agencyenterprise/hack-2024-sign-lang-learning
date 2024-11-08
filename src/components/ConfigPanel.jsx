import React, { useState } from "react";

const ConfigPanel = ({
  onDifficultyChange,
  onDetectionVisibilityChange,
  onHandTrackingVisibilityChange,
  toggleDetection,
  webcamRunning,
  isCustomWord,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [showDetection, setShowDetection] = useState(false);
  const [showHandTracking, setShowHandTracking] = useState(false);

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

  return (
    <div style={styles.container}>
      {!isCustomWord && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Difficulty Level</h3>
          <div style={styles.buttonGroup}>
            {["easy", "medium", "hard", "darkSouls"].map((difficulty) => (
              <button
                key={difficulty}
                style={{
                  ...styles.button,
                  ...(selectedDifficulty === difficulty
                    ? styles.activeButton
                    : {}),
                }}
                onClick={() => handleDifficultyChange(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Realtime Feedback</h3>
        <button
          style={{
            ...styles.button,
            ...(showDetection ? styles.activeButton : {}),
          }}
          onClick={handleDetectionToggle}
        >
          {showDetection ? "Hide" : "Show"}
        </button>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Hand Tracking</h3>
        <button
          style={{
            ...styles.button,
            ...(showHandTracking ? styles.activeButton : {}),
          }}
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
              backgroundColor: "#f44336",
              color: "#fff",
              border: "2px solid #f44336",
            }}
            onClick={toggleDetection}
          >
            Stop Detection
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    paddingLeft: "100px",
    backgroundColor: "#ccc",
    marginTop: "60px",
    display: "flex",
    justifyContent: "start",
    gap: "40px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  sectionTitle: {
    margin: "0",
    color: "#333",
    fontSize: "18px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 16px",
    border: "2px solid #333",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
  },
  activeButton: {
    backgroundColor: "#333",
    color: "#fff",
  },
};

export default ConfigPanel;
