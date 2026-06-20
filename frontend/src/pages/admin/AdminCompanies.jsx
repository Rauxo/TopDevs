import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Building2, Clock, ShieldCheck, Mail, Phone, MapPin, FileText, ExternalLink, Ban, Eye } from "lucide-react";
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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Management</h1>
        <p className="text-slate-500 font-medium">Verify credentials and manage corporate partnerships</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Company Table */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Company</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="3" className="px-6 py-20 text-center text-slate-500 text-sm font-bold">Synchronizing corporate data...</td></tr>
                  ) : companies.map((comp) => (
                    <tr key={comp._id} className={`hover:bg-slate-50 transition-colors ${selectedCompany?._id === comp._id ? "bg-blue-50/50" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={`http://localhost:5000/${comp.companyIcon}`} className="w-10 h-10 rounded object-cover border border-slate-200 bg-slate-50" alt="icon" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{comp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {comp.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide rounded border border-slate-200">
                            <ShieldCheck size={11} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white text-amber-700 text-[10px] font-bold uppercase tracking-wide rounded border border-amber-200">
                            <Clock size={11} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 items-center">
                          <button
                            onClick={() => setSelectedCompany(comp)}
                            className="p-2 bg-white border border-slate-200 rounded text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleBlock(comp._id)}
                            className={`p-2 border rounded transition-all cursor-pointer ${comp.isVerified ? "bg-white border-slate-200 text-red-400 hover:bg-red-50" : "bg-white border-slate-200 text-blue-500 hover:bg-blue-50"}`}
                            title={comp.isVerified ? "Block Company" : "Unblock/Verify"}
                          >
                            <Ban size={16} />
                          </button>
                        </div>
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
            <div className="bg-white border border-slate-200 rounded p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <img src={`http://localhost:5000/${selectedCompany.companyIcon}`} className="w-14 h-14 rounded object-cover border border-slate-200 bg-slate-50" alt="logo" />
                <div className="overflow-hidden">
                  <h3 className="text-lg font-black text-slate-900 truncate">{selectedCompany.name}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${selectedCompany.isVerified ? "text-blue-600" : "text-amber-600"}`}>
                    {selectedCompany.isVerified ? "Authenticated Partner" : "Verification Required"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-blue-600 shrink-0" />
                  <span className="text-sm font-medium break-all">{selectedCompany.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-blue-600 shrink-0" />
                  <span className="text-sm font-medium">{selectedCompany.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium leading-relaxed">{selectedCompany.address}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <FileText size={12} /> Legal Documentation
                </h4>
                <a
                  href={`http://localhost:5000/${selectedCompany.legalDocument}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 text-blue-600 rounded border border-slate-200 hover:border-blue-200 transition-all no-underline font-bold text-sm"
                >
                  View Documents <ExternalLink size={16} />
                </a>
              </div>

              {!selectedCompany.isVerified && (
                <button
                  onClick={() => handleVerify(selectedCompany._id)}
                  disabled={actionLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50 mb-3 text-sm"
                >
                  {actionLoading ? "Processing..." : (
                    <>Approve & Verify <ShieldCheck size={18} /></>
                  )}
                </button>
              )}

              <button
                onClick={() => setSelectedCompany(null)}
                className="w-full py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded transition-colors border border-slate-200 bg-white cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center p-12 text-center text-slate-400 min-h-[300px]">
              <Building2 size={40} className="mb-4 text-slate-300" />
              <p className="font-bold text-sm text-slate-500">Select a company</p>
              <p className="text-xs mt-1 text-slate-400">Click the eye icon to inspect credentials</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanies;
