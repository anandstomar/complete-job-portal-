import React, { useState, useEffect } from "react";
import { X, Eye, MoreVertical, Download } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserActivity, getRoleCounts, exportUsers } from "../lib/api";

const UserManagement = ({onClose}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleCounts, setRoleCounts] = useState({"Job Seeker": 0, "Interviewer": 0, "Admin": 0});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    getUserActivity().then(res => setUsers(res.data)).catch(() => setUsers([]));
    getRoleCounts().then(res => setRoleCounts(res.data)).catch(() => setRoleCounts({"Job Seeker": 0, "Interviewer": 0, "Admin": 0}));
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Job Seeker":
        return "bg-orange-100 text-orange-600";
      case "Employer":
        return "bg-blue-100 text-blue-600";
      case "Admin":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    return status && status.toLowerCase() === "active"
      ? "bg-green-100 text-green-600"
      : "bg-gray-200 text-gray-600";
  };

  const mapRole = (role: string) => {
    if (role === "candidate") return "Job Seeker";
    if (role === "interviewer") return "Interviewer";
    if (role === "admin") return "Admin";
    return role;
  };

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All Status" || (user.status ? user.status : "N/A") === statusFilter;
    const mappedRole = mapRole(user.role);
    const matchesRole = roleFilter === "All Roles" || mappedRole === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex justify-center items-start p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft className="w-3 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg w-full max-w-7xl shadow-lg p-6 mt-10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl">
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-1">User Management</h2>
        <p className="text-gray-500 mb-6">Manage users, view profiles, and track activity</p>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border border-gray-300 rounded-md overflow-hidden mb-6 bg-gray-50">
          {[
            {tab: "all", label: <><span className="mr-2">👥</span>All Users</>},
            {tab: "activity", label: <><span className="mr-2">📅</span>User Activity</>},
            {tab: "role", label: <><span className="mr-2">🛡️</span>Role Management</>}
          ].map(({tab, label}) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full py-3 font-medium flex items-center justify-center gap-2 transition-colors duration-150 ${activeTab === tab
                ? "bg-white text-black shadow-sm border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        {activeTab === "all" && (
          <>
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <input
                type="text"
                placeholder="Search users..."
                className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select
                className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Job Seeker</option>
                <option>Interviewer</option>
              </select>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Join Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">No users found.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium`}>{mapRole(user.role)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : user.status === 'Inactive' ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>{user.status ? user.status : "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                          {user.joinDate
                            ? new Date(user.joinDate).toLocaleDateString()
                            : user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 relative">
                          <button className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 rounded mr-2 hover:bg-gray-100">
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                          <button onClick={() => toggleDropdown(user.id)} className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                            Upda <MoreVertical className="w-4 h-4 ml-1" />
                          </button>
                          {dropdownOpenId === user.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                              <ul className="text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit Profile</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Suspend</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Activate</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Recent User Activity</h3>
            {users.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No user activity found.</div>
            ) : (
              users.map((user) => {
                // Format lastLogin
                let lastLogin = "Never";
                if (user.lastLogin) {
                  const d = new Date(user.lastLogin);
                  lastLogin = d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
                }
                // Profile completion
                const profilePct = user.profilePct !== undefined && user.profilePct !== null ? user.profilePct : 0;
                const profileText = profilePct > 0 ? `${profilePct}% complete` : "Incomplete";
                return (
                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 text-base">{user.fullName || user.email}</div>
                      <div className="text-sm text-gray-500">Last login: {lastLogin}</div>
                      <div className="text-sm text-gray-500">Applications: {user.applications}</div>
                    </div>
                    <div className="space-y-1 mt-3 sm:mt-0 sm:text-right flex flex-col items-end">
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700 mb-1`}>{mapRole(user.role)}</span>
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Profile:</span> {profileText}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "role" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Role Management</h3>
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={async () => {
                  try {
                    const res = await exportUsers();
                    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'users.json';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    alert('Failed to export users');
                  }
                }}
              >
                <Download className="w-4 h-4" />
                Export Users
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">{roleCounts["Job Seeker"] || 0}</div>
                <div className="text-gray-700 font-medium">Job Seekers</div>
              </div>
              <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">{roleCounts["Interviewer"] || 0}</div>
                <div className="text-gray-700 font-medium">Interviewers</div>
              </div>
              <div className="border border-gray-300 rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">{roleCounts["Admin"] || 0}</div>
                <div className="text-gray-700 font-medium">Admins</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
