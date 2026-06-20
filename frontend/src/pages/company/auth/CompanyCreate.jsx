import React, { useContext, useState } from "react";
import logo from "../../../assets/TopDevs.png";
import { AuthContext } from "../../../API/AuthContext";
import { useNavigate } from "react-router-dom";
import { Building2, Check, Mail, Phone, Lock, MapPin, Image, FileText, Camera, ArrowRight, ArrowLeft } from "lucide-react";

function CompanyCreate() {
  const { companyRegister } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });
  const [files, setFiles] = useState({
    companyIcon: null,
    legalDocument: null,
    companyImages: [],
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 2-step form

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    if (e.target.name === "companyImages") {
      setFiles({ ...files, companyImages: Array.from(e.target.files) });
    } else {
      const file = e.target.files[0];
      setFiles({ ...files, [e.target.name]: file });
      if (e.target.name === "companyIcon" && file) {
        setIconPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (files.companyIcon) formData.append("companyIcon", files.companyIcon);
    if (files.legalDocument) formData.append("legalDocument", files.legalDocument);
    files.companyImages.forEach((file) => formData.append("companyImages", file));
    try {
      await companyRegister(formData);
      alert("Company registered successfully! Please login.");
      navigate("/company/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e) => {
    e.target.parentElement.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.2)";
    e.target.parentElement.style.borderColor = "#10b981";
  };
  const inputBlur = (e) => {
    e.target.parentElement.style.boxShadow = "none";
    e.target.parentElement.style.borderColor = "#e2e8f0";
  };

  return (
    <div style={styles.page}>
      <div style={styles.blobTL} />
      <div style={styles.blobBR} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <img src={logo} alt="TopDevs" style={styles.logo} />
          <div style={styles.headerText}>
            <span style={styles.badge}><Building2 size={12} style={{ marginRight: "6px" }} /> Company Portal</span>
            <h1 style={styles.pageTitle}>Register Your Company</h1>
            <p style={styles.pageSub}>
              Join TopDevs and hire the best developers.{" "}
              <a href="/company/login" style={styles.link}>
                Already registered? Sign in →
              </a>
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={styles.stepRow}>
          {[
            { n: 1, label: "Company Info" },
            { n: 2, label: "Documents & Media" },
          ].map((s) => (
            <React.Fragment key={s.n}>
              <div
                style={s.n === step ? styles.stepActive : s.n < step ? styles.stepDone : styles.stepInactive}
                onClick={() => s.n < step && setStep(s.n)}
              >
                <div style={s.n === step ? styles.stepCircleActive : s.n < step ? styles.stepCircleDone : styles.stepCircleInactive}>
                  {s.n < step ? <Check size={16} /> : s.n}
                </div>
                <span style={styles.stepLabel}>{s.label}</span>
              </div>
              {s.n < 2 && <div style={step > 1 ? styles.stepConnectorDone : styles.stepConnector} />}
            </React.Fragment>
          ))}
        </div>

        {/* Form Card */}
        <div style={styles.card}>
          {error && <div style={styles.errorBox}>{error}</div>}

          {step === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Basic Information</h2>

              {/* Icon preview */}
              <div style={styles.iconRow}>
                <div style={styles.iconCircle}>
                   {iconPreview ? (
                    <img src={iconPreview} alt="icon" style={styles.iconImg} />
                  ) : (
                    <span style={styles.iconPlaceholder}><Building2 size={24} color="#64748b" /></span>
                  )}
                </div>
                <div style={styles.iconInfo}>
                  <p style={styles.iconTitle}>Company Logo</p>
                  <p style={styles.iconHint}>Upload in step 2</p>
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Company Name *</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}><Building2 size={18} color="#64748b" /></span>
                    <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Acme Corp" required style={styles.input} onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Company Email *</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}><Mail size={18} color="#64748b" /></span>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="hr@company.com" required style={styles.input} onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}><Phone size={18} color="#64748b" /></span>
                    <input name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required style={styles.input} onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password *</label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}><Lock size={18} color="#64748b" /></span>
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required style={styles.input} onFocus={inputFocus} onBlur={inputBlur} />
                  </div>
                </div>
              </div>

              <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
                <label style={styles.label}>Company Address *</label>
                <div style={{ ...styles.inputWrapper, alignItems: "flex-start" }}>
                  <span style={{ ...styles.inputIcon, top: "14px", position: "absolute" }}><MapPin size={18} color="#64748b" /></span>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full company address"
                    required
                    rows={3}
                    style={{ ...styles.input, paddingTop: "12px", resize: "vertical" }}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!form.name || !form.email || !form.phone || !form.password || !form.address) {
                    setError("Please fill in all fields before continuing.");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                style={styles.submitBtn}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  Continue to Documents <ArrowRight size={20} />
                </span>
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Documents & Company Media</h2>

              {/* File upload cards */}
              {[
                {
                  name: "companyIcon",
                  label: "Company Logo / Icon",
                  hint: "PNG or JPG recommended",
                  icon: <Image size={24} className="text-blue-600" />,
                  multiple: false,
                  required: true,
                },
                {
                  name: "legalDocument",
                  label: "Legal Document (Proof of Business)",
                  hint: "PDF, PNG or JPG — GST cert, trade licence, etc.",
                  icon: <FileText size={24} className="text-blue-600" />,
                  multiple: false,
                  required: true,
                },
                {
                  name: "companyImages",
                  label: "Company Images (2–5 photos)",
                  hint: "Office, team, workspace — any 2 to 5 images",
                  icon: <Camera size={24} className="text-blue-600" />,
                  multiple: true,
                  required: true,
                },
              ].map((f) => (
                <div key={f.name} style={styles.fileCard}>
                  <div style={styles.fileCardLeft}>
                    <span style={styles.fileCardIcon}>{f.icon}</span>
                    <div>
                      <p style={styles.fileCardLabel}>{f.label}</p>
                      <p style={styles.fileCardHint}>{f.hint}</p>
                    </div>
                  </div>
                  <label style={styles.fileUploadBtn}>
                    {files[f.name] && !Array.isArray(files[f.name])
                      ? <span className="flex items-center gap-1"><Check size={14} /> {files[f.name].name.slice(0, 15) + (files[f.name].name.length > 15 ? "…" : "")}</span>
                      : Array.isArray(files[f.name]) && files[f.name].length > 0
                      ? <span className="flex items-center gap-1"><Check size={14} /> {files[f.name].length} file(s) selected</span>
                      : "Choose file"}
                    <input
                      type="file"
                      name={f.name}
                      multiple={f.multiple}
                      required={f.required}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              ))}

              <div style={styles.btnRow}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={styles.backBtn}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <ArrowLeft size={18} /> Back
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={loading ? { ...styles.submitBtn, opacity: 0.7, flex: 1 } : { ...styles.submitBtn, flex: 1 }}
                >
                  {loading ? "Registering…" : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>Register Company <ArrowRight size={20} /></span>}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={styles.footerNote}>
          Looking to hire as a developer instead?{" "}
          <a href="/create" style={styles.link}>
            Create a developer account
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 50%, #f0f9ff 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 20px 60px",
  },
  blobTL: {
    position: "fixed",
    top: "-140px",
    left: "-140px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "rgba(59,130,246,0.13)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  blobBR: {
    position: "fixed",
    bottom: "-120px",
    right: "-120px",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(14,165,233,0.13)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "680px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },
  logo: { height: "52px", flexShrink: 0 },
  headerText: { display: "flex", flexDirection: "column", gap: "4px" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#0369a1",
    background: "#e0f2fe",
    padding: "4px 12px",
    borderRadius: "999px",
    width: "fit-content",
  },
  pageTitle: { margin: 0, fontSize: "26px", fontWeight: "800", color: "#0f172a" },
  pageSub: { margin: 0, fontSize: "13px", color: "#64748b" },
  link: { color: "#059669", fontWeight: "600", textDecoration: "none" },
  stepRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "24px",
    gap: "0",
  },
  stepActive: { display: "flex", alignItems: "center", gap: "8px", cursor: "default" },
  stepDone: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
  stepInactive: { display: "flex", alignItems: "center", gap: "8px", cursor: "default", opacity: 0.5 },
  stepCircleActive: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #059669, #0ea5e9)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 10px rgba(59,130,246,0.4)",
  },
  stepCircleDone: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#d1fae5",
    color: "#059669",
    fontWeight: "700",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepCircleInactive: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepLabel: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  stepConnector: { flex: 1, height: "2px", background: "#e2e8f0", margin: "0 12px" },
  stepConnectorDone: { flex: 1, height: "2px", background: "linear-gradient(90deg, #059669, #0ea5e9)", margin: "0 12px" },
  card: {
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(59,130,246,0.15)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(59,130,246,0.1)",
    padding: "36px",
    marginBottom: "20px",
  },
  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "20px",
  },
  stepContent: { display: "flex", flexDirection: "column", gap: "0" },
  stepTitle: { margin: "0 0 20px", fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  iconRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#f8fafc",
    border: "1.5px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "20px",
  },
  iconCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #d1fae5, #e0f2fe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    border: "2px solid rgba(59,130,246,0.2)",
  },
  iconImg: { width: "100%", height: "100%", objectFit: "cover" },
  iconPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center" },
  iconTitle: { margin: 0, fontSize: "13px", fontWeight: "600", color: "#374151" },
  iconHint: { margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" },
  iconInfo: {},
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
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
    fontFamily: "inherit",
  },
  fileCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "12px",
  },
  fileCardLeft: { display: "flex", alignItems: "center", gap: "12px" },
  fileCardIcon: { flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  fileCardLabel: { margin: 0, fontSize: "13px", fontWeight: "600", color: "#0f172a" },
  fileCardHint: { margin: "2px 0 0", fontSize: "11px", color: "#64748b" },
  fileUploadBtn: {
    padding: "9px 16px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #059669, #0ea5e9)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    marginTop: "24px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #059669 0%, #0ea5e9 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
    letterSpacing: "0.02em",
  },
  backBtn: {
    marginTop: "24px",
    padding: "14px 20px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#374151",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnRow: { display: "flex", gap: "12px", alignItems: "stretch" },
  footerNote: { textAlign: "center", fontSize: "13px", color: "#64748b" },
};

export default CompanyCreate;
