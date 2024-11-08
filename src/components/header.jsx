import React from "react";
import logo1 from "../assests/logo1.png";
const Header = () => {
  return (
    <div style={styles.header}>
      <div style={styles.logo}>
        <img style={styles.logo} src={logo1} />
      </div>
      <nav style={styles.nav}>
        <a href="#home" style={styles.link}>
          Home
        </a>
        <a href="#about" style={styles.link}>
          About
        </a>
        <a href="#services" style={styles.link}>
          Services
        </a>
        <a href="#contact" style={styles.link}>
          Contact
        </a>
      </nav>
    </div>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // Changed from space-between to flex-start
    backgroundColor: "#333",
    color: "#fff",
    padding: "0 20px",
    zIndex: 1000,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    width: "50px",
    height: "50px",
    fontSize: "20px",
    fontWeight: "bold",
    marginRight: "40px", // Added margin to separate logo from nav
  },
  nav: {
    display: "flex",
    gap: "30px", // Increased gap between links
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "20px", // Increased font size from 16px to 20px
    transition: "color 0.3s",
  },
  linkHover: {
    color: "#1E90FF",
  },
};

export default Header;
