import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { User, Trash2, Search } from "lucide-react";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage student accounts and permissions</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded outline-none focus:border-blue-600 transition-all font-medium text-sm text-slate-900"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-white">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Student Profile</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Email Address</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 text-sm font-bold">Loading student data...</td></tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={`http://localhost:5000/${user.profileImg}`} className="w-10 h-10 rounded object-cover border border-slate-200 bg-slate-50" alt="profile" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.username}</p>
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Active Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all border-none bg-transparent cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 text-sm font-bold">No students found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
