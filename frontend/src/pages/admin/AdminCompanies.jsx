import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Building2, CheckCircle2, XCircle, Eye, ShieldCheck, Mail, Phone, MapPin, FileText, ExternalLink, Ban } from "lucide-react";
import API from "../../API/api";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await API.get("/admin/companies");
      setCompanies(res.data.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(true);
    try {
      await API.put(`/admin/company/verify/${id}`);
      alert("Company verified and notification email sent!");
      fetchCompanies();
      setSelectedCompany(null);
    } catch (err) {
      alert("Verification failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async (id) => {
    if (window.confirm("Are you sure you want to change this company's status?")) {
      try {
        await API.put(`/admin/company/block/${id}`);
        fetchCompanies();
      } catch (err) {
        alert("Operation failed");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Management</h1>
        <p className="text-slate-500 font-medium">Verify credentials and manage corporate partnerships</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Company List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {loading ? (
                     <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-400 italic">Synchronizing corporate data...</td></tr>
                   ) : companies.map((comp) => (
                     <tr key={comp._id} className={`hover:bg-slate-50/50 transition-colors group ${selectedCompany?._id === comp._id ? "bg-emerald-50/30" : ""}`}>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                             <img src={`http://localhost:5000/${comp.companyIcon}`} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="icon" />
                             <div>
                               <p className="font-bold text-slate-800 text-sm">{comp.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{comp.email}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           {comp.isVerified ? (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                               <ShieldCheck size={12} /> Verified
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                               <Clock size={12} /> Pending
                             </span>
                           )}
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                           <button 
                             onClick={() => setSelectedCompany(comp)}
                             className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer"
                             title="View Details"
                           >
                             <Eye size={18} />
                           </button>
                           <button 
                             onClick={() => handleBlock(comp._id)}
                             className={`p-2.5 border rounded-xl transition-all cursor-pointer ${comp.isVerified ? "bg-white border-slate-200 text-red-400 hover:bg-red-50" : "bg-white border-slate-200 text-emerald-400 hover:bg-emerald-50"}`}
                             title={comp.isVerified ? "Block Company" : "Unblock/Verify"}
                           >
                             <Ban size={18} />
                           </button>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="xl:col-span-1">
          {selectedCompany ? (
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl sticky top-8">
              <div className="flex items-center gap-6 mb-10">
                <img src={`http://localhost:5000/${selectedCompany.companyIcon}`} className="w-20 h-20 rounded-3xl object-cover border-2 border-white/10" alt="logo" />
                <div>
                  <h3 className="text-2xl font-black">{selectedCompany.name}</h3>
                  <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">
                    {selectedCompany.isVerified ? "Authenticated Partner" : "Verification Required"}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">{selectedCompany.email}</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-400">
                    <Phone size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">{selectedCompany.phone}</span>
                 </div>
                 <div className="flex items-start gap-3 text-slate-400">
                    <MapPin size={18} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium leading-relaxed">{selectedCompany.address}</span>
                 </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  <FileText size={14} /> Legal Documentation
                </h4>
                <a 
                  href={`http://localhost:5000/${selectedCompany.legalDocument}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-2xl transition-all no-underline font-bold text-sm border border-emerald-500/20"
                >
                  Verify Documents <ExternalLink size={18} />
                </a>
              </div>

              {!selectedCompany.isVerified && (
                <button 
                  onClick={() => handleVerify(selectedCompany._id)}
                  disabled={actionLoading}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : (
                    <>Approve & Verify Company <ShieldCheck size={20} /></>
                  )}
                </button>
              )}
              
              <button 
                onClick={() => setSelectedCompany(null)}
                className="w-full mt-4 py-4 text-slate-500 font-bold text-sm hover:text-white transition-colors border-none bg-transparent cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          ) : (
            <div className="h-full bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center text-slate-400">
               <Building2 size={64} className="mb-6 text-slate-300" />
               <p className="font-bold text-lg">Select a company</p>
               <p className="text-sm max-w-[200px]">Click the eye icon to inspect credentials and documents</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanies;
