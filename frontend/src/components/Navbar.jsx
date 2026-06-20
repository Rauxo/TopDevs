import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../API/AuthContext";
import logo from "../assets/TopDevs.png";
import { Home, Briefcase, Building2, GraduationCap, Trophy, Terminal, LogOut, Key, Sparkles, ChevronUp, ChevronDown, Check, Search as SearchIcon } from "lucide-react";

function Navbar() {
  const { user, company, logout, companyLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const langRef = useRef(null);

  // Derive auth state
  const isAuthenticated = !!(user || company);
  const role = user?.role ?? (company ? "company" : null);
  const dashboardLink =
    role === "company"
      ? "/company/dashboard"
      : role === "admin"
      ? "/admin/dashboard"
      : "/UserDashboard";

  // Languages from user (if learner)
  const languages = user?.enrolledLanguages ?? [];

  const isEnrolled = (id) => languages.some((l) => l._id === id);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) =>
    location.pathname === path
      ? "inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold bg-black/10 text-blue-700 transition-all"
      : "inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-black/8 transition-all";

  const handleLogout = async () => {
    if (company) await companyLogout();
    else await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[999] h-[72px] bg-white/90 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-white" : ""
      }`}
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center px-6 gap-5">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 hover:opacity-85 transition-opacity">
          <img src={logo} alt="TopDevs" className="h-9 w-auto object-contain" />
        </Link>

        {/* Search — hidden on mobile */}
        <form
          className="hidden md:flex items-center flex-1 max-w-[380px] bg-white/60 rounded-xl border border-white/50 overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search username…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-11 px-4 border-none bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none font-[inherit]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="w-11 h-11 bg-[#2376ca] hover:bg-[#1d68b8] flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer"
          >
            <SearchIcon size={16} color="white" strokeWidth={2.5} />
          </button>
        </form>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1.5 flex-shrink-0 list-none">
          <li>
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className={isActive("/jobs")}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/companies" className={isActive("/companies")}>
              Companies
            </Link>
          </li>
          <li>
            <Link to="/learn" className={isActive("/learn")}>
              Learn
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className={isActive("/leaderboard")}>
              Leaderboard
            </Link>
          </li>
          <li>
            <Link to="/messages" className={isActive("/messages")}>
              Messages
            </Link>
          </li>

          {/* Languages dropdown — learner only */}
          {isAuthenticated && role === "learner" && (
            <li className="relative" ref={langRef}>
              <button
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-black/8 transition-all cursor-pointer border-none bg-transparent font-[inherit]"
                onClick={() => setShowLangDropdown((v) => !v)}
              >
                Languages{" "}
                <span className="ml-1 text-slate-500">
                  {showLangDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>
              {showLangDropdown && (
                <div className="animate-drop-in absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.14)] border border-slate-200 min-w-[220px] overflow-hidden z-[1000]">
                  {languages.length > 0 ? (
                    languages.map((lang) => (
                      <div
                        key={lang._id}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => {
                          navigate("/learning");
                          setShowLangDropdown(false);
                        }}
                      >
                        <span>{lang.name}</span>
                        {isEnrolled(lang._id) && (
                          <span className="text-blue-500"><Check size={16} /></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-slate-400 italic text-sm">
                      No languages configured
                    </div>
                  )}
                </div>
              )}
            </li>
          )}

          {isAuthenticated ? (
            <>
              <li>
                <Link to={dashboardLink} className={isActive(dashboardLink)}>
                  {role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
              </li>
              <li>
                <button
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 border-none cursor-pointer font-[inherit] transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="inline-block px-[18px] py-2 rounded-xl text-sm font-semibold text-slate-800 border-2 border-black/15 hover:bg-black/7 transition-all no-underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="inline-block px-[18px] py-2 rounded-xl text-sm font-bold text-white bg-[#2376ca] hover:bg-[#1d68b8] hover:-translate-y-px transition-all no-underline"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden flex flex-col gap-[5px] bg-none border-none cursor-pointer p-2 ml-auto rounded-lg hover:bg-black/7 transition-colors ${
            mobileOpen ? "open" : ""
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-[22px] h-[2.5px] bg-slate-800 rounded-sm transition-all duration-300 origin-center ${
              mobileOpen ? "translate-y-[7.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2.5px] bg-slate-800 rounded-sm transition-all duration-300 ${
              mobileOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2.5px] bg-slate-800 rounded-sm transition-all duration-300 origin-center ${
              mobileOpen ? "-translate-y-[7.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-slide-down absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-4 pt-3 pb-5 z-[998]">
          {/* Mobile Search */}
          <form
            className="flex items-center mb-3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search username…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-11 px-4 border-none bg-transparent text-sm text-slate-800 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              className="w-11 h-11 bg-[#2376ca] flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <SearchIcon size={16} color="white" strokeWidth={2.5} />
            </button>
          </form>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <Home size={18} /> Home
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <Briefcase size={18} /> Jobs
          </Link>
          <Link
            to="/companies"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <Building2 size={18} /> Companies
          </Link>
          <Link
            to="/learn"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <GraduationCap size={18} /> Learn
          </Link>
          <Link
            to="/leaderboard"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <Trophy size={18} /> Leaderboard
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
          >
            <MessageSquare size={18} /> Messages
          </Link>

          {isAuthenticated && role === "learner" && (
            <Link
              to="/learning"
              className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
            >
              <Terminal size={18} /> Sandbox
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardLink}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
              >
                <Terminal size={18} /> {role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
              <button
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-500 font-semibold text-[0.95rem] rounded-xl hover:bg-red-50 transition-colors cursor-pointer border-none bg-none font-[inherit] mb-0.5"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
              >
                <Key size={18} /> Login
              </Link>
              <Link
                to="/create"
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-semibold text-[0.95rem] rounded-xl hover:bg-slate-100 transition-colors mb-0.5 no-underline"
              >
                <Sparkles size={18} /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
