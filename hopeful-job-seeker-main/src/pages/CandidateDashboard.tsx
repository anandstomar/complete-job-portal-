import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, FileText, Search, MessageSquare, Trophy, LogOut, Briefcase, Calendar, BarChart3 } from "lucide-react";
import ResumeBuilder from "@/components/ResumeBuilder";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import MockTest from "@/components/MockTest";
import InterviewPrep from "@/components/InterviewPrep";
import ProfileEditor from "@/components/ProfileEditor";
import Jobs from "@/components/Jobs";
import InterviewScheduling from "@/components/InterviewScheduling";
import ApplicationStatus from "@/components/ApplicationStatus";
import { listApplications, listInterviews, listMyTests } from "../lib/api";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);

    // Fetch applications and interviews from backend
    listApplications(parsedUser._id).then(res => setApplications(res.data)).catch(() => setApplications([]));
    listInterviews(parsedUser._id).then(res => setInterviews(res.data)).catch(() => setInterviews([]));
    listMyTests(parsedUser._id).then(res => setTestResults(res.data)).catch(() => setTestResults([]));

    // Listen for custom events from header navigation
    const handleOpenJobs = () => setActiveFeature("Jobs");
    const handleOpenApplicationStatus = () => setActiveFeature("Application Status");
    
    window.addEventListener('openJobs', handleOpenJobs);
    window.addEventListener('openApplicationStatus', handleOpenApplicationStatus);
    
    return () => {
      window.removeEventListener('openJobs', handleOpenJobs);
      window.removeEventListener('openApplicationStatus', handleOpenApplicationStatus);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleFeatureClick = (featureName: string) => {
    setActiveFeature(featureName);
  };

  const handleBackToDashboard = () => {
    setActiveFeature(null);
  };

  // Check user qualifications
  const hasResume = () => {
    return localStorage.getItem("userResume") !== null;
  };

  const hasCoverLetter = () => {
    const coverLetters = JSON.parse(localStorage.getItem("userCoverLetters") || "[]");
    return coverLetters.length > 0;
  };

  const hasPassedTest = () => {
    if (!testResults || testResults.length === 0) return false;
    // Find the highest percentage score from completed tests
    const completed = testResults.filter((t: any) => t.status === "Completed" && typeof t.score === "number" && t.test && t.test.questions && t.test.questions.length > 0);
    if (completed.length === 0) return false;
    const highest = Math.max(...completed.map((t: any) => (t.score / t.test.questions.length) * 100));
    return highest >= 75;
  };

  const getTestScore = () => {
    if (!testResults || testResults.length === 0) return 0;
    const completed = testResults.filter((t: any) => t.status === "Completed" && typeof t.score === "number" && t.test && t.test.questions && t.test.questions.length > 0);
    if (completed.length === 0) return 0;
    return Math.round(Math.max(...completed.map((t: any) => (t.score / t.test.questions.length) * 100)));
  };

  const refreshDashboardData = () => {
    if (!currentUser) return;
    listApplications(currentUser._id).then(res => setApplications(res.data)).catch(() => setApplications([]));
    listInterviews(currentUser._id).then(res => setInterviews(res.data)).catch(() => setInterviews([]));
    listMyTests(currentUser._id).then(res => setTestResults(res.data)).catch(() => setTestResults([]));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Render active feature component
  if (activeFeature === "Resume Builder") {
    return <ResumeBuilder onBack={handleBackToDashboard} />;
  }
  
  if (activeFeature === "Cover Letter Generator") {
    return <CoverLetterGenerator onBack={handleBackToDashboard} />;
  }
  
  if (activeFeature === "Mock Test") {
    return <MockTest onBack={() => { handleBackToDashboard(); refreshDashboardData(); }} candidateId={currentUser._id} />;
  }
  
  if (activeFeature === "Interview Prep") {
    return <InterviewPrep onBack={handleBackToDashboard} />;
  }

  if (activeFeature === "Profile") {
    return <ProfileEditor onBack={handleBackToDashboard} />;
  }

  if (activeFeature === "Jobs") {
    return <Jobs onBack={handleBackToDashboard} />;
  }

  if (activeFeature === "Interview Scheduling") {
    return <InterviewScheduling onBack={handleBackToDashboard} />;
  }

  if (activeFeature === "Application Status") {
    return <ApplicationStatus onBack={handleBackToDashboard} />;
  }

  // Dynamic features based on user progress
  const getAvailableFeatures = () => {
    const baseFeatures = [];

    // Always show Mock Test
    baseFeatures.push({
      icon: Trophy,
      title: "Mock Test",
      description: "Test your knowledge with practice questions",
      status: "Available"
    });

    // Show Resume Builder only if no resume exists
    if (!hasResume()) {
      baseFeatures.push({
        icon: FileText,
        title: "Resume Builder",
        description: "Create professional resumes with AI assistance",
        status: "Available"
      });
    }

    // Show Cover Letter Generator only if no cover letter exists
    if (!hasCoverLetter()) {
      baseFeatures.push({
        icon: MessageSquare,
        title: "Cover Letter Generator",
        description: "Generate personalized cover letters",
        status: "Available"
      });
    }

    // Show advanced features only if test passed with 75%+
    if (hasPassedTest()) {
      baseFeatures.push(
        {
          icon: Briefcase,
          title: "Jobs",
          description: "Browse and apply to job opportunities",
          status: "Available"
        },
        {
          icon: Search,
          title: "Interview Prep",
          description: "Practice with AI-generated interview questions",
          status: "Available"
        },
        {
          icon: Calendar,
          title: "Interview Scheduling",
          description: "Schedule interviews with mentors",
          status: "Available"
        }
      );
    } else {
      // Show locked features with different status
      baseFeatures.push(
        {
          icon: Briefcase,
          title: "Jobs",
          description: "Browse and apply to job opportunities",
          status: "Requires 75% test score"
        },
        {
          icon: Search,
          title: "Interview Prep", 
          description: "Practice with AI-generated interview questions",
          status: "Requires 75% test score"
        },
        {
          icon: Calendar,
          title: "Interview Scheduling",
          description: "Schedule interviews with mentors",
          status: "Requires 75% test score"
        }
      );
    }

    return baseFeatures;
  };

  const features = getAvailableFeatures();

  // Get application and interview counts
  const userApplications = applications;
  const userInterviews = interviews;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Candidate Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => handleFeatureClick("Profile")}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:block">{currentUser.fullName}</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleFeatureClick("Application Status")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:block">Status</span>
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
            Welcome back, {currentUser.fullName}! 👋
          </h2>
          <p className="text-gray-600">
            {hasPassedTest() 
              ? "Congratulations! You're qualified to apply for jobs and schedule interviews." 
              : "Complete a mock test with 75% score to unlock job applications and interviews."
            }
          </p>
        </div>

        {/* Progress Alert */}
        {!hasPassedTest() && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-medium text-amber-900">Complete Your Profile</h3>
                <p className="text-sm text-amber-700">
                  Take a mock test and score 75% or higher to unlock job applications and interview features.
                  {getTestScore() > 0 && ` Your current best score: ${getTestScore()}%`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resumes Created</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasResume() ? "1" : "0"}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Job Applications</p>
                <p className="text-2xl font-bold text-gray-900">{userApplications.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{userInterviews.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Best Test Score</p>
                <p className="text-2xl font-bold text-gray-900">{getTestScore()}%</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const isLocked = feature.status.includes("Requires");
            const isResumeBuilder = feature.title === "Resume Builder";
            return (
              <div key={index} className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${isLocked ? 'opacity-75' : ''}`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${isLocked ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <feature.icon className={`w-6 h-6 ${isLocked ? 'text-gray-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isLocked 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {feature.status}
                      </span>
                      {isResumeBuilder && !isLocked ? (
                        <a
                          href="http://localhost:5173/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 text-white rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                          Start Now
                        </a>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleFeatureClick(feature.title)}
                          disabled={isLocked}
                          className={isLocked ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600'}
                        >
                          {isLocked ? 'Locked' : 'Start Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
