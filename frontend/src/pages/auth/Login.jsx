import React, { useContext, useState } from "react";
import logo from "../../assets/TopDevs.png";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/UserDashboard");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative blobs */}
      <div style={styles.blobTopLeft} />
      <div style={styles.blobBottomRight} />

      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <span style={styles.badge}>🚀 Developer Platform</span>
          <h1 style={styles.heroTitle}>
            Welcome back to{" "}
            <span style={styles.heroGradient}>TopDevs</span>
          </h1>
          <p style={styles.heroSub}>
            Continue your journey — build skills, earn ranks, and connect with
            top companies.
          </p>
          <div style={styles.statRow}>
            {[
              { label: "Developers", value: "10K+" },
              { label: "Companies", value: "500+" },
              { label: "Jobs Posted", value: "2K+" },
            ].map((s) => (
              <div key={s.label} style={styles.statBox}>
                <span style={styles.statVal}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form card */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <img src={logo} alt="TopDevs" style={styles.logo} />
          <h2 style={styles.cardTitle}>Sign in to your account</h2>
          <p style={styles.cardSub}>
            Don't have an account?{" "}
            <a href="/create" style={styles.link}>
              Create one
            </a>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.fieldGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  style={styles.input}
                  onFocus={(e) =>
                    (e.target.parentElement.style.boxShadow =
                      "0 0 0 3px rgba(16,185,129,0.2)")
                  }
                  onBlur={(e) =>
                    (e.target.parentElement.style.boxShadow = "none")
                  }
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ ...styles.input, paddingRight: "44px" }}
                  onFocus={(e) =>
                    (e.target.parentElement.style.boxShadow =
                      "0 0 0 3px rgba(16,185,129,0.2)")
                  }
                  onBlur={(e) =>
                    (e.target.parentElement.style.boxShadow = "none")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            onClick={() => navigate("/company/login")}
            style={styles.altBtn}
          >
            🏢 Sign in as Company
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f0f9ff 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  blobTopLeft: {
    position: "absolute",
    top: "-120px",
    left: "-120px",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.15)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  blobBottomRight: {
    position: "absolute",
    bottom: "-100px",
    right: "-100px",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "rgba(14,165,233,0.15)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  leftPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    position: "relative",
    zIndex: 1,
  },
  leftContent: {
    maxWidth: "420px",
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#059669",
    background: "#d1fae5",
    padding: "6px 14px",
    borderRadius: "999px",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: "800",
    lineHeight: "1.15",
    color: "#0f172a",
    margin: "0 0 16px",
  },
  heroGradient: {
    background: "linear-gradient(90deg, #059669, #0ea5e9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.7",
    marginBottom: "36px",
  },
  statRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  statBox: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "90px",
  },
  statVal: {
    fontSize: "22px",
    fontWeight: "800",
    background: "linear-gradient(90deg, #059669, #0ea5e9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  statLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "4px",
    fontWeight: "500",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(16,185,129,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(16,185,129,0.1)",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    height: "44px",
    display: "block",
    margin: "0 auto 20px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    margin: "0 0 8px",
  },
  cardSub: {
    fontSize: "14px",
    color: "#64748b",
    textAlign: "center",
    margin: "0 0 28px",
  },
  link: {
    color: "#059669",
    fontWeight: "600",
    textDecoration: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: "500",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "15px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "13px 14px 13px 42px",
    fontSize: "14px",
    color: "#0f172a",
    background: "transparent",
    border: "none",
    outline: "none",
    borderRadius: "12px",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0",
    lineHeight: "1",
  },
  submitBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #059669 0%, #0ea5e9 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s",
    letterSpacing: "0.02em",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e2e8f0",
  },
  dividerText: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  altBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
  },
};

export default Login;
