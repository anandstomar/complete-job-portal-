import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaDownload,
  FaUserCircle,
  FaEye,
  FaSearch,
  FaBell,
  FaFileExport,
  FaArrowLeft
} from 'react-icons/fa';
import { listApplications } from "../lib/api";

const JobApplication = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    listApplications().then(res => setApplications(res.data)).catch(() => setApplications([]));
  }, []);

  // Ensure 'Rejected' is always present in the status filter and metrics
  const allStatuses = Array.from(
    new Set([
      ...applications.flatMap(app =>
        app.history && app.history.length > 0
          ? [app.history[app.history.length - 1].status]
          : []
      ),
      'Rejected' // Always include 'Rejected'
    ])
  );

  // Dynamically build status counts
  const statusCounts = {};
  allStatuses.forEach(status => {
    statusCounts[status] = applications.filter(app => {
      const latest = app.history && app.history.length > 0 ? app.history[app.history.length - 1] : null;
      return latest && latest.status === status;
    }).length;
  });

  // --- Filtering logic ---
  const filteredApplications = applications
    .filter(app => {
      const searchLower = search.toLowerCase();
      return (
        (app.applicantName && app.applicantName.toLowerCase().includes(searchLower)) ||
        (app.applicantEmail && app.applicantEmail.toLowerCase().includes(searchLower)) ||
        (app.jobTitle && app.jobTitle.toLowerCase().includes(searchLower))
      );
    })
    .filter(app => {
      if (statusFilter === 'All Status') return true;
      const latest = app.history && app.history.length > 0 ? app.history[app.history.length - 1] : null;
      return latest && latest.status === statusFilter;
    });

  // --- Export handler ---
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filteredApplications, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft className="w-3 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 w-full md:w-1/2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <FaBell className="text-gray-600 text-xl cursor-pointer" />
          <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-gray-500">Manage job postings and track applications</p>
        </div>

        {/* Export Button */}
        <button
          className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded hover:bg-green-200 font-medium shadow"
          onClick={handleExport}
        >
          <FaFileExport /> Export Data
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2  md:grid-cols-5 gap-4 mb-6">
        {allStatuses.map((status, idx) => (
          <div key={status} className="bg-white shadow shadow-gray-500 rounded-lg p-4 text-center">
            <h4 className={`text-xl font-bold ${
              status === 'New' ? 'text-blue-600' :
              status === 'Reviewed' ? 'text-yellow-600' :
              status === 'Interview' ? 'text-purple-600' :
              status === 'Hired' ? 'text-green-600' :
              status === 'Rejected' ? 'text-red-600' :
              'text-gray-700'
            }`}>{statusCounts[status] || 0}</h4>
            <p className="text-gray-500 text-sm">{status}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
     <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
  
  {/* Search Bar (Left) */}
  <div className="w-full sm:w-1/2">
    <div className="flex ml-20 items-center border border-gray-300 rounded-xl px-3 py-2">
      <FaSearch className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full outline-none text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
    <div className="w-full sm:w-40">
    <select
      className="border border-gray-300 w-full px-3 py-2 rounded-lg text-sm"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option>All Status</option>
      {allStatuses.map(status => (
        <option key={status}>{status}</option>
      ))}
    </select>
  </div>
      </div>

      {/* Application Cards */}
      {filteredApplications.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No applications found.</div>
      ) : (
        filteredApplications.map(app => {
          const latestHistory = app.history && app.history.length > 0 ? app.history[app.history.length - 1] : null;
          return (
            <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-6 relative mb-6 shadow-sm">
              <div className="absolute top-4 right-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  latestHistory?.status === 'New' ? 'bg-blue-100 text-blue-600' :
                  latestHistory?.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-800' :
                  latestHistory?.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                  latestHistory?.status === 'Hired' ? 'bg-green-100 text-green-700' :
                  latestHistory?.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {latestHistory?.status || 'N/A'}
                </span>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{app.applicantName}</h2>
                  <p className="text-gray-600">{app.jobTitle} at {app.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1"><FaEnvelope /> {app.applicantEmail}</span>
                    <span className="flex items-center gap-1"><FaPhoneAlt /> {app.applicantPhone}</span>
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {app.applicantLocation}</span>
                    {latestHistory?.experience && (
                      <span className="flex items-center gap-1"><FaBriefcase /> {latestHistory.experience}</span>
                    )}
                    <span className="flex items-center gap-1"><FaCalendarAlt /> Applied {app.appliedDate ? new Date(app.appliedDate).toLocaleString() : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {app.skills && app.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 text-sm bg-gray-100 rounded-full text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                    <button className="flex items-center gap-1 text-sm border border-gray-400  px-3 py-1 rounded hover:bg-gray-100">
                      <FaEye /> View Profile
                    </button>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
                        <FaDownload /> Resume
                      </a>
                    )}
                    <button className="flex items-center gap-1 text-sm border  border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
                      <FaEnvelope /> Contact
                    </button>
                    <select className="border  border-gray-400 text-sm px-3 py-1 rounded cursor-pointer">
                      <option>{latestHistory?.status === 'New' ? 'Hired' : 'Change status'}</option>
                      <option>New</option>
                      <option>Reviewed</option>
                      <option>Interview</option>
                      <option>Hired</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  {app.coverLetter && (
                    <div className="mt-2 text-sm text-gray-700"><b>Cover Letter:</b> {app.coverLetter}</div>
                  )}
                  {app.bio && (
                    <div className="mt-2 text-sm text-gray-700"><b>Bio:</b> {app.bio}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default JobApplication;
