
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Briefcase, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ApplicationStatusProps {
  onBack: () => void;
}

const ApplicationStatus = ({ onBack }: ApplicationStatusProps) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const jobApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    const scheduledInterviews = JSON.parse(localStorage.getItem("scheduledInterviews") || "[]");
    
    setApplications(jobApplications);
    setInterviews(scheduledInterviews);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Applied":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4 text-yellow-500" />;
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Interview Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const userApplications = applications.filter(app => app.userId === currentUser?.id);
  const userInterviews = interviews.filter(interview => interview.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{userApplications.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviews Scheduled</p>
                  <p className="text-2xl font-bold">{userInterviews.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {userApplications.filter(app => app.status === "Applied").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {userApplications.length > 0 
                      ? Math.round((userApplications.filter(app => app.status === "Accepted").length / userApplications.length) * 100)
                      : 0}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
            {userApplications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No job applications yet. Start applying to jobs!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{application.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          ID: {application.jobId}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Interviews List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Scheduled Interviews</h2>
            {userInterviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No interviews scheduled yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userInterviews.map((interview) => (
                  <Card key={interview.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">Interview with {interview.mentorName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {interview.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {interview.time}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {interview.status}
                        </Badge>
                      </div>
                      {interview.notes && (
                        <p className="text-sm text-gray-600 mt-2">{interview.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
