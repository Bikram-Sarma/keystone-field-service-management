import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      // Store JWT token
      localStorage.setItem("token", response.data.token);

      // Go to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>KEYSTONE</div>

          <div style={styles.logoLine}></div>

          <p style={styles.subtitle}>
            Field Service Management Platform
          </p>
        </div>

        <h2 style={styles.heading}>
          Welcome Back
        </h2>

        <p style={styles.welcomeText}>
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p style={styles.footer}>
          © 2026 Keystone Service Management
        </p>

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #4f46e5 100%)",

    fontFamily:
      "Arial, Helvetica, sans-serif",

    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "420px",
    maxWidth: "100%",
    padding: "45px 42px",

    background: "rgba(255, 255, 255, 0.98)",

    borderRadius: "18px",

    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.30)",

    boxSizing: "border-box",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "35px",
  },

  logo: {
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "4px",
    color: "#111827",
  },

  logoLine: {
    width: "70px",
    height: "4px",
    margin: "8px auto 8px",

    background:
      "linear-gradient(90deg, #2563eb, #7c3aed)",

    borderRadius: "10px",
  },

  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "14px",
    letterSpacing: "0.5px",
  },

  heading: {
    textAlign: "center",
    margin: "0",
    color: "#111827",
    fontSize: "27px",
  },

  welcomeText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    marginTop: "8px",
    marginBottom: "30px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: "48px",

    padding: "0 14px",

    border:
      "1px solid #cbd5e1",

    borderRadius: "9px",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",

    background: "#f8fafc",
  },

  error: {
    background: "#fef2f2",
    color: "#dc2626",

    border: "1px solid #fecaca",

    borderRadius: "8px",

    padding: "10px 12px",

    fontSize: "14px",

    marginBottom: "18px",

    textAlign: "center",
  },

  button: {
    width: "100%",
    height: "50px",

    border: "none",
    borderRadius: "9px",

    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",

    color: "white",

    fontSize: "16px",
    fontWeight: "600",

    boxShadow:
      "0 8px 18px rgba(37, 99, 235, 0.25)",

    transition: "0.2s",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "28px",
    marginBottom: "0",
  },
};

export default Login;