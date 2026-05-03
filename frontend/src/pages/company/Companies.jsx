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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Explore Companies</h1>
            <p className="text-slate-500 font-medium">Discover top companies hiring on TopDev</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search companies by name or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <div key={company._id} className="group bg-white rounded-[32px] p-8 border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-50 transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  {company.companyIcon ? (
                    <img 
                      src={`http://localhost:5000/${company.companyIcon}`} 
                      alt={company.name} 
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-2xl">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  {company.isVerified && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Verified</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{company.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                  {company.about || "Innovation and excellence at the heart of everything we do."}
                </p>

                <div className="flex items-center gap-2 text-slate-400 mb-8">
                  <MapPin size={16} className="shrink-0" />
                  <span className="text-xs font-bold truncate">{company.address}</span>
                </div>

                <Link 
                  to={`/company/profile/${company._id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-700 font-black text-[11px] uppercase tracking-widest rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all no-underline"
                >
                  View Profile <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <Building2 size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-xl font-bold text-slate-400">No companies found</p>
            <p className="text-slate-300">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
