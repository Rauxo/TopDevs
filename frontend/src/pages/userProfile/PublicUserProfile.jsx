import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap, MessageSquare, FolderGit2, Link as LinkIcon, X } from "lucide-react";
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
                <h1 className="text-2xl font-light text-slate-800">
                  {user.username}
                </h1>
                <UserLevelTick level={user.profileLevel || 1} size={24} />
              </div>
              <div className="flex gap-2 justify-center">
                {company && (
                  <button
                    onClick={handleMessage}
                    className="px-6 py-1.5 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors border-none cursor-pointer shadow-lg shadow-emerald-50"
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
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12">
          <div className="flex justify-center -mt-px">
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-t border-emerald-600 text-emerald-600">
              <FolderGit2 size={14} /> Projects
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-8">
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

        {/* Learning Progress Section */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
            <GraduationCap size={16} className="text-emerald-500" /> Learning
            Progress
          </h2>
          {user.selectedLanguages?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.selectedLanguages.map((sl, index) => (
                <div
                  key={index}
                  className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">
                      {sl.language?.name || "Language"}
                    </h3>
                    <span className="text-emerald-600 font-black text-sm">
                      {sl.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${sl.progress}%` }}
                    ></div>
                  </div>
                  {sl.completionDate && (
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      Completed in{" "}
                      {Math.ceil(
                        (new Date(sl.completionDate) - new Date(sl.startDate)) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <p className="text-slate-400 italic">
                No learning progress to show.
              </p>
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
    </div>
  );
};

export default PublicUserProfile;
