import React from "react";
import { Link } from "react-router-dom";
import FlyingLogo from "./FlyingLogo";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      {/* Add multiple flying logos */}
      {[...Array(1)].map((_, i) => (
        <FlyingLogo key={i} />
      ))}

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.mainTitle}>
            Learn Sign Language
            <span style={styles.titleAccent}> Interactively</span>
          </h1>
          <p style={styles.subtitle}>
            Master sign language through real-time feedback and gamified
            learning
          </p>

          <Link to="/spell" style={styles.ctaButton}>
            <span style={{ fontSize: "40px" }}>Start Learning Now</span>
          </Link>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>Privacy</span>
            <span style={styles.statLabel}>
              AIs are always listening to what you say, <br />
              there is always a mic around, use sign language
              <br /> to escape AI surveillance
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>Universal</span>
            <span style={styles.statLabel}>
              <span>
                <s>Everyone has hands</s>
              </span>{" "}
              <br />
              Communicate with anyone <br />
              regardless of their native language
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>Inclusive</span>
            <span style={styles.statLabel}>
              Connect with the deaf community and <br />
              break down communication barriers.
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Our Platform?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Real-time Feedback</h3>
            <p style={styles.featureDescription}>
              Get instant feedback on your hand signs with our advanced AI
              technology
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎮</div>
            <h3 style={styles.featureTitle}>Gamified Learning</h3>
            <p style={styles.featureDescription}>
              Learn through fun, interactive exercises and track your progress
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📈</div>
            <h3 style={styles.featureTitle}>Progressive Difficulty</h3>
            <p style={styles.featureDescription}>
              Start with basics and gradually advance to more complex signs
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌐</div>
            <h3 style={styles.featureTitle}>Accessible Anywhere</h3>
            <p style={styles.featureDescription}>
              Practice from any device with a camera and internet connection
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
          <p style={styles.ctaText}>
            Join thousands of others learning sign language in a fun and
            interactive way
          </p>
          <Link to="/spell" style={styles.ctaButton}>
            Begin Learning
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
  },
  heroContent: {
    textAlign: "center",
    maxWidth: "800px",
  },
  mainTitle: {
    fontSize: "4.5rem",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.2",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  titleAccent: {
    display: "block",
    fontSize: "5rem",
    background: "linear-gradient(45deg, #FF4081, #FF9100)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "40px",
    color: "#cccccc",
  },
  heroStats: {
    display: "flex",
    gap: "60px",
    marginTop: "60px",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statLabel: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#cccccc",
  },
  features: {
    padding: "100px 20px",
    background: "#2a2a2a",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "60px",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  featureCard: {
    background: "#1a1a1a",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-10px)",
    },
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#ffffff",
  },
  featureDescription: {
    color: "#cccccc",
    lineHeight: "1.6",
  },
  cta: {
    padding: "100px 20px",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
  },
  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "3rem",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  ctaText: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    color: "#cccccc",
  },
  ctaButton: {
    display: "inline-block",
    padding: "15px 40px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#ffffff",
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    borderRadius: "30px",
    textDecoration: "none",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    },
  },
};

export default LandingPage;
