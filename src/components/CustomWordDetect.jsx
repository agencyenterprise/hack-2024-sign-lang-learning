import React, { useState } from "react";
import Detect from "./Detect/Detect";

const CustomWordDetect = () => {
  const [customWord, setCustomWord] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWord.trim()) {
      setIsPlaying(true);
    }
  };

  if (isPlaying) {
    return <Detect customWord={customWord} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Enter Your Word</h1>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value.toLowerCase())}
            placeholder="Type any word..."
            style={styles.input}
            pattern="[a-zA-Z]+"
            title="Please use only letters (no numbers or special characters)"
            required
          />
          <button type="submit" style={styles.button}>
            Practice This Word
          </button>
        </div>
        <p style={styles.hint}>
          Tip: Start with shorter words and gradually increase difficulty
        </p>
      </form>
    </div>
  );
};

const styles = {
  form: {
    width: "100%",
    maxWidth: "600px",
    padding: "40px",
    backgroundColor: "#2a2a2a",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    textAlign: "center",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "15px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#1a1a1a",
    border: "2px solid #333",
    borderRadius: "10px",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.3s ease",
    ":focus": {
      borderColor: "#4CAF50",
    },
  },
  button: {
    padding: "15px 30px",
    fontSize: "1.2rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.3s ease",
    ":hover": {
      transform: "translateY(-2px)",
      backgroundColor: "#45a049",
    },
  },
  hint: {
    marginTop: "20px",
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
  },
};

export default CustomWordDetect;
