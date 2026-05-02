import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../API/api";
import Layout from "../Layout/Layout";

const Search = () => {
  const [results, setResults] = useState({ users: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Assuming we have a search endpoint or we search manually
      // For now, let's fetch all jobs and filter, and maybe we need a user search endpoint
      const jobRes = await API.get("/job/all");
      const filteredJobs = jobRes.data.jobs.filter(job => 
        job.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
        job.company?.name.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      );
      
      // Placeholder for user search
      setResults({ users: [], jobs: filteredJobs });
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">
          Search results for "{query}"
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Jobs Results */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>💼</span> Jobs ({results.jobs.length})
              </h2>
              {results.jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.jobs.map((job) => (
                    <Link
                      to={`/jobs/${job._id}`}
                      key={job._id}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all no-underline text-inherit"
                    >
                      <h3 className="font-bold text-slate-900 mb-1">{job.jobTitle}</h3>
                      <p className="text-xs text-slate-500 mb-4">{job.company?.name}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                        <span className="text-xs text-slate-400">{job.location}</span>
                        <span className="text-xs font-bold text-emerald-600">View →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No jobs found matching "{query}"</p>
              )}
            </section>

            {/* User Results Placeholder */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>👤</span> Users
              </h2>
              <p className="text-slate-500 italic">User search is coming soon!</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
