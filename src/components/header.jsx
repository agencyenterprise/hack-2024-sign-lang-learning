import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo1 from "../assests/logo1.png";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={styles.header}>
      <div style={styles.logo}>
        <Link to="/">
          <img style={styles.logoImage} src={logo1} alt="Logo" />
        </Link>
      </div>
      <nav style={styles.nav}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(currentPath === "/" && styles.activeLink),
          }}
        >
          Home
        </Link>
        <Link
          to="/spell"
          style={{
            ...styles.link,
            ...(currentPath === "/spell" && styles.activeLink),
          }}
        >
          Practice
        </Link>
        <Link
          to="/custom"
          style={{
            ...styles.link,
            ...(currentPath === "/custom" && styles.activeLink),
          }}
        >
          Custom Word
        </Link>
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
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "0 40px",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  logo: {
    marginRight: "60px",
  },
  logoImage: {
    width: "50px",
    height: "50px",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.1)",
    },
  },
  nav: {
    display: "flex",
    gap: "40px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    ":hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  activeLink: {
    background: "linear-gradient(45deg, #4CAF50, #2196F3)",
    color: "#fff",
    fontWeight: "600",
  },
};

export default Header;
