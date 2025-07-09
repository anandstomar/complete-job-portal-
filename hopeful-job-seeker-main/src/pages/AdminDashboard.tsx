import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Briefcase, BarChart3, LogOut, Shield, Calendar, MessageSquare, User } from "lucide-react";
import TestGenerator from "../components/TestGenerator";
import AdminProfile from "../components/AdminProfile";

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setCurrentUser(userData);

    // Load data
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const jobApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    const scheduledInterviews = JSON.parse(localStorage.getItem("scheduledInterviews") || "[]");
    
    setUsers(storedUsers);
    setApplications(jobApplications);
    setInterviews(scheduledInterviews);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleAssignMentor = (interviewId: string, mentorName: string) => {
    const updatedInterviews = interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, assignedMentor: mentorName, status: "Mentor Assigned" }
        : interview
    );
    setInterviews(updatedInterviews);
    localStorage.setItem("scheduledInterviews", JSON.stringify(updatedInterviews));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (activeFeature === "testGenerator") {
    return <TestGenerator onBack={() => setActiveFeature(null)} />;
  }

  if (activeFeature === "adminProfile") {
    return <AdminProfile onBack={() => setActiveFeature(null)} />;
  }

  const adminFeatures = [
    {
      icon: Users,
      title: "User Management",
      description: "View and manage all registered users",
      count: users.length,
      status: "Active",
      action: () => navigate("/user-management"),//action: () => {}
    },
    {
      icon: Briefcase,
      title: "Job Applications",
      description: "Monitor job applications and their status",
      count: applications.length,
      status: "Active",
      action: () => navigate("/job-application"),//action: () => {}
    },
    {
      icon: Calendar,
      title: "Interview Management",
      description: "Manage interview schedules and mentor assignments",
      count: interviews.length,
      status: "Active",
      action: () => navigate("/interview-dashboard"),// action: () => {}
    },
    {
      icon: FileText,
      title: "Test Generator",
      description: "Create and manage tests for candidates",
      count: JSON.parse(localStorage.getItem("adminTests") || "[]").length,
      status: "Active",
      action: () => setActiveFeature("testGenerator")
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View platform statistics and reports",
      count: 0,
      status: "Coming Soon",
      action: () => {}
    }
  ];

  const statusCounts = {
    New: applications.filter(app => app.status === "New").length,
    Reviewed: applications.filter(app => app.status === "Reviewed").length,
    Interview: applications.filter(app => app.status === "Interview").length,
    Hired: applications.filter(app => app.status === "Hired").length,
    Rejected: applications.filter(app => app.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">{currentUser.fullName}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveFeature("adminProfile")}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Control Panel 🛡️
          </h2>
          <p className="text-gray-600">Manage the JobPortal AI platform and users</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Job Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === "Applied").length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {adminFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feature.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {feature.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Count: {feature.count}</span>
                      <Button 
                        size="sm" 
                        disabled={feature.status !== "Active"}
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                        onClick={feature.action}
                      >
                        {feature.status === "Active" ? "Manage" : "Coming Soon"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Job Applications</h3>
            </div>
            <div className="p-6">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{application.userName}</p>
                          <p className="text-sm text-gray-500">{application.jobTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">{application.status}</Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interview Management */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Interview Management</h3>
            </div>
            <div className="p-6">
              {interviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No interviews scheduled</p>
              ) : (
                <div className="space-y-4">
                  {interviews.slice(0, 5).map((interview, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{interview.userName}</p>
                          <p className="text-sm text-gray-500">with {interview.mentorName}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{interview.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>📅 {interview.date} at {interview.time}</p>
                        {interview.notes && <p className="mt-1">📝 {interview.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        {users.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 capitalize">{user.userType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
