import React, { useState } from "react";
import Header from "./header";
import { Link } from "react-router-dom";

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "The Problem",
      content: [
        "Communication barriers between hearing and deaf communities",
        "Limited accessibility to sign language learning resources",
        "Growing AI surveillance of voice communications",
        "Need for universal communication methods",
      ],
    },
    {
      title: "Why Sign Language?",
      content: [
        "Privacy: Escape AI voice surveillance",
        "Universal: Communicate across language barriers",
        "Inclusive: Connect with the deaf community",
        "Practical: Everyone can learn and use it",
      ],
    },
    {
      title: "Our Solution",
      content: [
        "Real-time sign language detection",
        "Interactive learning experience",
        "AI-powered feedback system",
        "Multiple learning modes",
      ],
    },
    {
      title: "Key Features",
      content: [
        "Practice Mode: Learn signs with difficulty levels",
        "Freestyle Mode: Test your skills freely",
        "AI Chat: Get expert guidance",
        "Custom Words: Practice specific vocabulary",
      ],
    },
    {
      title: "Technology",
      content: [
        "Advanced hand tracking",
        "Machine learning sign recognition",
        "Real-time feedback system",
        "AI-powered assistance",
      ],
    },
    {
      title: "Start Learning Now",
      content: [
        "Join thousands learning sign language",
        "Break down communication barriers",
        "Enhance privacy in digital age",
        "Be part of a more inclusive world",
      ],
      isLast: true,
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <Header />
      <div
        style={{
          padding: "90px 20px 20px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#2a2a2a",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            minHeight: "calc(100vh - 140px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "800",
                background: "linear-gradient(45deg, #4CAF50, #2196F3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "40px",
              }}
            >
              {slides[currentSlide].title}
            </h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {slides[currentSlide].content.map((point, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "24px",
                    color: "#e0e0e0",
                    padding: "20px",
                    background: "#1a1a1a",
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "800px",
                    opacity: 0,
                    animation: `fadeIn 0.5s ease forwards ${index * 0.2}s`,
                  }}
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              style={{
                padding: "15px 30px",
                backgroundColor: currentSlide === 0 ? "#666" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: currentSlide === 0 ? "not-allowed" : "pointer",
                fontSize: "18px",
                opacity: currentSlide === 0 ? 0.7 : 1,
              }}
            >
              Previous
            </button>

            {slides[currentSlide].isLast ? (
              <Link
                to="/spell"
                style={{
                  padding: "15px 30px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "18px",
                  textDecoration: "none",
                }}
              >
                Start Learning
              </Link>
            ) : (
              <button
                onClick={nextSlide}
                style={{
                  padding: "15px 30px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Presentation;
