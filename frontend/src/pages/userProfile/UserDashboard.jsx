import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ClipboardList,
  FolderGit2,
  Zap,
  CheckCircle2,
  MessageSquare,
  Plus,
  X,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import API from "../../API/api";
import UserLevelTick from "../../components/UserLevelTick";
import { GraduationCap } from "lucide-react";
import AddProjectModal from "../../components/AddProjectModal";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "projects",
  );
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fullScreenGallery, setFullScreenGallery] = useState({
    images: [],
    currentIndex: 0,
    isOpen: false,
  });

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

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/project/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project", err);
      alert("Failed to delete project. Please try again.");
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
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-500">
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
                <h1 className="text-2xl font-light text-slate-800">
                  {user.username}
                </h1>
                <UserLevelTick level={user.profileLevel || 1} size={24} />
              </div>
              <div className="flex gap-2 justify-center">
                <Link
                  to="/edit-profile"
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded transition-colors no-underline"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">
                  {applications.length}
                </span>{" "}
                <span className="text-slate-500">applications</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">
                  {user.points || 0}
                </span>{" "}
                <span className="text-slate-500">points</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">
                  Level {user.profileLevel || 1}
                </span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">
                {user.email}
              </p>

              {user.selectedLanguages?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {user.selectedLanguages.map((sl, index) => {
                    const radius = 16;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (sl.progress / 100) * circumference;
                    return (
                      <div key={index} className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-2 rounded">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <svg className="transform -rotate-90 w-10 h-10">
                            <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                            <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="text-blue-600 transition-all duration-1000 ease-in-out" />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-slate-800">{sl.progress}%</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sl.language?.name}</p>
                          {sl.completionDate && (
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                              {Math.ceil((new Date(sl.completionDate) - new Date(sl.startDate)) / (1000 * 60 * 60 * 24))} Days
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200">
          <div className="flex justify-center gap-8 md:gap-12 -mt-px flex-wrap">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "projects"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              <FolderGit2 size={14} /> Projects
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "active"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              <Zap size={14} /> Active Applications
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "status"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              <CheckCircle2 size={14} /> Application Status
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "messages"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400"
              }`}
            >
              <MessageSquare size={14} /> Messages
            </button>

          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Your Projects
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj._id}
                      className="border border-slate-200 rounded bg-white hover:border-blue-600 transition-colors overflow-hidden flex flex-col"
                    >
                      <div
                        className="aspect-video relative overflow-hidden bg-slate-100 group cursor-pointer border-b border-slate-100"
                        onClick={() =>
                          setFullScreenGallery({
                            images: proj.images.map(
                              (img) => `http://localhost:5000/${img}`,
                            ),
                            currentIndex: 0,
                            isOpen: true,
                          })
                        }
                      >
                        <img
                          src={`http://localhost:5000/${proj.images[0]}`}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {proj.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded flex items-center gap-1">
                            +{proj.images.length - 1}
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-bold text-base text-slate-900 mb-1">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">
                          {proj.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <a
                              href={proj.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 hover:border-blue-200 transition-colors"
                            >
                              <FolderGit2 size={14} /> Code
                            </a>
                            {proj.liveLink && (
                              <a
                                href={proj.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded border border-blue-100 transition-colors"
                              >
                                <LinkIcon size={14} /> Live Demo
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteProject(proj._id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors border-none bg-transparent cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-300 mb-3 flex justify-center">
                    <FolderGit2 size={32} />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    No projects showcased yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {(activeTab === "active" || activeTab === "status") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-10">
                  Loading applications...
                </div>
              ) : (activeTab === "active"
                  ? applications.filter(
                      (a) =>
                        !a.status ||
                        a.status === "Applied" ||
                        a.status === "Pending",
                    )
                  : applications
                ).length > 0 ? (
                (activeTab === "active"
                  ? applications.filter(
                      (a) =>
                        !a.status ||
                        a.status === "Applied" ||
                        a.status === "Pending",
                    )
                  : applications
                ).map((app) => (
                  <div
                    key={app._id}
                    className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-base">
                        {app.job?.jobTitle}
                      </h3>
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                          app.status === "Accepted"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
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
                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                          {app.job?.company?.name?.charAt(0) || "J"}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-500">
                        {app.job?.company?.name || "Unknown Company"}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mb-4">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Zap size={14} className="text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">
                        {app.job?.location}
                      </span>
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
                    <button
                      onClick={() => navigate("/jobs")}
                      className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                    >
                      Find your first job
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <div className="text-blue-500/30 mb-6 flex justify-center">
                <MessageSquare size={64} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Private Messaging
              </h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Access your secure conversations in the dedicated messaging
                portal.
              </p>
              <Link
                to="/messages"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded hover:bg-blue-700 transition-all shadow-blue-600/20 no-underline"
              >
                Open Messages
              </Link>
            </div>
          )}


        </div>
      </div>

      {/* Full Screen Image Viewer */}
      {fullScreenGallery.isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() =>
            setFullScreenGallery({ ...fullScreenGallery, isOpen: false })
          }
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors p-2 bg-black/50 rounded-full z-10"
            onClick={() =>
              setFullScreenGallery({ ...fullScreenGallery, isOpen: false })
            }
          >
            <X size={24} />
          </button>

          {fullScreenGallery.images.length > 1 && (
            <button
              className="absolute left-4 md:left-10 text-white hover:text-slate-300 transition-colors p-2 md:p-4 bg-black/50 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenGallery((prev) => ({
                  ...prev,
                  currentIndex:
                    prev.currentIndex === 0
                      ? prev.images.length - 1
                      : prev.currentIndex - 1,
                }));
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img
            src={fullScreenGallery.images[fullScreenGallery.currentIndex]}
            alt="Full screen"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl relative z-0"
            onClick={(e) => e.stopPropagation()}
          />

          {fullScreenGallery.images.length > 1 && (
            <button
              className="absolute right-4 md:right-10 text-white hover:text-slate-300 transition-colors p-2 md:p-4 bg-black/50 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenGallery((prev) => ({
                  ...prev,
                  currentIndex:
                    prev.currentIndex === prev.images.length - 1
                      ? 0
                      : prev.currentIndex + 1,
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
