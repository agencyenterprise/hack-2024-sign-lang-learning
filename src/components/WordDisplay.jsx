import React from "react";

const WordDisplay = ({
  targetWord,
  currentLetterIndex,
  congratulations,
  renderBasedOnDifficulty,
  difficulty,
  alwaysShowSigns,
  time,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        color: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        {congratulations ? (
          <div style={styles.congratsContainer}>
            <div style={styles.congratsText}>You did it! Congratulations!</div>
            <div style={styles.timeText}>Time: {time}s</div>
          </div>
        ) : (
          <div style={styles.instructionText}>Try to spell this word</div>
        )}
      </div>

      <div>
        <div style={styles.letterContainer}>
          {targetWord.split("").map((letter, index) => (
            <div
              key={index}
              style={{
                ...styles.letterWrapper,
                opacity:
                  index < currentLetterIndex || congratulations ? 0.5 : 1,
              }}
            >
              <div style={styles.letter}>{letter.toUpperCase()}</div>
              {renderBasedOnDifficulty({
                letter,
                index: index,
                difficulty,
                currentLetterIndex,
                congratulations,
                alwaysShowSigns,
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  congratsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  congratsText: {
    fontSize: "48px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  timeText: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#4CAF50",
  },
  instructionText: {
    fontSize: "40px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  letterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    padding: "20px",
    "@media (max-width: 768px)": {
      gap: "10px",
      padding: "10px",
    },
  },
  letterWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    transition: "opacity 0.3s ease",
  },
  letter: {
    fontSize: "48px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #FF4081, #FF9100)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    "@media (max-width: 768px)": {
      fontSize: "32px",
    },
  },
};

export default WordDisplay;
