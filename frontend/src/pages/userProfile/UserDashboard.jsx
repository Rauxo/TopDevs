import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ClipboardList, FolderGit2, Zap, CheckCircle2, MessageSquare, Plus, X, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../API/api";
import UserLevelTick from "../../components/UserLevelTick";
import { GraduationCap } from "lucide-react";
import AddProjectModal from "../../components/AddProjectModal";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "projects");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fullScreenGallery, setFullScreenGallery] = useState({ images: [], currentIndex: 0, isOpen: false });

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/project/user/${user._id}`);
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/job/my-applications");
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-emerald-500 to-cyan-500">
              <div className="w-full h-full rounded-full p-1 bg-white">
                <img
                  src={`http://localhost:5000/${user.profileImg}`}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-light text-slate-800">{user.username}</h1>
                <UserLevelTick level={user.profileLevel || 1} size={24} />
              </div>
              <div className="flex gap-2 justify-center">
                <Link 
                  to="/edit-profile"
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-lg transition-colors no-underline"
                >
                  Edit Profile
                </Link>
                <button onClick={handleLogout} className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">{applications.length}</span> <span className="text-slate-500">applications</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">{user.points || 0}</span> <span className="text-slate-500">points</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">Level {user.profileLevel || 1}</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200">
          <div className="flex justify-center gap-8 md:gap-12 -mt-px flex-wrap">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "projects" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <FolderGit2 size={14} /> Projects
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "active" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <Zap size={14} /> Active Applications
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "status" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <CheckCircle2 size={14} /> Application Status
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "messages" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <MessageSquare size={14} /> Messages
            </button>
            <button
              onClick={() => setActiveTab("learning")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "learning" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <GraduationCap size={14} /> Learning
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "projects" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Your Projects</h3>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <div key={proj._id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-video relative overflow-hidden bg-slate-100 group cursor-pointer" onClick={() => setFullScreenImage(`http://localhost:5000/${proj.images[0]}`)}>
                           <img src={`http://localhost:5000/${proj.images[0]}`} alt={proj.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                           {proj.images.length > 1 && (
                             <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1">
                               +{proj.images.length - 1} more
                             </div>
                           )}
                        </div>
                        <div className="p-5">
                          <h4 className="font-bold text-lg text-slate-800 mb-2">{proj.title}</h4>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{proj.description}</p>
                          <div className="flex items-center gap-3">
                            <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-emerald-600">
                              <FolderGit2  size={16} /> GitHub
                            </a>
                            {proj.liveLink && (
                              <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                                <LinkIcon size={16} /> Live Demo
                              </a>
                            )}
                          </div>
                          
                          {proj.images.length > 1 && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                               {proj.images.map((img, idx) => (
                                 <img 
                                   key={idx} 
                                   src={`http://localhost:5000/${img}`} 
                                   alt="thumbnail" 
                                   className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                                   onClick={(e) => { e.stopPropagation(); setFullScreenImage(`http://localhost:5000/${img}`); }}
                                 />
                               ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <div className="text-slate-300 mb-4 flex justify-center">
                      <FolderGit2 size={48} />
                    </div>
                    <p className="text-slate-400 italic">No projects showcased yet.</p>
                  </div>
                )}
             </div>
          )}

          {(activeTab === "active" || activeTab === "status") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-10">Loading applications...</div>
              ) : (activeTab === "active" ? applications.filter(a => !a.status || a.status === "Applied" || a.status === "Pending") : applications).length > 0 ? (
                (activeTab === "active" ? applications.filter(a => !a.status || a.status === "Applied" || a.status === "Pending") : applications).map((app) => (
                  <div key={app._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-base">{app.job?.jobTitle}</h3>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                        app.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
                        app.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status || "Applied"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {app.job?.company?.companyIcon ? (
                        <img 
                          src={`http://localhost:5000/${app.job.company.companyIcon}`} 
                          alt="company" 
                          className="w-5 h-5 rounded object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                          {app.job?.company?.name?.charAt(0) || "J"}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-500">{app.job?.company?.name || "Unknown Company"}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 mb-4">{new Date(app.createdAt).toLocaleDateString()}</p>
                    
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Zap size={14} className="text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">{app.job?.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-300 flex flex-col items-center">
                  <div className="mb-4">
                    <ClipboardList size={64} />
                  </div>
                  <p className="text-xl font-light">No applications found</p>
                  {activeTab === "active" && (
                    <button onClick={() => navigate("/jobs")} className="mt-4 text-emerald-600 font-bold text-sm hover:underline">Find your first job</button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <div className="text-emerald-500/30 mb-6 flex justify-center">
                <MessageSquare size={64} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Private Messaging</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Access your secure conversations in the dedicated messaging portal.</p>
              <Link 
                to="/messages"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 no-underline"
              >
                Open Messages
              </Link>
            </div>
          )}

          {activeTab === "learning" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.selectedLanguages?.length > 0 ? (
                user.selectedLanguages.map((sl, index) => (
                  <div key={index} className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 p-2 flex items-center justify-center">
                          <GraduationCap size={20} className="text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-slate-900">{sl.language?.name || "Language Progress"}</h3>
                      </div>
                      <span className="text-emerald-600 font-black text-sm">{sl.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sl.progress}%` }}></div>
                    </div>
                    <div className="mt-4 flex flex-col gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <div className="flex justify-between items-center">
                        <span>Started: {new Date(sl.startDate).toLocaleDateString()}</span>
                        {sl.completionDate ? (
                          <span className="text-emerald-500">
                            Completed in {Math.ceil((new Date(sl.completionDate) - new Date(sl.startDate)) / (1000 * 60 * 60 * 24))} days
                          </span>
                        ) : (
                          <Link to="/learn" className="text-emerald-600 no-underline hover:underline">Continue</Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <GraduationCap size={48} className="text-slate-300 mb-4 mx-auto" />
                  <p className="text-slate-400">No languages selected yet.</p>
                  <Link to="/learn" className="mt-4 inline-block text-emerald-600 font-bold hover:underline">Start Learning</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Full Screen Image Viewer */}
      {fullScreenGallery.isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullScreenGallery({ ...fullScreenGallery, isOpen: false })}>
          <button className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors p-2 bg-black/50 rounded-full z-10" onClick={() => setFullScreenGallery({ ...fullScreenGallery, isOpen: false })}>
            <X size={24} />
          </button>
          
          {fullScreenGallery.images.length > 1 && (
            <button 
              className="absolute left-4 md:left-10 text-white hover:text-slate-300 transition-colors p-2 md:p-4 bg-black/50 rounded-full z-10" 
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenGallery(prev => ({ 
                  ...prev, 
                  currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1 
                }));
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img src={fullScreenGallery.images[fullScreenGallery.currentIndex]} alt="Full screen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative z-0" onClick={(e) => e.stopPropagation()} />

          {fullScreenGallery.images.length > 1 && (
            <button 
              className="absolute right-4 md:right-10 text-white hover:text-slate-300 transition-colors p-2 md:p-4 bg-black/50 rounded-full z-10" 
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenGallery(prev => ({ 
                  ...prev, 
                  currentIndex: prev.currentIndex === prev.images.length - 1 ? 0 : prev.currentIndex + 1 
                }));
              }}
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onProjectAdded={fetchProjects} 
      />
    </div>
  );
}

export default UserDashboard;
