import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Search, ArrowRight } from "lucide-react";
import API from "../../API/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get("/company/all");
        setCompanies(res.data.companies);
      } catch (err) {
        console.error("Error fetching companies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Explore Companies</h1>
            <p className="text-slate-600">Discover top companies hiring on TopDevs</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search companies by name or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div key={company._id} className="bg-white rounded p-6 border border-slate-200 hover:border-blue-600 transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  {company.companyIcon ? (
                    <img 
                      src={`http://localhost:5000/${company.companyIcon}`} 
                      alt={company.name} 
                      className="w-14 h-14 rounded object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  {company.isVerified && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">Verified</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{company.name}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                  {company.about || "Innovation and excellence at the heart of everything we do."}
                </p>

                <div className="flex items-center gap-2 text-slate-500 mb-6">
                  <MapPin size={16} className="shrink-0" />
                  <span className="text-sm truncate">{company.address}</span>
                </div>

                <Link 
                  to={`/company/profile/${company._id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-white text-slate-900 border border-slate-300 font-bold text-sm rounded hover:bg-slate-50 hover:border-slate-400 transition-colors no-underline mt-auto"
                >
                  View Profile <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded border border-slate-200">
            <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-bold text-slate-600">No companies found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
