import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/TopDevs.png";
import { Sparkles, Target, Trophy, Briefcase, Users, Camera, Mail, User, Lock, Eye, EyeOff, Building2, ArrowRight } from "lucide-react";

function Create() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    if (profilePic) formData.append("profilePic", profilePic);
    try {
      await register(formData);
      alert("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "#e2e8f0" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { level: 1, label: "Weak", color: "#ef4444" },
      { level: 2, label: "Fair", color: "#f97316" },
      { level: 3, label: "Good", color: "#eab308" },
      { level: 4, label: "Strong", color: "#10b981" },
    ];
    return map[score - 1] || { level: 0, label: "", color: "#e2e8f0" };
  };

  const strength = getStrength(form.password);

  return (
    <div style={styles.page}>
      <div style={styles.blobTL} />
      <div style={styles.blobBR} />

      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <span style={styles.badge}><Sparkles size={12} style={{ marginRight: "6px" }} /> Join the Community</span>
          <h1 style={styles.heroTitle}>
            Start your journey on{" "}
            <span style={styles.heroGradient}>TopDevs</span>
          </h1>
          <p style={styles.heroSub}>
            Create your free developer profile. Build skills, earn ranks, and
            land your dream job at top companies.
          </p>
          <ul style={styles.featureList}>
            {[
              { text: "Personalized learning roadmap", icon: <Target size={18} className="text-emerald-500" /> },
              { text: "Rank up & earn badges", icon: <Trophy size={18} className="text-emerald-500" /> },
              { text: "Direct job applications", icon: <Briefcase size={18} className="text-emerald-500" /> },
              { text: "Connect with top companies", icon: <Users size={18} className="text-emerald-500" /> },
            ].map((f) => (
              <li key={f.text} style={styles.featureItem}>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {f.icon} {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <img src={logo} alt="TopDevs" style={styles.logo} />
          <h2 style={styles.cardTitle}>Create your account</h2>
          <p style={styles.cardSub}>
            Already have an account?{" "}
            <a href="/login" style={styles.link}>
              Sign in
            </a>
          </p>

          {/* Avatar Picker */}
          <div style={styles.avatarRow}>
            <div
              style={styles.avatarCircle}
              onClick={() => fileInputRef.current.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarPlaceholder}><Camera size={24} color="#64748b" /></span>
              )}
              <div style={styles.avatarOverlay}>Change</div>
            </div>
            <div>
              <p style={styles.avatarHint}>
                <strong>Profile Photo</strong>
              </p>
              <p style={styles.avatarHintSub}>Click to upload (optional)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><Mail size={18} color="#64748b" /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
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

            {/* Username */}
            <div style={styles.fieldGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><User size={18} color="#64748b" /></span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
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

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}><Lock size={18} color="#64748b" /></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
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
                  {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={styles.strengthRow}>
                  <div style={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          ...styles.strengthSegment,
                          background:
                            i <= strength.level ? strength.color : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{ ...styles.strengthLabel, color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={
                loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn
              }
            >
              {loading ? "Creating account…" : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>Create Account <ArrowRight size={20} /></span>}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            onClick={() => navigate("/company/create")}
            style={styles.altBtn}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Building2 size={18} /> Register as a Company
            </span>
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
    display: "inline-flex",
    alignItems: "center",
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
  featureList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" },
  featureItem: {
    fontSize: "14px",
    color: "#334155",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(16,185,129,0.15)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: "500",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 24px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(16,185,129,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(16,185,129,0.1)",
    padding: "36px 36px",
    width: "100%",
    maxWidth: "440px",
  },
  logo: { height: "40px", display: "block", margin: "0 auto 16px" },
  cardTitle: { fontSize: "22px", fontWeight: "800", color: "#0f172a", textAlign: "center", margin: "0 0 6px" },
  cardSub: { fontSize: "13px", color: "#64748b", textAlign: "center", margin: "0 0 20px" },
  link: { color: "#059669", fontWeight: "600", textDecoration: "none" },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#f8fafc",
    border: "1.5px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  avatarCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d1fae5, #e0f2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
    cursor: "pointer",
    border: "2px solid rgba(16,185,129,0.3)",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center" },
  avatarOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s",
  },
  avatarHint: { margin: 0, fontSize: "13px", color: "#374151" },
  avatarHintSub: { margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
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
  label: { fontSize: "12px", fontWeight: "600", color: "#374151" },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  inputIcon: { position: "absolute", left: "14px", display: "flex", alignItems: "center", pointerEvents: "none" },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
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
    display: "flex",
    alignItems: "center",
    padding: "0",
    lineHeight: "1",
  },
  strengthRow: { display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" },
  strengthBars: { display: "flex", gap: "4px", flex: 1 },
  strengthSegment: { height: "4px", flex: 1, borderRadius: "4px", transition: "background 0.3s" },
  strengthLabel: { fontSize: "11px", fontWeight: "600", minWidth: "40px" },
  submitBtn: {
    padding: "13px",
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
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" },
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

export default Create;
