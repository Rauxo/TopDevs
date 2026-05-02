import React, { useContext, useState } from "react";
import logo from "../../../assets/TopDevs.png";
import { AuthContext } from "../../../API/AuthContext";
import { useNavigate } from "react-router-dom";

function CompanyLogin() {
  const { companyLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await companyLogin(form);
      navigate("/company/dashboard");
    } catch (err) {
      setError("Invalid company credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.blobTL} />
      <div style={styles.blobBR} />

      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <span style={styles.badge}>🏢 Company Portal</span>
          <h1 style={styles.heroTitle}>
            Hire top developers on{" "}
            <span style={styles.heroGradient}>TopDevs</span>
          </h1>
          <p style={styles.heroSub}>
            Access your company dashboard to post jobs, review applications,
            and connect with verified skilled developers.
          </p>
          <div style={styles.benefitGrid}>
            {[
              { icon: "🎯", title: "Targeted Hiring", desc: "Find devs by rank & skill" },
              { icon: "⚡", title: "Fast Screening", desc: "Pre-vetted talent pool" },
              { icon: "📊", title: "Analytics", desc: "Track application metrics" },
              { icon: "🔒", title: "Verified Profiles", desc: "All devs are authenticated" },
            ].map((b) => (
              <div key={b.title} style={styles.benefitCard}>
                <span style={styles.benefitIcon}>{b.icon}</span>
                <div>
                  <p style={styles.benefitTitle}>{b.title}</p>
                  <p style={styles.benefitDesc}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <img src={logo} alt="TopDevs" style={styles.logo} />
          <div style={styles.companyBadge}>Company Portal</div>
          <h2 style={styles.cardTitle}>Sign in as Company</h2>
          <p style={styles.cardSub}>
            New company?{" "}
            <a href="/company/create" style={styles.link}>
              Register here
            </a>
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>
                Company Email
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
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
              {loading ? "Signing in…" : "Sign In as Company →"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            onClick={() => navigate("/login")}
            style={styles.altBtn}
          >
            👤 Sign in as Developer
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
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f0f9ff 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  blobTL: {
    position: "absolute",
    top: "-140px",
    left: "-140px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.13)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  blobBR: {
    position: "absolute",
    bottom: "-120px",
    right: "-120px",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(14,165,233,0.13)",
    filter: "blur(90px)",
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
  leftContent: { maxWidth: "420px" },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#0369a1",
    background: "#e0f2fe",
    padding: "6px 14px",
    borderRadius: "999px",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "clamp(26px, 4vw, 42px)",
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
    fontSize: "15px",
    color: "#475569",
    lineHeight: "1.7",
    marginBottom: "28px",
  },
  benefitGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  benefitCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "14px",
    padding: "14px",
  },
  benefitIcon: { fontSize: "22px", flexShrink: 0 },
  benefitTitle: { margin: 0, fontSize: "13px", fontWeight: "700", color: "#0f172a" },
  benefitDesc: { margin: "2px 0 0", fontSize: "11px", color: "#64748b" },
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
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(16,185,129,0.15)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(16,185,129,0.1)",
    padding: "44px 40px",
    width: "100%",
    maxWidth: "420px",
  },
  logo: { height: "44px", display: "block", margin: "0 auto 14px" },
  companyBadge: {
    display: "block",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#0369a1",
    background: "#e0f2fe",
    padding: "4px 14px",
    borderRadius: "999px",
    width: "fit-content",
    margin: "0 auto 14px",
  },
  cardTitle: { fontSize: "23px", fontWeight: "800", color: "#0f172a", textAlign: "center", margin: "0 0 6px" },
  cardSub: { fontSize: "13px", color: "#64748b", textAlign: "center", margin: "0 0 28px" },
  link: { color: "#059669", fontWeight: "600", textDecoration: "none" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: "500",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    transition: "box-shadow 0.2s",
  },
  inputIcon: { position: "absolute", left: "14px", fontSize: "15px", pointerEvents: "none" },
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
    letterSpacing: "0.02em",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#e2e8f0" },
  dividerText: { fontSize: "12px", color: "#94a3b8", fontWeight: "500" },
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
  },
};

export default CompanyLogin;
