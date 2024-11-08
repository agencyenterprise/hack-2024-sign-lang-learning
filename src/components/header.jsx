import React from "react";
import { useLocation } from "react-router-dom";
import logo1 from "../assests/logo1.png";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div style={styles.header}>
      <div style={styles.logo}>
        <img style={styles.logo} src={logo1} alt="Logo" />
      </div>
      <nav style={styles.nav}>
        <a
          href="/"
          style={{
            ...styles.link,
            ...(currentPath === "/" && styles.activeLink),
          }}
        >
          Home
        </a>
        <a
          href="/spell"
          style={{
            ...styles.link,
            ...(currentPath === "/spell" && styles.activeLink),
          }}
        >
          Practice
        </a>
        <a
          href="/custom"
          style={{
            ...styles.link,
            ...(currentPath === "/custom" && styles.activeLink),
          }}
        >
          Custom Word
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
    justifyContent: "flex-start",
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
    marginRight: "40px",
  },
  nav: {
    display: "flex",
    gap: "30px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "20px",
    transition: "color 0.3s",
  },
  activeLink: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
};

export default Header;
