import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiPhone, FiVideo, FiChevronDown, FiPlus } from 'react-icons/fi';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { listInterviews } from "../lib/api";

const InterviewDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]); // TODO: Fetch from backend if available
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    listInterviews().then(res => setInterviews(res.data)).catch(() => setInterviews([]));
    // TODO: Fetch interviewers from backend if endpoint exists
  }, []);

  const stats = {
    scheduled: interviews.filter(interview => interview.status === "Scheduled").length,
    completed: interviews.filter(interview => interview.status === "Completed").length,
    inProgress: interviews.filter(interview => interview.status === "In Progress").length,
    cancelled: interviews.filter(interview => interview.status === "Cancelled").length,
  };

  // Helper to generate all days for a given month/year
  const getCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      days.push({
        day: weekDays[dateObj.getDay()],
        date: i
      });
    }
    return days;
  };

  // Example usage for July 2025:
  const calendarDays = getCalendarDays(2025, 6); // month is 0-indexed (6 = July)

  // Helper functions
  const renderStatusBadge = (status) => {
    const colors = {
      Scheduled: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const renderTypeIcon = (type) => {
    const icons = {
      'Video Call': <FiVideo className="text-blue-500" />,
      'Phone Call': <FiPhone className="text-green-500" />,
      'In-Person': <FiUser className="text-purple-500" />
    };
    return icons[type] || <FiCalendar className="text-gray-500" />;
  };

  // Helper to get the latest history entry (or the one you want)
  const getLatestHistory = (history = []) => {
    if (!Array.isArray(history) || history.length === 0) return null;
    return history[history.length - 1];
  };

  // Get all interview dates as ISO strings (e.g., '2025-07-15')
  const interviewDates = interviews.map(interview => {
    const latestHistory = getLatestHistory(interview.history);
    return latestHistory ? new Date(latestHistory.date).toISOString().split('T')[0] : null;
  }).filter(Boolean);

  // Group interviews by interviewer
  const interviewerMap: Record<string, { title: string; interviews: any[] }> = {};
  interviews.forEach(interview => {
    const interviewer = interview.interviewer?.fullName || interview.interviewer || "Unknown";
    if (!interviewerMap[interviewer]) {
      interviewerMap[interviewer] = {
        title: interview.interviewer?.title || "",
        interviews: []
      };
    }
    interviewerMap[interviewer].interviews.push(interview);
  });
  const interviewerList: { name: string; title: string; interviews: any[] }[] = Object.entries(interviewerMap).map(([name, data]) => ({
  name,
  title: data.title,
  interviews: data.interviews
}));

  // Filtering logic for interviews
  const filteredInterviews = interviews.filter(interview => {
    // Status filter
    if (statusFilter !== 'All Status') {
      if (interview.status !== statusFilter) return false;
    }
    // Type filter
    if (typeFilter !== 'All Types') {
      if (interview.type !== typeFilter) return false;
    }
    // Search filter
    if (searchQuery) {
      const candidateName = interview.candidate?.fullName || interview.candidate?.email || interview.candidate || '';
      const interviewerName = interview.interviewer?.fullName || interview.interviewer?.email || interview.interviewer || '';
      if (
        !candidateName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !interviewerName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
       <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="flex items-center text-sm text-gray-600 hover:text-black"
                >
                    <FaArrowLeft className="w-3 h-4 mr-2" />
                    Back to Dashboard
                </button>
            </div>
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Interview Management Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Scheduled Interviews</p>
          <p className="text-2xl font-bold">{stats.scheduled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Completed Today</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold">{stats.cancelled}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('schedule')}
        >
          Interview Schedule
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'management' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('management')}
        >
          Interviewer Management
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Interview Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search interviews..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select 
                  className="border rounded px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Cancelled</option>
                </select>
                <select 
                  className="border rounded px-3 py-2 text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Video Call</option>
                  <option>Phone Call</option>
                  <option>In-Person</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                  <FiPlus size={16} />
                  Schedule Interview
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                      <h3 className="font-semibold">{interview.candidate?.fullName || interview.candidate?.email || interview.candidate || "Unknown"}</h3>
                      <p className="text-sm text-gray-500">{interview.position}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Interviewer</p>
                      <p>{interview.interviewer?.fullName || interview.interviewer?.email || interview.interviewer || "Unknown"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Date & Time</p>
                      {(() => {
                        const latestHistory = getLatestHistory(interview.history);
                        return (
                          <p>
                            <span className="font-semibold">
                              {latestHistory
                                ? new Date(latestHistory.date).toLocaleDateString() +
                                  " " +
                                  new Date(latestHistory.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : "N/A"}
                            </span>
                          </p>
                        );
                      })()}
                    </div>
                    <div className="md:col-span-2 flex items-center">
                      {renderTypeIcon(interview.type)}
                      <span className="ml-1">{interview.type}</span>
                    </div>
                    <div className="md:col-span-1">
                      {renderStatusBadge(interview.status)}
                    </div>
                    <div className="md:col-span-1">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p>{interview.duration}</p>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button className="text-gray-400 hover:text-gray-600">
                        ⋮
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviewer Management Tab */}
        {activeTab === 'management' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Interviewer Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviewerList.map((interviewer, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{interviewer.name}</h3>
                      <p className="text-sm text-gray-500">{interviewer.title}</p>
                      <p className="text-sm mt-2">{interviewer.interviews.length} interviews scheduled</p>
                    </div>
                    <button
                      className="text-blue-600 text-sm font-medium"
                      onClick={() => setSelectedInterviewer(interviewer)}
                    >
                      View Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Popup/Modal */}
            {selectedInterviewer && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full border border-gray-200">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {selectedInterviewer.name}'s Schedule
                  </h3>
                  <hr className="mb-4 border-gray-200" />
                  <ul className="space-y-4">
                    {selectedInterviewer.interviews.map((interview, i) => (
                      <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-gray-800">
                        <span className="font-semibold text-base">{interview.candidate?.fullName || interview.candidate || "Unknown"}</span>
                        <span className="mx-2 hidden sm:inline">|</span>
                        <span className="text-sm text-gray-600">
                          {(() => {
                            const latestHistory = getLatestHistory(interview.history);
                            return latestHistory
                              ? new Date(latestHistory.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                              : "N/A";
                          })()}
                        </span>
                        <span className="mx-2 hidden sm:inline">|</span>
                        <span className={`text-sm font-medium ${interview.status === 'Cancelled' ? 'text-red-500' : interview.status === 'Completed' ? 'text-green-600' : interview.status === 'In Progress' ? 'text-yellow-600' : 'text-blue-600'}`}>{interview.status}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                    onClick={() => setSelectedInterviewer(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar View Tab */}
        {activeTab === 'calendar' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Calendar View</h2>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[1200px]">
                {calendarDays.map((day, index) => {
                  const dateString = `2025-07-${String(day.date).padStart(2, '0')}`;
                  const hasInterview = interviewDates.includes(dateString);
                  return (
                    <div 
                      key={index} 
                      className={`border rounded p-2 h-24 ${hasInterview ? 'bg-blue-50' : ''}`}
                    >
                      <div className="text-sm font-medium">
                        {day.day} {day.date}
                      </div>
                      {hasInterview && (
                        <div className="mt-1 text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5">
                          Interview
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewDashboard;