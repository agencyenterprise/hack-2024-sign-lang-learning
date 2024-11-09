import React, { useState } from "react";
import Header from "./header";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeak = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "https://hack-2024-sign-language-backend-production.up.railway.app/api/tts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

      // Clean up the URL after playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to convert text to speech");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <Header />
      <div
        style={{
          padding: "90px 20px 20px 20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#2a2a2a",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              background: "linear-gradient(45deg, #4CAF50, #2196F3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Text to Speech
          </h1>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to speak..."
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "15px",
              backgroundColor: "#1a1a1a",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "18px",
              marginBottom: "20px",
              resize: "vertical",
              outline: "none",
            }}
          />
          <button
            onClick={handleSpeak}
            disabled={isLoading || !text.trim()}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "20px",
              fontWeight: "600",
              backgroundColor: isLoading || !text.trim() ? "#666" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: isLoading || !text.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: isLoading || !text.trim() ? 0.7 : 1,
            }}
          >
            {isLoading ? "Converting..." : "Convert to Speech"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
