import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { User, Mail, Trash2, Search, Filter } from "lucide-react";
import API from "../../API/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await API.delete(`/admin/user/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage student accounts and permissions</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Profile</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">Loading student data...</td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={`http://localhost:5000/${user.profileImg}`} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" alt="profile" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{user.username}</p>
                          <p className="text-[10px] text-blue-600 font-black uppercase">Active Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600 font-medium">{user.email}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">No students found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
