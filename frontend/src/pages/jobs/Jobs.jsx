import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { Search, Bookmark, ThumbsDown } from "lucide-react";
import JobDetailPane from "../../components/jobs/JobDetailPane";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isMobilePaneOpen, setIsMobilePaneOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/job/all");
        setJobs(res.data.jobs);
        if (res.data.jobs.length > 0) {
          setSelectedJobId(res.data.jobs[0]._id);
        }
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.jobTitle.toLowerCase().includes(filter.toLowerCase()) ||
    job.location.toLowerCase().includes(filter.toLowerCase()) ||
    job.company.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
    setIsMobilePaneOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 items-start">
        
        {/* Left Pane - Job List */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-4">
          
          <h2 className="text-xl font-bold text-slate-900 mt-2">Jobs for you</h2>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Job Cards List */}
          <div className="space-y-3 pb-20 lg:pb-0">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => handleSelectJob(job._id)}
                  className={`bg-white p-4 rounded-lg border cursor-pointer relative group
                    ${selectedJobId === job._id 
                      ? 'border-blue-600' 
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="absolute top-4 right-4 flex gap-2 text-slate-500">
                     <button className="hover:text-slate-900 transition-colors bg-transparent border-none p-1 cursor-pointer rounded hover:bg-slate-100"><Bookmark size={18} /></button>
                     <button className="hover:text-slate-900 transition-colors bg-transparent border-none p-1 cursor-pointer rounded hover:bg-slate-100"><ThumbsDown size={18} /></button>
                  </div>

                  <div className="pr-16">
                     <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-semibold rounded mb-2">
                        Easily apply
                     </span>
                     
                     <h3 className="font-bold text-base text-slate-900 mb-1 leading-tight">
                        {job.jobTitle}
                     </h3>
                     
                     <p className="text-[13px] text-slate-700">{job.company?.name || "Unknown Company"}</p>
                     <p className="text-[13px] text-slate-500 mb-2">{job.location}</p>

                     <div className="flex flex-wrap gap-2 mt-2">
                        {job.salary && (
                           <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[12px] rounded font-medium">
                              {job.salary}
                           </span>
                        )}
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[12px] rounded font-medium">
                           {job.jobType || "Full-time"}
                        </span>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200 text-sm">
                No jobs found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Desktop */}
        <div className="hidden lg:block lg:w-[55%] xl:w-[60%] sticky top-24 h-[calc(100vh-120px)] rounded-lg overflow-hidden border border-slate-200 bg-white">
          <JobDetailPane jobId={selectedJobId} />
        </div>

        {/* Right Pane - Mobile Overlay */}
        {isMobilePaneOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            <JobDetailPane jobId={selectedJobId} onClose={() => setIsMobilePaneOpen(false)} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Jobs;
