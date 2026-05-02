import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { Link } from "react-router-dom";
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/job/all");
        setJobs(res.data.jobs);
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

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find Your Dream Job</h1>
            <p className="text-lg text-slate-600">Browse through hundreds of opportunities from top tech companies.</p>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
              Search
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Link
                    to={`/jobs/${job._id}`}
                    key={job._id}
                    className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all no-underline text-inherit"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {job.company?.companyIcon ? (
                        <img
                          src={`http://localhost:5000/${job.company.companyIcon}`}
                          alt={job.company.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                          {job.company?.name ? job.company.name.charAt(0) : "J"}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {job.jobTitle}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">{job.company?.name || "Unknown Company"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                        📍 {job.location}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                        💼 {job.jobType || "Full-time"}
                      </span>
                      {job.salary && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                          💰 {job.salary}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 mb-6">
                      {job.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xs text-slate-400 font-medium">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                        Apply Now →
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-500">
                  No jobs found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
