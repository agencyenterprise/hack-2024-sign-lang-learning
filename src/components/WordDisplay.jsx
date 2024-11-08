import React from "react";

const WordDisplay = ({
  targetWord,
  currentLetterIndex,
  congratulations,
  renderBasedOnDifficulty,
  difficulty,
  time,
}) => {
  return (
    <div
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "60px",
        }}
      >
        {congratulations ? (
          <div>
            <div>You did it! Congratulations!</div>
            <div>{`Time: ${time}s`}</div>
          </div>
        ) : (
          "Try to spell this word"
        )}
      </div>

      <div>
        <div style={{ display: "flex", gap: "10px" }}>
          {targetWord.split("").map((letter, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                color:
                  index < currentLetterIndex || congratulations
                    ? "gray"
                    : "white",
              }}
            >
              <div style={{ fontSize: "40px", fontWeight: "bold" }}>
                {letter.toUpperCase()}
              </div>
              {renderBasedOnDifficulty({
                letter,
                index: index,
                difficulty,
                currentLetterIndex,
                congratulations,
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;
