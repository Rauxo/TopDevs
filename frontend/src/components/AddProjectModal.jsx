import React, { useState } from "react";
import { X, Upload, Plus, Link as LinkIcon, FolderGit2  } from "lucide-react";
import API from "../API/api";

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files]);
    setError("");
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }
    if (!githubLink) {
        setError("GitHub link is required");
        return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("liveLink", liveLink);
    formData.append("githubLink", githubLink);
    images.forEach((img) => formData.append("images", img));

    try {
      await API.post("/project", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onProjectAdded();
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setLiveLink("");
      setGithubLink("");
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.message || "Error adding project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">Add New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="E.g., E-commerce Platform"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe your project, technologies used, and your role..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Live Link (Optional)</label>
              <div className="relative">
                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">GitHub Repo (Required)</label>
              <div className="relative">
                <FolderGit2  size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  required
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Project Images (Min 1, Max 5)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-slate-500">{images.length}/5 images uploaded</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Saving..." : <><Plus size={18} /> Add Project</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
