
import { Button } from "@/components/ui/button";
import { User, LogIn, Briefcase, Calendar, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  const handleDashboard = () => {
    if (currentUser?.userType === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JP</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JobPortal AI
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {currentUser && currentUser.userType !== "admin" && (
            <>
              <button 
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <User size={16} />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => {
                  navigate("/dashboard");
                  // This will trigger the Jobs feature
                  setTimeout(() => {
                    const event = new CustomEvent('openJobs');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <Briefcase size={16} />
                <span>Jobs</span>
              </button>
              <button 
                onClick={() => {
                  navigate("/dashboard");
                  // This will trigger the Application Status feature
                  setTimeout(() => {
                    const event = new CustomEvent('openApplicationStatus');
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <BarChart3 size={16} />
                <span>Status</span>
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {currentUser.fullName}
              </span>
              <Button variant="outline" onClick={handleDashboard} className="flex items-center space-x-2">
                <User size={16} />
                <span>{currentUser.userType === "admin" ? "Admin Panel" : "Dashboard"}</span>
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-600">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
