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
  X,
  CreditCard,
  GraduationCap
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "User Management", path: "/admin/users", icon: <Users size={18} /> },
    { label: "Company Management", path: "/admin/companies", icon: <Building2 size={18} /> },
    { label: "Job Moderation", path: "/admin/jobs", icon: <Briefcase size={18} /> },
    { label: "Subscription Plans", path: "/admin/plans", icon: <CreditCard size={18} /> },
    { label: "Learning Center", path: "/admin/learning", icon: <GraduationCap size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    window.location.reload(); // Reloads to trigger AdminProtectedRoute login screen
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-slate-900 text-base">Admin Console</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold transition-colors no-underline ${
                  location.pathname === item.path 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-slate-900 font-bold text-sm hover:bg-slate-200 rounded transition-colors border border-slate-300 bg-white cursor-pointer"
          >
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
           <div className="flex items-center gap-3 text-slate-900">
             <ShieldCheck className="text-blue-600" size={24} />
             <span className="font-bold uppercase tracking-widest text-xs">Admin Console</span>
           </div>
           <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-600 bg-slate-50 border border-slate-200 rounded cursor-pointer">
             <Menu size={20} />
           </button>
        </header>

        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col animate-slide-right">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3 text-slate-900">
                 <ShieldCheck className="text-blue-600" size={28} />
                 <span className="font-bold text-base">Console</span>
               </div>
               <button onClick={() => setMobileOpen(false)} className="text-slate-500 p-2 border-none bg-transparent cursor-pointer">
                 <X size={20} />
               </button>
             </div>
             <nav className="space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-bold no-underline ${
                      location.pathname === item.path 
                        ? "bg-slate-900 text-white" 
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
             </nav>
             <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-900 font-bold text-sm bg-white border border-slate-300 rounded cursor-pointer mt-auto">
               <LogOut size={18} /> Logout
             </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
