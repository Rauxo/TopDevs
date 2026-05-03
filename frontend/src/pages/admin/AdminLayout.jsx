import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "User Management", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Company Management", path: "/admin/companies", icon: <Building2 size={20} /> },
    { label: "Job Moderation", path: "/admin/jobs", icon: <Briefcase size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-slate-900 hidden lg:flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <span className="text-white font-black text-xl tracking-tight">Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all no-underline ${
                location.pathname === item.path 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-2xl transition-all border-none bg-transparent cursor-pointer"
          >
            <LogOut size={20} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-40">
           <div className="flex items-center gap-3 text-white">
             <ShieldCheck className="text-emerald-500" size={24} />
             <span className="font-bold uppercase tracking-widest text-xs">Admin Console</span>
           </div>
           <button onClick={() => setMobileOpen(true)} className="p-2 text-white bg-white/10 rounded-lg">
             <Menu size={24} />
           </button>
        </header>

        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-80 bg-slate-900 p-6 flex flex-col animate-slide-right">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3 text-white">
                 <ShieldCheck className="text-emerald-500" size={32} />
                 <span className="font-black text-xl">Console</span>
               </div>
               <button onClick={() => setMobileOpen(false)} className="text-white p-2">
                 <X size={24} />
               </button>
             </div>
             <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold no-underline ${
                      location.pathname === item.path 
                        ? "bg-emerald-600 text-white" 
                        : "text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
             </nav>
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-400 font-bold text-sm bg-red-500/10 rounded-2xl border-none cursor-pointer">
               <LogOut size={20} /> Logout
             </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
