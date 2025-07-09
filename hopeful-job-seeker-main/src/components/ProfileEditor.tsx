
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Camera, Edit, FileText, Eye } from "lucide-react";

interface ProfileEditorProps {
  onBack: () => void;
}

const ProfileEditor = ({ onBack }: ProfileEditorProps) => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showResumeTemplates, setShowResumeTemplates] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    experience: "",
    profilePicture: ""
  });

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      // Load saved profile data or use default values
      const savedProfile = localStorage.getItem(`profile_${userData.email}`);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      } else {
        setProfileData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: "",
          location: "",
          bio: "",
          skills: "",
          experience: "",
          profilePicture: ""
        });
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (currentUser) {
      localStorage.setItem(`profile_${currentUser.email}`, JSON.stringify(profileData));
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully."
      });
      setIsEditing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const hasResume = () => {
    return localStorage.getItem("userResume") !== null;
  };

  const openResumeBuilder = () => {
    // This would typically navigate to resume builder with edit mode
    toast({
      title: "Resume Builder",
      description: "Opening resume builder for editing..."
    });
  };

  const resumeTemplates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and modern design for corporate roles",
      preview: "/api/placeholder/200/250"
    },
    {
      id: 2,
      name: "Creative",
      description: "Eye-catching design for creative industries",
      preview: "/api/placeholder/200/250"
    },
    {
      id: 3,
      name: "Minimal",
      description: "Simple and elegant layout",
      preview: "/api/placeholder/200/250"
    },
    {
      id: 4,
      name: "Technical",
      description: "Perfect for IT and engineering roles",
      preview: "/api/placeholder/200/250"
    }
  ];

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
        <Button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="p-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {profileData.fullName.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <p className="text-sm text-gray-500">
                Account Type: <span className="capitalize">{currentUser.userType}</span>
              </p>
            </div>
          </div>

          {/* Resume Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Resume Management</h3>
              </div>
              <div className="flex space-x-2">
                {hasResume() && (
                  <Button variant="outline" size="sm" onClick={openResumeBuilder}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowResumeTemplates(!showResumeTemplates)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showResumeTemplates ? 'Hide' : 'View'} Templates
                </Button>
              </div>
            </div>
            
            {hasResume() ? (
              <p className="text-green-600 text-sm">✓ Resume created and saved</p>
            ) : (
              <p className="text-amber-600 text-sm">⚠ No resume created yet</p>
            )}

            {/* Resume Templates */}
            {showResumeTemplates && (
              <div className="mt-4">
                <h4 className="font-medium mb-3">Available Resume Templates</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {resumeTemplates.map((template) => (
                    <div key={template.id} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="bg-gray-200 h-32 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Template Preview</span>
                      </div>
                      <h5 className="font-medium text-sm">{template.name}</h5>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        Use Template
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled={true}
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your location"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={profileData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                disabled={!isEditing}
                placeholder="List your skills (e.g., JavaScript, React, Python)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Textarea
                id="experience"
                value={profileData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your experience level and background"
                rows={3}
              />
            </div>
          </div>

          {/* Profile Stats */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Profile Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {hasResume() ? "1" : "0"}
                </p>
                <p className="text-sm text-gray-600">Resumes Created</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {JSON.parse(localStorage.getItem("testResults") || "[]").length}
                </p>
                <p className="text-sm text-gray-600">Tests Taken</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {JSON.parse(localStorage.getItem("userCoverLetters") || "[]").length}
                </p>
                <p className="text-sm text-gray-600">Cover Letters</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {hasResume() ? "75%" : "25%"}
                </p>
                <p className="text-sm text-gray-600">Profile Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
