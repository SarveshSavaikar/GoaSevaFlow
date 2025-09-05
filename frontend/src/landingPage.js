import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to GoaSevaFlow</h1>
      <p style={styles.subtitle}>Your guide to accessing Goa government services</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/login")}>Login</button>
        <button style={{ ...styles.button, backgroundColor: "#555" }} onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "15vh",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "2rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    padding: "12px 28px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
};

export default LandingPage;
