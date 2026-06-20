import React, { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, User, Lock, Eye, EyeOff, Mail, Camera, Building2, Phone, MapPin, Image as ImageIcon, FileText, Check, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "../../assets/TopDevs.png";

const AuthModal = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, companyLogin, companyRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [userLoginForm, setUserLoginForm] = useState({ username: "", password: "" });
  const [userRegForm, setUserRegForm] = useState({ email: "", username: "", password: "" });
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userPreview, setUserPreview] = useState(null);
  const userFileInputRef = useRef(null);

  const [compLoginForm, setCompLoginForm] = useState({ email: "", password: "" });
  
  const [compRegForm, setCompRegForm] = useState({ name: "", email: "", phone: "", password: "", address: "" });
  const [compFiles, setCompFiles] = useState({ companyIcon: null, legalDocument: null, companyImages: [] });
  const [compIconPreview, setCompIconPreview] = useState(null);
  const [compStep, setCompStep] = useState(1);

  useEffect(() => {
    // Reset states when mode changes
    setError("");
    setLoading(false);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // --- Handlers ---
  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login(userLoginForm);
      closeAuthModal();
      navigate("/UserDashboard");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    } finally { setLoading(false); }
  };

  const handleUserRegSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const formData = new FormData();
    formData.append("email", userRegForm.email);
    formData.append("username", userRegForm.username);
    formData.append("password", userRegForm.password);
    if (userProfilePic) formData.append("profilePic", userProfilePic);
    try {
      await register(formData);
      alert("Account created successfully! Please login.");
      openAuthModal("user-login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleCompLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await companyLogin(compLoginForm);
      closeAuthModal();
      navigate("/company/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally { setLoading(false); }
  };

  const handleCompRegSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const formData = new FormData();
    Object.keys(compRegForm).forEach((key) => formData.append(key, compRegForm[key]));
    if (compFiles.companyIcon) formData.append("companyIcon", compFiles.companyIcon);
    if (compFiles.legalDocument) formData.append("legalDocument", compFiles.legalDocument);
    compFiles.companyImages.forEach((file) => formData.append("companyImages", file));
    try {
      await companyRegister(formData);
      alert("Company registered successfully! Please login.");
      openAuthModal("company-login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  // --- Common Input Styles ---
  const inputClass = "w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-slate-900";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";
  const btnClass = "w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors border-none cursor-pointer flex items-center justify-center gap-2";

  // --- Render Functions ---
  const renderUserLogin = () => (
    <form onSubmit={handleUserLoginSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Username</label>
        <div className="relative">
          <User size={16} className={iconClass} />
          <input type="text" value={userLoginForm.username} onChange={(e) => setUserLoginForm({ ...userLoginForm, username: e.target.value })} className={inputClass} placeholder="Enter your username" required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <div className="relative">
          <Lock size={16} className={iconClass} />
          <input type={showPassword ? "text" : "password"} value={userLoginForm.password} onChange={(e) => setUserLoginForm({ ...userLoginForm, password: e.target.value })} className={inputClass} placeholder="Enter your password" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
      </button>
      <div className="text-center mt-2 text-sm text-slate-600">
        Don't have an account? <button type="button" onClick={() => openAuthModal("user-register")} className="text-blue-600 font-bold hover:underline">Create one</button>
      </div>
    </form>
  );

  const renderUserRegister = () => (
    <form onSubmit={handleUserRegSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors" onClick={() => userFileInputRef.current.click()}>
          {userPreview ? <img src={userPreview} alt="preview" className="w-full h-full object-cover" /> : <Camera size={20} className="text-slate-400" />}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Profile Photo</p>
          <p className="text-[10px] text-slate-500">Click to upload (optional)</p>
        </div>
        <input ref={userFileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if(f) { setUserProfilePic(f); setUserPreview(URL.createObjectURL(f)); } }} className="hidden" />
      </div>
      <div>
        <label className={labelClass}>Email Address</label>
        <div className="relative">
          <Mail size={16} className={iconClass} />
          <input type="email" value={userRegForm.email} onChange={(e) => setUserRegForm({ ...userRegForm, email: e.target.value })} className={inputClass} placeholder="you@example.com" required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Username</label>
        <div className="relative">
          <User size={16} className={iconClass} />
          <input type="text" value={userRegForm.username} onChange={(e) => setUserRegForm({ ...userRegForm, username: e.target.value })} className={inputClass} placeholder="Choose a username" required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <div className="relative">
          <Lock size={16} className={iconClass} />
          <input type={showPassword ? "text" : "password"} value={userRegForm.password} onChange={(e) => setUserRegForm({ ...userRegForm, password: e.target.value })} className={inputClass} placeholder="Min 8 characters" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? "Creating account..." : <>Create Account <ArrowRight size={16} /></>}
      </button>
      <div className="text-center mt-2 text-sm text-slate-600">
        Already have an account? <button type="button" onClick={() => openAuthModal("user-login")} className="text-blue-600 font-bold hover:underline">Sign in</button>
      </div>
    </form>
  );

  const renderCompLogin = () => (
    <form onSubmit={handleCompLoginSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Company Email</label>
        <div className="relative">
          <Mail size={16} className={iconClass} />
          <input type="email" value={compLoginForm.email} onChange={(e) => setCompLoginForm({ ...compLoginForm, email: e.target.value })} className={inputClass} placeholder="hr@company.com" required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <div className="relative">
          <Lock size={16} className={iconClass} />
          <input type={showPassword ? "text" : "password"} value={compLoginForm.password} onChange={(e) => setCompLoginForm({ ...compLoginForm, password: e.target.value })} className={inputClass} placeholder="Enter your password" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
      </button>
      <div className="text-center mt-2 text-sm text-slate-600">
        New company? <button type="button" onClick={() => openAuthModal("company-register")} className="text-blue-600 font-bold hover:underline">Register here</button>
      </div>
    </form>
  );

  const renderCompRegister = () => {
    return (
      <form onSubmit={compStep === 2 ? handleCompRegSubmit : (e) => { e.preventDefault(); setCompStep(2); }} className="flex flex-col gap-4">
        {compStep === 1 && (
          <>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Company Name</label>
                <div className="relative">
                  <Building2 size={16} className={iconClass} />
                  <input type="text" value={compRegForm.name} onChange={(e) => setCompRegForm({ ...compRegForm, name: e.target.value })} className={inputClass} placeholder="Acme Corp" required />
                </div>
              </div>
              <div className="flex-1">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail size={16} className={iconClass} />
                  <input type="email" value={compRegForm.email} onChange={(e) => setCompRegForm({ ...compRegForm, email: e.target.value })} className={inputClass} placeholder="hr@acme.com" required />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClass}>Phone</label>
                <div className="relative">
                  <Phone size={16} className={iconClass} />
                  <input type="text" value={compRegForm.phone} onChange={(e) => setCompRegForm({ ...compRegForm, phone: e.target.value })} className={inputClass} placeholder="+1 234 567 890" required />
                </div>
              </div>
              <div className="flex-1">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock size={16} className={iconClass} />
                  <input type="password" value={compRegForm.password} onChange={(e) => setCompRegForm({ ...compRegForm, password: e.target.value })} className={inputClass} placeholder="Min 8 chars" required />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <textarea value={compRegForm.address} onChange={(e) => setCompRegForm({ ...compRegForm, address: e.target.value })} className={`${inputClass} pl-10 resize-none`} placeholder="Full company address" required rows={2} />
              </div>
            </div>
            <button type="submit" className={btnClass}>Next Step <ArrowRight size={16} /></button>
          </>
        )}

        {compStep === 2 && (
          <>
            <div className="flex flex-col gap-3">
               {[
                { name: "companyIcon", label: "Company Logo", hint: "PNG/JPG", icon: <ImageIcon size={20} />, multiple: false, required: true },
                { name: "legalDocument", label: "Legal Document", hint: "PDF/PNG/JPG", icon: <FileText size={20} />, multiple: false, required: true },
                { name: "companyImages", label: "Office Photos (2-5)", hint: "Any images", icon: <Camera size={20} />, multiple: true, required: true },
              ].map((f) => (
                <div key={f.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">{f.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{f.label}</p>
                      <p className="text-[10px] text-slate-500">{f.hint}</p>
                    </div>
                  </div>
                  <label className="cursor-pointer bg-white border border-slate-300 text-xs font-bold px-3 py-1.5 rounded hover:border-blue-500 transition-colors">
                    {compFiles[f.name] && !Array.isArray(compFiles[f.name]) ? <span className="flex items-center gap-1"><Check size={12}/> Selected</span> : 
                     Array.isArray(compFiles[f.name]) && compFiles[f.name].length > 0 ? <span className="flex items-center gap-1"><Check size={12}/> {compFiles[f.name].length}</span> : "Choose"}
                    <input type="file" name={f.name} multiple={f.multiple} required={f.required} onChange={(e) => {
                      if (e.target.name === "companyImages") {
                        setCompFiles({ ...compFiles, companyImages: Array.from(e.target.files) });
                      } else {
                        setCompFiles({ ...compFiles, [e.target.name]: e.target.files[0] });
                      }
                    }} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setCompStep(1)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded hover:bg-slate-200 transition-colors"><ArrowLeft size={16} /></button>
              <button type="submit" disabled={loading} className={`${btnClass} flex-1`}>{loading ? "Registering..." : "Complete Registration"}</button>
            </div>
          </>
        )}
        <div className="text-center mt-2 text-sm text-slate-600">
          Already registered? <button type="button" onClick={() => openAuthModal("company-login")} className="text-blue-600 font-bold hover:underline">Sign in</button>
        </div>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[12px] shadow-2xl relative overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <img src={logo} alt="TopDevs" className="h-6" />
          <button onClick={closeAuthModal} className="text-slate-400 hover:text-slate-900 transition-colors p-1 bg-slate-50 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {authModalMode === "user-login" && "Welcome Back"}
            {authModalMode === "user-register" && "Create an Account"}
            {authModalMode === "company-login" && "Company Portal"}
            {authModalMode === "company-register" && "Register Company"}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {authModalMode.startsWith("user") ? "Sign in to access your developer profile." : "Hire the best developers on TopDevs."}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded">
              {error}
            </div>
          )}

          {authModalMode === "user-login" && renderUserLogin()}
          {authModalMode === "user-register" && renderUserRegister()}
          {authModalMode === "company-login" && renderCompLogin()}
          {authModalMode === "company-register" && renderCompRegister()}
        </div>

        {/* Toggle User/Company */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          {authModalMode.startsWith("user") ? (
            <button onClick={() => openAuthModal("company-login")} className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-1.5 w-full">
              <Building2 size={14} /> Switch to Company Portal
            </button>
          ) : (
            <button onClick={() => openAuthModal("user-login")} className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-1.5 w-full">
              <User size={14} /> Switch to Developer Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
