import React, { useState, useRef, useEffect } from "react";
import Header from "./header";

const SignLanguageChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are a highly knowledgeable sign language expert and educator. Your expertise covers various sign languages including ASL (American Sign Language), BSL (British Sign Language), and other international sign languages. You should:

1. Focus exclusively on sign language-related topics
2. Provide accurate, detailed information about sign language history, usage, and learning
3. Correct any misconceptions about sign language
4. Offer practical tips for learning and practicing sign language
5. Share insights about deaf culture and community
6. Keep responses short, clear, educational, and supportive
7. Politely redirect off-topic questions back to sign language discussions
8. If the user is struggling with something like making a sign, try to describe to them how it should be done
9. When appropriate, offer to generate images to help explain signs or concepts
10. When including images, don't put the data in the response text
11. If the user asks for an image or visual demonstration while images are turned off (there's a toggle button at the top), kindly inform them that they need to enable images first by clicking the "Images Off" button at the top of the chat
12. Be aware that users can toggle image generation on/off using a button at the top of the chat

If a question is not related to sign language, kindly remind the user that you're specialized in sign language topics and offer to discuss those instead.`,
    },
    {
      role: "assistant",
      content:
        "Hello! I'm your sign language expert assistant. Feel free to ask me anything about sign language, deaf culture, or learning signs. I can also generate images to help explain concepts when the image generation is enabled. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generateImages, setGenerateImages] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://hack-2024-sign-language-backend-production.up.railway.app/api/completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            generateImage: generateImages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          image: data.image, // Add the image URL if it exists
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
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
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#2a2a2a",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 140px)",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => setGenerateImages(!generateImages)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: generateImages ? "#4CAF50" : "#1a1a1a",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  lineHeight: 1,
                }}
              >
                {generateImages ? "🖼️" : "📝"}
              </span>
              {generateImages ? "Images On" : "Images Off"}
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            {messages.slice(1).map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems:
                    message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "15px",
                    borderRadius: "15px",
                    backgroundColor:
                      message.role === "user" ? "#4CAF50" : "#1a1a1a",
                    color: message.role === "user" ? "#fff" : "#e0e0e0",
                    boxShadow:
                      message.role === "assistant"
                        ? "0 2px 5px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                >
                  {message.content}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="AI Generated"
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        marginTop: "15px",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  padding: "15px",
                  color: "#999",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                    animation: "pulse 1s infinite",
                  }}
                />
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sign language..."
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#1a1a1a",
                color: "#e0e0e0",
                fontSize: "16px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: "15px 30px",
                borderRadius: "10px",
                border: "none",
                backgroundColor:
                  isLoading || !input.trim() ? "#666" : "#4CAF50",
                color: "white",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "16px",
                transition: "all 0.3s ease",
                opacity: isLoading || !input.trim() ? 0.7 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
};

export default SignLanguageChat;
