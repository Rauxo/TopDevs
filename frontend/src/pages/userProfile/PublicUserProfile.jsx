import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap, MessageSquare, FolderGit2, Link as LinkIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import UserLevelTick from "../../components/UserLevelTick";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const PublicUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [fullScreenGallery, setFullScreenGallery] = useState({ images: [], currentIndex: 0, isOpen: false });
  const { company } = React.useContext(AuthContext);

  const handleMessage = async () => {
    if (!company)
      return alert("Only companies can message developers directly");
    try {
      await API.post("/message/send", {
        receiverId: user._id,
        receiverType: "User",
        text: `Hi ${user.username}, we viewed your profile and would like to connect!`,
      });
      navigate("/company/dashboard", { state: { activeTab: "messages" } });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get(`/auth/public-profile/${id}`);
        setUser(res.data.user);
        
        const projRes = await API.get(`/project/user/${id}`);
        setProjects(projRes.data.projects);
      } catch (err) {
        console.error("Error fetching user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!user) return <div className="text-center py-20">User not found.</div>;

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
                {company && (
                  <button
                    onClick={handleMessage}
                    className="px-6 py-1.5 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-700 transition-colors border-none cursor-pointer shadow-blue-50"
                  >
                    <MessageSquare size={16} className="inline mr-2" /> Message
                    Developer
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <p className="text-blue-900 text-sm font-medium">
                Developer Profile • Level {user.profileLevel || 1} •{" "}
                {user.points || 0} Points
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">
                Member since {new Date(user.createdAt).getFullYear()}
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

        <div className="border-t border-slate-200 mt-12">
          <div className="flex justify-start">
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest text-slate-900">
              <FolderGit2 size={14} className="text-blue-600" /> Projects
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-4">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div key={proj._id} className="border border-slate-200 rounded bg-white hover:border-blue-600 transition-colors overflow-hidden flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-100 group cursor-pointer border-b border-slate-100" onClick={() => setFullScreenGallery({ images: proj.images.map(img => `http://localhost:5000/${img}`), currentIndex: 0, isOpen: true })}>
                      <img src={`http://localhost:5000/${proj.images[0]}`} alt={proj.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      {proj.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded flex items-center gap-1">
                          +{proj.images.length - 1}
                        </div>
                      )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-bold text-base text-slate-900 mb-1">{proj.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 flex-1">{proj.description}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 hover:border-blue-200 transition-colors">
                        <FolderGit2 size={14} /> Code
                      </a>
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded border border-blue-100 transition-colors">
                          <LinkIcon size={14} /> Live Demo
                        </a>
                      )}
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
              <p className="text-slate-500 text-sm font-medium">No projects showcased yet.</p>
            </div>
          )}
        </div>


      </div>
      
      {/* Full Screen Image Viewer */}
      {fullScreenGallery.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullScreenGallery({ ...fullScreenGallery, isOpen: false })}>
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
    </div>
  );
};

export default PublicUserProfile;
